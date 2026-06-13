"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { useAuth } from "@/hooks/use-documind"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Tandai komponen sudah ter-mount agar nilai dari localStorage
  // (yang dibaca via useSyncExternalStore) sudah tersinkron sebelum
  // kita memutuskan untuk redirect.
  useEffect(() => {
    setMounted(true)
  }, [])
useEffect(() => {
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission !== "granted"
  ) {
    Notification.requestPermission()
  }
}, [])
  useEffect(() => {
    if (mounted && !auth.loggedIn) {
      router.replace("/")
    }
  }, [mounted, auth.loggedIn, router])

  if (!mounted || !auth.loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Memuat...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
