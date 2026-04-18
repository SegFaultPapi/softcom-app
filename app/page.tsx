"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) router.replace("/dashboard")
    else router.replace("/login")
  }, [user, router])

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        <span>Redirigiendo...</span>
      </div>
    </div>
  )
}
