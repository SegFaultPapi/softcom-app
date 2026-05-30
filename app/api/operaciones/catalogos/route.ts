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

  const [{ data: instrumentos, error: errInstr }, { data: portafolios, error: errPort }] =
    await Promise.all([
      supabase
        .from("instrumento")
        .select("id_instrumento, tipo, serie, tasa, fecha_vencimiento, valor_nominal")
        .order("id_instrumento"),
      supabase
        .from("portafolio")
        .select("id_portafolio, saldo_efectivo, empresa(id_empresa, nombre)")
        .order("id_portafolio"),
    ])

  if (errInstr) return NextResponse.json({ error: errInstr.message }, { status: 500 })
  if (errPort)  return NextResponse.json({ error: errPort.message  }, { status: 500 })

  return NextResponse.json({ instrumentos: instrumentos ?? [], portafolios: portafolios ?? [] })
}
