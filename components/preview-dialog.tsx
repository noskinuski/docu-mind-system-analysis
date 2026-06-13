"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileIcon } from "@/components/file-icon"
import { formatBytes, formatDate } from "@/lib/utils-format"
import { FOLDER_MAP } from "@/lib/constants"
import type { DocItem } from "@/lib/types"

export function PreviewDialog({
  doc,
  onClose,
}: {
  doc: DocItem | null
  onClose: () => void
}) {
  if (!doc) return null

  const isImage = doc.type.startsWith("image/")
  const isPdf = doc.type === "application/pdf"
  const isText = doc.type.startsWith("text/")

  function download() {
    const a = document.createElement("a")
    a.href = doc!.dataUrl
    a.download = doc!.name
    a.click()
  }

  return (
    <Dialog open={!!doc} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{doc.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{FOLDER_MAP[doc.folder].name}</span>
          <span>·</span>
          <span>{formatBytes(doc.size)}</span>
          <span>·</span>
          <span>{formatDate(doc.createdAt)}</span>
        </div>

        <div className="flex min-h-48 items-center justify-center overflow-hidden rounded-lg border bg-muted/40">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doc.dataUrl || "/placeholder.svg"}
              alt={doc.name}
              className="max-h-[60vh] w-full object-contain"
            />
          ) : isPdf ? (
            <iframe
              src={doc.dataUrl}
              title={doc.name}
              className="h-[60vh] w-full"
            />
          ) : isText ? (
            <iframe
              src={doc.dataUrl}
              title={doc.name}
              className="h-72 w-full bg-background"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
              <FileIcon type={doc.type} name={doc.name} className="size-14" />
              <p className="text-sm text-muted-foreground">
                Pratinjau tidak tersedia untuk tipe berkas ini.
                <br />
                Silakan unduh untuk membukanya.
              </p>
            </div>
          )}
        </div>

        <Button onClick={download} className="w-full">
          <Download className="size-4" /> Download
        </Button>
      </DialogContent>
    </Dialog>
  )
}
