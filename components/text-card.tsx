"use client"

import { useState } from "react"
import { Bookmark, Repeat2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TextCardProps {
  id: string
  content: string
  initialBookmarked?: boolean
  initialRepeated?: boolean
}

export function TextCard({
  content,
  initialBookmarked = false,
  initialRepeated = false,
}: TextCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isRepeated, setIsRepeated] = useState(initialRepeated)

  return (
    <div className="h-screen w-full snap-start snap-always flex flex-col justify-center px-6 relative">
      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full pr-16">
        <p className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground text-balance">
          {content}
        </p>
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
