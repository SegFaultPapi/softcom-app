"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { usePrivy } from "@privy-io/react-auth"

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
  getAccessToken: () => Promise<string | null>
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
  const { user: privyUser, logout: privyLogout, getAccessToken } = usePrivy()

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

    // Sincroniza el perfil (crea uno nuevo si no existe) y obtiene el rol real
    getAccessToken()
      .then((token) =>
        fetch("/api/auth/sync-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ email, nombre }),
        }),
      )
      .then((res) => {
        if (!res.ok) throw new Error(`sync-profile ${res.status}`)
        return res.json()
      })
      .then((data: { role?: string }) => {
        setRole((data.role as Role) ?? fallbackRole(email))
      })
      .catch(() => setRole(fallbackRole(email)))
      .finally(() => setLoadingRole(false))
  }, [email])

  const user: User | null = privyUser
    ? { id: privyUser.id, nombre, email: email ?? "", role }
    : null

  return (
    <AuthContext.Provider value={{ user, logout: privyLogout, loadingRole, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
