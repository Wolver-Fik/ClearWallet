window.CWI18N = window.CWI18N || {};
window.CWI18N.de = {
  'install.button': 'App installieren',
  'install.guideTitle': 'Auf iPhone oder iPad installieren',
  'install.step1': 'Tippen Sie in der Leiste von Safari auf das Symbol zum Teilen',
  'install.step2': 'Wählen Sie „Zum Home-Bildschirm hinzufügen“',
  'install.close': 'Schließen',
  'install.buttonAria': 'App auf diesem Gerät installieren',
  'install.closeAria': 'Installationsanleitung schließen',
  code: 'de',
  name: 'Deutsch',
  locale: 'de-DE',
  app: { tagline: 'Persönliche Finanzen' },
  views: {
    group: 'Ansichten',
    overview: 'Übersicht',
    movements: 'Bewegungen',
    fixed: 'Feste Zahlungen',
    goals: 'Ziele'
  },
  kpi: {
    group: 'Monatsübersicht',
    balance: 'Verfügbares Guthaben',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    micro: 'Kleinstausgaben',
    vsPrev: 'ggü. Vormonat',
    noPrev: 'keine Vormonatsdaten'
  },
  header: {
    prevMonth: 'Vorheriger Monat',
    nextMonth: 'Nächster Monat',
    currentMonth: 'Zum aktuellen Monat zurückkehren',
    settings: 'Einstellungen'
  },
  type: { expense: 'Ausgabe', income: 'Einnahme', group: 'Art der Transaktion' },
  add: {
    title: 'Transaktion hinzufügen',
    amountLabel: 'Betrag',
    noteLabel: 'Notiz',
    notePlaceholder: 'Notiz (optional): Einkauf, Kaffee…',
    notePlaceholderIncome: 'Notiz (optional): Gehalt, Nebenjob…',
    dateLabel: 'Datum',
    categoryLabel: 'Kategorie',
    micro: 'Kleine Ausgaben',
    microTitle: 'Kleine, häufige Einkäufe',
    microHint: 'Mikro: kleine, wiederkehrende Einkäufe wie Kaffee, Snacks oder Lieferungen. Sie werden separat erfasst, damit du siehst, wie viel sie ausmachen.',
    expenseBtn: 'Ausgabe hinzufügen',
    incomeBtn: 'Einnahme hinzufügen',
    addedExpense: 'Ausgabe hinzugefügt: −{amount}',
    addedIncome: 'Einnahme hinzugefügt: +{amount}',
    addedInMonth: '{msg} · {month}',
    amountError: 'Gib einen Betrag größer als null ein',
    categoryError: 'Wähle eine Kategorie'
  },
  demo: {
    title: 'Dies sind Beispieldaten.',
    body: 'Wähle deine Währung und starte bei null, oder füge deine erste Transaktion hinzu – die Beispieldaten verschwinden dann.',
    start: 'Bei null starten',
    ready: 'Fertig — füge jetzt deine Transaktionen hinzu',
    load: 'Beispieldaten laden (Demo)',
    loaded: 'Beispieldaten geladen'
  },
  hero: {
    title: 'Diesen Monat verfügbar',
    income: 'Einnahmen',
    expenses: 'Ausgaben',
    savings: 'Ersparnis',
    micro: 'Kleine Ausgaben',
    records: { one: '{n} Eintrag', other: '{n} Einträge' },
    purchases: { one: '{n} Einkauf', other: '{n} Einkäufe' },
    ofExpenses: '{pct} der Ausgaben',
    ofTarget: '{pct} des Ziels von {amount}',
    ofIncome: '{pct} deiner Einnahmen',
    noTarget: 'Kein Ziel festgelegt',
    dayOf: 'Tag {day} von {dim}',
    noTxCurrent: 'Du hast diesen Monat noch nichts eingetragen.',
    noTxPast: 'In diesem Monat gibt es keine Transaktionen.',
    future: 'Geplant: {amount} an Ausgaben.',
    setBudget: 'Lege in den Einstellungen ein Budget pro Kategorie fest, um zu sehen, wie du liegst.',
    pastUnder: 'Du hast {amount} unter dem Budget abgeschlossen.',
    pastOver: 'Du hast das Budget um {amount} überschritten.',
    overBudget: 'Du hast das Budget um {amount} überschritten.',
    onTrack: 'Auf Kurs: {spent} des Budgets ausgegeben und {time} des Monats vergangen.',
    caution: 'Achtung: {spent} des Budgets ausgegeben, aber {time} des Monats vergangen.',
    overspending: 'Zu viel ausgegeben: {spent} des Budgets ausgegeben, aber {time} des Monats vergangen.',
    perDay: 'Du kannst bis Monatsende etwa {amount} pro Tag ausgeben.',
    noMargin: 'Kein Spielraum mehr für den Rest des Monats{goal}.',
    goalSuffix: ', inklusive deines Sparziels',
    spentOf: '{spent} von {budget} ausgegeben',
    spentOnly: '{spent} ausgegeben'
  },
  donut: {
    title: 'Ausgaben nach Kategorie',
    empty: 'In diesem Monat sind noch keine Ausgaben erfasst.',
    aria: 'Ringdiagramm mit der Verteilung der Ausgaben nach Kategorie',
    totalLabel: 'Gesamtausgaben',
    categories: { one: '{n} Kategorie', other: '{n} Kategorien' },
    transactions: { one: '{n} Buchung', other: '{n} Buchungen' },
    txCount: { one: '{n} Buchung', other: '{n} Buchungen' }
  },
  budgets: {
    title: 'Budget nach Kategorie',
    total: 'Gesamt',
    over: '{amount} darüber',
    left: 'Es bleiben {amount}',
    noBudget: 'Kein Budget',
    noTx: 'Keine Transaktionen',
    hint: 'Lege in den Einstellungen fest, wie viel du in jeder Kategorie ausgeben möchtest.'
  },
  pace: {
    title: 'Ausgabentempo',
    sub: 'Kumuliert im Monat',
    empty: 'Sobald du Ausgaben hinzufügst, siehst du hier, ob der Monat schneller voranschreitet als dein Budget.',
    over: 'Beim aktuellen Tempo schließt du den Monat bei {amount} ab, etwa {over} über deinem Budget.',
    within: 'Beim aktuellen Tempo schließt du den Monat bei {amount} ab, innerhalb deines Budgets.',
    only: 'Beim aktuellen Tempo schließt du den Monat bei {amount} Ausgaben ab.',
    legendCum: 'Kumulierte Ausgaben',
    legendPace: 'Budget-Tempo',
    legendProj: 'Prognose',
    aria: 'Kumulierte Ausgaben pro Tag des Monats im Vergleich zum Budget-Tempo',
    tooltipTotal: '{amount} kumuliert',
    tooltipDay: '+{amount} an diesem Tag'
  },
  fixed: {
    income: {
      paid: 'Zahlung eingegangen',
      dueToday: 'Zahlungseingang heute erwartet',
      dueIn: { one: 'Zahlungseingang in {n} Tag erwartet', other: 'Zahlungseingang in {n} Tagen erwartet' },
      overdue: { one: 'Zahlungseingang ausstehend ({n} Tag)', other: 'Zahlungseingang ausstehend ({n} Tage)' }
    },
    title: 'Feste und wiederkehrende Zahlungen',
    sub: 'Abonnements, Miete, Versorgung',
    upcomingTitle: 'Anstehende Fälligkeiten',
    upcomingSub: 'Demnächst fällig',
    emptyUpcoming: 'Keine wiederkehrenden Zahlungen geplant.',
    addFirst: 'Feste Zahlung hinzufügen',
    viewAll: 'Feste Zahlungen verwalten',
    payNow: 'Jetzt bezahlen',
    paid: 'Bezahlt',
    dueToday: 'Heute fällig',
    dueIn: { one: 'Fällig in {n} Tag', other: 'Fällig in {n} Tagen' },
    overdue: { one: '{n} Tag überfällig', other: '{n} Tage überfällig' },
    monthlyDay: 'Tag {day}',
    name: 'Name',
    namePh: 'Miete, Netflix, Strom…',
    amount: 'Betrag',
    day: 'Fälligkeitstag (1-31)',
    category: 'Kategorie',
    addBtn: 'Feste Zahlung hinzufügen',
    empty: 'Noch keine festen Zahlungen erfasst.',
    deleteAria: '{name} löschen',
    demoNote: 'Beispielhafte wiederkehrende Zahlungen werden beim Bezahlen oder Anlegen zu echten Daten.',
    alreadyPaid: '{name} ist in diesem Monat bereits bezahlt',
    paidToast: '{name} bezahlt ({amount})',
    addedToast: '{name} hinzugefügt',
    deleted: 'Feste Zahlung gelöscht',
    nameError: 'Bitte einen Namen für die Zahlung eingeben',
    amountError: 'Bitte einen Betrag größer als null eingeben',
    dayError: 'Bitte einen gültigen Tag des Monats eingeben (1-31)'
  },
  goal: {
    title: 'Sparziel',
    empty: 'Du hast noch kein Ziel festgelegt. Gib dem, was du erreichen möchtest, einen Namen und einen Betrag – zum Beispiel eine Reise, ein Auto oder einen Notgroschen.',
    define: 'Ziel festlegen',
    defaultName: 'Mein Ziel',
    demoName: 'Notgroschen',
    savedOf: '{saved} von {target}',
    left: 'Es fehlen {amount}',
    done: 'Ziel erreicht.',
    eta: {
      one: 'Wenn du so sparst wie in diesem Monat, erreichst du es in {n} Monat.',
      other: 'Wenn du so sparst wie in diesem Monat, erreichst du es in {n} Monaten.'
    },
    addPlaceholder: 'Betrag zum Hinzufügen',
    addBtn: 'Zum Ziel hinzufügen',
    added: 'Du hast {amount} zu deinem Ziel hinzugefügt',
    amountError: 'Gib einen Betrag zum Hinzufügen ein'
  },
  history: {
    title: 'Letzte 6 Monate',
    sub: 'Ersparnis pro Monat',
    income: 'Einnahmen',
    expenses: 'Ausgaben'
  },
  list: {
    title: 'Transaktionen',
    filterAll: 'Alle',
    filterExpenses: 'Ausgaben',
    filterIncome: 'Einnahmen',
    filterMicro: 'Kleine',
    emptyFilter: 'Keine Transaktionen passen zu diesem Filter.',
    empty: 'In diesem Monat gibt es noch keine Transaktionen. Füge oben deine erste Ausgabe hinzu.',
    showMore: 'Mehr anzeigen ({n})',
    deleteConfirm: 'Löschen?',
    deleteAria: 'Transaktion löschen',
    confirmAria: 'Löschen bestätigen',
    deleted: 'Transaktion gelöscht',
    microTag: 'klein',
    searchAria: 'Bewegungen suchen',
    searchPlaceholder: 'Suche: Notiz, Kategorie, Datum…',
    filtersAria: 'Bewegungen filtern',
    clearSearch: 'Suche löschen',
    editAria: 'Bewegung bearbeiten',
    editAmount: 'Betrag',
    editNote: 'Notiz',
    save: 'Speichern',
    cancel: 'Abbrechen',
    updated: 'Bewegung aktualisiert',
    noResults: 'Keine Bewegungen entsprechen „{query}“.',
    recurringTag: 'wiederkehrend'
  },
  settings: {
    title: 'Einstellungen',
    currency: 'Währung',
    currencyNote: 'Das Ändern der Währung rechnet bereits eingetragene Beträge nicht um.',
    language: 'Sprache',
    languageNote: 'Die Oberfläche und das Zahlenformat werden sofort aktualisiert.',
    savings: 'Ersparnis',
    monthlyTarget: 'Monatliches Sparziel',
    goalName: 'Hauptziel (Name)',
    goalNamePh: 'Reise, Auto, Notgroschen…',
    target: 'Zielbetrag',
    saved: 'Bereits gespart',
    budgetTitle: 'Monatliches Budget nach Kategorie',
    nameLabel: 'Name',
    budgetLabel: 'Budget für {name}',
    newCategory: 'Neue Kategorie',
    add: 'Hinzufügen',
    remove: '{name} entfernen',
    data: 'Deine Daten',
    exportJson: 'Backup exportieren (.json)',
    importJson: 'Backup importieren (.json)',
    exportCsv: 'Transaktionen des Monats exportieren (.csv)',
    reset: 'Alle Daten löschen',
    resetConfirm: 'Tippe erneut, um alles zu löschen',
    localNote: 'Deine Daten werden nur auf diesem Gerät gespeichert.',
    demoNote: 'Du siehst Beispieldaten. Um Budgets und Ziel hinzuzufügen, starte bei null.',
    atLeastOne: 'Mindestens eine Kategorie ist erforderlich',
    backupExported: 'Backup exportiert',
    backupImported: 'Backup importiert',
    backupInvalid: 'Diese Datei ist kein gültiges ClearWallet-Backup',
    csvExported: 'CSV-Datei exportiert',
    exportFailed: 'Die Datei konnte nicht exportiert werden',
    resetDone: 'Alle Daten wurden gelöscht',
    importConfirm: 'Der Import ersetzt deine aktuellen Daten. Fortfahren?'
  },
  csv: {
    date: 'Datum',
    type: 'Art',
    category: 'Kategorie',
    note: 'Notiz',
    amount: 'Betrag',
    micro: 'Kleine Ausgabe',
    expense: 'Ausgabe',
    income: 'Einnahme',
    yes: 'Ja'
  },
  cat: {
    viv: 'Miete',
    srv: 'Nebenkosten',
    sup: 'Lebensmittel',
    trn: 'Transport',
    sal: 'Gesundheit',
    ocio: 'Freizeit',
    sus: 'Abos',
    com: 'Einkäufe',
    otr: 'Sonstiges'
  },
  inc: { sueldo: 'Gehalt', free: 'Freelance', otri: 'Sonstige Einnahmen' },
  note: {
    salary: 'Gehalt',
    rent: 'Miete',
    utilities: 'Strom und Wasser',
    groceries: 'Lebensmittel',
    fuel: 'Kraftstoff',
    coffee: 'Kaffee',
    streaming: 'Streaming',
    snack: 'Snack',
    market: 'Markt und Metzgerei',
    dinner: 'Abendessen mit Freunden',
    shoes: 'Turnschuhe',
    transit: 'Fahrkarten',
    pharmacy: 'Apotheke',
    delivery: 'Lieferung',
    game: 'Spiel',
    gift: 'Geschenk'
  },
  ui: {
    evolution: 'Monatsentwicklung',
    history: 'Bewegungsverlauf',
    goals: 'Sparziele',
    preview: 'Erkanntes Symbol',
    colName: 'Name',
    colCategory: 'Kategorie',
    colDate: 'Datum',
    colAmount: 'Betrag'
  },
  common: {
    today: 'Heute',
    yesterday: 'Gestern',
    uncategorized: 'Ohne Kategorie',
    incomeFallback: 'Einnahme',
    total: 'Gesamt',
    currency: 'Währung',
    language: 'Sprache',
    month: 'Monat',
    close: 'Schließen'
  }
};

Object.assign(window.CWI18N.de.views, { debts: 'Schulden' });
Object.assign(window.CWI18N.de.kpi, { projection: 'Prognosesaldo' });
Object.assign(window.CWI18N.de, {
  projection: {
    title: 'Prognosesaldo zum Monatsende',
    current: 'Aktueller Saldo',
    income: 'Ausstehende Einnahmen',
    expenses: 'Ausstehende Fixkosten',
    left: 'Noch {n} Fixkosten offen',
    none: 'Alle Fixkosten bezahlt',
    hint: 'Saldo + Einnahmen − offene Kosten'
  },
  compare: {
    title: 'Monat für Monat',
    prev: 'vs. {month}',
    thisMonth: 'Dieser Monat',
    prevMonth: 'Vormonat',
    total: 'Gesamtausgaben',
    up: 'Größte Anstiege',
    down: 'Größte Rückgänge',
    noData: 'Füge in zwei Monaten Ausgaben hinzu, um zu vergleichen.',
    flat: 'Keine Änderung'
  },
  debts: {
    title: 'Schulden und Kredite',
    sub: 'Behalte im Blick, wer wem schuldet',
    lent: 'Sie schulden mir',
    owed: 'Ich schulde',
    person: 'Person',
    personPh: 'Name',
    amount: 'Betrag',
    currency: 'Währung',
    note: 'Notiz (optional)',
    notePh: 'Optionale Notiz',
    add: 'Eintrag hinzufügen',
    settle: 'Begleichen',
    settled: 'Beglichen',
    settledToast: 'Beglichen mit {name}',
    addedToast: '{name} hinzugefügt',
    deleted: 'Eintrag gelöscht',
    empty: 'Noch keine Schulden oder Kredite.',
    totalLent: 'Mir geschuldet',
    totalOwed: 'Ich schulde',
    net: 'Netto',
    unconverted: '{n} ohne Kurs',
    deleteAria: '{name} löschen',
    nameError: 'Bitte einen Namen eingeben',
    amountError: 'Bitte einen Betrag größer als null eingeben',
    autoTx: 'Buchung beim Begleichen erstellen',
    autoTxHint: 'Ein beglichener Kredit wird zur Einnahme, eine beglichene Schuld zur Ausgabe.',
    txNote: 'beglichene Schuld',
    manage: 'Schulden verwalten'
  },
  fx: {
    title: 'Manuelle Wechselkurse',
    note: 'Auf diesem Gerät gespeichert. Kein Internet, keine APIs.',
    from: 'Von',
    to: 'Nach',
    rate: 'Kurs',
    ratePh: 'z. B. 42,50',
    save: 'Kurs speichern',
    saved: 'Kurs gespeichert',
    invalid: 'Bitte einen Kurs größer als null eingeben',
    same: 'Wähle zwei verschiedene Währungen',
    list: 'Gespeicherte Kurse',
    none: 'Noch keine Kurse.',
    remove: '{pair} entfernen',
    convertTitle: 'Offline-Rechner',
    amount: 'Betrag',
    convert: 'Umrechnen',
    result: '{amount} = {result}',
    missing: 'Lege zuerst einen Kurs für dieses Paar fest.'
  }
});

Object.assign(window.CWI18N.de.views, { accounts: 'Konten' });
Object.assign(window.CWI18N.de.add, { accountLabel: 'Konto' });
Object.assign(window.CWI18N.de.list, { accountFilter: 'Konto', allAccounts: 'Alle Konten' });
Object.assign(window.CWI18N.de.csv, {
  account: 'Konto', currency: 'Währung', original: 'Ursprünglicher Betrag', destination: 'Am Ziel erhalten'
});
Object.assign(window.CWI18N.de, {
  accounts: {
    title: 'Konten und Geldbörsen', sub: 'Salden und interne Überweisungen',
    new: 'Neues Konto', edit: 'Konto bearbeiten', main: 'Hauptkonto',
    cash: 'Bargeld', bank: 'Bank', card: 'Karte', savings: 'Ersparnisse', other: 'Sonstiges', custom: 'Benutzerdefiniert',
    unknown: 'Unbekanntes Konto',
    name: 'Kontoname', namePh: 'z. B. Girokonto, Bargeld',
    type: 'Kontotyp', currency: 'Währung', initial: 'Anfangssaldo', color: 'Farbe',
    save: 'Konto speichern', formHint: 'Der Anfangssaldo wird zu den Bewegungen des Kontos addiert. Überweisungen zählen nie als Einnahme oder Ausgabe.',
    nameError: 'Bitte einen Kontonamen eingeben', initialError: 'Bitte einen gültigen Anfangssaldo eingeben',
    lastError: 'Mindestens ein Konto ist erforderlich', created: 'Konto erstellt', updated: 'Konto aktualisiert', deleted: 'Konto gelöscht',
    editAria: '{name} bearbeiten', deleteAria: '{name} löschen', deleteConfirm: 'Löschen?',
    total: 'Gesamtsaldo', totalSub: '{n} Konten',
    initialShort: 'Anfang', incomeShort: 'Einnahmen', expensesShort: 'Ausgaben',
    unconverted: { one: '{n} Konto ohne Kurs', other: '{n} Konten ohne Kurs' },
    rateMissing: 'Kein Kurs für diese Währung; 1:1 verwendet'
  },
  transfer: {
    title: 'Überweisung zwischen Konten', short: 'Überweisen', new: 'Neue Überweisung',
    from: 'Quellkonto', to: 'Zielkonto', amount: 'Betrag', rate: 'Wechselkurs', date: 'Datum',
    note: 'Notiz (optional)', notePh: 'z. B. Ersparnisse, Bargeld…', save: 'Überweisen', cancel: 'Abbrechen',
    hint: 'Verschiebt Geld zwischen deinen Konten. Wird nie als Einnahme oder Ausgabe gezählt.',
    rateHint: '1 {from} = Kurs {to}', sameCurHint: 'Gleiche Währung: Kurs fest auf 1',
    history: 'Interne Überweisungen', listSub: 'Nicht als Einnahmen oder Ausgaben gezählt', empty: 'Noch keine Überweisungen.',
    needTwo: 'Erstelle mindestens zwei Konten zum Überweisen', sameError: 'Wähle zwei verschiedene Konten',
    amountError: 'Bitte einen Betrag größer als null eingeben', rateError: 'Bitte einen Kurs größer als null eingeben',
    added: 'Überweisung hinzugefügt: {amount}', deleted: 'Überweisung gelöscht', deleteAria: 'Überweisung löschen',
    csvType: 'Überweisung', demoSavings: 'Monatliche Ersparnisse', demoCash: 'Bargeldauffüllung'
  }
});

/* v1.6.0 — Integrität bei mehreren Währungen, Teilzahlungen und sichere Updates */
Object.assign(window.CWI18N.de.csv, {
  originalAmount: 'Ursprünglicher Betrag', originalCurrency: 'Ursprüngliche Währung',
  convertedAmount: 'Umgerechneter Betrag', baseCurrency: 'Basiswährung'
});
Object.assign(window.CWI18N.de.settings, {
  currencyNote: 'Bestehende Beträge, Budgets, Ziele, Schulden und Konten werden mit deinen Kursen umgerechnet; fehlende Kurse werden abgefragt.',
  currencyRecalculated: 'Währung geändert und alle Beträge neu berechnet.',
  currencyCancelled: 'Änderung abgebrochen: bitte den fehlenden Wechselkurs eingeben.'
});
Object.assign(window.CWI18N.de.accounts, {
  rateMissing: 'Kein Kurs für diese Währung. Bitte in Einstellungen → Wechselkurse ergänzen.',
  setRates: 'Fehlende Kurse festlegen'
});
Object.assign(window.CWI18N.de.add, { converted: '≈ {amount} in {base} (Kurs {rate})' });
Object.assign(window.CWI18N.de.fx, {
  askRate: 'Bitte den Kurs eingeben, um diese Buchung zu speichern: 1 {from} = ? {to}',
  rateRequired: 'Bitte vor dem Speichern einen Kurs eingeben'
});
Object.assign(window.CWI18N.de.debts, {
  remaining: 'Offen', paidSoFar: 'Bezahlt', payments: 'Geleistete Raten',
  paymentsEmpty: 'Noch keine Raten erfasst.',
  payInstallment: 'Rate zahlen', payAmount: 'Ratenbetrag',
  payAccount: 'Konto, von dem das Geld kommt / auf das es geht', payDate: 'Zahlungsdatum',
  payNote: 'Notiz (optional)', paySave: 'Rate erfassen', payCancel: 'Abbrechen',
  paymentAdded: 'Rate erfasst: {amount}', paymentError: 'Bitte einen Betrag über null eingeben',
  paymentTooHigh: 'Die Rate darf den offenen Betrag nicht überschreiten',
  paymentTxNote: 'Schuldentilgung', rateUsed: 'Angewendeter Kurs: 1 {from} = {rate} {to}',
  settleRemaining: 'Restbetrag begleichen'
});
Object.assign(window.CWI18N.de.fx, { invalid: 'Bitte einen gültigen Wechselkurs eingeben.' });
Object.assign(window.CWI18N.de, {
  update: {
    available: 'Eine neue Version ist verfügbar. Speichere deine Arbeit und wende sie an.',
    apply: 'Jetzt aktualisieren',
    ready: 'Update bereit. Speichere deine Arbeit, um es anzuwenden.',
    unsaved: 'Speichere oder verwerfe deine Änderungen vor dem Aktualisieren.'
  }
});
