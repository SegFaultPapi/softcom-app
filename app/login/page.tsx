"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Shield, PieChart, Loader2, ArrowRight, RotateCcw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { usePrivy, useLoginWithEmail, useLoginWithOAuth } from "@privy-io/react-auth"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { user } = useAuth()
  const { ready } = usePrivy()
  const { sendCode, loginWithCode } = useLoginWithEmail()
  const { initOAuth } = useLoginWithOAuth()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) router.push("/dashboard")
  }, [user, router])

  const handleSendCode = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await sendCode({ email: email.trim() })
      setStep("otp")
    } catch {
      setError("No se pudo enviar el código. Verifica que el correo sea válido.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    try {
      await loginWithCode({ code: code.trim() })
    } catch {
      setError("Código incorrecto o expirado. Intenta de nuevo.")
    } finally {
      setLoading(false)
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
      <div className="hidden lg:flex anim-slide-l" style={{
        flex: "0 0 48%", background: "linear-gradient(160deg, #0b1629 0%, #0d2347 55%, #0a1f3d 100%)",
        position: "relative", overflow: "hidden",
        flexDirection: "column", justifyContent: "center", padding: "60px 56px",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.05,
          backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg,rgba(0,194,224,1) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
        }} />
        <div style={{ position: "absolute", top: "30%", right: "-10%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,194,224,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
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

      {/* ── RIGHT PANEL ── */}
      <div style={{
        flex: 1, background: "#f0f4f8",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "40px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }} className="lg:hidden">
          <Image
            src="/SOFTCOM_LOGO.png"
            alt="SOFTCOM Solutions"
            width={180}
            height={54}
            style={{ objectFit: "contain", height: 48, width: "auto", filter: "invert(1) hue-rotate(180deg)" }}
          />
        </div>

        <div className="anim-scale-in" style={{ width: "100%", maxWidth: 420 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0b1629", marginBottom: 6 }}>Iniciar sesión</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>Accede con tu cuenta institucional de SOFTCOM.</p>

          <div style={{
            background: "#fff",
            borderRadius: 12,
            border: "1.5px solid #e2e8f0",
            padding: "28px 28px 24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}>
            {!ready ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 220 }}>
                <Loader2 size={24} color="#00c2e0" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                {/* Google */}
                <button
                  onClick={() => initOAuth({ provider: "google" })}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    width: "100%", padding: "11px 16px",
                    background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 8,
                    fontSize: 14, fontWeight: 600, color: "#0b1629", cursor: "pointer",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#00c2e0"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,194,224,0.1)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </button>

                {/* Separator */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                  <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                  <span style={{ color: "#94a3b8", fontSize: 12 }}>o continúa con correo</span>
                  <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                </div>

                {/* Email / OTP */}
                {step === "email" ? (
                  <>
                    <input
                      type="email"
                      placeholder="correo@empresa.mx"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(null) }}
                      onKeyDown={e => e.key === "Enter" && handleSendCode()}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
                        boxSizing: "border-box", color: "#0b1629",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#00c2e0"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                    />
                    <button
                      onClick={handleSendCode}
                      disabled={loading || !email.trim()}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", padding: "11px 16px",
                        background: loading || !email.trim() ? "#e2e8f0" : "#00c2e0",
                        border: "none", borderRadius: 8,
                        fontSize: 14, fontWeight: 600,
                        color: loading || !email.trim() ? "#94a3b8" : "#fff",
                        cursor: loading || !email.trim() ? "not-allowed" : "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {loading
                        ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        : <><span>Enviar código</span><ArrowRight size={15} /></>
                      }
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                      Ingresa el código de 6 dígitos enviado a <strong>{email}</strong>
                    </p>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000000"
                      maxLength={6}
                      value={code}
                      onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setError(null) }}
                      onKeyDown={e => e.key === "Enter" && handleVerifyCode()}
                      style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: "1.5px solid #e2e8f0", fontSize: 20, letterSpacing: 8,
                        textAlign: "center", outline: "none", boxSizing: "border-box", color: "#0b1629",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#00c2e0"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                      autoFocus
                    />
                    <button
                      onClick={handleVerifyCode}
                      disabled={loading || code.length < 6}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", padding: "11px 16px",
                        background: loading || code.length < 6 ? "#e2e8f0" : "#00c2e0",
                        border: "none", borderRadius: 8,
                        fontSize: 14, fontWeight: 600,
                        color: loading || code.length < 6 ? "#94a3b8" : "#fff",
                        cursor: loading || code.length < 6 ? "not-allowed" : "pointer",
                        transition: "background 0.15s",
                      }}
                    >
                      {loading
                        ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                        : "Verificar código"
                      }
                    </button>
                    <button
                      onClick={() => { setStep("email"); setCode(""); setError(null) }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        background: "none", border: "none", color: "#64748b",
                        fontSize: 13, cursor: "pointer", padding: "4px 0",
                      }}
                    >
                      <RotateCcw size={13} />
                      Usar otro correo
                    </button>
                  </>
                )}

                {error && (
                  <p style={{ color: "#ef4444", fontSize: 13, margin: 0, textAlign: "center" }}>{error}</p>
                )}
              </div>
            )}
          </div>

          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 16, textAlign: "center" }}>
            Las cuentas son creadas por un administrador.
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <Link href="/landing" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#00c2e0")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
