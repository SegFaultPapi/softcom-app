"use client"
// animations via globals.css: .anim-fade-up .anim-slide-l .anim-slide-r .anim-scale-in .delay-N

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3, Shield, TrendingUp, Users, ChevronRight,
  Menu, X, ChevronDown, ArrowRight, Star, Globe, Award,
  BookOpen, PieChart, Activity
} from "lucide-react"

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
    desc: "Calcula precios, duraciones y sensibilidades de bonos gubernamentales y corporativos con modelos actuariales certificados.",
    cta: "Ver Módulo",
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
  { icon: BarChart3,  title: "Valuación de Bonos",        desc: "Precio limpio, precio sucio, interés corrido, duration y duration modificada para CETES, Bonos M y UDIBONOS.", color: "#00c2e0" },
  { icon: PieChart,   title: "Gestión de Portafolio",    desc: "Posiciones por empresa cliente: cantidad de títulos, precio promedio, valor de mercado y VaR (Value at Risk).", color: "#3b82f6" },
  { icon: TrendingUp, title: "Operaciones",               desc: "Registro de transacciones: compra, venta, pago de cupón y derivados con trazabilidad completa.", color: "#22c55e" },
  { icon: Shield,     title: "Gestión de Riesgos",        desc: "Alertas automáticas: riesgo de mercado, crédito, liquidez, vencimientos próximos y límites de presupuesto.", color: "#ef4444" },
  { icon: Activity,   title: "Estados Financieros",       desc: "Balance general (Activo=Pasivo+Capital), estado de resultados e indicadores ROE, liquidez y solvencia.", color: "#6366f1" },
  { icon: Users,      title: "Multi-empresa",             desc: "Cada empresa cliente tiene su portafolio, usuarios asignados con roles diferenciados y reportes propios.", color: "#f59e0b" },
]

const STATS = [
  { value: "8+",    label: "Empresas cliente gestionadas" },
  { value: "47+",   label: "Instrumentos en catálogo" },
  { value: "99.9%", label: "Disponibilidad del sistema" },
  { value: "14",    label: "Módulos del modelo relacional" },
]

const NEWS = [
  { date: "May 9, 2026",  title: "Soporte para UDIBONOS y bonos con tasa variable", desc: "El módulo de valuación ahora calcula precios ajustados por INPC y soporta bonos referenciados a TIIE para portafolios corporativos." },
  { date: "Abr 25, 2026", title: "Nuevas alertas automáticas de riesgo", desc: "El sistema genera alertas de riesgo de mercado, crédito y vencimientos próximos directamente desde el portafolio de la empresa." },
  { date: "Abr 10, 2026", title: "Módulo de estados financieros y anualidades", desc: "Balance general con constraint Activo=Pasivo+Capital, estado de resultados y cálculo de valor presente/futuro de anualidades." },
]

export default function LandingPage() {
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const s = SLIDES[slide]

  return (
    <div style={{ fontFamily: "'Inter', 'Geist', sans-serif", background: "#f0f4f8", minHeight: "100vh" }}>

      {/* ── NAVBAR ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? "rgba(11,22,41,0.97)" : "rgba(11,22,41,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(0,194,224,0.2)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", gap: 32 }}>
          <Link href="/landing" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image
              src="/SOFTCOM_LOGO.png"
              alt="SOFTCOM Solutions"
              width={160}
              height={48}
              style={{ objectFit: "contain", height: 40, width: "auto" }}
              priority
            />
          </Link>

          <nav style={{ display: "flex", gap: 4, marginLeft: 16 }} className="desktop-nav">
            {["Servicios", "Plataforma", "Análisis", "Clientes", "Acerca de"].map((item) => (
              <button key={item} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.75)",
                fontSize: 14, padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)"; (e.currentTarget as HTMLButtonElement).style.background = "none" }}
              >
                {item} <ChevronDown size={12} />
              </button>
            ))}
          </nav>

          <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
            <Link href="/login" style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14, padding: "8px 16px",
              borderRadius: 6, border: "1px solid rgba(255,255,255,0.2)",
              transition: "all 0.2s",
            }}>
              Iniciar Sesión
            </Link>
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #00c2e0, #0099b8)",
              color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 600,
              padding: "8px 20px", borderRadius: 6,
              boxShadow: "0 4px 14px rgba(0,194,224,0.35)",
            }}>
              Acceder
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO CAROUSEL ── */}
      <section style={{
        minHeight: "92vh", paddingTop: 68,
        background: "linear-gradient(135deg, #0b1629 0%, #0d2347 40%, #0a1f3d 70%, #061428 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Glow orbs */}
        <div style={{ position: "absolute", top: "20%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,194,224,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,58,107,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            {/* Text side */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.3)",
                borderRadius: 20, padding: "6px 16px", marginBottom: 24,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent }} />
                <span style={{ color: "#00c2e0", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{s.tag}</span>
              </div>

              <h1 className="anim-fade-up delay-2" style={{
                color: "#fff", fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800,
                lineHeight: 1.15, marginBottom: 20, letterSpacing: -0.5,
              }}>
                {s.title}
              </h1>
              <p className="anim-fade-up delay-3" style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                {s.desc}
              </p>

              <div className="anim-fade-up delay-4" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <Link href={s.href} style={{
                  background: "linear-gradient(135deg, #00c2e0, #0099b8)",
                  color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
                  padding: "14px 28px", borderRadius: 8,
                  boxShadow: "0 6px 20px rgba(0,194,224,0.4)",
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  {s.cta} <ArrowRight size={16} />
                </Link>
                <button style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "#fff", fontSize: 15, fontWeight: 600,
                  padding: "14px 28px", borderRadius: 8, cursor: "pointer",
                }}>
                  Conocer más
                </button>
              </div>

              {/* Slide indicators */}
              <div className="anim-fade-up delay-5" style={{ display: "flex", gap: 8, marginTop: 40 }}>
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} style={{
                    width: i === slide ? 28 : 8, height: 8,
                    borderRadius: 4, border: "none", cursor: "pointer",
                    background: i === slide ? "#00c2e0" : "rgba(255,255,255,0.25)",
                    transition: "all 0.3s ease",
                  }} />
                ))}
              </div>
            </div>

            {/* Stats card side */}
            <div className="anim-slide-r delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {STATS.map((stat, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16, padding: "28px 24px",
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#00c2e0", marginBottom: 6 }}>{stat.value}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS GRID ── */}
      <section style={{ background: "#fff", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="anim-fade-up" style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
              Módulos del Sistema
            </div>
            <h2 style={{ fontSize: 38, fontWeight: 800, color: "#0b1629", marginBottom: 14 }}>
              Herramientas Financieras Especializadas
            </h2>
            <p style={{ color: "#64748b", fontSize: 17, maxWidth: 540, margin: "0 auto" }}>
              Una suite completa para la gestión profesional de instrumentos de renta fija y portafolios de inversión.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon
              const delays = ["delay-1","delay-2","delay-3","delay-4","delay-5","delay-6"]
              return (
                <div key={i} className={`anim-fade-up ${delays[i]}`} style={{
                  background: "#f8fafc", borderRadius: 16, padding: "32px 28px",
                  border: "1px solid #e2e8f0", cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(-4px)"
                    el.style.boxShadow = `0 12px 32px rgba(0,0,0,0.1)`
                    el.style.borderColor = svc.color
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = "translateY(0)"
                    el.style.boxShadow = "none"
                    el.style.borderColor = "#e2e8f0"
                  }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    background: `${svc.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    <Icon size={24} color={svc.color} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0b1629", marginBottom: 10 }}>{svc.title}</h3>
                  <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{svc.desc}</p>
                  <div className="anim-fade-up delay-1" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: svc.color, fontSize: 13, fontWeight: 600 }}>
                    Explorar <ChevronRight size={14} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── NOTICIAS + ACCESO RÁPIDO ── */}
      <section style={{ background: "#f0f4f8", padding: "80px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: 40 }}>

          {/* News */}
          <div className="anim-slide-l">
            <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Novedades</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0b1629", marginBottom: 32 }}>Actualizaciones del Sistema</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {NEWS.map((n, i) => {
                const nd = ["delay-2","delay-3","delay-4"][i]
                return (
                <div key={i} className={`anim-fade-up ${nd}`} style={{
                  background: "#fff", borderRadius: 12, padding: "24px 28px",
                  border: "1px solid #e2e8f0", display: "flex", gap: 20, alignItems: "flex-start",
                }}>
                  <div style={{
                    width: 4, borderRadius: 2, alignSelf: "stretch", minHeight: 60,
                    background: i === 0 ? "#00c2e0" : i === 1 ? "#3b82f6" : "#22c55e", flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ color: "#94a3b8", fontSize: 12, marginBottom: 6 }}>{n.date}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0b1629", marginBottom: 8 }}>{n.title}</h3>
                    <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{n.desc}</p>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Quick access */}
          <div className="anim-slide-r delay-1">
            <div style={{ color: "#00c2e0", fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Acceso Rápido</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0b1629", marginBottom: 32 }}>Módulos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Dashboard Principal", href: "/dashboard", icon: BarChart3, color: "#00c2e0" },
                { label: "Valuación", href: "/valuacion", icon: TrendingUp, color: "#3b82f6" },
                { label: "Mi Portafolio", href: "/portafolio", icon: PieChart, color: "#22c55e" },
                { label: "Operaciones", href: "/operaciones", icon: Activity, color: "#a855f7" },
                { label: "Administración", href: "/admin/usuarios", icon: Users, color: "#f59e0b" },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Link key={i} href={item.href} style={{
                    background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
                    padding: "16px 20px", textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = item.color; (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(4px)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)" }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={item.color} />
                    </div>
                    <span style={{ color: "#0b1629", fontWeight: 600, fontSize: 14 }}>{item.label}</span>
                    <ChevronRight size={14} color="#94a3b8" style={{ marginLeft: "auto" }} />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ── */}
      <section style={{
        background: "linear-gradient(135deg, #0b1629 0%, #0d2347 60%, #0a1f3d 100%)",
        padding: "80px 0", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "linear-gradient(rgba(0,194,224,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,194,224,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="anim-scale-in" style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
            {[Globe, Award, BookOpen].map((Icon, i) => (
              <div key={i} style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(0,194,224,0.12)", border: "1px solid rgba(0,194,224,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} color="#00c2e0" />
              </div>
            ))}
          </div>
          <h2 style={{ color: "#fff", fontSize: 38, fontWeight: 800, marginBottom: 16 }}>
            ¿Listo para optimizar tu portafolio?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>
            Accede a la plataforma SOFTCOM y gestiona tus inversiones con herramientas de nivel institucional.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/login" style={{
              background: "linear-gradient(135deg, #00c2e0, #0099b8)", color: "#fff",
              textDecoration: "none", fontWeight: 700, fontSize: 16,
              padding: "16px 36px", borderRadius: 8,
              boxShadow: "0 6px 24px rgba(0,194,224,0.4)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              Iniciar Sesión <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060e1a", color: "rgba(255,255,255,0.6)", padding: "56px 0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <Link href="/landing" style={{ display: "flex", alignItems: "center", textDecoration: "none", marginBottom: 16 }}>
                <Image
                  src="/SOFTCOM_LOGO.png"
                  alt="SOFTCOM Solutions"
                  width={180}
                  height={54}
                  style={{ objectFit: "contain", height: 48, width: "auto" }}
                />
              </Link>
              <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
                Plataforma institucional para la valuación de bonos, análisis de portafolios y gestión de operaciones financieras.
              </p>
            </div>

            {[
              { title: "Plataforma", links: ["Dashboard", "Valuación", "Portafolio", "Operaciones"] },
              { title: "Empresa", links: ["Acerca de", "Contacto", "Política de privacidad"] },
              { title: "Soporte", links: ["Documentación", "Reportar error", "Actualizaciones"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{col.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map((link) => (
                    <a key={link} href="#" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#00c2e0")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 13 }}>
              © 2026 SOFTCOM Solutions. Todos los derechos reservados. Hecho en México.
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === 1 ? "#00c2e0" : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
