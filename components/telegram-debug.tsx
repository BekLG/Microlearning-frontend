"use client"

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"

type DebugState = {
  ts: string
  href: string
  ua: string
  telegram: boolean
  webapp: boolean
  platform: string | null
  version: string | null
  initDataLen: number | null
  initDataPrefix: string | null
  hasTgParams: boolean
}

function getDebugState(): DebugState {
  const tg = window.Telegram
  const wa = tg?.WebApp
  const initData = wa?.initData

  return {
    ts: new Date().toISOString(),
    href: window.location.href,
    ua: navigator.userAgent,
    telegram: Boolean(tg),
    webapp: Boolean(wa),
    platform: wa?.platform ?? null,
    version: wa?.version ?? null,
    initDataLen: typeof initData === "string" ? initData.length : null,
    initDataPrefix: typeof initData === "string" && initData.length > 0 ? initData.slice(0, 80) : null,
    hasTgParams: /tgWebApp/i.test(window.location.href),
  }
}

export function TelegramDebug() {
  const enabled = useMemo(() => {
    try {
      return new URLSearchParams(window.location.search).get("debug") === "1"
    } catch {
      return false
    }
  }, [])

  const [state, setState] = useState<DebugState | null>(null)
  const [snapshots, setSnapshots] = useState<DebugState[]>([])

  useEffect(() => {
    if (!enabled) return

    const wa = window.Telegram?.WebApp
    wa?.ready?.()
    wa?.expand?.()

    let stopped = false
    const start = Date.now()
    const maxMs = 2000
    const tickMs = 100

    const tick = () => {
      if (stopped) return
      const next = getDebugState()
      setState(next)
      setSnapshots((prev) => {
        const updated = [...prev, next]
        return updated.length > 30 ? updated.slice(updated.length - 30) : updated
      })

      const initLen = next.initDataLen ?? 0
      if (initLen > 0) return
      if (Date.now() - start > maxMs) return
      window.setTimeout(tick, tickMs)
    }

    tick()
    return () => {
      stopped = true
    }
  }, [enabled])

  if (!enabled) return null
  if (!state) return null

  return (
    <div
      className={cn(
        "fixed left-2 right-2 bottom-2 z-[100] rounded-xl border bg-background/95 backdrop-blur p-3 text-xs",
        "max-h-[45vh] overflow-auto"
      )}
    >
      <div className="font-semibold">Telegram Debug (remove ?debug=1 when done)</div>
      <pre className="mt-2 whitespace-pre-wrap break-words leading-snug">
        {JSON.stringify(state, null, 2)}
      </pre>
      <details className="mt-2">
        <summary className="cursor-pointer select-none">Snapshots ({snapshots.length})</summary>
        <pre className="mt-2 whitespace-pre-wrap break-words leading-snug">
          {JSON.stringify(snapshots, null, 2)}
        </pre>
      </details>
    </div>
  )
}
