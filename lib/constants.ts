import type { Folder, FolderKey } from "./types"

// Folder/kategori bawaan aplikasi
export const DEFAULT_FOLDERS: Folder[] = [
  { key: "tugas-kuliah", name: "Tugas Kuliah", description: "Tugas, laporan, dan assignment" },
  { key: "proposal", name: "Proposal", description: "Proposal kegiatan dan penelitian" },
  { key: "materi", name: "Materi", description: "Slide, modul, dan bahan ajar" },
  { key: "organisasi", name: "Organisasi", description: "Dokumen kepanitiaan & organisasi" },
  { key: "administrasi", name: "Administrasi", description: "Surat, formulir, dan berkas resmi" },
  { key: "pribadi", name: "Pribadi", description: "Dokumen pribadi dan lainnya" },
]

export const FOLDER_MAP: Record<FolderKey, Folder> = DEFAULT_FOLDERS.reduce(
  (acc, f) => {
    acc[f.key] = f
    return acc
  },
  {} as Record<FolderKey, Folder>,
)

// Storage keys
export const STORAGE_KEYS = {
  auth: "documind:auth",
  docs: "documind:docs",
  agendas: "documind:agendas",
  profile: "documind:profile",
} as const
