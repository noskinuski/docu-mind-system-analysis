"use client"

import type React from "react"
import { supabase } from "@/lib/supabase"
import { useRef, useState } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_FOLDERS } from "@/lib/constants"
import { fileToDataUrl, formatBytes } from "@/lib/utils-format"
import { useDocs } from "@/hooks/use-documind"
import type { FolderKey } from "@/lib/types"
import { FileIcon } from "@/components/file-icon"

// Batas ukuran agar localStorage tidak penuh (sekitar 10MB)
const MAX_SIZE = 10 * 1024 * 1024

export function UploadDialog({
  open,
  onOpenChange,
  defaultFolder = "tugas-kuliah",
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  defaultFolder?: FolderKey
}) {
  const { addDoc } = useDocs()
  const [file, setFile] = useState<File | null>(null)
  const [folder, setFolder] = useState<FolderKey>(defaultFolder)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setFile(null)
    setFolder(defaultFolder)
    if (inputRef.current) inputRef.current.value = ""
  }

  function pickFile(f: File | null) {
    if (!f) return
    if (f.size > MAX_SIZE) {
  toast.error(
    `Ukuran berkas maksimal ${MAX_SIZE / (1024 * 1024)} MB.`
  )
  return
}
    setFile(f)
  }

  async function handleSave() {
    if (!file) {
      toast.error("Pilih berkas terlebih dahulu.")
      return
    }
    setSaving(true)
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")

const fileName = `${Date.now()}-${safeName}`

const { error } = await supabase.storage
  .from("documents")
  .upload(fileName, file)

if (error) {
  throw error
}

const { data: publicUrl } = supabase.storage
  .from("documents")
  .getPublicUrl(fileName)

addDoc({
  name: file.name,
  folder,
  type: file.type || "application/octet-stream",
  size: file.size,
  dataUrl: publicUrl.publicUrl,
})
      toast.success("Dokumen berhasil diunggah.")
      reset()
      onOpenChange(false)
    } catch (error: any) {
  console.log(error)
  toast.error(error.message)
}
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Dokumen</DialogTitle>
          <DialogDescription>
            Pilih berkas dan tentukan folder kategorinya.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 px-4 py-8 text-center transition-colors hover:border-primary hover:bg-accent"
          >
            <UploadCloud className="size-7 text-muted-foreground" />
            <span className="text-sm font-medium">Klik untuk memilih berkas</span>
            <span className="text-xs text-muted-foreground">
  Maks. 10 MB
</span>
          </button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          />

          {file && (
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <FileIcon type={file.type} name={file.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Folder</Label>
            <Select value={folder} onValueChange={(v) => setFolder(v as FolderKey)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_FOLDERS.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave} disabled={saving || !file}>
            {saving && <Loader2 className="size-4 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
