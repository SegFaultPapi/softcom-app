"use client"

import { Briefcase, Download, Search } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/lib/auth-context"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function PortafolioPage() {
  return (
    <RouteGuard allowedRoles={["empleado", "cliente"]}>
      <PortafolioContent />
    </RouteGuard>
  )
}

function PortafolioContent() {
  const { user } = useAuth()
  if (!user) return null

  const isEmpleado = user.role === "empleado"

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <PageHeader
        title="Portafolio"
        description="Reporte detallado de instrumentos y su valor actualizado."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Portafolio" },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        }
      />

      {isEmpleado && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
            <CardDescription>Selecciona un cliente para consultar su portafolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel htmlFor="cliente">Cliente</FieldLabel>
              <Select>
                <SelectTrigger id="cliente" className="w-full sm:max-w-sm">
                  <SelectValue placeholder="— Selecciona un cliente —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Aún no hay clientes cargados
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Posiciones</CardTitle>
          <CardDescription>Instrumentos actualmente en el portafolio.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instrumento</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio compra</TableHead>
                  <TableHead className="text-right">Valor actual</TableHead>
                  <TableHead>Vencimiento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Briefcase className="h-6 w-6" />
                        </EmptyMedia>
                        <EmptyTitle>Sin operaciones registradas</EmptyTitle>
                        <EmptyDescription>
                          {isEmpleado
                            ? "Selecciona un cliente o registra una operación para ver posiciones."
                            : "Aún no tienes instrumentos en tu portafolio. Puedes comprar bonos desde la sección Compra / Venta."}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button variant="outline" size="sm">
                          <Search className="mr-2 h-4 w-4" />
                          Ir a valuación
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
