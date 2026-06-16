"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-documind"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Mohon isi email dan password.")
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

console.log("LOGIN DATA:", data)
console.log("LOGIN ERROR:", error)

if (error) {
  toast.error(error.message)
  return
}

toast.success("Berhasil masuk!", {
  description: "Selamat datang di DocuMind 🎉",
  duration: 3000,
})
router.push("/dashboard")
  }
  

  return (
    <main className="flex min-h-screen flex-col lg:flex-row">
      {/* Panel kiri — branding */}
      <section className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex lg:w-1/2">
        <Logo className="text-primary-foreground [&_span>span]:text-primary-foreground" />
        <div className="space-y-6">
          <h1 className="text-balance text-4xl font-semibold leading-tight">
            Satu tempat untuk semua dokumen dan deadline penting Anda.
          </h1>
          <p className="max-w-md text-pretty text-primary-foreground/80 leading-relaxed">
            DocuMind membantu mahasiswa, pelajar, organisasi, dan pekerja menyimpan
            arsip digital dengan rapi, mencari dokumen secara instan, dan tidak
            pernah melewatkan tenggat waktu.
          </p>
          <ul className="space-y-3 text-sm text-primary-foreground/90">
            {[
              "Upload & kelola dokumen dalam folder kategori",
              "Pencarian dokumen real-time",
              "Kalender agenda & pengingat deadline",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary-foreground/20 text-xs">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">
          Document Center for Upload, Control, and Unified Mindful Deadline
        </p>
      </section>

      {/* Panel kanan — form */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2 lg:hidden">
            <Logo />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-semibold tracking-tight">Masuk ke akun</h2>
            <p className="text-sm text-muted-foreground">
  Silakan masuk ke akun Anda.
</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@kampus.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="size-4 rounded border-input accent-primary"
                />
                Ingat saya
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => toast.info("Fitur demo: gunakan email & password apa pun.")}
              >
                Lupa password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg">
  Masuk
</Button>

<Button
  type="button"
  variant="outline"
  className="w-full mt-2"
  onClick={() => router.push("/register")}
>
  Daftar
</Button>
</form>
          <p className="text-center text-xs text-muted-foreground">
            Document Center for Upload, Control and Unified Mindful Deadline. Data disimpan lokal di
            browser Anda.
          </p>
        </div>
      </section>
    </main>
  )
}
