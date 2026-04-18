"use client"

import Link from "next/link"
import { Calculator, Briefcase, ArrowLeftRight, Users } from "lucide-react"
import { useAuth, type Role } from "@/lib/auth-context"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type MenuItem = {
  href: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const MENU: MenuItem[] = [
  {
    href: "/valuacion",
    title: "Valuación de bonos",
    description: "Calcula el precio de CETES y Bonos M a partir de sus parámetros.",
    icon: Calculator,
    roles: ["empleado", "cliente"],
  },
  {
    href: "/portafolio",
    title: "Cálculo de portafolio",
    description: "Consulta instrumentos, cantidades y valor actualizado del portafolio.",
    icon: Briefcase,
    roles: ["empleado", "cliente"],
  },
  {
    href: "/operaciones",
    title: "Compra / Venta de bonos",
    description: "Registra operaciones de compra o venta contra el sistema.",
    icon: ArrowLeftRight,
    roles: ["empleado", "cliente"],
  },
  {
    href: "/admin/usuarios",
    title: "Gestión de usuarios",
    description: "Alta, edición y asignación de roles para usuarios del sistema.",
    icon: Users,
    roles: ["admin"],
  },
]

export default function DashboardPage() {
  return (
    <RouteGuard>
      <DashboardContent />
    </RouteGuard>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  if (!user) return null

  const items = MENU.filter((m) => m.roles.includes(user.role))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <PageHeader
        title={`Hola, ${user.nombre}`}
        description="Selecciona una opción para comenzar."
        actions={
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/30">
                <CardHeader>
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
