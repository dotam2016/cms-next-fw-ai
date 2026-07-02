export interface NewsOut {
  id: number
  source_id: number | null
  title: string
  description: string | null
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
  description: string
  content_html?: string | null
}

export interface NewsListItem {
  id: number
  source_id: number | null
  title: string
  description: string | null
  url: string | null
  published_at: string | null
  view_count: number
  is_trending: boolean
  crawled_at: string
}

export interface PaginatedNews {
  total: number
  page: number
  page_size: number
  items: NewsListItem[]
}

export interface ListNewsParams {
  q?: string
  date_from?: string
  date_to?: string
  page?: number
  page_size?: number
}

export interface UpdateNewsPayload {
  title?: string
  description?: string
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

export async function listNews(params: ListNewsParams = {}): Promise<PaginatedNews> {
  const query = new URLSearchParams()
  if (params.q) query.set('q', params.q)
  if (params.date_from) query.set('date_from', params.date_from)
  if (params.date_to) query.set('date_to', params.date_to)
  if (params.page) query.set('page', String(params.page))
  if (params.page_size) query.set('page_size', String(params.page_size))

  const queryString = query.toString()
  const response = await fetch(`${API_BASE_URL}/news${queryString ? `?${queryString}` : ''}`)

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export async function getNews(id: number): Promise<NewsOut> {
  const response = await fetch(`${API_BASE_URL}/news/${id}`)

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export async function updateNews(id: number, payload: UpdateNewsPayload): Promise<NewsOut> {
  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}

export async function deleteNews(id: number): Promise<NewsOut> {
  const response = await fetch(`${API_BASE_URL}/news/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json()
}
