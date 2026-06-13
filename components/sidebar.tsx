"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  CalendarDays,
  BellRing,
  User,
  LogOut,
  Trash2,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-documind"
import { toast } from "sonner"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Dokumen", icon: FileText },
  { href: "/folders", label: "Folder", icon: FolderOpen },
  { href: "/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/reminders", label: "Reminder", icon: BellRing },

  // tambahkan ini
  { href: "/trash", label: "Sampah", icon: Trash2 },

  { href: "/profile", label: "Profil", icon: User },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    toast.success("Berhasil keluar.")
    router.push("/")
  }

  return (
    <div className="flex h-full flex-col gap-2 bg-sidebar p-4">
      <div className="px-2 py-3">
        <Logo />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="size-4.5 shrink-0" />
        Keluar
      </button>
    </div>
  )
}
