"use client"

import { useCallback, useMemo } from "react"
import { useLocalStore } from "./use-local-store"
import { STORAGE_KEYS } from "@/lib/constants"
import { todayISODate, uid } from "@/lib/utils-format"
import type { Agenda, AgendaStatus, DocItem, FolderKey, UserProfile } from "@/lib/types"

/* ----------------------------- Auth ----------------------------- */

interface AuthState {
  loggedIn: boolean
  email: string
}

export function useAuth() {
  const [auth, setAuth] = useLocalStore<AuthState>(STORAGE_KEYS.auth, {
    loggedIn: false,
    email: "",
  })

  const login = useCallback(
    (email: string) => setAuth({ loggedIn: true, email }),
    [setAuth],
  )
  const logout = useCallback(() => setAuth({ loggedIn: false, email: "" }), [setAuth])

  return { auth, login, logout }
}

/* --------------------------- Profile ---------------------------- */

const DEFAULT_PROFILE: UserProfile = {
  name: "",
  email: "",
  role: "Mahasiswa/Pekerja/Lainnya",
  institution: "Universitas Negeri Jakarta/Lainnya",
}

export function useProfile() {
  const { auth } = useAuth()

  const [profile, setProfile] = useLocalStore<UserProfile>(
    `${STORAGE_KEYS.profile}_${auth.email}`,
    DEFAULT_PROFILE,
  )

  return { profile, setProfile }
}

/* -------------------------- Documents --------------------------- */

export function useDocs() {
  const { auth } = useAuth()

  const [docs, setDocs] = useLocalStore<DocItem[]>(
    `${STORAGE_KEYS.docs}_${auth.email}`,
    []
  )

  const addDoc = useCallback(
    (doc: Omit<DocItem, "id" | "createdAt">) => {
      setDocs((prev) => [
        { ...doc, id: uid(), createdAt: new Date().toISOString() },
        ...prev,
      ])
    },
    [setDocs],
  )

  const renameDoc = useCallback(
    (id: string, name: string) => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)))
    },
    [setDocs],
  )

  const deleteDoc = useCallback(
  (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, deleted: true }
          : d
      )
    )
  },
  [setDocs],
)

const restoreDoc = useCallback(
  (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, deleted: false }
          : d
      )
    )
  },
  [setDocs],
)
const permanentDeleteDoc = useCallback(
  (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
  },
  [setDocs],
)

  const moveDoc = useCallback(
    (id: string, folder: FolderKey) => {
      setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, folder } : d)))
    },
    [setDocs],
  )

 return {
  docs: docs.filter((d) => !d.deleted),
  deletedDocs: docs.filter((d) => d.deleted),
  addDoc,
  renameDoc,
  deleteDoc,
  restoreDoc,
  permanentDeleteDoc,
  moveDoc,
}
}

/* --------------------------- Agendas ---------------------------- */

export function agendaStatus(a: Agenda): AgendaStatus {
  if (a.completed) return "completed"
  const today = todayISODate()
  if (a.date === today) return "today"
  if (a.date < today) return "overdue"
  return "upcoming"
}

export function useAgendas() {
  
  const { auth } = useAuth()

const [agendas, setAgendas] = useLocalStore<Agenda[]>(
  `${STORAGE_KEYS.agendas}_${auth.email}`,
  []
)
  const addAgenda = useCallback(
    (a: Omit<Agenda, "id" | "createdAt" | "completed">) => {
      setAgendas((prev) => [
        ...prev,
        { ...a, id: uid(), completed: false, createdAt: new Date().toISOString() },
      ])
    },
    [setAgendas],
  )

  const updateAgenda = useCallback(
    (id: string, patch: Partial<Agenda>) => {
      setAgendas((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
    },
    [setAgendas],
  )

  const toggleComplete = useCallback(
    (id: string) => {
      setAgendas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
      )
    },
    [setAgendas],
  )

  const deleteAgenda = useCallback(
    (id: string) => setAgendas((prev) => prev.filter((a) => a.id !== id)),
    [setAgendas],
  )

  const sorted = useMemo(
    () => [...agendas].sort((a, b) => a.date.localeCompare(b.date)),
    [agendas],
  )

  return { agendas: sorted, addAgenda, updateAgenda, toggleComplete, deleteAgenda }
}
