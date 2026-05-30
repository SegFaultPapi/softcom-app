"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Plus, Pencil, Trash2, Users, Loader2, RefreshCw } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"
import { PageHeader } from "@/components/page-header"
import type { Role } from "@/lib/auth-context"
import { useApiFetch } from "@/hooks/use-api-fetch"
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
  email: string
  nombre: string
  role: Role
}

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  gerente_cartera: "Gerente de Cartera",
  analyst: "Analista",
}

export default function AdminUsuariosPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <AdminUsuariosContent />
    </RouteGuard>
  )
}

function AdminUsuariosContent() {
  const apiFetch = useApiFetch()
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState<UsuarioRow | null>(null)
  const [toDelete, setToDelete] = useState<UsuarioRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchUsuarios() {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await apiFetch("/api/admin/usuarios", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) {
        setFetchError(data.error ?? "Error al obtener usuarios")
        setUsuarios([])
      } else {
        setUsuarios(Array.isArray(data) ? data : [])
      }
    } catch {
      setFetchError("No se pudo conectar con el servidor")
      setUsuarios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  const handleNew = () => {
    setEditing(null)
    setOpenForm(true)
  }

  const handleEdit = (u: UsuarioRow) => {
    setEditing(u)
    setOpenForm(true)
  }

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    await apiFetch(`/api/admin/usuarios/${encodeURIComponent(toDelete.email)}`, {
      method: "DELETE",
    })
    setToDelete(null)
    setDeleting(false)
    fetchUsuarios()
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
          <div style={{ display: "flex", gap: 8 }}>
            <Button size="sm" variant="outline" onClick={fetchUsuarios} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button size="sm" onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo usuario
            </Button>
          </div>
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center">
                      <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : fetchError ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-destructive">
                      {fetchError}
                    </TableCell>
                  </TableRow>
                ) : usuarios.length === 0 ? (
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
                    <TableRow key={u.email}>
                      <TableCell className="font-medium">
                        {u.nombre || u.email.split("@")[0]}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{ROLE_LABEL[u.role]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Acciones para ${u.email}`}>
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

      <UsuarioFormDialog
        open={openForm}
        onOpenChange={setOpenForm}
        usuario={editing}
        onSuccess={fetchUsuarios}
      />

      <AlertDialog open={Boolean(toDelete)} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el acceso de{" "}
              <span className="font-medium">{toDelete?.email}</span> al sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </AlertDialogAction>
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
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario: UsuarioRow | null
  onSuccess: () => void
}) {
  const apiFetch = useApiFetch()
  const esEdicion = Boolean(usuario)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [nombre, setNombre] = useState(usuario?.nombre ?? "")
  const [email, setEmail] = useState(usuario?.email ?? "")
  const [role, setRole] = useState<Role>(usuario?.role ?? "analyst")

  useEffect(() => {
    if (open) {
      setNombre(usuario?.nombre ?? "")
      setEmail(usuario?.email ?? "")
      setRole(usuario?.role ?? "analyst")
      setError(null)
    }
  }, [open, usuario])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    let res: Response
    if (esEdicion) {
      res = await apiFetch(`/api/admin/usuarios/${encodeURIComponent(usuario!.email)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, nombre }),
      })
    } else {
      res = await apiFetch("/api/admin/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, nombre }),
      })
    }

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error ?? "Error al guardar")
      return
    }

    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {esEdicion
              ? "Actualiza el nombre y el rol del usuario."
              : "Registra un nuevo usuario y asígnale un rol en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="u-nombre">Nombre completo</FieldLabel>
              <Input
                id="u-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="u-email">Correo electrónico</FieldLabel>
              <Input
                id="u-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={esEdicion}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="u-rol">Rol</FieldLabel>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger id="u-rol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gerente_cartera">Gerente de Cartera</SelectItem>
                  <SelectItem value="analyst">Analista</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {esEdicion ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
