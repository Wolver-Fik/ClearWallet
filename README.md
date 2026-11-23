# ClearWallet

**A global, private and offline-ready personal finance PWA.**

[Live Demo](https://wolver-fik.github.io/ClearWallet/) Â· [PolyForm Noncommercial License 1.0.0](./LICENSE) Â· **v1.2.1**

ClearWallet is a single-screen personal finance app with a modern dark bento dashboard. It runs entirely in the browser, stores data on the device, and works offline after the first visit.

---

## English

### Features

- **Modern bento dashboard** â€” four KPI cards at the top: available balance, income, expenses and small ("ant") expenses, each with month-over-month variation and an SVG sparkline of the last six months.
- **Interactive category donut** â€” clickable slices and legend showing amounts, percentages and transaction counts; hover or focus to inspect each category.
- **Smoothed evolution curve** â€” cumulative monthly spending area chart with gradient fill, budget pace line, month-end projection and daily tooltips.
- **Offline SVG logos** â€” 100% inline brand and category icons (Spotify, Netflix, Amazon, YouTube, Disney+, HBO, Steam, Uber, supermarket, rent, utilities, â€¦) resolved from the note you type, with a live preview in the add-transaction sheet. No network requests, no icon fonts.
- **Upcoming payments** â€” recurring fixed payments with due status (paid, due today, overdue), next due date and one-click "Pay now" registration.
- **Movement history** â€” search by note, category or amount; filters for all / expenses / income / small expenses; grouped by day with quick inline edit, delete confirmation and a "show more" pager.
- **Interactive demo mode** â€” enriched sample data (Spotify, Netflix, Amazon, Supermercado, Alquiler, Gastos Comunes, â€¦) loaded by default when nothing is stored; "Load sample data (Demo)" in empty states and Settings, plus a "Start from scratch" button to begin from $0 with your own data.
- **Small expenses** â€” track small, repeated purchases separately to see their real weight.
- **Budget by category** â€” per-category liPolyForm Noncommercial License 1.0.0s with progress bars and status.
- **Savings goal** â€” name, target, saved amount and an estimated time to reach it.
- **Last 6 months** â€” compact income/expense and savings comparison.
- **8 languages** â€” English, Spanish, Portuguese, French, Italian, German, Russian and Japanese.
- **Global currencies** â€” automatic currency detection from the browser region/timezone and exact `Intl.NumberFormat` formatting.
- **Data sovereignty** â€” JSON backup/restore and monthly CSV export. No account, no server, no tracking.
- **PWA** â€” installable, offline-ready, network-first HTML strategy and automatic update reload.

### Project structure

```text
clear-wallet/
â”œâ”€â”€ index.html                 # Clean semantic shell
â”œâ”€â”€ manifest.webmanifest       # PWA manifest
â”œâ”€â”€ sw.js                      # Service worker (cache clearwallet-v1.2.1)
â”œâ”€â”€ LICENSE                    # PolyForm Noncommercial License 1.0.0
â”œâ”€â”€ README.md                  # This file
â”œâ”€â”€ css/
â”‚   â””â”€â”€ styles.css             # Dark bento dashboard and responsive styles
â”œâ”€â”€ icons/
â”‚   â””â”€â”€ icon.svg               # Emerald wallet + chart icon
â””â”€â”€ js/
    â”œâ”€â”€ app.js                 # KPIs, charts, offline SVG icons, recurring payments, history, demo, events
    â”œâ”€â”€ storage.js             # localStorage, JSON backups, CSV export
    â””â”€â”€ i18n/
        â”œâ”€â”€ en.js  es.js  pt.js  fr.js
        â”œâ”€â”€ it.js  de.js  ru.js  ja.js
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

PolyForm Noncommercial License 1.0.0 Â© 2026 Wolver-Fik. See [LICENSE](./LICENSE).

---

## EspaÃ±ol

**Una PWA de finanzas personales global, privada y lista para funcionar sin conexiÃ³n.**

[Demo en vivo](https://wolver-fik.github.io/ClearWallet/) Â· [Licencia PolyForm Noncommercial License 1.0.0](./LICENSE) Â· **v1.2.1**

ClearWallet es una aplicaciÃ³n de finanzas personales de una sola pantalla, con un panel Bento moderno y oscuro. Funciona por completo en el navegador, guarda los datos en el dispositivo y sigue disponible sin conexiÃ³n despuÃ©s de la primera visita.

### Funciones

- **Panel Bento moderno** â€” cuatro tarjetas KPI superiores: saldo disponible, ingresos, gastos y gastos hormiga, cada una con el porcentaje de variaciÃ³n mensual y un mini grÃ¡fico SVG (sparkline) de los Ãºltimos seis meses.
- **Dona interactiva por categorÃ­a** â€” segmentos y leyenda interactivos con importes, porcentajes y nÃºmero de movimientos; pasa el cursor o enfoca un segmento para inspeccionar cada categorÃ­a.
- **Curva suavizada de evoluciÃ³n mensual** â€” grÃ¡fico de Ã¡rea de gasto acumulado con degradado, lÃ­nea de ritmo del presupuesto, proyecciÃ³n de cierre de mes y tooltips diarios.
- **Logos SVG 100% offline** â€” iconos de marca y categorÃ­a en lÃ­nea (Spotify, Netflix, Amazon, YouTube, Disney+, HBO, Steam, Uber, supermercado, alquiler, gastos comunes, â€¦) detectados automÃ¡ticamente desde la nota, con vista previa en vivo al escribir. Sin peticiones de red ni fuentes de iconos.
- **PrÃ³ximos vencimientos** â€” pagos fijos recurrentes con estado (pagado, vence hoy, vencido), prÃ³xima fecha de cobro y registro en un clic con Â«Pagar ahoraÂ».
- **Historial de movimientos** â€” bÃºsqueda por nota, categorÃ­a o importe; filtros de todos / gastos / ingresos / gastos hormiga; agrupado por dÃ­a con ediciÃ³n rÃ¡pida en lÃ­nea, confirmaciÃ³n al eliminar y paginador Â«mostrar mÃ¡sÂ».
- **Modo DemostraciÃ³n interactivo** â€” datos de ejemplo enriquecidos (Spotify, Netflix, Amazon, Supermercado, Alquiler, Gastos Comunes, â€¦) que se cargan por defecto cuando no hay nada guardado; botÃ³n Â«Cargar datos de ejemplo (Demo)Â» en los estados vacÃ­os y en Ajustes, y botÃ³n Â«Empezar desde ceroÂ» para arrancar desde $0 con tus propios datos.
- **Gastos hormiga** â€” registra las compras pequeÃ±as y repetidas por separado para ver cuÃ¡nto pesan.
- **Presupuesto por categorÃ­a** â€” lÃ­PolyForm Noncommercial License 1.0.0es por categorÃ­a con barras de progreso y estado.
- **Meta de ahorro** â€” nombre, objetivo, monto ahorrado y tiempo estimado para alcanzarla.
- **Ãšltimos 6 meses** â€” comparaciÃ³n compacta de ingresos, gastos y ahorro.
- **8 idiomas** â€” inglÃ©s, espaÃ±ol, portuguÃ©s, francÃ©s, italiano, alemÃ¡n, ruso y japonÃ©s.
- **Divisas globales** â€” detecciÃ³n automÃ¡tica segÃºn la regiÃ³n o zona horaria del navegador y formato exacto con `Intl.NumberFormat`.
- **SoberanÃ­a de datos** â€” respaldo y restauraciÃ³n en JSON, ademÃ¡s de exportaciÃ³n mensual a CSV. Sin cuentas, sin servidor y sin rastreo.
- **PWA** â€” instalable, disponible sin conexiÃ³n, estrategia Network-First para HTML y recarga automÃ¡tica al actualizar.

### Estructura del proyecto

```text
clear-wallet/
â”œâ”€â”€ index.html                 # Estructura semÃ¡ntica limpia
â”œâ”€â”€ manifest.webmanifest       # Manifiesto PWA
â”œâ”€â”€ sw.js                      # Service worker (cachÃ© clearwallet-v1.2.1)
â”œâ”€â”€ LICENSE                    # PolyForm Noncommercial License 1.0.0
â”œâ”€â”€ README.md                  # Este archivo
â”œâ”€â”€ css/
â”‚   â””â”€â”€ styles.css             # Panel Bento oscuro y estilos responsiveness
â”œâ”€â”€ icons/
â”‚   â””â”€â”€ icon.svg               # Icono de billetera y grÃ¡fico esmeralda
â””â”€â”€ js/
    â”œâ”€â”€ app.js                 # KPIs, grÃ¡ficos, iconos SVG offline, pagos fijos, historial, demo y eventos
    â”œâ”€â”€ storage.js             # localStorage, respaldos JSON y exportaciÃ³n CSV
    â””â”€â”€ i18n/
        â”œâ”€â”€ en.js  es.js  pt.js  fr.js
        â”œâ”€â”€ it.js  de.js  ru.js  ja.js
```

### Idiomas y divisas

- El idioma de la interfaz se detecta con `navigator.language` en la primera visita y se guarda en `localStorage` con la clave `clearwallet-lang-v1`.
- Puedes cambiar el idioma en cualquier momento desde el selector del encabezado (`EN ES PT FR IT DE RU JA`) o desde Ajustes.
- La divisa inicial se deduce de la zona horaria y la regiÃ³n del navegador, y luego se guarda con tus datos. Puedes elegir cualquier divisa ISO desde Ajustes.
- Los montos se formatean con `Intl.NumberFormat`; los porcentajes usan `Intl.NumberFormat` con `style: "percent"`; las formas plurales usan `Intl.PluralRules`.

### Datos y respaldos

- Los datos se guardan en `localStorage` con la clave `clearwallet-v1`.
- Cuando no hay movimientos ni pagos fijos guardados, se carga automÃ¡ticamente la demo enriquecida para que la dona y la curva de evoluciÃ³n estÃ©n llenas desde la primera visita.
- **Cargar datos de ejemplo (Demo)** estÃ¡ siempre disponible en Ajustes y en los estados vacÃ­os del historial, la dona y la curva de evoluciÃ³n.
- **Empezar desde cero** borra los datos de ejemplo para iniciar un presupuesto real desde $0.
- **Exportar respaldo (.json)** descarga una copia completa de la configuraciÃ³n y los movimientos mensuales.
- **Importar respaldo (.json)** valida el archivo y reemplaza los datos actuales despuÃ©s de confirmar.
- **Exportar movimientos del mes (.csv)** descarga un CSV UTF-8 (con BOM) del mes seleccionado.

### Detalles PWA

- `manifest.webmanifest` usa `display: "standalone"`, identidad esmeralda/oscura y un icono SVG con `"purpose": "any maskable"`.
- `sw.js` precarga la estructura de la aplicaciÃ³n en la cachÃ© `clearwallet-v1.2.1`, usa **Network-First para HTML**, cache-first para recursos del mismo origen y stale-while-revalidate para recursos externos como las fuentes.
- Las cachÃ©s antiguas de `clearwallet-` se eliminan al activar; el service worker llama a `self.skipWaiting()` y a `self.clients.claim()`.
- `app.js` escucha `controllerchange` y recarga una vez para mostrar la nueva versiÃ³n de inmediato.

### Licencia

PolyForm Noncommercial License 1.0.0 Â© 2026 Wolver-Fik. Consulta [LICENSE](./LICENSE).

