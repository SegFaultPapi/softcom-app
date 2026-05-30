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

  // Upsert atómico: inserta si no existe, no hace nada si ya existe.
  // Esto evita la condición de carrera del check-then-insert anterior.
  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert(
      { email, nombre: nombre ?? "", role: "analyst" },
      { onConflict: "email", ignoreDuplicates: true },
    )

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  // Si tenemos nombre y el perfil lo tiene vacío, actualizarlo.
  if (nombre) {
    await supabase
      .from("profiles")
      .update({ nombre })
      .eq("email", email)
      .is("nombre", null)

    await supabase
      .from("profiles")
      .update({ nombre })
      .eq("email", email)
      .eq("nombre", "")
  }

  // Leer el perfil definitivo (con el rol real, que el admin pudo haber cambiado).
  const { data, error } = await supabase
    .from("profiles")
    .select("email, nombre, role")
    .eq("email", email)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
