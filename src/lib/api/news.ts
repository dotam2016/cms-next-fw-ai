export interface NewsOut {
  id: number
  source_id: number | null
  title: string
  url: string | null
  content_html: string | null
  published_at: string | null
  view_count: number
  is_deleted: boolean
  deleted_at: string | null
  crawled_at: string
  updated_at: string
}

export interface CreateNewsPayload {
  title: string
  content_html?: string | null
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json()
    if (response.status === 422 && Array.isArray(body?.detail)) {
      return body.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join(', ')
    }
    if (typeof body?.detail === 'string') {
      return body.detail
    }
  } catch {
    // response body wasn't JSON; fall through to the generic message
  }
  return `요청이 실패했습니다. (${response.status})`
}

export async function createNews(payload: CreateNewsPayload): Promise<NewsOut> {
  const response = await fetch(`${API_BASE_URL}/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}
