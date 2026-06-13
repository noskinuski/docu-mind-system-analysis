"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { AgendaDialog } from "@/components/agenda-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAgendas } from "@/hooks/use-documind"
import { todayISODate, formatDate } from "@/lib/utils-format"
import type { Agenda } from "@/lib/types"
import { cn } from "@/lib/utils"

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

function pad(n: number) {
  return String(n).padStart(2, "0")
}

export default function CalendarPage() {
  const { agendas, deleteAgenda } = useAgendas()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selected, setSelected] = useState(todayISODate())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Agenda | null>(null)

  const byDate = useMemo(() => {
    const map: Record<string, Agenda[]> = {}
    for (const a of agendas) {
      ;(map[a.date] ??= []).push(a)
    }
    return map
  }, [agendas])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const today = todayISODate()
  const selectedAgendas = byDate[selected] ?? []

  function prevMonth() {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else setMonth((m) => m + 1)
  }

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(a: Agenda) {
    setEditing(a)
    setDialogOpen(true)
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Kalender" description="Kelola agenda dan jadwal penting">
        <Button onClick={openAdd}>
          <Plus className="size-4" /> Tambah Agenda
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar grid */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              {MONTHS[month]} {year}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="size-8" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon" className="size-8" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {DAYS.map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <div key={`e-${i}`} />
                const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
                const has = (byDate[dateStr]?.length ?? 0) > 0
                const isToday = dateStr === today
                const isSelected = dateStr === selected
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelected(dateStr)}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-lg text-sm transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted",
                    )}
                  >
                    {day}
                    {has && (
                      <span
                        className={cn(
                          "absolute bottom-1.5 size-1.5 rounded-full",
                          isSelected ? "bg-primary-foreground" : "bg-primary",
                        )}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Agendas of selected day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{formatDate(selected)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedAgendas.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada agenda pada tanggal ini.
              </div>
            ) : (
              selectedAgendas.map((a) => (
                <div key={a.id} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        a.completed && "text-muted-foreground line-through",
                      )}
                    >
                      {a.title}
                    </p>
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => openEdit(a)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Edit agenda"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          deleteAgenda(a.id)
                          toast.success("Agenda dihapus.")
                        }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Hapus agenda"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  {a.description && (
                    <p className="mt-1 text-xs text-muted-foreground text-pretty">
                      {a.description}
                    </p>
                  )}
                </div>
              ))
            )}
            <Button variant="outline" className="w-full" onClick={openAdd}>
              <Plus className="size-4" /> Tambah di tanggal ini
            </Button>
          </CardContent>
        </Card>
      </div>

      <AgendaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        defaultDate={selected}
      />
    </div>
  )
}
