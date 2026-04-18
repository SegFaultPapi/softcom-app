"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) {
      router.push("/dashboard")
    } else {
      setError("Credenciales inválidas. Verifica tu correo y contraseña.")
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Accede con tu cuenta de SoftCom.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent>
            <FieldGroup>
              {error && (
                <Alert variant="destructive" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(error)}
                />
                <FieldDescription>
                  Las cuentas son creadas por un administrador. Si no tienes acceso, contacta a tu asesor.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Entrar
            </Button>

            <div className="w-full rounded-md border border-dashed p-3 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Usuarios demo</p>
              <ul className="space-y-0.5">
                <li>admin@softcom.com / admin</li>
                <li>empleado@softcom.com / empleado</li>
                <li>cliente@softcom.com / cliente</li>
              </ul>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
