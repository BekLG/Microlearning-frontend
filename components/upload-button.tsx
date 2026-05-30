"use client"

import { useRef, useState } from "react"
import { Plus, X, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

interface UploadButtonProps {
  onUpload?: (files: FileList) => void
}

export function UploadButton({ onUpload }: UploadButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFiles = (files: FileList) => {
    const allowed = new Set(["pdf", "pptx", "docx"])
    const invalid = Array.from(files).filter((f) => {
      const ext = f.name.split(".").pop()?.toLowerCase()
      return !ext || !allowed.has(ext)
    })
    if (invalid.length > 0) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a .pdf, .pptx, or .docx file.",
      })
      return false
    }
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!validateFiles(e.target.files)) return
      onUpload?.(e.target.files)
      setIsOpen(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (!validateFiles(e.dataTransfer.files)) return
      onUpload?.(e.dataTransfer.files)
      setIsOpen(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <>
      {/* Floating Upload Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
          "w-14 h-14 rounded-full bg-primary text-primary-foreground",
          "flex items-center justify-center shadow-lg shadow-primary/30",
          "transition-all duration-200 hover:scale-105 active:scale-95",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
        )}
        aria-label="Upload content"
      >
        <Plus className="w-7 h-7" strokeWidth={2.5} />
      </button>

      {/* Upload Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg mx-4 mb-8 bg-card rounded-2xl p-6 shadow-xl border border-border animate-in slide-in-from-bottom-10 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Upload Content</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              )}
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">Drop your files here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.pptx,.docx"
                  multiple
                  onChange={handleFileChange}
                />
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Supports .pdf, .pptx, .docx files
            </p>
          </div>
        </div>
      )}
    </>
  )
}
