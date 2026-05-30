"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ArrowRight, Menu, X, ChevronRight } from "lucide-react"

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const VISUAL_H = 188
const VISUAL_PAD = "14px 18px"
const VISUAL_BG = "linear-gradient(160deg, #0b1629 0%, #0d2347 100%)"

// ─────────────────────────────────────────────────────────────
// MOCK DASHBOARD — animated 3-screen hero visual
// ─────────────────────────────────────────────────────────────

function ScreenPortafolio() {
  return (
    <>
      {/* KPI row */}
      <div style={{ display: "flex", gap: 8, padding: "16px 16px 10px" }}>
        {[
          { label: "Capital Total", value: "$15.0M", color: "#00c2e0" },
          { label: "Disponible",    value: "$3.0M",  color: "#3b82f6" },
          { label: "Invertido",     value: "$12.0M", color: "#6366f1" },
          { label: "P&L Total",     value: "+$83K",  color: "#22c55e" },
        ].map((k) => (
          <div key={k.label} style={{
            flex: 1, background: "rgba(255,255,255,0.04)", borderRadius: 8,
            padding: "10px 10px", borderLeft: `2px solid ${k.color}`,
          }}>
            <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.35)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{k.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: k.color, fontFamily: "'IBM Plex Mono', monospace" }}>{k.value}</div>
          </div>
        ))}
      </div>
      {/* Charts + table */}
      <div style={{ display: "flex", gap: 8, padding: "4px 16px 10px" }}>
        {/* Donut */}
        <div style={{
          width: 120, background: "rgba(255,255,255,0.03)", borderRadius: 10,
          padding: "10px 10px", flexShrink: 0,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        }}>
          <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.35)", alignSelf: "flex-start", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Distribución</div>
          <div style={{ position: "relative", width: 68, height: 68 }}>
            <div style={{ width: 68, height: 68, borderRadius: "50%", background: "conic-gradient(#00c2e0 0% 80%, #3b82f6 80% 95%, #6366f1 95% 100%)" }} />
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 34, height: 34, borderRadius: "50%", background: "#0b1629",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace" }}>80%</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {[["#00c2e0","CETES"],["#3b82f6","Bono M"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: c }} />
                <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.45)" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Mini table */}
        <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 50px", padding: "7px 10px", background: "rgba(255,255,255,0.05)" }}>
            {["Instrumento","Valor","P&L"].map(h => (
              <span key={h} style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</span>
            ))}
          </div>
          {[
            { name: "CETES 28d",   valor: "$9.9M",  pl: "+$40K", c: "#22c55e" },
            { name: "CETES 91d",   valor: "$4.9M",  pl: "+$65K", c: "#22c55e" },
            { name: "Bono M 7%",   valor: "$1.9M",  pl: "+$34K", c: "#22c55e" },
            { name: "Bono M 8.5%", valor: "$0.5M",  pl: "−$11K", c: "#ef4444" },
          ].map((row, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 60px 50px", padding: "7px 10px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
            }}>
              <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{row.name}</span>
              <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>{row.valor}</span>
              <span style={{ fontSize: 8.5, color: row.c, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{row.pl}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Historial bar chart */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Historial de valor</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 44 }}>
            {[55, 60, 52, 68, 72, 65, 80, 75, 82, 78, 88, 92].map((h, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: "2px 2px 0 0",
                background: i === 11 ? "#00c2e0" : `rgba(0,194,224,${0.18 + (i / 11) * 0.45})`,
                height: `${h}%`,
              }} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function ScreenValuacion() {
  return (
    <div style={{ padding: "16px 16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 7.5, color: "#00c2e0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>CETES — Calculadora</div>
          {[
            { label: "Valor nominal", val: "10.0000", unit: "MXN" },
            { label: "Tasa (r)", val: "11.25", unit: "%" },
            { label: "Plazo", val: "91", unit: "días" },
            { label: "Cantidad", val: "500,000", unit: "títulos" },
          ].map(f => (
            <div key={f.label}>
              <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</div>
              <div style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 5, padding: "5px 8px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 9.5, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{f.val}</span>
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{f.unit}</span>
              </div>
            </div>
          ))}
          {/* Presets */}
          <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
            {["28d","91d","182d","364d"].map(d => (
              <div key={d} style={{
                flex: 1, textAlign: "center", padding: "3px 0",
                borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)",
                fontSize: 7.5, color: "rgba(255,255,255,0.4)",
              }}>{d}</div>
            ))}
          </div>
        </div>
        {/* Result */}
        <div style={{
          background: "rgba(0,194,224,0.06)", border: "1px solid rgba(0,194,224,0.2)",
          borderRadius: 10, padding: "14px 14px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 5,
        }}>
          <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Precio unitario</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>$9.8534</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Rendimiento: 1.490%</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Descuento: $0.1466</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Duration: 0.2493 años</div>
          <div style={{ marginTop: 4, padding: "6px 8px", borderRadius: 5, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
            <span style={{ fontSize: 8.5, color: "#22c55e", fontWeight: 700 }}>Total: $4,926,700.00</span>
          </div>
        </div>
      </div>
      {/* Formula reference */}
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize: 7, color: "rgba(255,255,255,0.25)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Fórmula aplicada</div>
        <div style={{ fontSize: 8.5, color: "rgba(0,194,224,0.7)", fontFamily: "'IBM Plex Mono', monospace" }}>P = F / (1 + r)^(N/360)</div>
      </div>
    </div>
  )
}

function ScreenOperaciones() {
  return (
    <div style={{ padding: "16px 16px 14px" }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 14 }}>
        {["Compra","Venta"].map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: "center", padding: "7px 0", fontSize: 9.5, fontWeight: 700,
            background: i === 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.08)",
            color: i === 0 ? "#22c55e" : "#ef4444",
            borderRadius: i === 0 ? "6px 0 0 6px" : "0 6px 6px 0",
            borderBottom: i === 0 ? "2px solid #22c55e" : "2px solid transparent",
          }}>{t}</div>
        ))}
      </div>
      {[
        { label: "Cliente",          val: "Inversora del Norte SA" },
        { label: "Instrumento",      val: "CETES 91d"              },
        { label: "Precio unitario",  val: "$9.8534 MXN"            },
        { label: "Cantidad",         val: "100,000 títulos"        },
        { label: "Saldo disponible", val: "$3,000,000.00"          },
        { label: "Saldo post-op.",   val: "$2,014,660.00"          },
      ].map(r => (
        <div key={r.label} style={{
          display: "flex", justifyContent: "space-between", padding: "6px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.35)" }}>{r.label}</span>
          <span style={{ fontSize: 8.5, color: "rgba(255,255,255,0.75)", fontFamily: "'IBM Plex Mono', monospace" }}>{r.val}</span>
        </div>
      ))}
      <div style={{
        marginTop: 12, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: 6, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>Importe total</span>
        <span style={{ fontSize: 13, color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>$985,340.00</span>
      </div>
      <div style={{
        marginTop: 8, background: "rgba(34,197,94,0.9)", borderRadius: 6,
        padding: "8px 12px", textAlign: "center",
      }}>
        <span style={{ fontSize: 9, color: "#0b1629", fontWeight: 800, letterSpacing: "0.04em" }}>CONFIRMAR OPERACIÓN</span>
      </div>
    </div>
  )
}

function MockDashboard({ slide, visible }: { slide: number; visible: boolean }) {
  const [screen, setScreen] = useState(slide)

  // Update screen only when faded out → content swaps invisibly, then fades in
  useEffect(() => {
    if (visible) setScreen(slide)
  }, [visible, slide])

  const tabs = ["Portafolio", "Valuación", "Operaciones"]

  return (
    <div style={{
      background: "#0b1629",
      borderRadius: 18,
      border: "1px solid rgba(0,194,224,0.25)",
      overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,194,224,0.1)",
      position: "relative",
    }}>
      {/* Window chrome */}
      <div style={{
        background: "linear-gradient(90deg,#060e1a,#0d2347)",
        borderBottom: "1px solid rgba(0,194,224,0.12)",
        padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", gap: 0, marginLeft: 8 }}>
          {tabs.map((t, i) => (
            <span key={t} style={{
              fontSize: 10, fontWeight: 700, padding: "2px 12px 4px",
              color: i === screen ? "#00c2e0" : "rgba(255,255,255,0.32)",
              borderBottom: i === screen ? "2px solid #00c2e0" : "2px solid transparent",
              transition: "color 0.35s ease, border-color 0.35s ease",
              cursor: "default",
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[36, 52, 28].map((w, i) => (
            <div key={i} style={{ height: 5, width: w, borderRadius: 3, background: "rgba(255,255,255,0.1)" }} />
          ))}
        </div>
      </div>

      {/* Animated screen content — visibility driven by parent */}
      <div style={{
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-10px)",
        minHeight: 330,
      }}>
        {screen === 0 && <ScreenPortafolio />}
        {screen === 1 && <ScreenValuacion />}
        {screen === 2 && <ScreenOperaciones />}
      </div>

      {/* Indicator dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "10px 0 14px" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            height: 5, borderRadius: 3,
            width: i === screen ? 20 : 6,
            background: i === screen ? "#00c2e0" : "rgba(255,255,255,0.18)",
            transition: "all 0.35s ease",
          }} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FEATURE VISUALS — all same height VISUAL_H
// ─────────────────────────────────────────────────────────────

function wrap(content: React.ReactNode, extra?: React.CSSProperties) {
  return (
    <div style={{
      background: VISUAL_BG,
      borderRadius: "12px 12px 0 0",
      padding: VISUAL_PAD,
      height: VISUAL_H,
      overflow: "hidden",
      boxSizing: "border-box",
      position: "relative",
      ...extra,
    }}>
      {content}
      <PlaceholderLabel />
    </div>
  )
}

function FeatureVisual({ type, color }: { type: string; color: string }) {
  if (type === "valuacion") return wrap(
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: "100%" }}>
      {/* Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontSize: 7.5, color: "#00c2e0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>CETES</div>
        {[
          { label: "Valor nominal", val: "10.0000", unit: "MXN" },
          { label: "Tasa (r)", val: "11.25", unit: "%" },
          { label: "Plazo", val: "91", unit: "días" },
        ].map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", marginBottom: 2, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</div>
            <div style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 5, padding: "3px 7px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 9, color: "#fff", fontFamily: "'IBM Plex Mono', monospace" }}>{f.val}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{f.unit}</span>
            </div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
          {["28d","91d","182d","364d"].map(d => (
            <div key={d} style={{
              flex: 1, textAlign: "center", padding: "2px 0",
              borderRadius: 4, border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 7.5, color: "rgba(255,255,255,0.4)",
            }}>{d}</div>
          ))}
        </div>
      </div>
      {/* Result */}
      <div style={{
        background: `${color}0d`, border: `1px solid ${color}30`,
        borderRadius: 10, padding: "10px 12px",
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 3,
      }}>
        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Precio unitario</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.1 }}>$9.8534</div>
        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.35)" }}>Rend.: 1.490%</div>
        <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
          {[["#22c55e","COMPRA"],["#ef4444","VENTA"]].map(([c, l]) => (
            <div key={l} style={{ flex: 1, height: 20, borderRadius: 4, background: `${c}20`, border: `1px solid ${c}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 7.5, color: c, fontWeight: 700 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (type === "portafolio") return wrap(
    <div style={{ display: "flex", gap: 10, height: "100%", alignItems: "flex-end" }}>
      {/* Bar chart */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Valor por posición</div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", flex: 1 }}>
          {[
            { label: "C28", h: 90, c: "#00c2e0" },
            { label: "C91", h: 52, c: "#00c2e0" },
            { label: "BM7", h: 20, c: "#3b82f6" },
            { label: "BM8", h:  6, c: "#3b82f6" },
          ].map(b => (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, height: "100%" }}>
              <div style={{ width: "100%", marginTop: "auto", borderRadius: "3px 3px 0 0", background: b.c, opacity: 0.85, height: `${b.h}%` }} />
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Donut + legend */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingBottom: 16 }}>
        <div style={{ fontSize: 7.5, color: "rgba(255,255,255,0.3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mix</div>
        <div style={{ position: "relative", width: 70, height: 70 }}>
          <div style={{ width: 70, height: 70, borderRadius: "50%", background: "conic-gradient(#00c2e0 0% 80%, #3b82f6 80% 100%)" }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 36, height: 36, borderRadius: "50%", background: "#0b1629",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 9.5, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>80%</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[["#00c2e0","CETES"],["#3b82f6","Bono M"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (type === "operaciones") return wrap(
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <div style={{ display: "flex", gap: 0, marginBottom: 9 }}>
        {["Compra","Venta"].map((t, i) => (
          <div key={t} style={{
            flex: 1, textAlign: "center", padding: "4px 0", fontSize: 8.5, fontWeight: 700,
            background: i === 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.1)",
            color: i === 0 ? "#22c55e" : "#ef4444",
            borderRadius: i === 0 ? "5px 0 0 5px" : "0 5px 5px 0",
            borderBottom: i === 0 ? "2px solid #22c55e" : "2px solid transparent",
          }}>{t}</div>
        ))}
      </div>
      {[
        { label: "Cliente", val: "Inversora del Norte SA" },
        { label: "Instrumento", val: "CETES 91d" },
        { label: "Precio unit.", val: "$9.8534 MXN" },
        { label: "Cantidad", val: "100,000 títulos" },
      ].map(r => (
        <div key={r.label} style={{
          display: "flex", justifyContent: "space-between", padding: "4px 0",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)" }}>{r.label}</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.75)", fontFamily: "'IBM Plex Mono', monospace" }}>{r.val}</span>
        </div>
      ))}
      <div style={{
        marginTop: "auto", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: 6, padding: "5px 10px", display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 8, color: "rgba(255,255,255,0.5)" }}>Importe total</span>
        <span style={{ fontSize: 11, color: "#22c55e", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>$985,340.00</span>
      </div>
    </div>
  )

  if (type === "riesgos") return wrap(
    <div style={{ display: "flex", flexDirection: "column", gap: 7, height: "100%", justifyContent: "center" }}>
      <div style={{ fontSize: 7.5, color: color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>Monitor de alertas activas</div>
      {[
        { level: "CRÍTICA", label: "Vencimiento próximo — CETES 28d",    color: "#ef4444" },
        { level: "MEDIA",   label: "VaR excede límite del 2%",           color: "#f59e0b" },
        { level: "BAJA",    label: "Concentración alta en CETES",        color: "#3b82f6" },
        { level: "INFO",    label: "Actualización de tasa Banxico",      color: "#22c55e" },
      ].map((a) => (
        <div key={a.label} style={{
          display: "flex", alignItems: "center", gap: 8, padding: "5px 10px",
          background: `${a.color}0d`, border: `1px solid ${a.color}25`, borderRadius: 6,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
          <span style={{ fontSize: 7.5, color: a.color, fontWeight: 700, marginRight: 4 }}>{a.level}</span>
          <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.5)" }}>{a.label}</span>
        </div>
      ))}
    </div>
  )

  if (type === "financiero") return wrap(
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <div style={{ fontSize: 7.5, color: color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Balance General</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 20px 1fr", gap: 4, flex: 1 }}>
        {/* Activos */}
        <div>
          <div style={{ fontSize: 7.5, color: "#00c2e0", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 5 }}>Activos</div>
          {[["Inversiones","$12.0M"],["Efectivo","$3.0M"],["Otros","$0.2M"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>{k}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.75)", fontFamily: "'IBM Plex Mono', monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid rgba(0,194,224,0.3)", marginTop: 3 }}>
            <span style={{ fontSize: 8.5, color: "#00c2e0", fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 8.5, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>$15.2M</span>
          </div>
        </div>
        {/* = separator */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3 }}>
          <div style={{ width: 12, height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1 }} />
          <div style={{ width: 12, height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1 }} />
        </div>
        {/* Pasivo + Capital */}
        <div>
          <div style={{ fontSize: 7.5, color: "#3b82f6", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 5 }}>Pasivo + Capital</div>
          {[["Deuda","$2.5M"],["Capital","$12.7M"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.45)" }}>{k}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.75)", fontFamily: "'IBM Plex Mono', monospace" }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid rgba(59,130,246,0.3)", marginTop: 3 }}>
            <span style={{ fontSize: 8.5, color: "#3b82f6", fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 8.5, color: "#3b82f6", fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>$15.2M</span>
          </div>
        </div>
      </div>
      {/* ROE/Liquidez indicators */}
      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {[["ROE","8.2%","#22c55e"],["Liq.","1.44","#00c2e0"],["Solv.","6.1x","#3b82f6"]].map(([k,v,c]) => (
          <div key={k} style={{ flex: 1, background: `${c}10`, borderRadius: 5, padding: "3px 6px", border: `1px solid ${c}25` }}>
            <div style={{ fontSize: 7, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 9.5, color: c, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )

  // multiempresa
  return wrap(
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      <div style={{ fontSize: 7.5, color: color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Empresas cliente</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {[
          { nombre: "Inversora del Norte SA",  rol: "Gerente",  color: "#3b82f6" },
          { nombre: "Fondo Bajío Capital",     rol: "Analista", color: "#00c2e0" },
          { nombre: "Corporativo Noreste SA",  rol: "Admin",    color: "#a855f7" },
          { nombre: "Grupo Financiero Norte",  rol: "Analista", color: "#00c2e0" },
        ].map((u) => (
          <div key={u.nombre} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "5px 10px", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)", borderRadius: 7,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: `${u.color}20`, border: `1px solid ${u.color}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8.5, fontWeight: 800, color: u.color, flexShrink: 0,
            }}>
              {u.nombre[0]}
            </div>
            <span style={{ flex: 1, fontSize: 8.5, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{u.nombre}</span>
            <span style={{
              fontSize: 7.5, fontWeight: 700, color: u.color,
              background: `${u.color}15`, padding: "2px 6px", borderRadius: 10,
              border: `1px solid ${u.color}30`,
            }}>{u.rol}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// NEWS THUMBNAIL
// ─────────────────────────────────────────────────────────────

function NewsThumbnail({ index }: { index: number }) {
  const palettes = [
    { from: "#0b1629", to: "#0d3060", accent: "#00c2e0" },
    { from: "#0b1629", to: "#1a1060", accent: "#3b82f6" },
    { from: "#0b1629", to: "#0a2810", accent: "#22c55e" },
  ]
  const p = palettes[index % 3]
  const points = [70, 55, 75, 60, 80, 65, 85, 70, 90, 78]

  return (
    <div style={{
      width: 88, height: 68, flexShrink: 0, borderRadius: 10, overflow: "hidden",
      background: `linear-gradient(135deg, ${p.from}, ${p.to})`,
      border: "1px solid rgba(255,255,255,0.08)", position: "relative",
    }}>
      <svg width="88" height="68" style={{ position: "absolute", inset: 0 }}>
        <polyline
          points={points.map((y, x) => `${6 + x * 8.5},${60 - y * 0.5}`).join(" ")}
          fill="none" stroke={p.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={0.75}
        />
        <polyline
          points={[
            ...points.map((y, x) => `${6 + x * 8.5},${60 - y * 0.5}`),
            `${6 + (points.length - 1) * 8.5},68`, `6,68`
          ].join(" ")}
          fill={`${p.accent}18`} stroke="none"
        />
        {points.map((y, x) => (
          <circle key={x} cx={6 + x * 8.5} cy={60 - y * 0.5} r={x === points.length - 1 ? 3 : 1.5}
            fill={x === points.length - 1 ? p.accent : `${p.accent}70`} />
        ))}
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CTA MINI PREVIEWS
// ─────────────────────────────────────────────────────────────

function CtaFeaturePreviews() {
  const previews = [
    {
      label: "Valuación en vivo",
      accent: "#00c2e0",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>CETES 91d</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#00c2e0", fontFamily: "'IBM Plex Mono', monospace" }}>$9.8534</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Rendimiento: 1.49%</div>
          <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
            {[["COMPRA","#22c55e"],["VENTA","#ef4444"]].map(([t, c]) => (
              <div key={t} style={{
                flex: 1, padding: "4px 0", borderRadius: 4, textAlign: "center",
                background: `${c}20`, border: `1px solid ${c}35`,
              }}>
                <span style={{ fontSize: 7.5, fontWeight: 700, color: c }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Dashboard integral",
      accent: "#3b82f6",
      content: (
        <div>
          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
            {[["$15M","Total","#00c2e0"],["$3M","Disp.","#3b82f6"],["$12M","Inv.","#6366f1"]].map(([v, l, c]) => (
              <div key={l} style={{ flex: 1, background: `${c}12`, borderRadius: 5, padding: "5px 6px", borderLeft: `2px solid ${c}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: c, fontFamily: "'IBM Plex Mono', monospace" }}>{v}</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.35)" }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 36 }}>
            {[60,72,58,80,68,90,75,88,82,95].map((h, i) => (
              <div key={i} style={{
                flex: 1, borderRadius: "2px 2px 0 0",
                background: i === 9 ? "#3b82f6" : `rgba(59,130,246,${0.2 + i/10 * 0.5})`,
                height: `${h}%`,
              }} />
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Trazabilidad total",
      accent: "#22c55e",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { id: "OP-2847", tipo: "COMPRA", val: "$985K",  c: "#22c55e" },
            { id: "OP-2846", tipo: "VENTA",  val: "$201K",  c: "#ef4444" },
            { id: "OP-2845", tipo: "COMPRA", val: "$1.9M",  c: "#22c55e" },
          ].map(op => (
            <div key={op.id} style={{
              display: "flex", gap: 6, alignItems: "center", padding: "4px 8px",
              background: "rgba(255,255,255,0.04)", borderRadius: 5,
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <span style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{op.id}</span>
              <span style={{ fontSize: 7.5, fontWeight: 700, color: op.c, flex: 1 }}>{op.tipo}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontFamily: "'IBM Plex Mono', monospace" }}>{op.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }}>Log inmutable · auditable</span>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
      {previews.map(p => (
        <div key={p.label} style={{
          width: 220, background: "rgba(255,255,255,0.04)",
          border: `1px solid ${p.accent}30`,
          borderRadius: 14, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", borderBottom: `1px solid ${p.accent}20` }}>
            {p.content}
          </div>
          <div style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.accent }} />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{p.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

/** Tiny PLACEHOLDER watermark inside feature visuals */
function PlaceholderLabel() {
  return (
    <div style={{
      position: "absolute", bottom: 4, right: 8,
      fontSize: 7, color: "rgba(255,255,255,0.12)",
      fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", userSelect: "none",
    }}>
      PLACEHOLDER
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────

const SLIDES = [
  {
    tag: "Plataforma Institucional",
    title: "Gestión de Portafolios de Inversión",
    desc: "Herramientas profesionales para la valuación de bonos, análisis de riesgo y administración de activos financieros en tiempo real.",
    cta: "Acceder al Sistema",
    href: "/login",
    accent: "#00c2e0",
  },
  {
    tag: "Análisis Avanzado",
    title: "Valuación de Instrumentos de Deuda",
    desc: "Calcula precios, duraciones y sensibilidades de bonos gubernamentales con modelos actuariales certificados.",
    cta: "Ver Módulo de Valuación",
    href: "/login",
    accent: "#3b82f6",
  },
  {
    tag: "Reportes Ejecutivos",
    title: "Inteligencia Financiera en Tiempo Real",
    desc: "Dashboards interactivos con métricas de rendimiento, VaR y análisis histórico para toma de decisiones informadas.",
    cta: "Conocer más",
    href: "/login",
    accent: "#22c55e",
  },
]

const SERVICES = [
  { type: "valuacion",    title: "Valuación de Bonos",        desc: "Precio limpio, precio sucio, duration y rendimiento. CETES, Bonos M y UDIBONOS con actualización en tiempo real.", color: "#00c2e0" },
  { type: "portafolio",   title: "Gestión de Portafolio",     desc: "Posiciones por empresa: cantidad de títulos, precio promedio, valor de mercado, VaR y P&L actualizado.", color: "#3b82f6" },
  { type: "operaciones",  title: "Compra y Venta",            desc: "Registro de transacciones con trazabilidad completa e inmutable. Log auditabl con timestamps y usuario ejecutor.", color: "#22c55e" },
  { type: "riesgos",      title: "Gestión de Riesgos",        desc: "Alertas automáticas de riesgo de mercado, crédito, liquidez, vencimientos próximos y límites de presupuesto.", color: "#ef4444" },
  { type: "financiero",   title: "Estados Financieros",       desc: "Balance general (Activo = Pasivo + Capital), estado de resultados e indicadores ROE, liquidez y solvencia.", color: "#6366f1" },
  { type: "multiempresa", title: "Multi-empresa",             desc: "Cada empresa cliente tiene su portafolio independiente, usuarios con roles diferenciados y reportes propios.", color: "#f59e0b" },
]

const STATS = [
  { value: "8+",    label: "Empresas cliente gestionadas", color: "#00c2e0" },
  { value: "47+",   label: "Instrumentos en catálogo",     color: "#3b82f6" },
  { value: "99.9%", label: "Disponibilidad del sistema",   color: "#22c55e" },
  { value: "14",    label: "Módulos del modelo relacional", color: "#6366f1" },
]

const NEWS = [
  { date: "9 mayo 2026",  title: "Soporte para UDIBONOS y bonos con tasa variable", desc: "El módulo de valuación ahora calcula precios ajustados por INPC y soporta bonos referenciados a TIIE." },
  { date: "25 abr 2026", title: "Nuevas alertas automáticas de riesgo", desc: "El sistema genera alertas de riesgo de mercado, crédito y vencimientos próximos desde el portafolio." },
  { date: "10 abr 2026", title: "Módulo de estados financieros y anualidades", desc: "Balance con constraint Activo=Pasivo+Capital, estado de resultados y cálculo de valor presente/futuro." },
]

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────
// MEGA MENU
// ─────────────────────────────────────────────────────────────

const MENU_DATA: Record<string, {
  headline: string
  description: string
  bullets: string[]
  cta: string
  accentColor: string
  imgLabel: string
}> = {
  Plataforma: {
    headline: "Infraestructura institucional",
    description: "Seguridad, control de acceso y auditoría desde el primer día.",
    bullets: ["Autenticación con Email OTP y Google OAuth", "Roles granulares: Admin, Gerente y Analista", "Log inmutable de cada operación y acceso"],
    cta: "Conocer la plataforma",
    accentColor: "#00c2e0",
    imgLabel: "Panel de administración",
  },
  "Casos de uso": {
    headline: "Para cada tipo de institución",
    description: "Adaptado a los flujos de trabajo del mercado de deuda mexicano.",
    bullets: ["Fondos de inversión y gestoras de activos", "Tesorerías corporativas de corto plazo", "Casas de bolsa con trazabilidad regulatoria"],
    cta: "Ver casos de uso",
    accentColor: "#00c2e0",
    imgLabel: "Casos de uso",
  },
}

function MegaMenuPanel({ active }: { active: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id) }, [])

  const menu = MENU_DATA[active]
  if (!menu) return null

  return (
    <div style={{
      background: "rgba(6,14,26,0.98)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
      opacity: mounted ? 1 : 0,
      transform: mounted ? "translateY(0)" : "translateY(-6px)",
      transition: "opacity 0.18s ease, transform 0.18s ease",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "20px 24px 22px",
        display: "grid", gridTemplateColumns: "1fr 200px", gap: 48, alignItems: "center",
      }}>

        {/* Left: headline + 2-col bullets + CTA */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 14 }}>
            <h3 className="sc-display-font" style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0 }}>
              {menu.headline}
            </h3>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{menu.description}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 32px", marginBottom: 16 }}>
            {menu.bullets.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>{b}</span>
              </div>
            ))}
          </div>

          <Link href="/login" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg, #00c2e0, #0099b8)",
            color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 13,
            padding: "8px 18px", borderRadius: 7,
            boxShadow: "0 3px 12px rgba(0,194,224,0.25)",
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85" }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1" }}
          >
            {menu.cta} <ChevronRight size={13} />
          </Link>
        </div>

        {/* Right: image placeholder */}
        <div style={{
          width: "100%", aspectRatio: "4/3",
          background: "linear-gradient(160deg, #0d1f3c 0%, #071628 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 10,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
            {menu.imgLabel}
          </span>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [slide, setSlide] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [navHovered, setNavHovered] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const CARDS_VISIBLE = 3
  const GAP = 20
  const maxCarouselIdx = SERVICES.length - CARDS_VISIBLE

  const startAutoAdvance = useCallback(() => {
    if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current)
    autoAdvanceRef.current = setInterval(() => {
      setCarouselIdx(i => (i >= maxCarouselIdx ? 0 : i + 1))
    }, 2000)
  }, [maxCarouselIdx])

  const carouselPrev = useCallback(() => {
    setCarouselIdx(i => (i <= 0 ? maxCarouselIdx : i - 1))
    startAutoAdvance()
  }, [maxCarouselIdx, startAutoAdvance])

  const carouselNext = useCallback(() => {
    setCarouselIdx(i => (i >= maxCarouselIdx ? 0 : i + 1))
    startAutoAdvance()
  }, [maxCarouselIdx, startAutoAdvance])

  const goToSlide = (next: number) => {
    if (next === slide) return
    setTextVisible(false)
    setTimeout(() => {
      setSlide(next)
      setTextVisible(true)
    }, 420)
  }

  useEffect(() => {
    const t = setInterval(() => {
      setTextVisible(false)
      setTimeout(() => {
        setSlide(s => (s + 1) % SLIDES.length)
        setTextVisible(true)
      }, 420)
    }, 8000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    const measure = () => {
      if (carouselRef.current) {
        const w = carouselRef.current.offsetWidth
        setCardWidth((w - GAP * (CARDS_VISIBLE - 1)) / CARDS_VISIBLE)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  useEffect(() => {
    startAutoAdvance()
    return () => { if (autoAdvanceRef.current) clearInterval(autoAdvanceRef.current) }
  }, [startAutoAdvance])

  const s = SLIDES[slide]

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── NAVBAR + MEGA MENU ── */}
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => { setNavHovered(false); setOpenMenu(null) }}
      >
        <header style={{
          position: "relative",
          background: scrolled || navHovered ? "rgba(11,22,41,0.95)" : "rgba(11,22,41,0.0)",
          backdropFilter: scrolled || navHovered ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,194,224,0.18)" : "none",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.25)" : "none",
          transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.3s ease, box-shadow 0.3s ease",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", gap: 40 }}>

            <Link href="/landing" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
              <Image src="/SOFTCOM_LOGO.png" alt="SOFTCOM Solutions" width={160} height={48}
                style={{ objectFit: "contain", height: 40, width: "auto" }} priority />
            </Link>

            <nav className="hidden md:flex" style={{ display: "flex", gap: 0, alignItems: "center" }}>
              {(["Plataforma","Casos de uso"] as const).map(item => {
                const isActive = openMenu === item
                return (
                  <button key={item}
                    onMouseEnter={e => { setOpenMenu(item); (e.currentTarget as HTMLButtonElement).style.color = "#fff" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)" }}
                    style={{
                      background: "none", border: "none",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
                      fontSize: 16, fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                      padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4, transition: "color 0.15s",
                    }}
                  >
                    {item}
                    <ChevronDown size={12} style={{ opacity: 0.5, transition: "transform 0.2s", transform: isActive ? "rotate(180deg)" : "rotate(0deg)" }} />
                  </button>
                )
              })}
              <Link href="#precios" style={{
                color: "rgba(255,255,255,0.65)", textDecoration: "none",
                fontSize: 16, fontWeight: 500, padding: "8px 14px", borderRadius: 6,
                transition: "color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)" }}
              >
                Precios
              </Link>
            </nav>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
              <Link href="#contacto" style={{
                color: "rgba(255,255,255,0.65)", textDecoration: "none",
                fontSize: 16, fontWeight: 500,
                transition: "color 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#fff" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.65)" }}
              >
                Contacto
              </Link>
              <Link href="/login" style={{
                background: "linear-gradient(135deg, #00c2e0, #0099b8)",
                color: "#fff", textDecoration: "none", fontSize: 16, fontWeight: 700,
                padding: "10px 26px", borderRadius: 7,
                boxShadow: "0 4px 14px rgba(0,194,224,0.3)",
                transition: "opacity 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88" }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1" }}
              >
                Acceder
              </Link>
              <button className="md:hidden" onClick={() => setMenuOpen(o => !o)} style={{
                background: "none", border: "none", color: "#fff", cursor: "pointer",
              }}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mega menu dropdown */}
        {openMenu && <MegaMenuPanel active={openMenu} />}
      </div>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "92vh", paddingTop: 68,
        backgroundImage: "url('/hero-sky.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        {/* Dark overlay for readability */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(11,22,41,0.30) 0%, rgba(13,35,71,0.22) 50%, rgba(6,20,40,0.18) 100%)",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Glows */}
        <div style={{ position: "absolute", top: "5%", right: "6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,194,224,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "8%", left: "0%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,58,107,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 56, alignItems: "center" }}>

            {/* Text */}
            <div>
              {/* Fade container */}
              <div style={{
                transition: "opacity 0.38s ease, transform 0.38s ease",
                opacity: textVisible ? 1 : 0,
                transform: textVisible ? "translateY(0)" : "translateY(12px)",
              }}>
                <h1 className="sc-display-font" style={{
                  color: "#fff", fontSize: "clamp(30px, 3.6vw, 52px)", fontWeight: 900,
                  lineHeight: 1.13, marginBottom: 18, letterSpacing: -0.5,
                  textShadow: "0 2px 20px rgba(0,0,0,0.55)",
                }}>
                  {s.title}
                </h1>
                <p style={{
                  color: "rgba(255,255,255,0.90)", fontSize: 17, lineHeight: 1.75,
                  marginBottom: 36, maxWidth: 450, fontWeight: 500,
                  textShadow: "0 1px 12px rgba(0,0,0,0.45)",
                }}>
                  {s.desc}
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href={s.href} style={{
                    background: "linear-gradient(135deg, #00c2e0, #0099b8)",
                    color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
                    padding: "13px 26px", borderRadius: 9,
                    boxShadow: "0 6px 22px rgba(0,194,224,0.38)",
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.18s",
                  }}>
                    {s.cta} <ArrowRight size={16} />
                  </Link>
                  <Link href="/login" style={{
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 600,
                    padding: "13px 26px", borderRadius: 9, textDecoration: "none",
                    transition: "all 0.18s",
                  }}>
                    Ver demo
                  </Link>
                </div>
              </div>

              {/* Slide indicator dots — outside fade so they don't blink */}
              <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goToSlide(i)} style={{
                    width: i === slide ? 28 : 7, height: 7, borderRadius: 4, border: "none",
                    cursor: "pointer",
                    background: i === slide ? "#00c2e0" : "rgba(255,255,255,0.2)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
            </div>

            {/* Animated mock dashboard */}
            <div className="anim-slide-r delay-2">
              <MockDashboard slide={slide} visible={textVisible} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section style={{
        background: "#0d2347",
        padding: "36px 0",
        borderTop: "1px solid rgba(0,194,224,0.12)",
        borderBottom: "1px solid rgba(0,194,224,0.12)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "8px 0",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
              }}>
                <div className="sc-number" style={{ fontSize: 34, fontWeight: 700, color: stat.color, lineHeight: 1.1 }}>{stat.value}</div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12.5, marginTop: 5 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ── */}
      <section style={{ background: "#fff", padding: "88px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="anim-fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
              Módulos del Sistema
            </div>
            <h2 className="sc-display-font" style={{ fontSize: 36, fontWeight: 800, color: "#0b1629", marginBottom: 14 }}>
              Herramientas Financieras Especializadas
            </h2>
            <p style={{ color: "#64748b", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
              Una suite completa para la gestión profesional de instrumentos de renta fija y portafolios de inversión.
            </p>
          </div>

          {/* Carousel wrapper */}
          <div style={{ position: "relative" }}>

            {/* Prev button */}
            <button
              onClick={carouselPrev}
              style={{
                position: "absolute", left: -20, top: "45%", transform: "translateY(-50%)",
                zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                background: "#0b1629", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                transition: "background 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#00c2e0" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0b1629" }}
            >
              <ChevronRight size={18} color="#fff" style={{ transform: "rotate(180deg)" }} />
            </button>

            {/* Track container */}
            <div ref={carouselRef} style={{ overflow: "hidden" }}>
              <div style={{
                display: "flex", gap: GAP,
                transform: `translateX(-${carouselIdx * (cardWidth + GAP)}px)`,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}>
                {SERVICES.map((svc, i) => (
                  <div
                    key={i}
                    style={{
                      flexShrink: 0, width: cardWidth,
                      background: "#f8fafc", borderRadius: 16,
                      border: "1px solid #e2e8f0", overflow: "hidden",
                      cursor: "pointer", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "translateY(-4px)"
                      el.style.boxShadow = `0 14px 36px rgba(0,0,0,0.09)`
                      el.style.borderColor = svc.color
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.transform = "translateY(0)"
                      el.style.boxShadow = "none"
                      el.style.borderColor = "#e2e8f0"
                    }}
                  >
                    <FeatureVisual type={svc.type} color={svc.color} />
                    <div style={{ padding: "20px 22px" }}>
                      <div style={{
                        display: "inline-block", width: 6, height: 6, borderRadius: "50%",
                        background: svc.color, marginBottom: 9,
                        boxShadow: `0 0 8px ${svc.color}60`,
                      }} />
                      <h3 className="sc-display-font" style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", marginBottom: 7 }}>
                        {svc.title}
                      </h3>
                      <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.65, marginBottom: 14 }}>{svc.desc}</p>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: svc.color, fontSize: 13, fontWeight: 700 }}>
                        Explorar módulo <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={carouselNext}
              style={{
                position: "absolute", right: -20, top: "45%", transform: "translateY(-50%)",
                zIndex: 10, width: 40, height: 40, borderRadius: "50%",
                background: "#0b1629", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                transition: "background 0.2s ease, transform 0.15s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#00c2e0" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#0b1629" }}
            >
              <ChevronRight size={18} color="#fff" />
            </button>

            {/* Dots */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
              {Array.from({ length: maxCarouselIdx + 1 }).map((_, i) => (
                <button key={i} onClick={() => { setCarouselIdx(i); startAutoAdvance() }} style={{
                  width: i === carouselIdx ? 24 : 8, height: 8, borderRadius: 4, border: "none",
                  background: i === carouselIdx ? "#0b1629" : "#cbd5e1",
                  cursor: "pointer", transition: "all 0.3s ease", padding: 0,
                }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTICIAS ── */}
      <section style={{ background: "#f0f4f8", padding: "88px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 52, alignItems: "start" }}>

            {/* News */}
            <div className="anim-slide-l">
              <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Novedades</div>
              <h2 className="sc-display-font" style={{ fontSize: 28, fontWeight: 800, color: "#0b1629", marginBottom: 32 }}>
                Actualizaciones del Sistema
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {NEWS.map((n, i) => (
                  <div key={i} className={`anim-fade-up delay-${i+2}`} style={{
                    background: "#fff", borderRadius: 14, padding: "18px 22px",
                    border: "1px solid #e2e8f0",
                    display: "flex", gap: 16, alignItems: "flex-start",
                    transition: "all 0.2s ease", cursor: "pointer",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#00c2e0"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(0,194,224,0.08)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none" }}
                  >
                    <NewsThumbnail index={i} />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 5, fontWeight: 500 }}>{n.date}</div>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0b1629", marginBottom: 5, lineHeight: 1.4 }}>{n.title}</h3>
                      <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick access */}
            <div className="anim-slide-r delay-1">
              <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Acceso Rápido</div>
              <h2 className="sc-display-font" style={{ fontSize: 28, fontWeight: 800, color: "#0b1629", marginBottom: 32 }}>Módulos</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {[
                  { label: "Dashboard Principal", href: "/dashboard",      accent: "#00c2e0", symbol: "▤" },
                  { label: "Valuación",           href: "/valuacion",      accent: "#3b82f6", symbol: "≈" },
                  { label: "Mi Portafolio",       href: "/portafolio",     accent: "#22c55e", symbol: "◎" },
                  { label: "Operaciones",         href: "/operaciones",    accent: "#a855f7", symbol: "⇄" },
                  { label: "Administración",      href: "/admin/usuarios", accent: "#f59e0b", symbol: "⊞" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 11,
                    padding: "12px 16px", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 12,
                    transition: "all 0.18s",
                  }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.borderColor = item.accent
                      el.style.transform = "translateX(4px)"
                      el.style.boxShadow = `0 4px 14px ${item.accent}18`
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLAnchorElement
                      el.style.borderColor = "#e2e8f0"
                      el.style.transform = "translateX(0)"
                      el.style.boxShadow = "none"
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                      background: "linear-gradient(135deg, #0b1629, #0d2347)",
                      border: `1px solid ${item.accent}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 17, color: item.accent,
                    }}>
                      {item.symbol}
                    </div>
                    <span style={{ color: "#0b1629", fontWeight: 600, fontSize: 13.5, flex: 1 }}>{item.label}</span>
                    <ChevronRight size={14} color="#94a3b8" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #0b1629 0%, #0d2347 55%, #0a1f3d 100%)",
        padding: "88px 0", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 48 }}>
            <CtaFeaturePreviews />
          </div>
          <h2 className="sc-display-font" style={{ color: "#fff", fontSize: 38, fontWeight: 800, marginBottom: 16, letterSpacing: -0.5 }}>
            ¿Listo para optimizar tu portafolio?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 16, marginBottom: 40, lineHeight: 1.75, maxWidth: 540, margin: "0 auto 40px" }}>
            Accede a SOFTCOM y gestiona tus inversiones con herramientas de nivel institucional, trazabilidad completa y resultados en tiempo real.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #00c2e0, #0099b8)", color: "#fff",
              textDecoration: "none", fontWeight: 700, fontSize: 16,
              padding: "15px 36px", borderRadius: 10,
              boxShadow: "0 6px 26px rgba(0,194,224,0.4)",
              display: "flex", alignItems: "center", gap: 9,
            }}>
              Iniciar Sesión <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060e1a", color: "rgba(255,255,255,0.55)", padding: "56px 0 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <Link href="/landing" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginBottom: 18 }}>
                <Image src="/SOFTCOM_LOGO.png" alt="SOFTCOM Solutions" width={180} height={54}
                  style={{ objectFit: "contain", height: 44, width: "auto" }} />
              </Link>
              <p style={{ fontSize: 13.5, lineHeight: 1.75, maxWidth: 270 }}>
                Plataforma institucional para la valuación de bonos, análisis de portafolios y gestión de operaciones financieras.
              </p>
            </div>

            {[
              { title: "Plataforma", links: ["Dashboard","Valuación","Portafolio","Operaciones"] },
              { title: "Empresa",    links: ["Acerca de","Contacto","Privacidad"] },
              { title: "Soporte",    links: ["Documentación","Reportar error","Actualizaciones"] },
            ].map((col, i) => (
              <div key={i}>
                <div className="sc-display-font" style={{ color: "#fff", fontWeight: 700, fontSize: 13.5, marginBottom: 18 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ color: "rgba(255,255,255,0.48)", textDecoration: "none", fontSize: 13.5, transition: "color 0.18s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#00c2e0")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.48)")}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 22,
            display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ fontSize: 13 }}>
              © 2026 SOFTCOM Solutions. Todos los derechos reservados. Hecho en México 🇲🇽
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
