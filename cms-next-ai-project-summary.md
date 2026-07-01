# CMS Next AI - Project Summary

## 1. Mục tiêu dự án

Project sử dụng **Next.js App Router** để xây dựng một website blog có kèm khu vực **admin đơn giản** trong cùng một source code.

Admin dùng để quản lý việc đăng bài viết, bao gồm tạo mới, chỉnh sửa, xoá, quản lý trạng thái bài viết và nhập nội dung bằng trình soạn thảo rich text.

## 2. Tech Stack chính

| Nhóm | Công nghệ |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Package Manager | pnpm |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Form | React Hook Form |
| Validation | Zod |
| Form Resolver | @hookform/resolvers |
| API Data Fetching / Cache | TanStack Query |
| Date Utility | date-fns |
| Slug Generator | slugify |
| Rich Text Editor | CKEditor 5 |
| Deploy | Vercel |
| Backend | BE API riêng đã có sẵn |

## 3. Kiến trúc tổng quan

Project Next.js chỉ đóng vai trò là **Frontend + Admin UI**.

Database và business logic chính sẽ được xử lý ở **Backend API riêng**.

Vì vậy project Next.js **không cần cài Prisma hoặc Drizzle ORM**.

```txt
Next.js App Router
  ├─ Public Blog Site
  │   ├─ Hiển thị danh sách bài viết
  │   ├─ Hiển thị chi tiết bài viết
  │   └─ Gọi BE API để lấy dữ liệu
  │
  └─ Admin Area
      ├─ Quản lý danh sách bài viết
      ├─ Tạo bài viết
      ├─ Chỉnh sửa bài viết
      ├─ Xoá bài viết
      ├─ Quản lý trạng thái draft / published
      └─ Gọi BE API để xử lý dữ liệu

BE API riêng
  ├─ Xử lý database
  ├─ Validate dữ liệu phía server
  ├─ Authentication / Authorization
  └─ CRUD bài viết
```

## 4. Các tính năng dự kiến của website

### 4.1. Public Blog Site

- Hiển thị danh sách bài viết
- Hiển thị chi tiết bài viết
- Hiển thị ngày đăng bài / ngày cập nhật
- Hiển thị trạng thái hoặc danh mục nếu BE API có hỗ trợ
- Sử dụng slug cho URL bài viết
- Gọi dữ liệu từ BE API

Ví dụ URL:

```txt
/blog
/blog/[slug]
```

## 5. Các tính năng dự kiến của Admin

### 5.1. Admin Dashboard

- Trang tổng quan đơn giản cho admin
- Có thể hiển thị số lượng bài viết, bài đã publish, bài draft nếu BE API hỗ trợ

### 5.2. Quản lý bài viết

- Danh sách bài viết dạng table
- Phân trang bài viết
- Tìm kiếm bài viết nếu BE API hỗ trợ
- Lọc theo trạng thái nếu BE API hỗ trợ
- Hiển thị các thông tin cơ bản:
  - Tiêu đề
  - Slug
  - Trạng thái
  - Ngày tạo
  - Ngày cập nhật
  - Hành động sửa / xoá

### 5.3. Tạo bài viết

- Form tạo bài viết mới
- Validate dữ liệu bằng Zod
- Quản lý form bằng React Hook Form
- Tự động tạo slug từ title bằng slugify
- Nhập nội dung bằng CKEditor 5
- Gửi dữ liệu lên BE API
- Hiển thị thông báo thành công / lỗi bằng sonner

### 5.4. Chỉnh sửa bài viết

- Load dữ liệu bài viết từ BE API
- Hiển thị dữ liệu vào form
- Chỉnh sửa title, slug, excerpt, thumbnail, content, status
- Validate dữ liệu trước khi submit
- Gửi request update lên BE API
- Invalidate/refetch lại dữ liệu bằng TanStack Query

### 5.5. Xoá bài viết

- Hiển thị dialog xác nhận trước khi xoá
- Gọi BE API để xoá bài viết
- Refetch lại danh sách bài viết sau khi xoá
- Hiển thị toast thông báo kết quả

### 5.6. Quản lý trạng thái bài viết

Dự kiến có 2 trạng thái cơ bản:

```txt
draft
published
```

Có thể mở rộng thêm sau này nếu cần:

```txt
archived
scheduled
```

## 6. Công cụ và thư viện sử dụng

### 6.1. pnpm

Dùng làm package manager chính cho project.

Các lệnh chính:

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
```

### 6.2. shadcn/ui

Dùng để tạo UI component cho admin.

Các component nên dùng:

```txt
button
input
textarea
label
form
card
table
dialog
dropdown-menu
select
badge
separator
sonner
alert
pagination
```

### 6.3. React Hook Form + Zod

Dùng cho các form trong admin:

- Form tạo bài viết
- Form chỉnh sửa bài viết
- Form login nếu cần

### 6.4. TanStack Query

Dùng để quản lý dữ liệu lấy từ BE API:

- Fetch danh sách bài viết
- Fetch chi tiết bài viết
- Create bài viết
- Update bài viết
- Delete bài viết
- Cache API data
- Refetch / invalidate data sau mutation

### 6.5. CKEditor 5

Dùng làm rich text editor cho phần nội dung bài viết trong admin.

CKEditor 5 sẽ được dùng cho field:

```txt
content
```

Nội dung bài viết có thể được lưu dạng HTML hoặc format khác tuỳ theo BE API đang thiết kế.

### 6.6. Vercel

Dùng để deploy project Next.js.

Khi dùng pnpm, cần commit file:

```txt
pnpm-lock.yaml
```

Vercel sẽ tự nhận biết project dùng pnpm thông qua lockfile này.

## 7. Những thư viện không cần dùng trong project hiện tại

Vì project đã có BE API riêng, hiện tại không cần cài:

```txt
prisma
drizzle-orm
```

Lý do: Next.js không trực tiếp kết nối database. Việc xử lý database thuộc trách nhiệm của BE API.

Ngoài ra, `axios` cũng không bắt buộc. Có thể dùng `fetch` mặc định của Next.js/JavaScript để gọi API.

## 8. Câu lệnh khởi tạo project đề xuất

```bash
pnpm create next-app@latest cms-next-ai --ts --tailwind --eslint --app --src-dir --import-alias "@/*"

cd cms-next-ai

pnpm dlx shadcn@latest init

pnpm dlx shadcn@latest add button input textarea label form card table dialog dropdown-menu select badge separator sonner alert pagination

pnpm add zod react-hook-form @hookform/resolvers

pnpm add @tanstack/react-query

pnpm add date-fns slugify
```

Cài thêm CKEditor 5:

```bash
pnpm add @ckeditor/ckeditor5-react ckeditor5
```

Chạy project:

```bash
pnpm dev
```

Build trước khi deploy:

```bash
pnpm build
```

## 9. Gợi ý cấu trúc thư mục

```txt
src/
  app/
    layout.tsx
    page.tsx
    
    [slug]/
      page.tsx

    admin/
      layout.tsx
      page.tsx
      posts/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx

  components/
    ui/
    admin/
      admin-header.tsx
      admin-sidebar.tsx
      post-form.tsx
      post-table.tsx
      post-editor.tsx

  features/
    posts/
      post.schema.ts
      post.types.ts
      post.api.ts
      post.queries.ts
      post.mutations.ts

  lib/
    api.ts
    utils.ts

  constants/
    routes.ts
```

## 10. Ghi chú triển khai

- Frontend/Admin chỉ gọi BE API, không xử lý database trực tiếp.
- BE API sẽ chịu trách nhiệm authentication, authorization và validate cuối cùng phía server.
- Frontend vẫn validate bằng Zod để cải thiện trải nghiệm nhập liệu.
- Nên dùng TanStack Query để quản lý trạng thái loading, error, success và cache dữ liệu API.
- Nên dùng CKEditor 5 cho nội dung bài viết để admin có thể nhập nội dung dạng rich text.
- Khi deploy lên Vercel, nên đảm bảo chỉ dùng một lockfile chính là `pnpm-lock.yaml`.
