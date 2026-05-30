import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: Request) {
  const { email, nombre } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "email requerido" }, { status: 400 })
  }

  const supabase = adminClient()

  // 1. Verifica si ya existe el perfil
  const { data: existing } = await supabase
    .from("profiles")
    .select("email, nombre, role")
    .eq("email", email)
    .maybeSingle()

  if (existing) {
    // El perfil ya existe; solo actualiza el nombre si el admin no lo ha personalizado
    if (nombre && !existing.nombre) {
      await supabase
        .from("profiles")
        .update({ nombre })
        .eq("email", email)
    }
    return NextResponse.json({ ...existing, nombre: existing.nombre || nombre })
  }

  // 2. No existe → crear con rol analyst por defecto
  const { data, error } = await supabase
    .from("profiles")
    .insert({ email, nombre: nombre ?? "", role: "analyst" })
    .select("email, nombre, role")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
