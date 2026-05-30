"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import {
  ShoppingCart, Banknote, CheckCircle, AlertTriangle,
  ChevronDown, RotateCcw, Clock, Database, Wifi, WifiOff,
} from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"

type Operacion = "compra" | "venta"

// ── Mock fallback (se mantienen, se usan si DB está vacío) ──────────────────
const INSTRUMENTOS_MOCK = [
  { id: "mock:cetes-28",  label: "CETES 28d",        tipo: "CETES",  precioRef: 9.9123,  vto: "2026-06-24", dbId: null as number | null, dbPortafolioId: null as number | null },
  { id: "mock:cetes-91",  label: "CETES 91d",         tipo: "CETES",  precioRef: 9.8534,  vto: "2026-08-26", dbId: null as number | null, dbPortafolioId: null as number | null },
  { id: "mock:bonom-7",   label: "Bono M 7% 2031",    tipo: "BONO_M", precioRef: 97.20,   vto: "2031-06-05", dbId: null as number | null, dbPortafolioId: null as number | null },
  { id: "mock:bonom-8",   label: "Bono M 8.5% 2029",  tipo: "BONO_M", precioRef: 99.80,   vto: "2029-12-05", dbId: null as number | null, dbPortafolioId: null as number | null },
]

const CLIENTES_MOCK = [
  { id: "mock:1", nombre: "Inversora del Norte SA",  saldo: 3_028_847.32, dbPortafolioId: null as number | null },
  { id: "mock:2", nombre: "Fondo Bajío Capital",     saldo: 8_540_211.00, dbPortafolioId: null as number | null },
  { id: "mock:3", nombre: "Corporativo Noreste SA",  saldo: 1_201_450.75, dbPortafolioId: null as number | null },
]

const POSICIONES_VENTA_MOCK: Record<string, { instrId: string; cantidad: number }[]> = {
  "mock:1": [
    { instrId: "mock:cetes-28", cantidad: 1_000_000 },
    { instrId: "mock:bonom-7",  cantidad: 20_000 },
    { instrId: "mock:bonom-8",  cantidad: 5_000 },
  ],
  "mock:2": [
    { instrId: "mock:cetes-91", cantidad: 500_000 },
    { instrId: "mock:bonom-7",  cantidad: 10_000 },
  ],
  "mock:3": [
    { instrId: "mock:cetes-28", cantidad: 200_000 },
  ],
}

// ── Types ───────────────────────────────────────────────────────────────────
type InstrumentoItem = {
  id: string
  label: string
  tipo: string
  precioRef: number
  vto: string
  dbId: number | null        // id_instrumento real en DB
}

type ClienteItem = {
  id: string
  nombre: string
  saldo: number
  dbPortafolioId: number | null  // id_portafolio real en DB
}

type TransaccionRow = {
  id: number
  tipo_operacion: string
  cantidad: number
  monto_total: number
  precio_sucio: number | null
  fecha: string
  instrumento_label: string
  instrumento_tipo: string
  empresa_nombre: string
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmtMXN = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency", currency: "MXN",
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(n)

const fmtInt = (n: number) => new Intl.NumberFormat("es-MX").format(n)

const fmtFecha = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// ── Field components ─────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "0.07em",
      textTransform: "uppercase", color: "#64748b", display: "block", marginBottom: 8,
    }}>
      {children}
    </label>
  )
}

function SelectField({
  value, onChange, children, disabled = false,
}: { value: string; onChange: (v: string) => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%", appearance: "none",
          padding: "13px 40px 13px 16px", borderRadius: 10,
          border: "1.5px solid #e2e8f0", background: disabled ? "#f8fafc" : "#fff",
          fontSize: 15, fontFamily: "'DM Sans', sans-serif",
          color: disabled ? "#94a3b8" : "#0b1629",
          cursor: disabled ? "not-allowed" : "pointer", outline: "none",
        }}
        onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = "#00c2e0" }}
        onBlur={e => { e.currentTarget.style.borderColor = "#e2e8f0" }}
      >
        {children}
      </select>
      <ChevronDown size={14} color="#94a3b8" style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none",
      }} />
    </div>
  )
}

function NumInput({
  id, value, onChange, suffix, min = "1", step = "1",
}: { id: string; value: string; onChange: (v: string) => void; suffix?: string; min?: string; step?: string }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: "relative" }}>
        <input
          id={id} type="number" value={value} min={min} step={step}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: suffix ? "13px 56px 13px 16px" : "13px 16px",
            borderRadius: 10, outline: "none",
            border: `1.5px solid ${focused ? "#00c2e0" : "#e2e8f0"}`,
            fontSize: 16, fontFamily: "'IBM Plex Mono', monospace",
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
  )
}

// ── Main content ─────────────────────────────────────────────────────────────
function OperacionesContent() {
  const [op, setOp] = useState<Operacion>("compra")
  const [clienteId, setClienteId] = useState("")
  const [instrId, setInstrId] = useState("")
  const [precio, setPrecio] = useState("")
  const [cantidad, setCantidad] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [saving, setSaving] = useState(false)

  // DB state
  const [instrumentos, setInstrumentos] = useState<InstrumentoItem[]>(INSTRUMENTOS_MOCK)
  const [clientes, setClientes] = useState<ClienteItem[]>(CLIENTES_MOCK)
  const [transacciones, setTransacciones] = useState<TransaccionRow[]>([])
  const [loadingTx, setLoadingTx] = useState(true)
  const [dbConectado, setDbConectado] = useState<boolean | null>(null)

  // Posiciones para venta (mock o DB en el futuro)
  const [posicionesVenta, setPosicionesVenta] = useState<Record<string, { instrId: string; cantidad: number }[]>>(POSICIONES_VENTA_MOCK)

  // ── Cargar instrumentos y portafolios de Supabase ──────────────────────
  useEffect(() => {
    async function cargarCatalogos() {
      try {
        // Instrumentos
        const { data: dbInstr, error: errInstr } = await supabase
          .from("instrumento")
          .select("id_instrumento, tipo, serie, tasa, fecha_vencimiento, valor_nominal")
          .order("id_instrumento")

        // Portafolios + empresas
        const { data: dbPortafolios, error: errPort } = await supabase
          .from("portafolio")
          .select("id_portafolio, saldo_efectivo, empresa(id_empresa, nombre)")
          .order("id_portafolio")

        const hayInstr = !errInstr && dbInstr && dbInstr.length > 0
        const hayPort = !errPort && dbPortafolios && dbPortafolios.length > 0

        setDbConectado(true)

        if (hayInstr) {
          const mapped: InstrumentoItem[] = (dbInstr as Array<{
            id_instrumento: number
            tipo: string
            serie: string
            tasa: number | null
            fecha_vencimiento: string
            valor_nominal: number
          }>).map(i => ({
            id: `db:${i.id_instrumento}`,
            label: buildInstrLabel(i),
            tipo: i.tipo.toUpperCase(),
            precioRef: i.valor_nominal,
            vto: i.fecha_vencimiento,
            dbId: i.id_instrumento,
          }))
          // Mocks al final como fallback visual
          setInstrumentos([...mapped, ...INSTRUMENTOS_MOCK])
        }

        if (hayPort) {
          const mapped: ClienteItem[] = (dbPortafolios as Array<{
            id_portafolio: number
            saldo_efectivo: number
            empresa: { id_empresa: number; nombre: string } | null
          }>).map(p => ({
            id: `db:${p.id_portafolio}`,
            nombre: p.empresa?.nombre ?? `Portafolio #${p.id_portafolio}`,
            saldo: p.saldo_efectivo,
            dbPortafolioId: p.id_portafolio,
          }))
          setClientes([...mapped, ...CLIENTES_MOCK])

          // Inicializar selección con primer portafolio real
          setClienteId(`db:${(dbPortafolios as Array<{ id_portafolio: number }>)[0].id_portafolio}`)
        } else {
          setClienteId(CLIENTES_MOCK[0].id)
        }
      } catch {
        setDbConectado(false)
        setClienteId(CLIENTES_MOCK[0].id)
      }
    }

    cargarCatalogos()
  }, [])

  // ── Cargar transacciones recientes ─────────────────────────────────────
  const cargarTransacciones = useCallback(async () => {
    setLoadingTx(true)
    try {
      const { data, error } = await supabase
        .from("transaccion")
        .select(`
          id_transaccion,
          tipo_operacion,
          cantidad,
          monto_total,
          precio_sucio,
          fecha,
          instrumento:id_instrumento ( tipo, serie, tasa ),
          portafolio:id_portafolio ( empresa:id_empresa ( nombre ) )
        `)
        .order("fecha", { ascending: false })
        .limit(20)

      if (error) throw error

      const rows: TransaccionRow[] = ((data ?? []) as Array<{
        id_transaccion: number
        tipo_operacion: string
        cantidad: number
        monto_total: number
        precio_sucio: number | null
        fecha: string
        instrumento: { tipo: string; serie: string; tasa: number | null } | null
        portafolio: { empresa: { nombre: string } | null } | null
      }>).map(r => ({
        id: r.id_transaccion,
        tipo_operacion: r.tipo_operacion,
        cantidad: r.cantidad,
        monto_total: r.monto_total,
        precio_sucio: r.precio_sucio,
        fecha: r.fecha,
        instrumento_label: r.instrumento
          ? buildInstrLabelSimple(r.instrumento)
          : "—",
        instrumento_tipo: r.instrumento?.tipo?.toUpperCase() ?? "—",
        empresa_nombre: r.portafolio?.empresa?.nombre ?? "—",
      }))

      setTransacciones(rows)
    } catch {
      // Sin datos o sin acceso → tabla vacía
      setTransacciones([])
    } finally {
      setLoadingTx(false)
    }
  }, [])

  useEffect(() => { cargarTransacciones() }, [cargarTransacciones])

  // ── Helpers de labels ──────────────────────────────────────────────────
  function buildInstrLabel(i: { tipo: string; serie: string; tasa: number | null; fecha_vencimiento: string }) {
    const tipo = i.tipo.toUpperCase()
    const tasa = i.tasa ? ` ${(i.tasa * 100).toFixed(2)}%` : ""
    const year = i.fecha_vencimiento?.slice(0, 4)
    return `${tipo}${tasa} ${i.serie} ${year}`
  }

  function buildInstrLabelSimple(i: { tipo: string; serie: string; tasa: number | null }) {
    const tasa = i.tasa ? ` ${(i.tasa * 100).toFixed(2)}%` : ""
    return `${i.tipo.toUpperCase()}${tasa} ${i.serie}`
  }

  // ── Selección actual ───────────────────────────────────────────────────
  const cliente = clientes.find(c => c.id === clienteId)
  const instrumento = instrumentos.find(i => i.id === instrId)
  const posicion = posicionesVenta[clienteId]?.find(p => p.instrId === instrId)

  const handleInstrChange = (id: string) => {
    setInstrId(id)
    const instr = instrumentos.find(i => i.id === id)
    if (instr) setPrecio(instr.precioRef.toFixed(4))
  }

  const total = useMemo(() => {
    const p = parseFloat(precio)
    const q = parseFloat(cantidad)
    if (!p || !q || isNaN(p) || isNaN(q)) return 0
    return p * q
  }, [precio, cantidad])

  const saldoPost = cliente ? cliente.saldo - (op === "compra" ? total : -total) : 0
  const isInsuficiente = op === "compra" && cliente != null && total > cliente.saldo
  const cantidadDisp = posicion?.cantidad ?? 0
  const excedeCantidad = op === "venta" && parseFloat(cantidad) > cantidadDisp && posicion != null

  const canSubmit = instrId && precio && cantidad &&
    parseFloat(cantidad) >= 1 && parseFloat(precio) > 0 && !excedeCantidad

  const usandoMock = !instrumento?.dbId || !cliente?.dbPortafolioId

  // ── Guardar en Supabase ────────────────────────────────────────────────
  const handleConfirm = async () => {
    setShowConfirm(false)
    setSaving(true)
    setConfirmError(null)

    if (!usandoMock && instrumento?.dbId && cliente?.dbPortafolioId) {
      const { error } = await supabase.from("transaccion").insert({
        id_portafolio: cliente.dbPortafolioId,
        id_instrumento: instrumento.dbId,
        tipo_operacion: op,
        cantidad: parseInt(cantidad),
        monto_total: total,
        precio_sucio: parseFloat(precio),
      })

      if (error) {
        setConfirmError(error.message)
        setSaving(false)
        return
      }

      // Refrescar log
      await cargarTransacciones()
    }

    setSaving(false)
    setConfirmed(true)
    setInstrId(""); setPrecio(""); setCantidad("")
    setTimeout(() => setConfirmed(false), 5000)
  }

  // Instrumentos disponibles para venta
  const instrVenta = op === "venta"
    ? instrumentos.filter(i =>
        posicionesVenta[clienteId]?.some(p => p.instrId === i.id) ||
        i.id.startsWith("db:")  // instrumentos DB siempre disponibles
      )
    : instrumentos

  const opColor = op === "compra" ? "#22c55e" : "#ef4444"
  const opLabel = op === "compra" ? "Compra" : "Venta"

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#f0f4f8 0%,#e8eef5 100%)" }}>
      <PageHeader
        title="Compra / Venta de instrumentos"
        tag="Registro de operaciones"
        description="Ejecuta operaciones con trazabilidad completa. El log es inmutable una vez confirmado."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Operaciones" },
        ]}
      />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 24px 56px" }}>


        {/* Success toast */}
        {confirmed && (
          <div className="anim-scale-in" style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 12, padding: "16px 20px", marginBottom: 20,
          }}>
            <CheckCircle size={20} color="#22c55e" />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#0b1629", fontSize: 14 }}>
                Operación registrada exitosamente
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
                {usandoMock
                  ? "Modo mock — la operación no fue guardada en base de datos."
                  : "Guardada en Supabase. El log fue actualizado."
                }
              </p>
            </div>
          </div>
        )}

        {/* Error toast */}
        {confirmError && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "14px 18px", marginBottom: 20,
          }}>
            <AlertTriangle size={18} color="#ef4444" />
            <div>
              <p style={{ margin: 0, fontWeight: 700, color: "#0b1629", fontSize: 13 }}>
                Error al guardar operación
              </p>
              <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{confirmError}</p>
            </div>
            <button
              onClick={() => setConfirmError(null)}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}
            >×</button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "stretch" }}>

          {/* ── Form ── */}
          <div style={{
            background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0",
            overflow: "hidden", display: "flex", flexDirection: "column",
          }}>
            {/* Tab switcher */}
            <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
              {(["compra", "venta"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => { setOp(t); setInstrId(""); setPrecio(""); setCantidad("") }}
                  style={{
                    flex: 1, padding: "17px 0", border: "none",
                    cursor: "pointer", fontWeight: 700, fontSize: 15,
                    letterSpacing: "0.01em",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s",
                    background: op === t
                      ? (t === "compra" ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)")
                      : "transparent",
                    color: op === t
                      ? (t === "compra" ? "#22c55e" : "#ef4444")
                      : "#94a3b8",
                    borderBottom: op === t
                      ? `2px solid ${t === "compra" ? "#22c55e" : "#ef4444"}`
                      : "2px solid transparent",
                  }}
                >
                  {t === "compra" ? <ShoppingCart size={15} /> : <Banknote size={15} />}
                  {t === "compra" ? "Compra" : "Venta"}
                </button>
              ))}
            </div>

            <div style={{ padding: "32px 32px 28px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* Cliente */}
                <div>
                  <Label>Empresa / Portafolio</Label>
                  <SelectField
                    value={clienteId}
                    onChange={v => { setClienteId(v); setInstrId(""); setPrecio(""); setCantidad("") }}
                  >
                    {clientes.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.id.startsWith("db:") ? "" : "[mock] "}{c.nombre}
                      </option>
                    ))}
                  </SelectField>
                  {cliente && (
                    <p style={{ margin: "7px 0 0", fontSize: 13, color: "#64748b" }}>
                      Saldo disponible:{" "}
                      <span className="sc-number" style={{ fontWeight: 700, color: "#0b1629" }}>
                        {fmtMXN(cliente.saldo)}
                      </span>
                      {cliente.dbPortafolioId && (
                        <span style={{ marginLeft: 6, color: "#00c2e0" }}>
                          <Database size={10} style={{ display: "inline", marginBottom: -1 }} /> id={cliente.dbPortafolioId}
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Instrumento */}
                <div>
                  <Label>Instrumento</Label>
                  <SelectField value={instrId} onChange={handleInstrChange}>
                    <option value="" disabled>— Selecciona un instrumento —</option>
                    {instrVenta.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.id.startsWith("db:") ? "" : "[mock] "}{i.label}
                      </option>
                    ))}
                  </SelectField>
                    {instrumento && (
                      <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>
                          Tipo: <strong style={{ color: "#00c2e0" }}>{instrumento.tipo}</strong>
                        </span>
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>
                          Vto: <strong style={{ color: "#0b1629" }}>{instrumento.vto}</strong>
                        </span>
                      {instrumento.dbId && (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          <Database size={10} style={{ display: "inline", marginBottom: -1 }} />
                          <strong style={{ color: "#00c2e0" }}> id={instrumento.dbId}</strong>
                        </span>
                      )}
                      {op === "venta" && posicion && (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          En portafolio:{" "}
                          <strong className="sc-number" style={{ color: "#0b1629" }}>
                            {fmtInt(posicion.cantidad)} títulos
                          </strong>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Precio + Cantidad */}
                <div style={{ height: 1, background: "#f1f5f9", margin: "2px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <Label>Precio unitario</Label>
                    <NumInput
                      id="precio" value={precio} onChange={setPrecio}
                      suffix="MXN" step="0.0001" min="0.0001"
                    />
                    {instrumento && (
                      <p style={{ margin: "7px 0 0", fontSize: 13, color: "#94a3b8" }}>
                        Ref. valuación:{" "}
                        <span className="sc-number" style={{ color: "#00c2e0", fontWeight: 700 }}>
                          ${instrumento.precioRef.toFixed(4)}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>{op === "venta" ? "Cantidad a vender" : "Cantidad a comprar"}</Label>
                    <NumInput id="cantidad" value={cantidad} onChange={setCantidad} />
                    {excedeCantidad && (
                      <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ef4444", fontWeight: 600 }}>
                        ⚠ Máximo: {fmtInt(cantidadDisp)} títulos
                      </p>
                    )}
                  </div>
                </div>

                {/* Warnings */}
                {isInsuficiente && (
                  <div style={{
                    display: "flex", gap: 8, padding: "12px 14px",
                    background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: 8,
                  }}>
                    <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ margin: 0, fontSize: 13, color: "#ef4444" }}>
                      El importe supera el saldo disponible. La operación se registrará con flag{" "}
                      <strong>saldo_insuficiente: true</strong>.
                    </p>
                  </div>
                )}

                {/* Submit */}
                <button
                  disabled={!canSubmit || saving}
                  onClick={() => setShowConfirm(true)}
                  style={{
                    padding: "15px 0", borderRadius: 10, border: "none",
                    fontSize: 15, fontWeight: 700, cursor: (canSubmit && !saving) ? "pointer" : "not-allowed",
                    background: (canSubmit && !saving)
                      ? op === "compra"
                        ? "linear-gradient(135deg,#22c55e,#16a34a)"
                        : "linear-gradient(135deg,#ef4444,#dc2626)"
                      : "#e2e8f0",
                    color: (canSubmit && !saving) ? "#fff" : "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s",
                    boxShadow: (canSubmit && !saving)
                      ? `0 4px 16px ${op === "compra" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`
                      : "none",
                  }}
                >
                  {saving ? (
                    <RotateCcw size={15} style={{ animation: "spin 1s linear infinite" }} />
                  ) : (
                    op === "compra" ? <ShoppingCart size={16} /> : <Banknote size={16} />
                  )}
                  {saving ? "Guardando…" : canSubmit ? `Confirmar ${opLabel}` : `Completa los campos para ${opLabel}`}
                </button>
              </div>
            </div>
          </div>

          {/* ── Trade Ticket ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div className="sc-result-panel" style={{ padding: "28px 26px", flex: 1 }}>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "#00c2e0",
                  }}>
                    Ticket de operación
                  </span>
                </div>

                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: op === "compra" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  border: `1px solid ${op === "compra" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                  borderRadius: 20, padding: "3px 12px", marginBottom: 16,
                }}>
                  {op === "compra" ? <ShoppingCart size={11} color="#22c55e" /> : <Banknote size={11} color="#ef4444" />}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: op === "compra" ? "#22c55e" : "#ef4444",
                    letterSpacing: "0.06em", textTransform: "uppercase",
                  }}>
                    {opLabel}
                  </span>
                </div>

                {[
                  { label: "Cliente", value: cliente?.nombre ?? "—", mono: false },
                  { label: "Instrumento", value: instrumento?.label ?? "—", mono: false },
                  { label: "Tipo", value: instrumento?.tipo ?? "—", mono: false },
                  { label: "Precio unitario", value: precio ? `$${parseFloat(precio).toFixed(4)}` : "—", mono: true },
                  { label: "Cantidad", value: cantidad ? fmtInt(parseInt(cantidad)) : "—", mono: true },
                ].map(({ label, value, mono }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: "0.02em" }}>{label}</span>
                    <span style={{
                      fontSize: 13, color: "rgba(255,255,255,0.88)",
                      fontFamily: mono ? "'IBM Plex Mono', monospace" : "'DM Sans', sans-serif",
                      fontWeight: 600, textAlign: "right", maxWidth: 180,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {value}
                    </span>
                  </div>
                ))}

                <div style={{
                  marginTop: 18, padding: "18px 20px",
                  background: "rgba(0,194,224,0.08)", border: "1px solid rgba(0,194,224,0.2)",
                  borderRadius: 12,
                }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Importe total
                  </p>
                  <p className="sc-price-lg" style={{ color: total > 0 ? "#00c2e0" : "rgba(255,255,255,0.25)", margin: 0 }}>
                    {total > 0 ? fmtMXN(total) : "—"}
                  </p>
                </div>

                {cliente && total > 0 && (
                  <div style={{ marginTop: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>Saldo post-op</span>
                      <span className="sc-number" style={{
                        fontSize: 14, fontWeight: 700,
                        color: saldoPost < 0 ? "#ef4444" : "#22c55e",
                      }}>
                        {fmtMXN(Math.abs(saldoPost))}{saldoPost < 0 ? " (déficit)" : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── Últimas operaciones ─────────────────────────────────────────────── */}
        <div style={{
          marginTop: 28, background: "#fff", borderRadius: 16,
          border: "1px solid #e2e8f0", overflow: "hidden",
        }}>
          <div style={{
            padding: "22px 28px", borderBottom: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p className="sc-display-font" style={{ fontSize: 14, fontWeight: 700, color: "#0b1629", margin: 0 }}>
                Últimas operaciones
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>
                Log trazable e inmutable · {transacciones.length} registro{transacciones.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={cargarTransacciones}
              disabled={loadingTx}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid #e2e8f0", background: "#fff",
                fontSize: 12, fontWeight: 600, color: "#64748b",
                cursor: loadingTx ? "not-allowed" : "pointer",
              }}
            >
              <RotateCcw size={12} style={{ animation: loadingTx ? "spin 1s linear infinite" : "none" }} />
              Actualizar
            </button>
          </div>

          {loadingTx ? (
            <div style={{ padding: "32px 22px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>Cargando operaciones…</p>
            </div>
          ) : transacciones.length === 0 ? (
            <div style={{ padding: "32px 22px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8", fontSize: 14 }}>
                Las operaciones confirmadas aparecerán aquí con su timestamp y ID de trazabilidad.
              </p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["ID", "Tipo", "Empresa", "Instrumento", "Cantidad", "Importe", "Precio", "Fecha"].map(h => (
                      <th key={h} style={{
                        padding: "12px 20px", textAlign: "left",
                        fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
                        textTransform: "uppercase", color: "#94a3b8",
                        borderBottom: "1px solid #f1f5f9",
                        whiteSpace: "nowrap",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transacciones.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}
                    >
                      <td style={{ padding: "13px 20px", color: "#94a3b8", fontFamily: "monospace", fontSize: 11 }}>
                        #{tx.id}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "3px 9px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                          background: tx.tipo_operacion === "compra"
                            ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: tx.tipo_operacion === "compra" ? "#16a34a" : "#dc2626",
                        }}>
                          {tx.tipo_operacion === "compra"
                            ? <ShoppingCart size={9} /> : <Banknote size={9} />}
                          {tx.tipo_operacion}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px", color: "#0b1629", fontWeight: 500 }}>
                        {tx.empresa_nombre}
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span style={{ color: "#0b1629", fontWeight: 500 }}>{tx.instrumento_label}</span>
                        <span style={{
                          marginLeft: 6, fontSize: 10, fontWeight: 700, color: "#00c2e0",
                          background: "rgba(0,194,224,0.08)", padding: "2px 7px", borderRadius: 4,
                        }}>
                          {tx.instrumento_tipo}
                        </span>
                      </td>
                      <td className="sc-number" style={{ padding: "13px 20px", color: "#0b1629" }}>
                        {fmtInt(tx.cantidad)}
                      </td>
                      <td className="sc-number" style={{ padding: "13px 20px", color: "#0b1629", fontWeight: 600 }}>
                        {fmtMXN(tx.monto_total)}
                      </td>
                      <td className="sc-number" style={{ padding: "13px 20px", color: "#64748b" }}>
                        {tx.precio_sucio != null ? `$${tx.precio_sucio.toFixed(4)}` : "—"}
                      </td>
                      <td style={{ padding: "13px 20px", color: "#64748b", whiteSpace: "nowrap", fontSize: 12 }}>
                        {fmtFecha(tx.fecha)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Confirmation modal ── */}
      {showConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(11,22,41,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
        }}>
          <div className="anim-scale-in" style={{
            background: "#fff", borderRadius: 20, padding: "32px",
            maxWidth: 440, width: "100%",
            boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, marginBottom: 20,
              background: op === "compra" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {op === "compra"
                ? <ShoppingCart size={22} color="#22c55e" />
                : <Banknote size={22} color="#ef4444" />
              }
            </div>

            <h2 className="sc-display-font" style={{ fontSize: 20, fontWeight: 800, color: "#0b1629", marginBottom: 6 }}>
              Confirmar {opLabel}
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
              {usandoMock
                ? "Esta operación usa datos mock y no será guardada en la base de datos."
                : "Esta acción registrará la operación de forma inmutable en Supabase."
              }
            </p>

            {usandoMock && (
              <div style={{
                display: "flex", gap: 8, padding: "10px 14px", marginBottom: 16,
                background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 8,
              }}>
                <AlertTriangle size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 12, color: "#92400e" }}>
                  Instrumento o portafolio sin ID real en DB. Siembra datos en Supabase para persistir.
                </p>
              </div>
            )}

            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
              {[
                ["Cliente", cliente?.nombre ?? "—"],
                ["Instrumento", instrumento?.label ?? "—"],
                ["Precio unitario", precio ? `$${parseFloat(precio).toFixed(4)} MXN` : "—"],
                ["Cantidad", cantidad ? fmtInt(parseInt(cantidad)) : "—"],
                ["Importe total", fmtMXN(total)],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: "flex", justifyContent: "space-between", padding: "6px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}>
                  <span style={{ fontSize: 13, color: "#64748b" }}>{label}</span>
                  <span className="sc-number" style={{ fontSize: 13, fontWeight: 600, color: "#0b1629" }}>{value}</span>
                </div>
              ))}
            </div>

            {isInsuficiente && (
              <div style={{
                display: "flex", gap: 8, padding: "10px 14px", marginBottom: 16,
                background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
              }}>
                <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ margin: 0, fontSize: 12, color: "#ef4444" }}>
                  Saldo insuficiente. Se registrará con flag <strong>saldo_insuficiente: true</strong>.
                </p>
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 9,
                  border: "1.5px solid #e2e8f0", background: "#fff",
                  fontSize: 14, fontWeight: 600, color: "#64748b", cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  flex: 1, padding: "12px 0", borderRadius: 9, border: "none",
                  background: op === "compra"
                    ? "linear-gradient(135deg,#22c55e,#16a34a)"
                    : "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  boxShadow: `0 4px 16px ${op === "compra" ? "rgba(34,197,94,0.35)" : "rgba(239,68,68,0.35)"}`,
                }}
              >
                <CheckCircle size={15} />
                Confirmar {opLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function OperacionesPage() {
  return (
    <RouteGuard allowedRoles={["gerente_cartera"]}>
      <OperacionesContent />
    </RouteGuard>
  )
}
