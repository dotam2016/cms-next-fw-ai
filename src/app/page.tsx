import { Suspense } from 'react'
import Link from 'next/link'
import { SiteHeader } from '@/components/front/site-header'
import { NewsSection } from '@/components/front/news-section'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-6 py-3 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="font-medium text-gray-700">News &amp; Media</span>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-10">
        <Suspense fallback={null}>
          <NewsSection />
        </Suspense>
      </main>
    </div>
  )
}
