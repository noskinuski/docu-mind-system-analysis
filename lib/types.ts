// Tipe data inti untuk aplikasi DocuMind
// Semua data disimpan di localStorage (tanpa backend)

export type FolderKey =
  | "tugas-kuliah"
  | "proposal"
  | "materi"
  | "organisasi"
  | "administrasi"
  | "pribadi"

export interface Folder {
  key: FolderKey
  name: string
  description: string
}

export interface DocItem {
  id: string
  name: string
  folder: FolderKey
  type: string // mime type
  size: number // bytes
  dataUrl: string // base64 data url, untuk preview & download
  createdAt: string // ISO string
  deleted?: boolean
}

export type AgendaStatus = "upcoming" | "today" | "completed" | "overdue"

export interface Agenda {
  id: string
  title: string
  description: string
  date: string // YYYY-MM-DD
  completed: boolean
  createdAt: string
}

export interface UserProfile {
  name: string
  email: string
  role: string
  institution: string
  avatar?: string // data url
}
