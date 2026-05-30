"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp, TrendingDown,
  RotateCcw, Zap,
} from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Separator } from "@/components/ui/separator"

// ── Helpers ────────────────────────────────────────────────
const fmtMXN = (n: number, dec = 4) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: dec, maximumFractionDigits: dec,
  }).format(n)

const fmtInt = (n: number) =>
  new Intl.NumberFormat("es-MX").format(Math.round(n))

// ── Formulas financieras ────────────────────────────────────
function calcCetes(F: number, r: number, N: number, cantidad: number) {
  if (!F || !r || !N || !cantidad || N <= 0) return null
  const rDec = r / 100
  const precioUnitario = F / Math.pow(1 + rDec, N / 360)
  const precioTotal = precioUnitario * cantidad
  return { precioUnitario, precioTotal }
}

function calcBono(F: number, tasaCupon: number, r: number, anios: number, cantidad: number) {
  const N = anios * 2
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
  return { precio, cuponSemestral: A, precioTotal, anios }
}

// ── Input component ─────────────────────────────────────────
function FinInput({
  id, label, value, onChange, suffix, help, step = "any", min,
}: {
  id: string; label: string; value: string | number; onChange: (v: string) => void
  suffix?: string; help?: string; step?: string; min?: string
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
          id={id} type="number" step={step} min={min}
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

// ── Input that validates on blur ────────────────────────────
function FinInputBlur({
  id, label, value, onChange, onBlurValidate, suffix, help, step = "any", min,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  onBlurValidate: (v: string) => void
  suffix?: string; help?: string; step?: string; min?: string
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
          id={id} type="number" step={step} min={min}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlurValidate(value) }}
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
            fontSize: 12, fontWeight: 600, color: "#94a3b8", pointerEvents: "none",
          }}>
            {suffix}
          </span>
        )}
      </div>
      {help && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{help}</p>}
    </div>
  )
}

// ── Static field (non-editable) ─────────────────────────────
function StaticField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "#64748b",
      }}>
        {label}
      </span>
      <div style={{
        padding: "10px 14px", borderRadius: 8,
        border: "1.5px solid #e2e8f0",
        background: "#f8fafc",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 15, fontFamily: "'IBM Plex Mono', monospace", color: "#0b1629", fontWeight: 600 }}>
          {value}
        </span>
        {sub && (
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{sub}</span>
        )}
      </div>
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

// ── CETES días selector ─────────────────────────────────────
const CETES_DIAS = [28, 91, 182, 360]

function DiasSelector({ value, onChange }: { value: number; onChange: (d: number) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{
        fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
        textTransform: "uppercase", color: "#64748b",
      }}>
        Plazo (días)
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {CETES_DIAS.map(d => (
          <button
            key={d}
            type="button"
            onClick={() => onChange(d)}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 8,
              border: `1.5px solid ${value === d ? "#00c2e0" : "#e2e8f0"}`,
              background: value === d ? "rgba(0,194,224,0.08)" : "#fff",
              color: value === d ? "#00c2e0" : "#64748b",
              fontSize: 13, fontWeight: 700,
              fontFamily: "'IBM Plex Mono', monospace",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {d}d
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Limpiar button ──────────────────────────────────────────
function LimpiarBtn({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        border: `1.5px solid ${hover ? "#00c2e0" : "#e2e8f0"}`,
        borderRadius: 7, padding: "6px 12px",
        background: hover ? "rgba(0,194,224,0.06)" : "#fff",
        fontSize: 12, fontWeight: 600,
        color: hover ? "#00c2e0" : "#64748b",
        cursor: "pointer", transition: "all 0.15s",
      }}
    >
      <RotateCcw size={12} />
      Limpiar campos
    </button>
  )
}

// ── CETES Form ──────────────────────────────────────────────
const CETES_VN = 10
const CETES_TASA = 6.5

function CetesForm() {
  const [dias, setDias] = useState(91)
  const [qty, setQty]   = useState("")

  const res = useMemo(
    () => calcCetes(CETES_VN, CETES_TASA, dias, parseFloat(qty)),
    [dias, qty]
  )

  const handleReset = () => { setQty("") }

  return (
    <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">

      {/* ── Left: Inputs ── */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        padding: "28px 24px", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p className="sc-display-font" style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", margin: 0 }}>
              Parámetros CETES
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
              Cupón cero — descuento puro
            </p>
          </div>
          <LimpiarBtn onClick={handleReset} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid grid-cols-2 gap-3">
            <StaticField label="Valor nominal (VN)" value="$10.00" sub="MXN" />
            <StaticField label="Tasa de referencia" value="6.5%" sub="Banxico" />
          </div>

          <DiasSelector value={dias} onChange={setDias} />

          <FinInput
            id="c-qty" label="Número de títulos" value={qty} onChange={setQty}
            help="Cantidad a adquirir" min="1" step="1"
          />
        </div>
      </div>

      {/* ── Right: Live Results ── */}
      <div className="sc-result-panel" style={{ padding: "28px 24px" }}>
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
              <div style={{ marginBottom: 24 }}>
                <p className="sc-metric-label" style={{ color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
                  Precio por título
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span className="sc-price-xl" style={{ color: "#fff" }}>
                    {fmtMXN(res.precioUnitario)}
                  </span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>MXN</span>
                </div>
              </div>

              <Separator style={{ background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />

              <MetricRow label="Precio total" value={fmtMXN(res.precioTotal, 2)} highlight />
              <MetricRow label="Títulos" value={fmtInt(parseFloat(qty))} />
              <MetricRow label="Plazo" value={`${dias} días`} />
            </>
          ) : (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              minHeight: 220, gap: 12,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: "rgba(0,194,224,0.08)", border: "1px solid rgba(0,194,224,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <TrendingUp size={22} color="rgba(0,194,224,0.5)" />
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 14, textAlign: "center", margin: 0 }}>
                Ingresa el número de títulos para ver el resultado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Bono Form ───────────────────────────────────────────────
function BonoForm() {
  const [F, setF]         = useState("100")
  const [cupon, setCupon] = useState("8.50")
  const [r, setR]         = useState("6.50")
  const [anios, setAnios] = useState("")
  const [qty, setQty]     = useState("")

  const res = useMemo(
    () => calcBono(parseFloat(F), parseFloat(cupon), parseFloat(r), parseFloat(anios), parseFloat(qty)),
    [F, cupon, r, anios, qty]
  )

  const handleReset = () => { setAnios(""); setQty("") }

  const VN = parseFloat(F)
  const premiumOrDiscount = res ? (res.precio > VN ? "premium" : "descuento") : null

  const aniosNum = parseInt(anios, 10)
  const aniosValido = !isNaN(aniosNum) && aniosNum > 1

  return (
    <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">

      {/* ── Left: Inputs ── */}
      <div style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
        padding: "28px 24px", display: "flex", flexDirection: "column",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p className="sc-display-font" style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", margin: 0 }}>
              Parámetros Bono
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>
              Tasa fija — pagos semestrales
            </p>
          </div>
          <LimpiarBtn onClick={handleReset} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="grid grid-cols-2 gap-3">
            <FinInput id="b-F" label="Valor nominal (VN)" value={F} onChange={setF} suffix="MXN"
              help="Por título, típico: $100" />
            <FinInput id="b-qty" label="Número de títulos" value={qty} onChange={setQty}
              help="Cantidad a adquirir" min="1" step="1" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FinInput id="b-cupon" label="Tasa cupón anual" value={cupon} onChange={setCupon} suffix="%"
              help="Tasa nominal del instrumento" />
            <FinInput id="b-r" label="Tasa de descuento" value={r} onChange={setR} suffix="%"
              help="Tasa de mercado" />
          </div>

          <div>
            <FinInputBlur
              id="b-anios" label="Años" value={anios} onChange={setAnios}
              onBlurValidate={v => {
                const n = parseInt(v, 10)
                if (v !== "" && (isNaN(n) || n <= 1 || !Number.isInteger(n))) setAnios("")
                else if (v !== "") setAnios(String(n))
              }}
              help="Plazo en años — entero mayor a 1" min="2" step="1"
            />
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, color: "#94a3b8", alignSelf: "center", marginRight: 4 }}>Rápido:</span>
              {[3, 5, 7, 10].map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAnios(String(a))}
                  style={{
                    padding: "5px 12px", borderRadius: 6,
                    border: `1.5px solid ${aniosNum === a ? "#00c2e0" : "#e2e8f0"}`,
                    background: aniosNum === a ? "rgba(0,194,224,0.06)" : "#f8fafc",
                    fontSize: 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace",
                    color: aniosNum === a ? "#00c2e0" : "#0b1629", cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {a}A
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Live Results ── */}
      <div className="sc-result-panel" style={{ padding: "28px 24px" }}>
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
                  Precio por título
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
                  {fmtMXN(Math.abs(res.precio - VN), 4)} vs nominal
                </span>
              </div>

              <Separator style={{ background: "rgba(255,255,255,0.1)", marginBottom: 16 }} />

              <MetricRow label="Precio total" value={fmtMXN(res.precioTotal, 2)} highlight />
              <MetricRow label="Cupón semestral" value={fmtMXN(res.cuponSemestral, 4)} />
              <MetricRow label="Títulos" value={fmtInt(parseFloat(qty))} />
              <MetricRow label="Duración" value={`${res.anios} años`} />
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

// ── Tab switcher ────────────────────────────────────────────
function ValuacionContent() {
  const [tab, setTab] = useState<"cetes" | "bono">("cetes")

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>
      <PageHeader
        title="Valuación de instrumentos"
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Valuación" },
        ]}
      />

      <div className="px-4 md:px-6" style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 48 }}>
        <div style={{
          display: "inline-flex", background: "#fff", border: "1px solid #e2e8f0",
          borderRadius: 10, padding: 4, marginBottom: 24, gap: 4,
        }}>
          {(["cetes", "bono"] as const).map(t => (
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
              {t === "cetes" ? "CETES — Cupón Cero" : "Bono — Tasa Fija"}
            </button>
          ))}
        </div>

        {tab === "cetes" ? <CetesForm /> : <BonoForm />}
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
