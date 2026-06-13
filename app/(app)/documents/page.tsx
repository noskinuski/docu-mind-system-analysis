"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { DocumentList } from "@/components/document-list"
import { UploadDialog } from "@/components/upload-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useDocs } from "@/hooks/use-documind"
import { DEFAULT_FOLDERS } from "@/lib/constants"
import type { FolderKey } from "@/lib/types"
import { cn } from "@/lib/utils"

function DocumentsInner() {
  const params = useSearchParams()
  const { docs } = useDocs()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [folder, setFolder] = useState<FolderKey | "all">("all")
  const [uploadOpen, setUploadOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter((d) => {
      const matchFolder = folder === "all" || d.folder === folder
      const matchQuery = !q || d.name.toLowerCase().includes(q)
      return matchFolder && matchQuery
    })
  }, [docs, query, folder])

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dokumen"
        description={`${docs.length} dokumen tersimpan di arsip Anda`}
      >
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="size-4" /> Upload
        </Button>
      </PageHeader>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama dokumen secara real-time..."
          className="pl-9"
        />
      </div>

      {/* Folder filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip
          active={folder === "all"}
          onClick={() => setFolder("all")}
          label="Semua"
          count={docs.length}
        />
        {DEFAULT_FOLDERS.map((f) => (
          <FilterChip
            key={f.key}
            active={folder === f.key}
            onClick={() => setFolder(f.key)}
            label={f.name}
            count={docs.filter((d) => d.folder === f.key).length}
          />
        ))}
      </div>

      <DocumentList docs={filtered} />

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted",
      )}
    >
      {label}
      <Badge
        variant="secondary"
        className={cn(
          "px-1.5 py-0 text-xs",
          active && "bg-primary-foreground/20 text-primary-foreground",
        )}
      >
        {count}
      </Badge>
    </button>
  )
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsInner />
    </Suspense>
  )
}
