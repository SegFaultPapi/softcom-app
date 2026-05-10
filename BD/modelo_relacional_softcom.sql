-- =========================================================================
-- modelo relacional softcom solutions 
-- base de datos: gestión de portafolios de inversión y valuación de bonos
-- motor: postgresql

-- =========================================================================
-- 1. autenticación y control de acceso
-- =========================================================================

create table rol (
    id_rol serial primary key,
    nombre_rol varchar(20) not null unique,
    created_at timestamp with time zone default now()
);

create table usuario (
    id_usuario serial primary key,
    nombre varchar(100) not null,
    correo varchar(100) unique not null,
    password_hash text not null,
    id_rol int not null references rol(id_rol),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_usuario_correo on usuario(correo);
create index if not exists idx_usuario_id_rol on usuario(id_rol);

-- =========================================================================
-- 2. estructura empresarial
-- =========================================================================

create table empresa (
    id_empresa serial primary key,
    nombre varchar(100) not null,
    rfc varchar(20),
    direccion varchar(140),
    telefono varchar(20),
    correo varchar(100),
    created_at timestamp with time zone default now()
);

-- relación m:m entre empresa y usuario (con roles específicos)
create table rol_empresa (
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    id_usuario int not null references usuario(id_usuario) on delete cascade,
    rol_capturista boolean default false,
    rol_admin boolean default false,
    rol_financiero boolean default false,
    assigned_at timestamp with time zone default now(),
    primary key (id_empresa, id_usuario)
);

create index if not exists idx_rol_empresa_usuario on rol_empresa(id_usuario);

-- =========================================================================
-- 3. portafolio de inversión
-- =========================================================================

create table portafolio (
    id_portafolio serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    saldo_efectivo numeric(18,2) default 1000000.00 check (saldo_efectivo >= 0),
    var_value numeric(18,4), -- value at risk (monetary)
    var_horizon_days int default 1 check (var_horizon_days > 0),
    var_confidence numeric(5,4) default 0.95 check (var_confidence > 0 and var_confidence <= 1),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_portafolio_empresa on portafolio(id_empresa);

-- =========================================================================
-- 4. instrumento financiero (bonos, cetes, derivados, acciones)
-- =========================================================================

-- enum para tipos de instrumento
create type tipo_instrumento_enum as enum ('cete', 'bono_m', 'bono', 'udibono', 'derivado', 'accion');

create table instrumento (
    id_instrumento serial primary key,
    tipo tipo_instrumento_enum not null,
    serie varchar(20) not null,
    valor_nominal numeric(14,2) not null check (valor_nominal > 0),
    tasa numeric(10,6) check (tasa >= 0),
    fecha_vencimiento date not null,
    emisor varchar(100) not null,
    riesgo_credito varchar(40),
    protegido_inflacion boolean default false,
    created_at timestamp with time zone default now(),
    constraint chk_fecha_vencimiento check (fecha_vencimiento > current_date)
);

-- índices para búsquedas frecuentes
create index if not exists idx_instrumento_emisor on instrumento(emisor);
create index if not exists idx_instrumento_tipo on instrumento(tipo);
create index if not exists idx_instrumento_vencimiento on instrumento(fecha_vencimiento);

-- =========================================================================
-- 4.1 tabla especializada para bono
-- =========================================================================

create table bono (
    id_bono serial primary key,
    id_instrumento int not null unique references instrumento(id_instrumento) on delete cascade,
    es_cupon_cero boolean default false, -- true para cetes
    dias_cupon int, -- 182 para bonos m, null para cetes
    tasa_cupon_anual numeric(10,6), -- tasa fija para bonos m
    es_tasa_variable boolean default false, -- para bonos con tasa variable
    tasa_referencia varchar(40), -- ej: tiie, para bonos con tasa variable
    created_at timestamp with time zone default now(),
    constraint chk_bono_valid check (
        (es_cupon_cero = true and dias_cupon is null) or
        (es_cupon_cero = false and dias_cupon = 182) or
        (es_cupon_cero = false and dias_cupon > 0)
    )
);

create index if not exists idx_bono_instrumento on bono(id_instrumento);

-- =========================================================================
-- 5. posicion y transaccion
-- =========================================================================

create table posicion (
    id_portafolio int not null references portafolio(id_portafolio) on delete cascade,
    id_instrumento int not null references instrumento(id_instrumento) on delete restrict,
    cantidad int not null check (cantidad >= 0),
    precio_promedio numeric(14,4) check (precio_promedio >= 0),
    updated_at timestamp with time zone default now(),
    primary key (id_portafolio, id_instrumento)
);

-- enum para tipo de operación
create type tipo_operacion_enum as enum ('compra', 'venta', 'pago_cupon', 'derivado');

create table transaccion (
    id_transaccion serial primary key,
    id_portafolio int not null references portafolio(id_portafolio) on delete cascade,
    id_instrumento int not null references instrumento(id_instrumento) on delete restrict,
    tipo_operacion tipo_operacion_enum not null,
    cantidad int check (cantidad > 0),
    monto_total numeric(18,2) not null check (monto_total > 0),
    precio_sucio numeric(14,6),
    fecha timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

create index if not exists idx_transaccion_portafolio on transaccion(id_portafolio);
create index if not exists idx_transaccion_fecha on transaccion(fecha);
create index if not exists idx_transaccion_instrumento on transaccion(id_instrumento);

-- =========================================================================
-- 6. valuacion y análisis de instrumento
-- =========================================================================

create table valuacion (
    id_valuacion serial primary key,
    id_instrumento int not null references instrumento(id_instrumento) on delete cascade,
    precio_limpio numeric(14,6) check (precio_limpio >= 0),
    precio_sucio numeric(14,6) check (precio_sucio >= 0),
    interes_corrido numeric(14,6) check (interes_corrido >= 0),
    duration numeric(10,4),
    duration_modificada numeric(10,4),
    volatilidad numeric(10,6) check (volatilidad >= 0),
    fecha timestamp with time zone default now(),
    constraint uq_valuacion_fecha unique (id_instrumento, fecha)
);

create index if not exists idx_valuacion_instr_fecha on valuacion(id_instrumento, fecha desc);

-- =========================================================================
-- 7. presupuesto y adquisicion
-- =========================================================================

create table presupuesto (
    id_presupuesto serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    categoria varchar(50) not null,
    monto_planeado numeric(18,2) not null check (monto_planeado > 0),
    monto_ejecutado numeric(18,2) default 0 check (monto_ejecutado >= 0),
    periodo varchar(20) not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_presupuesto_empresa on presupuesto(id_empresa);
create index if not exists idx_presupuesto_periodo on presupuesto(periodo);

create table bien (
    id_bien serial primary key,
    nombre varchar(100) not null,
    tipo varchar(40) not null,
    descripcion varchar(200),
    created_at timestamp with time zone default now()
);

-- enum para estado de adquisicion
create type estado_adquisicion_enum as enum ('pendiente', 'completada', 'cancelada');

create table adquisicion (
    id_adquisicion serial primary key,
    id_bien int not null references bien(id_bien) on delete restrict,
    id_presupuesto int not null references presupuesto(id_presupuesto) on delete cascade,
    monto_total numeric(18,2) not null check (monto_total > 0),
    fecha date not null,
    estado estado_adquisicion_enum default 'pendiente',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

create index if not exists idx_adquisicion_presupuesto on adquisicion(id_presupuesto);
create index if not exists idx_adquisicion_bien on adquisicion(id_bien);

-- =========================================================================
-- 8. estado financiero
-- =========================================================================

create table balance_general (
    id_balance serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    fecha date not null,
    total_activos numeric(18,2) not null check (total_activos >= 0),
    total_pasivos numeric(18,2) not null check (total_pasivos >= 0),
    total_capital numeric(18,2) not null check (total_capital >= 0),
    inversiones_valores numeric(18,2) check (inversiones_valores >= 0),
    pagos_pendientes numeric(18,2) check (pagos_pendientes >= 0),
    observaciones text,
    created_at timestamp with time zone default now(),
    constraint chk_balance_ecuacion check (total_activos = total_pasivos + total_capital)
);

create index if not exists idx_balance_empresa_fecha on balance_general(id_empresa, fecha desc);

create table estado_resultado (
    id_estado serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    anio int not null check (anio >= 2000),
    periodo varchar(20) not null,
    ingreso_total numeric(18,2) not null check (ingreso_total >= 0),
    gasto_total numeric(18,2) not null check (gasto_total >= 0),
    utilidad_neta numeric(18,2) not null,
    observaciones text,
    created_at timestamp with time zone default now(),
    constraint chk_resultado_ecuacion check (utilidad_neta = ingreso_total - gasto_total)
);

create index if not exists idx_estado_empresa_anio_periodo on estado_resultado(id_empresa, anio, periodo);

-- =========================================================================
-- 9. anualidad y cupon
-- =========================================================================

create table anualidad (
    id_anualidad serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    tipo varchar(20) not null check (tipo in ('ordinaria', 'anticipada', 'diferida')),
    importe numeric(18,2) not null check (importe > 0),
    tasa numeric(10,6) not null check (tasa >= 0),
    n_periodos int not null check (n_periodos > 0),
    fecha_inicio date not null,
    fecha_fin date not null,
    id_instrumento int references instrumento(id_instrumento),
    valor_presente numeric(18,2),
    valor_futuro numeric(18,2),
    created_at timestamp with time zone default now(),
    constraint chk_fechas_anualidad check (fecha_fin > fecha_inicio)
);

create index if not exists idx_anualidad_empresa on anualidad(id_empresa);

-- cupones pagados por bono y bono m (no aplica a cetes)
create table cupon (
    id_cupon serial primary key,
    id_bono int not null references bono(id_bono) on delete cascade,
    fecha_pago date not null,
    monto numeric(18,2) not null check (monto > 0),
    pagado boolean default false,
    fecha_pago_real date,
    created_at timestamp with time zone default now(),
    constraint chk_cupones_fecha check (pagado = false or fecha_pago_real is not null)
);

create index if not exists idx_cupon_bono_fecha on cupon(id_bono, fecha_pago);

-- =========================================================================
-- 10. inflacion e inpc (índice nacional de precios al consumidor)
-- =========================================================================

create table inflacion (
    id_inflacion serial primary key,
    fecha date not null unique,
    inpc numeric(10,4) not null check (inpc > 0),
    tasa_inflacion numeric(10,6) not null check (tasa_inflacion >= -100),
    created_at timestamp with time zone default now()
);

create index if not exists idx_inflacion_fecha on inflacion(fecha desc);

-- =========================================================================
-- 11. indicador financiero
-- =========================================================================

create table indicador_financiero (
    id_indicador serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    fecha date not null,
    roe numeric(10,6),
    liquidez numeric(10,6),
    solvencia numeric(10,6),
    created_at timestamp with time zone default now()
);

create index if not exists idx_indicador_financiero_empresa_fecha on indicador_financiero(id_empresa, fecha desc);

-- =========================================================================
-- 12. alerta y gestión de riesgos
-- =========================================================================

-- enum para tipo de alerta
create type tipo_alerta_enum as enum ('riesgo_mercado', 'riesgo_credito', 'riesgo_liquidez', 'vencimiento_proximo', 'alerta_presupuesto');

create table alerta_riesgo (
    id_alerta serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    tipo tipo_alerta_enum not null,
    descripcion text not null,
    fecha timestamp with time zone default now(),
    resuelta boolean default false,
    fecha_resolucion timestamp with time zone
);

create index if not exists idx_alerta_riesgo_empresa_resuelta on alerta_riesgo(id_empresa, resuelta);
create index if not exists idx_alerta_riesgo_fecha on alerta_riesgo(fecha desc);

-- =========================================================================
-- 13. reporte
-- =========================================================================

create table reporte (
    id_reporte serial primary key,
    id_empresa int not null references empresa(id_empresa) on delete cascade,
    archivo bytea,
    tipo_reporte varchar(40) not null,
    fecha_subida timestamp with time zone default now(),
    nombre_archivo varchar(255)
);

create index if not exists idx_reporte_empresa_fecha on reporte(id_empresa, fecha_subida desc);

-- =========================================================================
-- fin del modelo
-- =========================================================================
