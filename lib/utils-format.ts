// Helper umum untuk format & util

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function formatDateLong(date: string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

// Ubah File menjadi base64 data url agar bisa disimpan di localStorage
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function fileEmoji(type: string, name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  if (type.startsWith("image/")) return "image"
  if (type === "application/pdf" || ext === "pdf") return "pdf"
  if (["doc", "docx"].includes(ext)) return "doc"
  if (["xls", "xlsx", "csv"].includes(ext)) return "sheet"
  if (["ppt", "pptx"].includes(ext)) return "slide"
  return "file"
}
