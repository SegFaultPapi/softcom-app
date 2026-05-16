"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Roles reales según tabla `roles` del modelo SoftCom
export type Role = "admin" | "gerente_cartera" | "analyst"

export type User = {
  id: string
  nombre: string
  email: string
  role: Role
  // En producción vendrá del JWT/session: id_empresa, id_usuario, etc.
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock de usuarios (placeholder hasta conectar backend PostgreSQL)
// Basado en la tabla `usuarios` + `roles` del modelo relacional SoftCom
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "1",
    nombre: "Admin Demo",
    email: "admin@softcom.mx",
    password: "admin",
    role: "admin",
    // En BD: id_rol = 1 (admin)
  },
  {
    id: "2",
    nombre: "Carlos Montes",
    email: "gerente@softcom.mx",
    password: "gerente",
    role: "gerente_cartera",
    // En BD: id_rol = 2 (gerente_cartera), asignado a empresa via roles_empresa
  },
  {
    id: "3",
    nombre: "Analista Demo",
    email: "analyst@softcom.mx",
    password: "analyst",
    role: "analyst",
    // En BD: id_rol = 3 (analyst)
  },
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
