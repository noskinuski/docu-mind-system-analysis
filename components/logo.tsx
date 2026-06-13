import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
  <Image
  src="/logo documind.png"
  alt="DocuMind Logo"
  width={200}
  height={200}
/>
)
}
