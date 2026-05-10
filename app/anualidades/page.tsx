"use client"

import { useState } from "react"
import { Calculator } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AnualidadesPage() {
  return (
    <RouteGuard allowedRoles={["analyst"]}>
      <AnualidadesContent />
    </RouteGuard>
  )
}

function AnualidadesContent() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <PageHeader
        title="Anualidades"
        description="Calcula valor presente y valor futuro de series de pagos periódicos."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Anualidades" },
        ]}
        tag="Módulo financiero"
      />

      <Tabs defaultValue="ordinaria">
        <TabsList>
          <TabsTrigger value="ordinaria">Ordinaria (vencida)</TabsTrigger>
          <TabsTrigger value="anticipada">Anticipada</TabsTrigger>
          <TabsTrigger value="diferida">Diferida</TabsTrigger>
        </TabsList>

        <TabsContent value="ordinaria" className="mt-4">
          <FormularioAnualidad tipo="ordinaria" />
        </TabsContent>
        <TabsContent value="anticipada" className="mt-4">
          <FormularioAnualidad tipo="anticipada" />
        </TabsContent>
        <TabsContent value="diferida" className="mt-4">
          <FormularioAnualidad tipo="diferida" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FormularioAnualidad({ tipo }: { tipo: "ordinaria" | "anticipada" | "diferida" }) {
  const [resultado, setResultado] = useState<{ vp: string; vf: string } | null>(null)

  const desc: Record<string, string> = {
    ordinaria: "Los pagos se realizan al final de cada período. Es la más común en préstamos y rentas.",
    anticipada: "Los pagos se realizan al inicio de cada período. Común en arrendamientos.",
    diferida: "Los pagos comienzan después de un período de gracia. Incluye un período de diferimiento.",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anualidad {tipo}</CardTitle>
        <CardDescription>{desc[tipo]}</CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const importe = parseFloat((form.querySelector("#an-importe") as HTMLInputElement)?.value || "0")
          const tasa = parseFloat((form.querySelector("#an-tasa") as HTMLInputElement)?.value || "0") / 100
          const n = parseInt((form.querySelector("#an-periodos") as HTMLInputElement)?.value || "0")

          if (importe > 0 && tasa > 0 && n > 0) {
            // VP = Importe × [(1 - (1+i)^-n) / i]
            const vp = importe * ((1 - Math.pow(1 + tasa, -n)) / tasa)
            // VF = Importe × [((1+i)^n - 1) / i]
            const vf = importe * ((Math.pow(1 + tasa, n) - 1) / tasa)

            let vpFinal = vp
            let vfFinal = vf
            if (tipo === "anticipada") {
              vpFinal = vp * (1 + tasa)
              vfFinal = vf * (1 + tasa)
            }

            setResultado({
              vp: vpFinal.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }),
              vf: vfFinal.toLocaleString("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 }),
            })
          }
        }}
      >
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="an-importe">Importe por período</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="an-importe" type="number" step="0.01" placeholder="100000" />
                  <InputGroupAddon align="inline-end">MXN</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Pago periódico fijo.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="an-tasa">Tasa por período</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="an-tasa" type="number" step="0.001" placeholder="0.50" />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Ej: 0.5% mensual = 6% anual / 12.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="an-periodos">Número de períodos</FieldLabel>
                <Input id="an-periodos" type="number" min={1} step={1} placeholder="60" />
                <FieldDescription>Cantidad total de pagos.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="an-fecha">Fecha de inicio</FieldLabel>
                <Input id="an-fecha" type="date" />
              </Field>
            </div>

            {tipo === "diferida" && (
              <Field>
                <FieldLabel htmlFor="an-diferimiento">Períodos de diferimiento</FieldLabel>
                <Input id="an-diferimiento" type="number" min={1} step={1} placeholder="6" />
                <FieldDescription>Número de períodos de gracia antes del primer pago.</FieldDescription>
              </Field>
            )}
          </FieldGroup>

          <Separator className="my-6" />

          {resultado ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertTitle>Valor Presente (VP)</AlertTitle>
                <AlertDescription>
                  <span className="font-mono text-base font-semibold">{resultado.vp}</span>
                </AlertDescription>
              </Alert>
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertTitle>Valor Futuro (VF)</AlertTitle>
                <AlertDescription>
                  <span className="font-mono text-base font-semibold">{resultado.vf}</span>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertTitle>Resultado</AlertTitle>
              <AlertDescription>
                Captura los parámetros y presiona Calcular para obtener VP y VF.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="justify-between gap-2">
          <Button type="reset" variant="ghost" onClick={() => setResultado(null)}>
            Limpiar
          </Button>
          <Button type="submit">Calcular</Button>
        </CardFooter>
      </form>
    </Card>
  )
}
