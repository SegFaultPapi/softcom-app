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
  const { data, error } = await supabase
    .from("profiles")
    .select("email, role, nombre, created_at")
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { email, role, nombre } = body

  if (!email || !role) {
    return NextResponse.json({ error: "email y role son requeridos" }, { status: 400 })
  }

  const supabase = adminClient()
  const { data, error } = await supabase
    .from("profiles")
    .insert({ email, role, nombre: nombre ?? "" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
