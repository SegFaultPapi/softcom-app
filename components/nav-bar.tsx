"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, ChevronDown } from "lucide-react"
import { useAuth, type Role } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type NavLink = {
  href: string
  label: string
  roles: Role[]
}

// Rutas según roles reales del modelo SoftCom
const LINKS: NavLink[] = [
  { href: "/dashboard",      label: "Inicio",               roles: ["admin", "gerente_cartera", "analyst"] },
  { href: "/valuacion",      label: "Valuación",            roles: ["gerente_cartera", "analyst"] },
  { href: "/portafolio",     label: "Portafolio",           roles: ["gerente_cartera", "analyst"] },
  { href: "/operaciones",    label: "Operaciones",          roles: ["gerente_cartera"] },
  { href: "/admin/usuarios", label: "Administración",       roles: ["admin"] },
]

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
}

export function NavBar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/landing")
  }

  const visibleLinks = LINKS.filter((l) => l.roles.includes(user.role))

  return (
    <header style={{
      background: "linear-gradient(90deg, #0b1629 0%, #0d2347 100%)",
      borderBottom: "1px solid rgba(0,194,224,0.2)",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 28 }}>

        {/* Logo */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Image
            src="/SOFTCOM_LOGO.png"
            alt="SOFTCOM Solutions"
            width={160}
            height={48}
            style={{ objectFit: "contain", height: 42, width: "auto" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul style={{ display: "flex", gap: 2, listStyle: "none", margin: 0, padding: 0 }}>
            {visibleLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    style={{
                      display: "block",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      textDecoration: "none",
                      color: active ? "#00c2e0" : "rgba(255,255,255,0.7)",
                      background: active ? "rgba(0,194,224,0.12)" : "transparent",
                      borderBottom: active ? "2px solid #00c2e0" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "#fff"
                        ;(e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.07)"
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)"
                        ;(e.currentTarget as HTMLAnchorElement).style.background = "transparent"
                      }
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User menu */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20, padding: "3px 4px 3px 8px",
          }}>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, textTransform: "capitalize" }}>{user.role}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" style={{ padding: "2px 6px", borderRadius: 16, background: "rgba(0,194,224,0.15)", border: "none" }}>
                  <Avatar style={{ width: 26, height: 26 }}>
                    <AvatarFallback style={{ background: "linear-gradient(135deg, #00c2e0, #1a3a6b)", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                      {initials(user.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginLeft: 6 }} className="hidden sm:inline">{user.nombre.split(" ")[0]}</span>
                  <ChevronDown size={12} color="rgba(255,255,255,0.6)" style={{ marginLeft: 4 }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" style={{ minWidth: 200 }}>
                <DropdownMenuLabel>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontWeight: 700 }}>{user.nombre}</span>
                    <span style={{ fontSize: 11, opacity: 0.6 }}>{user.email}</span>
                    <span style={{ fontSize: 11, color: "#00c2e0", textTransform: "capitalize" }}>Rol: {user.role}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} style={{ color: "#ef4444", cursor: "pointer" }}>
                  <LogOut size={14} style={{ marginRight: 8 }} />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav aria-label="Navegación móvil" className="md:hidden" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ul style={{ display: "flex", gap: 4, overflowX: "auto", padding: "8px 16px", listStyle: "none", margin: 0 }}>
          {visibleLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <li key={link.href} style={{ flexShrink: 0 }}>
                <Link
                  href={link.href}
                  style={{
                    display: "block", padding: "5px 12px", borderRadius: 6, fontSize: 12,
                    fontWeight: active ? 700 : 500, textDecoration: "none",
                    color: active ? "#00c2e0" : "rgba(255,255,255,0.65)",
                    background: active ? "rgba(0,194,224,0.12)" : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
