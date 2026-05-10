"use client"

import Link from "next/link"
import {
  Calculator, Briefcase, ArrowLeftRight, Users,
  BarChart3, TrendingUp, Activity, ChevronRight,
  Building2, AlertTriangle, FileText, PieChart,
  Coins, Shield, BookOpen
} from "lucide-react"
import { useAuth, type Role } from "@/lib/auth-context"
import { RouteGuard } from "@/components/route-guard"

type MenuItem = {
  href: string
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  roles: Role[]
  color: string
  badge?: string
}

// Módulos alineados al modelo relacional SoftCom
const MENU: MenuItem[] = [

  // ── ADMIN ──────────────────────────────────────────────
  {
    href: "/admin/usuarios",
    title: "Gestión de Usuarios",
    description: "Alta, edición y asignación de roles (admin, gerente_cartera, analyst) para el personal de SoftCom.",
    icon: Users,
    roles: ["admin"],
    color: "#a855f7",
  },
  {
    href: "/admin/usuarios",   // placeholder hasta crear /admin/empresas
    title: "Empresas Cliente",
    description: "Registro y administración de empresas cliente (RFC, domicilio, email). Cada empresa tiene su propio portafolio.",
    icon: Building2,
    roles: ["admin"],
    color: "#00c2e0",
  },
  {
    href: "/admin/usuarios",   // placeholder hasta crear /admin/instrumentos
    title: "Catálogo de Instrumentos",
    description: "Administra el catálogo de CETES, Bonos M, UDIBONOS, Derivados y Acciones disponibles para inversión.",
    icon: Coins,
    roles: ["admin"],
    color: "#f59e0b",
    badge: "Próximamente",
  },

  // ── GERENTE DE CARTERA ──────────────────────────────────
  {
    href: "/portafolio",
    title: "Portafolio",
    description: "Posiciones actuales del portafolio: cantidad de títulos, precio promedio, valor de mercado y saldo de efectivo disponible.",
    icon: Briefcase,
    roles: ["gerente_cartera", "analyst"],
    color: "#3b82f6",
  },
  {
    href: "/operaciones",
    title: "Operaciones",
    description: "Registra transacciones de compra, venta, pago de cupón y derivados. Actualiza posiciones y saldo del portafolio automáticamente.",
    icon: ArrowLeftRight,
    roles: ["gerente_cartera"],
    color: "#22c55e",
  },
  {
    href: "/alertas",
    title: "Alertas de Riesgo",
    description: "Monitorea alertas activas: riesgo de mercado, riesgo crédito, vencimientos próximos, riesgo de liquidez y límites de presupuesto.",
    icon: AlertTriangle,
    roles: ["gerente_cartera"],
    color: "#ef4444",
  },

  // ── ANALYST ────────────────────────────────────────────
  {
    href: "/valuacion",
    title: "Valuación de Instrumentos",
    description: "Calcula precio limpio, precio sucio, interés corrido, duration, duration modificada y volatilidad para CETES, Bonos M y UDIBONOS.",
    icon: Calculator,
    roles: ["gerente_cartera", "analyst"],
    color: "#00c2e0",
  },
  {
    href: "/anualidades",
    title: "Anualidades",
    description: "Calcula valor presente y futuro de anualidades ordinarias, anticipadas y diferidas. Genera tablas de amortización.",
    icon: BookOpen,
    roles: ["analyst"],
    color: "#6366f1",
  },
  {
    href: "/estados-financieros",
    title: "Estados Financieros",
    description: "Balance general (Activo = Pasivo + Capital), estado de resultados e indicadores (ROE, liquidez, solvencia) por empresa.",
    icon: FileText,
    roles: ["analyst"],
    color: "#0891b2",
  },
]

// Stats mock diferenciadas por rol — alineadas a los datos del modelo
const ROLE_STATS: Record<string, { label: string; value: string; color: string }[]> = {
  admin: [
    { label: "Empresas registradas", value: "8", color: "#00c2e0" },
    { label: "Usuarios activos", value: "24", color: "#3b82f6" },
    { label: "Instrumentos en catálogo", value: "47", color: "#a855f7" },
  ],
  gerente_cartera: [
    { label: "Saldo efectivo", value: "$5.0M", color: "#00c2e0" },
    { label: "VaR (1d, 95%)", value: "$125K", color: "#ef4444" },
    { label: "Transacciones mes", value: "38", color: "#22c55e" },
  ],
  analyst: [
    { label: "Instrumentos valuados", value: "47", color: "#00c2e0" },
    { label: "Alertas activas", value: "3", color: "#ef4444" },
    { label: "Reportes generados", value: "12", color: "#6366f1" },
  ],
}

// Etiqueta legible del rol
const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  gerente_cartera: "Gerente de Cartera",
  analyst: "Analista",
}

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
  const stats = ROLE_STATS[user.role] ?? []

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>

      {/* Page header */}
      <div style={{ background: "linear-gradient(90deg,#0b1629 0%,#0d2347 100%)", padding: "36px 0 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="anim-slide-l" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,194,224,0.1)", border: "1px solid rgba(0,194,224,0.25)",
            borderRadius: 20, padding: "4px 14px", marginBottom: 16,
          }}>
            <Activity size={12} color="#00c2e0" />
            <span style={{ color: "#00c2e0", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
              {ROLE_LABEL[user.role]}
            </span>
          </div>
          <h1 className="anim-fade-up delay-2" style={{ color: "#fff", fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
            Hola, {user.nombre.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            {user.email} · Selecciona un módulo para comenzar.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: 16, marginBottom: 36 }}>
            {stats.map((s, i) => {
              const sd = ["anim-fade-up delay-1","anim-fade-up delay-2","anim-fade-up delay-3"][i] ?? "anim-fade-up"
              return (
              <div key={i} className={sd} style={{
                background: "#fff", borderRadius: 14, padding: "22px 24px",
                border: "1px solid #e2e8f0",
                borderLeft: `4px solid ${s.color}`,
              }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{s.label}</div>
              </div>
              )
            })}
          </div>
        )}

        {/* Section title */}
        <div className="anim-fade-up delay-2" style={{ marginBottom: 20 }}>
          <div style={{ color: "#00c2e0", fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
            Módulos disponibles
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0b1629" }}>¿Qué deseas hacer hoy?</h2>
        </div>

        {/* Module cards */}
        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {items.map((item, idx) => {
            const Icon = item.icon
            const mds = ["delay-1","delay-2","delay-3","delay-4","delay-5"]
            return (
              <Link key={`${item.href}-${idx}`} href={item.href} style={{ textDecoration: "none" }}>
                <div className={`anim-fade-up ${mds[idx] ?? ""}`} style={{
                  background: "#fff", borderRadius: 16, padding: "28px 24px",
                  border: "1px solid #e2e8f0",
                  transition: "all 0.25s ease", cursor: "pointer",
                  position: "relative",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(-3px)"
                    el.style.borderColor = item.color
                    el.style.boxShadow = `0 10px 30px rgba(0,0,0,0.08)`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(0)"
                    el.style.borderColor = "#e2e8f0"
                    el.style.boxShadow = "none"
                  }}
                >
                  {item.badge && (
                    <div style={{
                      position: "absolute", top: 16, right: 16,
                      background: `${item.color}18`, border: `1px solid ${item.color}40`,
                      color: item.color, fontSize: 10, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 10, letterSpacing: 0.5,
                    }}>
                      {item.badge}
                    </div>
                  )}
                  <div style={{
                    width: 50, height: 50, borderRadius: 12,
                    background: `${item.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 18,
                  }}>
                    <Icon size={24} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0b1629", marginBottom: 8 }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 18 }}>{item.description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: item.color, fontSize: 13, fontWeight: 600 }}>
                    {item.badge ? "Ver detalle" : "Ir al módulo"} <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* System status bar */}
        <div style={{
          marginTop: 36, background: "linear-gradient(135deg,#0b1629,#0d2347)",
          borderRadius: 16, padding: "24px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart3 size={20} color="#00c2e0" />
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>SOFTCOM Solutions — Motor PostgreSQL</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Gestión de portafolios institucionales v2.0</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Sistema operando</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00c2e0" }} />
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Motor: PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
