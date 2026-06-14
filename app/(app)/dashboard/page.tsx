"use client"

import Link from "next/link"
import { useMemo, useEffect } from "react"
import {
  FileText,
  FolderOpen,
  CalendarClock,
  AlarmClock,
  ArrowRight,
  Plus,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { FileIcon } from "@/components/file-icon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAgendas, useDocs, useProfile, agendaStatus } from "@/hooks/use-documind"
import { DEFAULT_FOLDERS, FOLDER_MAP } from "@/lib/constants"
import { formatDate, formatDateLong, todayISODate } from "@/lib/utils-format"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  console.log("DASHBOARD RENDER")
  const { docs } = useDocs()
  const { agendas } = useAgendas()
  const { profile } = useProfile()

  const today = todayISODate()
  const deadlineToday = useMemo(
    () => agendas.filter((a) => !a.completed && a.date === today),
    [agendas, today],
  )
  const upcoming = useMemo(
    () => agendas.filter((a) => !a.completed && a.date > today).slice(0, 5),
    [agendas, today],
  )
  const recentDocs = useMemo(() => docs.slice(0, 5), [docs])
  useEffect(() => {
  console.log("USEEFFECT JALAN")

  if (Notification.permission === "granted") {
    new Notification("TES NOTIF", {
      body: "Notif berhasil 🎉",
    })
  }
}, [])

useEffect(() => {
  if (
    typeof window !== "undefined" &&
    "Notification" in window &&
    Notification.permission === "default"
  ) {
    Notification.requestPermission()
  }
}, [])
  useEffect(() => {
  if (
    deadlineToday.length > 0 &&
    Notification.permission === "granted"
  ) {
    new Notification("DocuMind Reminder", {
      body: `Ada ${deadlineToday.length} deadline hari ini!`,
    })
  }
}, [deadlineToday])
  const stats = [
    {
      label: "Total Dokumen",
      value: docs.length,
      icon: FileText,
      cls: "bg-chart-1/15 text-chart-1",
      href: "/documents",
    },
    {
      label: "Total Folder",
      value: DEFAULT_FOLDERS.length,
      icon: FolderOpen,
      cls: "bg-chart-4/15 text-chart-4",
      href: "/folders",
    },
    {
      label: "Deadline Hari Ini",
      value: deadlineToday.length,
      icon: AlarmClock,
      cls: "bg-chart-5/15 text-chart-5",
      href: "/reminders",
    },
    {
      label: "Deadline Mendatang",
      value: agendas.filter((a) => !a.completed && a.date > today).length,
      icon: CalendarClock,
      cls: "bg-chart-3/15 text-chart-3",
      href: "/calendar",
    },
  ]

console.log("Notification:", Notification.permission)
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Halo, ${profile.name.split(" ")[0]}!`}
        description={formatDateLong(today)}
      >
        <Link href="/documents">
  <Button>
    <Plus className="size-4" />
    Upload Dokumen
  </Button>
</Link>
      </PageHeader>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl",
                      s.cls,
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-2xl font-semibold leading-none">{s.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Recent documents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Dokumen Terbaru</CardTitle>
            <Link href="/documents">
  <Button variant="ghost" size="sm">
    Lihat semua <ArrowRight className="size-4" />
  </Button>
</Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentDocs.length === 0 ? (
              <EmptyState
                text="Belum ada dokumen. Mulai dengan mengunggah berkas pertama Anda."
                href="/documents"
                cta="Upload sekarang"
              />
            ) : (
              recentDocs.map((d) => (
                <Link
                  key={d.id}
                  href="/documents"
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                >
                  <FileIcon type={d.type} name={d.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {FOLDER_MAP[d.folder].name} · {formatDate(d.createdAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deadline Terdekat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deadlineToday.length === 0 && upcoming.length === 0 ? (
              <EmptyState
                text="Tidak ada deadline. Tambahkan agenda di kalender."
                href="/calendar"
                cta="Buka kalender"
              />
            ) : (
              <>
                {deadlineToday.map((a) => (
                  <DeadlineRow key={a.id} title={a.title} date={a.date} status="today" />
                ))}
                {upcoming.map((a) => (
                  <DeadlineRow
                    key={a.id}
                    title={a.title}
                    date={a.date}
                    status={agendaStatus(a)}
                  />
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function DeadlineRow({
  title,
  date,
  status,
}: {
  title: string
  date: string
  status: string
}) {
  const variant =
    status === "today"
      ? "bg-chart-5/15 text-chart-5"
      : "bg-accent text-accent-foreground"
  return (
    <div className="flex items-center gap-3">
      <span className={cn("flex size-9 items-center justify-center rounded-lg", variant)}>
        <AlarmClock className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{formatDate(date)}</p>
      </div>
      {status === "today" && <Badge variant="destructive">Hari ini</Badge>}
    </div>
  )
}

function EmptyState({
  text,
  href,
  cta,
}: {
  text: string
  href: string
  cta: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <p className="max-w-xs text-sm text-muted-foreground text-pretty">{text}</p>
     <Link href={href}>
  <Button variant="outline" size="sm">
    {cta}
  </Button>
</Link>
    </div>
  )
}
