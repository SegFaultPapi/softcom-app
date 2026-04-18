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

export default function ValuacionPage() {
  return (
    <RouteGuard allowedRoles={["empleado", "cliente"]}>
      <ValuacionContent />
    </RouteGuard>
  )
}

function ValuacionContent() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <PageHeader
        title="Valuación de bonos"
        description="Captura los parámetros del instrumento para obtener su valor presente."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Valuación de bonos" },
        ]}
      />

      <Tabs defaultValue="cetes">
        <TabsList>
          <TabsTrigger value="cetes">CETES (cupón cero)</TabsTrigger>
          <TabsTrigger value="bono_m">Bonos M (tasa fija)</TabsTrigger>
        </TabsList>

        <TabsContent value="cetes" className="mt-4">
          <FormularioCetes />
        </TabsContent>
        <TabsContent value="bono_m" className="mt-4">
          <FormularioBonoM />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ResultadoPrecio({ precio }: { precio: string | null }) {
  return (
    <Alert>
      <Calculator className="h-4 w-4" />
      <AlertTitle>Precio calculado</AlertTitle>
      <AlertDescription>
        {precio ? (
          <span className="font-mono text-base">{precio} MXN</span>
        ) : (
          <span className="text-muted-foreground">Captura los parámetros y presiona Calcular para ver el precio.</span>
        )}
      </AlertDescription>
    </Alert>
  )
}

function FormularioCetes() {
  const [precio, setPrecio] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros CETES</CardTitle>
        <CardDescription>
          Bono de un solo flujo (cupón cero). Se descuenta el valor nominal con la tasa de referencia.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setPrecio("—") // TODO: cálculo real
        }}
      >
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="cetes-vn">Valor nominal</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="cetes-vn" type="number" step="0.01" defaultValue={10} />
                  <InputGroupAddon align="inline-end">MXN</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Típico: 10 MXN.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="cetes-tasa">Tasa de descuento</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="cetes-tasa" type="number" step="0.01" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Tasa de referencia.</FieldDescription>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="cetes-vto">Fecha de vencimiento</FieldLabel>
              <Input id="cetes-vto" type="date" />
            </Field>
          </FieldGroup>

          <Separator className="my-6" />
          <ResultadoPrecio precio={precio} />
        </CardContent>

        <CardFooter className="justify-between gap-2">
          <Button type="reset" variant="ghost" onClick={() => setPrecio(null)}>
            Limpiar
          </Button>
          <div className="flex gap-2">
            <Button type="submit">Calcular precio</Button>
            <Button type="button" variant="secondary" disabled={!precio}>
              Ir a Compra / Venta
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

function FormularioBonoM() {
  const [precio, setPrecio] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros Bono M</CardTitle>
        <CardDescription>
          Bono de tasa fija con múltiples flujos (cupones). Se descuenta la anualidad más el valor nominal al
          vencimiento.
        </CardDescription>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setPrecio("—") // TODO: cálculo real
        }}
      >
        <CardContent>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="bm-vn">Valor nominal</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="bm-vn" type="number" step="0.01" defaultValue={100} />
                  <InputGroupAddon align="inline-end">MXN</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Típico: 100 MXN.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="bm-vto">Fecha de vencimiento</FieldLabel>
                <Input id="bm-vto" type="date" />
              </Field>

              <Field>
                <FieldLabel htmlFor="bm-frec">Frecuencia de pagos</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="bm-frec" type="number" defaultValue={6} min={1} />
                  <InputGroupAddon align="inline-end">meses</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Periodicidad del cupón (6 meses por defecto).</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="bm-cupon">Tasa cupón</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="bm-cupon" type="number" step="0.01" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="bm-tasa">Tasa de descuento</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="bm-tasa" type="number" step="0.01" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Tasa de referencia.</FieldDescription>
              </Field>
            </div>
          </FieldGroup>

          <Separator className="my-6" />
          <ResultadoPrecio precio={precio} />
        </CardContent>

        <CardFooter className="justify-between gap-2">
          <Button type="reset" variant="ghost" onClick={() => setPrecio(null)}>
            Limpiar
          </Button>
          <div className="flex gap-2">
            <Button type="submit">Calcular precio</Button>
            <Button type="button" variant="secondary" disabled={!precio}>
              Ir a Compra / Venta
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
