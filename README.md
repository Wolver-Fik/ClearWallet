# ClearWallet

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-ClearWallet-6366F1)](https://wolver-fik.github.io/ClearWallet/)

[English](#english) · [Español](#español)

---

## English

ClearWallet is a single-screen personal finance app with a modern dark bento dashboard. It runs entirely in the browser, stores data on the device, and works offline after the first visit.

### Features

- **Modern bento dashboard** — four KPI cards at the top: available balance, income, expenses and small ("ant") expenses, each with month-over-month variation and an SVG sparkline of the last six months.
- **Interactive category donut** — clickable slices and legend showing amounts, percentages and transaction counts; hover or focus to inspect each category.
- **Smoothed evolution curve** — cumulative monthly spending area chart with gradient fill, budget pace line, month-end projection and daily tooltips.
- **Offline SVG logos** — 100% inline brand and category icons (Spotify, Netflix, Amazon, YouTube, Disney+, HBO, Steam, Uber, supermarket, rent, utilities, …) resolved from the note you type, with a live preview in the add-transaction sheet. No network requests, no icon fonts.
- **Upcoming payments** — recurring fixed payments with due status (paid, due today, overdue), next due date and one-click "Pay now" registration.
- **Movement history** — search by note, category or amount; filters for all / expenses / income / small expenses; grouped by day with quick inline edit, delete confirmation and a "show more" pager.
- **Interactive demo mode** — enriched sample data (Spotify, Netflix, Amazon, Supermercado, Alquiler, Gastos Comunes, …) loaded by default when nothing is stored; "Load sample data (Demo)" in empty states and Settings, plus a "Start from scratch" button to begin from $0 with your own data.
- **Small expenses** — track small, repeated purchases separately to see their real weight.
- **Budget by category** — per-category limits with progress bars and status.
- **Savings goal** — name, target, saved amount and an estimated time to reach it.
- **Last 6 months** — compact income/expense and savings comparison.
- **Projected month-end balance** — forecast your closing balance from current income, expenses and recurring payments.
- **Month-by-month category comparison** — see how each category changes over time with per-category month-over-month figures.
- **Debts & loans with partial payments** — record what you owe and what is owed to you, log installments against a chosen account with their own date and note, inspect the payment history and settle the outstanding balance. Each installment creates a matching movement using the exact exchange rate.
- **Manual exchange rates, 100% offline** — enter your own rates, convert amounts without any network request. Rates are stored with six decimals and every amount keeps both its original currency and its converted value in the base currency. Missing rates are requested before saving: a transaction, transfer, installment or currency change is never stored with an invented 1:1 rate.
- **Multiple accounts and wallets** — cash, bank, card, savings or custom accounts with their own currency, initial balance and colour.
- **Internal transfers** — move money between accounts with an explicit conversion rate, date and note; they never count as income or expenses. Deleting an account reassigns its transactions and preserves every remaining balance.
- **Accounts & transfers in backups** — JSON exports include `schemaVersion`, `appId`, export date, accounts and transfers; a backup from another app, with duplicate IDs, invalid amounts, broken account references or corrupt dates is rejected before anything is overwritten.
- **60fps lists** — movements render 60 at a time and recurring payments / transfers use a "show more" expander, keeping the DOM small on mobile.
- **8 languages** — English, Spanish, Portuguese, French, Italian, German, Russian and Japanese.
- **Global currencies** — automatic currency detection from the browser region/timezone and exact `Intl.NumberFormat` formatting. Changing the base currency recalculates all historical amounts, budgets, goals and debt installments.
- **Data sovereignty** — JSON backup/restore and monthly CSV export. CSV columns state explicitly the original amount/currency, converted amount and base currency. No account, no server, no tracking.
- **PWA** — installable, offline-ready, network-first HTML strategy and a discreet update notice that is applied only when you ask for it and have no unsaved edits.

### Project structure

```text
clear-wallet/
├── index.html                 # Clean semantic shell
├── manifest.webmanifest       # PWA manifest
├── sw.js                      # Service worker (cache clearwallet-v1.6.0)
├── LICENSE                    # PolyForm Noncommercial License 1.0.0
├── README.md                  # This file
├── css/
│   └── styles.css             # Dark bento dashboard and responsive styles
├── icons/
│   └── icon.svg               # Emerald wallet + chart icon
└── js/
    ├── app.js                 # Strict FX conversion, KPIs, charts, accounts, transfers, debts, history, demo, events
    ├── storage.js             # IndexedDB, localStorage mirror, backup validation, CSV export
    └── i18n/
        ├── en.js  es.js  pt.js  fr.js
        ├── it.js  de.js  ru.js  ja.js
```

### Languages and currencies

- The interface language is detected from `navigator.language` on the first visit and saved in `localStorage` under `clearwallet-lang-v1`.
- You can switch language at any time from the header selector (`EN ES PT FR IT DE RU JA`) or from Settings.
- The initial currency is inferred from the browser timezone and region, then saved with your data. You can choose from the full ISO currency list in Settings.
- Amounts are formatted with `Intl.NumberFormat`; percentages use `Intl.NumberFormat` with `style: "percent"`; plural forms use `Intl.PluralRules`.
- Rates may be direct, inverse or up to three hops through other saved pairs. If a rate is missing, the app asks for it instead of assuming 1:1.

### Data and backups

- IndexedDB (`clearwallet_db`, schema v3) is the primary store, mirrored synchronously in `localStorage` under `clearwallet-v1`. Accounts, transfers and the full snapshot are written in a single transaction; saves are confirmed before showing a success message.
- When there are no movements and no recurring payments stored, the enriched demo is loaded automatically so the donut and the evolution curve are filled from the first visit.
- **Load sample data (Demo)** is always available in Settings and in the empty states of the history, donut and evolution chart.
- **Start from scratch** clears the sample data and starts a real budget from $0.
- **Export backup (.json)** downloads a complete snapshot of settings, accounts, transfers and monthly transactions.
- **Import backup (.json)** validates origin, schema, duplicate IDs, referenced accounts, dates and amounts before replacing current data after confirmation.
- **Export this month's data (.csv)** downloads a UTF-8 CSV (with BOM) for the selected month. Columns are explicit: original amount, original currency, converted amount, base currency, account, destination and micro-expense flag. Transfers are labelled as such, never as income or expenses.

### PWA details

- `manifest.webmanifest` uses `display: "standalone"`, emerald/dark branding and an SVG icon with `"purpose": "any maskable"`.
- `sw.js` pre-caches the app shell under `clearwallet-v1.6.0`, uses **Network-First for HTML**, cache-first for same-origin assets, and stale-while-revalidate for external assets such as fonts. Every cache write is tracked with `event.waitUntil()`.
- Old `clearwallet-` caches are removed on activation; the service worker calls `self.skipWaiting()` and `self.clients.claim()`. IndexedDB and user data are never touched by the service worker.
- When a new version is installed, `app.js` shows a small non-blocking banner. The page reloads only after you tap **Update now** and have no unsaved form data or open editor.

### License

PolyForm Noncommercial License 1.0.0 © 2026 Wolver-Fik. See [LICENSE](./LICENSE).

---

<a id="español"></a>

## Español

**Una PWA de finanzas personales global, privada y lista para funcionar sin conexión.**

[Demo en vivo](https://wolver-fik.github.io/ClearWallet/) · [Licencia PolyForm Noncommercial License 1.0.0](./LICENSE) · **v1.6.0**

ClearWallet es una aplicación de finanzas personales de una sola pantalla, con un panel Bento moderno y oscuro. Funciona por completo en el navegador, guarda los datos en el dispositivo y sigue disponible sin conexión después de la primera visita.

### Funciones

- **Panel Bento moderno** — cuatro tarjetas KPI superiores: saldo disponible, ingresos, gastos y gastos hormiga, cada una con el porcentaje de variación mensual y un mini gráfico SVG (sparkline) de los últimos seis meses.
- **Dona interactiva por categoría** — segmentos y leyenda interactivos con importes, porcentajes y número de movimientos; pasa el cursor o enfoca un segmento para inspeccionar cada categoría.
- **Curva suavizada de evolución mensual** — gráfico de área de gasto acumulado con degradado, línea de ritmo del presupuesto, proyección de cierre de mes y tooltips diarios.
- **Logos SVG 100% offline** — iconos de marca y categoría en línea (Spotify, Netflix, Amazon, YouTube, Disney+, HBO, Steam, Uber, supermercado, alquiler, gastos comunes, …) detectados automáticamente desde la nota, con vista previa en vivo al escribir. Sin peticiones de red ni fuentes de iconos.
- **Próximos vencimientos** — pagos fijos recurrentes con estado (pagado, vence hoy, vencido), próxima fecha de cobro y registro en un clic con «Pagar ahora».
- **Historial de movimientos** — búsqueda por nota, categoría o importe; filtros de todos / gastos / ingresos / gastos hormiga; agrupado por día con edición rápida en línea, confirmación al eliminar y paginador «mostrar más».
- **Modo Demostración interactivo** — datos de ejemplo enriquecidos (Spotify, Netflix, Amazon, Supermercado, Alquiler, Gastos Comunes, …) que se cargan por defecto cuando no hay nada guardado; botón «Cargar datos de ejemplo (Demo)» en los estados vacíos y en Ajustes, y botón «Empezar desde cero» para arrancar desde $0 con tus propios datos.
- **Gastos hormiga** — registra las compras pequeñas y repetidas por separado para ver cuánto pesan.
- **Presupuesto por categoría** — límites por categoría con barras de progreso y estado.
- **Meta de ahorro** — nombre, objetivo, monto ahorrado y tiempo estimado para alcanzarla.
- **Últimos 6 meses** — comparación compacta de ingresos, gastos y ahorro.
- **Balance proyectado a fin de mes** — estima el saldo de cierre a partir de ingresos, gastos y pagos fijos actuales.
- **Comparación mensual por categoría** — consulta la evolución de cada categoría mes a mes con cifras comparadas.
- **Deudas y préstamos con abonos parciales** — registra lo que debes y lo que te deben, anota cuotas contra una cuenta elegida con su fecha y nota, consulta el historial de abonos y liquida el saldo pendiente. Cada abono crea su movimiento con la tasa exacta aplicada.
- **Tasas de cambio manuales 100% offline** — introduce tus propias tasas y convierte importes sin ninguna petición de red. Las tasas se guardan con seis decimales y cada importe conserva su divisa original y su valor convertido a la moneda base. Si falta una tasa se te pide antes de guardar: ningún movimiento, transferencia, abono ni cambio de moneda se guarda con un 1:1 inventado.
- **Cuentas y billeteras** — efectivo, banco, tarjeta, ahorros o cuentas personalizadas con su divisa, saldo inicial y color.
- **Transferencias internas** — mueve dinero entre cuentas con una tasa de conversión explícita, fecha y nota; nunca cuentan como ingreso ni gasto. Al eliminar una cuenta se reasignan sus movimientos y se conservan todos los saldos restantes.
- **Cuentas y transferencias en el respaldo** — el JSON incluye `schemaVersion`, `appId`, fecha de exportación, cuentas y transferencias; una copia de otra app, con IDs duplicados, importes inválidos, cuentas inexistentes o fechas corruptas se rechaza antes de sobrescribir nada.
- **Listas a 60 fps** — los movimientos se muestran de 60 en 60 y los pagos fijos y transferencias usan un desplegable «mostrar más» para mantener el DOM pequeño en móvil.
- **8 idiomas** — inglés, español, portugués, francés, italiano, alemán, ruso y japonés.
- **Divisas globales** — detección automática según la región o zona horaria del navegador y formato exacto con `Intl.NumberFormat`. Al cambiar la moneda base se recalculan todos los importes históricos, presupuestos, metas y abonos de deudas.
- **Soberanía de datos** — respaldo y restauración en JSON, además de exportación mensual a CSV. El CSV indica explícitamente el monto y la moneda originales, el monto convertido y la moneda base. Sin cuentas, sin servidor y sin rastreo.
- **PWA** — instalable, disponible sin conexión, estrategia Network-First para HTML y un aviso discreto de actualización que solo se aplica cuando tú lo pides y no hay cambios sin guardar.

### Estructura del proyecto

```text
clear-wallet/
├── index.html                 # Estructura semántica limpia
├── manifest.webmanifest       # Manifiesto PWA
├── sw.js                      # Service worker (caché clearwallet-v1.6.0)
├── LICENSE                    # PolyForm Noncommercial License 1.0.0
├── README.md                  # Este archivo
├── css/
│   └── styles.css             # Panel Bento oscuro y estilos responsiveness
├── icons/
│   └── icon.svg               # Icono de billetera y gráfico esmeralda
└── js/
    ├── app.js                 # Conversión estricta, KPIs, gráficos, cuentas, transferencias, deudas, historial, demo y eventos
    ├── storage.js             # IndexedDB, espejo localStorage, validación de respaldos y exportación CSV
    └── i18n/
        ├── en.js  es.js  pt.js  fr.js
        ├── it.js  de.js  ru.js  ja.js
```

### Idiomas y divisas

- El idioma de la interfaz se detecta con `navigator.language` en la primera visita y se guarda en `localStorage` con la clave `clearwallet-lang-v1`.
- Puedes cambiar el idioma en cualquier momento desde el selector del encabezado (`EN ES PT FR IT DE RU JA`) o desde Ajustes.
- La divisa inicial se deduce de la zona horaria y la región del navegador, y luego se guarda con tus datos. Puedes elegir cualquier divisa ISO desde Ajustes.
- Los montos se formatean con `Intl.NumberFormat`; los porcentajes usan `Intl.NumberFormat` con `style: "percent"`; las formas plurales usan `Intl.PluralRules`.
- Las tasas pueden ser directas, inversas o derivadas de hasta tres saltos entre pares guardados. Si falta una tasa, la app la pide en lugar de asumir 1:1.

### Datos y respaldos

- IndexedDB (`clearwallet_db`, esquema v3) es el almacén principal, con un espejo sincrónico en `localStorage` bajo `clearwallet-v1`. Cuentas, transferencias y la instantánea completa se escriben en una sola transacción; el guardado se confirma antes de mostrar el aviso de éxito.
- Cuando no hay movimientos ni pagos fijos guardados, se carga automáticamente la demo enriquecida para que la dona y la curva de evolución estén llenas desde la primera visita.
- **Cargar datos de ejemplo (Demo)** está siempre disponible en Ajustes y en los estados vacíos del historial, la dona y la curva de evolución.
- **Empezar desde cero** borra los datos de ejemplo para iniciar un presupuesto real desde $0.
- **Exportar respaldo (.json)** descarga una copia completa de la configuración, cuentas, transferencias y movimientos mensuales.
- **Importar respaldo (.json)** valida el origen, el esquema, los IDs duplicados, las cuentas referenciadas, las fechas y los importes antes de reemplazar los datos actuales tras confirmarlo.
- **Exportar movimientos del mes (.csv)** descarga un CSV UTF-8 (con BOM) del mes seleccionado. Las columnas son explícitas: monto original, moneda original, monto convertido, moneda base, cuenta, destino e indicador de gasto hormiga. Las transferencias aparecen como tales, nunca como ingresos ni gastos.

### Detalles PWA

- `manifest.webmanifest` usa `display: "standalone"`, identidad esmeralda/oscura y un icono SVG con `"purpose": "any maskable"`.
- `sw.js` precarga la estructura de la aplicación en la caché `clearwallet-v1.6.0`, usa **Network-First para HTML**, cache-first para recursos del mismo origen y stale-while-revalidate para recursos externos como las fuentes. Cada escritura en caché se registra con `event.waitUntil()`.
- Las cachés antiguas de `clearwallet-` se eliminan al activar; el service worker llama a `self.skipWaiting()` y a `self.clients.claim()`. IndexedDB y los datos del usuario nunca se tocan desde el service worker.
- Cuando se instala una versión nueva, `app.js` muestra una barra pequeña y no bloqueante. La página solo se recarga después de pulsar **Actualizar ahora** y si no hay datos sin guardar ni editores abiertos.

### Licencia

PolyForm Noncommercial License 1.0.0 © 2026 Wolver-Fik. Consulta [LICENSE](./LICENSE).
