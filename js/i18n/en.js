window.CWI18N = window.CWI18N || {};
window.CWI18N.en = {
  'install.button': 'Install app',
  'install.guideTitle': 'Install on iPhone or iPad',
  'install.step1': 'Tap the Share icon in Safari’s toolbar',
  'install.step2': 'Choose “Add to Home Screen”',
  'install.close': 'Close',
  'install.buttonAria': 'Install app on this device',
  'install.closeAria': 'Close installation guide',
  code: 'en',
  name: 'English',
  locale: 'en-US',
  app: { tagline: 'Personal finance' },
  views: {
    group: 'Views',
    overview: 'Overview',
    movements: 'Movements',
    fixed: 'Fixed Payments',
    goals: 'Goals'
  },
  kpi: {
    group: 'Monthly Summary',
    balance: 'Available Balance',
    income: 'Income',
    expenses: 'Expenses',
    micro: 'Micro Expenses',
    vsPrev: 'vs prev month',
    noPrev: 'no prev data'
  },
  header: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    currentMonth: 'Back to current month',
    settings: 'Settings'
  },
  type: { expense: 'Expense', income: 'Income', group: 'Transaction type' },
  add: {
    title: 'Add transaction',
    amountLabel: 'Amount',
    noteLabel: 'Note',
    notePlaceholder: 'Note (optional): groceries, coffee…',
    notePlaceholderIncome: 'Note (optional): salary, freelance…',
    dateLabel: 'Date',
    categoryLabel: 'Category',
    micro: 'Small expenses',
    microTitle: 'Small, frequent purchases',
    microHint: 'Micro: small, repeated purchases such as coffee, snacks or delivery. They are tracked separately so you can see how much they add up to.',
    expenseBtn: 'Add expense',
    incomeBtn: 'Add income',
    addedExpense: 'Expense added: −{amount}',
    addedIncome: 'Income added: +{amount}',
    addedInMonth: '{msg} · {month}',
    amountError: 'Enter an amount greater than zero',
    categoryError: 'Choose a category'
  },
  demo: {
    title: 'This is sample data.',
    body: 'Choose your currency and start from scratch, or add your first transaction and the sample data disappears.',
    start: 'Start from scratch',
    ready: 'Done — start adding your transactions',
    load: 'Load sample data (Demo)',
    loaded: 'Sample data loaded'
  },
  hero: {
    title: 'Available this month',
    income: 'Income',
    expenses: 'Expenses',
    savings: 'Savings',
    micro: 'Small expenses',
    records: { one: '{n} entry', other: '{n} entries' },
    purchases: { one: '{n} purchase', other: '{n} purchases' },
    ofExpenses: '{pct} of spending',
    ofTarget: '{pct} of the {amount} goal',
    ofIncome: '{pct} of your income',
    noTarget: 'No target set',
    dayOf: 'Day {day} of {dim}',
    noTxCurrent: 'You have not added anything this month yet.',
    noTxPast: 'There are no transactions in this month.',
    future: 'Planned: {amount} in expenses.',
    setBudget: 'Set a budget per category in Settings to see how you are doing.',
    pastUnder: 'You finished {amount} under budget.',
    pastOver: 'You went {amount} over budget.',
    overBudget: 'You went over budget by {amount}.',
    onTrack: 'On track: {spent} of the budget spent and {time} of the month gone.',
    caution: 'Careful: {spent} of the budget spent with {time} of the month gone.',
    overspending: 'Overspending: {spent} of the budget spent with {time} of the month gone.',
    perDay: 'You can spend about {amount} per day until the end of the month.',
    noMargin: 'No margin left for the rest of the month{goal}.',
    goalSuffix: ', counting your savings target',
    spentOf: 'Spent {spent} of {budget}',
    spentOnly: 'Spent {spent}'
  },
  budgets: {
    title: 'Budget by category',
    total: 'Total',
    over: '{amount} over',
    left: '{amount} left',
    noBudget: 'No budget',
    noTx: 'No transactions',
    hint: 'Set how much you want to spend in each category in Settings.'
  },
  donut: {
    title: 'Expenses by Category',
    empty: 'No expenses recorded in this month yet.',
    aria: 'Donut chart showing expense distribution by category',
    totalLabel: 'Total Spent',
    categories: { one: '{n} category', other: '{n} categories' },
    transactions: { one: '{n} transaction', other: '{n} transactions' },
    txCount: { one: '{n} tx', other: '{n} txs' }
  },
  pace: {
    title: 'Spending pace',
    sub: 'Month to date',
    empty: 'Once you add expenses, you will see here whether the month is moving faster than your budget.',
    over: 'At the current pace you will close the month at {amount}, about {over} over your budget.',
    within: 'At the current pace you will close the month at {amount}, within your budget.',
    only: 'At the current pace you will close the month at {amount} in spending.',
    legendCum: 'Cumulative spending',
    legendPace: 'Budget pace',
    legendProj: 'Projection',
    aria: 'Cumulative spending by day of month against the budget pace',
    tooltipTotal: '{amount} total',
    tooltipDay: '+{amount} on this day'
  },
  fixed: {
    income: {
      paid: 'Received',
      dueToday: 'Expected today',
      dueIn: { one: 'Expected in {n} day', other: 'Expected in {n} days' },
      overdue: { one: 'Pending receipt ({n} day)', other: 'Pending receipt ({n} days)' }
    },
    title: 'Fixed & Recurring Payments',
    sub: 'Subscriptions, rent, utilities',
    upcomingTitle: 'Upcoming Payments',
    upcomingSub: 'Due soon',
    emptyUpcoming: 'No recurring payments scheduled.',
    addFirst: 'Add a fixed payment',
    viewAll: 'Manage fixed payments',
    payNow: 'Pay now',
    paid: 'Paid',
    dueToday: 'Due today',
    dueIn: { one: 'Due in {n} day', other: 'Due in {n} days' },
    overdue: { one: '{n} day overdue', other: '{n} days overdue' },
    monthlyDay: 'Day {day}',
    name: 'Name',
    namePh: 'Rent, Netflix, Electricity…',
    amount: 'Amount',
    day: 'Due day (1-31)',
    category: 'Category',
    addBtn: 'Add fixed payment',
    empty: 'No fixed payments registered yet.',
    deleteAria: 'Delete {name}',
    demoNote: 'Sample recurring payments will convert to real data when paid or created.',
    alreadyPaid: '{name} is already paid for this month',
    paidToast: 'Paid {name} ({amount})',
    addedToast: 'Added {name}',
    deleted: 'Fixed payment deleted',
    nameError: 'Enter a payment name',
    amountError: 'Enter an amount greater than zero',
    dayError: 'Enter a valid day of the month (1-31)'
  },
  goal: {
    title: 'Savings goal',
    empty: 'You have not set a goal yet. Give a name and an amount to what you want to achieve, such as a trip, a car or an emergency fund.',
    define: 'Set goal',
    defaultName: 'My goal',
    demoName: 'Emergency fund',
    savedOf: '{saved} of {target}',
    left: '{amount} left',
    done: 'Goal reached.',
    eta: {
      one: 'At this month’s saving rate, you will get there in {n} month.',
      other: 'At this month’s saving rate, you will get there in {n} months.'
    },
    addPlaceholder: 'Amount to add',
    addBtn: 'Add to goal',
    added: 'Added {amount} to your goal',
    amountError: 'Enter an amount to add'
  },
  history: {
    title: 'Last 6 months',
    sub: 'Savings per month',
    income: 'Income',
    expenses: 'Expenses'
  },
  list: {
    title: 'Transactions',
    filterAll: 'All',
    filterExpenses: 'Expenses',
    filterIncome: 'Income',
    filterMicro: 'Small',
    emptyFilter: 'No transactions match this filter.',
    empty: 'There are no transactions in this month yet. Add your first expense above.',
    showMore: 'Show more ({n})',
    deleteConfirm: 'Delete?',
    deleteAria: 'Delete transaction',
    confirmAria: 'Confirm deletion',
    deleted: 'Transaction deleted',
    microTag: 'small',
    clearSearch: 'Clear search',
    editAria: 'Edit transaction',
    editAmount: 'Amount',
    editNote: 'Note',
    save: 'Save',
    cancel: 'Cancel',
    updated: 'Transaction updated',
    noResults: 'No transactions matching "{query}".',
    recurringTag: 'recurring',
    searchAria: 'Search transactions',
    searchPlaceholder: 'Search by note, category or date…',
    filtersAria: 'Filter transactions'
  },
  settings: {
    title: 'Settings',
    currency: 'Currency',
    currencyNote: 'Changing the currency does not convert amounts you have already added.',
    language: 'Language',
    languageNote: 'The interface and number formatting update immediately.',
    savings: 'Savings',
    monthlyTarget: 'Monthly savings target',
    goalName: 'Main goal (name)',
    goalNamePh: 'Trip, car, emergency fund…',
    target: 'Target',
    saved: 'Already saved',
    budgetTitle: 'Monthly budget by category',
    nameLabel: 'Name',
    budgetLabel: 'Budget for {name}',
    newCategory: 'New category',
    add: 'Add',
    remove: 'Remove {name}',
    data: 'Your data',
    exportJson: 'Export backup (.json)',
    importJson: 'Import backup (.json)',
    exportCsv: 'Export this month’s transactions (.csv)',
    reset: 'Delete all data',
    resetConfirm: 'Tap again to delete everything',
    localNote: 'Your data is stored only on this device.',
    demoNote: 'You are viewing sample data. To add your budgets and goal, start from scratch.',
    atLeastOne: 'At least one category is required',
    backupExported: 'Backup exported',
    backupImported: 'Backup imported',
    backupInvalid: 'That file is not a valid ClearWallet backup',
    csvExported: 'CSV file exported',
    exportFailed: 'Could not export the file',
    resetDone: 'All data deleted',
    importConfirm: 'Importing will replace your current data. Continue?'
  },
  csv: {
    date: 'Date',
    type: 'Type',
    category: 'Category',
    note: 'Note',
    amount: 'Amount',
    micro: 'Small expense',
    expense: 'Expense',
    income: 'Income',
    yes: 'Yes'
  },
  cat: {
    viv: 'Rent',
    srv: 'Utilities',
    sup: 'Groceries',
    trn: 'Transport',
    sal: 'Health',
    ocio: 'Leisure',
    sus: 'Subscriptions',
    com: 'Shopping',
    otr: 'Other'
  },
  inc: { sueldo: 'Salary', free: 'Freelance', otri: 'Other income' },
  note: {
    salary: 'Salary',
    rent: 'Rent',
    utilities: 'Electricity and water',
    groceries: 'Groceries',
    fuel: 'Fuel',
    coffee: 'Coffee',
    streaming: 'Streaming',
    snack: 'Snack',
    market: 'Market and butcher',
    dinner: 'Dinner with friends',
    shoes: 'Sneakers',
    transit: 'Transit tickets',
    pharmacy: 'Pharmacy',
    delivery: 'Delivery',
    game: 'Game',
    gift: 'Gift'
  },
  ui: {
    evolution: 'Month evolution',
    history: 'Movement history',
    goals: 'Savings goals',
    preview: 'Detected icon',
    colName: 'Name',
    colCategory: 'Category',
    colDate: 'Date',
    colAmount: 'Amount'
  },
  common: {
    today: 'Today',
    yesterday: 'Yesterday',
    uncategorized: 'Uncategorized',
    incomeFallback: 'Income',
    total: 'Total',
    currency: 'Currency',
    language: 'Language',
    month: 'Month',
    close: 'Close'
  }
};

Object.assign(window.CWI18N.en.views, { debts: 'Debts' });
Object.assign(window.CWI18N.en.kpi, { projection: 'Projected balance' });
Object.assign(window.CWI18N.en, {
  projection: {
    title: 'Projected month-end balance',
    current: 'Current balance',
    income: 'Pending income',
    expenses: 'Pending fixed bills',
    left: '{n} fixed bills left',
    none: 'All fixed bills paid',
    hint: 'Balance + income − pending bills'
  },
  compare: {
    title: 'Month over month',
    prev: 'vs {month}',
    thisMonth: 'This month',
    prevMonth: 'Last month',
    total: 'Total spending',
    up: 'Biggest increases',
    down: 'Biggest drops',
    noData: 'Add expenses in two months to compare.',
    flat: 'No change'
  },
  debts: {
    title: 'Debts & loans',
    sub: 'Track who owes what',
    lent: 'They owe me',
    owed: 'I owe',
    person: 'Person',
    personPh: 'Name',
    amount: 'Amount',
    currency: 'Currency',
    note: 'Note (optional)',
    notePh: 'Optional note',
    add: 'Add entry',
    settle: 'Settle',
    settled: 'Settled',
    settledToast: 'Settled with {name}',
    addedToast: 'Added {name}',
    deleted: 'Entry deleted',
    empty: 'No debts or loans yet.',
    totalLent: 'Owed to me',
    totalOwed: 'I owe',
    net: 'Net',
    unconverted: '{n} without a rate',
    deleteAria: 'Delete {name}',
    nameError: 'Enter a name',
    amountError: 'Enter an amount greater than zero',
    autoTx: 'Create movement when settling',
    autoTxHint: 'A settled loan becomes income; a settled debt becomes an expense.',
    txNote: 'settled debt',
    manage: 'Manage debts'
  },
  fx: {
    title: 'Manual exchange rates',
    note: 'Stored on this device. No internet or APIs.',
    from: 'From',
    to: 'To',
    rate: 'Rate',
    ratePh: 'e.g. 42.50',
    save: 'Save rate',
    saved: 'Rate saved',
    invalid: 'Enter a rate greater than zero',
    same: 'Choose two different currencies',
    list: 'Saved rates',
    none: 'No rates yet.',
    remove: 'Remove {pair}',
    convertTitle: 'Offline converter',
    amount: 'Amount',
    convert: 'Convert',
    result: '{amount} = {result}',
    missing: 'Set a rate for this pair first.'
  }
});

Object.assign(window.CWI18N.en.views, { accounts: 'Accounts' });
Object.assign(window.CWI18N.en.add, { accountLabel: 'Account' });
Object.assign(window.CWI18N.en.list, { accountFilter: 'Account', allAccounts: 'All accounts' });
Object.assign(window.CWI18N.en.csv, {
  account: 'Account', currency: 'Currency', original: 'Original amount', destination: 'Received at destination'
});
Object.assign(window.CWI18N.en, {
  accounts: {
    title: 'Accounts & wallets', sub: 'Balances and internal transfers',
    new: 'New account', edit: 'Edit account', main: 'Main account',
    cash: 'Cash', bank: 'Bank', card: 'Card', savings: 'Savings', other: 'Other', custom: 'Custom',
    unknown: 'Unknown account',
    name: 'Account name', namePh: 'e.g. Checking, Cash, Savings',
    type: 'Account type', currency: 'Currency', initial: 'Initial balance', color: 'Color',
    save: 'Save account', formHint: 'The initial balance is added to movements in this account. Transfers never count as income or expenses.',
    nameError: 'Enter an account name', initialError: 'Enter a valid initial balance',
    lastError: 'You need at least one account', created: 'Account created', updated: 'Account updated', deleted: 'Account deleted',
    editAria: 'Edit {name}', deleteAria: 'Delete {name}', deleteConfirm: 'Delete?',
    total: 'Consolidated balance', totalSub: '{n} accounts',
    initialShort: 'Initial', incomeShort: 'Income', expensesShort: 'Expenses',
    unconverted: { one: '{n} account without a rate', other: '{n} accounts without a rate' },
    rateMissing: 'No exchange rate for this currency; using 1:1'
  },
  transfer: {
    title: 'Transfer between accounts', short: 'Transfer', new: 'New transfer',
    from: 'From account', to: 'To account', amount: 'Amount', rate: 'Exchange rate', date: 'Date',
    note: 'Note (optional)', notePh: 'e.g. savings, cash…', save: 'Transfer', cancel: 'Cancel',
    hint: 'Moves money between your accounts. It never appears as income or expense.',
    rateHint: '1 {from} = rate {to}', sameCurHint: 'Same currency: rate is fixed at 1',
    history: 'Internal transfers', listSub: 'Not counted as income or expenses', empty: 'No transfers yet.',
    needTwo: 'Create at least two accounts to transfer', sameError: 'Choose two different accounts',
    amountError: 'Enter an amount greater than zero', rateError: 'Enter a rate greater than zero',
    added: 'Transfer added: {amount}', deleted: 'Transfer deleted', deleteAria: 'Delete transfer',
    csvType: 'Transfer', demoSavings: 'Monthly savings', demoCash: 'Cash top-up'
  }
});

/* v1.6.0 — multichain integrity, debt installments and safe updates */
Object.assign(window.CWI18N.en.csv, {
  originalAmount: 'Original amount', originalCurrency: 'Original currency',
  convertedAmount: 'Converted amount', baseCurrency: 'Base currency'
});
Object.assign(window.CWI18N.en.settings, {
  currencyNote: 'Existing amounts, budgets, goals, debts and accounts are converted with your rates; missing rates are requested.',
  currencyRecalculated: 'Currency changed and all amounts recalculated.',
  currencyCancelled: 'Currency change cancelled: enter the missing exchange rate.'
});
Object.assign(window.CWI18N.en.accounts, {
  rateMissing: 'No exchange rate for this currency. Add it in Settings → Manual exchange rates.',
  setRates: 'Set missing rates'
});
Object.assign(window.CWI18N.en.add, { converted: '≈ {amount} in {base} (rate {rate})' });
Object.assign(window.CWI18N.en.fx, {
  askRate: 'Enter the rate needed to save this operation: 1 {from} = ? {to}',
  rateRequired: 'Enter a rate before saving'
});
Object.assign(window.CWI18N.en.debts, {
  remaining: 'Outstanding', paidSoFar: 'Paid', payments: 'Installments paid',
  paymentsEmpty: 'No installments recorded yet.',
  payInstallment: 'Pay installment', payAmount: 'Installment amount',
  payAccount: 'Account money comes from / goes to', payDate: 'Payment date',
  payNote: 'Note (optional)', paySave: 'Record installment', payCancel: 'Cancel',
  paymentAdded: 'Installment recorded: {amount}', paymentError: 'Enter an amount greater than zero',
  paymentTooHigh: 'The installment cannot exceed the outstanding amount',
  paymentTxNote: 'debt installment', rateUsed: 'Rate applied: 1 {from} = {rate} {to}',
  settleRemaining: 'Settle outstanding'
});
Object.assign(window.CWI18N.en.fx, { invalid: 'Enter a valid exchange rate.' });
Object.assign(window.CWI18N.en, {
  update: {
    available: 'A new version is available. Save your work, then apply it.',
    apply: 'Update now',
    ready: 'Update ready. Save your work to apply it.',
    unsaved: 'Save or discard your changes before updating.'
  }
});
