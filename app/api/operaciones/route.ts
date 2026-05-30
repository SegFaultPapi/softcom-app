import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const PORTAFOLIO_MAP: Record<string, number> = { "1": 1, "2": 2, "3": 3 }
const INSTRUMENTO_MAP: Record<string, number> = {
  "cetes-28": 1, "cetes-91": 2, "bonom-7": 3, "bonom-8": 4,
}

export async function GET() {
  const supabase = adminClient()
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
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const body = await req.json()
  const { id_portafolio, id_instrumento, tipo_operacion, cantidad, monto_total, precio_sucio } = body

  const portafolioId: number = typeof id_portafolio === "number"
    ? id_portafolio
    : PORTAFOLIO_MAP[body.clienteId] ?? null

  const instrumentoId: number = typeof id_instrumento === "number"
    ? id_instrumento
    : INSTRUMENTO_MAP[body.instrId] ?? null

  if (!portafolioId || !instrumentoId || !tipo_operacion || !cantidad || !monto_total) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const supabase = adminClient()

  // Llamar la función atómica: inserta transaccion + actualiza posicion + actualiza saldo
  const { data: rpcData, error: rpcError } = await supabase.rpc("registrar_operacion", {
    p_id_portafolio:  portafolioId,
    p_id_instrumento: instrumentoId,
    p_tipo_operacion: tipo_operacion,
    p_cantidad:       Math.round(cantidad),
    p_monto_total:    monto_total,
    p_precio_sucio:   precio_sucio ?? 0,
  })

  if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 })

  const idTransaccion = (rpcData as { id_transaccion: number })?.id_transaccion

  // Devolver la transacción completa con JOINs para la tabla del historial
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
    .eq("id_transaccion", idTransaccion)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
