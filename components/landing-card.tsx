"use client"

import { useState } from "react"
import { Bookmark, Repeat2, CheckCircle2, XCircle, BookOpen, Zap, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

// --- Hero card ---
export function LandingHeroCard() {
  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col items-center justify-center px-6 relative gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">StudyTok</h1>
        <p className="text-muted-foreground text-base leading-relaxed text-balance max-w-xs">
          Turn any study material into a scroll-friendly learning feed — bite-sized cards, quizzes, and smart repetition.
        </p>
      </div>

      {/* Decorative mini card stack */}
      <div className="relative w-64 h-28 mt-2">
        <div className="absolute inset-0 rounded-2xl border border-border bg-card rotate-3 opacity-40" />
        <div className="absolute inset-0 rounded-2xl border border-border bg-card rotate-1 opacity-60" />
        <div className="absolute inset-0 rounded-2xl border border-border bg-card flex items-center justify-center px-5">
          <p className="text-sm text-foreground/80 text-center leading-snug">
            Swipe up to see how it works
          </p>
        </div>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-6 bg-muted-foreground/40 rounded-full" />
      </div>
    </div>
  )
}

// --- Quiz demo card ---
export function LandingQuizCard() {
  const [selected, setSelected] = useState<string | null>(null)
  const answered = selected !== null
  const isCorrect = selected === "b"

  const options = [
    { id: "a", text: "Watch hours of long lectures", isCorrect: false },
    { id: "b", text: "Bite-sized cards + active recall quizzes", isCorrect: true },
    { id: "c", text: "Re-read notes 10 times", isCorrect: false },
    { id: "d", text: "Highlight everything in yellow", isCorrect: false },
  ]

  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col justify-center px-6 relative overflow-hidden">
      <div className="max-w-lg mx-auto w-full pr-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Try it now</span>
          <p className="text-lg font-semibold leading-snug text-foreground text-balance">
            What does science say is the most effective way to study?
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {options.map((option) => {
            const isSelected = selected === option.id
            return (
              <button
                key={option.id}
                onClick={() => !answered && setSelected(option.id)}
                disabled={answered}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  !answered && "hover:border-primary/50 hover:bg-secondary/60 active:scale-[0.98]",
                  !answered && !isSelected && "border-border bg-secondary/30 text-foreground/80",
                  !answered && isSelected && "border-primary bg-primary/15 text-foreground",
                  answered && option.isCorrect && "border-primary bg-primary/20 text-primary",
                  answered && isSelected && !option.isCorrect && "border-destructive bg-destructive/15 text-destructive",
                  answered && !isSelected && !option.isCorrect && "border-border/40 bg-transparent text-foreground/40",
                )}
              >
                <span className="flex items-center gap-3">
                  {answered && option.isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />}
                  {answered && isSelected && !option.isCorrect && <XCircle className="w-4 h-4 shrink-0 text-destructive" />}
                  {(!answered || (!option.isCorrect && !isSelected)) && (
                    <span className={cn(
                      "w-5 h-5 shrink-0 rounded-full border text-xs flex items-center justify-center font-bold",
                      answered && !option.isCorrect && !isSelected ? "border-border/40 text-foreground/40" : "border-muted-foreground/50 text-muted-foreground"
                    )}>
                      {option.id.toUpperCase()}
                    </span>
                  )}
                  {option.text}
                </span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={cn(
            "rounded-xl px-4 py-2 border text-xs leading-snug animate-in fade-in slide-in-from-bottom-4 duration-400",
            isCorrect ? "border-primary/30 bg-primary/10 text-foreground/90" : "border-destructive/30 bg-destructive/10 text-foreground/90"
          )}>
            <span className={cn("font-semibold mr-1", isCorrect ? "text-primary" : "text-destructive")}>
              {isCorrect ? "Correct!" : "Not quite."}
            </span>
            Active recall and spaced repetition are proven by cognitive science to be the most effective study strategies — exactly what StudyTok is built on.
          </div>
        )}

        {!answered && (
          <p className="text-xs text-muted-foreground text-center">Tap an option to answer</p>
        )}
      </div>
    </div>
  )
}

// --- Bookmark & Repeat demo card ---
export function LandingActionsCard() {
  const [bookmarked, setBookmarked] = useState(false)
  const [repeated, setRepeated] = useState(false)

  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col justify-center px-6 relative overflow-hidden">
      <div className="max-w-lg mx-auto w-full pr-16 flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Your tools</span>
          <h2 className="text-2xl font-bold leading-snug text-foreground">Save & Repeat</h2>
        </div>

        {/* Concept card demo */}
        <div className="rounded-2xl border border-border bg-card px-5 py-4 flex flex-col gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Concept</span>
          <p className="text-sm font-medium text-foreground leading-snug">
            Spaced repetition strengthens memory by reviewing material at increasing intervals over time.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3">
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0",
                bookmarked ? "bg-primary/20" : "bg-secondary"
              )}
              aria-label="Bookmark"
            >
              <Bookmark className={cn("w-5 h-5 transition-colors", bookmarked ? "text-primary fill-primary" : "text-foreground/60")} />
            </button>
            <div>
              <p className="text-sm font-semibold text-foreground">Bookmark</p>
              <p className="text-xs text-muted-foreground">
                {bookmarked ? "Saved to your collection" : "Tap to save this concept"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-3">
            <button
              onClick={() => setRepeated(!repeated)}
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0",
                repeated ? "bg-accent/20" : "bg-secondary"
              )}
              aria-label="Repeat"
            >
              <Repeat2 className={cn("w-5 h-5 transition-colors", repeated ? "text-accent" : "text-foreground/60")} />
            </button>
            <div>
              <p className="text-sm font-semibold text-foreground">Repeat</p>
              <p className="text-xs text-muted-foreground">
                {repeated ? "Added to your review queue" : "Tap to add to spaced repetition"}
              </p>
            </div>
          </div>
        </div>

        {bookmarked && repeated && (
          <p className="text-xs text-center text-primary font-medium animate-in fade-in duration-300">
            This card is saved and queued for review.
          </p>
        )}
      </div>

      {/* Live action buttons on the right — same as real cards */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6">
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
            bookmarked ? "text-primary" : "text-foreground/70"
          )}
          aria-label="Bookmark"
        >
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", bookmarked ? "bg-primary/20" : "bg-secondary")}>
            <Bookmark className={cn("w-6 h-6", bookmarked && "fill-primary")} />
          </div>
          <span className="text-xs font-medium">Save</span>
        </button>

        <button
          onClick={() => setRepeated(!repeated)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
            repeated ? "text-accent" : "text-foreground/70"
          )}
          aria-label="Repeat"
        >
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", repeated ? "bg-accent/20" : "bg-secondary")}>
            <Repeat2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Repeat</span>
        </button>
      </div>
    </div>
  )
}

// --- CTA / Upload card ---
export function LandingCtaCard() {
  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col items-center justify-center px-6 relative gap-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
        <Zap className="w-7 h-7 text-accent" />
      </div>

      <div className="flex flex-col gap-3 max-w-xs">
        <h2 className="text-3xl font-bold text-foreground">Ready to start?</h2>
        <p className="text-muted-foreground text-base leading-relaxed text-balance">
          Tap the <span className="font-semibold text-foreground">+</span> button below to upload your notes, PDFs, or study material. Your personalized feed builds instantly.
        </p>
      </div>

      {/* Animated + button hint */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 animate-pulse">
          <span className="text-primary-foreground text-2xl font-light leading-none">+</span>
        </div>
        <span className="text-xs text-muted-foreground">Tap here to upload</span>
      </div>
    </div>
  )
}
