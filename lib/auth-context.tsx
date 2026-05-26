"use client"

import { createContext, useContext, type ReactNode } from "react"
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fallback para demo: si el usuario no tiene metadata.role, se resuelve por email.
const ROLE_BY_EMAIL: Record<string, Role> = {
  "admin@softcom.mx":   "admin",
  "gerente@softcom.mx": "gerente_cartera",
  "analyst@softcom.mx": "analyst",
}

function resolveRole(email: string | null | undefined): Role {
  if (email && ROLE_BY_EMAIL[email]) return ROLE_BY_EMAIL[email]
  return "analyst"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: privyUser, logout: privyLogout } = usePrivy()

  const email = privyUser?.email?.address ?? privyUser?.google?.email ?? null
  const nombre = privyUser?.google?.name ?? email ?? privyUser?.id ?? ""

  const user: User | null = privyUser
    ? {
        id: privyUser.id,
        nombre,
        email: email ?? "",
        role: resolveRole(email),
      }
    : null

  return (
    <AuthContext.Provider value={{ user, logout: privyLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
