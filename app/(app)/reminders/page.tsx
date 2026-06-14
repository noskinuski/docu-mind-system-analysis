"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Plus,
  CalendarClock,
  AlarmClock,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { AgendaDialog } from "@/components/agenda-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAgendas, agendaStatus } from "@/hooks/use-documind"
import type { Agenda, AgendaStatus } from "@/lib/types"
import { formatDate } from "@/lib/utils-format"
import { cn } from "@/lib/utils"

const STATUS_META: Record<
  AgendaStatus,
  { label: string; icon: typeof Circle; cls: string }
> = {
  upcoming: { label: "Mendatang", icon: CalendarClock, cls: "bg-chart-3/15 text-chart-3" },
  today: { label: "Hari Ini", icon: AlarmClock, cls: "bg-chart-5/15 text-chart-5" },
  completed: { label: "Selesai", icon: CheckCircle2, cls: "bg-chart-2/15 text-chart-2" },
  overdue: { label: "Terlambat", icon: AlertTriangle, cls: "bg-destructive/15 text-destructive" },
}

const ORDER: AgendaStatus[] = ["today", "upcoming", "overdue", "completed"]

export default function RemindersPage() {
  const { agendas, toggleComplete, deleteAgenda } = useAgendas()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Agenda | null>(null)

  useEffect(() => {
    const todayItems = agendas.filter(
      (a) => !a.completed && agendaStatus(a) === "today"
    )

    if (todayItems.length > 0) {
      toast.warning(
        `Ada ${todayItems.length} agenda yang jatuh tempo hari ini!`
      )
    }
  }, [agendas])

  const grouped = useMemo(() => {
    const g: Record<AgendaStatus, Agenda[]> = {
      upcoming: [],
      today: [],
      completed: [],
      overdue: [],
    }
    for (const a of agendas) g[agendaStatus(a)].push(a)
    return g
  }, [agendas])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(a: Agenda) {
    setEditing(a)
    setDialogOpen(true)
  }

  const tabs: ("all" | AgendaStatus)[] = ["all", ...ORDER]

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Reminder Deadline"
        description="Pantau status semua agenda dan tenggat waktu Anda"
      >
        <Button onClick={openAdd}>
          <Plus className="size-4" /> Tambah
        </Button>
      </PageHeader>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ORDER.map((s) => {
          const { label, icon: Icon, cls } = STATUS_META[s]
          return (
            <Card key={s}>
              <CardContent className="flex items-center gap-3 p-4">
                <span className={cn("flex size-10 items-center justify-center rounded-lg", cls)}>
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-xl font-semibold leading-none">{grouped[s].length}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4 flex w-full flex-wrap">
          {tabs.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "all" ? "Semua" : STATUS_META[t].label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          <AgendaItems
            items={agendas}
            onToggle={toggleComplete}
            onEdit={openEdit}
            onDelete={deleteAgenda}
          />
        </TabsContent>
        {ORDER.map((s) => (
          <TabsContent key={s} value={s} className="space-y-3">
            <AgendaItems
              items={grouped[s]}
              onToggle={toggleComplete}
              onEdit={openEdit}
              onDelete={deleteAgenda}
            />
          </TabsContent>
        ))}
      </Tabs>

      <AgendaDialog open={dialogOpen} onOpenChange={setDialogOpen} editing={editing} />
    </div>
  )
}

function AgendaItems({
  items,
  onToggle,
  onEdit,
  onDelete,
}: {
  items: Agenda[]
  onToggle: (id: string) => void
  onEdit: (a: Agenda) => void
  onDelete: (id: string) => void
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-12 text-center text-sm text-muted-foreground">
        Tidak ada agenda di kategori ini.
      </div>
    )
  }
  return (
    <>
      {items.map((a) => {
        const status = agendaStatus(a)
        const { label, cls } = STATUS_META[status]
        return (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-3 p-4">
              <button
                onClick={() => onToggle(a.id)}
                className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
                aria-label={a.completed ? "Tandai belum selesai" : "Tandai selesai"}
              >
                {a.completed ? (
                  <CheckCircle2 className="size-5 text-chart-2" />
                ) : (
                  <Circle className="size-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "truncate text-sm font-medium",
                    a.completed && "text-muted-foreground line-through",
                  )}
                >
                  {a.title}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(a.date)}</p>
              </div>
              <Badge className={cn("shrink-0 border-0", cls)}>{label}</Badge>
              <div className="flex shrink-0 gap-1">
                <button
                  onClick={() => onEdit(a)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Edit"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => {
                    onDelete(a.id)
                    toast.success("Agenda dihapus.")
                  }}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Hapus"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
