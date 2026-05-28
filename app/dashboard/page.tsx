"use client"

import Link from "next/link"
import {
  Calculator, Briefcase, ArrowLeftRight, Users,
  BarChart3, TrendingUp, Activity, ChevronRight,
  Building2, AlertTriangle, FileText, PieChart,
  Coins, Shield, BookOpen, ArrowUpRight,
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

const MENU: MenuItem[] = [
  // ── ADMIN ──────────────────────────────────────────────
  {
    href: "/admin/usuarios",
    title: "Gestión de Usuarios",
    description: "Alta, edición y asignación de roles para el personal. Control de accesos al sistema.",
    icon: Users,
    roles: ["admin"],
    color: "#a855f7",
  },
  {
    href: "/admin/usuarios",
    title: "Empresas Cliente",
    description: "Registro y administración de empresas cliente con KYC. Cada empresa tiene su propio portafolio.",
    icon: Building2,
    roles: ["admin"],
    color: "#00c2e0",
  },
  {
    href: "/admin/usuarios",
    title: "Catálogo de Instrumentos",
    description: "Administra CETES, Bonos M, UDIBONOS, Derivados y Acciones disponibles para inversión.",
    icon: Coins,
    roles: ["admin"],
    color: "#f59e0b",
    badge: "Próximamente",
  },

  // ── GERENTE DE CARTERA ──────────────────────────────────
  {
    href: "/portafolio",
    title: "Portafolio",
    description: "Posiciones activas: cantidad de títulos, precio promedio, valor de mercado y P&L.",
    icon: Briefcase,
    roles: ["gerente_cartera", "analyst"],
    color: "#3b82f6",
  },
  {
    href: "/valuacion",
    title: "Valuación de Instrumentos",
    description: "Precio limpio, precio sucio, duration y rendimiento. CETES y Bonos M en tiempo real.",
    icon: Calculator,
    roles: ["gerente_cartera", "analyst"],
    color: "#00c2e0",
  },
  {
    href: "/operaciones",
    title: "Operaciones",
    description: "Compra y venta de instrumentos con trazabilidad completa e inmutable.",
    icon: ArrowLeftRight,
    roles: ["gerente_cartera"],
    color: "#22c55e",
  },
  {
    href: "/alertas",
    title: "Alertas de Riesgo",
    description: "Monitorea alertas activas: riesgo de mercado, crédito, vencimientos y límites.",
    icon: AlertTriangle,
    roles: ["gerente_cartera"],
    color: "#ef4444",
  },

  // ── ANALYST ────────────────────────────────────────────
  {
    href: "/anualidades",
    title: "Anualidades",
    description: "Valor presente y futuro de anualidades ordinarias, anticipadas y diferidas.",
    icon: BookOpen,
    roles: ["analyst"],
    color: "#6366f1",
  },
  {
    href: "/estados-financieros",
    title: "Estados Financieros",
    description: "Balance general, estado de resultados e indicadores ROE, liquidez y solvencia.",
    icon: FileText,
    roles: ["analyst"],
    color: "#0891b2",
  },
]

// Role-specific mock KPIs
const ROLE_STATS: Record<string, {
  label: string; value: string; delta?: string; up?: boolean; color: string
}[]> = {
  admin: [
    { label: "Empresas registradas", value: "8", delta: "+2 este mes", up: true, color: "#00c2e0" },
    { label: "Usuarios activos", value: "24", delta: "100% activos", up: true, color: "#3b82f6" },
    { label: "Instrumentos en catálogo", value: "47", color: "#a855f7" },
  ],
  gerente_cartera: [
    { label: "Capital invertido", value: "$11.97M", delta: "+2.1% mes", up: true, color: "#00c2e0" },
    { label: "P&L total", value: "+$83.0K", delta: "ganancia", up: true, color: "#22c55e" },
    { label: "VaR (1d, 95%)", value: "$125K", delta: "dentro del límite", up: false, color: "#ef4444" },
    { label: "Operaciones (mes)", value: "38", color: "#6366f1" },
  ],
  analyst: [
    { label: "Instrumentos valuados", value: "47", delta: "+5 hoy", up: true, color: "#00c2e0" },
    { label: "Alertas activas", value: "3", delta: "1 crítica", up: false, color: "#ef4444" },
    { label: "Reportes generados", value: "12", color: "#6366f1" },
  ],
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador del Sistema",
  gerente_cartera: "Gerente de Cartera",
  analyst: "Analista de Inversiones",
}

const ROLE_GREETING: Record<string, string> = {
  admin: "Aquí tienes el resumen del sistema.",
  gerente_cartera: "Tu portafolio está activo y monitoreado.",
  analyst: "Aquí tienes tus métricas del día.",
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

  const items = MENU.filter(m => m.roles.includes(user.role))
  const stats = ROLE_STATS[user.role] ?? []
  const now = new Date()
  const timeStr = now.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })
  const dateStr = now.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>

      {/* ── Hero header ── */}
      <div style={{
        background: "linear-gradient(135deg,#0b1629 0%,#0d2347 60%,#0a1f3d 100%)",
        padding: "40px 0 44px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(rgba(0,194,224,1) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />
        <div style={{
          position: "absolute", top: "-20%", right: "5%", width: 300, height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(0,194,224,0.08) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
            <div>
              <div className="anim-slide-l" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,194,224,0.1)", border: "1px solid rgba(0,194,224,0.25)",
                borderRadius: 20, padding: "4px 14px", marginBottom: 14,
              }}>
                <Activity size={11} color="#00c2e0" />
                <span style={{ color: "#00c2e0", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {ROLE_LABEL[user.role]}
                </span>
              </div>

              <h1 className="anim-fade-up delay-1 sc-display-font" style={{
                color: "#fff", fontSize: 32, fontWeight: 800,
                marginBottom: 6, letterSpacing: -0.5, lineHeight: 1.15,
              }}>
                Hola, {user.nombre.split(" ")[0]}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, maxWidth: 500 }}>
                {ROLE_GREETING[user.role]}
              </p>
            </div>

            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "12px 18px",
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 0 0 rgba(34,197,94,0.4)",
                animation: "sc-pulse-ring 2s infinite",
              }} />
              <div>
                <p className="sc-number" style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: 0 }}>{timeStr}</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, margin: 0, textTransform: "capitalize" }}>{dateStr}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 48px" }}>

        {/* ── KPI Stats ── */}
        {stats.length > 0 && (
          <div className="anim-fade-up delay-1" style={{
            display: "grid",
            gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
            gap: 14, marginBottom: 36,
          }}>
            {stats.map((s, i) => (
              <div key={i} className="sc-kpi-card" style={{ borderLeft: `4px solid ${s.color}` }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 }}
                  className="sc-number">
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                {s.delta && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4, marginTop: 8,
                    fontSize: 11, fontWeight: 600,
                    color: s.up === true ? "#22c55e" : s.up === false ? "#ef4444" : "#94a3b8",
                  }}>
                    {s.up === true && <ArrowUpRight size={11} />}
                    {s.up === false && <ArrowUpRight size={11} style={{ transform: "scaleY(-1)" }} />}
                    {s.delta}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── Section heading ── */}
        <div className="anim-fade-up delay-2" style={{ marginBottom: 20, display: "flex", alignItems: "baseline", gap: 14 }}>
          <div>
            <p style={{ color: "#00c2e0", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
              Módulos disponibles
            </p>
            <h2 className="sc-display-font" style={{ fontSize: 22, fontWeight: 800, color: "#0b1629", margin: 0 }}>
              ¿Qué deseas hacer hoy?
            </h2>
          </div>
        </div>

        {/* ── Module cards ── */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", marginBottom: 36 }}>
          {items.map((item, idx) => {
            const Icon = item.icon
            const delays = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6"]
            return (
              <Link key={`${item.href}-${idx}`} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  className={`anim-fade-up ${delays[idx] ?? ""}`}
                  style={{
                    background: "#fff", borderRadius: 16,
                    padding: "26px 22px", border: "1px solid #e2e8f0",
                    height: "100%", boxSizing: "border-box",
                    transition: "all 0.22s ease", cursor: "pointer", position: "relative",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(-3px)"
                    el.style.borderColor = item.color
                    el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.07)`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(0)"
                    el.style.borderColor = "#e2e8f0"
                    el.style.boxShadow = "none"
                  }}
                >
                  {item.badge && (
                    <span style={{
                      position: "absolute", top: 14, right: 14,
                      background: `${item.color}15`, border: `1px solid ${item.color}35`,
                      color: item.color, fontSize: 10, fontWeight: 700,
                      padding: "2px 7px", borderRadius: 10, letterSpacing: "0.05em",
                    }}>
                      {item.badge}
                    </span>
                  )}

                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${item.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16,
                  }}>
                    <Icon size={22} color={item.color} />
                  </div>

                  <h3 className="sc-display-font" style={{
                    fontSize: 16, fontWeight: 700, color: "#0b1629", marginBottom: 7,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {item.description}
                  </p>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 4,
                    color: item.color, fontSize: 13, fontWeight: 700,
                  }}>
                    {item.badge ? "Ver detalle" : "Ir al módulo"}
                    <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── System status footer ── */}
        <div style={{
          background: "linear-gradient(135deg,#0b1629,#0d2347)",
          borderRadius: 16, padding: "22px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BarChart3 size={20} color="#00c2e0" />
            </div>
            <div>
              <p className="sc-display-font" style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>
                SOFTCOM Solutions
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: 0 }}>
                Plataforma de gestión de portafolios institucionales v2.0
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {[
              { dot: "#22c55e", label: "Sistema operando" },
              { dot: "#00c2e0", label: "Motor PostgreSQL" },
              { dot: "#3b82f6", label: "Privy Auth activo" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
