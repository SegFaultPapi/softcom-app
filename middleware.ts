import { NextRequest, NextResponse } from "next/server"
import { createRemoteJWKSet, jwtVerify } from "jose"

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!

// JWKS de Privy — jose cachea la respuesta automáticamente
const JWKS = createRemoteJWKSet(
  new URL(`https://auth.privy.io/api/v1/apps/${appId}/jwks.json`),
)

export async function middleware(req: NextRequest) {
  const auth = req.headers.get("authorization")

  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    await jwtVerify(auth.slice(7), JWKS, {
      issuer: "privy.io",
      audience: appId,
    })
    return NextResponse.next()
  } catch {
    return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 })
  }
}

export const config = {
  matcher: ["/api/:path*"],
}
