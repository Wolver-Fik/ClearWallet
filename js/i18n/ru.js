window.CWI18N = window.CWI18N || {};
window.CWI18N.ru = {
  'install.button': 'Установить приложение',
  'install.guideTitle': 'Установка на iPhone или iPad',
  'install.step1': 'Нажмите значок «Поделиться» на панели Safari',
  'install.step2': 'Выберите «На главный экран»',
  'install.close': 'Закрыть',
  'install.buttonAria': 'Установить приложение на этом устройстве',
  'install.closeAria': 'Закрыть руководство по установке',
  code: 'ru',
  name: 'Русский',
  locale: 'ru-RU',
  app: { tagline: 'Личные финансы' },
  views: {
    group: 'Представления',
    overview: 'Обзор',
    movements: 'Операции',
    fixed: 'Постоянные платежи',
    goals: 'Цели'
  },
  kpi: {
    group: 'Сводка за месяц',
    balance: 'Доступный остаток',
    income: 'Доходы',
    expenses: 'Расходы',
    micro: 'Мелкие расходы',
    vsPrev: 'к прошлому месяцу',
    noPrev: 'нет данных за прошлый месяц'
  },
  header: {
    prevMonth: 'Предыдущий месяц',
    nextMonth: 'Следующий месяц',
    currentMonth: 'Вернуться к текущему месяцу',
    settings: 'Настройки'
  },
  type: { expense: 'Расход', income: 'Доход', group: 'Тип операции' },
  add: {
    title: 'Добавить операцию',
    amountLabel: 'Сумма',
    noteLabel: 'Заметка',
    notePlaceholder: 'Заметка (необязательно): еда, кофе…',
    notePlaceholderIncome: 'Заметка (необязат.): зарплата, продажа…',
    dateLabel: 'Дата',
    categoryLabel: 'Категория',
    micro: 'Мелкие расходы',
    microTitle: 'Мелкие частые покупки',
    microHint: 'Микро: мелкие повторяющиеся покупки, например кофе, перекусы или доставка. Они учитываются отдельно, чтобы вы видели, сколько на них уходит.',
    expenseBtn: 'Добавить расход',
    incomeBtn: 'Добавить доход',
    addedExpense: 'Расход добавлен: −{amount}',
    addedIncome: 'Доход добавлен: +{amount}',
    addedInMonth: '{msg} · {month}',
    amountError: 'Введите сумму больше нуля',
    categoryError: 'Выберите категорию'
  },
  demo: {
    title: 'Это примерные данные.',
    body: 'Выберите валюту и начните с нуля или добавьте первую операцию — примерные данные исчезнут.',
    start: 'Начать с нуля',
    ready: 'Готово — добавляйте свои операции',
    load: 'Загрузить демо-данные (Demo)',
    loaded: 'Демо-данные загружены'
  },
  hero: {
    title: 'Доступно в этом месяце',
    income: 'Доходы',
    expenses: 'Расходы',
    savings: 'Накопления',
    micro: 'Мелкие расходы',
    records: { one: '{n} запись', few: '{n} записи', many: '{n} записей', other: '{n} записи' },
    purchases: { one: '{n} покупка', few: '{n} покупки', many: '{n} покупок', other: '{n} покупки' },
    ofExpenses: '{pct} расходов',
    ofTarget: '{pct} цели {amount}',
    ofIncome: '{pct} вашего дохода',
    noTarget: 'Цель не задана',
    dayOf: 'День {day} из {dim}',
    noTxCurrent: 'Вы ещё ничего не добавили в этом месяце.',
    noTxPast: 'В этом месяце нет операций.',
    future: 'Запланировано: {amount} расходов.',
    setBudget: 'Задайте бюджет по категориям в настройках, чтобы понимать, как идут дела.',
    pastUnder: 'Вы завершили месяц на {amount} ниже бюджета.',
    pastOver: 'Вы превысили бюджет на {amount}.',
    overBudget: 'Вы превысили бюджет на {amount}.',
    onTrack: 'Всё идёт хорошо: потрачено {spent} бюджета, прошло {time} месяца.',
    caution: 'Внимание: потрачено {spent} бюджета, а прошло {time} месяца.',
    overspending: 'Перерасход: потрачено {spent} бюджета, а прошло {time} месяца.',
    perDay: 'До конца месяца можно тратить около {amount} в день.',
    noMargin: 'На остаток месяца запаса нет{goal}.',
    goalSuffix: ', с учётом вашей цели накоплений',
    spentOf: 'Потрачено {spent} из {budget}',
    spentOnly: 'Потрачено {spent}'
  },
  donut: {
    title: 'Расходы по категориям',
    empty: 'В этом месяце ещё нет расходов.',
    aria: 'Кольцевая диаграмма распределения расходов по категориям',
    totalLabel: 'Всего потрачено',
    categories: { one: '{n} категория', few: '{n} категории', many: '{n} категорий', other: '{n} категории' },
    transactions: { one: '{n} операция', few: '{n} операции', many: '{n} операций', other: '{n} операции' },
    txCount: { one: '{n} оп.', few: '{n} оп.', many: '{n} оп.', other: '{n} оп.' }
  },
  budgets: {
    title: 'Бюджет по категориям',
    total: 'Итого',
    over: 'Превышение на {amount}',
    left: 'Осталось {amount}',
    noBudget: 'Без бюджета',
    noTx: 'Нет операций',
    hint: 'Укажите в настройках, сколько хотите тратить в каждой категории.'
  },
  pace: {
    title: 'Темп расходов',
    sub: 'Накоплено за месяц',
    empty: 'Когда вы добавите расходы, здесь будет видно, опережает ли месяц ваш бюджет.',
    over: 'При текущем темпе месяц завершится на {amount}, примерно на {over} выше бюджета.',
    within: 'При текущем темпе месяц завершится на {amount}, в пределах бюджета.',
    only: 'При текущем темпе месяц завершится на {amount} расходов.',
    legendCum: 'Накопленные расходы',
    legendPace: 'Темп бюджета',
    legendProj: 'Прогноз',
    aria: 'Накопленные расходы по дням месяца в сравнении с темпом бюджета',
    tooltipTotal: '{amount} накоплено',
    tooltipDay: '+{amount} в этот день'
  },
  fixed: {
    income: {
      paid: 'Получено',
      dueToday: 'Поступление ожидается сегодня',
      dueIn: { one: 'Поступление через {n} день', few: 'Поступление через {n} дня', many: 'Поступление через {n} дней', other: 'Поступление через {n} дня' },
      overdue: { one: 'Ожидает поступления ({n} день)', few: 'Ожидает поступления ({n} дня)', many: 'Ожидает поступления ({n} дней)', other: 'Ожидает поступления ({n} дня)' }
    },
    title: 'Постоянные и регулярные платежи',
    sub: 'Подписки, аренда, коммунальные услуги',
    upcomingTitle: 'Ближайшие платежи',
    upcomingSub: 'Скоро срок',
    emptyUpcoming: 'Нет запланированных регулярных платежей.',
    addFirst: 'Добавить постоянный платёж',
    viewAll: 'Управлять постоянными платежами',
    payNow: 'Оплатить сейчас',
    paid: 'Оплачено',
    dueToday: 'Срок сегодня',
    dueIn: { one: 'Срок через {n} день', few: 'Срок через {n} дня', many: 'Срок через {n} дней', other: 'Срок через {n} дня' },
    overdue: { one: 'Просрочен на {n} день', few: 'Просрочен на {n} дня', many: 'Просрочен на {n} дней', other: 'Просрочен на {n} дня' },
    monthlyDay: 'День {day}',
    name: 'Название',
    namePh: 'Аренда, Netflix, электричество…',
    amount: 'Сумма',
    day: 'День оплаты (1-31)',
    category: 'Категория',
    addBtn: 'Добавить постоянный платёж',
    empty: 'Постоянные платежи ещё не добавлены.',
    deleteAria: 'Удалить {name}',
    demoNote: 'Примеры регулярных платежей станут реальными данными после оплаты или создания.',
    alreadyPaid: '{name} уже оплачен в этом месяце',
    paidToast: 'Оплачено: {name} ({amount})',
    addedToast: 'Добавлено: {name}',
    deleted: 'Постоянный платёж удалён',
    nameError: 'Введите название платежа',
    amountError: 'Введите сумму больше нуля',
    dayError: 'Введите корректный день месяца (1-31)'
  },
  goal: {
    title: 'Цель накоплений',
    empty: 'Вы ещё не задали цель. Дайте название и сумму тому, чего хотите достичь, например поездке, машине или резервному фонду.',
    define: 'Задать цель',
    defaultName: 'Моя цель',
    demoName: 'Резервный фонд',
    savedOf: '{saved} из {target}',
    left: 'Осталось {amount}',
    done: 'Цель достигнута.',
    eta: {
      one: 'Если копить как в этом месяце, вы достигнете цели через {n} месяц.',
      few: 'Если копить как в этом месяце, вы достигнете цели через {n} месяца.',
      many: 'Если копить как в этом месяце, вы достигнете цели через {n} месяцев.',
      other: 'Если копить как в этом месяце, вы достигнете цели через {n} месяца.'
    },
    addPlaceholder: 'Сумма для добавления',
    addBtn: 'Добавить к цели',
    added: 'Вы добавили {amount} к цели',
    amountError: 'Введите сумму для добавления'
  },
  history: {
    title: 'Последние 6 месяцев',
    sub: 'Накопления за месяц',
    income: 'Доходы',
    expenses: 'Расходы'
  },
  list: {
    title: 'Операции',
    filterAll: 'Все',
    filterExpenses: 'Расходы',
    filterIncome: 'Доходы',
    filterMicro: 'Мелкие',
    emptyFilter: 'Нет операций, подходящих под этот фильтр.',
    empty: 'В этом месяце ещё нет операций. Добавьте первую выше.',
    showMore: 'Показать ещё ({n})',
    deleteConfirm: 'Удалить?',
    deleteAria: 'Удалить операцию',
    confirmAria: 'Подтвердить удаление',
    deleted: 'Операция удалена',
    microTag: 'мелкая',
    searchAria: 'Поиск операций',
    searchPlaceholder: 'Поиск: заметка, категория, дата…',
    filtersAria: 'Фильтр операций',
    clearSearch: 'Очистить поиск',
    editAria: 'Изменить операцию',
    editAmount: 'Сумма',
    editNote: 'Заметка',
    save: 'Сохранить',
    cancel: 'Отмена',
    updated: 'Операция обновлена',
    noResults: 'Нет операций по запросу «{query}».',
    recurringTag: 'регулярный'
  },
  settings: {
    title: 'Настройки',
    currency: 'Валюта',
    currencyNote: 'Смена валюты не пересчитывает уже добавленные суммы.',
    language: 'Язык',
    languageNote: 'Интерфейс и формат чисел обновляются сразу.',
    savings: 'Накопления',
    monthlyTarget: 'Месячная цель накоплений',
    goalName: 'Основная цель (название)',
    goalNamePh: 'Поездка, машина, резервный фонд…',
    target: 'Цель',
    saved: 'Уже накоплено',
    budgetTitle: 'Месячный бюджет по категориям',
    nameLabel: 'Название',
    budgetLabel: 'Бюджет для {name}',
    newCategory: 'Новая категория',
    add: 'Добавить',
    remove: 'Удалить {name}',
    data: 'Ваши данные',
    exportJson: 'Экспорт резервной копии (.json)',
    importJson: 'Импорт резервной копии (.json)',
    exportCsv: 'Экспорт операций месяца (.csv)',
    reset: 'Удалить все данные',
    resetConfirm: 'Нажмите ещё раз, чтобы удалить всё',
    localNote: 'Ваши данные хранятся только на этом устройстве.',
    demoNote: 'Вы просматриваете примерные данные. Чтобы задать бюджеты и цель, начните с нуля.',
    atLeastOne: 'Нужна хотя бы одна категория',
    backupExported: 'Резервная копия экспортирована',
    backupImported: 'Резервная копия импортирована',
    backupInvalid: 'Этот файл не является корректной резервной копией ClearWallet',
    csvExported: 'Файл CSV экспортирован',
    exportFailed: 'Не удалось экспортировать файл',
    resetDone: 'Все данные удалены',
    importConfirm: 'Импорт заменит текущие данные. Продолжить?'
  },
  csv: {
    date: 'Дата',
    type: 'Тип',
    category: 'Категория',
    note: 'Заметка',
    amount: 'Сумма',
    micro: 'Мелкий расход',
    expense: 'Расход',
    income: 'Доход',
    yes: 'Да'
  },
  cat: {
    viv: 'Аренда',
    srv: 'Коммунальные услуги',
    sup: 'Продукты',
    trn: 'Транспорт',
    sal: 'Здоровье',
    ocio: 'Досуг',
    sus: 'Подписки',
    com: 'Покупки',
    otr: 'Другое'
  },
  inc: { sueldo: 'Зарплата', free: 'Фриланс', otri: 'Прочие доходы' },
  note: {
    salary: 'Зарплата',
    rent: 'Аренда',
    utilities: 'Свет и вода',
    groceries: 'Продукты',
    fuel: 'Топливо',
    coffee: 'Кофе',
    streaming: 'Стриминг',
    snack: 'Перекус',
    market: 'Рынок и мясная лавка',
    dinner: 'Ужин с друзьями',
    shoes: 'Кроссовки',
    transit: 'Билеты',
    pharmacy: 'Аптека',
    delivery: 'Доставка',
    game: 'Игра',
    gift: 'Подарок'
  },
  ui: {
    evolution: 'Динамика месяца',
    history: 'История операций',
    goals: 'Цели накоплений',
    preview: 'Определённый значок',
    colName: 'Название',
    colCategory: 'Категория',
    colDate: 'Дата',
    colAmount: 'Сумма'
  },
  common: {
    today: 'Сегодня',
    yesterday: 'Вчера',
    uncategorized: 'Без категории',
    incomeFallback: 'Доход',
    total: 'Итого',
    currency: 'Валюта',
    language: 'Язык',
    month: 'Месяц',
    close: 'Закрыть'
  }
};

Object.assign(window.CWI18N.ru.views, { debts: 'Долги' });
Object.assign(window.CWI18N.ru.kpi, { projection: 'Прогноз остатка' });
Object.assign(window.CWI18N.ru, {
  projection: {
    title: 'Прогноз остатка до конца месяца',
    current: 'Текущий остаток',
    income: 'Ожидаемые доходы',
    expenses: 'Ожидаемые постоянные платежи',
    left: 'Осталось {n} постоянных платежей',
    none: 'Все постоянные платежи оплачены',
    hint: 'Остаток + доходы − ожидаемые платежи'
  },
  compare: {
    title: 'Месяц к месяцу',
    prev: 'к {month}',
    thisMonth: 'Этот месяц',
    prevMonth: 'Прошлый месяц',
    total: 'Всего расходов',
    up: 'Наибольший рост',
    down: 'Наибольшее снижение',
    noData: 'Добавьте расходы за два месяца для сравнения.',
    flat: 'Без изменений'
  },
  debts: {
    title: 'Долги и займы',
    sub: 'Учитывайте, кто кому должен',
    lent: 'Мне должны',
    owed: 'Я должен',
    person: 'Человек',
    personPh: 'Имя',
    amount: 'Сумма',
    currency: 'Валюта',
    note: 'Заметка (необязательно)',
    notePh: 'Необязательная заметка',
    add: 'Добавить запись',
    settle: 'Погасить',
    settled: 'Погашено',
    settledToast: 'Погашено с {name}',
    addedToast: 'Добавлено: {name}',
    deleted: 'Запись удалена',
    empty: 'Пока нет долгов и займов.',
    totalLent: 'Мне должны',
    totalOwed: 'Я должен',
    net: 'Итого',
    unconverted: '{n} без курса',
    deleteAria: 'Удалить {name}',
    nameError: 'Введите имя',
    amountError: 'Введите сумму больше нуля',
    autoTx: 'Создать операцию при погашении',
    autoTxHint: 'Погашенный заём становится доходом, погашенный долг — расходом.',
    txNote: 'погашенный долг',
    manage: 'Управлять долгами'
  },
  fx: {
    title: 'Ручные курсы валют',
    note: 'Хранятся на этом устройстве. Без интернета и API.',
    from: 'Из',
    to: 'В',
    rate: 'Курс',
    ratePh: 'напр. 42,50',
    save: 'Сохранить курс',
    saved: 'Курс сохранён',
    invalid: 'Введите курс больше нуля',
    same: 'Выберите две разные валюты',
    list: 'Сохранённые курсы',
    none: 'Пока нет курсов.',
    remove: 'Удалить {pair}',
    convertTitle: 'Офлайн-конвертер',
    amount: 'Сумма',
    convert: 'Перевести',
    result: '{amount} = {result}',
    missing: 'Сначала задайте курс для этой пары.'
  }
});

Object.assign(window.CWI18N.ru.views, { accounts: 'Счета' });
Object.assign(window.CWI18N.ru.add, { accountLabel: 'Счёт' });
Object.assign(window.CWI18N.ru.list, { accountFilter: 'Счёт', allAccounts: 'Все счета' });
Object.assign(window.CWI18N.ru.csv, {
  account: 'Счёт', currency: 'Валюта', original: 'Исходная сумма', destination: 'Получено на счёте'
});
Object.assign(window.CWI18N.ru, {
  accounts: {
    title: 'Счета и кошельки', sub: 'Балансы и внутренние переводы',
    new: 'Новый счёт', edit: 'Изменить счёт', main: 'Основной счёт',
    cash: 'Наличные', bank: 'Банк', card: 'Карта', savings: 'Сбережения', other: 'Другое', custom: 'Своё',
    unknown: 'Неизвестный счёт',
    name: 'Название счёта', namePh: 'напр. Текущий счёт, Наличные',
    type: 'Тип счёта', currency: 'Валюта', initial: 'Начальный баланс', color: 'Цвет',
    save: 'Сохранить счёт', formHint: 'Начальный баланс добавляется к операциям счёта. Переводы никогда не учитываются как доход или расход.',
    nameError: 'Введите название счёта', initialError: 'Введите корректный начальный баланс',
    lastError: 'Нужен хотя бы один счёт', created: 'Счёт создан', updated: 'Счёт обновлён', deleted: 'Счёт удалён',
    editAria: 'Изменить {name}', deleteAria: 'Удалить {name}', deleteConfirm: 'Удалить?',
    total: 'Общий баланс', totalSub: '{n} счетов',
    initialShort: 'Начало', incomeShort: 'Доходы', expensesShort: 'Расходы',
    unconverted: { one: '{n} счёт без курса', few: '{n} счёта без курса', many: '{n} счетов без курса', other: '{n} счёта без курса' },
    rateMissing: 'Нет курса для этой валюты; используется 1:1'
  },
  transfer: {
    title: 'Перевод между счетами', short: 'Перевести', new: 'Новый перевод',
    from: 'Счёт источник', to: 'Счёт назначения', amount: 'Сумма', rate: 'Курс конвертации', date: 'Дата',
    note: 'Заметка (необязательно)', notePh: 'напр. сбережения, наличные…', save: 'Перевести', cancel: 'Отмена',
    hint: 'Перемещает деньги между вашими счетами. Никогда не учитывается как доход или расход.',
    rateHint: '1 {from} = курс {to}', sameCurHint: 'Одна валюта: курс равен 1',
    history: 'Внутренние переводы', listSub: 'Не учитываются как доход или расход', empty: 'Переводов пока нет.',
    needTwo: 'Создайте минимум два счёта для перевода', sameError: 'Выберите два разных счёта',
    amountError: 'Введите сумму больше нуля', rateError: 'Введите курс больше нуля',
    added: 'Перевод добавлен: {amount}', deleted: 'Перевод удалён', deleteAria: 'Удалить перевод',
    csvType: 'Перевод', demoSavings: 'Месячные сбережения', demoCash: 'Пополнение наличных'
  }
});

/* v1.6.0 — целостность нескольких валют, частичные платежи и безопасные обновления */
Object.assign(window.CWI18N.ru.csv, {
  originalAmount: 'Исходная сумма', originalCurrency: 'Исходная валюта',
  convertedAmount: 'Конвертированная сумма', baseCurrency: 'Базовая валюта'
});
Object.assign(window.CWI18N.ru.settings, {
  currencyNote: 'Существующие суммы, бюджеты, цели, долги и счета пересчитываются по вашим курсам; отсутствующие курсы запрашиваются.',
  currencyRecalculated: 'Валюта изменена, все суммы пересчитаны.',
  currencyCancelled: 'Изменение отменено: введите отсутствующий курс.'
});
Object.assign(window.CWI18N.ru.accounts, {
  rateMissing: 'Нет курса для этой валюты. Добавьте его в Настройки → Курсы валют.',
  setRates: 'Указать отсутствующие курсы'
});
Object.assign(window.CWI18N.ru.add, { converted: '≈ {amount} в {base} (курс {rate})' });
Object.assign(window.CWI18N.ru.fx, {
  askRate: 'Введите курс для сохранения операции: 1 {from} = ? {to}',
  rateRequired: 'Введите курс перед сохранением'
});
Object.assign(window.CWI18N.ru.debts, {
  remaining: 'Осталось', paidSoFar: 'Оплачено', payments: 'Оплаченные взносы',
  paymentsEmpty: 'Взносы ещё не записаны.',
  payInstallment: 'Оплатить взнос', payAmount: 'Сумма взноса',
  payAccount: 'Счёт списания / зачисления', payDate: 'Дата платежа',
  payNote: 'Примечание (необязательно)', paySave: 'Записать взнос', payCancel: 'Отмена',
  paymentAdded: 'Взнос записан: {amount}', paymentError: 'Введите сумму больше нуля',
  paymentTooHigh: 'Взнос не может превышать остаток',
  paymentTxNote: 'платёж по долгу', rateUsed: 'Применённый курс: 1 {from} = {rate} {to}',
  settleRemaining: 'Погасить остаток'
});
Object.assign(window.CWI18N.ru.fx, { invalid: 'Введите допустимый курс валюты.' });
Object.assign(window.CWI18N.ru, {
  update: {
    available: 'Доступна новая версия. Сохраните изменения и примените её.',
    apply: 'Обновить сейчас',
    ready: 'Обновление готово. Сохраните изменения, чтобы применить его.',
    unsaved: 'Сохраните или отмените изменения перед обновлением.'
  }
});
