# Admin Post Create Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/admin/posts/create`, a page for creating a news article (제목 required, 내용 optional rich text via CKEditor 5), built on a reusable `PostForm` component and wired to the real `POST /news` backend.

**Architecture:** `PostForm` (presentation + react-hook-form + zod validation) is decoupled from data submission — it takes an `onSubmit` callback and knows nothing about the network. The create page owns the actual API call (`createNews`, a thin `fetch` wrapper) and handles success/error UX (toast + redirect). This lets a future edit page reuse `PostForm` unchanged.

**Tech Stack:** Next.js 16 (App Router), React 19, react-hook-form + `@hookform/resolvers/zod` + zod (already installed), `@ckeditor/ckeditor5-react` (already installed, wrapped by existing `src/components/ui/editor.tsx`), sonner for toasts, native `fetch` (no axios, no TanStack Query).

## Global Constraints

- Backend base URL: `http://172.16.11.224:8000`, read from `NEXT_PUBLIC_API_BASE_URL`. Only the `POST /news` endpoint (operationId `create_news_news_post`) is in scope — `sources` and `crawl` endpoints are out of scope. Full contract is in `openapi.json` (repo root) and `docs/superpowers/specs/2026-07-02-admin-post-create-design.md`.
- Request body sent to `POST /news`: `{ title: string, content_html?: string | null }`. Never send `published_at` — the form has no field for it.
- Use native `fetch` only. Do not add axios or TanStack Query.
- Fetch is called **directly from the client** (no Next.js API route proxy). CORS is confirmed **not** enabled on the backend as of 2026-07-02 (verified via `curl` preflight — see spec's "Known dependency: backend CORS" section). This means the real submit call may fail with a browser CORS/network error until the backend team fixes it. That is expected, not a bug in this code — do not add a proxy route to work around it.
- Labels are Korean. Required fields get a trailing `*` in the label text (e.g. `제목 *`). `content`/내용 is optional — no asterisk, no required validation.
- `PostForm` must contain zero networking code. It only validates and calls the `onSubmit` prop it's given.
- **No test framework is configured in this repo** (no jest/vitest/playwright, no `test` script in `package.json`). Do not add one as part of this plan. Verification uses `pnpm exec tsc --noEmit` (type correctness), `pnpm lint` (lint), a Node smoke script against the live backend (API contract), and manual browser checks via `pnpm dev` (UI behavior) — in place of automated unit tests.
- Visual style follows the existing admin UI conventions already used in `src/components/admin/post-table.tsx` and `src/components/ui/search-input.tsx`: explicit `border-gray-200`, `focus-visible:ring-violet-600 focus-visible:border-violet-600`, `rounded-md`, violet-600 for primary actions. Do not rely on the shadcn semantic tokens (`border-input`, `bg-primary`, `text-destructive`, `ring-ring`) — `src/app/globals.css` only defines `--border`, so those other tokens currently resolve to nothing. This is a pre-existing gap in the codebase, out of scope to fix here — just avoid depending on it, matching how `SearchInput` and `post-table.tsx` already work around it.

---

### Task 1: News API client

**Files:**
- Create: `.env.local`
- Create: `src/lib/api/news.ts`

**Interfaces:**
- Produces: `createNews(payload: CreateNewsPayload): Promise<NewsOut>`, `interface CreateNewsPayload { title: string; content_html?: string | null }`, `interface NewsOut { id: number; source_id: number | null; title: string; url: string | null; content_html: string | null; published_at: string | null; view_count: number; is_deleted: boolean; deleted_at: string | null; crawled_at: string; updated_at: string }` — all exported from `src/lib/api/news.ts`. Task 3 imports `createNews`.

- [ ] **Step 1: Add the API base URL env var**

Create `.env.local` in the repo root:

```
NEXT_PUBLIC_API_BASE_URL=http://172.16.11.224:8000
```

This file is already covered by the repo's `.env*` gitignore rule, so it won't be committed.

- [ ] **Step 2: Write the API client**

Create `src/lib/api/news.ts`:

```ts
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
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors mentioning `src/lib/api/news.ts` or `.env.local` (pre-existing unrelated errors elsewhere, if any, are not this task's concern).

- [ ] **Step 4: Verify the request contract against the live backend**

There's no test runner in this repo, so verify the exact request/response shape `createNews` uses with a throwaway Node script (Node 18+ has native `fetch`, no deps needed).

Create `C:\Users\User\AppData\Local\Temp\claude\E--github-cms-next-ai\b7385175-89ed-4dca-8572-7c15364aa2e9\scratchpad\smoke-create-news.mjs`:

```js
const res = await fetch('http://172.16.11.224:8000/news', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Smoke test title', content_html: '<p>hello</p>' }),
})
const body = await res.json()
console.log(res.status, JSON.stringify(body))
```

Run: `node C:\Users\User\AppData\Local\Temp\claude\E--github-cms-next-ai\b7385175-89ed-4dca-8572-7c15364aa2e9\scratchpad\smoke-create-news.mjs`
Expected: prints `201 {"id":<number>,...,"title":"Smoke test title","content_html":"<p>hello</p>",...}` — confirms the payload shape `createNews` sends matches what the backend accepts and returns.

- [ ] **Step 5: Clean up the smoke-test article**

Note the `id` printed in Step 4, then soft-delete it so it doesn't linger in the real news list:

Run: `curl -s -X DELETE http://172.16.11.224:8000/news/<id>`
Expected: JSON response with `"is_deleted":true`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/api/news.ts
git commit -m "feat: add createNews API client for POST /news"
```

(`.env.local` is gitignored and won't be staged — confirm with `git status` that only `src/lib/api/news.ts` is added.)

---

### Task 2: Post form validation schema + reusable PostForm component

**Files:**
- Create: `src/lib/validations/post.ts`
- Create: `src/components/admin/post-form.tsx`

**Interfaces:**
- Consumes: existing `Editor` default export from `src/components/ui/editor.tsx` (`value: string`, `onChange: (value: string) => void`, `placeholder?: string`); existing `Input` from `src/components/ui/input.tsx`; existing `Label` from `src/components/ui/label.tsx`; existing `Button`, `buttonVariants` from `src/components/ui/button.tsx`; `cn` from `src/lib/utils`.
- Produces: `postFormSchema` (zod schema) and `type PostFormValues = { title: string; content?: string }` from `src/lib/validations/post.ts`. `PostForm` component from `src/components/admin/post-form.tsx` with props `{ defaultValues?: Partial<PostFormValues>; onSubmit: (values: PostFormValues) => Promise<void> | void; submitLabel?: string }`. Task 3 imports both `PostForm` and `PostFormValues`.

- [ ] **Step 1: Write the validation schema**

Create `src/lib/validations/post.ts`:

```ts
import { z } from 'zod'

export const postFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().optional(),
})

export type PostFormValues = z.infer<typeof postFormSchema>
```

- [ ] **Step 2: Write the PostForm component**

Create `src/components/admin/post-form.tsx`:

```tsx
'use client'

import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Editor from '@/components/ui/editor'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { postFormSchema, type PostFormValues } from '@/lib/validations/post'

interface PostFormProps {
  defaultValues?: Partial<PostFormValues>
  onSubmit: (values: PostFormValues) => Promise<void> | void
  submitLabel?: string
}

export function PostForm({ defaultValues, onSubmit, submitLabel = '등록' }: PostFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', content: '', ...defaultValues },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title" className="text-sm font-medium text-gray-700">
          제목 *
        </Label>
        <Input
          id="title"
          placeholder="제목을 입력해주세요"
          aria-invalid={!!errors.title}
          className="border-gray-200 focus-visible:ring-violet-600 focus-visible:border-violet-600 rounded-md"
          {...register('title')}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="content" className="text-sm font-medium text-gray-700">
          내용
        </Label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <Editor value={field.value ?? ''} onChange={field.onChange} placeholder="내용을 입력해주세요" />
          )}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <Link
          href="/admin/posts"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'border-gray-200 text-xs px-4 h-9 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-none'
          )}
        >
          취소
        </Link>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-9 rounded-md font-medium disabled:opacity-60"
        >
          {isSubmitting ? '저장 중...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
```

- [ ] **Step 3: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors mentioning `src/lib/validations/post.ts` or `src/components/admin/post-form.tsx`.

Run: `pnpm lint`
Expected: no new errors/warnings from these two files.

- [ ] **Step 4: Commit**

```bash
git add src/lib/validations/post.ts src/components/admin/post-form.tsx
git commit -m "feat: add reusable PostForm component with zod validation"
```

---

### Task 3: Create page, toast wiring, and list-page link

**Files:**
- Create: `src/app/admin/posts/create/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/admin/post-table.tsx:362-370`

**Interfaces:**
- Consumes: `createNews`, `CreateNewsPayload` from `src/lib/api/news.ts` (Task 1); `PostForm`, and `PostFormValues` (re-exported via `src/lib/validations/post.ts`) from Task 2.

- [ ] **Step 1: Mount the toaster so `toast.*` calls render**

Read `src/app/layout.tsx` first (already read during design — current content shown below for reference), then edit it.

Current relevant part:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
```

and the return statement:

```tsx
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
```

Change the import block to add the `Toaster`:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
```

Change the return statement to render it once, alongside `children`:

```tsx
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
```

- [ ] **Step 2: Create the create page**

Create `src/app/admin/posts/create/page.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostForm } from '@/components/admin/post-form'
import { createNews } from '@/lib/api/news'
import type { PostFormValues } from '@/lib/validations/post'

export default function AdminPostCreatePage() {
  const router = useRouter()

  const handleSubmit = async (values: PostFormValues) => {
    try {
      await createNews({
        title: values.title,
        content_html: values.content?.trim() ? values.content : null,
      })
      toast.success('게시글이 등록되었습니다.')
      router.push('/admin/posts')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '게시글 등록에 실패했습니다.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">블로그 & 뉴스 글 등록</h1>
      <PostForm onSubmit={handleSubmit} />
    </div>
  )
}
```

- [ ] **Step 3: Point the list page's 등록 button at the new route**

In `src/components/admin/post-table.tsx`, find (around line 362-370):

```tsx
          <Link
            href="/admin/posts/new"
            className={cn(
              buttonVariants({ size: 'sm' }),
              'bg-violet-600 hover:bg-violet-700 text-white text-xs px-4 h-9 rounded-md transition-colors w-30'
            )}
          >
            등록
          </Link>
```

Change `href="/admin/posts/new"` to `href="/admin/posts/create"`.

- [ ] **Step 4: Type-check and lint**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

Run: `pnpm lint`
Expected: no new errors/warnings.

- [ ] **Step 5: Manual browser verification**

Run: `pnpm dev` (leave running)

In a browser:

1. Go to `http://localhost:3000/admin/posts`. Click 등록. Confirm it navigates to `http://localhost:3000/admin/posts/create` (not `/new`).
2. Confirm the page shows the heading `블로그 & 뉴스 글 등록`, a `제목 *` input, a `내용` label with the CKEditor toolbar below it, and 취소/등록 buttons — same page shell (h1 + content) as `/admin/posts`.
3. Click 등록 with the title empty. Confirm an inline error appears under the title field (제목을 입력해주세요) and the page does not navigate away.
4. Type a title, type some content in the editor (e.g. bold text via the toolbar), open DevTools → Network tab, click 등록 again.
5. Confirm a `POST` request fires to `http://172.16.11.224:8000/news` with JSON body `{"title": "...", "content_html": "<p>...</p>"}` (check the Request payload in DevTools).
6. Two possible outcomes depending on whether the backend team has enabled CORS yet (see Global Constraints):
   - **If CORS is enabled:** the request succeeds (201), a success toast appears, and the browser redirects to `/admin/posts`. Confirm with `curl -s http://172.16.11.224:8000/news/latest?limit=1` that the new article's title matches what was submitted.
   - **If CORS is still not enabled:** the browser blocks the request (console shows a CORS error, Network tab shows the request as failed/blocked), and an error toast appears. This is expected per the Global Constraints — do not treat it as a bug in this code. Confirm the request in the Network tab has the right URL/method/payload (that's what this code is responsible for); the failure to complete is a backend-side gap tracked separately.
   - If the CORS-enabled path works, also click 취소 from the create page and confirm it navigates back to `/admin/posts` without submitting anything.

- [ ] **Step 6: Commit**

```bash
git add src/app/admin/posts/create/page.tsx src/app/layout.tsx src/components/admin/post-table.tsx
git commit -m "feat: add admin post create page and wire up navigation"
```

---

## Self-Review Notes

- Spec coverage: title required + `*`, content optional + no `*`, Korean labels, CKEditor via reusable `Editor`, PostForm reusable for a future edit page (no networking inside it), `POST /news` integration with native `fetch`, env-var base URL, list-page link fixed to `/admin/posts/create`, layout matches `/admin/posts` (h1 + content swapped) — all covered across Tasks 1-3.
- No placeholders: every step has literal file contents, exact commands, and expected output.
- Type/name consistency checked: `PostFormValues` (Task 2) is the single shape consumed by both `PostForm`'s `onSubmit` and the create page's `handleSubmit` (Task 3); `CreateNewsPayload`/`NewsOut` (Task 1) are the only types `createNews` exposes and the only ones Task 3 imports.
