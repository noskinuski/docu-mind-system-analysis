"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAgendas } from "@/hooks/use-documind"
import type { Agenda } from "@/lib/types"
import { todayISODate } from "@/lib/utils-format"

export function AgendaDialog({
  open,
  onOpenChange,
  editing,
  defaultDate,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  editing?: Agenda | null
  defaultDate?: string
}) {
  const { addAgenda, updateAgenda } = useAgendas()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(defaultDate ?? todayISODate())

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? "")
      setDescription(editing?.description ?? "")
      setDate(editing?.date ?? defaultDate ?? todayISODate())
    }
  }, [open, editing, defaultDate])

  function handleSave() {
    if (!title.trim()) {
      toast.error("Judul agenda wajib diisi.")
      return
    }
    if (editing) {
      updateAgenda(editing.id, { title: title.trim(), description, date })
      toast.success("Agenda diperbarui.")
    } else {
      addAgenda({ title: title.trim(), description, date })
      toast.success("Agenda ditambahkan.")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Agenda" : "Tambah Agenda"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Kumpulkan laporan praktikum"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Catatan (opsional)</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail tambahan tentang agenda ini"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
