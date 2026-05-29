import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ email: string }> },
) {
  const { email } = await params
  const body = await req.json()
  const { role, nombre } = body

  const updates: Record<string, string> = {}
  if (role) updates.role = role
  if (nombre !== undefined) updates.nombre = nombre

  const supabase = adminClient()
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("email", decodeURIComponent(email))
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ email: string }> },
) {
  const { email } = await params
  const supabase = adminClient()
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("email", decodeURIComponent(email))

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
