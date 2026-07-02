# Admin Post Create Page — Design

## Goal

Add `/admin/posts/create` so admins can create a news article with two fields:
title (required) and content (optional, rich text via CKEditor 5). The form
must be a reusable component so the future `/admin/posts/[id]/edit` page can
reuse it. Labels are in Korean; required fields get a trailing `*`.

## Backend

FastAPI service at `http://172.16.11.224:8000` (spec: `openapi.json` in repo
root, tag `news`). Endpoint used:

- `POST /news` (`create_news_news_post`)
  - Request (`NewsCreate`): `title: string` (required), `content_html: string | null`
    (optional), `published_at: string(date-time) | null` (optional, unused by
    this form — omitted from the request body).
  - Response 201 (`NewsOut`): includes `id`, `title`, `content_html`,
    `published_at`, `view_count`, timestamps, etc.
  - 422 on validation error (`HTTPValidationError` → `detail[]` with `msg`).

Only the `news`-tag endpoints are in scope; `sources` and `crawl` are ignored.

## Architecture

Split the form (presentation + validation) from the page (data submission),
so `PostForm` can be reused by both create and edit flows without change:

- `PostForm` owns fields, validation, and local submit state. It receives an
  `onSubmit` callback and calls it with validated values; it does not know
  about the network.
- Each page (`create`, future `edit`) owns what happens with valid data —
  which API call to make, how to handle success/error, where to redirect.

## Files

**New:**

- `.env.local` — `NEXT_PUBLIC_API_BASE_URL=http://172.16.11.224:8000`
  (gitignored via existing `.env*` rule).
- `src/lib/validations/post.ts` — Zod schema:
  ```ts
  export const postFormSchema = z.object({
    title: z.string().min(1, '제목을 입력해주세요'),
    content: z.string().optional(),
  })
  export type PostFormValues = z.infer<typeof postFormSchema>
  ```
- `src/lib/api/news.ts` — thin fetch wrapper:
  - `createNews(payload: { title: string; content_html?: string | null }): Promise<NewsOut>`
  - Reads `NEXT_PUBLIC_API_BASE_URL`, POSTs JSON to `/news`.
  - On non-2xx response, parses body (422 → join `detail[].msg`, otherwise
    generic message) and throws an `Error` with a human-readable message for
    the caller to show via toast.
  - Minimal `NewsOut` type declared here for the response shape actually used.
- `src/components/admin/post-form.tsx` — reusable form:
  - Props: `defaultValues?: Partial<PostFormValues>`, `onSubmit: (values: PostFormValues) => Promise<void> | void`, `submitLabel?: string` (default `등록`).
  - `useForm<PostFormValues>({ resolver: zodResolver(postFormSchema), defaultValues })`.
  - Field 1: `제목 *` — `Input` bound via `register('title')`, error message
    below when `formState.errors.title`.
  - Field 2: `내용` (no `*`) — existing `Editor` component
    (`src/components/ui/editor.tsx`) wired through `Controller` since it's a
    custom `value`/`onChange` component, not a native input.
  - Footer buttons: 취소 (`Link` back to `/admin/posts`, outline style) and
    submit (`primary`, `type="submit"`, disabled + shows loading label while
    `formState.isSubmitting`).
  - Visual style matches existing admin UI: violet-600 primary accents,
    rounded-md, gray-200 borders — same tokens `post-table.tsx` already uses.

**New page:**

- `src/app/admin/posts/create/page.tsx` — `'use client'`.
  - Same page shell as `src/app/admin/posts/page.tsx`: `<div className="flex flex-col gap-6"><h1 className="text-2xl font-bold tracking-tight">...</h1>...</div>`.
  - Heading text: `블로그 & 뉴스 글 등록` (mirrors the list page's `블로그 & 뉴스 글 목록`).
  - Body is just `<PostForm onSubmit={handleSubmit} />` in place of `PostTable`
    — no extra chrome, no card wrapper, matching the instruction to only
    swap out the content below the heading.
  - `handleSubmit`: calls `createNews({ title, content_html: content?.trim() ? content : null })`,
    on success `toast.success(...)` (sonner, already used in project) then
    `router.push('/admin/posts')`; on failure `toast.error(err.message)`.

**Edited:**

- `src/components/admin/post-table.tsx` — line ~363, `Link href` for the
  등록 button: `/admin/posts/new` → `/admin/posts/create`.

## Validation behavior

- Title empty → inline error under the field, red border via existing
  `aria-invalid` styles in `input.tsx`. Label reads `제목 *`.
- Content has no client-side required check. Label reads `내용` (no `*`).
- Validation runs on submit (react-hook-form default); errors clear as the
  user fixes them (default `onChange` re-validation after first submit).

## Error handling

- Network/CORS failure or non-2xx response from `POST /news` → caught in the
  page's `handleSubmit`, surfaced via `toast.error` with the message thrown
  by `createNews`. Form stays populated so the user doesn't lose input.
- Submit button disabled during the in-flight request to prevent double
  submission.

## Out of scope

- Edit page itself (only the shared `PostForm` is built now).
- Any backend/API route proxy — the browser calls `http://172.16.11.224:8000`
  directly, so the backend must allow CORS from the Next.js dev origin.
- `published_at`, status/draft toggle, thumbnail — not part of the 2-field
  form per requirements.

## Known dependency: backend CORS

Verified via `curl` against the live backend (2026-07-02): `OPTIONS /news`
with an `Origin: http://localhost:3000` preflight returns `405 Method Not
Allowed`, and a plain `GET /news` response carries no
`Access-Control-Allow-Origin` header. CORS is **not** currently enabled on
the backend.

Because the form fetches `http://172.16.11.224:8000/news` directly from the
browser, this means `POST /news` submissions **will not work until the
backend adds CORS** (e.g. FastAPI `CORSMiddleware` allowing the Next.js dev
origin, at minimum for `POST` and `Content-Type: application/json`). The
user has confirmed this will be handled separately with the backend team —
the frontend code proceeds as designed (direct fetch) and does not work
around it with a proxy. Until CORS is enabled, submitting the form will fail
with a network/CORS error surfaced via `toast.error`, which is expected.
