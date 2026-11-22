# ClearWallet

**A global, private and offline-ready personal finance PWA.**

[Live Demo](https://wolver-fik.github.io/ClearWallet/) · [MIT License](./LICENSE) · **v1.2.1**

ClearWallet is a single-screen personal finance app with a modern dark bento dashboard. It runs entirely in the browser, stores data on the device, and works offline after the first visit.

---

## English

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
- **8 languages** — English, Spanish, Portuguese, French, Italian, German, Russian and Japanese.
- **Global currencies** — automatic currency detection from the browser region/timezone and exact `Intl.NumberFormat` formatting.
- **Data sovereignty** — JSON backup/restore and monthly CSV export. No account, no server, no tracking.
- **PWA** — installable, offline-ready, network-first HTML strategy and automatic update reload.

### Project structure

```text
clear-wallet/
├── index.html                 # Clean semantic shell
├── manifest.webmanifest       # PWA manifest
├── sw.js                      # Service worker (cache clearwallet-v1.2.1)
├── LICENSE                    # MIT
├── README.md                  # This file
├── css/
│   └── styles.css             # Dark bento dashboard and responsive styles
├── icons/
│   └── icon.svg               # Emerald wallet + chart icon
└── js/
    ├── app.js                 # KPIs, charts, offline SVG icons, recurring payments, history, demo, events
    ├── storage.js             # localStorage, JSON backups, CSV export
    └── i18n/
        ├── en.js  es.js  pt.js  fr.js
        ├── it.js  de.js  ru.js  ja.js
```

### Languages and currencies

- The interface language is detected from `navigator.language` on the first visit and saved in `localStorage` under `clearwallet-lang-v1`.
- You can switch language at any time from the header selector (`EN ES PT FR IT DE RU JA`) or from Settings.
- The initial currency is inferred from the browser timezone and region, then saved with your data. You can choose from the full ISO currency list in Settings.
- Amounts are formatted with `Intl.NumberFormat`; percentages use `Intl.NumberFormat` with `style: "percent"`; plural forms use `Intl.PluralRules`.

### Data and backups

- Data is stored in `localStorage` under `clearwallet-v1`.
- When there are no movements and no recurring payments stored, the enriched demo is loaded automatically so the donut and the evolution curve are filled from the first visit.
- **Load sample data (Demo)** is always available in Settings and in the empty states of the history, donut and evolution chart.
- **Start from scratch** clears the sample data and starts a real budget from $0.
- **Export backup (.json)** downloads a complete snapshot of settings and monthly transactions.
- **Import backup (.json)** validates the file and replaces the current data after confirmation.
- **Export this month's transactions (.csv)** downloads a UTF-8 CSV (with BOM) for the selected month.

### PWA details

- `manifest.webmanifest` uses `display: "standalone"`, emerald/dark branding and an SVG icon with `"purpose": "any maskable"`.
- `sw.js` pre-caches the app shell under `clearwallet-v1.2.1`, uses **Network-First for HTML**, cache-first for same-origin assets, and stale-while-revalidate for external assets such as fonts.
- Old `clearwallet-` caches are removed on activation; the service worker calls `self.skipWaiting()` and `self.clients.claim()`.
- `app.js` listens for `controllerchange` and reloads once so the new version is shown immediately.

### License

MIT © 2026 Wolver-Fik. See [LICENSE](./LICENSE).

---

## Español

**Una PWA de finanzas personales global, privada y lista para funcionar sin conexión.**

[Demo en vivo](https://wolver-fik.github.io/ClearWallet/) · [Licencia MIT](./LICENSE) · **v1.2.1**

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
- **8 idiomas** — inglés, español, portugués, francés, italiano, alemán, ruso y japonés.
- **Divisas globales** — detección automática según la región o zona horaria del navegador y formato exacto con `Intl.NumberFormat`.
- **Soberanía de datos** — respaldo y restauración en JSON, además de exportación mensual a CSV. Sin cuentas, sin servidor y sin rastreo.
- **PWA** — instalable, disponible sin conexión, estrategia Network-First para HTML y recarga automática al actualizar.

### Estructura del proyecto

```text
clear-wallet/
├── index.html                 # Estructura semántica limpia
├── manifest.webmanifest       # Manifiesto PWA
├── sw.js                      # Service worker (caché clearwallet-v1.2.1)
├── LICENSE                    # MIT
├── README.md                  # Este archivo
├── css/
│   └── styles.css             # Panel Bento oscuro y estilos responsiveness
├── icons/
│   └── icon.svg               # Icono de billetera y gráfico esmeralda
└── js/
    ├── app.js                 # KPIs, gráficos, iconos SVG offline, pagos fijos, historial, demo y eventos
    ├── storage.js             # localStorage, respaldos JSON y exportación CSV
    └── i18n/
        ├── en.js  es.js  pt.js  fr.js
        ├── it.js  de.js  ru.js  ja.js
```

### Idiomas y divisas

- El idioma de la interfaz se detecta con `navigator.language` en la primera visita y se guarda en `localStorage` con la clave `clearwallet-lang-v1`.
- Puedes cambiar el idioma en cualquier momento desde el selector del encabezado (`EN ES PT FR IT DE RU JA`) o desde Ajustes.
- La divisa inicial se deduce de la zona horaria y la región del navegador, y luego se guarda con tus datos. Puedes elegir cualquier divisa ISO desde Ajustes.
- Los montos se formatean con `Intl.NumberFormat`; los porcentajes usan `Intl.NumberFormat` con `style: "percent"`; las formas plurales usan `Intl.PluralRules`.

### Datos y respaldos

- Los datos se guardan en `localStorage` con la clave `clearwallet-v1`.
- Cuando no hay movimientos ni pagos fijos guardados, se carga automáticamente la demo enriquecida para que la dona y la curva de evolución estén llenas desde la primera visita.
- **Cargar datos de ejemplo (Demo)** está siempre disponible en Ajustes y en los estados vacíos del historial, la dona y la curva de evolución.
- **Empezar desde cero** borra los datos de ejemplo para iniciar un presupuesto real desde $0.
- **Exportar respaldo (.json)** descarga una copia completa de la configuración y los movimientos mensuales.
- **Importar respaldo (.json)** valida el archivo y reemplaza los datos actuales después de confirmar.
- **Exportar movimientos del mes (.csv)** descarga un CSV UTF-8 (con BOM) del mes seleccionado.

### Detalles PWA

- `manifest.webmanifest` usa `display: "standalone"`, identidad esmeralda/oscura y un icono SVG con `"purpose": "any maskable"`.
- `sw.js` precarga la estructura de la aplicación en la caché `clearwallet-v1.2.1`, usa **Network-First para HTML**, cache-first para recursos del mismo origen y stale-while-revalidate para recursos externos como las fuentes.
- Las cachés antiguas de `clearwallet-` se eliminan al activar; el service worker llama a `self.skipWaiting()` y a `self.clients.claim()`.
- `app.js` escucha `controllerchange` y recarga una vez para mostrar la nueva versión de inmediato.

### Licencia

MIT © 2026 Wolver-Fik. Consulta [LICENSE](./LICENSE).
