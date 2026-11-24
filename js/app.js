/* ClearWallet — application logic, calculations, charts, budgets, goals and events */
(function () {
  'use strict';

  var DICT = window.CWI18N || {};
  var Storage = window.CWStorage;
  var LANGS = ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ja'];
  var LANG_KEY = 'clearwallet-lang-v1';
  var DEFAULT_EXP_IDS = ['viv', 'srv', 'sup', 'trn', 'sal', 'ocio', 'sus', 'com', 'otr'];
  var INCOME_IDS = ['sueldo', 'free', 'otri'];
  var DEMO_BUD = { viv: 650, srv: 160, sup: 380, trn: 160, sal: 80, ocio: 200, sus: 40, com: 120, otr: 60 };
  var DEMO_TX = [
    [1, 'i', 'sueldo', 2400, 'salary', 0], [2, 'g', 'viv', 650, 'rent', 0], [3, 'g', 'srv', 140, 'utilities', 0],
    [3, 'g', 'srv', 38, 'Gastos Comunes', 0], [4, 'g', 'sup', 96, 'groceries', 0], [4, 'g', 'sup', 74, 'Supermercado', 0],
    [5, 'g', 'sup', 48, 'market', 0], [6, 'g', 'sus', 11, 'Spotify', 0], [7, 'g', 'sus', 14, 'Netflix', 0],
    [8, 'g', 'ocio', 4, 'coffee', 1], [9, 'g', 'com', 58, 'Amazon Prime', 0], [10, 'g', 'com', 45, 'shoes', 0],
    [11, 'g', 'trn', 22, 'transit', 0], [12, 'g', 'trn', 40, 'Uber', 0], [13, 'g', 'trn', 52, 'Fuel', 0],
    [14, 'g', 'sal', 18, 'pharmacy', 0], [15, 'g', 'ocio', 6, 'snack', 1], [16, 'g', 'ocio', 14, 'delivery', 1],
    [17, 'g', 'ocio', 12, 'game', 0], [18, 'g', 'ocio', 5, 'Starbucks', 1], [19, 'g', 'sus', 9, 'HBO', 0],
    [20, 'g', 'trn', 40, 'fuel', 0], [21, 'g', 'otr', 15, 'gift', 0], [22, 'g', 'com', 24, 'Rappi', 1],
    [23, 'g', 'ocio', 8, 'snack', 1], [24, 'i', 'free', 180, 'Freelance', 0]
  ];
  var SCALE = { UYU: 40, ARS: 1000, CLP: 950, COP: 4000, MXN: 18, BRL: 5, PEN: 3.7, PYG: 7500, BOB: 7, JPY: 150, KRW: 1350, INR: 85, CNY: 7, GBP: 0.8, CHF: 0.9 };
  var C = { accent: '#8aa4ff', accent2: '#6ee7f9', good: '#58e0b0', warn: '#f4c15e', bad: '#ff7b8a' };

  /* ---------- language ---------- */
  function detectLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && DICT[saved] && DICT[saved].app) return saved;
    } catch (e) {}
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var base = String(list[i] || '').toLowerCase().split('-')[0];
      if (DICT[base] && DICT[base].app) return base;
    }
    return 'en';
  }

  var LANG = detectLang();
  var pluralCache = null;

  function locale() {
    return (DICT[LANG] && DICT[LANG].locale) || LANG;
  }

  function resolve(key) {
    var parts = key.split('.');
    var cur = DICT[LANG];
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function format(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return vars && vars[k] != null ? String(vars[k]) : m;
    });
  }

  function t(key, vars) {
    var v = resolve(key);
    if (v == null) return key;
    if (typeof v === 'object') v = v.other || '';
    return format(v, vars);
  }

  function pluralCat(n) {
    try {
      if (!pluralCache) pluralCache = new Intl.PluralRules(locale());
      return pluralCache.select(n);
    } catch (e) {
      return n === 1 ? 'one' : 'other';
    }
  }

  function tn(key, n, vars) {
    var v = resolve(key);
    if (v == null) return key;
    if (typeof v === 'object') v = v[pluralCat(n)] || v.other || v.many || '';
    var out = { n: n };
    if (vars) for (var k in vars) out[k] = vars[k];
    return format(v, out);
  }

  /* ---------- utilities ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
  function ymOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1); }
  function isoOf(d) { return ymOf(d) + '-' + pad(d.getDate()); }
  function parseYM(ym) { var p = ym.split('-').map(Number); return { y: p[0], m: p[1] }; }
  function addMonths(ym, n) { var q = parseYM(ym); return ymOf(new Date(q.y, q.m - 1 + n, 1)); }
  function daysIn(ym) { var q = parseYM(ym); return new Date(q.y, q.m, 0).getDate(); }
  function scaleFor(c) { return SCALE[c] || 1; }
  function nice(n) {
    if (!(n > 0)) return 0;
    var p = Math.pow(10, Math.max(0, Math.floor(Math.log10(n)) - 1));
    return Math.round(n / p) * p;
  }
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function smoothPath(pts) {
    if (!pts || !pts.length) return '';
    if (pts.length === 1) return 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var c1x = p1[0] + (p2[0] - p0[0]) / 6;
      var c1y = p1[1] + (p2[1] - p0[1]) / 6;
      var c2x = p2[0] - (p3[0] - p1[0]) / 6;
      var c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ' C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }

  var NOW = new Date();
  var TODAY_YM = ymOf(NOW);
  var TODAY_ISO = isoOf(NOW);

  /* ---------- formatting ---------- */
  var fmtCache = {};
  var digitsCache = {};
  function currencyDigits(cur) {
    var k = LANG + '|' + cur;
    if (digitsCache[k] == null) {
      try {
        digitsCache[k] = new Intl.NumberFormat(locale(), { style: 'currency', currency: cur }).resolvedOptions().maximumFractionDigits;
      } catch (e) {
        digitsCache[k] = 2;
      }
    }
    return digitsCache[k];
  }
  function nf(cur, min, max) {
    var k = LANG + '|' + cur + '|' + min + '|' + max;
    if (!fmtCache[k]) {
      try {
        fmtCache[k] = new Intl.NumberFormat(locale(), {
          style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: min, maximumFractionDigits: max
        });
      } catch (e) {
        fmtCache[k] = { format: function (n) { return Number(n).toFixed(max) + ' ' + cur; } };
      }
    }
    return fmtCache[k];
  }
  function money(n, round) {
    var cur = getCfg().cur;
    var digits = currencyDigits(cur);
    var frac = !round && digits > 0 && Math.abs(n - Math.round(n)) > 1e-9;
    var d = frac ? digits : 0;
    return nf(cur, d, d).format(n);
  }

  var pctCache = {};
  function pct(x) {
    if (!pctCache[LANG]) {
      try { pctCache[LANG] = new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 0 }); }
      catch (e) { pctCache[LANG] = null; }
    }
    if (pctCache[LANG]) return pctCache[LANG].format(x);
    return Math.round(x * 100) + '%';
  }

  var pct1Cache = {};
  function pct1(x) {
    if (!pct1Cache[LANG]) {
      try { pct1Cache[LANG] = new Intl.NumberFormat(locale(), { style: 'percent', maximumFractionDigits: 1 }); }
      catch (e) { pct1Cache[LANG] = null; }
    }
    if (pct1Cache[LANG]) return pct1Cache[LANG].format(Math.abs(x));
    return (Math.round(Math.abs(x) * 1000) / 10) + '%';
  }
  function signedPct(x) {
    var sign = x > 0 ? '+' : x < 0 ? '−' : '';
    return sign + pct1(x);
  }
  function sharePct(x) {
    return x > 0 && x < 0.01 ? pct1(x) : pct(x);
  }

  var axisCache = {};
  function axis(n) {
    if (!axisCache[LANG]) {
      try { axisCache[LANG] = new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }); }
      catch (e) { axisCache[LANG] = { format: function (v) { return String(Math.round(v)); } }; }
    }
    return axisCache[LANG].format(n);
  }

  function parseAmount(s) {
    s = String(s || '').trim().replace(/[^\d.,]/g, '');
    if (!s) return NaN;
    var lc = s.lastIndexOf(','), ld = s.lastIndexOf('.'), dec = Math.max(lc, ld);
    var v;
    if (dec < 0) v = parseFloat(s);
    else {
      var ip = s.slice(0, dec).replace(/[.,]/g, ''), fr = s.slice(dec + 1);
      var oneKind = (lc < 0) || (ld < 0);
      if (fr.length === 3 && oneKind && ip !== '' && ip !== '0') v = parseFloat(ip + fr);
      else v = parseFloat((ip || '0') + '.' + fr);
    }
    return isFinite(v) ? v : NaN;
  }

  function monthLabel(ym) {
    var q = parseYM(ym);
    return cap(new Intl.DateTimeFormat(locale(), { month: 'long', year: 'numeric' }).format(new Date(q.y, q.m - 1, 1)));
  }
  function monthShort(ym) {
    var q = parseYM(ym);
    return new Intl.DateTimeFormat(locale(), { month: 'short' }).format(new Date(q.y, q.m - 1, 1)).replace('.', '');
  }
  function dayLabel(iso) {
    if (iso === TODAY_ISO) return t('common.today');
    var y = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate() - 1);
    if (iso === isoOf(y)) return t('common.yesterday');
    var p = iso.split('-').map(Number);
    return cap(new Intl.DateTimeFormat(locale(), { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(p[0], p[1] - 1, p[2])));
  }

  /* ---------- config and data ---------- */
  var S = {
    cfg: null, months: {}, viewYM: TODAY_YM, view: 'overview', demo: true, type: 'g', cat: null,
    hor: false, filter: 'all', query: '', limit: 60, confirmDel: null, confirmReset: false,
    openSettings: false, openAdd: false, editTx: null, recDraft: null, debtDraft: null, fxDraft: null
  };
  var demoCache = null;

  function defaultCats() {
    return DEFAULT_EXP_IDS.map(function (id) { return { id: id, name: t('cat.' + id), budget: 0 }; });
  }
  function incomeCats() {
    return INCOME_IDS.map(function (id) { return { id: id, name: t('inc.' + id) }; });
  }
  function defaultCfg(cur) {
    return {
      cur: cur || Storage.guessCurrency(),
      saveTarget: 0,
      goal: { name: '', target: 0, saved: 0 },
      cats: defaultCats(),
      recurring: [],
      debts: [],
      rates: {},
      debtAutoTx: true
    };
  }
  function posNum(n) {
    n = Number(n);
    return isFinite(n) && n > 0 ? n : 0;
  }
  function normRecurring(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (r) {
      if (!r || typeof r !== 'object') return null;
      var name = String(r.name != null ? r.name : (r.n || '')).trim().slice(0, 40);
      var amount = Number(r.amount != null ? r.amount : r.a);
      var day = Math.round(Number(r.day != null ? r.day : r.d));
      if (!name || !isFinite(amount) || !(amount > 0) || !isFinite(day)) return null;
      return {
        id: String(r.id || ('r' + uid())),
        name: name,
        amount: r2(amount),
        day: clamp(day, 1, 31),
        cat: String(r.cat != null ? r.cat : (r.c || '')),
        type: r.type === 'i' ? 'i' : 'g'
      };
    }).filter(Boolean);
  }
  function normRates(raw) {
    var out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach(function (k) {
      if (!/^[A-Z]{3}>[A-Z]{3}$/.test(k)) return;
      var v = Number(raw[k]);
      if (isFinite(v) && v > 0) out[k] = v;
    });
    return out;
  }
  function normDebts(raw) {
    if (!Array.isArray(raw)) return [];
    return raw.map(function (d) {
      if (!d || typeof d !== 'object') return null;
      var name = String(d.name != null ? d.name : (d.n || '')).trim().slice(0, 40);
      var amount = Number(d.amount != null ? d.amount : d.a);
      var cur = String(d.cur || d.currency || '').toUpperCase().slice(0, 3);
      if (!name || !isFinite(amount) || !(amount > 0) || !/^[A-Z]{3}$/.test(cur)) return null;
      var date = /^\d{4}-\d{2}-\d{2}$/.test(d.date) ? d.date : TODAY_ISO;
      var settledAt = /^\d{4}-\d{2}-\d{2}$/.test(d.settledAt) ? d.settledAt : '';
      return {
        id: String(d.id || ('d' + uid())),
        name: name,
        amount: r2(amount),
        cur: cur,
        note: String(d.note || '').slice(0, 60),
        dir: d.dir === 'owed' ? 'owed' : 'lent',
        settled: !!d.settled,
        date: date,
        settledAt: settledAt
      };
    }).filter(Boolean);
  }
  function normCfg(c) {
    var d = defaultCfg();
    c = c || {};
    var g = c.goal || {};
    var cats = Array.isArray(c.cats) && c.cats.length ? c.cats.filter(function (x) { return x && x.id; }).map(function (x) {
      return { id: String(x.id), name: String(x.name || t('common.uncategorized')).slice(0, 30), budget: posNum(x.budget) };
    }) : d.cats;
    var rec = normRecurring(c.recurring);
    rec.forEach(function (r) {
      var valid = r.type === 'i'
        ? INCOME_IDS.indexOf(r.cat) >= 0
        : cats.some(function (x) { return x.id === r.cat; });
      if (!valid) r.cat = r.type === 'i' ? INCOME_IDS[0] : ((cats[0] && cats[0].id) || 'otr');
    });
    return {
      cur: typeof c.cur === 'string' && c.cur ? c.cur : d.cur,
      saveTarget: posNum(c.saveTarget),
      goal: {
        name: String(g.name || '').slice(0, 60),
        target: posNum(g.target),
        saved: posNum(g.saved)
      },
      cats: cats,
      recurring: rec,
      debts: normDebts(c.debts),
      rates: normRates(c.rates),
      debtAutoTx: c.debtAutoTx !== false
    };
  }
  function normTx(tx) {
    if (!tx || !tx.id || (tx.t !== 'g' && tx.t !== 'i') || typeof tx.d !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(tx.d)) return null;
    var a = Number(tx.a);
    if (!isFinite(a) || !(a > 0)) return null;
    return {
      id: String(tx.id), t: tx.t, a: a, c: String(tx.c || ''), n: String(tx.n || '').slice(0, 60),
      d: tx.d.slice(0, 10), h: tx.h ? 1 : 0, r: tx.r ? String(tx.r).slice(0, 40) : ''
    };
  }
  function validYM(ym) { return /^\d{4}-(0[1-9]|1[0-2])$/.test(ym); }
  function sanitizeMonths(raw) {
    var out = {};
    if (!raw || typeof raw !== 'object') return out;
    Object.keys(raw).forEach(function (k) {
      if (!validYM(k) || !Array.isArray(raw[k])) return;
      out[k] = raw[k].map(normTx).filter(Boolean);
    });
    return out;
  }

  function demoCfg() {
    var cur = S.cfg.cur;
    if (demoCache && demoCache.cur === cur && demoCache.lang === LANG) return demoCache;
    var k = scaleFor(cur);
    demoCache = {
      cur: cur, lang: LANG,
      saveTarget: nice(400 * k),
      goal: { name: t('goal.demoName'), target: nice(5000 * k), saved: nice(1250 * k) },
      cats: DEFAULT_EXP_IDS.map(function (id) {
        return { id: id, name: t('cat.' + id), budget: nice(DEMO_BUD[id] * k) };
      }),
      recurring: [
        { id: 'dr-sueldo', name: t('inc.sueldo'), amount: nice(2400 * k), day: 1, cat: 'sueldo', type: 'i' },
        { id: 'dr-free', name: t('inc.free'), amount: nice(180 * k), day: 24, cat: 'free', type: 'i' },
        { id: 'dr-extra', name: t('inc.otri'), amount: nice(90 * k), day: 28, cat: 'otri', type: 'i' },
        { id: 'dr-viv', name: t('cat.viv'), amount: nice(650 * k), day: 5, cat: 'viv' },
        { id: 'dr-srv', name: 'Gastos Comunes', amount: nice(38 * k), day: 8, cat: 'srv' },
        { id: 'dr-netflix', name: 'Netflix', amount: nice(14 * k), day: 12, cat: 'sus' },
        { id: 'dr-spotify', name: 'Spotify', amount: nice(11 * k), day: 18, cat: 'sus' },
        { id: 'dr-amazon', name: 'Amazon Prime', amount: nice(59 * k), day: 22, cat: 'com' },
        { id: 'dr-util', name: t('cat.srv'), amount: nice(140 * k), day: 26, cat: 'srv' }
      ],
      debts: [
        { id: 'dd-lent', name: 'Ana', amount: nice(60 * k), cur: cur, note: '', dir: 'lent', settled: false, date: TODAY_ISO, settledAt: '' },
        { id: 'dd-owed', name: 'Luis', amount: nice(95 * k), cur: cur, note: '', dir: 'owed', settled: false, date: TODAY_ISO, settledAt: '' }
      ],
      rates: cur !== 'USD' ? { ['USD>' + cur]: k } : {},
      debtAutoTx: true
    };
    return demoCache;
  }
  function demoTx(ym) {
    if (ym > TODAY_YM) return [];
    var k = scaleFor(S.cfg.cur), q = parseYM(ym), dim = daysIn(ym), cur = ym === TODAY_YM;
    var f = cur ? 1 : 0.84 + ((q.y * 12 + q.m) % 7) * 0.05;
    var out = [];
    var span = Math.max(1, Math.min(NOW.getDate(), dim));
    DEMO_TX.forEach(function (r, i) {
      /* pack the whole rich sample into the elapsed days of the current month */
      var day = cur ? 1 + ((r[0] - 1) % span) : Math.min(r[0], dim);
      var isInc = r[1] === 'i';
      var known = DICT[LANG] && DICT[LANG].note && DICT[LANG].note[r[4]];
      out.push({
        id: 'd' + ym + i, t: r[1], a: nice(r[3] * k * (isInc ? 1 : f)) || 1,
        c: r[2], n: known ? t('note.' + r[4]) : r[4], d: ym + '-' + pad(day), h: r[5],
        r: (isInc && r[2] === 'sueldo') ? 'dr-sueldo' : (isInc && r[2] === 'free') ? 'dr-free' : ''
      });
    });
    return out;
  }
  function getCfg() { return S.demo ? demoCfg() : S.cfg; }
  function getTx(ym) { return S.demo ? demoTx(ym) : (S.months[ym] || []); }
  function budgetTotal(cfg) { return r2(cfg.cats.reduce(function (a, c) { return a + (c.budget || 0); }, 0)); }

  function catIndex(id) { return getCfg().cats.findIndex(function (c) { return c.id === id; }); }
  function catColor(id) { var i = catIndex(id); return i < 0 ? 'var(--dim)' : 'hsl(' + ((i * 43 + 205) % 360) + ' 48% 64%)'; }
  function catName(tx) {
    if (tx.t === 'i') {
      var inc = DICT[LANG] && DICT[LANG].inc;
      return inc && inc[tx.c] ? inc[tx.c] : t('common.incomeFallback');
    }
    var c = getCfg().cats.find(function (x) { return x.id === tx.c; });
    return c ? c.name : t('common.uncategorized');
  }
  function catNameById(id) {
    var c = getCfg().cats.find(function (x) { return x.id === id; });
    return c ? c.name : t('common.uncategorized');
  }
  function monthStats(ym) {
    var tx = getTx(ym);
    var inc = 0, exp = 0, hor = 0, horN = 0, by = {}, cnt = {};
    tx.forEach(function (x) {
      if (x.t === 'i') inc += x.a;
      else {
        exp += x.a; by[x.c] = (by[x.c] || 0) + x.a; cnt[x.c] = (cnt[x.c] || 0) + 1;
        if (x.h) { hor += x.a; horN++; }
      }
    });
    return { inc: r2(inc), exp: r2(exp), hor: r2(hor), horN: horN, by: by, cnt: cnt, avail: r2(inc - exp), n: tx.length };
  }
  function lastMonths(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) out.push(addMonths(S.viewYM, -i));
    return out;
  }
  function variation(cur, prev) {
    if (!(Math.abs(prev) > 0)) return null;
    return (cur - prev) / Math.abs(prev);
  }

  /* ---------- recurring payments ---------- */
  function isRecPaid(rec, ym) {
    if (!rec) return false;
    return getTx(ym).some(function (tx) { return tx.r === rec.id; });
  }
  function nextDue(rec) {
    var paid = isRecPaid(rec, TODAY_YM);
    var q = parseYM(TODAY_YM);
    var date = new Date(q.y, q.m - 1, Math.min(rec.day, daysIn(TODAY_YM)));
    if (paid) {
      var nym = addMonths(TODAY_YM, 1);
      var nq = parseYM(nym);
      date = new Date(nq.y, nq.m - 1, Math.min(rec.day, daysIn(nym)));
    }
    var today = new Date(NOW.getFullYear(), NOW.getMonth(), NOW.getDate());
    var diff = Math.round((date - today) / 86400000);
    return { date: date, days: diff, paid: paid, overdue: !paid && diff < 0, dueToday: !paid && diff === 0 };
  }
  function recItems() {
    var recs = (getCfg().recurring || []).slice();
    var items = recs.map(function (r) { return { rec: r, due: nextDue(r) }; });
    items.sort(function (a, b) {
      if (a.due.paid !== b.due.paid) return a.due.paid ? 1 : -1;
      return a.due.date - b.due.date;
    });
    return items;
  }
  function dueClass(due) {
    if (due.paid) return 'paid';
    if (due.days < 0) return 'over';
    if (due.days <= 3) return 'soon';
    return '';
  }
  function dueStatusText(due) {
    if (due.paid) return t('fixed.paid');
    if (due.days < 0) return tn('fixed.overdue', -due.days);
    if (due.days === 0) return t('fixed.dueToday');
    return tn('fixed.dueIn', due.days);
  }
  function recActionLabel(rec) { return rec.type === 'i' ? t('add.incomeBtn') : t('fixed.payNow'); }

  /* ---------- persistence ---------- */
  function lsSave() { if (!S.demo) Storage.save({ cfg: S.cfg, months: S.months }); }
  function persistCfg() { lsSave(); }
  function persistMonth() { lsSave(); }

  /* Storage without movements AND without recurring payments means "fresh":
     fall back to the enriched demo so the donut and evolution curve are full. */
  function storedHasData(stored) {
    if (!stored || !stored.cfg) return false;
    var cfg = normCfg(stored.cfg);
    if (cfg.recurring && cfg.recurring.length) return true;
    var months = sanitizeMonths(stored.months);
    for (var k in months) {
      if (Object.prototype.hasOwnProperty.call(months, k) && months[k].length) return true;
    }
    return false;
  }

  function recDraft() {
    if (!S.recDraft) S.recDraft = { name: '', amount: '', day: '', cat: '', type: 'g' };
    return S.recDraft;
  }
  function captureRecForm() {
    var n = $('#rec-name'), a = $('#rec-amt'), d = $('#rec-day'), c = $('#rec-cat'), ty = $('#rec-type');
    if (!n || !a || !d) return;
    var dr = recDraft();
    dr.name = n.value;
    dr.amount = a.value;
    dr.day = d.value;
    dr.type = ty && ty.value === 'i' ? 'i' : 'g';
    if (c) dr.cat = c.value;
  }

  function isDefaultCatName(id, name) {
    for (var i = 0; i < LANGS.length; i++) {
      var d = DICT[LANGS[i]];
      if (d && d.cat && d.cat[id] === name) return true;
    }
    return false;
  }
  function localizeDefaultCats() {
    if (!S.cfg || !S.cfg.cats) return;
    S.cfg.cats.forEach(function (c) {
      if (DEFAULT_EXP_IDS.indexOf(c.id) >= 0 && isDefaultCatName(c.id, c.name)) c.name = t('cat.' + c.id);
    });
  }

  /* ---------- static UI ---------- */
  function applyStatic() {
    document.documentElement.lang = LANG;
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    $$('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    $$('[data-i18n-title]').forEach(function (el) { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); });
    var sel = $('#langsel');
    if (sel) sel.value = LANG;
  }

  function syncTypeUI() {
    var tg = $('#tg'), ti = $('#ti'), add = $('#addbtn'), hor = $('#hor'), hint = $('#horhint');
    if (!tg) return;
    tg.classList.toggle('on', S.type === 'g');
    ti.classList.toggle('on', S.type === 'i');
    tg.setAttribute('aria-pressed', String(S.type === 'g'));
    ti.setAttribute('aria-pressed', String(S.type === 'i'));
    hor.style.display = S.type === 'g' ? '' : 'none';
    hint.style.display = S.type === 'g' ? '' : 'none';
    add.textContent = t(S.type === 'g' ? 'add.expenseBtn' : 'add.incomeBtn');
  }

  function setView(v) {
    if (['overview', 'movements', 'fixed', 'goals', 'debts'].indexOf(v) < 0) v = 'overview';
    S.view = v;
    var dash = $('#dashboard');
    if (dash) dash.setAttribute('data-view', v);
    $$('#viewtabs button').forEach(function (b) {
      var on = b.dataset.view === v;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
    });
    if (v !== 'movements') S.editTx = null;
    /* The debts card renders a compact summary in Overview and the full
       editor in its own tab, so it must refresh when the view changes. */
    if (S.cfg) renderDebts();
  }

  function setLang(lang) {
    if (!DICT[lang] || !DICT[lang].app) return;
    LANG = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    pluralCache = null;
    demoCache = null;
    applyStatic();
    syncTypeUI();
    if (S.cfg) {
      localizeDefaultCats();
      if (!S.demo) lsSave();
    }
    renderAll();
    renderChips();
    if (S.openSettings) renderSettings();
  }

  /* ---------- actions ---------- */
  var toastT = 0;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  function resetSearch() {
    S.query = '';
    var inp = $('#txsearch');
    if (inp) inp.value = '';
  }

  function startReal() {
    if (!S.demo) return;
    var cur = S.cfg.cur;
    S.demo = false;
    S.cfg = defaultCfg(cur);
    S.months = {};
    demoCache = null;
    S.editTx = null;
    S.recDraft = null;
    S.debtDraft = null;
    S.fxDraft = null;
    resetSearch();
    persistCfg();
    renderDemo();
    renderChips();
  }

  /* Build the enriched sample (Spotify, Netflix, Amazon, Supermercado,
     Alquiler, Gastos Comunes, …) and store it as real, editable data. */
  function demoState() {
    var cur = (S.cfg && S.cfg.cur) || Storage.guessCurrency();
    S.cfg = defaultCfg(cur);
    demoCache = null;
    var cfg = demoCfg();
    var months = {};
    for (var i = 5; i >= 0; i--) {
      var ym = addMonths(TODAY_YM, -i);
      var tx = demoTx(ym);
      if (tx.length) months[ym] = tx;
    }
    return { cfg: cfg, months: months };
  }

  function loadDemo(silent) {
    var data = demoState();
    S.cfg = data.cfg;
    S.months = data.months;
    S.demo = false;
    demoCache = null;
    S.viewYM = TODAY_YM;
    S.limit = 60;
    S.filter = 'all';
    S.confirmDel = null;
    S.editTx = null;
    S.recDraft = null;
    S.debtDraft = null;
    S.fxDraft = null;
    resetSearch();
    var dt = $('#dt');
    if (dt) dt.value = defaultDate(S.viewYM);
    lsSave();
    setView('overview');
    renderAll();
    renderChips();
    if (S.openSettings) closeSettings();
    if (!silent) toast(t('demo.loaded'));
  }

  function defaultDate(ym) {
    if (ym === TODAY_YM) return TODAY_ISO;
    if (ym < TODAY_YM) return ym + '-' + pad(daysIn(ym));
    return ym + '-01';
  }

  function setType(type) {
    S.type = type;
    S.cat = null;
    syncTypeUI();
    renderChips();
  }

  function renderChips() {
    var cfg = getCfg();
    var list = S.type === 'g' ? cfg.cats : incomeCats();
    if (!list.some(function (c) { return c.id === S.cat; })) S.cat = list[0] ? list[0].id : null;
    $('#catchips').innerHTML = list.map(function (c) {
      var on = c.id === S.cat;
      return '<button type="button" class="chip' + (on ? ' on' : '') + '" data-act="cat" data-id="' + esc(c.id) + '" aria-pressed="' + on + '">' +
        (S.type === 'g' ? '<i class="dot" style="background:' + catColor(c.id) + '"></i>' : '') + esc(c.name) + '</button>';
    }).join('');
    $('#curtag').textContent = cfg.cur;
    updateIconPreview();
  }

  function updateIconPreview() {
    var box = $('#iconpreview'), lab = $('#previewlabel');
    if (!box) return;
    var noteEl = $('#note');
    var tx = { n: noteEl ? noteEl.value : '', c: S.cat, t: S.type };
    box.innerHTML = getItemIcon(tx);
    if (lab) lab.textContent = iconLabel(tx);
  }

  function openAdd() {
    S.openAdd = true;
    var sheet = $('#addsheet');
    if (!sheet) return;
    sheet.hidden = false;
    updateIconPreview();
    setTimeout(function () { var a = $('#amt'); if (a) a.focus(); }, 0);
  }

  function closeAdd() {
    S.openAdd = false;
    var sheet = $('#addsheet');
    if (sheet) sheet.hidden = true;
    var hdr = $('#addhdr');
    if (hdr) hdr.focus();
  }

  function addTx() {
    var box = $('#amtbox');
    var amt = parseAmount($('#amt').value);
    if (!(amt > 0)) { box.classList.add('err'); $('#amt').focus(); toast(t('add.amountError')); return; }
    box.classList.remove('err');
    if (!S.cat) { toast(t('add.categoryError')); return; }
    if (S.demo) startReal();
    var date = $('#dt').value || TODAY_ISO;
    var ym = date.slice(0, 7);
    var tx = {
      id: uid(), t: S.type, a: r2(amt), c: S.cat,
      n: $('#note').value.trim().slice(0, 60), d: date,
      h: S.type === 'g' && S.hor ? 1 : 0, r: ''
    };
    if (!S.months[ym]) S.months[ym] = [];
    S.months[ym].push(tx);
    persistMonth(ym);
    var moved = ym !== S.viewYM;
    if (moved) { S.viewYM = ym; }
    $('#amt').value = '';
    $('#note').value = '';
    S.hor = false;
    S.editTx = null;
    resetSearch();
    $('#hor').classList.remove('on');
    $('#hor').setAttribute('aria-pressed', 'false');
    updateIconPreview();
    renderAll();
    var msg = t(tx.t === 'g' ? 'add.addedExpense' : 'add.addedIncome', { amount: money(tx.a) });
    toast(moved ? t('add.addedInMonth', { msg: msg, month: monthLabel(ym) }) : msg);
    closeAdd();
  }

  function delTx(id) {
    var arr = S.months[S.viewYM] || [];
    var i = arr.findIndex(function (tx) { return tx.id === id; });
    if (i < 0) return;
    arr.splice(i, 1);
    if (!arr.length) delete S.months[S.viewYM];
    S.confirmDel = null;
    if (S.editTx === id) S.editTx = null;
    persistMonth(S.viewYM);
    renderAll();
    toast(t('list.deleted'));
  }

  function saveEdit(id) {
    var arr = S.months[S.viewYM] || [];
    var tx = arr.find(function (x) { return x.id === id; });
    if (!tx) return;
    var amt = parseAmount($('#edit-amt').value);
    if (!(amt > 0)) { toast(t('add.amountError')); $('#edit-amt').focus(); return; }
    tx.a = r2(amt);
    tx.n = ($('#edit-note').value || '').trim().slice(0, 60);
    S.editTx = null;
    persistMonth(S.viewYM);
    renderAll();
    toast(t('list.updated'));
  }

  function gotoMonth(ym) {
    S.viewYM = ym;
    S.limit = 60;
    S.confirmDel = null;
    S.editTx = null;
    resetSearch();
    $('#dt').value = defaultDate(ym);
    renderAll();
  }

  function addRecurring() {
    var nameEl = $('#rec-name'), amtEl = $('#rec-amt'), dayEl = $('#rec-day'), catEl = $('#rec-cat'), tyEl = $('#rec-type');
    if (!nameEl || !amtEl || !dayEl) return;
    var name = nameEl.value.trim();
    var amt = parseAmount(amtEl.value);
    var day = parseInt(dayEl.value, 10);
    var type = tyEl && tyEl.value === 'i' ? 'i' : 'g';
    if (!name) { toast(t('fixed.nameError')); nameEl.focus(); return; }
    if (!(amt > 0)) { toast(t('fixed.amountError')); amtEl.focus(); return; }
    if (!(day >= 1 && day <= 31)) { toast(t('fixed.dayError')); dayEl.focus(); return; }
    var item = {
      id: uid(), name: name.slice(0, 40), amount: r2(amt),
      day: Math.round(day),
      cat: catEl ? catEl.value : (type === 'i' ? INCOME_IDS[0] : ((getCfg().cats[0] && getCfg().cats[0].id) || 'otr')),
      type: type
    };
    if (S.demo) startReal();
    if (!S.cfg.recurring) S.cfg.recurring = [];
    S.cfg.recurring.push(item);
    persistCfg();
    S.recDraft = null;
    S.debtDraft = null;
    S.fxDraft = null;
    renderAll();
    toast(t('fixed.addedToast', { name: item.name }));
  }

  function delRecurring(id) {
    if (S.demo || !S.cfg.recurring) return;
    S.cfg.recurring = S.cfg.recurring.filter(function (r) { return r.id !== id; });
    persistCfg();
    renderAll();
    toast(t('fixed.deleted'));
  }

  function payRecurring(id) {
    var cfg = getCfg();
    var rec = (cfg.recurring || []).find(function (r) { return r.id === id; });
    if (!rec) return;
    if (isRecPaid(rec, TODAY_YM)) { toast(t('fixed.alreadyPaid', { name: rec.name })); return; }
    var item = { id: rec.id, name: rec.name, amount: rec.amount, day: rec.day, cat: rec.cat, type: rec.type || 'g' };
    if (S.demo) {
      startReal();
      if (!S.cfg.recurring) S.cfg.recurring = [];
      S.cfg.recurring.push(item);
      persistCfg();
      renderChips();
    }
    var ym = TODAY_YM;
    var tx = {
      id: uid(), t: item.type === 'i' ? 'i' : 'g', a: r2(item.amount),
      c: item.cat || (item.type === 'i' ? INCOME_IDS[0] : ((S.cfg.cats[0] && S.cfg.cats[0].id) || 'otr')),
      n: item.name.slice(0, 60), d: TODAY_ISO, h: 0, r: item.id
    };
    if (!S.months[ym]) S.months[ym] = [];
    S.months[ym].push(tx);
    persistMonth(ym);
    S.viewYM = ym;
    S.editTx = null;
    resetSearch();
    renderAll();
    toast(t('fixed.paidToast', { name: item.name, amount: money(item.amount) }));
  }

  /* ---------- render ---------- */
  function renderAll() {
    $('#mlabel').textContent = monthLabel(S.viewYM);
    renderDemo();
    renderKpis();
    renderCompare();
    renderDebts();
    renderDonut();
    renderPace();
    renderUpcoming();
    renderFixed();
    renderGoal();
    renderHistory();
    renderList();
    $('#curtag').textContent = getCfg().cur;
  }

  var CURRENCY_FALLBACK = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'KRW', 'INR', 'BRL', 'ARS', 'MXN', 'CLP', 'COP', 'PEN', 'UYU', 'PYG', 'BOB', 'VES', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'TRY', 'ZAR', 'AED', 'SAR', 'ILS', 'SGD', 'HKD', 'NZD', 'THB', 'IDR', 'MYR', 'PHP', 'VND', 'EGP', 'NGN', 'KES', 'MAD', 'UAH', 'RSD', 'ISK', 'TWD', 'PKR', 'BDT', 'LKR', 'NPR'];

  function currencyOptions(sel) {
    var codes;
    try { codes = Intl.supportedValuesOf('currency').slice(); } catch (e) { codes = CURRENCY_FALLBACK.slice(); }
    CURRENCY_FALLBACK.forEach(function (c) { if (codes.indexOf(c) < 0) codes.push(c); });
    if (codes.indexOf(sel) < 0) codes.push(sel);
    var dn = null;
    try { dn = new Intl.DisplayNames([locale()], { type: 'currency' }); } catch (e) {}
    var items = codes.map(function (c) {
      var n = c;
      try { if (dn) n = dn.of(c) || c; } catch (e) {}
      return [c, n];
    });
    items.sort(function (a, b) { return a[1].localeCompare(b[1], locale()); });
    return items.map(function (x) {
      return '<option value="' + x[0] + '"' + (x[0] === sel ? ' selected' : '') + '>' + esc(x[0] + ' · ' + x[1]) + '</option>';
    }).join('');
  }

  function languageOptions() {
    return LANGS.map(function (code) {
      return '<option value="' + code + '"' + (code === LANG ? ' selected' : '') + '>' + esc(code.toUpperCase() + ' · ' + DICT[code].name) + '</option>';
    }).join('');
  }

  function renderDemo() {
    var el = $('#demo');
    if (!S.demo) { el.innerHTML = ''; return; }
    el.innerHTML = '<div class="demo"><p><b>' + t('demo.title') + '</b> ' + t('demo.body') + '</p>' +
      '<label class="sr" for="d-cur">' + t('settings.currency') + '</label>' +
      '<select class="field" id="d-cur" style="width:auto;max-width:100%">' + currencyOptions(S.cfg.cur) + '</select>' +
      '<button type="button" class="primary" data-act="start">' + t('demo.start') + '</button></div>';
  }

  /* ---------- KPI row ---------- */
  function kpiIcon(kind) {
    var paths = {
      balance: '<rect x="3" y="6" width="18" height="13" rx="3"/><path d="M3 10h18"/><circle cx="16.5" cy="14.5" r="1.2"/>',
      income: '<path d="M12 19V5M6 11l6-6 6 6"/>',
      expenses: '<path d="M12 5v14M6 13l6 6 6-6"/>',
      micro: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>',
      projection: '<path d="M3 17l5-5 4 3 8-9"/><path d="M16 6h4v4"/>'
    };
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (paths[kind] || paths.balance) + '</svg>';
  }

  /* ---------- brand & category icon resolver (100% inline SVG, offline) ---------- */
  function sSvg(body) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  }
  function fSvg(body) {
    return '<svg viewBox="0 0 24 24" fill="currentColor">' + body + '</svg>';
  }

  var ICON = {
    spotify: sSvg('<path d="M4.5 8.8c4.6-1.5 10-.9 14.4 1.7"/><path d="M5.7 12.4c3.8-1.1 8.2-.6 11.8 1.5"/><path d="M6.9 15.9c3-.9 6.3-.4 9.1 1.2"/>'),
    netflix: fSvg('<path d="M4.8 3h3.4v18H4.8z"/><path d="M15.8 3H19v18h-3.2z"/><path d="M8.2 3l7.6 18h-3.4L4.8 3z" opacity=".72"/>'),
    amazon: sSvg('<path d="M3.5 13.8c4.8 3.4 12 3.5 17-.3"/><path d="M17.4 11.2l3.3 2.4-3.3 2.4"/><path d="M8.4 8.2c.4-1.7 1.7-2.7 3.6-2.7s3.2 1 3.6 2.7" opacity=".55"/>'),
    youtube: fSvg('<path d="M21.5 7.3c-.2-1-1-1.8-2-2C17.8 4.9 12 4.9 12 4.9s-5.8 0-7.5.4c-1 .2-1.8 1-2 2C2 9.1 2 12 2 12s0 2.9.5 4.7c.2 1 1 1.8 2 2 1.7.4 7.5.4 7.5.4s5.8 0 7.5-.4c1-.2 1.8-1 2-2 .5-1.8.5-4.7.5-4.7s0-2.9-.5-4.7z" opacity=".42"/><path d="M10 8.7v6.6l5.4-3.3z"/>'),
    disney: fSvg('<path d="M2.5 20.5V9.8h3V7.2h2.2v2.6h2V8.1L12 4.4l2.3 3.7v1.7h2V7.2h2.2v2.6h3v10.7z"/><path d="M10.7 20.5v-5.2h2.6v5.2z" opacity=".45"/>'),
    hbo: fSvg('<path d="M3 3h3.3v18H3zM17.7 3H21v18h-3.3z"/><path d="M8.2 3h7.6v3.2h-2.2v3.6h2.2v3.2h-2.2v5H8.2v-5h2.2v-3.2H8.2V6.2h2.2V3z"/>'),
    max: sSvg('<path d="M3 19.5V5l6 8.5 6-8.5v14.5"/><path d="M18 19.5V5"/>'),
    twitch: fSvg('<path d="M4 3h16.5v11.2l-4.6 4.6h-4.2L8.8 22v-3.2H4z"/><path d="M9.2 7v6.2M15 7v6.2" stroke="#10131a" stroke-width="1.8" stroke-linecap="round"/>'),
    steam: sSvg('<circle cx="12" cy="12" r="6.3"/><circle cx="14.8" cy="9.2" r="2.4"/><path d="M3.5 18.5l4.2-3.2M6.6 21l3.2-2.6"/>'),
    playstation: fSvg('<path d="M7.4 2.8V17c0 2.3-1.3 3.7-3.3 3.7-1.9 0-3.2-1.3-3.2-3.2h2.9c0 .8.3 1.2.8 1.2.6 0 .9-.5.9-1.5V2.8z"/><path d="M17.4 15.1l-2.2.7V9.8c0-2.8 1.8-4.6 4.6-4.6 1.1 0 2 .3 2.7.9l-1.5 2c-.3-.3-.7-.5-1.1-.5-1.2 0-1.7.8-1.7 2.2v4.7l3.5-1.1v2.3l-3.5 1.1v3.7l-2.2.7z"/>'),
    xbox: sSvg('<circle cx="12" cy="12" r="9"/><path d="M7.2 5.4c4.2 2 7.4 5.8 8.8 10.4M16.8 5.4c-4.2 2-7.4 5.8-8.8 10.4"/>'),
    car: sSvg('<path d="M3.3 15.3l2-5.2h13.4l2 5.2"/><path d="M3.3 15.3h17.4v4.1H3.3z"/><circle cx="7" cy="19.4" r="1.7"/><circle cx="17" cy="19.4" r="1.7"/><path d="M6.2 12.2h2M15.8 12.2h2"/>'),
    fuel: sSvg('<path d="M4.5 21V5.2a2 2 0 012-2h6a2 2 0 012 2V21"/><path d="M3.5 21h12"/><path d="M14.5 8h2.8l2.2 3v6.2a2 2 0 01-4 0v-4.1h-1"/><path d="M7 8h5"/>'),
    cup: sSvg('<path d="M4.5 8h11v5.6a5.5 5.5 0 01-5.5 5.5h0A5.5 5.5 0 014.5 13.6z"/><path d="M15.5 9.2h2a2.6 2.6 0 010 5.2h-2"/><path d="M8 3.2c0 1.1-1 1.6-1 2.7M12.2 3.2c0 1.1-1 1.6-1 2.7"/>'),
    burger: sSvg('<path d="M3.8 11.2c0-4.2 3.7-7.4 8.2-7.4s8.2 3.2 8.2 7.4z"/><path d="M3.2 13.6h17.6v2.2H3.2z"/><path d="M4.3 17.4h15.4l-1.2 3.4H5.5z"/>'),
    home: sSvg('<path d="M3 10.8l9-7 9 7"/><path d="M5.2 9.7V20h13.6V9.7"/><path d="M9.8 20v-6h4.4v6"/>'),
    key: sSvg('<circle cx="8.2" cy="12" r="4.2"/><path d="M12.4 12h8.3M17.3 12v3M20.7 12v2.2"/>'),
    building: sSvg('<path d="M4 20.5V4h9.8v16.5M13.8 9h6.2v11.5"/><path d="M6.8 7h2.2M6.8 11h2.2M6.8 15h2.2M16.2 12.5h1M16.2 16h1"/><path d="M3 20.5h18"/>'),
    bolt: sSvg('<path d="M13.2 2.5L4.5 14h6l-1 7.5 9.5-12h-6z"/>'),
    wifi: sSvg('<path d="M2.5 8.2a14 14 0 0119 0M5.6 12a9.6 9.6 0 0112.8 0M8.8 15.8a5 5 0 016.4 0"/><circle cx="12" cy="19.5" r="1"/>'),
    cart: sSvg('<circle cx="9" cy="19.8" r="1.5"/><circle cx="17.6" cy="19.8" r="1.5"/><path d="M2.8 4h2.4l2.5 11.2h11.3l2.2-7.4H6.2"/>'),
    health: sSvg('<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 7.8v8.4M7.8 12h8.4"/>'),
    ticket: sSvg('<path d="M3 7h18v3.2a1.9 1.9 0 000 3.6V17H3v-3.2a1.9 1.9 0 000-3.6z"/><path d="M11.5 7.4v9.2" stroke-dasharray="2 2.4"/>'),
    card: sSvg('<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>'),
    refresh: sSvg('<path d="M20 7.2v5h-5M4 16.8v-5h5"/><path d="M18.6 12.2a6.7 6.7 0 00-11.4-4.7L4 10.8M5.4 11.8a6.7 6.7 0 0011.4 4.7l3.2-3.3"/>'),
    cap: sSvg('<path d="M2.2 9.2L12 4l9.8 5.2-9.8 5.2z"/><path d="M6 11.4v4.8c0 1.8 2.7 3.2 6 3.2s6-1.4 6-3.2v-4.8"/><path d="M21.8 9.2v6"/>'),
    book: sSvg('<path d="M4 3.5h6.6A2.6 2.6 0 0113.2 6v14a2.6 2.6 0 00-2.6-2.4H4z"/><path d="M20 3.5h-3.4a2.6 2.6 0 00-2.6 2.6V20a2.6 2.6 0 012.6-2.4H20z"/>'),
    banknote: sSvg('<rect x="2" y="5.8" width="20" height="12.4" rx="3"/><circle cx="12" cy="12" r="2.6"/><path d="M5.8 12h.01M18.2 12h.01"/>'),
    wallet: sSvg('<path d="M3 7h15a3 3 0 013 3v7a3 3 0 01-3 3H3z"/><path d="M3 7V4.8h13V7M16 13.5h4"/>'),
    other: sSvg('<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>')
  };

  var BRAND = {
    spotify: { bg: '#1DB954', fg: '#ffffff', svg: 'spotify', label: 'Spotify' },
    netflix: { bg: '#E50914', fg: '#ffffff', svg: 'netflix', label: 'Netflix' },
    amazon: { bg: '#FF9900', fg: '#1f2937', svg: 'amazon', label: 'Amazon / Prime' },
    youtube: { bg: '#FF0000', fg: '#ffffff', svg: 'youtube', label: 'YouTube' },
    disney: { bg: '#1A53F0', fg: '#ffffff', svg: 'disney', label: 'Disney+' },
    hbo: { bg: '#6D28D9', fg: '#ffffff', svg: 'hbo', label: 'HBO / Max' },
    max: { bg: '#002BE7', fg: '#ffffff', svg: 'max', label: 'Max' },
    twitch: { bg: '#9146FF', fg: '#ffffff', svg: 'twitch', label: 'Twitch' },
    steam: { bg: '#1B2838', fg: '#ffffff', svg: 'steam', label: 'Steam' },
    playstation: { bg: '#0070D1', fg: '#ffffff', svg: 'playstation', label: 'PlayStation' },
    xbox: { bg: '#107C10', fg: '#ffffff', svg: 'xbox', label: 'Xbox' },
    uber: { bg: '#111318', fg: '#ffffff', svg: 'car', label: 'Uber' },
    cabify: { bg: '#662D91', fg: '#ffffff', svg: 'car', label: 'Cabify' },
    didi: { bg: '#FF7A00', fg: '#ffffff', svg: 'car', label: 'DiDi' },
    taxi: { bg: '#F5C518', fg: '#1f2937', svg: 'car', label: 'Taxi' },
    fuel: { bg: '#2563EB', fg: '#ffffff', svg: 'fuel', label: 'Fuel' },
    starbucks: { bg: '#00754A', fg: '#ffffff', svg: 'cup', label: 'Starbucks' },
    cafe: { bg: '#8B5E3C', fg: '#ffffff', svg: 'cup', label: 'Coffee' },
    mcdonald: { bg: '#DA291C', fg: '#FFC72C', svg: 'burger', label: 'McDonald’s' },
    burger: { bg: '#D97706', fg: '#ffffff', svg: 'burger', label: 'Burger' },
    delivery: { bg: '#EA580C', fg: '#ffffff', svg: 'burger', label: 'Delivery' },
    pedidosya: { bg: '#E11D2A', fg: '#ffffff', svg: 'burger', label: 'PedidosYa' },
    rappi: { bg: '#FF441F', fg: '#ffffff', svg: 'burger', label: 'Rappi' }
  };

  var BRAND_RULES = [
    { re: /\bspotify\b/i, d: BRAND.spotify },
    { re: /\bnetflix\b/i, d: BRAND.netflix },
    { re: /\bamazon\b|\bprime\b/i, d: BRAND.amazon },
    { re: /\byoutube\b/i, d: BRAND.youtube },
    { re: /\bdisney\b|\bdisney\s*\+\b/i, d: BRAND.disney },
    { re: /\bhbo\b/i, d: BRAND.hbo },
    { re: /\bmax\b/i, d: BRAND.max },
    { re: /\btwitch\b/i, d: BRAND.twitch },
    { re: /\bsteam\b/i, d: BRAND.steam },
    { re: /\bplaystation\b|\bps[45]?\b/i, d: BRAND.playstation },
    { re: /\bxbox\b/i, d: BRAND.xbox },
    { re: /\buber\b/i, d: BRAND.uber },
    { re: /\bcabify\b/i, d: BRAND.cabify },
    { re: /\bdidi\b/i, d: BRAND.didi },
    { re: /\btaxi\b/i, d: BRAND.taxi },
    { re: /\bnafta\b|\bcombustible\b|\bfuel\b|\bgasolin[aae]\b|\bbenzina\b|\bessence\b/i, d: BRAND.fuel },
    { re: /\bstarbucks\b/i, d: BRAND.starbucks },
    { re: /\bcaf[eé]\b|\bcoffee\b|\bcafe\b|\bcaffe\b/i, d: BRAND.cafe },
    { re: /\bmcdonald|\bmc\s?donald|\bmcdo/i, d: BRAND.mcdonald },
    { re: /\bpedidos\s?ya\b/i, d: BRAND.pedidosya },
    { re: /\brappi\b/i, d: BRAND.rappi },
    { re: /\bburger\b|\bhamburguesa\b/i, d: BRAND.burger },
    { re: /\bdelivery\b|\breparto\b|\blieferung\b/i, d: BRAND.delivery }
  ];

  var NOTE_RULES = [
    { re: /\beduc|clase|colegio|universidad|course|school|schule|éducation|обуч|学/i, d: { bg: '#7C3AED', fg: '#ffffff', svg: 'cap', label: 'Education' } },
    { re: /\bcurso\b|\blibro\b|\bbook\b/i, d: { bg: '#7C3AED', fg: '#ffffff', svg: 'book', label: 'Book' } },
    { re: /\bsueldo\b|\bsalary\b|\bpayroll\b|\bfreelance\b|\bingreso\b|\bincome\b|\bsalaire\b|\blohn\b|зарплат|給与/i, d: { bg: '#059669', fg: '#ffffff', svg: 'banknote', key: 'common.incomeFallback' } },
    { re: /\balquiler\b|\brent\b|\barriendo\b|\bloyer\b|\baffitto\b|\bmiete\b|аренд|家賃|\bvivienda\b/i, d: { bg: '#3B82F6', fg: '#ffffff', svg: 'home', key: 'cat.viv' } },
    { re: /\bgasto|\bcommon|\butilit|\bservicio|\belectric|\bluz\b|\bagua\b|\binternet\b|\bwater\b|\bpower\b|\butility\b|strom|электр|水|\blight\b/i, d: { bg: '#0EA5E9', fg: '#ffffff', svg: 'building', key: 'cat.srv' } },
    { re: /\bsuper|\bmercado\b|\bgrocer|\bmarket\b|\baliment|\bsupermarch|\bsupermercat|lebensmittel|продукт|食料/i, d: { bg: '#16A34A', fg: '#ffffff', svg: 'cart', key: 'cat.sup' } },
    { re: /\btransport|\bbus\b|\bmetro\b|\btransit\b|транспорт|交通/i, d: { bg: '#F59E0B', fg: '#1f2937', svg: 'car', key: 'cat.trn' } },
    { re: /\bsalud\b|\bhealth\b|\bfarmacia\b|\bpharma|\bmedic|\bdoctor|здоров|医院/i, d: { bg: '#EF4444', fg: '#ffffff', svg: 'health', key: 'cat.sal' } },
    { re: /\bocio\b|\bleisure\b|\bsalida|\bdinner\b|\bcinema\b|\bmovie\b|\bgame\b|\brestaurant|развлеч|娯楽/i, d: { bg: '#A855F7', fg: '#ffffff', svg: 'ticket', key: 'cat.ocio' } },
    { re: /\bsuscrip|\bsubscri|\bstreaming\b|\bnetflix\b|\bspotify\b|\bhbo\b|\btwitch\b|\babonnement|\babo\b|подпис|サブスク/i, d: { bg: '#6366F1', fg: '#ffffff', svg: 'card', key: 'cat.sus' } },
    { re: /\bcompra|\bshop|\bstore\b|\bropa\b|\bshoes\b|\bachat|\beinkauf|покуп|買い物/i, d: { bg: '#EC4899', fg: '#ffffff', svg: 'cart', key: 'cat.com' } }
  ];

  var CAT_ICON = {
    viv: { bg: '#3B82F6', fg: '#ffffff', svg: 'home', key: 'cat.viv' },
    srv: { bg: '#0EA5E9', fg: '#ffffff', svg: 'building', key: 'cat.srv' },
    sup: { bg: '#16A34A', fg: '#ffffff', svg: 'cart', key: 'cat.sup' },
    trn: { bg: '#F59E0B', fg: '#1f2937', svg: 'car', key: 'cat.trn' },
    sal: { bg: '#EF4444', fg: '#ffffff', svg: 'health', key: 'cat.sal' },
    ocio: { bg: '#A855F7', fg: '#ffffff', svg: 'ticket', key: 'cat.ocio' },
    sus: { bg: '#6366F1', fg: '#ffffff', svg: 'card', key: 'cat.sus' },
    com: { bg: '#EC4899', fg: '#ffffff', svg: 'cart', key: 'cat.com' },
    otr: { bg: '#64748B', fg: '#ffffff', svg: 'other', key: 'cat.otr' },
    sueldo: { bg: '#059669', fg: '#ffffff', svg: 'banknote', key: 'common.incomeFallback' },
    free: { bg: '#059669', fg: '#ffffff', svg: 'wallet', key: 'inc.free' },
    otri: { bg: '#059669', fg: '#ffffff', svg: 'wallet', key: 'common.incomeFallback' }
  };

  function normText(s) {
    var v = String(s == null ? '' : s).toLowerCase();
    try { v = v.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); } catch (e) {}
    return v;
  }

  function resolveItemIcon(tx, catOnly) {
    if (!tx) tx = {};
    var text = catOnly ? '' : normText(tx.n || tx.name || '');
    var i, def;
    if (text) {
      for (i = 0; i < BRAND_RULES.length; i++) {
        if (BRAND_RULES[i].re.test(text)) return BRAND_RULES[i].d;
      }
      for (i = 0; i < NOTE_RULES.length; i++) {
        if (NOTE_RULES[i].re.test(text)) return NOTE_RULES[i].d;
      }
    }
    var id = String(tx.c || tx.cat || '');
    if (tx.t === 'i' && !CAT_ICON[id]) return CAT_ICON.sueldo;
    def = CAT_ICON[id] || CAT_ICON.otr;
    return def;
  }

  function getItemIcon(tx, catOnly) {
    var d = resolveItemIcon(tx, catOnly);
    var label = d.key ? t(d.key) : d.label;
    return '<span class="item-icon" role="img" aria-label="' + esc(label) + '" style="background:' + d.bg + ';color:' + d.fg + '">' +
      (ICON[d.svg] || ICON.other) + '</span>';
  }

  function iconLabel(tx, catOnly) {
    var d = resolveItemIcon(tx, catOnly);
    return d.key ? t(d.key) : d.label;
  }

  function sparkline(vals, color, idx) {
    if (!vals || vals.length < 2) return '';
    var w = 140, h = 42, p = 3;
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals);
    if (!isFinite(min) || !isFinite(max)) return '';
    if (max - min < 1e-9) { max = min + 1; min = min - 1; }
    var pts = vals.map(function (v, i) {
      var x = p + (i * (w - 2 * p) / (vals.length - 1));
      var y = h - p - ((v - min) / (max - min)) * (h - 2 * p);
      return [x, y];
    });
    var d = smoothPath(pts);
    var last = pts[pts.length - 1];
    var area = d + ' L' + last[0].toFixed(1) + ' ' + (h - p) + ' L' + pts[0][0].toFixed(1) + ' ' + (h - p) + ' Z';
    var id = 'sparkGrad' + idx;
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + color + '" stop-opacity=".34"/>' +
      '<stop offset="1" stop-color="' + color + '" stop-opacity="0"/>' +
      '</linearGradient></defs>' +
      '<path d="' + area + '" fill="url(#' + id + ')"/>' +
      '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.4" fill="' + color + '"/>' +
      '</svg>';
  }

  /* Current balance + pending recurring income − pending fixed bills. */
  function projection() {
    var st = monthStats(S.viewYM);
    var inc = 0, exp = 0, incN = 0, expN = 0;
    (getCfg().recurring || []).forEach(function (r) {
      if (isRecPaid(r, S.viewYM)) return;
      if (r.type === 'i') { inc += r.amount; incN++; }
      else { exp += r.amount; expN++; }
    });
    return {
      balance: st.avail, inc: r2(inc), exp: r2(exp), incN: incN, expN: expN,
      projected: r2(st.avail + inc - exp)
    };
  }

  function renderKpis() {
    var ms = lastMonths(6);
    var stats = ms.map(function (ym) { return monthStats(ym); });
    var st = stats[stats.length - 1];
    var prev = stats[stats.length - 2] || st;
    var items = [
      { key: 'balance', label: t('kpi.balance'), value: st.avail, prev: prev.avail, goodUp: true, color: C.accent, series: stats.map(function (s) { return s.avail; }) },
      { key: 'income', label: t('kpi.income'), value: st.inc, prev: prev.inc, goodUp: true, color: C.good, series: stats.map(function (s) { return s.inc; }) },
      { key: 'expenses', label: t('kpi.expenses'), value: st.exp, prev: prev.exp, goodUp: false, color: C.bad, series: stats.map(function (s) { return s.exp; }) },
      { key: 'micro', label: t('kpi.micro'), value: st.hor, prev: prev.hor, goodUp: false, color: C.warn, series: stats.map(function (s) { return s.hor; }) }
    ];
    var html = '<div class="kpihead"><h2>' + esc(t('kpi.group')) + '</h2><span>' + esc(monthLabel(S.viewYM)) + '</span></div>';
    html += items.map(function (it, idx) {
      var d = variation(it.value, it.prev);
      var cls = 'flat', txt = '—', kvs = t('kpi.noPrev'), arrow = '';
      if (d != null) {
        var good = (d >= 0) === it.goodUp;
        cls = Math.abs(d) < 0.0005 ? 'flat' : (good ? 'good' : 'bad');
        txt = signedPct(d);
        arrow = d > 0 ? '↑' : d < 0 ? '↓' : '→';
        kvs = t('kpi.vsPrev');
      }
      return '<article class="kpi ' + it.key + '">' +
        '<div class="khead"><span class="klabel">' + esc(it.label) + '</span><span class="kicon">' + kpiIcon(it.key) + '</span></div>' +
        '<div class="kval' + (it.value < 0 ? ' neg' : '') + '">' + esc(money(it.value)) + '</div>' +
        '<div class="kfoot"><span class="delta ' + cls + '">' + arrow + ' ' + esc(txt) + '</span><span class="kvs">' + esc(kvs) + '</span></div>' +
        sparkline(it.series, it.color, idx) +
        '</article>';
    }).join('');
    var p = projection();
    html += '<article class="kpi projection">' +
      '<div class="khead"><span class="klabel">' + esc(t('kpi.projection')) + '</span><span class="kicon">' + kpiIcon('projection') + '</span></div>' +
      '<div class="kval' + (p.projected < 0 ? ' neg' : '') + '">' + esc(money(p.projected)) + '</div>' +
      '<div class="projparts">' +
        '<span class="pin">' + esc(t('projection.current')) + ' <b>' + esc(money(p.balance)) + '</b></span>' +
        '<span class="pin">' + esc(t('projection.income')) + ' <b>+' + esc(money(p.inc)) + '</b></span>' +
        '<span class="pout">' + esc(t('projection.expenses')) + ' <b>−' + esc(money(p.exp)) + '</b></span>' +
      '</div>' +
      '<div class="projcount' + (p.expN ? '' : ' allpaid') + '">' +
        esc(p.expN ? tn('projection.left', p.expN) : t('projection.none')) +
      '</div>' +
      '</article>';
    $('#kpis').innerHTML = html;
  }

  /* ---------- month-over-month comparison ---------- */
  function deltaText(n) {
    return (n > 0 ? '+' : n < 0 ? '−' : '') + money(Math.abs(n), true);
  }

  function compareData() {
    var ym = S.viewYM, prevYM = addMonths(ym, -1);
    var cur = monthStats(ym), prev = monthStats(prevYM);
    var ids = {};
    Object.keys(cur.by).concat(Object.keys(prev.by)).forEach(function (id) { ids[id] = 1; });
    getCfg().cats.forEach(function (c) { ids[c.id] = 1; });
    var rows = Object.keys(ids).map(function (id) {
      var a = cur.by[id] || 0, b = prev.by[id] || 0;
      return { id: id, name: catNameById(id), cur: a, prev: b, delta: r2(a - b) };
    }).filter(function (r) { return r.cur > 0 || r.prev > 0; });
    var up = rows.filter(function (r) { return r.delta > 0; }).sort(function (a, b) { return b.delta - a.delta; }).slice(0, 3);
    var down = rows.filter(function (r) { return r.delta < 0; }).sort(function (a, b) { return a.delta - b.delta; }).slice(0, 3);
    return {
      cur: cur.exp, prev: prev.exp, diff: r2(cur.exp - prev.exp),
      pct: variation(cur.exp, prev.exp), up: up, down: down,
      hasData: cur.n > 0 && prev.n > 0,
      prevLabel: monthShort(prevYM)
    };
  }

  function cmpRows(rows, cls) {
    if (!rows.length) return '<p class="cmpnone">—</p>';
    return rows.map(function (r) {
      return '<div class="cmprow"><span class="cn">' + esc(r.name) + '</span>' +
        '<span class="cd ' + cls + '">' + esc(deltaText(r.delta)) + '</span></div>';
    }).join('');
  }

  function renderCompare() {
    var d = compareData();
    var head = '<div class="ct">' + esc(t('compare.title')) + '<span class="sub">' + esc(t('compare.prev', { month: d.prevLabel })) + '</span></div>';
    if (!d.hasData) {
      $('#compare').innerHTML = head + '<p class="empty">' + esc(t('compare.noData')) + '</p>';
      return;
    }
    var dcls = d.diff > 0 ? 'bad' : d.diff < 0 ? 'good' : 'flat';
    var change = d.pct == null ? t('compare.flat') : signedPct(d.pct);
    $('#compare').innerHTML = head +
      '<div class="cmphead"><div><div class="cmpbig">' + esc(money(d.cur, true)) + '</div>' +
      '<span class="muted">' + esc(t('compare.thisMonth')) + ' · ' + esc(t('compare.prevMonth')) + ' ' + esc(money(d.prev, true)) + '</span></div>' +
      '<span class="cmpdelta ' + dcls + '">' + esc(change) + ' <span>' + esc(deltaText(d.diff)) + '</span></span></div>' +
      '<div class="cmpcols"><div class="cmpcol"><h4>' + esc(t('compare.up')) + '</h4>' + cmpRows(d.up, 'bad') + '</div>' +
      '<div class="cmpcol"><h4>' + esc(t('compare.down')) + '</h4>' + cmpRows(d.down, 'good') + '</div></div>';
  }

  /* ---------- donut ---------- */
  function renderDonut() {
    var cfg = getCfg(), st = monthStats(S.viewYM);
    var ids = cfg.cats.map(function (c) { return c.id; });
    var rows = cfg.cats.map(function (c) {
      return { id: c.id, name: c.name, spent: r2(st.by[c.id] || 0), count: st.cnt[c.id] || 0 };
    }).filter(function (r) { return r.spent > 0; });
    var unk = 0, unkN = 0;
    Object.keys(st.by).forEach(function (k) {
      if (ids.indexOf(k) < 0) { unk += st.by[k]; unkN += st.cnt[k] || 0; }
    });
    if (unk > 0) rows.push({ id: '__x', name: t('common.uncategorized'), spent: r2(unk), count: unkN });
    rows.sort(function (a, b) { return b.spent - a.spent; });
    var total = rows.reduce(function (a, r) { return a + r.spent; }, 0);
    var totalN = rows.reduce(function (a, r) { return a + r.count; }, 0);
    var head = '<div class="ct">' + t('donut.title') + '<span class="sub">' + esc(monthLabel(S.viewYM)) + '</span></div>';
    if (!(total > 0)) {
      $('#donut').innerHTML = head + '<p class="empty">' + esc(t('donut.empty')) + '</p>' +
        '<button type="button" class="ghost demo-load" data-act="load-demo">' + esc(t('demo.load')) + '</button>';
      return;
    }
    var R = 52, CIRC = 2 * Math.PI * R, off = 0;
    var segs = rows.map(function (r) {
      var frac = r.spent / total;
      var len = Math.max(frac * CIRC - (rows.length > 1 ? 2.5 : 0), 0.5);
      var seg = '<circle class="seg" data-cat="' + esc(r.id) + '" cx="80" cy="80" r="' + R + '" fill="none" stroke="' + catColor(r.id) + '" stroke-dasharray="' + len.toFixed(2) + ' ' + (CIRC - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 80 80)" tabindex="0" role="button" aria-label="' + esc(r.name + ' · ' + sharePct(frac)) + '"><title>' + esc(r.name + ' · ' + sharePct(frac)) + '</title></circle>';
      off += frac * CIRC;
      return seg;
    }).join('');
    var legend = rows.map(function (r) {
      return '<li><button type="button" class="drow" data-cat="' + esc(r.id) + '">' +
        getItemIcon({ c: r.id, t: 'g' }, true) +
        '<span class="dinfo"><span class="dname">' + esc(r.name) + '</span><span class="dmeta">' + esc(tn('donut.txCount', r.count)) + '</span></span>' +
        '<span class="damt">' + money(r.spent, true) + '</span>' +
        '<span class="dpct">' + sharePct(r.spent / total) + '</span></button></li>';
    }).join('');
    $('#donut').innerHTML = head +
      '<div class="donutwrap"><div class="donutbox"><svg class="donut" viewBox="0 0 160 160" role="img" aria-label="' + esc(t('donut.aria')) + '">' + segs +
        '<text class="dtotal" id="dcenter-val" x="80" y="78">' + esc(money(total, true)) + '</text>' +
        '<text class="dsub" id="dcenter-lab" x="80" y="94">' + esc(t('donut.totalLabel')) + '</text>' +
      '</svg></div><ul class="dlegend">' + legend + '</ul></div>' +
      '<div class="donutfoot"><span>' + esc(tn('donut.categories', rows.length)) + '</span><span>' + esc(tn('donut.transactions', totalN)) + '</span></div>';
    bindDonut(rows, total);
  }

  function bindDonut(rows, total) {
    var svg = $('#donut .donut'), val = $('#dcenter-val'), lab = $('#dcenter-lab');
    if (!svg || !val || !lab) return;
    var totalLabel = t('donut.totalLabel');
    var pinned = null;
    function paint(cat) {
      var sel = cat || pinned;
      $$('#donut .seg').forEach(function (s) { s.classList.toggle('sel', s.dataset.cat === sel); });
      $$('#donut .drow').forEach(function (b) { b.classList.toggle('on', b.dataset.cat === sel); });
      svg.classList.toggle('has-sel', !!sel);
      var row = rows.find(function (r) { return r.id === sel; });
      if (row) {
        val.textContent = money(row.spent, true);
        lab.textContent = row.name + ' · ' + sharePct(row.spent / total);
      } else {
        val.textContent = money(total, true);
        lab.textContent = totalLabel;
      }
    }
    function bind(el) {
      var cat = el.dataset.cat;
      function toggle() { pinned = pinned === cat ? null : cat; paint(pinned); }
      el.addEventListener('mouseenter', function () { if (!pinned) paint(cat); });
      el.addEventListener('mouseleave', function () { if (!pinned) paint(null); });
      el.addEventListener('focus', function () { if (!pinned) paint(cat); });
      el.addEventListener('blur', function () { if (!pinned) paint(null); });
      el.addEventListener('click', function (e) { e.preventDefault(); toggle(); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); toggle(); }
      });
    }
    $$('#donut .seg, #donut .drow').forEach(bind);
  }

  /* ---------- pace area chart ---------- */
  function niceMax(n) {
    if (!(n > 0)) return 1;
    var e = Math.pow(10, Math.floor(Math.log10(n))), f = n / e;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * e;
  }

  function renderPace() {
    var cfg = getCfg(), ym = S.viewYM, dim = daysIn(ym), cur = ym === TODAY_YM, past = ym < TODAY_YM;
    var last = cur ? Math.min(NOW.getDate(), dim) : (past ? dim : 0);
    var bt = budgetTotal(cfg);
    var daily = new Array(dim + 1).fill(0);
    getTx(ym).forEach(function (tx) {
      if (tx.t === 'g') { var d = +tx.d.slice(8, 10); if (d >= 1 && d <= dim) daily[d] += tx.a; }
    });
    var cum = [0], c = 0;
    for (var d = 1; d <= dim; d++) { c += daily[d]; cum[d] = c; }
    var spent = last > 0 ? cum[last] : 0;
    var proj = (cur && last >= 3 && spent > 0) ? spent / last * dim : 0;
    var head = '<div class="ct">' + t('ui.evolution') + '<span class="sub">' + esc(monthLabel(ym)) + '</span></div>';
    if (spent <= 0 && bt <= 0) {
      $('#pace').innerHTML = head + '<p class="empty">' + t('pace.empty') + '</p>' +
        '<button type="button" class="ghost demo-load" data-act="load-demo">' + esc(t('demo.load')) + '</button>';
      return;
    }
    var note = '';
    if (proj > 0) {
      if (bt > 0) note = proj > bt ? t('pace.over', { amount: money(proj, true), over: money(proj - bt, true) }) : t('pace.within', { amount: money(proj, true) });
      else note = t('pace.only', { amount: money(proj, true) });
    }
    var W = 420, H = 200, pl = 46, pr = 12, pt = 12, pb = 26;
    var ymax = niceMax(Math.max(bt, spent, proj) * 1.04);
    var X = function (day) { return pl + (day / dim) * (W - pl - pr); };
    var Y = function (v) { return pt + (1 - v / ymax) * (H - pt - pb); };
    var g = '';
    [0, 0.5, 1].forEach(function (f) {
      var v = ymax * f, y = Y(v);
      g += '<line class="gl" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (pl - 7) + '" y="' + (y + 4) + '" text-anchor="end">' + esc(axis(v)) + '</text>';
    });
    [1, Math.round(dim / 2), dim].forEach(function (day) {
      g += '<text x="' + X(day) + '" y="' + (H - 6) + '" text-anchor="' + (day === 1 ? 'start' : day === dim ? 'end' : 'middle') + '">' + day + '</text>';
    });
    var defs = '<defs><linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#a78bfa" stop-opacity=".52"/>' +
      '<stop offset=".45" stop-color="' + C.accent + '" stop-opacity=".22"/>' +
      '<stop offset=".8" stop-color="' + C.accent2 + '" stop-opacity=".07"/>' +
      '<stop offset="1" stop-color="' + C.accent2 + '" stop-opacity="0"/>' +
      '</linearGradient></defs>';
    var body = '';
    if (bt > 0) body += '<line class="ln-pace" x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(dim) + '" y2="' + Y(bt) + '"/>';
    if (last > 0) {
      var pts = [];
      for (var dd = 0; dd <= last; dd++) pts.push([X(dd), Y(cum[dd])]);
      var line = smoothPath(pts);
      var area = line + ' L' + X(last).toFixed(1) + ' ' + Y(0).toFixed(1) + ' L' + X(0).toFixed(1) + ' ' + Y(0).toFixed(1) + ' Z';
      body += '<path class="ar-cum" d="' + area + '"/><path class="ln-cum" d="' + line + '"/>';
      if (proj > 0) body += '<line class="ln-proj" x1="' + X(last) + '" y1="' + Y(cum[last]) + '" x2="' + X(dim) + '" y2="' + Y(proj) + '"/>';
      for (var pd = 1; pd <= last; pd++) {
        if (daily[pd] > 0) body += '<circle class="dpt" data-day="' + pd + '" cx="' + X(pd).toFixed(1) + '" cy="' + Y(cum[pd]).toFixed(1) + '" r="2.6"><title>' + esc(dayLabel(ym + '-' + pad(pd))) + '</title></circle>';
      }
      body += '<circle class="pt" cx="' + X(last).toFixed(1) + '" cy="' + Y(cum[last]).toFixed(1) + '" r="4"/>';
    }
    body += '<line class="cross" x1="' + pl + '" y1="' + pt + '" x2="' + pl + '" y2="' + (H - pb) + '" opacity="0"/>' +
      '<circle class="hoverpt" cx="' + pl + '" cy="' + pt + '" r="4.5" opacity="0"/>' +
      '<rect class="hit" x="' + pl + '" y="' + pt + '" width="' + (W - pl - pr) + '" height="' + (H - pt - pb) + '"/>';
    $('#pace').innerHTML = head + (note ? '<p class="pnote">' + esc(note) + '</p>' : '') +
      '<div class="chart-wrap"><svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(t('pace.aria')) + '">' + defs + g + body + '</svg>' +
      '<div class="chart-tip" id="paceTip" hidden></div></div>' +
      '<div class="legend"><span><i></i>' + t('pace.legendCum') + '</span>' +
      (bt > 0 ? '<span><i class="d"></i>' + t('pace.legendPace') + '</span>' : '') +
      (proj > 0 ? '<span><i class="p"></i>' + t('pace.legendProj') + '</span>' : '') + '</div>';
    bindPaceTooltip({ ym: ym, W: W, H: H, pl: pl, pr: pr, pt: pt, pb: pb, dim: dim, last: last, X: X, Y: Y, cum: cum, daily: daily });
  }

  function bindPaceTooltip(o) {
    var svg = $('#pace .chart');
    var tip = $('#paceTip');
    if (!svg || !tip || !(o.last > 0)) return;
    var cross = $('#pace .cross'), dot = $('#pace .hoverpt');
    function move(ev) {
      var r = svg.getBoundingClientRect();
      if (!r.width) return;
      var x = (ev.clientX - r.left) / r.width * o.W;
      var day = Math.round((x - o.pl) / (o.W - o.pl - o.pr) * o.dim);
      day = clamp(day, 1, o.last);
      var px = o.X(day), py = o.Y(o.cum[day]);
      cross.setAttribute('x1', px); cross.setAttribute('x2', px);
      cross.setAttribute('opacity', '1');
      dot.setAttribute('cx', px); dot.setAttribute('cy', py);
      dot.setAttribute('opacity', '1');
      $$('#pace .dpt').forEach(function (c) { c.classList.toggle('on', Number(c.dataset.day) === day); });
      tip.hidden = false;
      tip.innerHTML = '<b>' + esc(dayLabel(o.ym + '-' + pad(day))) + '</b>' +
        '<span>' + esc(t('pace.tooltipTotal', { amount: money(o.cum[day]) })) + '</span>' +
        '<span class="tipd">' + esc(t('pace.tooltipDay', { amount: money(o.daily[day]) })) + '</span>';
      var left = (px / o.W) * r.width;
      var top = (py / o.H) * r.height;
      var half = tip.offsetWidth / 2 + 6;
      left = clamp(left, half, r.width - half);
      tip.style.left = left + 'px';
      tip.style.top = Math.max(tip.offsetHeight + 8, top) + 'px';
    }
    function hide() {
      tip.hidden = true;
      if (cross) cross.setAttribute('opacity', '0');
      if (dot) dot.setAttribute('opacity', '0');
      $$('#pace .dpt').forEach(function (c) { c.classList.remove('on'); });
    }
    svg.addEventListener('pointermove', move);
    svg.addEventListener('pointerdown', move);
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('pointercancel', hide);
  }

  /* ---------- upcoming payments ---------- */
  function renderUpcoming() {
    var items = recItems();
    var head = '<div class="ct">' + t('fixed.upcomingTitle') + '<span class="sub">' + t('fixed.upcomingSub') + '</span></div>';
    if (!items.length) {
      $('#upcoming').innerHTML = head + '<p class="empty">' + esc(t('fixed.emptyUpcoming')) + '</p>' +
        '<button type="button" class="ghost upmore" data-act="view" data-view="fixed">' + t('fixed.addFirst') + '</button>';
      return;
    }
    var show = items.slice(0, 4);
    var html = show.map(function (it) {
      var r = it.rec, due = it.due, cls = dueClass(due);
      var status = dueStatusText(due);
      var when = new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'short' }).format(due.date);
      var pay = due.paid
        ? '<button type="button" class="paybtn" disabled>' + esc(t('fixed.paid')) + '</button>'
        : '<button type="button" class="paybtn" data-act="pay" data-id="' + esc(r.id) + '">' + esc(recActionLabel(r)) + '</button>';
      return '<div class="upitem">' +
        getItemIcon({ n: r.name, c: r.cat, t: 'g' }) +
        '<div class="upmain"><div class="upname">' + esc(r.name) + '</div>' +
        '<div class="upmeta"><span class="' + cls + '">' + esc(status) + '</span> · ' + esc(when) + ' · ' + esc(catNameById(r.cat)) + '</div></div>' +
        '<div class="upamt">' + money(r.amount, true) + '</div>' + pay + '</div>';
    }).join('');
    $('#upcoming').innerHTML = head + html +
      '<button type="button" class="ghost upmore" data-act="view" data-view="fixed">' + t('fixed.viewAll') + '</button>';
  }

  /* ---------- recurring manager ---------- */
  function renderFixed() {
    var cfg = getCfg();
    var items = recItems();
    var head = '<div class="ct">' + t('fixed.title') + '<span class="sub">' + t('fixed.sub') + '</span></div>';
    var draft = recDraft();
    var catOk = cfg.cats.some(function (c) { return c.id === draft.cat; });
    var selCat = catOk ? draft.cat : ((cfg.cats[0] && cfg.cats[0].id) || '');
    var cats = cfg.cats.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === selCat ? ' selected' : '') + '>' + esc(c.name) + '</option>';
    }).join('');
    var form = '<div class="recform">' +
      '<div class="wide"><label class="lab" for="rec-name">' + t('fixed.name') + '</label>' +
      '<input class="field" id="rec-name" maxlength="40" autocomplete="off" value="' + esc(draft.name) + '" placeholder="' + esc(t('fixed.namePh')) + '"></div>' +
      '<div><label class="lab" for="rec-amt">' + t('fixed.amount') + '</label>' +
      '<input class="field" id="rec-amt" inputmode="decimal" autocomplete="off" value="' + esc(draft.amount) + '" placeholder="0"></div>' +
      '<div><label class="lab" for="rec-day">' + t('fixed.day') + '</label>' +
      '<input class="field" id="rec-day" inputmode="numeric" autocomplete="off" value="' + esc(draft.day) + '" placeholder="1-31"></div>' +
      '<div><label class="lab" for="rec-cat">' + t('fixed.category') + '</label>' +
      '<select class="field" id="rec-cat">' + cats + '</select></div>' +
      '<button type="button" class="primary" data-act="add-rec">' + t('fixed.addBtn') + '</button></div>';
    var list = '';
    if (!items.length) {
      list = '<p class="empty">' + esc(t('fixed.empty')) + '</p>';
    } else {
      list = '<div class="reclist">' + items.map(function (it) {
        var r = it.rec, due = it.due, cls = dueClass(due);
        var status = dueStatusText(due);
        var pay = due.paid
          ? '<button type="button" class="paybtn" disabled>' + esc(t('fixed.paid')) + '</button>'
          : '<button type="button" class="paybtn" data-act="pay" data-id="' + esc(r.id) + '">' + esc(recActionLabel(r)) + '</button>';
        var rm = S.demo ? '' : '<button type="button" class="recrm" data-act="del-rec" data-id="' + esc(r.id) + '" aria-label="' + esc(t('fixed.deleteAria', { name: r.name })) + '">' +
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg></button>';
        return '<div class="recitem">' +
          '<div class="recmain">' + getItemIcon({ n: r.name, c: r.cat, t: 'g' }) +
          '<div class="recinfo"><div class="recname">' + esc(r.name) + '</div>' +
          '<div class="recmeta"><span class="recstatus ' + cls + '">' + esc(status) + '</span> · ' + esc(t('fixed.monthlyDay', { day: r.day })) + ' · ' + esc(catNameById(r.cat)) + '</div></div></div>' +
          '<div class="recright"><span class="recamt">' + money(r.amount, true) + '</span>' + pay + rm + '</div></div>';
      }).join('') + '</div>';
    }
    $('#fixed').innerHTML = head + form + '<div class="recsep"></div>' + list +
      (S.demo ? '<p class="note">' + t('fixed.demoNote') + '</p>' : '');
  }

  /* ---------- goal ---------- */
  function renderGoal() {
    var cfg = getCfg(), g = cfg.goal, st = monthStats(S.viewYM);
    var head = '<div class="ct">' + t('ui.goals') + '<span class="sub">' + esc(monthLabel(S.viewYM)) + '</span></div>';
    var mark = '<div class="goalmark" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg></div>';
    if (!(g.target > 0)) {
      $('#goal').innerHTML = head + '<div class="goalhead">' + mark + '<p class="gname">' + esc(t('goal.defaultName')) + '</p></div>' +
        '<p class="empty">' + t('goal.empty') + '</p>' +
        (S.demo ? '' : '<button type="button" class="ghost" data-act="open-settings">' + t('goal.define') + '</button>');
      return;
    }
    var p = Math.min(g.saved / g.target, 1), rest = Math.max(g.target - g.saved, 0);
    var eta = '';
    if (rest <= 0) eta = t('goal.done');
    else if (S.viewYM === TODAY_YM && st.avail > 0) { var m = Math.ceil(rest / st.avail); eta = tn('goal.eta', m); }
    $('#goal').innerHTML = head +
      '<div class="goalhead">' + mark + '<p class="gname">' + esc(g.name || t('goal.defaultName')) + '</p></div>' +
      '<div class="gline"><span class="num">' + esc(t('goal.savedOf', { saved: money(g.saved, true), target: money(g.target, true) })) + '</span><span>' + pct(p) + '</span></div>' +
      '<div class="gbar" role="img" aria-label="' + esc(pct(p)) + '"><i style="width:' + p * 100 + '%"></i></div>' +
      '<div class="gline"><span>' + (rest > 0 ? esc(t('goal.left', { amount: money(rest, true) })) : '') + '</span><span>' + esc(eta) + '</span></div>' +
      (S.demo ? '' : '<div class="gform"><label class="sr" for="g-add">' + t('goal.addPlaceholder') + '</label><input class="field" id="g-add" inputmode="decimal" autocomplete="off" placeholder="' + esc(t('goal.addPlaceholder')) + '"><button type="button" class="ghost" data-act="goal-add">' + t('goal.addBtn') + '</button></div>');
  }

  function renderHistory() {
    var ms = [0, 1, 2, 3, 4, 5].map(function (i) { return addMonths(S.viewYM, i - 5); });
    var data = ms.map(function (ym) { return { ym: ym, st: monthStats(ym) }; });
    var mx = Math.max.apply(null, data.map(function (d) { return Math.max(d.st.inc, d.st.exp); }).concat([1]));
    var rows = data.map(function (d) {
      var has = d.st.n > 0, av = d.st.avail;
      return '<div class="hrow' + (d.ym === S.viewYM ? ' now' : '') + '"><span class="hm">' + esc(monthShort(d.ym)) + '</span>' +
        '<div class="hbars"><i class="hb inc" style="width:' + (has ? d.st.inc / mx * 100 : 0) + '%"></i><i class="hb exp" style="width:' + (has ? d.st.exp / mx * 100 : 0) + '%"></i></div>' +
        '<span class="hn ' + (has ? (av >= 0 ? 'good' : 'bad') : 'muted') + '">' + (has ? (av >= 0 ? '+' : '−') + money(Math.abs(av), true) : '—') + '</span></div>';
    }).join('');
    $('#history').innerHTML = '<div class="ct">' + t('history.title') + '<span class="sub">' + t('history.sub') + '</span></div>' + rows +
      '<div class="hkey"><span><i style="background:var(--good);opacity:.75"></i>' + t('history.income') + '</span><span><i style="background:var(--fg);opacity:.55"></i>' + t('history.expenses') + '</span></div>';
  }

  /* ---------- list ---------- */
  function editRow(x) {
    return '<div class="tx-edit">' +
      '<div class="tehead"><i class="dot" style="background:' + catColor(x.c) + '"></i><span>' + esc(catName(x)) + '</span><span class="muted">' + esc(dayLabel(x.d)) + '</span></div>' +
      '<div class="tefields">' +
        '<div><label class="lab" for="edit-amt">' + t('list.editAmount') + '</label>' +
        '<input class="field" id="edit-amt" inputmode="decimal" autocomplete="off" value="' + esc(String(x.a)) + '" data-id="' + esc(x.id) + '"></div>' +
        '<div><label class="lab" for="edit-note">' + t('list.editNote') + '</label>' +
        '<input class="field" id="edit-note" maxlength="60" autocomplete="off" value="' + esc(x.n) + '" data-id="' + esc(x.id) + '"></div>' +
      '</div>' +
      '<div class="teactions"><button type="button" class="ghost" data-act="cancel-edit">' + t('list.cancel') + '</button>' +
      '<button type="button" class="primary" data-act="save-edit" data-id="' + esc(x.id) + '">' + t('list.save') + '</button></div></div>';
  }

  function renderList() {
    var ym = S.viewYM;
    var all = getTx(ym);
    var tx = all.map(function (x, i) { return { t: x, i: i }; });
    if (S.filter === 'g') tx = tx.filter(function (x) { return x.t.t === 'g'; });
    else if (S.filter === 'i') tx = tx.filter(function (x) { return x.t.t === 'i'; });
    else if (S.filter === 'h') tx = tx.filter(function (x) { return x.t.h; });
    var q = S.query.trim().toLowerCase();
    if (q) {
      tx = tx.filter(function (x) {
        var hay = [x.t.n, catName(x.t), x.t.d, dayLabel(x.t.d),
          String(x.t.a), String(r2(x.t.a)), money(x.t.a), money(x.t.a, true)].join(' ').toLowerCase();
        return hay.indexOf(q) >= 0;
      });
    }
    tx.sort(function (a, b) { return a.t.d < b.t.d ? 1 : a.t.d > b.t.d ? -1 : a.i - b.i; });
    var total = tx.length, shown = tx.slice(0, S.limit);
    var fl = [['all', t('list.filterAll')], ['g', t('list.filterExpenses')], ['i', t('list.filterIncome')], ['h', t('list.filterMicro')]];
    $('#listcount').textContent = tn('hero.records', total);
    $('#listfilters').innerHTML = fl.map(function (f) {
      return '<button type="button" class="chip' + (S.filter === f[0] ? ' on' : '') + '" data-act="filter" data-f="' + f[0] + '" aria-pressed="' + (S.filter === f[0]) + '">' + f[1] + '</button>';
    }).join('');
    var clear = $('#searchclear');
    if (clear) clear.hidden = !S.query;
    var html = '';
    if (!total) {
      var msg = all.length
        ? (q ? t('list.noResults', { query: S.query }) : t('list.emptyFilter'))
        : t('list.empty');
      html = '<p class="empty" style="margin-top:14px">' + esc(msg) + '</p>';
      if (!all.length) html += '<button type="button" class="ghost demo-load" data-act="load-demo">' + esc(t('demo.load')) + '</button>';
    } else {
      var groups = [];
      shown.forEach(function (x) {
        var g = groups[groups.length - 1];
        if (g && g.d === x.t.d) g.items.push(x.t);
        else groups.push({ d: x.t.d, items: [x.t] });
      });
      groups.forEach(function (g) {
        var net = g.items.reduce(function (a, x) { return a + (x.t === 'i' ? x.a : -x.a); }, 0);
        html += '<div class="day"><span>' + esc(dayLabel(g.d)) + '</span><span class="dsum">' + (net >= 0 ? '+' : '−') + money(Math.abs(net)) + '</span></div>';
        g.items.forEach(function (x) {
          if (S.editTx === x.id && !S.demo) { html += editRow(x); return; }
          var inc = x.t === 'i';
          var ask = S.confirmDel === x.id;
          var actions = S.demo ? '<span></span>' : '<div class="acts">' +
            '<button type="button" class="edt" data-act="edit" data-id="' + esc(x.id) + '" aria-label="' + esc(t('list.editAria')) + '">' +
              '<svg viewBox="0 0 24 24"><path d="M4 20h4l10-10a2.8 2.8 0 00-4-4L4 16v4zM13.5 6.5l4 4"/></svg></button>' +
            '<button type="button" class="del' + (ask ? ' ask' : '') + '" data-act="del" data-id="' + esc(x.id) + '" aria-label="' + esc(ask ? t('list.confirmAria') : t('list.deleteAria')) + '">' +
              (ask ? esc(t('list.deleteConfirm')) : '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg>') +
            '</button></div>';
          html += '<div class="tx">' + getItemIcon(x) +
            '<div class="main"><div class="t1">' + esc(x.n || catName(x)) + '</div><div class="t2">' +
            (x.h ? '<span class="tag">' + esc(t('list.microTag')) + '</span>' : '') +
            (x.r ? '<span class="tag">' + esc(t('list.recurringTag')) + '</span>' : '') + '</div></div>' +
            '<div class="tcat">' + esc(catName(x)) + '</div>' +
            '<div class="tdate">' + esc(dayLabel(x.d)) + '</div>' +
            '<div class="amt2 ' + (inc ? 'in' : '') + '">' + (inc ? '+' : '−') + money(x.a) + '</div>' + actions + '</div>';
        });
      });
      if (total > shown.length) html += '<button type="button" class="ghost more" data-act="more">' + esc(t('list.showMore', { n: total - shown.length })) + '</button>';
    }
    $('#listbody').innerHTML = html;
  }

  /* ---------- manual offline FX rates ---------- */
  function rateKey(from, to) { return String(from).toUpperCase() + '>' + String(to).toUpperCase(); }

  function moneyCur(n, cur) {
    var digits = currencyDigits(cur);
    var frac = Math.abs(n - Math.round(n)) > 1e-9;
    var d = frac ? digits : 0;
    return nf(cur, d, d).format(n);
  }

  function fxRate(from, to) {
    from = String(from || '').toUpperCase();
    to = String(to || '').toUpperCase();
    if (!from || !to) return null;
    if (from === to) return 1;
    var rates = getCfg().rates || {};
    var direct = rates[rateKey(from, to)];
    if (direct > 0) return direct;
    var inverse = rates[rateKey(to, from)];
    if (inverse > 0) return 1 / inverse;
    /* One to three hops through any saved currency pair, entirely offline. */
    var adj = {};
    Object.keys(rates).forEach(function (k) {
      var p = k.split('>'), r = rates[k];
      if (p.length !== 2 || !(r > 0)) return;
      (adj[p[0]] = adj[p[0]] || []).push({ v: p[1], r: r });
      (adj[p[1]] = adj[p[1]] || []).push({ v: p[0], r: 1 / r });
    });
    var queue = [{ v: from, r: 1, depth: 0 }], seen = {};
    seen[from] = 1;
    while (queue.length) {
      var node = queue.shift();
      if (node.depth >= 3) continue;
      var edges = adj[node.v] || [];
      for (var i = 0; i < edges.length; i++) {
        if (edges[i].v === to) return node.r * edges[i].r;
        if (!seen[edges[i].v]) {
          seen[edges[i].v] = 1;
          queue.push({ v: edges[i].v, r: node.r * edges[i].r, depth: node.depth + 1 });
        }
      }
    }
    return null;
  }

  function convert(amount, from, to) {
    var r = fxRate(from, to);
    return r == null ? r2(amount) : r2(amount * r);
  }

  function fxDraft() {
    if (!S.fxDraft) {
      var cur = getCfg().cur;
      S.fxDraft = {
        from: cur === 'USD' ? 'EUR' : 'USD', to: cur, rate: '',
        amount: '100', cfrom: cur === 'USD' ? 'EUR' : 'USD', cto: cur
      };
    }
    return S.fxDraft;
  }

  function captureFxForm() {
    var f = fxDraft();
    var map = { 'fx-from': 'from', 'fx-to': 'to', 'fx-rate': 'rate', 'cv-amt': 'amount', 'cv-from': 'cfrom', 'cv-to': 'cto' };
    Object.keys(map).forEach(function (id) {
      var el = $('#' + id);
      if (el) f[map[id]] = el.value;
    });
  }

  function saveFxRate() {
    var from = $('#fx-from').value, to = $('#fx-to').value;
    var rate = parseAmount($('#fx-rate').value);
    if (from === to) { toast(t('fx.same')); return; }
    if (!(rate > 0)) { toast(t('fx.invalid')); $('#fx-rate').focus(); return; }
    captureFxForm();
    getCfg().rates[rateKey(from, to)] = rate;
    S.fxDraft.rate = '';
    persistCfg();
    renderSettings();
    toast(t('fx.saved'));
  }

  function removeFxRate(pair) {
    if (!pair || !getCfg().rates) return;
    delete getCfg().rates[pair];
    persistCfg();
    renderSettings();
  }

  function doConvert() {
    var amount = parseAmount($('#cv-amt').value);
    var from = $('#cv-from').value, to = $('#cv-to').value;
    var out = $('#cv-out');
    if (!out) return;
    if (!(amount > 0)) { toast(t('debts.amountError')); $('#cv-amt').focus(); return; }
    captureFxForm();
    var r = fxRate(from, to);
    if (r == null) { toast(t('fx.missing')); out.textContent = ''; return; }
    out.textContent = t('fx.result', { amount: moneyCur(amount, from), result: moneyCur(convert(amount, from, to), to) });
  }

  /* ---------- debts & loans ---------- */
  function debtDraft() {
    if (!S.debtDraft) {
      S.debtDraft = {
        name: '', amount: '', cur: getCfg().cur, note: '', dir: 'lent',
        auto: getCfg().debtAutoTx !== false
      };
    }
    return S.debtDraft;
  }

  function captureDebtForm() {
    var n = $('#debt-name'), a = $('#debt-amt'), c = $('#debt-cur'), note = $('#debt-note'), dir = $('#debt-dir'), auto = $('#debt-auto');
    if (!n || !a) return;
    var d = debtDraft();
    d.name = n.value;
    d.amount = a.value;
    if (c) d.cur = c.value;
    if (note) d.note = note.value;
    if (dir) d.dir = dir.value === 'owed' ? 'owed' : 'lent';
    if (auto) d.auto = auto.checked;
  }

  function debtTotals() {
    var cfg = getCfg(), cur = cfg.cur;
    var lent = 0, owed = 0, missing = 0;
    (cfg.debts || []).forEach(function (d) {
      if (d.settled) return;
      var r = fxRate(d.cur, cur);
      if (r == null && d.cur !== cur) missing++;
      var v = r2(d.amount * (r == null ? 1 : r));
      if (d.dir === 'owed') owed += v; else lent += v;
    });
    return { lent: r2(lent), owed: r2(owed), net: r2(lent - owed), missing: missing };
  }

  function addDebt() {
    var d = debtDraft();
    var name = String(d.name || '').trim();
    var amount = parseAmount(d.amount);
    if (!name) { toast(t('debts.nameError')); var ne = $('#debt-name'); if (ne) ne.focus(); return; }
    if (!(amount > 0)) { toast(t('debts.amountError')); var ae = $('#debt-amt'); if (ae) ae.focus(); return; }
    if (S.demo) loadDemo(true);
    var item = {
      id: uid(), name: name.slice(0, 40), amount: r2(amount), cur: d.cur || S.cfg.cur,
      note: String(d.note || '').trim().slice(0, 60), dir: d.dir === 'owed' ? 'owed' : 'lent',
      settled: false, date: TODAY_ISO, settledAt: ''
    };
    if (!S.cfg.debts) S.cfg.debts = [];
    S.cfg.debts.push(item);
    S.cfg.debtAutoTx = d.auto !== false;
    S.debtDraft = null;
    persistCfg();
    renderAll();
    toast(t('debts.addedToast', { name: item.name }));
  }

  function settleDebt(id) {
    if (S.demo) loadDemo(true);
    var d = (S.cfg.debts || []).find(function (x) { return x.id === id; });
    if (!d || d.settled) return;
    d.settled = true;
    d.settledAt = TODAY_ISO;
    if (S.cfg.debtAutoTx !== false) {
      var tx = {
        id: uid(), t: d.dir === 'owed' ? 'g' : 'i',
        a: r2(convert(d.amount, d.cur, S.cfg.cur)),
        c: d.dir === 'owed' ? 'otr' : 'otri',
        n: (d.name + ' · ' + t('debts.txNote')).slice(0, 60),
        d: TODAY_ISO, h: 0, r: ('debt:' + d.id).slice(0, 40)
      };
      if (!S.months[TODAY_YM]) S.months[TODAY_YM] = [];
      S.months[TODAY_YM].push(tx);
      persistMonth(TODAY_YM);
    }
    persistCfg();
    renderAll();
    toast(t('debts.settledToast', { name: d.name }));
  }

  function delDebt(id) {
    if (S.demo) loadDemo(true);
    S.cfg.debts = (S.cfg.debts || []).filter(function (x) { return x.id !== id; });
    persistCfg();
    renderAll();
    toast(t('debts.deleted'));
  }

  function renderDebts() {
    var cfg = getCfg(), el = $('#debts');
    if (!el) return;
    var all = (cfg.debts || []).slice().sort(function (a, b) {
      if (a.settled !== b.settled) return a.settled ? 1 : -1;
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
    var compact = S.view !== 'debts';
    var shown = compact ? all.filter(function (d) { return !d.settled; }).slice(0, 3) : all;
    var tot = debtTotals();
    var head = '<div class="ct">' + esc(t('debts.title')) + '<span class="sub">' + esc(t('debts.sub')) + '</span></div>';
    var totals = '<div class="dbtotals">' +
      '<div class="dbtot lent"><span>' + esc(t('debts.totalLent')) + '</span><b>' + esc(money(tot.lent, true)) + '</b></div>' +
      '<div class="dbtot owed"><span>' + esc(t('debts.totalOwed')) + '</span><b>' + esc(money(tot.owed, true)) + '</b></div>' +
      '<div class="dbtot net"><span>' + esc(t('debts.net')) + '</span><b>' + esc(money(tot.net, true)) + '</b></div></div>';

    var form = '';
    if (!compact && !S.demo) {
      var d = debtDraft();
      var opts = currencyOptions(d.cur || cfg.cur);
      form = '<div class="dbtform">' +
        '<div><label class="lab" for="debt-name">' + esc(t('debts.person')) + '</label><input class="field" id="debt-name" maxlength="40" autocomplete="off" value="' + esc(d.name) + '" placeholder="' + esc(t('debts.personPh')) + '"></div>' +
        '<div><label class="lab" for="debt-amt">' + esc(t('debts.amount')) + '</label><input class="field" id="debt-amt" inputmode="decimal" autocomplete="off" value="' + esc(d.amount) + '" placeholder="0"></div>' +
        '<div><label class="lab" for="debt-cur">' + esc(t('debts.currency')) + '</label><select class="field" id="debt-cur">' + opts + '</select></div>' +
        '<div><label class="lab" for="debt-dir">' + esc(t('debts.title')) + '</label><select class="field" id="debt-dir">' +
          '<option value="lent"' + (d.dir !== 'owed' ? ' selected' : '') + '>' + esc(t('debts.lent')) + '</option>' +
          '<option value="owed"' + (d.dir === 'owed' ? ' selected' : '') + '>' + esc(t('debts.owed')) + '</option></select></div>' +
        '<div class="wide"><label class="lab" for="debt-note">' + esc(t('debts.note')) + '</label><input class="field" id="debt-note" maxlength="60" autocomplete="off" value="' + esc(d.note) + '" placeholder="' + esc(t('debts.notePh')) + '"></div>' +
        '<label class="dbtcheck"><input type="checkbox" id="debt-auto"' + (d.auto !== false ? ' checked' : '') + '><span>' + esc(t('debts.autoTx')) + '</span></label>' +
        '<p class="dbthint">' + esc(t('debts.autoTxHint')) + '</p>' +
        '<button type="button" class="primary" data-act="debt-add">' + esc(t('debts.add')) + '</button></div>';
    }

    var list = '';
    if (!shown.length) {
      list = '<p class="empty">' + esc(t('debts.empty')) + '</p>';
    } else {
      list = '<div class="dbtlist">' + shown.map(function (x) {
        var dirCls = x.dir === 'owed' ? 'owed' : 'lent';
        var base = moneyCur(convert(x.amount, x.cur, cfg.cur), cfg.cur);
        var conv = x.cur !== cfg.cur ? '<small>≈ ' + esc(base) + '</small>' : '';
        var action = x.settled
          ? '<button type="button" class="paybtn" disabled>' + esc(t('debts.settled')) + '</button>'
          : '<button type="button" class="paybtn settlebtn" data-act="debt-settle" data-id="' + esc(x.id) + '">' + esc(t('debts.settle')) + '</button>';
        var rm = S.demo ? '' : '<button type="button" class="dbterm" data-act="debt-del" data-id="' + esc(x.id) + '" aria-label="' + esc(t('debts.deleteAria', { name: x.name })) + '">' +
          '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V4h6v3"/></svg></button>';
        return '<div class="dbtitem' + (x.settled ? ' done' : '') + '">' +
          '<span class="item-icon" aria-hidden="true" style="background:' + (dirCls === 'owed' ? '#ef4444' : '#059669') + ';color:#fff">' +
            '<svg viewBox="0 0 24 24"><path d="M3 7h15a3 3 0 013 3v7a3 3 0 01-3 3H3z"/><path d="M3 7V4.8h13V7M16 13.5h4"/></svg></span>' +
          '<div class="dbtmain"><div class="t1">' + esc(x.name) + '</div><div class="dbtmeta"><span class="dbtdir ' + dirCls + '">' + esc(t('debts.' + dirCls)) + '</span>' +
            (x.note ? ' · ' + esc(x.note) : '') + '</div></div>' +
          '<div class="dbtamt">' + esc(moneyCur(x.amount, x.cur)) + conv + '</div>' + action + rm + '</div>';
      }).join('') + '</div>';
    }
    var warn = tot.missing ? '<p class="note">' + esc(tn('debts.unconverted', tot.missing)) + '</p>' : '';
    var more = compact ? '<button type="button" class="ghost upmore" data-act="view" data-view="debts">' + esc(t('debts.manage')) + '</button>' : '';
    var demoNote = S.demo ? '<p class="note">' + esc(t('settings.demoNote')) + '</p>' : '';
    el.innerHTML = head + totals + form + list + warn + more + demoNote;
  }

  function fxSettingsHtml() {
    var f = fxDraft(), rates = getCfg().rates || {};
    var keys = Object.keys(rates).sort();
    var rows = keys.length ? keys.map(function (k) {
      var p = k.split('>');
      return '<div class="fxrow"><span>1 ' + esc(p[0]) + ' = <b>' + esc(rates[k]) + ' ' + esc(p[1]) + '</b></span>' +
        '<button type="button" data-act="fx-del" data-pair="' + esc(k) + '" aria-label="' + esc(t('fx.remove', { pair: k })) + '">×</button></div>';
    }).join('') : '<p class="empty">' + esc(t('fx.none')) + '</p>';
    return '<div class="sec"><h3>' + esc(t('fx.title')) + '</h3>' +
      '<div class="fxform">' +
        '<label class="sr" for="fx-from">' + esc(t('fx.from')) + '</label><select class="field" id="fx-from">' + currencyOptions(f.from) + '</select>' +
        '<label class="sr" for="fx-to">' + esc(t('fx.to')) + '</label><select class="field" id="fx-to">' + currencyOptions(f.to) + '</select>' +
        '<label class="sr" for="fx-rate">' + esc(t('fx.rate')) + '</label><input class="field wide" id="fx-rate" inputmode="decimal" autocomplete="off" value="' + esc(f.rate) + '" placeholder="' + esc(t('fx.ratePh')) + '">' +
        '<button type="button" class="primary wide" data-act="fx-save">' + esc(t('fx.save')) + '</button></div>' +
      '<p class="note">' + esc(t('fx.note')) + '</p>' +
      '<h3 style="margin-top:14px">' + esc(t('fx.list')) + '</h3><div class="fxlist">' + rows + '</div>' +
      '<div class="fxconv"><h3>' + esc(t('fx.convertTitle')) + '</h3><div class="fxform">' +
        '<label class="sr" for="cv-amt">' + esc(t('fx.amount')) + '</label><input class="field" id="cv-amt" inputmode="decimal" autocomplete="off" value="' + esc(f.amount) + '" placeholder="0">' +
        '<label class="sr" for="cv-from">' + esc(t('fx.from')) + '</label><select class="field" id="cv-from">' + currencyOptions(f.cfrom) + '</select>' +
        '<label class="sr" for="cv-to">' + esc(t('fx.to')) + '</label><select class="field" id="cv-to">' + currencyOptions(f.cto) + '</select>' +
        '<button type="button" class="ghost wide" data-act="fx-convert">' + esc(t('fx.convert')) + '</button></div>' +
        '<p class="fxout" id="cv-out"></p></div></div>';
  }

  /* ---------- settings ---------- */
  function renderSettings() {
    var el = $('#sbody');
    var c = S.cfg;
    var html = '';
    if (S.demo) {
      html += '<div class="sec"><p class="note" style="margin-top:0">' + t('settings.demoNote') + '</p>' +
        '<div class="btns"><button type="button" class="primary" data-act="start">' + t('demo.start') + '</button></div></div>';
    }
    html += '<div class="sec"><h3>' + t('settings.currency') + '</h3>' +
      '<label class="sr" for="s-cur">' + t('settings.currency') + '</label>' +
      '<select class="field" id="s-cur">' + currencyOptions(c.cur) + '</select>' +
      '<p class="note">' + t('settings.currencyNote') + '</p></div>' +
      fxSettingsHtml() +
      '<div class="sec"><h3>' + t('settings.language') + '</h3>' +
      '<label class="sr" for="s-lang">' + t('settings.language') + '</label>' +
      '<select class="field" id="s-lang">' + languageOptions() + '</select>' +
      '<p class="note">' + t('settings.languageNote') + '</p></div>';

    if (!S.demo) {
      html += '<div class="sec"><h3>' + t('settings.savings') + '</h3><div class="fg2">' +
        '<div><label class="lab" for="s-save">' + t('settings.monthlyTarget') + '</label><input class="field" id="s-save" inputmode="decimal" autocomplete="off" value="' + (c.saveTarget || '') + '" placeholder="0"></div>' +
        '<div><label class="lab" for="g-name">' + t('settings.goalName') + '</label><input class="field" id="g-name" maxlength="60" autocomplete="off" value="' + esc(c.goal.name) + '" placeholder="' + esc(t('settings.goalNamePh')) + '"></div>' +
        '<div class="two"><div><label class="lab" for="g-target">' + t('settings.target') + '</label><input class="field" id="g-target" inputmode="decimal" autocomplete="off" value="' + (c.goal.target || '') + '" placeholder="0"></div>' +
        '<div><label class="lab" for="g-saved">' + t('settings.saved') + '</label><input class="field" id="g-saved" inputmode="decimal" autocomplete="off" value="' + (c.goal.saved || '') + '" placeholder="0"></div></div></div></div>' +
        '<div class="sec"><h3>' + t('settings.budgetTitle') + '</h3>' +
        c.cats.map(function (k) {
          return '<div class="catrow"><label class="sr" for="cn-' + esc(k.id) + '">' + t('settings.nameLabel') + '</label><input class="field" id="cn-' + esc(k.id) + '" data-cid="' + esc(k.id) + '" data-f="name" maxlength="30" value="' + esc(k.name) + '">' +
            '<label class="sr" for="cb-' + esc(k.id) + '">' + esc(t('settings.budgetLabel', { name: k.name })) + '</label><input class="field" id="cb-' + esc(k.id) + '" data-cid="' + esc(k.id) + '" data-f="budget" inputmode="decimal" autocomplete="off" value="' + (k.budget || '') + '" placeholder="0">' +
            '<button type="button" class="icon" data-act="rmcat" data-id="' + esc(k.id) + '" aria-label="' + esc(t('settings.remove', { name: k.name })) + '"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>';
        }).join('') +
        '<div class="addcat"><label class="sr" for="nc-name">' + t('settings.newCategory') + '</label><input class="field" id="nc-name" maxlength="30" autocomplete="off" placeholder="' + esc(t('settings.newCategory')) + '"><button type="button" class="ghost" data-act="addcat">' + t('settings.add') + '</button></div></div>';
    }

    html += '<div class="sec"><h3>' + t('settings.data') + '</h3><div class="btns">' +
      '<button type="button" class="primary" data-act="load-demo">' + esc(t('demo.load')) + '</button>' +
      '<button type="button" class="ghost" data-act="export-json">' + t('settings.exportJson') + '</button>' +
      '<button type="button" class="ghost" data-act="import-json">' + t('settings.importJson') + '</button>' +
      '<button type="button" class="ghost" data-act="export-csv">' + t('settings.exportCsv') + '</button>' +
      '<button type="button" class="ghost danger" data-act="reset">' + (S.confirmReset ? t('settings.resetConfirm') : t('settings.reset')) + '</button>' +
      '</div><p class="note">' + t('settings.localNote') + '</p></div>';
    el.innerHTML = html;
  }

  function openSettings() {
    S.openSettings = true;
    S.confirmReset = false;
    renderSettings();
    $('#sheet').hidden = false;
    setTimeout(function () { $('#closebtn').focus(); }, 0);
  }
  function closeSettings() {
    S.openSettings = false;
    $('#sheet').hidden = true;
    $('#gearbtn').focus();
  }

  /* ---------- data sovereignty ---------- */
  function exportCsv() {
    var rows = [[t('csv.date'), t('csv.type'), t('csv.category'), t('csv.note'), t('csv.amount'), t('csv.micro')]];
    getTx(S.viewYM).slice().sort(function (a, b) { return a.d < b.d ? -1 : a.d > b.d ? 1 : 0; }).forEach(function (tx) {
      rows.push([tx.d, tx.t === 'g' ? t('csv.expense') : t('csv.income'), catName(tx), tx.n, tx.a, tx.h ? t('csv.yes') : '']);
    });
    Storage.exportCsv('clearwallet-' + S.viewYM + '.csv', rows);
    toast(t('settings.csvExported'));
  }

  function exportJson() {
    var cfg = S.cfg, months = S.months;
    if (S.demo) {
      cfg = getCfg();
      months = {};
      for (var i = 5; i >= 0; i--) {
        var ym = addMonths(TODAY_YM, -i);
        var tx = demoTx(ym);
        if (tx.length) months[ym] = tx;
      }
    }
    Storage.exportBackup({ cfg: cfg, months: months });
    toast(t('settings.backupExported'));
  }

  function importJson() {
    var input = $('#importfile');
    if (input) { input.value = ''; input.click(); }
  }

  function onImportFile(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    Storage.readBackup(file).then(function (data) {
      if (!window.confirm(t('settings.importConfirm'))) return;
      var cfg = normCfg(data.cfg);
      var months = sanitizeMonths(data.months);
      S.cfg = cfg;
      S.months = months;
      S.demo = false;
      demoCache = null;
      S.viewYM = TODAY_YM;
      S.filter = 'all';
      S.limit = 60;
      S.confirmDel = null;
      S.editTx = null;
      S.recDraft = null;
    S.debtDraft = null;
    S.fxDraft = null;
      resetSearch();
      lsSave();
      $('#dt').value = defaultDate(S.viewYM);
      setView('overview');
      renderAll();
      renderChips();
      renderSettings();
      toast(t('settings.backupImported'));
    }).catch(function () {
      toast(t('settings.backupInvalid'));
    }).then(function () {
      e.target.value = '';
    });
  }

  function resetAll() {
    if (!S.confirmReset) {
      S.confirmReset = true;
      renderSettings();
      setTimeout(function () {
        if (S.confirmReset) { S.confirmReset = false; if (S.openSettings) renderSettings(); }
      }, 4000);
      return;
    }
    S.confirmReset = false;
    Storage.clear();
    var cur = S.cfg.cur;
    S.demo = true;
    S.cfg = defaultCfg(cur);
    S.months = {};
    demoCache = null;
    S.viewYM = TODAY_YM;
    S.filter = 'all';
    S.limit = 60;
    S.confirmDel = null;
    S.editTx = null;
    S.recDraft = null;
    S.debtDraft = null;
    S.fxDraft = null;
    resetSearch();
    $('#dt').value = TODAY_ISO;
    closeSettings();
    setView('overview');
    renderAll();
    renderChips();
    toast(t('settings.resetDone'));
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act],[data-type]');
    if (!b) return;
    if (b.dataset.type) { setType(b.dataset.type); return; }
    var a = b.dataset.act;
    if (a === 'prev') gotoMonth(addMonths(S.viewYM, -1));
    else if (a === 'next') gotoMonth(addMonths(S.viewYM, 1));
    else if (a === 'today') { if (S.viewYM !== TODAY_YM) gotoMonth(TODAY_YM); }
    else if (a === 'view') setView(b.dataset.view);
    else if (a === 'open-settings') openSettings();
    else if (a === 'close-settings') closeSettings();
    else if (a === 'open-add') openAdd();
    else if (a === 'close-add') closeAdd();
    else if (a === 'cat') {
      S.cat = b.dataset.id;
      $$('#catchips .chip').forEach(function (x) {
        var on = x.dataset.id === S.cat;
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', String(on));
      });
      updateIconPreview();
    } else if (a === 'start') {
      startReal();
      renderAll();
      renderChips();
      if (S.openSettings) renderSettings();
      toast(t('demo.ready'));
      if (!S.openAdd) openAdd();
    } else if (a === 'load-demo') {
      loadDemo();
    } else if (a === 'filter') { S.filter = b.dataset.f; S.limit = 60; renderList(); }
    else if (a === 'more') { S.limit += 60; renderList(); }
    else if (a === 'clear-search') {
      resetSearch();
      renderList();
      var si = $('#txsearch');
      if (si) si.focus();
    } else if (a === 'edit') {
      S.editTx = b.dataset.id;
      S.confirmDel = null;
      renderList();
      setTimeout(function () {
        var el = $('#edit-amt');
        if (el) { el.focus(); el.select(); }
      }, 0);
    } else if (a === 'cancel-edit') {
      S.editTx = null;
      renderList();
    } else if (a === 'save-edit') {
      saveEdit(b.dataset.id);
    } else if (a === 'del') {
      var id = b.dataset.id;
      if (S.confirmDel === id) { delTx(id); }
      else {
        S.confirmDel = id;
        renderList();
        setTimeout(function () { if (S.confirmDel === id) { S.confirmDel = null; renderList(); } }, 3500);
      }
    } else if (a === 'add-rec') {
      addRecurring();
    } else if (a === 'del-rec') {
      delRecurring(b.dataset.id);
    } else if (a === 'pay') {
      payRecurring(b.dataset.id);
    } else if (a === 'goal-add') {
      var v = parseAmount($('#g-add').value);
      if (!(v > 0)) { toast(t('goal.amountError')); return; }
      S.cfg.goal.saved = r2(S.cfg.goal.saved + v);
      persistCfg();
      renderGoal();
      toast(t('goal.added', { amount: money(v) }));
    } else if (a === 'addcat') {
      var inp = $('#nc-name'), name = inp.value.trim();
      if (!name) { inp.focus(); return; }
      S.cfg.cats.push({ id: 'c' + uid(), name: name.slice(0, 30), budget: 0 });
      persistCfg();
      renderSettings();
      renderChips();
      renderAll();
    } else if (a === 'rmcat') {
      if (S.cfg.cats.length <= 1) { toast(t('settings.atLeastOne')); return; }
      S.cfg.cats = S.cfg.cats.filter(function (k) { return k.id !== b.dataset.id; });
      persistCfg();
      renderSettings();
      renderChips();
      renderAll();
    } else if (a === 'debt-add') addDebt();
    else if (a === 'debt-settle') settleDebt(b.dataset.id);
    else if (a === 'debt-del') delDebt(b.dataset.id);
    else if (a === 'fx-save') saveFxRate();
    else if (a === 'fx-del') removeFxRate(b.dataset.pair);
    else if (a === 'fx-convert') doConvert();
    else if (a === 'export-json') exportJson();
    else if (a === 'import-json') importJson();
    else if (a === 'export-csv') exportCsv();
    else if (a === 'reset') resetAll();
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.id === 'langsel' || el.id === 's-lang') { setLang(el.value); return; }
    if (el.id === 'd-cur' || el.id === 's-cur') {
      if (S.demo) {
        S.cfg.cur = el.value;
        demoCache = null;
        renderAll();
        renderChips();
        if (S.openSettings) renderSettings();
      } else {
        S.cfg.cur = el.value;
        persistCfg();
        renderAll();
        renderChips();
      }
      return;
    }
    if (el.id === 'rec-cat') { captureRecForm(); return; }
    if (el.id === 'rec-type') { captureRecForm(); renderFixed(); return; }
    if (el.id === 'debt-auto') {
      captureDebtForm();
      S.cfg.debtAutoTx = el.checked;
      persistCfg();
      return;
    }
    if (['debt-cur', 'debt-dir'].indexOf(el.id) >= 0) { captureDebtForm(); return; }
    if (['fx-from', 'fx-to', 'cv-from', 'cv-to'].indexOf(el.id) >= 0) { captureFxForm(); return; }
    if (S.demo) return;
    if (el.id === 's-save') {
      var v = parseAmount(el.value);
      S.cfg.saveTarget = v > 0 ? r2(v) : 0;
      el.value = S.cfg.saveTarget || '';
      persistCfg();
      renderAll();
      return;
    }
    if (el.id === 'g-name') {
      S.cfg.goal.name = el.value.trim().slice(0, 60);
      persistCfg();
      renderGoal();
      return;
    }
    if (el.id === 'g-target' || el.id === 'g-saved') {
      var val = parseAmount(el.value), k = el.id === 'g-target' ? 'target' : 'saved';
      S.cfg.goal[k] = val > 0 ? r2(val) : 0;
      el.value = S.cfg.goal[k] || '';
      persistCfg();
      renderGoal();
      return;
    }
    if (el.dataset && el.dataset.cid) {
      var cat = S.cfg.cats.find(function (x) { return x.id === el.dataset.cid; });
      if (!cat) return;
      if (el.dataset.f === 'name') {
        cat.name = el.value.trim().slice(0, 30) || cat.name;
        el.value = cat.name;
        renderChips();
      } else {
        var bv = parseAmount(el.value);
        cat.budget = bv > 0 ? r2(bv) : 0;
        el.value = cat.budget || '';
      }
      persistCfg();
      renderAll();
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'txsearch') {
      S.query = e.target.value;
      S.limit = 60;
      renderList();
      return;
    }
    if (e.target.id === 'note') updateIconPreview();
    if (e.target.id === 'rec-name' || e.target.id === 'rec-amt' || e.target.id === 'rec-day') captureRecForm();
    if (['debt-name', 'debt-amt', 'debt-note'].indexOf(e.target.id) >= 0) captureDebtForm();
    if (['fx-rate', 'cv-amt'].indexOf(e.target.id) >= 0) captureFxForm();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (S.openAdd) { closeAdd(); return; }
      if (S.openSettings) { closeSettings(); return; }
      if (S.editTx) { S.editTx = null; renderList(); return; }
    }
    if (e.key === 'Enter' && (e.target.id === 'amt' || e.target.id === 'note')) { e.preventDefault(); addTx(); }
    if (e.key === 'Enter' && (e.target.id === 'edit-amt' || e.target.id === 'edit-note')) {
      e.preventDefault();
      var sid = e.target.dataset.id;
      if (sid) saveEdit(sid);
    }
    if (e.key === 'Enter' && (e.target.id === 'rec-name' || e.target.id === 'rec-amt' || e.target.id === 'rec-day')) {
      e.preventDefault();
      addRecurring();
    }
    if (e.key === 'Enter' && e.target.id === 'g-add') {
      e.preventDefault();
      var gb = $('[data-act="goal-add"]');
      if (gb) gb.click();
    }
    if (e.key === 'Enter' && e.target.id === 'nc-name') {
      e.preventDefault();
      var ab = $('[data-act="addcat"]');
      if (ab) ab.click();
    }
    if (e.key === 'Enter' && ['debt-name', 'debt-amt', 'debt-note'].indexOf(e.target.id) >= 0) {
      e.preventDefault();
      captureDebtForm();
      addDebt();
    }
    if (e.key === 'Enter' && e.target.id === 'fx-rate') {
      e.preventDefault();
      var sb = $('[data-act="fx-save"]');
      if (sb) sb.click();
    }
    if (e.key === 'Enter' && e.target.id === 'cv-amt') {
      e.preventDefault();
      var cb = $('[data-act="fx-convert"]');
      if (cb) cb.click();
    }
  });

  $('#amt').addEventListener('input', function () { $('#amtbox').classList.remove('err'); });
  $('#addbtn').addEventListener('click', addTx);
  $('#hor').addEventListener('click', function () {
    S.hor = !S.hor;
    $('#hor').classList.toggle('on', S.hor);
    $('#hor').setAttribute('aria-pressed', String(S.hor));
  });

  /* ---------- service worker ---------- */
  var refreshing = false;
  function registerSW() {
    if (!('serviceWorker' in navigator)) return;
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      // Skip the first-install claim; only reload when an update replaces an
      // existing controller, so the first visit never flashes/reloads.
      if (refreshing || !hadController) return;
      refreshing = true;
      window.location.reload();
    });
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    applyStatic();
    syncTypeUI();
    var stored = Storage.load();
    if (stored && storedHasData(stored)) {
      S.cfg = normCfg(stored.cfg);
      S.months = sanitizeMonths(stored.months);
      S.demo = false;
    } else {
      /* No stored movements and no fixed payments: start with the enriched
         demo so the donut and evolution curve are filled from the beginning. */
      S.cfg = stored && stored.cfg ? normCfg(stored.cfg) : defaultCfg();
      S.months = {};
      S.demo = true;
    }
    $('#dt').value = TODAY_ISO;
    $('#langsel').value = LANG;
    setView('overview');
    renderChips();
    renderAll();
    var imp = $('#importfile');
    if (imp) imp.addEventListener('change', onImportFile);
    registerSW();
  }

  boot();
})();
