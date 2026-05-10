"use client"

import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShieldAlert, TrendingDown, Clock, Wallet } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

// Tipos de alerta según enum tipo_alerta_enum del SQL
const TIPO_ALERTA = [
  { value: "riesgo_mercado",      label: "Riesgo de Mercado",      icon: TrendingDown, color: "#ef4444", desc: "Caída significativa de precio" },
  { value: "riesgo_credito",      label: "Riesgo de Crédito",      icon: ShieldAlert,  color: "#f59e0b", desc: "Problemas con el emisor" },
  { value: "riesgo_liquidez",     label: "Riesgo de Liquidez",     icon: Wallet,       color: "#a855f7", desc: "Falta de compradores" },
  { value: "vencimiento_proximo", label: "Vencimiento Próximo",    icon: Clock,        color: "#3b82f6", desc: "Instrumento por vencer" },
  { value: "alerta_presupuesto",  label: "Alerta de Presupuesto",  icon: AlertTriangle,color: "#00c2e0", desc: "Presupuesto superado" },
]

export default function AlertasPage() {
  return (
    <RouteGuard allowedRoles={["gerente_cartera"]}>
      <AlertasContent />
    </RouteGuard>
  )
}

function AlertasContent() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <PageHeader
        title="Alertas de Riesgo"
        description="Monitorea alertas activas para las empresas del portafolio."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Alertas de Riesgo" },
        ]}
        tag="Gestión de riesgos"
      />

      {/* Tipos de alerta */}
      <div className="grid gap-3 sm:grid-cols-5 mb-6">
        {TIPO_ALERTA.map((t) => {
          const Icon = t.icon
          return (
            <div key={t.value} style={{
              background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
              padding: "16px", textAlign: "center",
              borderTop: `3px solid ${t.color}`,
            }}>
              <Icon size={20} color={t.color} style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0b1629", marginBottom: 2 }}>{t.label}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{t.desc}</div>
            </div>
          )
        })}
      </div>

      {/* Alertas activas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Alertas activas
          </CardTitle>
          <CardDescription>
            Alertas pendientes de resolución para las empresas asignadas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertTriangle className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Sin alertas activas</EmptyTitle>
              <EmptyDescription>
                No hay alertas de riesgo pendientes. El sistema genera alertas automáticas
                cuando detecta vencimientos próximos, caídas de precio o límites de presupuesto superados.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}
