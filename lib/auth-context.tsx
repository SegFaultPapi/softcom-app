"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Role = "admin" | "empleado" | "cliente"

export type User = {
  id: string
  nombre: string
  email: string
  role: Role
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock de usuarios (placeholder hasta conectar backend)
const MOCK_USERS: Array<User & { password: string }> = [
  { id: "1", nombre: "Admin Demo", email: "admin@softcom.com", password: "admin", role: "admin" },
  { id: "2", nombre: "Empleado Demo", email: "empleado@softcom.com", password: "empleado", role: "empleado" },
  { id: "3", nombre: "Cliente Demo", email: "cliente@softcom.com", password: "cliente", role: "cliente" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.sessionStorage.getItem("softcom_user") : null
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    const found = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (!found) return false
    const { password: _pw, ...safeUser } = found
    setUser(safeUser)
    window.sessionStorage.setItem("softcom_user", JSON.stringify(safeUser))
    return true
  }

  const logout = () => {
    setUser(null)
    window.sessionStorage.removeItem("softcom_user")
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}
