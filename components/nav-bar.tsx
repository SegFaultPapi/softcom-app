"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { useAuth, type Role } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const LINKS: NavLink[] = [
  { href: "/dashboard", label: "Inicio", roles: ["admin", "empleado", "cliente"] },
  { href: "/valuacion", label: "Valuación", roles: ["empleado", "cliente"] },
  { href: "/portafolio", label: "Portafolio", roles: ["empleado", "cliente"] },
  { href: "/operaciones", label: "Compra / Venta", roles: ["empleado", "cliente"] },
  { href: "/admin/usuarios", label: "Usuarios", roles: ["admin"] },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function NavBar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const visibleLinks = LINKS.filter((l) => l.roles.includes(user.role))

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/dashboard" className="font-semibold">
          SoftCom
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {visibleLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/")
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                      active ? "bg-accent font-medium" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">{initials(user.nombre)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline">{user.nombre}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user.nombre}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                  <span className="mt-1 text-xs capitalize text-muted-foreground">Rol: {user.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile nav */}
      <nav aria-label="Navegación móvil" className="md:hidden">
        <Separator />
        <ul className="flex gap-1 overflow-x-auto px-4 py-2">
          {visibleLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + "/")
            return (
              <li key={link.href} className="shrink-0">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm",
                    active ? "bg-accent font-medium" : "text-muted-foreground",
                  )}
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
