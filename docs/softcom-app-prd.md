# PRD — SoftCom Solutions: Plataforma de Valuación de Bonos
**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Estado:** Draft — Development Ready  
**Autor:** SoftCom Builder Team

---

## 1. Project Overview

### 1.1 Problema

Las casas de bolsa en México operan con herramientas fragmentadas para valuar y gestionar portafolios de bonos: hojas de cálculo manuales, sistemas legacy sin trazabilidad, y acceso no controlado por roles. Esto genera errores operativos, riesgo regulatorio y falta de visibilidad en tiempo real para los equipos de gestión de cartera.

**Pain points específicos:**
- Valuación manual de CETES y Bonos M sin estandarización de fórmulas
- Sin log de trazabilidad en compras/ventas → riesgo de auditoría
- Analistas y gerentes acceden a las mismas vistas sin control de permisos
- KYC desconectado del flujo operativo
- Portafolios de clientes que no se actualizan automáticamente tras cada operación

### 1.2 Solución

SoftCom es una plataforma web interna B2B para casas de bolsa que centraliza la valuación de bonos (CETES y Bonos M), la gestión de portafolios de clientes, y el control de operaciones con roles diferenciados y trazabilidad completa.

**Propuesta de valor central:** Una herramienta lista para usar que reduce el tiempo de valuación de bonos de minutos a segundos, con logs auditables y dashboards en tiempo real — vendida como SaaS a entidades financieras.

### 1.3 Objetivos del MVP

| # | Objetivo | Métrica de éxito |
|---|----------|-----------------|
| 1 | Validar flujo completo de valuación + compra | Gerente ejecuta operación de CETES y Bono M en < 3 minutos |
| 2 | Demostrar control de acceso por roles | Admin, Gerente y Analista tienen vistas diferenciadas |
| 3 | Mostrar trazabilidad a compradores | Log de operaciones con timestamps consultable |
| 4 | Generar reporte exportable | Portafolio descargable en formato numérico |
| 5 | Validar product-market fit | Demo a 3 casas de bolsa; al menos 1 solicita piloto |

### 1.4 Usuario Target

#### Persona 1 — Carlos M. (Administrador del Sistema)
- **Rol:** IT o Compliance en la casa de bolsa
- **Edad:** 35-50 años
- **Motivación:** Dar de alta clientes correctamente, mantener control de accesos y cumplir con KYC regulatorio
- **Frustraciones:** Procesos manuales de registro, sin trazabilidad de quién hizo qué
- **Needs:** Alta de clientes rápida, asignación de saldos, gestión de usuarios del sistema

#### Persona 2 — Sofía R. (Gerente de Cartera)
- **Rol:** Portfolio Manager
- **Edad:** 30-45 años
- **Motivación:** Ejecutar operaciones eficientes, tener visibilidad del portafolio de sus clientes
- **Frustraciones:** Valuación manual en Excel, falta de historial de operaciones, no puede ver el portafolio en tiempo real
- **Needs:** Valuación rápida, ejecución de compra/venta, dashboard consolidado

#### Persona 3 — Diego L. (Analista)
- **Rol:** Analista de inversiones junior
- **Edad:** 25-35 años
- **Motivación:** Consultar portafolios y métricas para generar reportes para sus superiores
- **Frustraciones:** No tiene acceso a información consolidada, depende de otros para obtener datos
- **Needs:** Vista de portafolio de clientes, gráficas, exportación de datos

### 1.5 Business Model

SoftCom se comercializa como **SaaS B2B** dirigido a casas de bolsa, SOFOMES y entidades financieras reguladas en México:

- **Modelo de ingresos:** Suscripción mensual por número de usuarios activos + onboarding fee
- **Pricing tier inicial:** $2,500–$8,000 MXN/mes por entidad (escala con usuarios y volumen de operaciones)
- **Canal de venta:** Demos directas a directores de tecnología y operaciones en casas de bolsa
- **Ventaja competitiva:** Fórmulas financieras certificadas + control de roles + trazabilidad auditable → cumplimiento regulatorio CNBV

---

## 2. User Stories & Acceptance Criteria

### Epic 1: Autenticación y Control de Acceso

#### US-01: Login con roles diferenciados
**Como** usuario del sistema (Admin / Gerente / Analista),  
**quiero** iniciar sesión con mis credenciales,  
**para** acceder únicamente a las funcionalidades correspondientes a mi rol.

**Acceptance Criteria:**
- [ ] El sistema acepta email + contraseña como credenciales
- [ ] Login fallido muestra mensaje de error sin revelar si el email existe
- [ ] Tras login exitoso, el sistema redirige al dashboard correspondiente al rol:
  - Admin → Panel de gestión de usuarios y clientes
  - Gerente → Dashboard de portafolios + módulo de valuación
  - Analista → Vista de portafolio (solo lectura)
- [ ] Sesión expira tras 30 minutos de inactividad
- [ ] Cada acción del usuario queda registrada con timestamp y user_id en el log del sistema

#### US-02: Logout seguro
**Como** usuario autenticado,  
**quiero** cerrar sesión,  
**para** proteger el acceso a información confidencial.

**Acceptance Criteria:**
- [ ] Botón de logout visible en toda la navegación
- [ ] Al hacer logout, el token/sesión se invalida en servidor
- [ ] Redirige a pantalla de login

---

### Epic 2: KYC y Gestión de Clientes (Admin)

#### US-03: Alta de cliente con KYC simulado
**Como** Administrador,  
**quiero** registrar un cliente con sus datos básicos de identificación y saldo inicial,  
**para** que el Gerente pueda operar en nombre de ese cliente.

**Acceptance Criteria:**
- [ ] Formulario con campos: Nombre completo, RFC (13 caracteres), CURP (18 caracteres), email de contacto, saldo inicial virtual (MXN)
- [ ] RFC y CURP validan formato con regex antes de guardar
- [ ] Si el RFC ya existe en el sistema, muestra error "Cliente ya registrado"
- [ ] Al guardar, el cliente aparece en la lista con status "Activo" y saldo asignado
- [ ] El log registra: admin_id, client_id, timestamp, saldo_asignado
- [ ] El Administrador puede ver la lista de todos los clientes registrados
- [ ] El Administrador puede editar datos de un cliente (excepto RFC y CURP)
- [ ] El Administrador puede desactivar (no eliminar) un cliente

#### US-04: Gestión de usuarios del sistema
**Como** Administrador,  
**quiero** crear y gestionar usuarios del sistema,  
**para** controlar quién tiene acceso y con qué rol.

**Acceptance Criteria:**
- [ ] Admin puede crear usuarios con: nombre, email, contraseña temporal, rol (Admin/Gerente/Analista)
- [ ] Admin puede cambiar el rol de un usuario existente
- [ ] Admin puede desactivar usuarios (no eliminar)
- [ ] Usuario desactivado no puede iniciar sesión

---

### Epic 3: Valuación de Bonos

#### US-05: Valuación de CETES
**Como** Gerente de Cartera,  
**quiero** calcular el precio de un CETES ingresando sus parámetros,  
**para** determinar el valor justo antes de ejecutar una operación.

**Acceptance Criteria:**
- [ ] Formulario con inputs: Valor nominal (F), Tasa de descuento / referencia (r en %), Plazo en días (N), Número de títulos a operar
- [ ] El sistema aplica la fórmula: `P = F / (1 + r)^(N/360)` y muestra resultado en MXN
- [ ] Se muestra: Precio unitario, Precio total (unitario × títulos), Rendimiento implícito
- [ ] El resultado se muestra en menos de 1 segundo
- [ ] Existe una tasa de referencia por defecto (Banxico) editable por el Gerente en ese momento
- [ ] Botón "Comprar" y "Vender" disponibles desde la pantalla de resultado
- [ ] Si el total supera el saldo disponible del cliente seleccionado, se muestra advertencia (no bloquea)

#### US-06: Valuación de Bono M
**Como** Gerente de Cartera,  
**quiero** calcular el precio de un Bono M con pagos semestrales,  
**para** valuar correctamente instrumentos de tasa fija.

**Acceptance Criteria:**
- [ ] Formulario con inputs: Valor nominal (F), Tasa cupón anual (%), Tasa de mercado / descuento (r en %), Número de períodos semestrales (N), Número de títulos
- [ ] El sistema aplica: `P = A × [1-(1+r)^-N / r] + F/(1+r)^N` donde `A = F × (tasa_cupón/2)`
- [ ] Se muestra: Precio sucio (P), Cupón semestral unitario (A), Precio total (P × títulos), Duración simple en períodos
- [ ] Botón "Comprar" y "Vender" disponibles desde el resultado
- [ ] Validación: si r = 0, el sistema no divide por cero (maneja el caso edge)

---

### Epic 4: Ejecución de Operaciones

#### US-07: Compra de bono
**Como** Gerente de Cartera,  
**quiero** ejecutar la compra de un bono valuado para un cliente específico,  
**para** registrar la operación en su portafolio con trazabilidad.

**Acceptance Criteria:**
- [ ] Antes de ejecutar, el Gerente selecciona el cliente del portafolio
- [ ] Pantalla de confirmación muestra: cliente, instrumento, cantidad, precio unitario, precio total, saldo disponible antes y después
- [ ] Al confirmar, el saldo del cliente se reduce en el monto total de la operación
- [ ] La operación se registra en el log con: operation_id, tipo (COMPRA), instrumento, cantidad, precio_unitario, precio_total, client_id, gerente_id, timestamp (UTC)
- [ ] El portafolio del cliente se actualiza inmediatamente con el nuevo instrumento
- [ ] El log es inmutable (no puede editarse ni eliminarse desde la UI)
- [ ] Si el saldo es insuficiente y el Gerente confirma de todas formas, la operación se registra con flag "saldo_insuficiente: true" pero se ejecuta (simulación)

#### US-08: Venta de bono
**Como** Gerente de Cartera,  
**quiero** ejecutar la venta de un instrumento del portafolio de un cliente,  
**para** liquidar posiciones y actualizar el saldo disponible.

**Acceptance Criteria:**
- [ ] El Gerente selecciona el instrumento a vender desde el portafolio del cliente
- [ ] Solo se pueden vender instrumentos que el cliente tenga en portafolio
- [ ] Pantalla de confirmación muestra: instrumento, cantidad a vender, precio actual, ingreso estimado
- [ ] Al confirmar: saldo del cliente incrementa en el valor de venta; instrumento se reduce o elimina del portafolio
- [ ] Log registra: tipo (VENTA), con los mismos campos que compra
- [ ] No es posible vender más títulos de los que el cliente tiene

---

### Epic 5: Dashboard y Portafolio

#### US-09: Dashboard de capital e inversiones
**Como** Gerente o Analista,  
**quiero** ver el resumen financiero consolidado de un cliente,  
**para** tomar decisiones informadas o generar reportes.

**Acceptance Criteria:**
- [ ] Dashboard muestra para el cliente seleccionado:
  - Capital total (saldo disponible + valor actual del portafolio)
  - Capital disponible (saldo no invertido)
  - Capital invertido (valor actual de todos los instrumentos)
  - % invertido vs disponible
- [ ] Gráfica de dona: distribución por instrumento (CETES vs Bonos M)
- [ ] Gráfica de barras: desglose por instrumento con valor actual
- [ ] Línea de tiempo: historial de valor total del portafolio (basado en operaciones registradas)
- [ ] Las gráficas se actualizan al seleccionar un cliente diferente
- [ ] El Analista ve el dashboard pero NO tiene botones de operar (solo lectura)

#### US-10: Portafolio dinámico
**Como** Gerente o Analista,  
**quiero** ver el portafolio detallado de cada cliente,  
**para** conocer cada posición con su valor actual.

**Acceptance Criteria:**
- [ ] Tabla con columnas: Instrumento, Tipo, Cantidad (títulos), Precio de compra, Precio actual, Valor total, P&L (diferencia)
- [ ] El portafolio se actualiza automáticamente tras cada operación sin necesidad de recargar la página
- [ ] Si el portafolio está vacío, muestra estado vacío con CTA para operar (solo visible para Gerente)

#### US-11: Exportación de portafolio
**Como** Gerente o Analista,  
**quiero** descargar el portafolio en formato numérico,  
**para** compartirlo o integrarlo con otros sistemas.

**Acceptance Criteria:**
- [ ] Botón "Exportar" visible en la vista de portafolio
- [ ] El archivo descargado es CSV con columnas: Instrumento, Tipo, Cantidad, Precio_Compra, Precio_Actual, Valor_Total, PnL, Fecha_Ultima_Operacion
- [ ] El nombre del archivo incluye: `portafolio_{nombre_cliente}_{fecha}.csv`
- [ ] La exportación incluye una fila de totales al final

---

## 3. UI/UX Requirements

### 3.1 Principios de Diseño

- **Densidad de información controlada:** Interfaz tipo Bloomberg-light — datos financieros presentados con jerarquía clara, no sobrecargada
- **Confianza visual:** Paleta de colores sobria (azules oscuros, blancos, verdes para positivos, rojos para negativos)
- **Acción rápida:** Flujo de valuación → confirmación en máximo 3 clics
- **Trazabilidad visible:** Log de operaciones siempre accesible desde el sidebar

### 3.2 Arquitectura de Pantallas

```
├── /login                          → Pantalla de autenticación
├── /dashboard                      → Hub principal (varía por rol)
│   ├── (Admin) /clientes           → Lista y alta de clientes
│   ├── (Admin) /usuarios           → Gestión de usuarios del sistema
│   ├── (Gerente/Analista) /portafolio/:clientId  → Dashboard + portafolio
│   ├── (Gerente) /valuar           → Módulo de valuación
│   │   ├── /valuar/cetes           → Formulario CETES
│   │   └── /valuar/bono-m          → Formulario Bono M
│   ├── (Gerente) /operaciones      → Log de operaciones
│   └── /perfil                     → Configuración de cuenta
```

### 3.3 Wireframe Descriptions

#### Pantalla: Login
- Centrado verticalmente, logo SoftCom arriba
- Campos: Email, Contraseña, botón "Iniciar Sesión"
- Link "¿Olvidaste tu contraseña?" (fuera de scope MVP, solo UI)
- Sin opción de registro (solo Admin crea cuentas)

#### Pantalla: Dashboard Admin
- Sidebar izquierdo con navegación: Clientes, Usuarios, Log del sistema
- Panel principal: tabla de clientes con columnas (Nombre, RFC, Saldo, Status, Acciones)
- Botón "Nuevo Cliente" en la esquina superior derecha
- Modal de alta con el formulario KYC

#### Pantalla: Dashboard Gerente/Analista
- Selector de cliente en la parte superior (dropdown con búsqueda)
- KPIs en cards: Capital Total, Capital Disponible, Capital Invertido, % Invertido
- Dos columnas: gráficas a la izquierda (dona + barras), tabla de portafolio a la derecha
- Línea de tiempo abajo (full width)
- FAB (Floating Action Button) "Valuar / Operar" — solo visible para Gerente

#### Pantalla: Valuación de CETES
- Formulario en 2 columnas: inputs a la izquierda, preview del resultado a la derecha (actualización en tiempo real al escribir)
- Inputs: Cliente (selector), Valor nominal, Tasa de referencia (pre-llenada con default), Plazo (días), Cantidad de títulos
- Resultado: Precio unitario, Precio total, Rendimiento implícito
- Botones: "Comprar" (verde) / "Vender" (rojo) / "Limpiar"

#### Pantalla: Valuación de Bono M
- Mismo layout que CETES, con inputs adicionales: Tasa cupón, Períodos semestrales
- Resultado adicional: Cupón semestral, Duración simple
- Mismos botones de acción

#### Pantalla: Confirmación de Operación (Modal)
- Resumen de la operación en tabla
- Saldo antes / después
- Dos botones: "Confirmar" / "Cancelar"
- Spinner durante procesamiento

#### Pantalla: Log de Operaciones
- Tabla con filtros: por cliente, por tipo (COMPRA/VENTA), por fecha
- Columnas: ID, Fecha/Hora, Cliente, Tipo, Instrumento, Cantidad, Precio, Total, Ejecutado por
- Sin botón de editar ni eliminar (inmutable)
- Export a CSV del log filtrado

### 3.4 User Flows Críticos

**Flow A: Valuación y Compra de CETES (Happy Path)**
```
Login (Gerente) → Dashboard → Click "Valuar" → Seleccionar CETES
→ Seleccionar Cliente → Ingresar parámetros → Ver resultado en tiempo real
→ Click "Comprar" → Modal de confirmación → Confirmar
→ Toast "Operación exitosa" → Portafolio actualizado → Log registrado
```
Tiempo objetivo: < 3 minutos desde login hasta operación confirmada.

**Flow B: Alta de Cliente (Admin)**
```
Login (Admin) → Dashboard Clientes → "Nuevo Cliente"
→ Formulario KYC → Validación RFC/CURP → Guardar
→ Cliente aparece en lista → Log registrado
```

**Flow C: Consulta de Portafolio (Analista)**
```
Login (Analista) → Dashboard → Seleccionar cliente
→ Ver KPIs → Ver gráficas → Ver tabla portafolio → Click "Exportar"
→ Descarga CSV
```

---

## 4. Technical Requirements

### 4.1 Stack Recomendado

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | React + TypeScript | Tipado fuerte para fórmulas financieras; ecosistema maduro |
| Estilos | Tailwind CSS + shadcn/ui | Velocidad de desarrollo; componentes accesibles |
| Gráficas | Recharts o Chart.js | Ligero, compatible con React, suficiente para MVP |
| Backend | Node.js + Express (o FastAPI si el equipo prefiere Python) | API REST simple; comunidad amplia |
| Base de datos | PostgreSQL | Relacional necesario para integridad de operaciones financieras |
| ORM | Prisma (Node) o SQLAlchemy (Python) | Migraciones controladas |
| Autenticación | JWT + bcrypt | Estándar; sin dependencias externas costosas |
| Hosting MVP | Railway o Render (backend) + Vercel (frontend) | Rápido de deployar, gratis en MVP |

### 4.2 Modelo de Datos (Entidades Core)

```sql
-- Usuarios del sistema
users (id, nombre, email, password_hash, rol ENUM['admin','gerente','analista'], activo, created_at)

-- Clientes KYC
clientes (id, nombre, rfc, curp, email, saldo_disponible DECIMAL, activo, created_by, created_at)

-- Portafolio (posiciones)
posiciones (id, cliente_id FK, instrumento ENUM['CETES','BONO_M'], 
            cantidad_titulos INT, precio_compra_promedio DECIMAL, 
            fecha_primera_compra, updated_at)

-- Log de operaciones (IMMUTABLE — sin UPDATE ni DELETE)
operaciones (id UUID, tipo ENUM['COMPRA','VENTA'], instrumento, cliente_id FK,
             gerente_id FK, cantidad_titulos, precio_unitario, precio_total,
             tasa_referencia, plazo_dias, saldo_antes, saldo_despues,
             saldo_insuficiente BOOLEAN DEFAULT false, timestamp TIMESTAMPTZ)

-- Log de auditoría general
audit_log (id, user_id FK, accion, entidad, entidad_id, detalle JSON, timestamp)
```

### 4.3 API Endpoints Core

```
# Auth
POST   /api/auth/login
POST   /api/auth/logout

# Usuarios (Admin only)
GET    /api/usuarios
POST   /api/usuarios
PUT    /api/usuarios/:id
PATCH  /api/usuarios/:id/desactivar

# Clientes (Admin: CRUD; Gerente/Analista: GET)
GET    /api/clientes
POST   /api/clientes
PUT    /api/clientes/:id
PATCH  /api/clientes/:id/desactivar

# Portafolio
GET    /api/clientes/:id/portafolio
GET    /api/clientes/:id/portafolio/export   (returns CSV)

# Valuación (sin guardar, solo cálculo)
POST   /api/valuacion/cetes      { F, r, N, cantidad } → { precio_unitario, precio_total, rendimiento }
POST   /api/valuacion/bono-m     { F, tasa_cupon, r, N, cantidad } → { precio, cupon, precio_total, duracion }

# Operaciones (Gerente only para POST)
GET    /api/operaciones          (con filtros: cliente_id, tipo, fecha_desde, fecha_hasta)
POST   /api/operaciones/compra
POST   /api/operaciones/venta
GET    /api/operaciones/export   (returns CSV del log filtrado)
```

### 4.4 Fórmulas Financieras (Implementación de Referencia)

```typescript
// CETES — Cupón Cero
function valuarCetes(F: number, r: number, N: number): number {
  // r: tasa anual decimal (ej: 0.1125 para 11.25%)
  // N: plazo en días
  return F / Math.pow(1 + r, N / 360);
}

// Bono M — Tasa Fija con pagos semestrales
function valuarBonoM(F: number, tasaCupon: number, r: number, N: number): {
  precio: number;
  cuponSemestral: number;
  duracion: number;
} {
  // r: tasa semestral decimal (tasa anual / 2)
  // N: número de períodos semestrales
  // A: cupón semestral
  const rSem = r / 2;
  const A = F * (tasaCupon / 2);
  
  // Edge case: si r = 0
  if (rSem === 0) {
    return { precio: A * N + F, cuponSemestral: A, duracion: N };
  }
  
  const precio = A * (1 - Math.pow(1 + rSem, -N)) / rSem + F / Math.pow(1 + rSem, N);
  const duracion = N; // Duración simple en períodos (Macaulay completo fuera de MVP)
  
  return { precio, cuponSemestral: A, duracion };
}
```

### 4.5 Constraints y Consideraciones

- **Seguridad:** Las fórmulas financieras deben ejecutarse en el backend, no en el cliente (prevenir manipulación)
- **Inmutabilidad del log:** Configurar permisos de base de datos para que el rol de la app NO tenga permisos `UPDATE`/`DELETE` sobre la tabla `operaciones`
- **Validación de RFC/CURP:** Usar regex estándar SAT mexicano
  - RFC persona física: `/^[A-Z]{4}[0-9]{6}[A-Z0-9]{3}$/`
  - CURP: `/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9][0-9]$/`
- **Manejo de decimales:** Usar `DECIMAL(18,6)` en BD; en código usar librería `decimal.js` para evitar errores de punto flotante en cálculos financieros
- **Zona horaria:** Todos los timestamps en UTC; mostrar en UI con conversión a América/México_Ciudad
- **Sin autenticación de 2FA en MVP:** Documentar como deuda técnica
- **Sesiones:** JWT con expiración de 8 horas; refresh token fuera de MVP

---

## 5. Success Metrics

### 5.1 KPIs de Producto (MVP)

| KPI | Definición | Target MVP | Medición |
|-----|-----------|-----------|----------|
| Time-to-first-operation | Tiempo desde login hasta primera operación ejecutada | < 3 min | Event tracking |
| Tasa de error de valuación | % de cálculos que fallan o dan resultado inesperado | 0% | Logs de error backend |
| Adopción de exportación | % de sesiones que terminan con descarga de portafolio | > 30% | Event tracking |
| Tiempo de carga dashboard | Tiempo hasta que el dashboard es interactivo | < 2 segundos | Performance monitoring |
| Cobertura de roles | % de usuarios que acceden solo a lo que su rol permite | 100% | Auditoría manual + pruebas |

### 5.2 KPIs de Negocio (Post-MVP)

| KPI | Target 3 meses post-launch |
|-----|--------------------------|
| Demos realizadas a entidades financieras | ≥ 5 |
| Pilots activos (entidades usando la plataforma) | ≥ 1 |
| NPS de usuarios en pilots | > 7/10 |
| Tiempo promedio de valuación (vs. proceso anterior) | Reducción > 70% |
| Operaciones registradas con trazabilidad completa | 100% de las ejecutadas |

### 5.3 Criterio de Éxito del MVP (Definición de Done)

> **El MVP está completo cuando:** El Administrador da de alta a un cliente con KYC, el Gerente valúa y ejecuta la compra de un CETES y un Bono M para ese cliente, el Analista consulta el portafolio actualizado, el dashboard muestra las gráficas de capital e inversión, y el portafolio puede exportarse en CSV — todo en una sesión de demostración de 10 minutos sin errores.

---

## 6. Implementation Roadmap

### Phase 0: Setup (Días 1-3)
- [ ] Crear repositorio con monorepo (frontend + backend)
- [ ] Configurar entorno de desarrollo local (Docker Compose con PostgreSQL)
- [ ] Definir variables de entorno y estructura de carpetas
- [ ] Configurar CI básico (GitHub Actions: lint + tests en cada PR)
- [ ] Inicializar base de datos con migraciones Prisma/SQLAlchemy
- [ ] Deploy inicial en Railway/Render + Vercel (ambiente staging)

**Entregable:** Repo funcionando, BD levantada, deploy automático activo.

---

### Phase 1: Auth + Admin (Días 4-8)
**Prioridad: Bloqueante para todo lo demás**

Tickets:
- [ ] `BE-01` Modelo de usuarios + migraciones
- [ ] `BE-02` Endpoint POST /auth/login (JWT)
- [ ] `BE-03` Middleware de autenticación + autorización por rol
- [ ] `BE-04` CRUD de usuarios (Admin)
- [ ] `BE-05` CRUD de clientes con validación RFC/CURP
- [ ] `FE-01` Pantalla de login
- [ ] `FE-02` Route guards por rol
- [ ] `FE-03` Sidebar + layout base (varía por rol)
- [ ] `FE-04` Panel de gestión de clientes (Admin)
- [ ] `FE-05` Formulario KYC con validaciones

**Entregable:** Los 3 roles pueden iniciar sesión y el Admin puede dar de alta clientes.

---

### Phase 2: Motor de Valuación (Días 9-13)

Tickets:
- [ ] `BE-06` Endpoint POST /valuacion/cetes con fórmula validada
- [ ] `BE-07` Endpoint POST /valuacion/bono-m con fórmula y manejo de edge cases
- [ ] `BE-08` Tests unitarios de las fórmulas (CETES y Bono M con valores conocidos)
- [ ] `FE-06` Pantalla de valuación CETES con preview en tiempo real
- [ ] `FE-07` Pantalla de valuación Bono M con preview en tiempo real

**Entregable:** Gerente puede valuar ambos instrumentos y ver resultados correctos en < 1 segundo.

---

### Phase 3: Operaciones + Portafolio (Días 14-19)

Tickets:
- [ ] `BE-09` Modelo de posiciones y operaciones con migraciones
- [ ] `BE-10` Endpoint POST /operaciones/compra (actualiza saldo + posición)
- [ ] `BE-11` Endpoint POST /operaciones/venta (valida cantidad disponible)
- [ ] `BE-12` Endpoint GET /clientes/:id/portafolio
- [ ] `BE-13` Configurar permisos BD para inmutabilidad del log
- [ ] `FE-08` Modal de confirmación de operación
- [ ] `FE-09` Toast de éxito/error post-operación
- [ ] `FE-10` Tabla de portafolio con actualización automática

**Entregable:** Gerente puede comprar y vender; portafolio se actualiza en tiempo real.

---

### Phase 4: Dashboard + Exportación (Días 20-25)

Tickets:
- [ ] `BE-14` Endpoint agregado para KPIs del dashboard (capital total, invertido, disponible)
- [ ] `BE-15` Endpoint GET /clientes/:id/portafolio/export (CSV)
- [ ] `BE-16` Endpoint GET /operaciones/export (CSV del log)
- [ ] `FE-11` KPI cards en dashboard
- [ ] `FE-12` Gráfica de dona (distribución por instrumento)
- [ ] `FE-13` Gráfica de barras (desglose de posiciones)
- [ ] `FE-14` Línea de tiempo de valor del portafolio
- [ ] `FE-15` Selector de cliente con búsqueda
- [ ] `FE-16` Botón de exportación CSV
- [ ] `FE-17` Pantalla de log de operaciones con filtros

**Entregable:** Dashboard completo funcional para Gerente y Analista; exportación operativa.

---

### Phase 5: QA + Polish (Días 26-30)

- [ ] Testing end-to-end del flujo completo (Playwright o manual)
- [ ] Revisión de seguridad: verificar que los endpoints respetan roles
- [ ] Testing de fórmulas con casos borde (r=0, N=1, saldo insuficiente)
- [ ] Corrección de bugs críticos
- [ ] UI polish: estados vacíos, loading states, mensajes de error claros
- [ ] Preparación del ambiente de demo (datos semilla: 2 clientes, historial de operaciones)
- [ ] Documentación básica de la API (Swagger/OpenAPI)

**Entregable:** MVP listo para demo a stakeholders y potenciales clientes.

---

## Appendix

### A. Datos de Prueba para Demo
```json
{
  "clientes_semilla": [
    { "nombre": "Inversora del Norte SA", "rfc": "INO850312ABC", "saldo": 5000000 },
    { "nombre": "Fondo Bajío Capital", "rfc": "FBC920715XYZ", "saldo": 12000000 }
  ],
  "tasa_referencia_default": {
    "banxico": 0.1125,
    "descripcion": "Tasa de fondeo Banxico — actualizar manualmente en MVP"
  }
}
```

### B. Deuda Técnica Conocida (Post-MVP)
- 2FA para cuentas de Gerente y Admin
- Refresh tokens (actualmente sesión de 8 horas)
- Cálculo de rendimiento a fecha de venta
- Modelado de cashflows
- Tasa de referencia dinámica (conexión con API de Banxico)
- Notificaciones en tiempo real (WebSockets)
- Auditoría de acceso a datos (quién vio qué portafolio y cuándo)

### C. Riesgos del MVP

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Fórmulas financieras con errores de implementación | Media | Alto | Tests unitarios con valores de referencia verificados contra Excel/Bloomberg |
| Errores de punto flotante en montos monetarios | Alta | Alto | Usar `decimal.js` desde el inicio |
| Bypass de permisos por rol | Media | Alto | Middleware centralizado + tests de autorización |
| Pérdida de inmutabilidad del log | Baja | Crítico | Permisos de BD a nivel de rol de aplicación |
