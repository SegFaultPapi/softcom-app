import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  const supabase = adminClient()

  const [
    { data: posData },
    { data: pfData },
    { data: txData },
  ] = await Promise.all([
    // Todas las posiciones con instrumento
    supabase
      .from("posicion")
      .select("id_portafolio, cantidad, precio_promedio, instrumento:id_instrumento(tipo)")
      .gt("cantidad", 0),
    // Todos los portafolios
    supabase
      .from("portafolio")
      .select("id_portafolio, saldo_efectivo"),
    // Operaciones del mes actual
    supabase
      .from("transaccion")
      .select("tipo_operacion, monto_total, fecha")
      .gte("fecha", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ])

  // Capital invertido por tipo
  type PosRow = { cantidad: number; precio_promedio: string | number; instrumento: { tipo: string } | null }
  const posiciones = (posData ?? []) as PosRow[]

  const capitalInvertido = posiciones.reduce(
    (s, p) => s + p.cantidad * Number(p.precio_promedio), 0
  )
  const cetesValor = posiciones
    .filter(p => p.instrumento?.tipo === "cete")
    .reduce((s, p) => s + p.cantidad * Number(p.precio_promedio), 0)
  const bonosValor = posiciones
    .filter(p => p.instrumento?.tipo === "bono_m" || p.instrumento?.tipo === "bono")
    .reduce((s, p) => s + p.cantidad * Number(p.precio_promedio), 0)

  // Saldo total disponible
  type PfRow = { saldo_efectivo: string | number }
  const saldoTotal = ((pfData ?? []) as PfRow[]).reduce(
    (s, p) => s + Number(p.saldo_efectivo), 0
  )

  // P&L = ventas - compras (flujo neto de caja)
  type TxRow = { tipo_operacion: string; monto_total: string | number; fecha: string }
  const txs = (txData ?? []) as TxRow[]
  const plMes = txs.reduce((s, t) => {
    const m = Number(t.monto_total)
    return t.tipo_operacion === "venta" ? s + m : s - m
  }, 0)
  const operacionesMes = txs.length

  return NextResponse.json({
    capitalInvertido,
    saldoTotal,
    capitalTotal: capitalInvertido + saldoTotal,
    plMes,
    operacionesMes,
    posicionesCount: posiciones.length,
    donut: [
      { name: "CETES", value: cetesValor },
      { name: "Bonos", value: bonosValor },
    ],
    hayDatos: posiciones.length > 0,
  })
}
