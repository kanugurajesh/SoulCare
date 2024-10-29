import { Suspense } from 'react'
import GmailList from "@/components/GmailList"
import { Skeleton } from "@/components/ui/skeleton"

async function getGmails() {
  const res = await fetch("http://localhost:8000/priq", { next: { revalidate: 60 } })
  if (!res.ok) {
    throw new Error("Failed to fetch emails")
  }
  return res.json()
}

export default async function Home() {
  const { gmails } = await getGmails()

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Priority Inbox
          </h1>
        </header>
        <Suspense fallback={<EmailListSkeleton />}>
          <GmailList gmails={gmails} />
        </Suspense>
      </div>
      <footer className="py-4 text-center text-sm text-gray-500">
        © 2023 Priority Inbox. All rights reserved.
      </footer>
    </main>
  )
}

function EmailListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  )
}