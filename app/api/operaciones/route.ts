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

  // Aceptar IDs directos (del front) o los viejos keys de mock (legacy)
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
  const { data, error } = await supabase
    .from("transaccion")
    .insert({
      id_portafolio: portafolioId,
      id_instrumento: instrumentoId,
      tipo_operacion,
      cantidad: Math.round(cantidad),
      monto_total,
      precio_sucio: precio_sucio ?? null,
    })
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
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
