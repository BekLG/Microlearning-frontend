export const DEFAULT_API_BASE_URL = "http://localhost:8000"

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data = await res.json()
    if (data && typeof data.detail === "string") return data.detail
    return res.statusText || "Request failed"
  } catch {
    return res.statusText || "Request failed"
  }
}

type ApiOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>
  token?: string | null
}

export class ApiError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.status = status
    this.detail = detail
  }
}

async function apiFetch(path: string, options: ApiOptions = {}) {
  const url = `${getBaseUrl()}${path}`
  const headers: Record<string, string> = { ...(options.headers ?? {}) }

  if (options.token) headers.Authorization = `Bearer ${options.token}`

  // Only set Content-Type for non-FormData bodies.
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const detail = await readErrorDetail(res)
    throw new ApiError(res.status, detail)
  }

  return res
}

export type TelegramAuthResponse = {
  access_token: string
  token_type: "bearer" | string
  user: {
    id: string
    telegram_id: number
    username: string | null
    first_name: string | null
    last_name: string | null
    photo_url: string | null
  }
}

export async function authTelegram(initData: string): Promise<TelegramAuthResponse> {
  const res = await apiFetch("/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ init_data: initData }),
  })
  return res.json()
}

export type UploadDocumentResponse = {
  document_id: string
  status: string
}

export async function uploadDocument(file: File, token: string): Promise<UploadDocumentResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const res = await apiFetch("/documents", {
    method: "POST",
    body: formData,
    token,
  })
  return res.json()
}

export type DocumentStatusResponse = {
  status: "pending" | "processing" | "completed" | "failed" | string
}

export async function getDocumentStatus(documentId: string, token: string): Promise<DocumentStatusResponse> {
  const res = await apiFetch(`/documents/${documentId}/status`, { token })
  return res.json()
}

export type LessonFact = { type: "fact"; text: string }
export type LessonMcq = {
  type: "mcq"
  question: string
  options: string[]
  answer: string
  explanation: string
}
export type LessonItem = LessonFact | LessonMcq

export async function getLessons(documentId: string, token: string): Promise<LessonItem[]> {
  const res = await apiFetch(`/documents/${documentId}/lessons`, { token })
  return res.json()
}
