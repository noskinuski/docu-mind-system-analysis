"use client"

import { useCallback, useSyncExternalStore } from "react"

// Hook generik untuk membaca/menulis state yang disinkronkan ke localStorage.
// Memakai useSyncExternalStore agar semua komponen ter-update bersamaan.

type Listener = () => void
const listeners = new Set<Listener>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  const handler = () => listener()
  window.addEventListener("storage", handler)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handler)
  }
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function useLocalStore<T>(key: string, fallback: T) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return JSON.stringify(fallback)
    return window.localStorage.getItem(key) ?? JSON.stringify(fallback)
  }, [key, fallback])

  const raw = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => JSON.stringify(fallback),
  )

  let value: T
  try {
    value = raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    value = fallback
  }

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read<T>(key, fallback)
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next
      window.localStorage.setItem(key, JSON.stringify(resolved))
      emit()
    },
    [key, fallback],
  )

  return [value, setValue] as const
}
