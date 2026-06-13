"use client"

import { useState } from "react"
import {
  MoreVertical,
  Download,
  Pencil,
  Trash2,
  Eye,
  FolderInput,
} from "lucide-react"
import { toast } from "sonner"
import { FileIcon } from "@/components/file-icon"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDocs } from "@/hooks/use-documind"
import { DEFAULT_FOLDERS, FOLDER_MAP } from "@/lib/constants"
import { formatBytes, formatDate } from "@/lib/utils-format"
import type { DocItem, FolderKey } from "@/lib/types"
import { PreviewDialog } from "@/components/preview-dialog"

export function DocumentList({ docs }: { docs: DocItem[] }) {
  const { renameDoc, deleteDoc, moveDoc } = useDocs()
  const [renaming, setRenaming] = useState<DocItem | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deleting, setDeleting] = useState<DocItem | null>(null)
  const [preview, setPreview] = useState<DocItem | null>(null)

  function download(doc: DocItem) {
    const a = document.createElement("a")
    a.href = doc.dataUrl
    a.download = doc.name
    a.click()
    toast.success("Unduhan dimulai.")
  }

  function startRename(doc: DocItem) {
    setRenaming(doc)
    setRenameValue(doc.name)
  }

  function confirmRename() {
    if (!renaming) return
    if (!renameValue.trim()) {
      toast.error("Nama tidak boleh kosong.")
      return
    }
    renameDoc(renaming.id, renameValue.trim())
    toast.success("Nama dokumen diperbarui.")
    setRenaming(null)
  }

  function confirmDelete() {
    if (!deleting) return
    deleteDoc(deleting.id)
    toast.success("Dokumen dihapus.")
    setDeleting(null)
  }

  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Tidak ada dokumen yang cocok.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="group flex items-center gap-3 rounded-xl border bg-card p-3 transition-shadow hover:shadow-md"
          >
            <button
              onClick={() => setPreview(doc)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <FileIcon type={doc.type} name={doc.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {FOLDER_MAP[doc.folder].name} · {formatBytes(doc.size)} ·{" "}
                  {formatDate(doc.createdAt)}
                </p>
              </div>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon" className="size-8 shrink-0" />
                }
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Aksi</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPreview(doc)}>
                  <Eye className="size-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => download(doc)}>
                  <Download className="size-4" /> Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => startRename(doc)}>
                  <Pencil className="size-4" /> Rename
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FolderInput className="size-4" /> Pindah folder
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    {DEFAULT_FOLDERS.map((f) => (
                      <DropdownMenuItem
                        key={f.key}
                        disabled={f.key === doc.folder}
                        onClick={() => {
                          moveDoc(doc.id, f.key as FolderKey)
                          toast.success(`Dipindahkan ke ${f.name}.`)
                        }}
                      >
                        {f.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleting(doc)}
                >
                  <Trash2 className="size-4" /> Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Rename dialog */}
      <Dialog open={!!renaming} onOpenChange={(v) => !v && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ubah Nama Dokumen</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename">Nama berkas</Label>
            <Input
              id="rename"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenaming(null)}>
              Batal
            </Button>
            <Button onClick={confirmRename}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Dokumen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Dokumen{" "}
            <span className="font-medium text-foreground">{deleting?.name}</span>{" "}
            akan dihapus permanen dari penyimpanan lokal.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview */}
      <PreviewDialog doc={preview} onClose={() => setPreview(null)} />
    </>
  )
}
