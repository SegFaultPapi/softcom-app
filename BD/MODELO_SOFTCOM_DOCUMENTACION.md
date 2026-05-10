# 📊 Documentación del Modelo Relacional - SoftCom Solutions

**Base de Datos:** Gestión de Portafolios de Inversión y Valuación de Bonos  
**Motor:** PostgreSQL  
**Versión:** 2.0 - Corporativo  
**Fecha:** 9 de mayo de 2026

---

## 📋 Tabla de Contenidos

1. [Autenticación y Control de Acceso](#1-autenticación-y-control-de-acceso)
2. [Estructura Empresarial](#2-estructura-empresarial)
3. [Portafolios de Inversión](#3-portafolios-de-inversión)
4. [Instrumentos Financieros](#4-instrumentos-financieros)
5. [Tabla Especializada para Bonos](#5-tabla-especializada-para-bonos)
6. [Posiciones y Transacciones](#6-posiciones-y-transacciones)
7. [Valuaciones y Análisis](#7-valuaciones-y-análisis-de-instrumentos)
8. [Presupuestos y Adquisiciones](#8-presupuestos-y-adquisiciones)
9. [Estados Financieros](#9-estados-financieros)
10. [Anualidades y Cupones](#10-anualidades-y-cupones)
11. [Inflación e Índices](#11-inflación-e-inpc)
12. [Indicadores Financieros](#12-indicadores-financieros)
13. [Alertas y Gestión de Riesgos](#13-alertas-y-gestión-de-riesgos)
14. [Reportes](#14-reportes)

---

## 1. Autenticación y Control de Acceso

### 📌 Propósito
Gestionar usuarios y sus permisos dentro del sistema. Define qué roles pueden hacer qué operaciones en SoftCom.

### Tabla: `roles`

```sql
create table roles (
    id_rol serial primary key,           -- Identificador único del rol
    nombre_rol varchar(20) not null      -- Nombre del rol (ej: admin, gerente, analyst)
        unique,
    created_at timestamp with time      -- Cuándo se creó el rol
        zone default now()
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_rol` | serial | Clave primaria auto-incrementable | 1 |
| `nombre_rol` | varchar(20) | Nombre descriptivo del rol | 'admin', 'gerente_cartera', 'analyst' |
| `created_at` | timestamp | Marca de tiempo de creación para auditoría | 2026-05-09 10:30:00 |

**Ejemplo de datos:**
```sql
insert into roles (nombre_rol) values ('admin');           -- ID 1
insert into roles (nombre_rol) values ('gerente_cartera'); -- ID 2
insert into roles (nombre_rol) values ('analyst');         -- ID 3
```

---

### Tabla: `usuarios`

```sql
create table usuarios (
    id_usuario serial primary key,
    nombre varchar(100) not null,              -- Nombre completo del usuario
    correo varchar(100) unique not null,       -- Email único (login)
    password_hash text not null,               -- Hash seguro de contraseña (nunca texto plano)
    id_rol int not null                        -- Rol que tiene en el sistema
        references roles(id_rol),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
        default now()
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_usuario` | serial | Clave primaria | 100 |
| `nombre` | varchar(100) | Nombre completo | 'Juan Pérez López' |
| `correo` | varchar(100) | Email único para autenticación | 'juan.perez@softcom.mx' |
| `password_hash` | text | Hash bcrypt/argon2 (nunca guardar plain) | '$2b$12$...' |
| `id_rol` | int FK | Referencia al rol del usuario | 2 (gerente_cartera) |
| `created_at` | timestamp | Cuándo se registró | 2026-01-15 |
| `updated_at` | timestamp | Última actualización | 2026-05-09 |

**Ejemplo de datos:**
```sql
insert into usuarios (nombre, correo, password_hash, id_rol)
values ('Carlos Montes', 'carlos@softcom.mx', 
        '$2b$12$K1h.P5se9VrSevENkXvyLuEKHA8qlCvlQqMpE...', 2);
```

**Índices:**
- `idx_usuarios_correo`: Búsquedas rápidas por email en login
- `idx_usuarios_id_rol`: Filtrar usuarios por rol

---

## 2. Estructura Empresarial

### 📌 Propósito
Almacenar las empresas **cliente** de SoftCom que usan la plataforma para gestionar sus portafolios. Relaciona usuarios con empresas asignándoles roles específicos.

### Tabla: `empresas`

```sql
create table empresas (
    id_empresa serial primary key,
    nombre varchar(100) not null,          -- Nombre corporativo
    rfc varchar(20),                        -- Registro Federal de Contribuyentes
    direccion varchar(140),                 -- Domicilio
    telefono varchar(20),
    correo varchar(100),                    -- Email corporativo
    created_at timestamp with time zone
        default now()
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_empresa` | serial | Clave primaria | 1 |
| `nombre` | varchar(100) | Razón social | 'Inversiones Globales SA de CV' |
| `rfc` | varchar(20) | ID fiscal mexicano | 'IGS130415AB9' |
| `direccion` | varchar(140) | Domicilio fiscal | 'Paseo de la Reforma 505, CDMX' |
| `telefono` | varchar(20) | Número de contacto | '+52 55 1234 5678' |
| `correo` | varchar(100) | Email de contacto | 'contacto@inversiones.mx' |
| `created_at` | timestamp | Cuándo se registró en SoftCom | 2026-03-01 |

**Ejemplo de datos:**
```sql
insert into empresas (nombre, rfc, direccion, correo)
values ('Inversiones Globales SA', 'IGS130415AB9', 
        'Paseo de la Reforma 505, CDMX', 'contacto@inversiones.mx');
```

---

### Tabla: `roles_empresa` (Relación M:M)

```sql
create table roles_empresa (
    id_empresa int not null                    -- Qué empresa
        references empresas(id_empresa) 
            on delete cascade,
    id_usuario int not null                    -- Qué usuario
        references usuarios(id_usuario) 
            on delete cascade,
    rol_capturista boolean default false,      -- ¿Puede ingresar datos?
    rol_admin boolean default false,           -- ¿Es administrador de la empresa?
    rol_financiero boolean default false,      -- ¿Puede ver análisis financiero?
    assigned_at timestamp with time zone
        default now(),
    primary key (id_empresa, id_usuario)       -- Un usuario solo 1 vez por empresa
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_empresa` | int FK | Empresa a la que pertenece | 1 |
| `id_usuario` | int FK | Usuario asignado | 100 |
| `rol_capturista` | boolean | ¿Permiso para registrar transacciones? | true |
| `rol_admin` | boolean | ¿Administrador de la empresa en SoftCom? | true |
| `rol_financiero` | boolean | ¿Acceso a informes financieros? | true |
| `assigned_at` | timestamp | Cuándo se asignó el rol | 2026-04-20 |

**Ejemplo de datos:**
```sql
insert into roles_empresa 
(id_empresa, id_usuario, rol_admin, rol_capturista, rol_financiero)
values (1, 100, true, true, true);  -- Carlos es admin de Inversiones Globales

insert into roles_empresa 
(id_empresa, id_usuario, rol_capturista, rol_financiero)
values (1, 101, true, false);  -- María solo captura datos
```

**¿Por qué relación M:M?**
- Un usuario puede trabajar en múltiples empresas con roles diferentes
- Una empresa puede tener múltiples usuarios
- Ejemplo: Carlos es admin en Inversiones Globales, pero analyst en Fondos del Pacífico

---

## 3. Portafolios de Inversión

### 📌 Propósito
Representa la **cartera de inversiones** de cada empresa. Contiene efectivo disponible y métricas de riesgo (VaR).

### Tabla: `portafolios`

```sql
create table portafolios (
    id_portafolio serial primary key,
    id_empresa int not null                    -- A qué empresa pertenece
        references empresas(id_empresa) 
            on delete cascade,
    saldo_efectivo numeric(18,2)               -- Dinero disponible para invertir
        default 1000000.00 
        check (saldo_efectivo >= 0),
    var_value numeric(18,4),                   -- Value at Risk (pérdida máxima esperada)
    var_horizon_days int                       -- Horizonte de la estimación VaR (ej: 1, 10, 30 días)
        default 1 
        check (var_horizon_days > 0),
    var_confidence numeric(5,4)                -- Nivel de confianza del VaR (95%, 99%)
        default 0.95 
        check (var_confidence > 0 
            and var_confidence <= 1),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_portafolio` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa propietaria | 1 |
| `saldo_efectivo` | numeric(18,2) | Efectivo no invertido | 1500000.50 |
| `var_value` | numeric(18,4) | Pérdida máxima estimada en 1 día con 95% confianza | 125450.75 |
| `var_horizon_days` | int | Período de análisis | 1 |
| `var_confidence` | numeric(5,4) | Confianza estadística | 0.95 (95%) o 0.99 (99%) |
| `created_at` | timestamp | Creación del portafolio | 2026-01-01 |
| `updated_at` | timestamp | Última actualización | 2026-05-09 |

**Ejemplo de datos:**
```sql
insert into portafolios 
(id_empresa, saldo_efectivo, var_value, var_horizon_days, var_confidence)
values (1, 5000000.00, 125450.75, 1, 0.95);
-- Inversiones Globales tiene 5 millones en efectivo
-- Riesgo máximo en 1 día: $125,450.75 (95% confianza)
```

**¿Por qué VaR (Value at Risk)?**
- Métrica estándar en gestión de riesgos
- Responde: ¿Cuál es la máxima pérdida en X días con Y% confianza?
- Ejemplo: VaR de $100K a 1 día, 95% confianza = 95% probabilidad de no perder más de $100K en 1 día

---

## 4. Instrumentos Financieros

### 📌 Propósito
Catálogo maestro de todos los instrumentos (CETES, Bonos M, Bonos, Derivados, Acciones) que se pueden comprar/vender en SoftCom.

### Tabla: `instrumentos`

```sql
create type tipo_instrumento_enum as enum 
    ('cete', 'bono_m', 'bono', 'udibono', 'derivado', 'accion');

create table instrumentos (
    id_instrumento serial primary key,
    tipo tipo_instrumento_enum not null,       -- Tipo de instrumento
    serie varchar(20) not null,                -- Identificador de serie
    valor_nominal numeric(14,2) not null       -- Valor par ($10 CETE, $100 Bono M)
        check (valor_nominal > 0),
    tasa numeric(10,6)                         -- Tasa cupón anual (si aplica)
        check (tasa >= 0),
    fecha_vencimiento date not null,           -- Cuándo vence
    emisor varchar(100) not null,              -- Quién lo emite (Banxico, BBVA, etc)
    riesgo_credito varchar(40),                -- Calificación (AAA, AA, A, BBB, etc)
    protegido_inflacion boolean                -- ¿Ajustado por inflación? (UDIBONOS)
        default false,
    created_at timestamp with time zone,
    constraint chk_fecha_vencimiento check 
        (fecha_vencimiento > current_date)
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_instrumento` | serial | Clave primaria | 1 |
| `tipo` | enum | Categoría del instrumento | 'cete' |
| `serie` | varchar(20) | Código identificador | 'CETE170526' |
| `valor_nominal` | numeric(14,2) | Valor par | 10.00 (CETE) o 100.00 (Bono) |
| `tasa` | numeric(10,6) | Tasa cupón anual fija | 5.50% = 5.50 |
| `fecha_vencimiento` | date | Fecha de redención | 2026-05-26 |
| `emisor` | varchar(100) | Institución emisora | 'Banco de México' |
| `riesgo_credito` | varchar(40) | Calificación crediticia | 'AAA' (bajo riesgo) |
| `protegido_inflacion` | boolean | ¿Valúa con inflación? | true (UDIBONO) |
| `created_at` | timestamp | Ingreso al catálogo | 2026-01-10 |

**Ejemplo de datos:**

```sql
-- CETE a 28 días, emitido por Banxico
insert into instrumentos 
(tipo, serie, valor_nominal, tasa, fecha_vencimiento, emisor, riesgo_credito)
values ('cete', 'CETE170526', 10.00, 5.50, '2026-05-26', 
        'Banco de México', 'AAA');

-- Bono M (tasa fija, plazo 182 días)
insert into instrumentos 
(tipo, serie, valor_nominal, tasa, fecha_vencimiento, emisor, riesgo_credito)
values ('bono_m', 'BONM240328', 100.00, 6.75, '2026-11-27', 
        'Secretaría de Hacienda', 'AAA');

-- UDIBONO (ajustado por inflación)
insert into instrumentos 
(tipo, serie, valor_nominal, tasa, fecha_vencimiento, emisor, 
 riesgo_credito, protegido_inflacion)
values ('udibono', 'UDEV250815', 100.00, 2.50, '2027-08-15', 
        'Secretaría de Hacienda', 'AAA', true);
```

**Tipos de Instrumentos:**
- **CETE**: Cupón cero, valor nominal $10, muy líquido
- **BONO_M**: Tasa fija, cupones cada 182 días, valor nominal $100
- **BONO**: Otros bonos corporativos o estatales
- **UDIBONO**: Bonos ajustados por inflación
- **DERIVADO**: Forwards, futuros, opciones
- **ACCION**: Acciones de empresas

---

## 5. Tabla Especializada para Bonos

### 📌 Propósito
**Extensión** de la tabla `instrumentos` para detalles específicos de bonos (cupones, tasas variables). Valida reglas de negocio:
- CETES = cupón cero, no hay pagos periódicos
- BONOS M = cupones cada 182 días, tasa fija
- Otros bonos = cupones con frecuencia variable

### Tabla: `bonos`

```sql
create table bonos (
    id_bono serial primary key,
    id_instrumento int not null unique         -- Referencia al instrumento padre
        references instrumentos(id_instrumento) 
            on delete cascade,
    es_cupon_cero boolean default false,       -- ¿Es tipo CETE (sin cupones)?
    dias_cupon int,                            -- Frecuencia de cupones (182 para Bonos M)
    tasa_cupon_anual numeric(10,6),            -- Tasa fija del cupón anual
    es_tasa_variable boolean                   -- ¿Tasa flotante (TIIE+)?
        default false,
    tasa_referencia varchar(40),               -- Índice de referencia (TIIE, LIBOR, etc)
    created_at timestamp with time zone,
    constraint chk_bono_valid check (
        (es_cupon_cero = true and dias_cupon is null) or
        (es_cupon_cero = false and dias_cupon = 182) or
        (es_cupon_cero = false and dias_cupon > 0)
    )
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_bono` | serial | Clave primaria | 1 |
| `id_instrumento` | int FK | Vinculación 1:1 a instrumentos | 1 (CETE170526) |
| `es_cupon_cero` | boolean | ¿Sin cupones periódicos? | true (CETE) |
| `dias_cupon` | int | Días entre pagos | 182 (Bono M) o NULL (CETE) |
| `tasa_cupon_anual` | numeric(10,6) | Rendimiento anual fijo | 6.75 |
| `es_tasa_variable` | boolean | ¿Rendimiento flotante? | false (fija) |
| `tasa_referencia` | varchar(40) | Índice (si es variable) | 'TIIE' o NULL |
| `created_at` | timestamp | Registro | 2026-01-10 |

**Constraint de validación:**
```
Si es_cupon_cero=true  → dias_cupon DEBE ser NULL (no hay cupones)
Si es_cupon_cero=false → dias_cupon DEBE ser 182 (Bonos M) o >0
```

**Ejemplo de datos:**

```sql
-- CETE (cupón cero)
insert into bonos 
(id_instrumento, es_cupon_cero, dias_cupon, tasa_cupon_anual, es_tasa_variable)
values (1, true, null, null, false);

-- Bono M (cupones cada 182 días, tasa fija 6.75%)
insert into bonos 
(id_instrumento, es_cupon_cero, dias_cupon, tasa_cupon_anual, es_tasa_variable)
values (2, false, 182, 6.75, false);

-- Bono corporativo con tasa variable (TIIE + 0.50%)
insert into bonos 
(id_instrumento, es_cupon_cero, dias_cupon, es_tasa_variable, tasa_referencia)
values (3, false, 90, true, 'TIIE');
```

---

## 6. Posiciones y Transacciones

### 📌 Propósito
Registrar:
- **Posiciones**: Qué títulos tiene cada portafolio ahora (inventario)
- **Transacciones**: Historial de compras, ventas, pagos de cupones

### Tabla: `posiciones`

```sql
create table posiciones (
    id_portafolio int not null                 -- Qué portafolio
        references portafolios(id_portafolio) 
            on delete cascade,
    id_instrumento int not null                -- Qué instrumento
        references instrumentos(id_instrumento) 
            on delete restrict,
    cantidad int not null                      -- Cuántos títulos
        check (cantidad >= 0),
    precio_promedio numeric(14,4)              -- Precio promedio pagado
        check (precio_promedio >= 0),
    updated_at timestamp with time zone,
    primary key (id_portafolio, id_instrumento) -- Un instrumento, una vez por portafolio
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_portafolio` | int FK | Portafolio propietario | 1 |
| `id_instrumento` | int FK | Instrumento | 1 (CETE170526) |
| `cantidad` | int | Número de títulos | 50000 |
| `precio_promedio` | numeric(14,4) | Costo unitario promedio | 9.9850 |
| `updated_at` | timestamp | Última compra/venta | 2026-05-05 |

**Ejemplo:**
```sql
-- Inversiones Globales tiene 50,000 CETES a $9.9850 c/u
insert into posiciones 
(id_portafolio, id_instrumento, cantidad, precio_promedio)
values (1, 1, 50000, 9.9850);
-- Inversión total: 50,000 × $9.9850 = $499,250
```

---

### Tabla: `transacciones`

```sql
create type tipo_operacion_enum as enum 
    ('compra', 'venta', 'pago_cupon', 'derivado');

create table transacciones (
    id_transaccion serial primary key,
    id_portafolio int not null                 -- Qué portafolio
        references portafolios(id_portafolio) 
            on delete cascade,
    id_instrumento int not null                -- Qué instrumento
        references instrumentos(id_instrumento) 
            on delete restrict,
    tipo_operacion tipo_operacion_enum         -- Tipo de movimiento
        not null,
    cantidad int                               -- Cuántos títulos
        check (cantidad > 0),
    monto_total numeric(18,2)                  -- Dinero movido
        not null 
        check (monto_total > 0),
    precio_sucio numeric(14,6),                -- Precio incluyendo interés corrido
    fecha timestamp with time zone default now(),
    created_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_transaccion` | serial | Clave primaria | 100 |
| `id_portafolio` | int FK | Portafolio involucrado | 1 |
| `id_instrumento` | int FK | Instrumento | 1 |
| `tipo_operacion` | enum | 'compra', 'venta', 'pago_cupon', 'derivado' | 'compra' |
| `cantidad` | int | Títulos | 50000 |
| `monto_total` | numeric(18,2) | Dinero | 499250.00 |
| `precio_sucio` | numeric(14,6) | Precio + interés corrido | 9.985000 |
| `fecha` | timestamp | Cuándo ocurrió | 2026-05-01 10:30:00 |
| `created_at` | timestamp | Registro en BD | 2026-05-01 10:35:00 |

**Ejemplo de datos:**

```sql
-- Compra de 50,000 CETES
insert into transacciones 
(id_portafolio, id_instrumento, tipo_operacion, cantidad, monto_total, precio_sucio, fecha)
values (1, 1, 'compra', 50000, 499250.00, 9.985000, '2026-05-01 10:30:00');

-- Pago de cupón de un Bono M
insert into transacciones 
(id_portafolio, id_instrumento, tipo_operacion, monto_total, precio_sucio)
values (1, 2, 'pago_cupon', 3375.00, null);
-- Cálculo: $100 nominal × 6.75% ÷ 2 períodos = $3,375 por 10 bonos
```

---

## 7. Valuaciones y Análisis de Instrumentos

### 📌 Propósito
Almacenar **precios y métricas de riesgo** diarias para cada instrumento. Permite analizar la evolución del portafolio.

### Tabla: `valuaciones`

```sql
create table valuaciones (
    id_valuacion serial primary key,
    id_instrumento int not null                -- Qué instrumento
        references instrumentos(id_instrumento) 
            on delete cascade,
    precio_limpio numeric(14,6)                -- Precio sin interés acumulado
        check (precio_limpio >= 0),
    precio_sucio numeric(14,6)                 -- Precio + interés corrido
        check (precio_sucio >= 0),
    interes_corrido numeric(14,6)              -- Interés acumulado desde último cupón
        check (interes_corrido >= 0),
    duration numeric(10,4),                    -- Vencimiento promedio ponderado
    duration_modificada numeric(10,4),         -- Sensibilidad a cambios de tasa
    volatilidad numeric(10,6)                  -- Desviación estándar de retornos
        check (volatilidad >= 0),
    fecha timestamp with time zone default now(),
    constraint uq_valuacion_fecha unique (id_instrumento, fecha)
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_valuacion` | serial | Clave primaria | 1 |
| `id_instrumento` | int FK | Instrumento valuado | 1 |
| `precio_limpio` | numeric(14,6) | Precio sin cupón corrido | 99.5000 |
| `precio_sucio` | numeric(14,6) | Precio + interés acumulado | 99.7250 |
| `interes_corrido` | numeric(14,6) | Cupón devengado no pagado | 0.2250 |
| `duration` | numeric(10,4) | Años hasta vencimiento (promedio) | 0.0769 años (28 días) |
| `duration_modificada` | numeric(10,4) | % cambio precio por 1% cambio en tasa | 0.0765 |
| `volatilidad` | numeric(10,6) | Desviación estándar anualizada | 0.025 (2.5%) |
| `fecha` | timestamp | Fecha de valuación | 2026-05-09 16:30:00 |

**Formulas clave:**

$$\text{Precio Sucio} = \text{Precio Limpio} + \text{Interés Corrido}$$

$$\text{Duration} = \frac{\sum_{t=1}^{n} t \times \text{VPA}_t}{\text{Precio}}$$

$$\text{Duration Modificada} = \frac{\text{Duration}}{1 + \text{Tasa}}$$

**Ejemplo de datos:**

```sql
-- Valuación de CETE al 9 de mayo
insert into valuaciones 
(id_instrumento, precio_limpio, precio_sucio, interes_corrido, 
 duration, duration_modificada, volatilidad, fecha)
values (1, 99.5000, 99.7250, 0.2250, 0.0769, 0.0765, 0.0025, 
        '2026-05-09 16:30:00');
```

**¿Por qué estos campos?**
- **Precio limpio vs sucio**: Bonos acumulan interés hasta el próximo cupón
- **Duration**: Mide sensibilidad a cambios de tasas (riesgo de tasa)
- **Duration modificada**: Predice % de cambio de precio ante cambio de 1% en tasa
- **Volatilidad**: Mide riesgo de mercado (fluctuaciones)

---

## 8. Presupuestos y Adquisiciones

### 📌 Propósito
**Presupuestos:** Planeación de gastos por categoría (compra de instrumentos, comisiones, etc.)  
**Adquisiciones:** Registro de bienes/servicios comprados

### Tabla: `presupuestos`

```sql
create table presupuestos (
    id_presupuesto serial primary key,
    id_empresa int not null                    -- Empresa propietaria
        references empresas(id_empresa) 
            on delete cascade,
    categoria varchar(50) not null,            -- Tipo de gasto
    monto_planeado numeric(18,2) not null      -- Presupuesto asignado
        check (monto_planeado > 0),
    monto_ejecutado numeric(18,2)              -- Gastado hasta ahora
        default 0 
        check (monto_ejecutado >= 0),
    periodo varchar(20) not null,              -- Cuándo (mes, trimestre)
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_presupuesto` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `categoria` | varchar(50) | Tipo de gasto | 'comisiones', 'administración', 'investigación' |
| `monto_planeado` | numeric(18,2) | Presupuesto aprobado | 500000.00 |
| `monto_ejecutado` | numeric(18,2) | Gastado | 175000.50 |
| `periodo` | varchar(20) | Período fiscal | '2026-05' o 'Q2-2026' |
| `created_at` | timestamp | Creación | 2026-05-01 |
| `updated_at` | timestamp | Última actualización | 2026-05-09 |

**Ejemplo:**
```sql
insert into presupuestos 
(id_empresa, categoria, monto_planeado, monto_ejecutado, periodo)
values (1, 'comisiones_bursatiles', 500000.00, 175000.50, '2026-05');
-- Inversiones Globales presupuestó $500K en comisiones para mayo
-- Ya gastó $175K
```

---

### Tabla: `bienes`

```sql
create table bienes (
    id_bien serial primary key,
    nombre varchar(100) not null,              -- Descripción
    tipo varchar(40) not null,                 -- Categoría
    descripcion varchar(200),
    created_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_bien` | serial | Clave primaria | 1 |
| `nombre` | varchar(100) | Nombre del producto/servicio | 'Suscripción Bloomberg 1 año' |
| `tipo` | varchar(40) | Clasificación | 'software', 'servicio', 'equipo' |
| `descripcion` | varchar(200) | Detalles | 'Acceso a datos de mercado y análisis' |
| `created_at` | timestamp | Registro | 2026-01-01 |

---

### Tabla: `adquisiciones`

```sql
create type estado_adquisicion_enum as enum 
    ('pendiente', 'completada', 'cancelada');

create table adquisiciones (
    id_adquisicion serial primary key,
    id_bien int not null                       -- Qué se compró
        references bienes(id_bien) 
            on delete restrict,
    id_presupuesto int not null                -- De qué presupuesto
        references presupuestos(id_presupuesto) 
            on delete cascade,
    monto_total numeric(18,2) not null         -- Precio
        check (monto_total > 0),
    fecha date not null,                       -- Cuándo se adquirió
    estado estado_adquisicion_enum              -- Estado
        default 'pendiente',
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_adquisicion` | serial | Clave primaria | 1 |
| `id_bien` | int FK | Bien adquirido | 1 (Bloomberg) |
| `id_presupuesto` | int FK | Presupuesto usado | 1 |
| `monto_total` | numeric(18,2) | Costo | 50000.00 |
| `fecha` | date | Fecha de compra | 2026-05-05 |
| `estado` | enum | 'pendiente', 'completada', 'cancelada' | 'completada' |
| `created_at` | timestamp | Registro | 2026-05-05 |
| `updated_at` | timestamp | Última actualización | 2026-05-06 |

**Ejemplo:**
```sql
insert into adquisiciones 
(id_bien, id_presupuesto, monto_total, fecha, estado)
values (1, 1, 50000.00, '2026-05-05', 'completada');
-- Inversiones Globales compró Bloomberg por $50K (completada)
-- Se cargó al presupuesto de comisiones
```

---

## 9. Estados Financieros

### 📌 Propósito
Registrar estados financieros consolidados de cada empresa (Balance General, Estado de Resultados).

### Tabla: `balance_general`

```sql
create table balance_general (
    id_balance serial primary key,
    id_empresa int not null                    -- Empresa propietaria
        references empresas(id_empresa) 
            on delete cascade,
    fecha date not null,                       -- Cuándo se levantó
    total_activos numeric(18,2) not null       -- Suma de activos
        check (total_activos >= 0),
    total_pasivos numeric(18,2) not null       -- Suma de pasivos
        check (total_pasivos >= 0),
    total_capital numeric(18,2) not null       -- Patrimonio
        check (total_capital >= 0),
    inversiones_valores numeric(18,2),         -- Cartera de inversiones
    pagos_pendientes numeric(18,2),            -- Cupones/dividendos por cobrar
    observaciones text,
    created_at timestamp with time zone,
    constraint chk_balance_ecuacion check (
        total_activos = total_pasivos + total_capital
    )
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_balance` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `fecha` | date | Fecha de cierre | 2026-03-31 |
| `total_activos` | numeric(18,2) | Todo lo que posee | 50000000.00 |
| `total_pasivos` | numeric(18,2) | Todo lo que debe | 15000000.00 |
| `total_capital` | numeric(18,2) | Valor del patrimonio | 35000000.00 |
| `inversiones_valores` | numeric(18,2) | Cartera de bonos/acciones | 30000000.00 |
| `pagos_pendientes` | numeric(18,2) | Cupones por recibir | 125000.00 |
| `observaciones` | text | Notas | 'Balance auditado' |
| `created_at` | timestamp | Registro | 2026-04-15 |

**Constraint:**
```
Activo = Pasivo + Capital
50,000,000 = 15,000,000 + 35,000,000 ✓
```

**Ejemplo:**
```sql
insert into balance_general 
(id_empresa, fecha, total_activos, total_pasivos, total_capital, 
 inversiones_valores, pagos_pendientes)
values (1, '2026-03-31', 50000000.00, 15000000.00, 35000000.00, 
        30000000.00, 125000.00);
```

---

### Tabla: `estado_resultado`

```sql
create table estado_resultado (
    id_estado serial primary key,
    id_empresa int not null                    -- Empresa propietaria
        references empresas(id_empresa) 
            on delete cascade,
    anio int not null                          -- Año fiscal
        check (anio >= 2000),
    periodo varchar(20) not null,              -- Período (mes, trimestre)
    ingreso_total numeric(18,2) not null       -- Todos los ingresos
        check (ingreso_total >= 0),
    gasto_total numeric(18,2) not null         -- Todos los gastos
        check (gasto_total >= 0),
    utilidad_neta numeric(18,2) not null,      -- Ganancia/pérdida
    observaciones text,
    created_at timestamp with time zone,
    constraint chk_resultado_ecuacion check (
        utilidad_neta = ingreso_total - gasto_total
    )
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_estado` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `anio` | int | Año | 2026 |
| `periodo` | varchar(20) | 'enero', 'Q1', 'mayo' | 'mayo' |
| `ingreso_total` | numeric(18,2) | Ventas + intereses + dividendos | 5000000.00 |
| `gasto_total` | numeric(18,2) | Costos operativos + impuestos | 3200000.00 |
| `utilidad_neta` | numeric(18,2) | Ganancia neta | 1800000.00 |
| `observaciones` | text | Notas | 'Incluye bonificación de empleados' |
| `created_at` | timestamp | Registro | 2026-06-05 |

**Constraint:**
```
Utilidad_Neta = Ingreso_Total - Gasto_Total
1,800,000 = 5,000,000 - 3,200,000 ✓
```

**Ejemplo:**
```sql
insert into estado_resultado 
(id_empresa, anio, periodo, ingreso_total, gasto_total, utilidad_neta)
values (1, 2026, 'mayo', 5000000.00, 3200000.00, 1800000.00);
```

---

## 10. Anualidades y Cupones

### 📌 Propósito
**Anualidades:** Cálculos de series de pagos periódicos (rentas, jubilaciones)  
**Cupones:** Registro de pagos de interés que deben hacerse a tenedores de bonos

### Tabla: `anualidades`

```sql
create table anualidades (
    id_anualidad serial primary key,
    id_empresa int not null                    -- Empresa que emite/gestiona
        references empresas(id_empresa) 
            on delete cascade,
    tipo varchar(20) not null                  -- Tipo: ordinaria, anticipada, diferida
        check (tipo in ('ordinaria', 'anticipada', 'diferida')),
    importe numeric(18,2) not null             -- Pago periódico
        check (importe > 0),
    tasa numeric(10,6) not null                -- Tasa de descuento
        check (tasa >= 0),
    n_periodos int not null                    -- Número de pagos
        check (n_periodos > 0),
    fecha_inicio date not null,                -- Cuándo comienza
    fecha_fin date not null,                   -- Cuándo termina
    id_instrumento int references              -- Instrumento asociado (opcional)
        instrumentos(id_instrumento),
    valor_presente numeric(18,2),              -- Valor PV de todos los pagos
    valor_futuro numeric(18,2),                -- Valor FV acumulado
    created_at timestamp with time zone,
    constraint chk_fechas_anualidad check 
        (fecha_fin > fecha_inicio)
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_anualidad` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `tipo` | varchar(20) | 'ordinaria' (vencida), 'anticipada' (adelantada), 'diferida' | 'ordinaria' |
| `importe` | numeric(18,2) | Pago periódico | 100000.00 |
| `tasa` | numeric(10,6) | Tasa de interés mensual/anual | 0.06 (6%) |
| `n_periodos` | int | Número de pagos | 60 meses |
| `fecha_inicio` | date | Primer pago | 2026-06-01 |
| `fecha_fin` | date | Último pago | 2031-05-01 |
| `id_instrumento` | int FK | Instrumento vinculado (opcional) | NULL |
| `valor_presente` | numeric(18,2) | VP = ∑ pagos descontados | 4717647.46 |
| `valor_futuro` | numeric(18,2) | VF = ∑ pagos capitalizados | 7070640.53 |
| `created_at` | timestamp | Registro | 2026-05-09 |

**Fórmulas financieras:**

$$VP = \text{Importe} \times \left[\frac{1 - (1+i)^{-n}}{i}\right]$$

$$VF = \text{Importe} \times \left[\frac{(1+i)^n - 1}{i}\right]$$

**Ejemplo:**
```sql
-- Renta de $100,000 mensuales durante 5 años (60 meses) a 6% anual
insert into anualidades 
(id_empresa, tipo, importe, tasa, n_periodos, fecha_inicio, 
 fecha_fin, valor_presente, valor_futuro)
values (1, 'ordinaria', 100000.00, 0.005, 60, '2026-06-01', 
        '2031-05-01', 4717647.46, 7070640.53);
```

---

### Tabla: `cupones`

```sql
create table cupones (
    id_cupon serial primary key,
    id_bono int not null                       -- Qué bono paga
        references bonos(id_bono) 
            on delete cascade,
    fecha_pago date not null,                  -- Cuándo se debe pagar
    monto numeric(18,2) not null               -- Cantidad a pagar
        check (monto > 0),
    pagado boolean default false,              -- ¿Ya se pagó?
    fecha_pago_real date,                      -- Cuándo se pagó realmente
    created_at timestamp with time zone,
    constraint chk_cupones_fecha check (
        pagado = false or fecha_pago_real is not null
    )
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_cupon` | serial | Clave primaria | 1 |
| `id_bono` | int FK | Bono que paga | 2 (Bono M) |
| `fecha_pago` | date | Fecha programada | 2026-11-27 |
| `monto` | numeric(18,2) | Cupón por título | 3.375 |
| `pagado` | boolean | ¿Liquidado? | false |
| `fecha_pago_real` | date | Cuándo se pagó | NULL (aún no) |
| `created_at` | timestamp | Registro | 2026-05-01 |

**Constraint:**
- Si `pagado=true`, `fecha_pago_real` DEBE tener valor
- Si `pagado=false`, `fecha_pago_real` DEBE ser NULL

**Ejemplo:**
```sql
-- Cupón del Bono M (tasa 6.75%, semestral en $100 de nominal)
-- Cupon = $100 × 6.75% ÷ 2 = $3.375 por título
insert into cupones 
(id_bono, fecha_pago, monto, pagado)
values (2, '2026-11-27', 3.375, false);
```

---

## 11. Inflación e INPC

### 📌 Propósito
Registrar el **Índice Nacional de Precios al Consumidor** (inflación mexicana) para:
- Calcular retornos reales (nominal - inflación)
- Valorizar UDIBONOS (ajustados por inflación)
- Análisis de poder adquisitivo

### Tabla: `inflacion`

```sql
create table inflacion (
    id_inflacion serial primary key,
    fecha date not null unique,                -- Fecha del índice
    inpc numeric(10,4) not null                -- Índice INPC
        check (inpc > 0),
    tasa_inflacion numeric(10,6) not null      -- % de cambio
        check (tasa_inflacion >= -100),
    created_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_inflacion` | serial | Clave primaria | 1 |
| `fecha` | date | Cuándo se reportó | 2026-04-30 |
| `inpc` | numeric(10,4) | Índice | 314.8523 |
| `tasa_inflacion` | numeric(10,6) | % cambio vs mes anterior | 0.350 (0.35%) |
| `created_at` | timestamp | Registro en BD | 2026-05-01 |

**Ejemplo:**
```sql
insert into inflacion (fecha, inpc, tasa_inflacion)
values ('2026-04-30', 314.8523, 0.350);
-- Inflación de abril 2026: 0.35% mensual, INPC = 314.8523
```

**Uso en cálculos:**
- **Retorno real** = (1 + retorno nominal) / (1 + inflación) - 1
- **UDIBONO**: Se ajusta por INPC

---

## 12. Indicadores Financieros

### 📌 Propósito
Calcular y almacenar ratios financieros clave (ROE, liquidez, solvencia) para análisis periódico.

### Tabla: `indicadores_financieros`

```sql
create table indicadores_financieros (
    id_indicador serial primary key,
    id_empresa int not null                    -- Empresa analizada
        references empresas(id_empresa) 
            on delete cascade,
    fecha date not null,                       -- Cuándo se calculó
    roe numeric(10,6),                         -- Return on Equity (%)
    liquidez numeric(10,6),                    -- Activos líquidos / Pasivos corrientes
    solvencia numeric(10,6),                   -- Activos / Pasivos
    created_at timestamp with time zone
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_indicador` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `fecha` | date | Fecha de cálculo | 2026-03-31 |
| `roe` | numeric(10,6) | Utilidad / Capital × 100 | 0.051429 (5.14%) |
| `liquidez` | numeric(10,6) | Activos corrientes / Pasivos corrientes | 2.5 |
| `solvencia` | numeric(10,6) | Activos totales / Pasivos totales | 3.33 |
| `created_at` | timestamp | Registro | 2026-04-15 |

**Formulas:**
$$ROE = \frac{\text{Utilidad Neta}}{\text{Capital}} \times 100$$

$$\text{Liquidez} = \frac{\text{Activos Corrientes}}{\text{Pasivos Corrientes}}$$

$$\text{Solvencia} = \frac{\text{Activos Totales}}{\text{Pasivos Totales}}$$

**Ejemplo:**
```sql
insert into indicadores_financieros 
(id_empresa, fecha, roe, liquidez, solvencia)
values (1, '2026-03-31', 0.051429, 2.5, 3.33);
-- Inversiones Globales: ROE 5.14%, Liquidez 2.5x, Solvencia 3.33x
```

---

## 13. Alertas y Gestión de Riesgos

### 📌 Propósito
Generar alertas automáticas o manuales cuando se detectan riesgos (vencimientos próximos, caídas de precios, límites de presupuesto superados).

### Tabla: `alertas_riesgo`

```sql
create type tipo_alerta_enum as enum (
    'riesgo_mercado',           -- Precio bajó mucho
    'riesgo_credito',           -- Emisor con problemas
    'riesgo_liquidez',          -- No hay compradores
    'vencimiento_proximo',      -- Bono vence pronto
    'alerta_presupuesto'        -- Presupuesto superado
);

create table alertas_riesgo (
    id_alerta serial primary key,
    id_empresa int not null                    -- Empresa afectada
        references empresas(id_empresa) 
            on delete cascade,
    tipo tipo_alerta_enum not null,            -- Tipo de alerta
    descripcion text not null,                 -- Detalles
    fecha timestamp with time zone default now(),
    resuelta boolean default false,            -- ¿Ya se manejó?
    fecha_resolucion timestamp with time zone -- Cuándo se resolvió
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_alerta` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa impactada | 1 |
| `tipo` | enum | Categoría de riesgo | 'vencimiento_proximo' |
| `descripcion` | text | Detalles | 'Bono BONM240328 vence en 7 días' |
| `fecha` | timestamp | Cuándo se generó | 2026-11-20 14:30:00 |
| `resuelta` | boolean | ¿Manejado? | false |
| `fecha_resolucion` | timestamp | Cuándo se resolvió | NULL |

**Ejemplo:**
```sql
insert into alertas_riesgo 
(id_empresa, tipo, descripcion, resuelta)
values (1, 'vencimiento_proximo', 
        'Bono BONM240328 vence en 7 días - requiere decisión de reinversión',
        false);
```

---

## 14. Reportes

### 📌 Propósito
Almacenar archivos de reportes generados (PDF, Excel) para auditoría y distribución.

### Tabla: `reportes`

```sql
create table reportes (
    id_reporte serial primary key,
    id_empresa int not null                    -- Empresa propietaria
        references empresas(id_empresa) 
            on delete cascade,
    archivo bytea,                             -- Datos binarios del PDF/Excel
    tipo_reporte varchar(40) not null,         -- Tipo: 'valuación', 'balance', etc
    fecha_subida timestamp with time zone,
    nombre_archivo varchar(255)                -- Nombre original
);
```

| Atributo | Tipo | Explicación | Ejemplo |
|----------|------|-------------|---------|
| `id_reporte` | serial | Clave primaria | 1 |
| `id_empresa` | int FK | Empresa | 1 |
| `archivo` | bytea | Contenido binario | (PDF comprimido) |
| `tipo_reporte` | varchar(40) | Categoría | 'balance_general', 'valuacion_diaria' |
| `fecha_subida` | timestamp | Cuándo se guardó | 2026-05-09 16:30:00 |
| `nombre_archivo` | varchar(255) | Nombre original | 'balance_marzo_2026.pdf' |

**Ejemplo:**
```sql
insert into reportes 
(id_empresa, tipo_reporte, fecha_subida, nombre_archivo)
values (1, 'balance_general', '2026-05-09 16:30:00', 
        'balance_marzo_2026.pdf');
-- archivo contendría los bytes del PDF
```

---

## 📊 Diagrama de Relaciones Simplificado

```
┌─────────────────────────────────────────────────────────────┐
│                      ESTRUCTURA GENERAL                      │
└─────────────────────────────────────────────────────────────┘

AUTENTICACIÓN:
    roles ←─1:N─ usuarios

EMPRESAS:
    empresas ←─M:N─ usuarios (roles_empresa)

PORTAFOLIOS E INVERSIONES:
    empresas ─1:1→ portafolios
    portafolios ←─1:N─ posiciones ─N:1→ instrumentos
    portafolios ←─1:N─ transacciones ─N:1→ instrumentos

INSTRUMENTOS:
    instrumentos ←─1:1─ bonos (especialización)
    
VALUACIONES Y ANÁLISIS:
    instrumentos ←─1:N─ valuaciones
    
CUPONES:
    bonos ←─1:N─ cupones

PRESUPUESTOS Y ADQUISICIONES:
    empresas ─1:N→ presupuestos
    presupuestos ←─1:N─ adquisiciones ─N:1→ bienes

ESTADOS FINANCIEROS:
    empresas ─1:N→ balance_general
    empresas ─1:N→ estado_resultado
    empresas ─1:N→ indicadores_financieros
    
ANUALIDADES:
    empresas ─1:N→ anualidades
    
RIESGOS Y ALERTAS:
    empresas ─1:N→ alertas_riesgo
    
INFLACIÓN:
    inflacion (tabla independiente)
    
REPORTES:
    empresas ─1:N→ reportes
```

---

## 🔗 Flujos de Negocio Principales

### Flujo 1: Compra de CETE

```
1. Admin crea Instrumento (CETE170526, $10, 28 días)
   └→ instrumentos (id=1, tipo='cete', ...)
   
2. Admin crea Bono (es_cupon_cero=true, dias_cupon=NULL)
   └→ bonos (id_instrumento=1, ...)
   
3. Usuario con rol "capturista" registra compra
   └→ transacciones (portafolio=1, instrumento=1, 
                      tipo='compra', cantidad=50000, 
                      monto_total=499250)
                      
4. Sistema actualiza posición
   └→ posiciones (portafolio=1, instrumento=1, 
                  cantidad=50000, precio_promedio=9.9850)
                  
5. Sistema genera valuación diaria
   └→ valuaciones (instrumento=1, precio_limpio=99.50, 
                   precio_sucio=99.725, interes_corrido=0.225)
                   
6. Sistema actualiza portafolio
   └→ portafolios (saldo_efectivo -= 499250, 
                   var_value = nuevo cálculo)
```

### Flujo 2: Pago de Cupón de Bono M

```
1. Admin crea cupón para fecha futura
   └→ cupones (id_bono=2, fecha_pago=2026-11-27, 
              monto=3375, pagado=false)
              
2. En fecha de pago, sistema genera transacción automática
   └→ transacciones (tipo='pago_cupon', monto_total=33750)
                     # 10 bonos × $3,375 c/u
                     
3. Usuario confirma pago
   └→ cupones (pagado=true, fecha_pago_real=2026-11-27)
   
4. Saldo efectivo del portafolio aumenta
   └→ portafolios (saldo_efectivo += 33750)
```

### Flujo 3: Generación de Estados Financieros

```
1. Usuario con rol "financiero" solicita balance al 31 de marzo
   
2. Sistema calcula:
   - total_activos (suma de inversiones + efectivo)
   - total_pasivos (obligaciones registradas)
   - total_capital (activos - pasivos)
   - inversiones_valores (cartera total)
   - pagos_pendientes (cupones por recibir)
   
3. Sistema valida constraint:
   total_activos = total_pasivos + total_capital
   
4. Guarda balance_general
   └→ balance_general (id_empresa=1, fecha=2026-03-31, ...)
   
5. Sistema genera PDF con logo de la empresa
   └→ reportes (tipo='balance_general', 
               nombre_archivo='balance_marzo_2026.pdf')
```

---

## 🛡️ Integridad de Datos

### Constraints clave:

| Constraint | Tabla | Propósito |
|-----------|-------|----------|
| `chk_balance_ecuacion` | balance_general | Asegura: Activo = Pasivo + Capital |
| `chk_resultado_ecuacion` | estado_resultado | Asegura: Utilidad = Ingreso - Gasto |
| `chk_bono_valid` | bonos | Valida reglas CETE vs Bono M vs Otros |
| `chk_fecha_vencimiento` | instrumentos | Vencimiento debe ser futuro |
| `chk_cupones_fecha` | cupones | Si pagado=true, fecha_pago_real debe existir |
| Monetary checks | Múltiples | Garantiza valores >= 0 o > 0 según corresponda |


