"use client"

import { useState } from "react"
import { TextCard } from "./text-card"
import { QuizCard } from "./quiz-card"
import { LandingHeroCard, LandingQuizCard, LandingActionsCard, LandingCtaCard } from "./landing-card"
import { UploadButton } from "./upload-button"
import { ThemeToggle } from "./theme-toggle"
import { ApiError, getDocumentStatus, getLessons, uploadDocument, type LessonItem } from "@/lib/api"
import { clearAuthStorage, useTelegramAuth } from "@/hooks/use-telegram-auth"
import { toast } from "@/hooks/use-toast"

type TextPost = {
  type: "text"
  id: string
  content: string
}

type QuizPost = {
  type: "quiz"
  id: string
  question: string
  options: { id: string; text: string; isCorrect: boolean }[]
  explanation: string
}

type FeedItem = TextPost | QuizPost

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function lessonsToFeedItems(lessons: LessonItem[], baseId: string): FeedItem[] {
  return lessons.flatMap((lesson, i) => {
    const id = `${baseId}-${i}`
    if (lesson.type === "fact") {
      return [{ type: "text" as const, id, content: lesson.text }]
    }

    const options = lesson.options.map((text, idx) => {
      const oid = String.fromCharCode("a".charCodeAt(0) + idx)
      return { id: oid, text, isCorrect: text === lesson.answer }
    })
    return [
      {
        type: "quiz" as const,
        id,
        question: lesson.question,
        options,
        explanation: lesson.explanation,
      },
    ]
  })
}

async function pollUntilComplete(documentId: string, token: string) {
  const start = Date.now()
  const maxMs = 3 * 60 * 1000
  const delays = [2000, 3000, 5000]
  let attempt = 0

  // Backend may return pending/processing/completed; treat unknown as still-in-progress.
  while (true) {
    if (Date.now() - start > maxMs) throw new Error("Timed out waiting for processing")

    const { status } = await getDocumentStatus(documentId, token)
    if (status === "completed") return
    if (status === "failed") throw new Error("Document processing failed")

    const delay = delays[Math.min(attempt, delays.length - 1)]
    attempt += 1
    await sleep(delay)
  }
}

export function Feed() {
  const [userContent, setUserContent] = useState<FeedItem[]>([])
  const hasUserContent = userContent.length > 0

  const { token, isReady, error } = useTelegramAuth()

  const handleUpload = async (files: FileList) => {
    if (!isReady) {
      toast({ title: "Please wait", description: "Authenticating with Telegram…" })
      return
    }
    if (error) {
      toast({ title: "Auth error", description: error })
      return
    }
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Missing Telegram initData. Set NEXT_PUBLIC_DEV_TELEGRAM_INIT_DATA for local dev.",
      })
      return
    }

    // Sequential upload keeps state updates simple and predictable.
    for (const [fileIndex, file] of Array.from(files).entries()) {
      const baseId = `doc-${Date.now()}-${fileIndex}`
      const placeholderId = `${baseId}-placeholder`

      setUserContent((prev) => [
        ...prev,
        {
          type: "text" as const,
          id: placeholderId,
          content: `Uploading "${file.name}"…`,
        },
      ])

      try {
        const uploaded = await uploadDocument(file, token)
        setUserContent((prev) =>
          prev.map((it) =>
            it.id === placeholderId
              ? {
                  type: "text" as const,
                  id: placeholderId,
                  content: `Processing "${file.name}"…`,
                }
              : it
          )
        )

        await pollUntilComplete(uploaded.document_id, token)
        const lessons = await getLessons(uploaded.document_id, token)
        const items = lessonsToFeedItems(lessons, baseId)

        setUserContent((prev) => {
          const next = prev.filter((it) => it.id !== placeholderId)
          return [...next, ...items]
        })
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) {
          clearAuthStorage()
          toast({ title: "Session expired", description: "Please reload to re-authenticate." })
        } else {
          toast({
            title: "Upload failed",
            description: e instanceof Error ? e.message : "Unexpected error",
          })
        }

        setUserContent((prev) =>
          prev.map((it) =>
            it.id === placeholderId
              ? {
                  type: "text" as const,
                  id: placeholderId,
                  content: `Failed to process "${file.name}".`,
                }
              : it
          )
        )
      }
    }
  }

  return (
    <main className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {hasUserContent ? (
        userContent.map((item) => {
          if (item.type === "text") {
            return <TextCard key={item.id} id={item.id} content={item.content} />
          }
          return (
            <QuizCard
              key={item.id}
              id={item.id}
              question={item.question}
              options={item.options}
              explanation={item.explanation}
            />
          )
        })
      ) : (
        <>
          <LandingHeroCard />
          <LandingQuizCard />
          <LandingActionsCard />
          <LandingCtaCard />
        </>
      )}

      <UploadButton onUpload={handleUpload} />
      <ThemeToggle />
    </main>
  )
}
