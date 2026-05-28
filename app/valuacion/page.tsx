"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp, TrendingDown, Minus,
  ShoppingCart, Banknote, RotateCcw,
  ChevronRight, Info, Zap,
} from "lucide-react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

// ── Helpers ────────────────────────────────────────────────
const fmtMXN = (n: number, dec = 4) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  }).format(n)

const fmtPct = (n: number) => `${n.toFixed(4)}%`
const fmtInt = (n: number) =>
  new Intl.NumberFormat("es-MX").format(Math.round(n))

// ── Formulas financieras ────────────────────────────────────
function calcCetes(F: number, r: number, N: number, cantidad: number) {
  if (!F || !r || !N || !cantidad || N <= 0) return null
  const rDec = r / 100
  const precioUnitario = F / Math.pow(1 + rDec, N / 360)
  const precioTotal = precioUnitario * cantidad
  const descuento = ((F - precioUnitario) / F) * 100
  const rendimiento = ((F - precioUnitario) / precioUnitario) * (360 / N) * 100
  return { precioUnitario, precioTotal, descuento, rendimiento }
}

function calcBonoM(F: number, tasaCupon: number, r: number, N: number, cantidad: number) {
  if (!F || !tasaCupon || !r || !N || !cantidad || N <= 0) return null
  const rSem = r / 100 / 2
  const A = (F * tasaCupon) / 100 / 2
  let precio: number
  if (rSem === 0) {
    precio = A * N + F
  } else {
    precio = (A * (1 - Math.pow(1 + rSem, -N))) / rSem + F / Math.pow(1 + rSem, N)
  }
  const precioTotal = precio * cantidad
  const duracionAnios = N / 2
  return { precio, cuponSemestral: A, precioTotal, duracion: N, duracionAnios }
}

// ── Input component ─────────────────────────────────────────
function FinInput({
  id, label, value, onChange, suffix, help, type = "number", step = "any", min,
}: {
  id: string; label: string; value: string | number; onChange: (v: string) => void
  suffix?: string; help?: string; type?: string; step?: string; min?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label htmlFor={id} style={{
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "#64748b",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id} type={type} step={step} min={min}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: suffix ? "10px 44px 10px 14px" : "10px 14px",
            borderRadius: 8,
            border: `1.5px solid ${focused ? "#00c2e0" : "#e2e8f0"}`,
            outline: "none", fontSize: 15,
            fontFamily: "'IBM Plex Mono', monospace",
            color: "#0b1629", background: "#fff",
            transition: "border-color 0.15s",
            boxShadow: focused ? "0 0 0 3px rgba(0,194,224,0.1)" : "none",
          }}
        />
        {suffix && (
          <span style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            fontSize: 12, fontWeight: 600, color: "#94a3b8",
            pointerEvents: "none",
          }}>
            {suffix}
          </span>
        )}
      </div>
      {help && (
        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{help}</p>
      )}
    </div>
  )
}

// ── Metric row in result panel ──────────────────────────────
function MetricRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: "0.01em" }}>{label}</span>
      <span className="sc-number" style={{
        fontSize: 14, fontWeight: 600,
        color: highlight ? "#00c2e0" : "rgba(255,255,255,0.9)",
      }}>
        {value}
      </span>
    </div>
  )
}

// ── Quick preset button ─────────────────────────────────────
function Preset({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 12px", borderRadius: 6,
        border: "1.5px solid #e2e8f0", background: "#f8fafc",
        fontSize: 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
        color: "#0b1629", cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#00c2e0"
        e.currentTarget.style.background = "rgba(0,194,224,0.06)"
        e.currentTarget.style.color = "#00c2e0"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#e2e8f0"
        e.currentTarget.style.background = "#f8fafc"
        e.currentTarget.style.color = "#0b1629"
      }}
    >
      {label}
    </button>
  )
}

// ── CETES Form ──────────────────────────────────────────────
function CetesForm() {
  const [F, setF]         = useState("10")
  const [r, setR]         = useState("11.25")
  const [N, setN]         = useState("91")
  const [qty, setQty]     = useState("100000")

  const res = useMemo(
    () => calcCetes(parseFloat(F), parseFloat(r), parseFloat(N), parseFloat(qty)),
    [F, r, N, qty]
  )

  const handleReset = () => { setF("10"); setR("11.25"); setN("91"); setQty("100000") }

  const isPositive = res && res.rendimiento > 0

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

      {/* ── Left: Inputs ── */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        padding: "28px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p className="sc-display-font" style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", margin: 0 }}>
              Parámetros CETES
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
              Cupón cero — <span className="sc-number">P = F / (1+r)^(N/360)</span>
            </p>
          </div>
          <button
            type="button" onClick={handleReset}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "1px solid #e2e8f0", borderRadius: 6,
              padding: "5px 10px", fontSize: 12, color: "#94a3b8", cursor: "pointer",
            }}
          >
            <RotateCcw size={11} />
            Limpiar
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FinInput id="c-F" label="Valor nominal (F)" value={F} onChange={setF} suffix="MXN"
              help="Por título, típico: $10" />
            <FinInput id="c-qty" label="Número de títulos" value={qty} onChange={setQty}
              help="Cantidad a operar" />
          </div>

          <div>
            <FinInput id="c-r" label="Tasa de descuento (r)" value={r} onChange={setR} suffix="%"
              help="Tasa de referencia Banxico" />
          </div>

          <div>
            <FinInput id="c-N" label="Plazo (días)" value={N} onChange={setN}
              help="Días al vencimiento" />
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginRight: 4 }}>Rápido:</span>
              {[28, 91, 182, 364].map(d => (
                <Preset key={d} label={`${d}d`} onClick={() => setN(String(d))} />
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 20, padding: "12px 14px",
          background: "rgba(0,194,224,0.05)", border: "1px solid rgba(0,194,224,0.15)",
          borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <Info size={13} color="#00c2e0" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
            La tasa de referencia Banxico es <strong className="sc-number">11.25%</strong> anual.
            Ajústala si la tasa de mercado difiere en la subasta del día.
          </p>
        </div>
      </div>

      {/* ── Right: Live Results ── */}
      <div className="sc-result-panel" style={{ padding: "28px 24px", minHeight: 360 }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "rgba(0,194,224,0.15)", border: "1px solid rgba(0,194,224,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Zap size={13} color="#00c2e0" />
            </div>
            <span style={{ color: "#00c2e0", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Resultado en tiempo real
            </span>
          </div>

          {res ? (
            <>
              {/* Main price */}
              <div style={{ marginBottom: 6 }}>
                <p className="sc-metric-label" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                  Precio unitario
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="sc-price-xl" style={{ color: "#fff" }}>
                    {fmtMXN(res.precioUnitario)}
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>MXN</span>
                </div>
              </div>

              {/* Rendimiento badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: isPositive ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                border: `1px solid ${isPositive ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                borderRadius: 20, padding: "3px 10px", marginBottom: 24,
              }}>
                {isPositive
                  ? <TrendingUp size={12} color="#22c55e" />
                  : <TrendingDown size={12} color="#ef4444" />
                }
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: isPositive ? "#22c55e" : "#ef4444",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {fmtPct(res.rendimiento)} rendimiento
                </span>
              </div>

              <Separator style={{ background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />

              {/* Metrics */}
              <MetricRow label="Precio total" value={fmtMXN(res.precioTotal, 2)} highlight />
              <MetricRow label="Títulos" value={fmtInt(parseFloat(qty))} />
              <MetricRow label="Descuento implícito" value={fmtPct(res.descuento)} />
              <MetricRow label="Rendimiento anualizado" value={fmtPct(res.rendimiento)} />
              <MetricRow label="Plazo" value={`${N} días`} />

              {/* Action buttons */}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <Link href="/operaciones" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "11px 0", borderRadius: 9,
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                  }}>
                    <ShoppingCart size={14} />
                    Registrar Compra
                  </button>
                </Link>
                <Link href="/operaciones" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "11px 0", borderRadius: 9,
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    color: "#ef4444", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <Banknote size={14} />
                    Registrar Venta
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 260, gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(0,194,224,0.08)", border: "1px solid rgba(0,194,224,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={22} color="rgba(0,194,224,0.5)" />
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textAlign: "center", margin: 0 }}>
                Ingresa los parámetros para ver el resultado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Bono M Form ─────────────────────────────────────────────
function BonoMForm() {
  const [F, setF]         = useState("100")
  const [cupon, setCupon] = useState("8.50")
  const [r, setR]         = useState("11.25")
  const [N, setN]         = useState("10")
  const [qty, setQty]     = useState("10000")

  const res = useMemo(
    () => calcBonoM(parseFloat(F), parseFloat(cupon), parseFloat(r), parseFloat(N), parseFloat(qty)),
    [F, cupon, r, N, qty]
  )

  const handleReset = () => {
    setF("100"); setCupon("8.50"); setR("11.25"); setN("10"); setQty("10000")
  }

  const premiumOrDiscount = res ? (res.precio > parseFloat(F) ? "premium" : "descuento") : null

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

      {/* ── Left: Inputs ── */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        padding: "28px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p className="sc-display-font" style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", margin: 0 }}>
              Parámetros Bono M
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
              Tasa fija — pagos semestrales
            </p>
          </div>
          <button
            type="button" onClick={handleReset}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "1px solid #e2e8f0", borderRadius: 6,
              padding: "5px 10px", fontSize: 12, color: "#94a3b8", cursor: "pointer",
            }}
          >
            <RotateCcw size={11} />
            Limpiar
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FinInput id="bm-F" label="Valor nominal (F)" value={F} onChange={setF} suffix="MXN"
              help="Por título, típico: $100" />
            <FinInput id="bm-qty" label="Número de títulos" value={qty} onChange={setQty}
              help="Cantidad a operar" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FinInput id="bm-cupon" label="Tasa cupón anual" value={cupon} onChange={setCupon} suffix="%"
              help="Tasa nominal del instrumento" />
            <FinInput id="bm-r" label="Tasa de descuento" value={r} onChange={setR} suffix="%"
              help="Tasa de referencia Banxico" />
          </div>

          <div>
            <FinInput id="bm-N" label="Períodos semestrales (N)" value={N} onChange={setN}
              help="Número de pagos de cupón" />
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginRight: 4 }}>Rápido:</span>
              {[{ label: "3A", val: "6" }, { label: "5A", val: "10" }, { label: "7A", val: "14" }, { label: "10A", val: "20" }].map(p => (
                <Preset key={p.val} label={p.label} onClick={() => setN(p.val)} />
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 20, padding: "12px 14px",
          background: "rgba(0,194,224,0.05)", border: "1px solid rgba(0,194,224,0.15)",
          borderRadius: 8, display: "flex", gap: 8, alignItems: "flex-start",
        }}>
          <Info size={13} color="#00c2e0" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
            Si la tasa de mercado {">"} tasa cupón, el bono cotiza a
            {" "}<strong>descuento</strong>. Si {"<"}, cotiza a <strong>premio</strong>.
          </p>
        </div>
      </div>

      {/* ── Right: Live Results ── */}
      <div className="sc-result-panel" style={{ padding: "28px 24px", minHeight: 400 }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "rgba(0,194,224,0.15)", border: "1px solid rgba(0,194,224,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Zap size={13} color="#00c2e0" />
            </div>
            <span style={{ color: "#00c2e0", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Resultado en tiempo real
            </span>
          </div>

          {res ? (
            <>
              <div style={{ marginBottom: 6 }}>
                <p className="sc-metric-label" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                  Precio sucio (P)
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="sc-price-xl" style={{ color: "#fff" }}>
                    {fmtMXN(res.precio)}
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>MXN</span>
                </div>
              </div>

              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: premiumOrDiscount === "premium"
                  ? "rgba(34,197,94,0.12)"
                  : "rgba(239,68,68,0.12)",
                border: `1px solid ${premiumOrDiscount === "premium"
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(239,68,68,0.3)"}`,
                borderRadius: 20, padding: "3px 10px", marginBottom: 24,
              }}>
                {premiumOrDiscount === "premium"
                  ? <TrendingUp size={12} color="#22c55e" />
                  : <TrendingDown size={12} color="#ef4444" />
                }
                <span style={{
                  fontSize: 12, fontWeight: 600,
                  color: premiumOrDiscount === "premium" ? "#22c55e" : "#ef4444",
                  fontFamily: "'IBM Plex Mono', monospace",
                }}>
                  {premiumOrDiscount === "premium" ? "Sobre par" : "Bajo par"}
                  {" — "}
                  {fmtMXN(Math.abs(res.precio - parseFloat(F)), 4)} vs nominal
                </span>
              </div>

              <Separator style={{ background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />

              <MetricRow label="Precio total" value={fmtMXN(res.precioTotal, 2)} highlight />
              <MetricRow label="Cupón semestral (A)" value={fmtMXN(res.cuponSemestral, 4)} />
              <MetricRow label="Títulos" value={fmtInt(parseFloat(qty))} />
              <MetricRow label="Duración" value={`${N} períodos`} />
              <MetricRow label="Duración en años" value={`${res.duracionAnios.toFixed(1)} años`} />

              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <Link href="/operaciones" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "11px 0", borderRadius: 9,
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(34,197,94,0.3)",
                  }}>
                    <ShoppingCart size={14} />
                    Registrar Compra
                  </button>
                </Link>
                <Link href="/operaciones" style={{ flex: 1, textDecoration: "none" }}>
                  <button style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                    padding: "11px 0", borderRadius: 9,
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.35)",
                    color: "#ef4444", fontSize: 13, fontWeight: 700,
                    cursor: "pointer",
                  }}>
                    <Banknote size={14} />
                    Registrar Venta
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 300, gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(0,194,224,0.08)", border: "1px solid rgba(0,194,224,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={22} color="rgba(0,194,224,0.5)" />
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textAlign: "center", margin: 0 }}>
                Ingresa los parámetros para ver el resultado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tab switcher ────────────────────────────────────────────
function ValuacionContent() {
  const [tab, setTab] = useState<"cetes" | "bono_m">("cetes")

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>
      <PageHeader
        title="Valuación de instrumentos"
        description="Parámetros → precio calculado en tiempo real. Tasa Banxico precargada: 11.25%"
        tag="Motor de valuación"
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Valuación" },
        ]}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
        {/* Tab selector */}
        <div style={{
          display: "inline-flex", background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 10, padding: 4, marginBottom: 24, gap: 4,
        }}>
          {(["cetes", "bono_m"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px", borderRadius: 7, border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
                background: tab === t ? "#0b1629" : "transparent",
                color: tab === t ? "#fff" : "#64748b",
                boxShadow: tab === t ? "0 2px 8px rgba(11,22,41,0.2)" : "none",
              }}
            >
              {t === "cetes" ? "CETES — Cupón Cero" : "Bono M — Tasa Fija"}
            </button>
          ))}
        </div>

        {tab === "cetes" ? <CetesForm /> : <BonoMForm />}

        {/* Formula reference */}
        <div style={{
          marginTop: 24, padding: "16px 20px",
          background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
          display: "flex", gap: 32, flexWrap: "wrap",
        }}>
          <div>
            <p className="sc-metric-label" style={{ color: "#94a3b8", marginBottom: 6 }}>Fórmula CETES</p>
            <code className="sc-number" style={{ fontSize: 13, color: "#0b1629" }}>
              P = F / (1 + r)^(N/360)
            </code>
          </div>
          <div style={{ width: 1, background: "#e2e8f0", alignSelf: "stretch" }} />
          <div>
            <p className="sc-metric-label" style={{ color: "#94a3b8", marginBottom: 6 }}>Fórmula Bono M</p>
            <code className="sc-number" style={{ fontSize: 13, color: "#0b1629" }}>
              P = A×[1-(1+r)^-N/r] + F/(1+r)^N
            </code>
          </div>
          <div style={{ width: 1, background: "#e2e8f0", alignSelf: "stretch" }} />
          <div>
            <p className="sc-metric-label" style={{ color: "#94a3b8", marginBottom: 6 }}>Cupón semestral (A)</p>
            <code className="sc-number" style={{ fontSize: 13, color: "#0b1629" }}>
              A = F × (tasa_cupón / 2)
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ValuacionPage() {
  return (
    <RouteGuard allowedRoles={["gerente_cartera", "analyst"]}>
      <ValuacionContent />
    </RouteGuard>
  )
}
