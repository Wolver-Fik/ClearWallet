window.CWI18N = window.CWI18N || {};
window.CWI18N.es = {
  'install.button': 'Instalar app',
  'install.guideTitle': 'Instalar en iPhone o iPad',
  'install.step1': 'Toca el icono Compartir en la barra de Safari',
  'install.step2': 'Elige «Añadir a pantalla de inicio»',
  'install.close': 'Cerrar',
  'install.buttonAria': 'Instalar app en este dispositivo',
  'install.closeAria': 'Cerrar guía de instalación',
  code: 'es',
  name: 'Español',
  locale: 'es-ES',
  app: { tagline: 'Finanzas personales' },
  views: {
    group: 'Vistas',
    overview: 'Resumen',
    movements: 'Movimientos',
    fixed: 'Pagos fijos',
    goals: 'Metas'
  },
  kpi: {
    group: 'Resumen mensual',
    balance: 'Saldo disponible',
    income: 'Ingresos',
    expenses: 'Gastos',
    micro: 'Gastos hormiga',
    vsPrev: 'vs. mes anterior',
    noPrev: 'sin datos anteriores'
  },
  header: {
    prevMonth: 'Mes anterior',
    nextMonth: 'Mes siguiente',
    currentMonth: 'Volver al mes actual',
    settings: 'Ajustes'
  },
  type: { expense: 'Gasto', income: 'Ingreso', group: 'Tipo de movimiento' },
  add: {
    title: 'Registrar movimiento',
    amountLabel: 'Monto',
    noteLabel: 'Nota',
    notePlaceholder: 'Nota (opcional): supermercado, café…',
    notePlaceholderIncome: 'Nota (opcional): salario, freelance…',
    dateLabel: 'Fecha',
    categoryLabel: 'Categoría',
    micro: 'Gastos hormiga',
    microTitle: 'Compras pequeñas y frecuentes',
    microHint: 'Hormiga: compras pequeñas y repetidas, como el café, la tienda o el reparto. Se suman aparte para que veas cuánto pesan.',
    expenseBtn: 'Registrar gasto',
    incomeBtn: 'Registrar ingreso',
    addedExpense: 'Gasto registrado: −{amount}',
    addedIncome: 'Ingreso registrado: +{amount}',
    addedInMonth: '{msg} · {month}',
    amountError: 'Escribe un monto mayor que cero',
    categoryError: 'Elige una categoría'
  },
  demo: {
    title: 'Estos son datos de ejemplo.',
    body: 'Elige tu moneda y empieza desde cero, o registra tu primer movimiento y los datos de ejemplo desaparecen.',
    start: 'Empezar desde cero',
    ready: 'Listo, empieza a registrar tus movimientos',
    load: 'Cargar datos de ejemplo (Demo)',
    loaded: 'Datos de ejemplo cargados'
  },
  hero: {
    title: 'Disponible del mes',
    income: 'Ingresos',
    expenses: 'Gastos',
    savings: 'Ahorro',
    micro: 'Gastos hormiga',
    records: { one: '{n} registro', other: '{n} registros' },
    purchases: { one: '{n} compra', other: '{n} compras' },
    ofExpenses: '{pct} del gasto',
    ofTarget: '{pct} de la meta de {amount}',
    ofIncome: '{pct} de tus ingresos',
    noTarget: 'Sin meta definida',
    dayOf: 'Día {day} de {dim}',
    noTxCurrent: 'Todavía no has registrado nada este mes.',
    noTxPast: 'No hay movimientos en este mes.',
    future: 'Previsto: {amount} en gastos.',
    setBudget: 'Configura un presupuesto por categoría en Ajustes para saber cómo vas.',
    pastUnder: 'Terminaste {amount} por debajo del presupuesto.',
    pastOver: 'Te pasaste {amount} del presupuesto.',
    overBudget: 'Superaste el presupuesto por {amount}.',
    onTrack: 'Vas bien: llevas {spent} del presupuesto y {time} del mes.',
    caution: 'Atención: llevas {spent} del presupuesto con {time} del mes.',
    overspending: 'Te estás pasando: llevas {spent} del presupuesto con {time} del mes.',
    perDay: 'Puedes gastar unos {amount} por día hasta fin de mes.',
    noMargin: 'No queda margen para el resto del mes{goal}.',
    goalSuffix: ', contando tu meta de ahorro',
    spentOf: 'Gastado {spent} de {budget}',
    spentOnly: 'Gastado {spent}'
  },
  donut: {
    title: 'Gastos por categoría',
    empty: 'Todavía no hay gastos registrados este mes.',
    aria: 'Gráfico de anillo con la distribución de gastos por categoría',
    totalLabel: 'Total gastado',
    categories: { one: '{n} categoría', other: '{n} categorías' },
    transactions: { one: '{n} movimiento', other: '{n} movimientos' },
    txCount: { one: '{n} mov.', other: '{n} mov.' }
  },
  budgets: {
    title: 'Presupuesto por categoría',
    total: 'Total',
    over: '{amount} de más',
    left: 'Quedan {amount}',
    noBudget: 'Sin presupuesto',
    noTx: 'Sin movimientos',
    hint: 'Define cuánto quieres gastar en cada categoría desde Ajustes.'
  },
  pace: {
    title: 'Ritmo de gasto',
    sub: 'Acumulado del mes',
    empty: 'Cuando registres gastos verás aquí si el mes avanza más rápido que tu presupuesto.',
    over: 'Al ritmo actual cerrarás el mes en {amount}, unos {over} por encima de tu presupuesto.',
    within: 'Al ritmo actual cerrarás el mes en {amount}, dentro de tu presupuesto.',
    only: 'Al ritmo actual cerrarás el mes en {amount} de gasto.',
    legendCum: 'Gasto acumulado',
    legendPace: 'Ritmo del presupuesto',
    legendProj: 'Proyección',
    aria: 'Gasto acumulado por día del mes frente al ritmo del presupuesto',
    tooltipTotal: '{amount} acumulado',
    tooltipDay: '+{amount} este día'
  },
  fixed: {
    income: {
      paid: 'Cobrado',
      dueToday: 'Cobro esperado hoy',
      dueIn: { one: 'Cobro esperado en {n} día', other: 'Cobro esperado en {n} días' },
      overdue: { one: 'Pendiente de cobro ({n} día)', other: 'Pendiente de cobro ({n} días)' }
    },
    title: 'Pagos fijos y recurrentes',
    sub: 'Suscripciones, alquiler, servicios',
    upcomingTitle: 'Próximos vencimientos',
    upcomingSub: 'Vencen pronto',
    emptyUpcoming: 'No hay pagos recurrentes programados.',
    addFirst: 'Agregar pago fijo',
    viewAll: 'Gestionar pagos fijos',
    payNow: 'Pagar ahora',
    paid: 'Pagado',
    dueToday: 'Vence hoy',
    dueIn: { one: 'Vence en {n} día', other: 'Vence en {n} días' },
    overdue: { one: '{n} día de retraso', other: '{n} días de retraso' },
    monthlyDay: 'Día {day}',
    name: 'Nombre',
    namePh: 'Alquiler, Netflix, luz…',
    amount: 'Monto',
    day: 'Día de vencimiento (1-31)',
    category: 'Categoría',
    addBtn: 'Agregar pago fijo',
    empty: 'Todavía no hay pagos fijos registrados.',
    deleteAria: 'Borrar {name}',
    demoNote: 'Los pagos recurrentes de ejemplo se convierten en datos reales al pagarlos o crearlos.',
    alreadyPaid: '{name} ya está pagado este mes',
    paidToast: 'Pagado {name} ({amount})',
    addedToast: 'Agregado {name}',
    deleted: 'Pago fijo borrado',
    nameError: 'Escribe un nombre para el pago',
    amountError: 'Escribe un monto mayor que cero',
    dayError: 'Escribe un día válido del mes (1-31)'
  },
  goal: {
    title: 'Meta de ahorro',
    empty: 'Todavía no has definido una meta. Ponle nombre y monto a lo que quieres lograr, como un viaje, un auto o un fondo de emergencia.',
    define: 'Definir meta',
    defaultName: 'Mi meta',
    demoName: 'Fondo de emergencia',
    savedOf: '{saved} de {target}',
    left: 'Faltan {amount}',
    done: 'Meta cumplida.',
    eta: {
      one: 'Si ahorras como este mes, llegarás en {n} mes.',
      other: 'Si ahorras como este mes, llegarás en {n} meses.'
    },
    addPlaceholder: 'Monto a sumar',
    addBtn: 'Sumar a la meta',
    added: 'Sumaste {amount} a tu meta',
    amountError: 'Escribe un monto para sumar'
  },
  history: {
    title: 'Últimos 6 meses',
    sub: 'Ahorro de cada mes',
    income: 'Ingresos',
    expenses: 'Gastos'
  },
  list: {
    title: 'Movimientos',
    filterAll: 'Todo',
    filterExpenses: 'Gastos',
    filterIncome: 'Ingresos',
    filterMicro: 'Hormiga',
    emptyFilter: 'No hay movimientos con este filtro.',
    empty: 'Todavía no hay movimientos en este mes. Registra tu primer gasto arriba.',
    showMore: 'Mostrar más ({n})',
    deleteConfirm: '¿Borrar?',
    deleteAria: 'Borrar movimiento',
    confirmAria: 'Confirmar borrado',
    deleted: 'Movimiento borrado',
    microTag: 'hormiga',
    searchAria: 'Buscar movimientos',
    searchPlaceholder: 'Buscar por nota, categoría o fecha…',
    filtersAria: 'Filtrar movimientos',
    clearSearch: 'Limpiar búsqueda',
    editAria: 'Editar movimiento',
    editAmount: 'Monto',
    editNote: 'Nota',
    save: 'Guardar',
    cancel: 'Cancelar',
    updated: 'Movimiento actualizado',
    noResults: 'No hay movimientos que coincidan con «{query}».',
    recurringTag: 'recurrente'
  },
  settings: {
    title: 'Ajustes',
    currency: 'Moneda',
    currencyNote: 'Cambiar la moneda no convierte los montos que ya registraste.',
    language: 'Idioma',
    languageNote: 'La interfaz y el formato de los números se actualizan al instante.',
    savings: 'Ahorro',
    monthlyTarget: 'Meta de ahorro mensual',
    goalName: 'Meta grande (nombre)',
    goalNamePh: 'Viaje, auto, fondo de emergencia…',
    target: 'Objetivo',
    saved: 'Ya ahorrado',
    budgetTitle: 'Presupuesto mensual por categoría',
    nameLabel: 'Nombre',
    budgetLabel: 'Presupuesto de {name}',
    newCategory: 'Nueva categoría',
    add: 'Agregar',
    remove: 'Quitar {name}',
    data: 'Tus datos',
    exportJson: 'Exportar respaldo (.json)',
    importJson: 'Importar respaldo (.json)',
    exportCsv: 'Exportar movimientos del mes (.csv)',
    reset: 'Borrar todos los datos',
    resetConfirm: 'Toca otra vez para borrar todo',
    localNote: 'Tus datos se guardan solo en este dispositivo.',
    demoNote: 'Ahora ves datos de ejemplo. Para cargar tus presupuestos y tu meta, empieza desde cero.',
    atLeastOne: 'Debe quedar al menos una categoría',
    backupExported: 'Respaldo exportado',
    backupImported: 'Respaldo importado',
    backupInvalid: 'Ese archivo no es un respaldo válido de ClearWallet',
    csvExported: 'Archivo CSV exportado',
    exportFailed: 'No se pudo exportar el archivo',
    resetDone: 'Se borraron todos los datos',
    importConfirm: 'Importar reemplazará tus datos actuales. ¿Continuar?'
  },
  csv: {
    date: 'Fecha',
    type: 'Tipo',
    category: 'Categoría',
    note: 'Nota',
    amount: 'Monto',
    micro: 'Gasto hormiga',
    expense: 'Gasto',
    income: 'Ingreso',
    yes: 'Sí'
  },
  cat: {
    viv: 'Alquiler',
    srv: 'Servicios',
    sup: 'Supermercado',
    trn: 'Transporte',
    sal: 'Salud',
    ocio: 'Salidas y ocio',
    sus: 'Suscripciones',
    com: 'Compras',
    otr: 'Otros'
  },
  inc: { sueldo: 'Sueldo', free: 'Freelance', otri: 'Otros ingresos' },
  note: {
    salary: 'Sueldo',
    rent: 'Alquiler',
    utilities: 'Luz y agua',
    groceries: 'Supermercado',
    fuel: 'Combustible',
    coffee: 'Café',
    streaming: 'Streaming',
    snack: 'Aperitivo',
    market: 'Mercado y carnicería',
    dinner: 'Cena con amigos',
    shoes: 'Zapatillas',
    transit: 'Boletos',
    pharmacy: 'Farmacia',
    delivery: 'Reparto',
    game: 'Juego',
    gift: 'Regalo'
  },
  ui: {
    evolution: 'Evolución del mes',
    history: 'Historial de movimientos',
    goals: 'Metas de ahorro',
    preview: 'Icono detectado',
    colName: 'Nombre',
    colCategory: 'Categoría',
    colDate: 'Fecha',
    colAmount: 'Monto'
  },
  common: {
    today: 'Hoy',
    yesterday: 'Ayer',
    uncategorized: 'Sin categoría',
    incomeFallback: 'Ingreso',
    total: 'Total',
    currency: 'Moneda',
    language: 'Idioma',
    month: 'Mes',
    close: 'Cerrar'
  }
};

Object.assign(window.CWI18N.es.views, { debts: 'Deudas' });
Object.assign(window.CWI18N.es.kpi, { projection: 'Saldo proyectado' });
Object.assign(window.CWI18N.es, {
  projection: {
    title: 'Saldo proyectado a fin de mes',
    current: 'Saldo actual',
    income: 'Ingresos pendientes',
    expenses: 'Facturas fijas pendientes',
    left: '{n} facturas fijas pendientes',
    none: 'Todas las facturas fijas pagadas',
    hint: 'Saldo + ingresos − facturas pendientes'
  },
  compare: {
    title: 'Mes a mes',
    prev: 'vs. {month}',
    thisMonth: 'Este mes',
    prevMonth: 'Mes anterior',
    total: 'Gasto total',
    up: 'Mayores aumentos',
    down: 'Mayores bajadas',
    noData: 'Añade gastos en dos meses para comparar.',
    flat: 'Sin cambios'
  },
  debts: {
    title: 'Deudas y préstamos',
    sub: 'Controla quién debe qué',
    lent: 'Me deben',
    owed: 'Debo',
    person: 'Persona',
    personPh: 'Nombre',
    amount: 'Monto',
    currency: 'Moneda',
    note: 'Nota (opcional)',
    notePh: 'Nota opcional',
    add: 'Agregar entrada',
    settle: 'Liquidar',
    settled: 'Liquidado',
    settledToast: 'Liquidado con {name}',
    addedToast: 'Agregado {name}',
    deleted: 'Entrada borrada',
    empty: 'Todavía no hay deudas ni préstamos.',
    totalLent: 'Me deben',
    totalOwed: 'Debo',
    net: 'Neto',
    unconverted: '{n} sin tasa',
    deleteAria: 'Borrar {name}',
    nameError: 'Escribe un nombre',
    amountError: 'Escribe un monto mayor que cero',
    autoTx: 'Crear movimiento al liquidar',
    autoTxHint: 'Un préstamo liquidado se convierte en ingreso; una deuda liquidada, en gasto.',
    txNote: 'deuda liquidada',
    manage: 'Gestionar deudas'
  },
  fx: {
    title: 'Tipos de cambio manuales',
    note: 'Guardado en este dispositivo. Sin internet ni APIs.',
    from: 'De',
    to: 'A',
    rate: 'Tasa',
    ratePh: 'p. ej. 42,50',
    save: 'Guardar tasa',
    saved: 'Tasa guardada',
    invalid: 'Escribe una tasa mayor que cero',
    same: 'Elige dos monedas diferentes',
    list: 'Tasas guardadas',
    none: 'Todavía no hay tasas.',
    remove: 'Quitar {pair}',
    convertTitle: 'Conversor sin conexión',
    amount: 'Monto',
    convert: 'Convertir',
    result: '{amount} = {result}',
    missing: 'Primero define una tasa para este par.'
  }
});

Object.assign(window.CWI18N.es.views, { accounts: 'Cuentas' });
Object.assign(window.CWI18N.es.add, { accountLabel: 'Cuenta' });
Object.assign(window.CWI18N.es.list, { accountFilter: 'Cuenta', allAccounts: 'Todas las cuentas' });
Object.assign(window.CWI18N.es.csv, {
  account: 'Cuenta', currency: 'Moneda', original: 'Monto original', destination: 'Recibido en destino'
});
Object.assign(window.CWI18N.es, {
  accounts: {
    title: 'Cuentas y billeteras', sub: 'Saldos y transferencias internas',
    new: 'Nueva cuenta', edit: 'Editar cuenta', main: 'Cuenta principal',
    cash: 'Efectivo', bank: 'Banco', card: 'Tarjeta', savings: 'Ahorros', other: 'Otra', custom: 'Personalizada',
    unknown: 'Cuenta desconocida',
    name: 'Nombre de la cuenta', namePh: 'p. ej. Cuenta corriente, Efectivo',
    type: 'Tipo de cuenta', currency: 'Moneda', initial: 'Saldo inicial', color: 'Color',
    save: 'Guardar cuenta', formHint: 'El saldo inicial se suma a los movimientos de la cuenta. Las transferencias nunca se contabilizan como ingreso ni gasto.',
    nameError: 'Escribe un nombre para la cuenta', initialError: 'Escribe un saldo inicial válido',
    lastError: 'Necesitas al menos una cuenta', created: 'Cuenta creada', updated: 'Cuenta actualizada', deleted: 'Cuenta eliminada',
    editAria: 'Editar {name}', deleteAria: 'Eliminar {name}', deleteConfirm: '¿Eliminar?',
    total: 'Saldo consolidado', totalSub: '{n} cuentas',
    initialShort: 'Inicial', incomeShort: 'Ingresos', expensesShort: 'Gastos',
    unconverted: { one: '{n} cuenta sin tasa', other: '{n} cuentas sin tasa' },
    rateMissing: 'No hay tasa para esta moneda; se usa 1:1'
  },
  transfer: {
    title: 'Transferencia entre cuentas', short: 'Transferir', new: 'Nueva transferencia',
    from: 'Cuenta de origen', to: 'Cuenta de destino', amount: 'Monto', rate: 'Tasa de conversión', date: 'Fecha',
    note: 'Nota (opcional)', notePh: 'p. ej. ahorros, efectivo…', save: 'Transferir', cancel: 'Cancelar',
    hint: 'Mueve dinero entre tus cuentas. Nunca aparece como ingreso ni gasto.',
    rateHint: '1 {from} = tasa {to}', sameCurHint: 'Misma moneda: tasa fija en 1',
    history: 'Transferencias internas', listSub: 'No se contabilizan como ingreso ni gasto', empty: 'Todavía no hay transferencias.',
    needTwo: 'Crea al menos dos cuentas para transferir', sameError: 'Elige dos cuentas diferentes',
    amountError: 'Escribe un monto mayor que cero', rateError: 'Escribe una tasa mayor que cero',
    added: 'Transferencia agregada: {amount}', deleted: 'Transferencia eliminada', deleteAria: 'Eliminar transferencia',
    csvType: 'Transferencia', demoSavings: 'Ahorro mensual', demoCash: 'Recarga de efectivo'
  }
});

/* v1.6.0 — integridad multidivisa, abonos parciales y actualizaciones seguras */
Object.assign(window.CWI18N.es.csv, {
  originalAmount: 'Monto Original', originalCurrency: 'Moneda Original',
  convertedAmount: 'Monto Convertido', baseCurrency: 'Moneda Base'
});
Object.assign(window.CWI18N.es.settings, {
  currencyNote: 'Los importes, presupuestos, metas, deudas y cuentas existentes se convierten con tus tasas; si falta alguna, te la pediremos.',
  currencyRecalculated: 'Moneda cambiada y todos los importes recalculados.',
  currencyCancelled: 'Cambio cancelado: introduce la tasa de cambio que falta.'
});
Object.assign(window.CWI18N.es.accounts, {
  rateMissing: 'No hay tasa para esta moneda. Añádela en Ajustes → Tasas de cambio.',
  setRates: 'Configurar tasas faltantes'
});
Object.assign(window.CWI18N.es.add, { converted: '≈ {amount} en {base} (tasa {rate})' });
Object.assign(window.CWI18N.es.fx, {
  askRate: 'Introduce la tasa necesaria para guardar esta operación: 1 {from} = ? {to}',
  rateRequired: 'Introduce una tasa antes de guardar'
});
Object.assign(window.CWI18N.es.debts, {
  remaining: 'Pendiente', paidSoFar: 'Pagado', payments: 'Cuotas pagadas',
  paymentsEmpty: 'Todavía no hay cuotas registradas.',
  payInstallment: 'Abonar cuota', payAmount: 'Monto de la cuota',
  payAccount: 'Cuenta de la que sale / entra el dinero', payDate: 'Fecha del abono',
  payNote: 'Nota (opcional)', paySave: 'Registrar abono', payCancel: 'Cancelar',
  paymentAdded: 'Abono registrado: {amount}', paymentError: 'Escribe un monto mayor que cero',
  paymentTooHigh: 'El abono no puede superar el monto pendiente',
  paymentTxNote: 'abono de deuda', rateUsed: 'Tasa aplicada: 1 {from} = {rate} {to}',
  settleRemaining: 'Liquidar pendiente'
});
Object.assign(window.CWI18N.es.fx, { invalid: 'Introduce una tasa de cambio válida.' });
Object.assign(window.CWI18N.es, {
  update: {
    available: 'Hay una versión nueva disponible. Guarda tu trabajo y aplícala.',
    apply: 'Actualizar ahora',
    ready: 'Actualización lista. Guarda tu trabajo para aplicarla.',
    unsaved: 'Guarda o descarta tus cambios antes de actualizar.'
  }
});
