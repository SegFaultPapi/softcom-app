"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2, ArrowRight, TrendingUp, Shield, PieChart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.")
    }
  }

  const features = [
    { icon: TrendingUp, label: "Valuación de bonos en tiempo real" },
    { icon: PieChart, label: "Análisis de portafolio personalizado" },
    { icon: Shield, label: "Acceso seguro con roles diferenciados" },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter','Geist',sans-serif" }}>

      {/* ── LEFT PANEL (navy) ── */}
      <div className="anim-slide-l" style={{
        flex: "0 0 48%", background: "linear-gradient(160deg, #0b1629 0%, #0d2347 55%, #0a1f3d 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px",
      }} className="hidden lg:flex">

        {/* Grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg,rgba(0,194,224,1) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        {/* Glow */}
        <div style={{ position: "absolute", top: "30%", right: "-10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div className="anim-fade-up" style={{ marginBottom: 56 }}>
            <Image
              src="/SOFTCOM_LOGO.png"
              alt="SOFTCOM Solutions"
              width={220}
              height={66}
              style={{ objectFit: "contain", height: 60, width: "auto" }}
              priority
            />
          </div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(0,194,224,0.1)", border: "1px solid rgba(0,194,224,0.25)",
            borderRadius: 20, padding: "5px 14px", marginBottom: 24,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00c2e0" }} />
            <span style={{ color: "#00c2e0", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Plataforma Institucional</span>
          </div>

          <h1 className="anim-fade-up delay-2" style={{ color: "#fff", fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>
            Gestión financiera<br />de alto nivel
          </h1>
          <p className="anim-fade-up delay-3" style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, lineHeight: 1.7, marginBottom: 48, maxWidth: 380 }}>
            Accede a herramientas profesionales para valuación de bonos, análisis de portafolios y registro de operaciones.
          </p>

          {/* Feature list */}
          <div className="anim-fade-up delay-4" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 9,
                    background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={17} color="#00c2e0" />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{f.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div style={{
        flex: 1, background: "#f0f4f8",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        {/* Mobile logo */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }} className="lg:hidden">
          <Image
            src="/SOFTCOM_LOGO.png"
            alt="SOFTCOM Solutions"
            width={180}
            height={54}
            style={{ objectFit: "contain", height: 48, width: "auto", filter: "brightness(0) invert(0)" }}
          />
        </div>

        <div className="anim-scale-in" style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0b1629", marginBottom: 6 }}>Iniciar sesión</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 32 }}>Accede con tu cuenta institucional de SOFTCOM.</p>

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Error alert */}
            {error && (
              <div style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 10, padding: "12px 16px",
              }}>
                <AlertCircle size={16} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ color: "#b91c1c", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Error de autenticación</div>
                  <div style={{ color: "#dc2626", fontSize: 13 }}>{error}</div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0b1629", marginBottom: 6 }}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@softcom.com"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 14,
                  border: error ? "1.5px solid #fca5a5" : "1.5px solid #cbd5e1",
                  background: "#fff", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#00c2e0")}
                onBlur={e => (e.currentTarget.style.borderColor = error ? "#fca5a5" : "#cbd5e1")}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#0b1629", marginBottom: 6 }}>
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 8, fontSize: 14,
                  border: error ? "1.5px solid #fca5a5" : "1.5px solid #cbd5e1",
                  background: "#fff", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  fontFamily: "inherit",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "#00c2e0")}
                onBlur={e => (e.currentTarget.style.borderColor = error ? "#fca5a5" : "#cbd5e1")}
              />
              <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 6 }}>
                Las cuentas son creadas por un administrador.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px", borderRadius: 8, fontSize: 15, fontWeight: 700,
                background: loading ? "#94a3b8" : "linear-gradient(135deg,#00c2e0,#0099b8)",
                color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(0,194,224,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s", fontFamily: "inherit",
              }}
            >
              {loading
                ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Verificando...</>
                : <>Entrar <ArrowRight size={16} /></>
              }
            </button>

            {/* Demo credentials */}
            <div style={{
              background: "rgba(0,194,224,0.06)", border: "1px dashed rgba(0,194,224,0.35)",
              borderRadius: 10, padding: "14px 16px",
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#0b1629", marginBottom: 8 }}>Usuarios demo</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  ["admin@softcom.mx", "admin", "Administrador"],
                  ["gerente@softcom.mx", "gerente", "Gerente de Cartera"],
                  ["analyst@softcom.mx", "analyst", "Analista"],
                ].map(([em, pw, label]) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => { setEmail(em); setPassword(pw) }}
                    style={{
                      textAlign: "left", background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: "#475569", padding: "2px 0", fontFamily: "inherit",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#00c2e0")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
                  >
                    → <span style={{ fontWeight: 600 }}>{label}</span>: {em} / {pw}
                  </button>
                ))}
              </div>
            </div>
          </form>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <Link href="/landing" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#00c2e0")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
