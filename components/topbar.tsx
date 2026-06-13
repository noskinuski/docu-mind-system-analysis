"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useProfile } from "@/hooks/use-documind"

export function Topbar() {
  const router = useRouter()
  const { profile } = useProfile()
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/documents?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
      {/* Mobile menu */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger
          className="flex size-9 items-center justify-center rounded-lg border lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="size-5" />
        </DialogTrigger>
        <DialogContent className="left-0 top-0 h-full max-w-[260px] translate-x-0 translate-y-0 gap-0 rounded-none border-0 p-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:rounded-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Menu navigasi</DialogTitle>
          </DialogHeader>
          <Sidebar onNavigate={() => setMenuOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="lg:hidden">
        <Logo />
      </div>

      <form onSubmit={submitSearch} className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari dokumen..."
          className="max-w-md pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium leading-none">{profile.name}</p>
          <p className="text-xs text-muted-foreground">{profile.role}</p>
        </div>
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {initials || "DM"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
