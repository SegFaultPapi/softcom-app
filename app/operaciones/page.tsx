"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"

type Operacion = "compra" | "venta"

export default function OperacionesPage() {
  return (
    <RouteGuard allowedRoles={["empleado", "cliente"]}>
      <OperacionesContent />
    </RouteGuard>
  )
}

function OperacionesContent() {
  const [op, setOp] = useState<Operacion>("compra")

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <PageHeader
        title="Compra / Venta de bonos"
        description="Registra operaciones contra el sistema. El portafolio se actualiza al confirmar."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Compra / Venta" },
        ]}
      />

      <Tabs value={op} onValueChange={(v) => setOp(v as Operacion)}>
        <TabsList>
          <TabsTrigger value="compra">Compra</TabsTrigger>
          <TabsTrigger value="venta">Venta</TabsTrigger>
        </TabsList>

        <TabsContent value="compra" className="mt-4">
          <FormularioOperacion tipo="compra" />
        </TabsContent>
        <TabsContent value="venta" className="mt-4">
          <FormularioOperacion tipo="venta" />
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Reporte de operación</CardTitle>
          <CardDescription>Se mostrará el resumen al confirmar la operación.</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyTitle>Aún no hay operaciones</EmptyTitle>
              <EmptyDescription>Confirma una compra o venta para generar el reporte.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

function FormularioOperacion({ tipo }: { tipo: Operacion }) {
  const esVenta = tipo === "venta"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base capitalize">{tipo} de bono</CardTitle>
        <CardDescription>
          {esVenta
            ? "Selecciona un bono de tu portafolio e indica la cantidad a vender."
            : "Selecciona el bono e indica la cantidad a comprar."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={(e) => e.preventDefault()}>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="bono">Bono</FieldLabel>
              <Select>
                <SelectTrigger id="bono">
                  <SelectValue placeholder="— Selecciona un instrumento —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    {esVenta ? "No hay bonos en el portafolio" : "Sin bonos disponibles aún"}
                  </SelectItem>
                </SelectContent>
              </Select>
              {esVenta && <FieldDescription>Cantidad disponible: —</FieldDescription>}
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="precio">Precio unitario</FieldLabel>
                <InputGroup>
                  <InputGroupInput id="precio" type="number" step="0.01" placeholder="0.00" />
                  <InputGroupAddon align="inline-end">MXN</InputGroupAddon>
                </InputGroup>
                <FieldDescription>Proviene de la valuación.</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="cantidad">{esVenta ? "Cantidad a vender" : "Cantidad a comprar"}</FieldLabel>
                <Input id="cantidad" type="number" min={1} step={1} placeholder="0" />
              </Field>
            </div>

            <Separator />

            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Importe total estimado</span>
              <span className="font-mono font-medium">— MXN</span>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="ghost">
            Cancelar
          </Button>
          <Button type="submit" variant={esVenta ? "destructive" : "default"}>
            Confirmar {tipo}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
