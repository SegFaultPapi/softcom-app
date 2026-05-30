"use client"

import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { Download, FileText, TrendingUp, BarChart3 } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

export default function EstadosFinancierosPage() {
  return (
    <RouteGuard allowedRoles={["analyst"]}>
      <EstadosFinancierosContent />
    </RouteGuard>
  )
}

function EstadosFinancierosContent() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <PageHeader
        title="Estados Financieros"
        description="Balance general, estado de resultados e indicadores financieros por empresa."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Estados Financieros" },
        ]}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exportar reporte
          </Button>
        }
      />

      {/* Empresa selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Empresa</CardTitle>
          <CardDescription>Selecciona una empresa para consultar sus estados financieros.</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel htmlFor="ef-empresa">Empresa cliente</FieldLabel>
            <Select>
              <SelectTrigger id="ef-empresa" className="w-full sm:max-w-sm">
                <SelectValue placeholder="— Selecciona una empresa —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placeholder" disabled>
                  Aún no hay empresas cargadas
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Tabs defaultValue="balance">
        <TabsList>
          <TabsTrigger value="balance">Balance General</TabsTrigger>
          <TabsTrigger value="resultados">Estado de Resultados</TabsTrigger>
          <TabsTrigger value="indicadores">Indicadores Financieros</TabsTrigger>
        </TabsList>

        {/* ── BALANCE GENERAL ── */}
        <TabsContent value="balance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-500" />
                Balance General
              </CardTitle>
              <CardDescription>
                Ecuación contable: <strong>Activo = Pasivo + Capital</strong>. 
                Incluye inversiones en valores y pagos pendientes por cobrar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Total Activos</TableHead>
                      <TableHead className="text-right">Total Pasivos</TableHead>
                      <TableHead className="text-right">Capital</TableHead>
                      <TableHead className="text-right">Inversiones en Valores</TableHead>
                      <TableHead className="text-right">Pagos Pendientes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <Empty className="border-0">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <FileText className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Sin balances registrados</EmptyTitle>
                            <EmptyDescription>
                              Selecciona una empresa para consultar su balance general.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ESTADO DE RESULTADOS ── */}
        <TabsContent value="resultados" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Estado de Resultados
              </CardTitle>
              <CardDescription>
                Ecuación: <strong>Utilidad Neta = Ingreso Total − Gasto Total</strong>. 
                Desglose por período fiscal (mensual, trimestral).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Año</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Ingreso Total</TableHead>
                      <TableHead className="text-right">Gasto Total</TableHead>
                      <TableHead className="text-right">Utilidad Neta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <Empty className="border-0">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <TrendingUp className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Sin estados de resultados</EmptyTitle>
                            <EmptyDescription>
                              Selecciona una empresa para consultar sus ingresos, gastos y utilidad.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── INDICADORES FINANCIEROS ── */}
        <TabsContent value="indicadores" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-500" />
                Indicadores Financieros
              </CardTitle>
              <CardDescription>
                Ratios clave: ROE (Return on Equity), Liquidez (AC/PC) y Solvencia (AT/PT).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">ROE (%)</TableHead>
                      <TableHead className="text-right">Liquidez</TableHead>
                      <TableHead className="text-right">Solvencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <Empty className="border-0">
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <BarChart3 className="h-6 w-6" />
                            </EmptyMedia>
                            <EmptyTitle>Sin indicadores calculados</EmptyTitle>
                            <EmptyDescription>
                              Los indicadores se calculan a partir del balance general y estado de resultados.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
