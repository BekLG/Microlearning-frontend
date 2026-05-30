"use client"

import { useEffect, useState } from "react"
import { ApiError, authTelegram, type TelegramAuthResponse } from "@/lib/api"

const TOKEN_KEY = "microlearn:access_token"
const USER_KEY = "microlearn:user"

function getInitData() {
  const telegramInitData = window.Telegram?.WebApp?.initData
  if (telegramInitData && telegramInitData.length > 0) return telegramInitData

  const devInitData = process.env.NEXT_PUBLIC_DEV_TELEGRAM_INIT_DATA
  if (devInitData && devInitData.length > 0) return devInitData

  return null
}

export function clearAuthStorage() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function useTelegramAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<TelegramAuthResponse["user"] | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setError(null)

      const existingToken = localStorage.getItem(TOKEN_KEY)
      const existingUser = localStorage.getItem(USER_KEY)
      if (existingToken) {
        if (!cancelled) {
          setToken(existingToken)
          if (existingUser) {
            try {
              setUser(JSON.parse(existingUser))
            } catch {
              // ignore
            }
          }
          setIsReady(true)
        }
        return
      }

      const initData = getInitData()
      if (!initData) {
        if (!cancelled) {
          setError(
            "Missing Telegram initData. Open inside Telegram, or set NEXT_PUBLIC_DEV_TELEGRAM_INIT_DATA for local dev."
          )
          setIsReady(true)
        }
        return
      }

      try {
        const data = await authTelegram(initData)
        if (cancelled) return
        localStorage.setItem(TOKEN_KEY, data.access_token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setToken(data.access_token)
        setUser(data.user)
        setIsReady(true)
      } catch (e) {
        if (cancelled) return
        if (e instanceof ApiError) {
          setError(e.detail)
        } else {
          setError("Authentication failed")
        }
        setIsReady(true)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [])

  return {
    token,
    user,
    isReady,
    error,
    setToken: (next: string | null) => {
      if (next) localStorage.setItem(TOKEN_KEY, next)
      else localStorage.removeItem(TOKEN_KEY)
      setToken(next)
    },
  }
}
