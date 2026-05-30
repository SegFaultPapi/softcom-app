import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const TIPO_MAP: Record<string, string> = { cete: "CETES", bono_m: "BONO_M", bono: "BONO_M" }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const portafolioId = parseInt(searchParams.get("portafolioId") ?? "0", 10)

  if (!portafolioId) {
    return NextResponse.json({ error: "portafolioId requerido" }, { status: 400 })
  }

  const supabase = adminClient()

  const [{ data: posData, error: posErr }, { data: pfData, error: pfErr }] = await Promise.all([
    supabase
      .from("posicion")
      .select(`
        id_instrumento,
        cantidad,
        precio_promedio,
        instrumento:id_instrumento ( tipo, serie, tasa, fecha_vencimiento, valor_nominal )
      `)
      .eq("id_portafolio", portafolioId)
      .gt("cantidad", 0),
    supabase
      .from("portafolio")
      .select("saldo_efectivo")
      .eq("id_portafolio", portafolioId)
      .single(),
  ])

  if (posErr || pfErr) {
    return NextResponse.json({ error: (posErr ?? pfErr)?.message }, { status: 500 })
  }

  type RawPos = {
    id_instrumento: number
    cantidad: number
    precio_promedio: string | number
    instrumento: { tipo: string; serie: string; tasa: number | null; fecha_vencimiento: string; valor_nominal: number } | null
  }

  const posiciones = (posData as RawPos[]).map((p) => ({
    id: `db:${p.id_instrumento}`,
    instrumento: p.instrumento?.serie ?? `Instrumento #${p.id_instrumento}`,
    tipo: TIPO_MAP[p.instrumento?.tipo ?? ""] ?? p.instrumento?.tipo?.toUpperCase() ?? "—",
    cantidad: p.cantidad,
    precioCompra: Number(p.precio_promedio),
    precioActual: Number(p.precio_promedio), // sin datos de mercado, precio actual = precio promedio
    vencimiento: p.instrumento?.fecha_vencimiento ?? "",
  }))

  return NextResponse.json({
    saldo: Number((pfData as { saldo_efectivo: string | number }).saldo_efectivo),
    posiciones,
  })
}
