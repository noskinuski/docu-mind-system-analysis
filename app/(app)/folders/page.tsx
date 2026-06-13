"use client"

import { useMemo, useState } from "react"
import {
  FolderOpen,
  GraduationCap,
  FileSignature,
  BookOpen,
  Users,
  FileBadge,
  Lock,
  Plus,
  ArrowLeft,
} from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DocumentList } from "@/components/document-list"
import { UploadDialog } from "@/components/upload-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDocs } from "@/hooks/use-documind"
import { DEFAULT_FOLDERS } from "@/lib/constants"
import type { FolderKey } from "@/lib/types"
import { cn } from "@/lib/utils"

const ICONS: Record<FolderKey, { icon: typeof FolderOpen; cls: string }> = {
  "tugas-kuliah": { icon: GraduationCap, cls: "bg-chart-1/15 text-chart-1" },
  proposal: { icon: FileSignature, cls: "bg-chart-4/15 text-chart-4" },
  materi: { icon: BookOpen, cls: "bg-chart-3/15 text-chart-3" },
  organisasi: { icon: Users, cls: "bg-chart-2/15 text-chart-2" },
  administrasi: { icon: FileBadge, cls: "bg-chart-5/15 text-chart-5" },
  pribadi: { icon: Lock, cls: "bg-accent text-accent-foreground" },
}

export default function FoldersPage() {
  const { docs } = useDocs()
  const [active, setActive] = useState<FolderKey | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const f of DEFAULT_FOLDERS) c[f.key] = 0
    for (const d of docs) c[d.folder] = (c[d.folder] ?? 0) + 1
    return c
  }, [docs])

  if (active) {
    const folder = DEFAULT_FOLDERS.find((f) => f.key === active)!
    const folderDocs = docs.filter((d) => d.folder === active)
    return (
      <div className="mx-auto max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2"
          onClick={() => setActive(null)}
        >
          <ArrowLeft className="size-4" /> Semua folder
        </Button>
        <PageHeader
          title={folder.name}
          description={`${folderDocs.length} dokumen · ${folder.description}`}
        >
          <Button onClick={() => setUploadOpen(true)}>
            <Plus className="size-4" /> Upload
          </Button>
        </PageHeader>
        <DocumentList docs={folderDocs} />
        <UploadDialog
          open={uploadOpen}
          onOpenChange={setUploadOpen}
          defaultFolder={active}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Folder"
        description="Kategori bawaan untuk merapikan arsip dokumen Anda"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEFAULT_FOLDERS.map((f) => {
          const { icon: Icon, cls } = ICONS[f.key]
          return (
            <button key={f.key} onClick={() => setActive(f.key)} className="text-left">
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-xl",
                        cls,
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {counts[f.key]} berkas
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{f.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground text-pretty">
                      {f.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          )
        })}
      </div>
    </div>
  )
}
