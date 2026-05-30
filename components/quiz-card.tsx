"use client"

import { useState } from "react"
import { Bookmark, Repeat2, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QuizOption {
  id: string
  text: string
  isCorrect: boolean
}

interface QuizCardProps {
  id: string
  question: string
  options: QuizOption[]
  explanation: string
  initialBookmarked?: boolean
  initialRepeated?: boolean
}

export function QuizCard({
  question,
  options,
  explanation,
  initialBookmarked = false,
  initialRepeated = false,
}: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isRepeated, setIsRepeated] = useState(initialRepeated)

  const answered = selected !== null
  const selectedOption = options.find((o) => o.id === selected)
  const isCorrect = selectedOption?.isCorrect ?? false

  const handleSelect = (id: string) => {
    if (!answered) setSelected(id)
  }

  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col justify-center px-6 relative overflow-hidden">
      <div className="max-w-lg mx-auto w-full pr-16 gap-4 flex flex-col">
          {/* Question label */}
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Question
          </span>

          {/* Question text */}
          <p className="text-lg md:text-xl font-semibold leading-snug text-foreground text-balance">
            {question}
          </p>

          {/* Options */}
          <div className="flex flex-col gap-2">
            {options.map((option) => {
              const isSelected = selected === option.id
              const showResult = answered

              let state: "default" | "correct" | "wrong" | "missed" = "default"
              if (showResult) {
                if (option.isCorrect) state = "correct"
                else if (isSelected && !option.isCorrect) state = "wrong"
              }
              if (!showResult && isSelected) state = "correct" // highlight while selecting

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={answered}
                  className={cn(
                    "w-full text-left px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    !answered && "hover:border-primary/50 hover:bg-secondary/60 active:scale-[0.98]",
                    // default idle
                    !answered && !isSelected && "border-border bg-secondary/30 text-foreground/80",
                    // selected before reveal
                    !answered && isSelected && "border-primary bg-primary/15 text-foreground",
                    // after answer: correct
                    answered && option.isCorrect && "border-primary bg-primary/20 text-primary",
                    // after answer: wrong pick
                    answered && isSelected && !option.isCorrect && "border-destructive bg-destructive/15 text-destructive",
                    // after answer: unchosen wrong
                    answered && !isSelected && !option.isCorrect && "border-border/40 bg-transparent text-foreground/40",
                  )}
                >
                  <span className="flex items-center gap-3">
                    {answered && option.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-primary" />
                    )}
                    {answered && isSelected && !option.isCorrect && (
                      <XCircle className="w-4 h-4 shrink-0 text-destructive" />
                    )}
                    {(!answered || (!option.isCorrect && !isSelected)) && (
                      <span className={cn(
                        "w-5 h-5 shrink-0 rounded-full border text-xs flex items-center justify-center font-bold",
                        answered && !option.isCorrect && !isSelected
                          ? "border-border/40 text-foreground/40"
                          : "border-muted-foreground/50 text-muted-foreground"
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

          {/* Explanation */}
          {answered && (
            <div className={cn(
              "rounded-xl px-4 py-2 border text-xs leading-snug animate-in fade-in slide-in-from-bottom-4 duration-400",
              isCorrect
                ? "border-primary/30 bg-primary/10 text-foreground/90"
                : "border-destructive/30 bg-destructive/10 text-foreground/90"
            )}>
              <span className={cn(
                "font-semibold mr-1",
                isCorrect ? "text-primary" : "text-destructive"
              )}>
                {isCorrect ? "Correct!" : "Not quite."}
              </span>
              {explanation}
            </div>
          )}
      </div>

      {/* Action Buttons - Right Side */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6">
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
            isBookmarked ? "text-primary" : "text-foreground/70 hover:text-foreground"
          )}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isBookmarked ? "bg-primary/20" : "bg-secondary"
          )}>
            <Bookmark className={cn("w-6 h-6", isBookmarked && "fill-primary")} />
          </div>
          <span className="text-xs font-medium">Save</span>
        </button>

        <button
          onClick={() => setIsRepeated(!isRepeated)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-200 active:scale-90",
            isRepeated ? "text-accent" : "text-foreground/70 hover:text-foreground"
          )}
          aria-label={isRepeated ? "Remove repeat" : "Repeat content"}
        >
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
            isRepeated ? "bg-accent/20" : "bg-secondary"
          )}>
            <Repeat2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium">Repeat</span>
        </button>
      </div>
    </div>
  )
}
