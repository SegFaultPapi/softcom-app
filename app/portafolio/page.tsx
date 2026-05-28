"use client"

import { useState, useCallback } from "react"
import {
  Briefcase, Download, TrendingUp, TrendingDown,
  Wallet, PieChart, BarChart2, Activity,
  ChevronDown, ArrowUpRight, ArrowDownRight,
} from "lucide-react"
import {
  PieChart as RePieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/page-header"

// ── Mock data ──────────────────────────────────────────────
const CLIENTES = [
  { id: "1", nombre: "Inversora del Norte SA" },
  { id: "2", nombre: "Fondo Bajío Capital" },
  { id: "3", nombre: "Corporativo Noreste SA" },
]

const POSICIONES = [
  {
    id: "p1",
    instrumento: "CETES 28d",
    tipo: "CETES",
    cantidad: 1_000_000,
    precioCompra: 9.8912,
    precioActual: 9.9123,
    vencimiento: "2026-06-24",
  },
  {
    id: "p2",
    instrumento: "CETES 91d",
    tipo: "CETES",
    cantidad: 500_000,
    precioCompra: 9.7234,
    precioActual: 9.8534,
    vencimiento: "2026-08-26",
  },
  {
    id: "p3",
    instrumento: "Bono M 7% 2031",
    tipo: "BONO_M",
    cantidad: 20_000,
    precioCompra: 95.50,
    precioActual: 97.20,
    vencimiento: "2031-06-05",
  },
  {
    id: "p4",
    instrumento: "Bono M 8.5% 2029",
    tipo: "BONO_M",
    cantidad: 5_000,
    precioCompra: 102.00,
    precioActual: 99.80,
    vencimiento: "2029-12-05",
  },
]

// ── Computed KPIs ──────────────────────────────────────────
const valorTotal = POSICIONES.reduce((s, p) => s + p.precioActual * p.cantidad, 0)
const capitalDisponible = 3_028_847.32
const capitalTotal = valorTotal + capitalDisponible
const pctInvertido = (valorTotal / capitalTotal) * 100

const plTotal = POSICIONES.reduce((s, p) => s + (p.precioActual - p.precioCompra) * p.cantidad, 0)

// ── Chart data ─────────────────────────────────────────────
const cetesValor = POSICIONES.filter(p => p.tipo === "CETES")
  .reduce((s, p) => s + p.precioActual * p.cantidad, 0)
const bonosValor = POSICIONES.filter(p => p.tipo === "BONO_M")
  .reduce((s, p) => s + p.precioActual * p.cantidad, 0)

const donutData = [
  { name: "CETES", value: cetesValor },
  { name: "Bonos M", value: bonosValor },
]
const DONUT_COLORS = ["#00c2e0", "#3b82f6"]

const barData = POSICIONES.map(p => ({
  name: p.instrumento.length > 14 ? p.instrumento.slice(0, 14) + "…" : p.instrumento,
  valor: +(p.precioActual * p.cantidad / 1_000_000).toFixed(3),
  tipo: p.tipo,
}))

// ── Helpers ────────────────────────────────────────────────
const fmtMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)

const fmtShort = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}K`
  return fmtMXN(n)
}

const fmtInt = (n: number) => new Intl.NumberFormat("es-MX").format(n)
const fmtMono4 = (n: number) => n.toFixed(4)

function exportCSV() {
  const rows = [
    ["Instrumento", "Tipo", "Cantidad", "Precio_Compra", "Precio_Actual", "Valor_Total", "PnL"],
    ...POSICIONES.map(p => [
      p.instrumento, p.tipo,
      p.cantidad,
      p.precioCompra.toFixed(4),
      p.precioActual.toFixed(4),
      (p.precioActual * p.cantidad).toFixed(2),
      ((p.precioActual - p.precioCompra) * p.cantidad).toFixed(2),
    ]),
    ["TOTAL", "", "", "", "",
      valorTotal.toFixed(2),
      plTotal.toFixed(2)],
  ]
  const csv = rows.map(r => r.join(",")).join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url; a.download = "portafolio_cliente_2026-05-27.csv"; a.click()
  URL.revokeObjectURL(url)
}

// ── KPI Card ───────────────────────────────────────────────
function KPICard({
  label, value, sub, icon: Icon, color, trend,
}: {
  label: string; value: string; sub?: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  color: string; trend?: "up" | "down" | "neutral"
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null
  const trendColor = trend === "up" ? "#22c55e" : trend === "down" ? "#ef4444" : "#64748b"
  return (
    <div className="sc-kpi-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={17} color={color} />
        </div>
        {TrendIcon && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TrendIcon size={14} color={trendColor} />
            <span style={{ fontSize: 12, color: trendColor, fontWeight: 600 }}>{sub}</span>
          </div>
        )}
      </div>
      <p className="sc-metric-label" style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</p>
      <p className="sc-number" style={{ fontSize: 22, fontWeight: 600, color: "#0b1629", margin: 0, lineHeight: 1.2 }}>
        {value}
      </p>
      {!TrendIcon && sub && (
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "4px 0 0" }}>{sub}</p>
      )}
    </div>
  )
}

// ── Custom tooltip ─────────────────────────────────────────
function ChartTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: "#0b1629", border: "1px solid rgba(0,194,224,0.25)",
      borderRadius: 8, padding: "8px 12px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <p style={{ color: "#00c2e0", fontSize: 12, margin: "0 0 4px", fontWeight: 600 }}>
        {payload[0].name}
      </p>
      <p className="sc-number" style={{ color: "#fff", fontSize: 14, margin: 0 }}>
        ${payload[0].value.toFixed(2)}M MXN
      </p>
    </div>
  )
}

// ── Main content ───────────────────────────────────────────
function PortafolioContent() {
  const { user } = useAuth()
  const [clienteId, setClienteId] = useState("1")

  if (!user) return null
  const isGerente = user.role === "gerente_cartera"
  const clienteNombre = CLIENTES.find(c => c.id === clienteId)?.nombre ?? ""

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>
      <PageHeader
        title="Portafolio"
        tag="Posiciones activas"
        description="Resumen de capital, posiciones actuales y análisis de distribución."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Portafolio" },
        ]}
        actions={
          <button
            onClick={exportCSV}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 8,
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(0,194,224,0.15)"
              e.currentTarget.style.borderColor = "rgba(0,194,224,0.4)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"
            }}
          >
            <Download size={14} />
            Exportar CSV
          </button>
        }
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>

        {/* Client selector */}
        {isGerente && (
          <div className="anim-fade-up" style={{
            background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
            padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>
              Empresa cliente:
            </span>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <select
                value={clienteId}
                onChange={e => setClienteId(e.target.value)}
                style={{
                  width: "100%", appearance: "none",
                  padding: "9px 36px 9px 14px", borderRadius: 8,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: 14, fontWeight: 600, color: "#0b1629", cursor: "pointer",
                  outline: "none",
                }}
              >
                {CLIENTES.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#94a3b8" style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                pointerEvents: "none",
              }} />
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 20, padding: "3px 10px",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e" }}>Activo</span>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="anim-fade-up delay-1" style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28,
        }}>
          <KPICard
            label="Capital Total"
            value={fmtShort(capitalTotal)}
            sub={`${pctInvertido.toFixed(1)}% invertido`}
            icon={Activity}
            color="#00c2e0"
            trend="neutral"
          />
          <KPICard
            label="Capital Disponible"
            value={fmtShort(capitalDisponible)}
            sub={`${(100 - pctInvertido).toFixed(1)}% del total`}
            icon={Wallet}
            color="#3b82f6"
            trend="neutral"
          />
          <KPICard
            label="Capital Invertido"
            value={fmtShort(valorTotal)}
            sub={`${POSICIONES.length} posiciones`}
            icon={Briefcase}
            color="#6366f1"
            trend="neutral"
          />
          <KPICard
            label="P&L Total"
            value={fmtShort(plTotal)}
            sub={plTotal >= 0 ? "Ganancia" : "Pérdida"}
            icon={plTotal >= 0 ? TrendingUp : TrendingDown}
            color={plTotal >= 0 ? "#22c55e" : "#ef4444"}
            trend={plTotal >= 0 ? "up" : "down"}
          />
        </div>

        {/* Charts + Table row */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 20, marginBottom: 20 }}>

          {/* Charts column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Donut */}
            <div style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px 20px 12px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <PieChart size={15} color="#00c2e0" />
                <span className="sc-display-font" style={{ fontSize: 14, fontWeight: 700, color: "#0b1629" }}>
                  Distribución por tipo
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" }}>CETES vs Bonos M</p>
              <ResponsiveContainer width="100%" height={180}>
                <RePieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={76}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: 12, color: "#64748b", fontFamily: "'DM Sans', sans-serif" }}>
                        {value}
                      </span>
                    )}
                  />
                </RePieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {donutData.map((d, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <p className="sc-number" style={{ fontSize: 16, fontWeight: 600, color: DONUT_COLORS[i], margin: 0 }}>
                      {((d.value / valorTotal) * 100).toFixed(1)}%
                    </p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{d.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div style={{
              background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", padding: "20px 20px 8px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <BarChart2 size={15} color="#3b82f6" />
                <span className="sc-display-font" style={{ fontSize: 14, fontWeight: 700, color: "#0b1629" }}>
                  Valor por posición
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px" }}>Millones MXN</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "'IBM Plex Mono', monospace" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.tipo === "CETES" ? "#00c2e0" : "#3b82f6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Positions table */}
          <div style={{
            background: "#fff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden",
          }}>
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={15} color="#6366f1" />
                <span className="sc-display-font" style={{ fontSize: 14, fontWeight: 700, color: "#0b1629" }}>
                  Posiciones activas
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
                {isGerente ? clienteNombre : "Tu portafolio"} · {POSICIONES.length} instrumentos
              </p>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Instrumento", "Tipo", "Cantidad", "P. Compra", "P. Actual", "Valor Total", "P&L"].map(h => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: h === "Instrumento" || h === "Tipo" ? "left" : "right",
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                        textTransform: "uppercase", color: "#94a3b8",
                        borderBottom: "1px solid #f1f5f9",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {POSICIONES.map((p, idx) => {
                    const pl = (p.precioActual - p.precioCompra) * p.cantidad
                    const isPos = pl >= 0
                    return (
                      <tr
                        key={p.id}
                        style={{
                          background: idx % 2 === 1 ? "#fafbfc" : "#fff",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,194,224,0.04)")}
                        onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 1 ? "#fafbfc" : "#fff")}
                      >
                        <td style={{ padding: "13px 14px" }}>
                          <div>
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#0b1629" }}>
                              {p.instrumento}
                            </p>
                            <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
                              Vto: {new Date(p.vencimiento).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </td>
                        <td style={{ padding: "13px 14px" }}>
                          <span style={{
                            display: "inline-block", padding: "2px 8px", borderRadius: 6,
                            fontSize: 11, fontWeight: 700, letterSpacing: "0.04em",
                            background: p.tipo === "CETES" ? "rgba(0,194,224,0.1)" : "rgba(59,130,246,0.1)",
                            color: p.tipo === "CETES" ? "#00c2e0" : "#3b82f6",
                            border: `1px solid ${p.tipo === "CETES" ? "rgba(0,194,224,0.25)" : "rgba(59,130,246,0.25)"}`,
                          }}>
                            {p.tipo}
                          </span>
                        </td>
                        <td className="sc-number" style={{ padding: "13px 14px", textAlign: "right", fontSize: 13, color: "#0b1629" }}>
                          {fmtInt(p.cantidad)}
                        </td>
                        <td className="sc-number" style={{ padding: "13px 14px", textAlign: "right", fontSize: 13, color: "#64748b" }}>
                          ${fmtMono4(p.precioCompra)}
                        </td>
                        <td className="sc-number" style={{ padding: "13px 14px", textAlign: "right", fontSize: 13, color: "#0b1629", fontWeight: 600 }}>
                          ${fmtMono4(p.precioActual)}
                        </td>
                        <td className="sc-number" style={{ padding: "13px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#0b1629" }}>
                          {fmtShort(p.precioActual * p.cantidad)}
                        </td>
                        <td style={{ padding: "13px 14px", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                            {isPos
                              ? <ArrowUpRight size={13} color="#22c55e" />
                              : <ArrowDownRight size={13} color="#ef4444" />
                            }
                            <span className="sc-number" style={{
                              fontSize: 13, fontWeight: 600,
                              color: isPos ? "#22c55e" : "#ef4444",
                            }}>
                              {isPos ? "+" : ""}{fmtShort(pl)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {/* Totals row */}
                  <tr style={{ borderTop: "2px solid #e2e8f0", background: "#f8fafc" }}>
                    <td colSpan={5} style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, color: "#0b1629" }}>
                      Total
                    </td>
                    <td className="sc-number" style={{ padding: "12px 14px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#0b1629" }}>
                      {fmtShort(valorTotal)}
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <span className="sc-number" style={{
                        fontSize: 14, fontWeight: 700,
                        color: plTotal >= 0 ? "#22c55e" : "#ef4444",
                      }}>
                        {plTotal >= 0 ? "+" : ""}{fmtShort(plTotal)}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Note */}
        <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center" }}>
          Datos de demostración · Precios actualizados al cierre de operaciones · {new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  )
}

export default function PortafolioPage() {
  return (
    <RouteGuard allowedRoles={["gerente_cartera", "analyst"]}>
      <PortafolioContent />
    </RouteGuard>
  )
}
