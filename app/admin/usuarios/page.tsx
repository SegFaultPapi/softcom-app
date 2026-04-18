"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Pencil, Trash2, Users } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import type { Role } from "@/lib/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"

type UsuarioRow = {
  id: string
  nombre: string
  email: string
  role: Role
}

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  empleado: "Empleado",
  cliente: "Cliente",
}

export default function AdminUsuariosPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <AdminUsuariosContent />
    </RouteGuard>
  )
}

function AdminUsuariosContent() {
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<UsuarioRow | null>(null)
  const [toDelete, setToDelete] = useState<UsuarioRow | null>(null)

  // Placeholder: en el MVP vendrá del backend
  const usuarios: UsuarioRow[] = []

  const handleNew = () => {
    setEditing(null)
    setOpenForm(true)
  }

  const handleEdit = (u: UsuarioRow) => {
    setEditing(u)
    setOpenForm(true)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <PageHeader
        title="Gestión de usuarios"
        description="Alta, edición y eliminación de usuarios del sistema."
        crumbs={[
          { label: "Inicio", href: "/dashboard" },
          { label: "Usuarios" },
        ]}
        actions={
          <Button size="sm" onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo usuario
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="w-12 text-right">
                    <span className="sr-only">Acciones</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <Empty className="border-0">
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Users className="h-6 w-6" />
                          </EmptyMedia>
                          <EmptyTitle>Sin usuarios registrados</EmptyTitle>
                          <EmptyDescription>Crea el primer usuario para comenzar.</EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.nombre}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ROLE_LABEL[u.role]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Acciones para ${u.nombre}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(u)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setToDelete(u)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UsuarioFormDialog open={openForm} onOpenChange={setOpenForm} usuario={editing} />

      <AlertDialog open={Boolean(toDelete)} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la cuenta de{" "}
              <span className="font-medium">{toDelete?.nombre}</span> y sus accesos al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => setToDelete(null)}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function UsuarioFormDialog({
  open,
  onOpenChange,
  usuario,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioRow | null
}) {
  const esEdicion = Boolean(usuario)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Actualiza la información y el rol del usuario."
              : "Registra un nuevo usuario y asígnale un rol en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            onOpenChange(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="u-nombre">Nombre completo</FieldLabel>
              <Input id="u-nombre" type="text" defaultValue={usuario?.nombre ?? ""} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="u-email">Correo electrónico</FieldLabel>
              <Input id="u-email" type="email" defaultValue={usuario?.email ?? ""} required />
            </Field>

            <Field>
              <FieldLabel htmlFor="u-rol">Rol</FieldLabel>
              <Select defaultValue={usuario?.role ?? "cliente"}>
                <SelectTrigger id="u-rol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="empleado">Empleado</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {!esEdicion && (
              <Field>
                <FieldLabel htmlFor="u-password">Contraseña temporal</FieldLabel>
                <Input id="u-password" type="password" required />
              </Field>
            )}
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{esEdicion ? "Guardar cambios" : "Crear usuario"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
