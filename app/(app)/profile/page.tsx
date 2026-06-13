"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Save, LogOut, FileText, CalendarCheck, FolderOpen, Trash } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useProfile,
  useAuth,
  useDocs,
  useAgendas,
} from "@/hooks/use-documind"
import { DEFAULT_FOLDERS, STORAGE_KEYS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ROLES = ["Mahasiswa", "Pelajar", "Organisasi Kampus", "Karyawan"]

export default function ProfilePage() {
  const router = useRouter()
  const { profile, setProfile } = useProfile()
  const { logout } = useAuth()
  const { docs } = useDocs()
  const { agendas } = useAgendas()

  const [name, setName] = useState(profile.name)
const [email, setEmail] = useState(profile.email)
const [role, setRole] = useState(profile.role)
const [institution, setInstitution] = useState(profile.institution)

useEffect(() => {
  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      const newName = user.email?.split("@")[0] || ""
      const newEmail = user.email || ""

      setName(newName)
      setEmail(newEmail)

      setProfile({
        name: newName,
        email: newEmail,
        role: profile.role,
        institution: profile.institution,
      })
    }
  }

  getUser()
}, [])

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  function save() {
    if (!name.trim()) {
      toast.error("Nama tidak boleh kosong.")
      return
    }
    setProfile({ name: name.trim(), email, role, institution })
    toast.success("Profil berhasil disimpan.")
  }

  function handleLogout() {
    logout()
    router.push("/")
  }

  function clearData() {
    if (typeof window === "undefined") return
    Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k))
    toast.success("Semua data lokal dihapus. Anda akan keluar.")
    setTimeout(() => router.push("/"), 800)
  }

  const stats = [
    { label: "Dokumen", value: docs.length, icon: FileText, cls: "bg-chart-1/15 text-chart-1" },
    { label: "Folder", value: DEFAULT_FOLDERS.length, icon: FolderOpen, cls: "bg-chart-4/15 text-chart-4" },
    { label: "Agenda", value: agendas.length, icon: CalendarCheck, cls: "bg-chart-3/15 text-chart-3" },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Profil" description="Kelola informasi akun dan data aplikasi" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {initials || "DM"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{name}</p>
<p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              {profile.role}
            </span>
            <div className="grid w-full grid-cols-3 gap-2 pt-2">
              {stats.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="rounded-lg border p-2">
                    <span
                      className={cn(
                        "mx-auto mb-1 flex size-7 items-center justify-center rounded-md",
                        s.cls,
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <p className="text-sm font-semibold leading-none">{s.value}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Select
  value={role}
  onValueChange={(value) => setRole(value ?? "")}
>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inst">Institusi</Label>
                <Input
                  id="inst"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={save}>
                <Save className="size-4" /> Simpan Perubahan
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="size-4" /> Keluar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger zone */}
      <Card className="mt-6 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Zona Berbahaya</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground text-pretty">
            Hapus seluruh dokumen, agenda, dan profil yang tersimpan di browser ini.
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <Button variant="destructive" onClick={clearData} className="shrink-0">
            <Trash className="size-4" /> Reset Semua Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
