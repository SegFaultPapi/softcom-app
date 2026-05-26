# MVP Scope: SoftCom Solutions — Plataforma de Valuación de Bonos

## Problema Core
Una casa de bolsa necesita una plataforma interna para que sus equipos puedan valuar, comprar y monitorear bonos de inversión, con portafolios de clientes actualizados en tiempo real y acceso controlado por roles.

## Flujo MVP (5 pasos)
1. Admin da de alta al cliente con datos KYC simulados (nombre, RFC, CURP) y le asigna saldo inicial virtual
2. Usuario inicia sesión → el sistema valida credenciales y carga permisos según su rol
3. Gerente o Analista selecciona tipo de bono (CETES o Bono M), ingresa parámetros → el sistema calcula el precio usando la tasa de referencia
4. Gerente ejecuta compra o venta → operación se registra con log trazable y timestamps
5. Usuario consulta su dashboard con capital total, capital invertido y portafolio en gráficas → exporta reporte numérico

## Features MVP
- **Autenticación con roles** — Login con permisos diferenciados: Administrador, Gerente de Cartera, Analista
- **KYC Simulado** — Alta de clientes por Admin con datos básicos: nombre, RFC, CURP y saldo inicial virtual
- **Valuación de CETES** — Fórmula cupón cero `P = F / (1+r)^N` con tasa de referencia como tasa de descuento
- **Valuación de Bonos M** — Fórmula tasa fija `P = A × [1-(1+r)^-N / r] + F/(1+r)^N` con pagos semestrales
- **Compra / Venta de bonos** — Solo Gerente puede ejecutar; registro con log de trazabilidad inmutable
- **Dashboard con gráficas** — Capital total, capital invertido, desglose por instrumento (dona, barras, línea de tiempo)
- **Portafolio dinámico** — Actualización automática tras cada operación, visible para Gerente y Analista
- **Exportación de portafolio** — Descarga en formato numérico básico (instrumento, cantidad, precio, valor actual)

## NO va en MVP
- Diagramas de flujo visuales de los bonos
- Cálculo del rendimiento a fecha de venta
- Modelado de cashflows a largo plazo (~35 años)
- Transferencia desde cuenta de cheques al sistema
- Operaciones de compra/venta entre clientes
- Blockchain en testnet *(se evalúa solo si hay tiempo y experiencia Web3 en el equipo)*

## Criterio de Éxito
Mi MVP funciona si: el Administrador da de alta a un cliente con KYC, el Gerente valúa y ejecuta la compra de un CETES y un Bono M, el Analista consulta el portafolio, y el dashboard muestra las gráficas de capital e inversión con opción de exportar.
