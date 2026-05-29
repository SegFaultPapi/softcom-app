"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { supabase } from "@/lib/supabase"

export type Role = "admin" | "gerente_cartera" | "analyst"

export type User = {
  id: string
  nombre: string
  email: string
  role: Role
}

type AuthContextType = {
  user: User | null
  logout: () => void
  loadingRole: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fallback local: si el email no está en Supabase se usa este mapa.
const ROLE_BY_EMAIL: Record<string, Role> = {
  "0xandres.rmdo@gmail.com":         "admin",
  "0xandres.rmdo+gerente@gmail.com": "gerente_cartera",
  "0xandres.rmdo+analyst@gmail.com": "analyst",
}

function fallbackRole(email: string | null | undefined): Role {
  if (email && ROLE_BY_EMAIL[email]) return ROLE_BY_EMAIL[email]
  return "analyst"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: privyUser, logout: privyLogout } = usePrivy()

  const email = privyUser?.email?.address ?? privyUser?.google?.email ?? null
  const nombre = privyUser?.google?.name ?? email ?? privyUser?.id ?? ""

  const [role, setRole] = useState<Role>(fallbackRole(email))
  const [loadingRole, setLoadingRole] = useState(false)

  useEffect(() => {
    if (!email) {
      setRole(fallbackRole(null))
      return
    }

    setLoadingRole(true)

    supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data?.role) {
          setRole(data.role as Role)
        } else {
          setRole(fallbackRole(email))
        }
        setLoadingRole(false)
      })
  }, [email])

  const user: User | null = privyUser
    ? { id: privyUser.id, nombre, email: email ?? "", role }
    : null

  return (
    <AuthContext.Provider value={{ user, logout: privyLogout, loadingRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
