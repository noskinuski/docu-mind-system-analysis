import { FileText, FileImage, FileSpreadsheet, Presentation, File } from "lucide-react"
import { fileEmoji } from "@/lib/utils-format"
import { cn } from "@/lib/utils"

const STYLES: Record<string, { icon: typeof File; cls: string }> = {
  image: { icon: FileImage, cls: "bg-chart-3/15 text-chart-3" },
  pdf: { icon: FileText, cls: "bg-chart-5/15 text-chart-5" },
  doc: { icon: FileText, cls: "bg-chart-1/15 text-chart-1" },
  sheet: { icon: FileSpreadsheet, cls: "bg-chart-3/15 text-chart-3" },
  slide: { icon: Presentation, cls: "bg-chart-4/15 text-chart-4" },
  file: { icon: File, cls: "bg-muted text-muted-foreground" },
}

export function FileIcon({
  type,
  name,
  className,
}: {
  type: string
  name: string
  className?: string
}) {
  const kind = fileEmoji(type, name)
  const { icon: Icon, cls } = STYLES[kind] ?? STYLES.file
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-lg",
        cls,
        className,
      )}
    >
      <Icon className="size-5" />
    </span>
  )
}
