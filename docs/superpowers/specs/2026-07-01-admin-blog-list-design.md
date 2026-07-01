# Admin Blog List Page — Design Spec

**Date:** 2026-07-01  
**Status:** Approved

---

## 1. Goal

Build the admin post list page (`/admin/posts`) that matches `mockup-design/admin-blog-design.png`.  
Uses **static mock data** (Approach 1) — ready to swap for real API calls later.

---

## 2. Routes & File Structure

```
src/app/admin/
  layout.tsx                  ← Admin shell: sidebar + header + main slot
  posts/
    page.tsx                  ← Post list page

src/components/admin/
  admin-sidebar.tsx           ← Left sidebar with nav links
  admin-header.tsx            ← Top header: toggle, breadcrumb, dark mode, user
  post-table.tsx              ← shadcn Table + @tanstack/react-table
  post-table-toolbar.tsx      ← Search input + date range pickers + page-size selector
```

---

## 3. Layout (`admin/layout.tsx`)

Two-column shell:
- **Left:** fixed-width sidebar (240px), collapsible via toggle button in header
- **Right:** flex-grow area containing the header + `{children}`

The sidebar state (open/collapsed) is managed via `useState` in the layout (client component).

---

## 4. Sidebar (`admin-sidebar.tsx`)

| Area | Content |
|---|---|
| Top | Logo block — "42dot" bold + "CONTENTS MANAGEMENT SYSTEM" small text |
| Nav | Icon + label links; active item highlighted purple |
| Footer | "© 2026 42dot. All rights reserved." |

**Nav items** (English, as per design):

```
Main Home
Careers
Blog & News   ← active on /admin/posts
Research
SNS
Admin User
Board
Privacy Policy
```

Active state: purple background + purple text on the active link.

---

## 5. Header (`admin-header.tsx`)

Left-to-right:
1. Sidebar toggle icon button
2. Home icon
3. Dark mode toggle ("Dark" label + sun/moon icon)
4. Breadcrumb: `42dot › BLOG & NEWS`

Far right:
- Crown icon + user display name + logout arrow icon

---

## 6. Post List Page (`admin/posts/page.tsx`)

### 6.1 Toolbar

- **Search input** with magnifying glass icon (filters by title client-side)
- **Date range picker** — two date inputs (from / to), format `YYYY.MM.DD`
- **Page size selector** — dropdown: 10 / 20 / 50 per page (default 20)

### 6.2 Count row

- Left: `전체 {N}` (total count)
- Right: page size selector

### 6.3 Table columns (shadcn Table + @tanstack/react-table)

| # | Key | Label | Notes |
|---|---|---|---|
| 1 | select | — | Checkbox (row selection) |
| 2 | thumbnail | 썸네일 이미지 | `<img>` 60×60, object-cover |
| 3 | title | 제목 | Truncated with tooltip on hover |
| 4 | uploadedAt | 업로드 일시 | `yyyy-MM-dd HH:mm:ss` via date-fns |
| 5 | status | 게시 | Badge: published = blue, draft = gray |
| 6 | actions | 수정 | Edit button → `/admin/posts/{id}/edit` |

Removed from original mockup: Category, Tags, Job Function, bilingual title split.

### 6.4 Bottom bar

- Left: **삭제** button (ghost/outline, disabled when no rows selected)
- Center: pagination (`< 1 2 3 >`) — shadcn Pagination
- Right: **등록** button (solid purple → `/admin/posts/new`)

---

## 7. Mock Data

A static array in `src/lib/mock-data.ts` with ~5–10 post objects:

```ts
type Post = {
  id: string
  title: string
  thumbnailUrl: string
  uploadedAt: string   // ISO string
  status: 'published' | 'draft'
}
```

---

## 8. Package to Add

```
@tanstack/react-table   ← headless table logic (row selection, pagination, sorting)
```

`@tanstack/react-query` is NOT needed for this phase (mock data only).

---

## 9. Out of Scope (this spec)

- Create / Edit / Delete API calls
- Authentication
- Real API integration
- Dark mode implementation (toggle renders but no logic wired)
- Search/filter against API
