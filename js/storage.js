/* ClearWallet — storage, local persistence, JSON backups and CSV export */
(function (global) {
  'use strict';

  var KEY = 'clearwallet-v1';
  var LEGACY_KEY = 'plata-al-dia-v1';

  /* ---------- Capa IndexedDB (Etapas 1 y 2) ----------
     IndexedDB pasa a ser el almacen principal; localStorage sigue siendo el
     espejo sincrono que consume app.js. Los archivos van al store 'files',
     fuera del limite de 5 MB de localStorage. En la Etapa 2 se anaden los
     stores 'accounts' y 'transfers' para migrar las billeteras y las
     transferencias internas sin perder el historico existente. */
  var DB_NAME = 'clearwallet_db';
  var DB_VERSION = 2;
  var SCHEMA_VERSION = 3;
  var STORE_STATE = 'state';
  var STORE_FILES = 'files';
  var STORE_ACCOUNTS = 'accounts';
  var STORE_TRANSFERS = 'transfers';
  var STATE_KEY = 'main';
  var MIRROR_KEYS = [KEY, LEGACY_KEY, 'clearwallet-lang-v1'];
  var dbPromise = null, idbReady = false, idbFailed = false, pendingWrite = false;
  var initPromise = null, writeChain = Promise.resolve(), memoryBackup = null;

  /* IndexedDB es la única fuente de verdad; `memoryState` mantiene el estado
     persistido disponible para la API síncrona que consume app.js. */
  var memoryState = null;
  var STORAGE_ERROR_MESSAGE = 'Error al guardar los datos en este dispositivo. Exporta un respaldo JSON por seguridad.';
  var storageErrorHandler = null, lastStorageError = null, storageErrorActive = false;

  function emitStorageError(err, origin) {
    if (storageErrorActive) return;
    storageErrorActive = true;
    lastStorageError = { message: STORAGE_ERROR_MESSAGE, error: err || null, origin: origin || '' };
    try { if (typeof storageErrorHandler === 'function') storageErrorHandler(lastStorageError); } catch (e) {}
    try {
      window.dispatchEvent(new CustomEvent('onStorageError', { detail: lastStorageError }));
    } catch (e) {
      try {
        var ev = document.createEvent('CustomEvent');
        ev.initCustomEvent('onStorageError', false, false, lastStorageError);
        window.dispatchEvent(ev);
      } catch (e2) {}
    }
  }
  function clearStorageError() { storageErrorActive = false; lastStorageError = null; }

  function idbOpen() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in global)) { reject(new Error('IndexedDB no disponible')); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = req.result;
        var old = e.oldVersion || 0;
        if (old < 1) {
          if (!db.objectStoreNames.contains(STORE_STATE)) db.createObjectStore(STORE_STATE);
          if (!db.objectStoreNames.contains(STORE_FILES)) db.createObjectStore(STORE_FILES, { keyPath: 'id' });
        }
        if (old < 2) {
          if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) db.createObjectStore(STORE_ACCOUNTS, { keyPath: 'id' });
          if (!db.objectStoreNames.contains(STORE_TRANSFERS)) db.createObjectStore(STORE_TRANSFERS, { keyPath: 'id' });
        }
      };
      req.onsuccess = function () { idbReady = true; resolve(req.result); };
      req.onerror = function () { idbFailed = true; reject(req.error || new Error('No se pudo abrir IndexedDB')); };
      req.onblocked = function () { idbFailed = true; reject(new Error('IndexedDB bloqueada')); };
    });
    return dbPromise;
  }
  function idbRequest(db, store, mode, run) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(store, mode), os = tx.objectStore(store), result;
      try { result = run(os); } catch (e) { reject(e); return; }
      tx.oncomplete = function () { resolve(result && result.result !== undefined ? result.result : undefined); };
      tx.onerror = function () { reject(tx.error || new Error('Error de IndexedDB')); };
      tx.onabort = function () { reject(tx.error || new Error('Transaccion abortada')); };
    });
  }
  function idbGet(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.get(key); }) });
  }
  function idbGetAll(store) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readonly', function (os) { return os.getAll(); }) });
  }
  function idbPut(store, key, value) {
    return idbOpen().then(function (db) {
      return idbRequest(db, store, 'readwrite', function (os) { return key === undefined ? os.put(value) : os.put(value, key) });
    });
  }
  function idbDelete(store, key) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readwrite', function (os) { return os.delete(key); }) });
  }
  function idbClear(store) {
    return idbOpen().then(function (db) { return idbRequest(db, store, 'readwrite', function (os) { return os.clear(); }) });
  }
  var LIGHT_KEYS = ['clearwallet-lang-v1'];
  var HEAVY_KEYS = [KEY, LEGACY_KEY];

  /* localStorage solo conserva preferencias ligeras; el historial completo
     vive en IndexedDB (y en memoria mientras la app está abierta). */
  function localSnapshot() {
    var snap = {};
    try { LIGHT_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) snap[k] = v; }); } catch (e) {}
    return snap;
  }
  function restoreSnapshot(snap) {
    try {
      LIGHT_KEYS.forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(snap, k)) localStorage.setItem(k, snap[k]);
      });
    } catch (e) {}
  }
  function savePreferences() {
    try {
      LIGHT_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) localStorage.setItem(k, v); });
    } catch (e) { /* Preferencia ligera: no es un fallo de persistencia. */ }
  }
  function pruneLocalState() {
    try { HEAVY_KEYS.forEach(function (k) { localStorage.removeItem(k); }); } catch (e) {}
  }

  /* ---------- Etapa 2: migration of accounts and transfers ---------- */
  function r2(n) { return Math.round(n * 100) / 100; }
  /* Las tasas necesitan mas precision que los importes: redondear 1 USD =
     0.0004 EUR a 2 decimales destruye la conversion. */
  function rate6(n) { return Math.round(n * 1000000) / 1000000; }
  function today() { return new Date().toISOString().slice(0, 10); }

  function mainAccount(cur) {
    return {
      id: 'acc-main', name: 'Main', type: 'cash',
      cur: (typeof cur === 'string' && cur) ? cur : 'USD', initial: 0, color: '#8aa4ff'
    };
  }

  function normAccount(a) {
    if (!a || typeof a !== 'object') return null;
    var id = String(a.id || '');
    if (!id) return null;
    var cur = String(a.cur || a.currency || '').toUpperCase();
    if (!/^[A-Z]{3}$/.test(cur)) cur = 'USD';
    var types = ['cash', 'bank', 'card', 'savings', 'other', 'custom'];
    var type = types.indexOf(a.type) >= 0 ? a.type : 'other';
    var initial = Number(a.initial != null ? a.initial : a.balance);
    return {
      id: id.slice(0, 40),
      name: String(a.name != null ? a.name : '').trim().slice(0, 40) || 'Main',
      type: type,
      cur: cur,
      initial: isFinite(initial) ? r2(initial) : 0,
      color: /^#[0-9a-f]{6}$/i.test(a.color) ? a.color : '#8aa4ff'
    };
  }

  function normTransfer(x) {
    if (!x || typeof x !== 'object') return null;
    var a = Number(x.a != null ? x.a : x.amount);
    var rate = Number(x.rate != null ? x.rate : NaN);
    var d = String(x.d || x.date || '');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) d = today();
    var from = String(x.from || ''), to = String(x.to || '');
    if (!(a > 0) || !from || !to || from === to) return null;
    if (!isFinite(rate) || !(rate > 0)) rate = 1;
    /* `cur`/`orig` hacen explicita la moneda de origen. Las transferencias
       heredadas no las tenian: se infieren de la cuenta de origen. */
    var cur = String(x.cur || '').toUpperCase();
    if (!/^[A-Z]{3}$/.test(cur)) cur = '';
    var orig = Number(x.orig);
    return {
      id: String(x.id || ('xf' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5))).slice(0, 40),
      from: from, to: to, a: r2(a),
      cur: cur, orig: isFinite(orig) && orig > 0 ? r2(orig) : r2(a),
      /* Nunca se inventa una tasa 1:1 entre divisas distintas: si no viene
         en el respaldo se marca como heredada y la app la recalcula. */
      rate: rate6(rate),
      d: d, n: String(x.n || x.note || '').trim().slice(0, 60)
    };
  }

  /* Convierte cualquier estado v1/v2 al esquema v3. Las transferencias
     heredadas como movimientos 'x' se consolidan en su propio array y se
     quitan del historial para que nunca afecten a ingresos ni gastos. */
  function migrateData(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return raw;
    var cfg = (raw.cfg && typeof raw.cfg === 'object' && !Array.isArray(raw.cfg)) ? raw.cfg : {};
    var months = (raw.months && typeof raw.months === 'object' && !Array.isArray(raw.months)) ? raw.months : {};
    var rawAccounts = Array.isArray(raw.accounts) ? raw.accounts : (Array.isArray(cfg.accounts) ? cfg.accounts : null);
    var rawTransfers = Array.isArray(raw.transfers) ? raw.transfers : (Array.isArray(cfg.transfers) ? cfg.transfers : []);
    var accounts = (rawAccounts || []).map(normAccount).filter(Boolean);
    if (!accounts.length) accounts = [mainAccount(cfg.cur)];
    var ids = {};
    accounts.forEach(function (a) { ids[a.id] = 1; });
    var fallback = accounts[0].id;
    var transfers = rawTransfers.map(normTransfer).filter(Boolean);
    var seen = {};
    transfers.forEach(function (x) {
      if (!ids[x.from]) x.from = fallback;
      if (!ids[x.to]) x.to = fallback;
      seen[x.id] = 1;
    });
    var outMonths = {};
    Object.keys(months).forEach(function (k) {
      if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(k) || !Array.isArray(months[k])) return;
      outMonths[k] = [];
      months[k].forEach(function (tx) {
        if (!tx || typeof tx !== 'object') return;
        if (tx.t === 'x') {
          var id = String(tx.xid || tx.id || '');
          if (id && seen[id]) return;
          var from = String(tx.f || tx.from || fallback), to = String(tx.to || fallback);
          var amt = Number(tx.a), rate = Number(tx.rate);
          if (!(amt > 0) || !ids[from] || !ids[to] || from === to) return;
          id = id || ('xf' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5));
          seen[id] = 1;
          transfers.push({
            id: id, from: from, to: to, a: r2(amt),
            rate: (isFinite(rate) && rate > 0) ? rate : 1,
            d: /^\d{4}-\d{2}-\d{2}$/.test(tx.d) ? tx.d : (k + '-01'),
            n: String(tx.n || '').slice(0, 60)
          });
          return;
        }
        if (!tx.acc || !ids[tx.acc]) tx.acc = fallback;
        outMonths[k].push(tx);
      });
    });
    if (cfg.accounts !== undefined || cfg.transfers !== undefined) {
      cfg = Object.assign({}, cfg);
      delete cfg.accounts;
      delete cfg.transfers;
    }
    return { cfg: cfg, months: outMonths, accounts: accounts, transfers: transfers };
  }

  /* Devuelve true solo cuando la transaccion de IndexedDB ha terminado
     correctamente. El aviso de exito de la app depende de esta promesa. */
  function writeIDB(data) {
    var attempt = writeChain.then(function () {
      return idbOpen().then(function (db) {
        return new Promise(function (resolve, reject) {
          var tx = db.transaction([STORE_STATE, STORE_ACCOUNTS, STORE_TRANSFERS], 'readwrite');
          var acc = tx.objectStore(STORE_ACCOUNTS), tr = tx.objectStore(STORE_TRANSFERS);
          acc.clear(); tr.clear();
          (data.accounts || []).forEach(function (a) { if (a && a.id) acc.put(a); });
          (data.transfers || []).forEach(function (x) { if (x && x.id) tr.put(x); });
          tx.objectStore(STORE_STATE).put({
            schemaVersion: SCHEMA_VERSION, app: 'clearwallet', data: data,
            localStorage: localSnapshot(), updatedAt: new Date().toISOString()
          }, STATE_KEY);
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { reject(tx.error || new Error('Error de IndexedDB')); };
          tx.onabort = function () { reject(tx.error || new Error('Transaccion abortada')); };
        });
      });
    });
    writeChain = attempt.catch(function () { return false; });
    return attempt.then(function (ok) {
      clearStorageError();
      return !!ok;
    }, function (e) {
      idbFailed = true;
      emitStorageError(e, 'IndexedDB');
      return false;
    });
  }

  function initIDB() {
    if (initPromise) return initPromise;
    initPromise = idbOpen().then(function () {
      return Promise.all([
        idbGet(STORE_STATE, STATE_KEY),
        idbGetAll(STORE_ACCOUNTS),
        idbGetAll(STORE_TRANSFERS)
      ]);
    }).then(function (res) {
      var rec = res[0], storedAccounts = res[1] || [], storedTransfers = res[2] || [];
      var local = null;
      try { local = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY) || 'null'); } catch (e) {}
      var remote = rec ? ((rec.schemaVersion && rec.data) ? rec.data : rec) : null;
      /* IndexedDB manda: localStorage solo se consulta una vez, cuando no
         existe registro persistido (migración inicial). */
      if (pendingWrite && memoryState) { pruneLocalState(); return; }
      var base = remote || ((local && hasData(local)) ? local : null);
      if (!base) return;
      var data = migrateData(base);
      if ((!data.accounts || data.accounts.length <= 1) && storedAccounts.length) data.accounts = storedAccounts;
      if (!data.transfers.length && storedTransfers.length) data.transfers = storedTransfers;
      data = migrateData(data);
      memoryState = data;
      pruneLocalState();
      if (!rec) return writeIDB(data);
    }).catch(function (e) { idbFailed = true; emitStorageError(e, 'IndexedDB (init)'); });
    return initPromise;
  }

  function hasData(d) {
    if (!d || typeof d !== 'object') return false;
    if (Array.isArray(d.transfers) && d.transfers.length) return true;
    if (Array.isArray(d.accounts) && d.accounts.length > 1) return true;
    if (!d.months || typeof d.months !== 'object') return false;
    return Object.keys(d.months).some(function (k) { return Array.isArray(d.months[k]) && d.months[k].length; });
  }
  function whenReady() { return initIDB(); }
  function putFile(id, data, meta) {
    var rec = {
      id: String(id), data: data, type: (meta && meta.type) || '', name: (meta && meta.name) || '',
      size: typeof data === 'string' ? data.length : ((data && data.size) || 0),
      schemaVersion: SCHEMA_VERSION, createdAt: new Date().toISOString()
    };
    return idbPut(STORE_FILES, undefined, rec);
  }
  function getFile(id) { return idbGet(STORE_FILES, String(id)); }
  function listFiles() { return idbGetAll(STORE_FILES); }
  function deleteFile(id) { return idbDelete(STORE_FILES, String(id)); }

  /* ---------- currency detection ---------- */
  var TZ_CUR = {
    'America/Montevideo': 'UYU',
    'America/Argentina/Buenos_Aires': 'ARS',
    'America/Buenos_Aires': 'ARS',
    'America/Santiago': 'CLP',
    'America/Bogota': 'COP',
    'America/Mexico_City': 'MXN',
    'America/Sao_Paulo': 'BRL',
    'America/Lima': 'PEN',
    'America/Asuncion': 'PYG',
    'America/La_Paz': 'BOB',
    'America/Caracas': 'VES',
    'America/Guayaquil': 'USD',
    'America/Panama': 'USD',
    'America/New_York': 'USD',
    'America/Chicago': 'USD',
    'America/Denver': 'USD',
    'America/Los_Angeles': 'USD',
    'America/Phoenix': 'USD',
    'America/Anchorage': 'USD',
    'Pacific/Honolulu': 'USD',
    'America/Toronto': 'CAD',
    'America/Vancouver': 'CAD',
    'America/Edmonton': 'CAD',
    'America/Winnipeg': 'CAD',
    'America/Halifax': 'CAD',
    'America/Guatemala': 'GTQ',
    'America/Tegucigalpa': 'HNL',
    'America/Managua': 'NIO',
    'America/Costa_Rica': 'CRC',
    'America/Santo_Domingo': 'DOP',
    'America/Havana': 'CUP',
    'Europe/Madrid': 'EUR',
    'Europe/Paris': 'EUR',
    'Europe/Berlin': 'EUR',
    'Europe/Rome': 'EUR',
    'Europe/Lisbon': 'EUR',
    'Europe/Amsterdam': 'EUR',
    'Europe/Brussels': 'EUR',
    'Europe/Vienna': 'EUR',
    'Europe/Dublin': 'EUR',
    'Europe/Helsinki': 'EUR',
    'Europe/Athens': 'EUR',
    'Europe/Bratislava': 'EUR',
    'Europe/Ljubljana': 'EUR',
    'Europe/Tallinn': 'EUR',
    'Europe/Riga': 'EUR',
    'Europe/Vilnius': 'EUR',
    'Europe/Luxembourg': 'EUR',
    'Europe/Malta': 'EUR',
    'Europe/Nicosia': 'EUR',
    'Europe/London': 'GBP',
    'Europe/Zurich': 'CHF',
    'Europe/Moscow': 'RUB',
    'Europe/Kiev': 'UAH',
    'Europe/Kyiv': 'UAH',
    'Europe/Warsaw': 'PLN',
    'Europe/Stockholm': 'SEK',
    'Europe/Oslo': 'NOK',
    'Europe/Copenhagen': 'DKK',
    'Europe/Prague': 'CZK',
    'Europe/Budapest': 'HUF',
    'Europe/Bucharest': 'RON',
    'Europe/Sofia': 'BGN',
    'Europe/Istanbul': 'TRY',
    'Asia/Tokyo': 'JPY',
    'Asia/Seoul': 'KRW',
    'Asia/Kolkata': 'INR',
    'Asia/Calcutta': 'INR',
    'Asia/Shanghai': 'CNY',
    'Asia/Hong_Kong': 'HKD',
    'Asia/Taipei': 'TWD',
    'Asia/Singapore': 'SGD',
    'Asia/Bangkok': 'THB',
    'Asia/Jakarta': 'IDR',
    'Asia/Kuala_Lumpur': 'MYR',
    'Asia/Manila': 'PHP',
    'Asia/Ho_Chi_Minh': 'VND',
    'Asia/Dubai': 'AED',
    'Asia/Riyadh': 'SAR',
    'Asia/Jerusalem': 'ILS',
    'Asia/Karachi': 'PKR',
    'Asia/Dhaka': 'BDT',
    'Asia/Colombo': 'LKR',
    'Asia/Kathmandu': 'NPR',
    'Africa/Johannesburg': 'ZAR',
    'Africa/Cairo': 'EGP',
    'Africa/Lagos': 'NGN',
    'Africa/Casablanca': 'MAD',
    'Africa/Nairobi': 'KES',
    'Australia/Sydney': 'AUD',
    'Australia/Melbourne': 'AUD',
    'Australia/Brisbane': 'AUD',
    'Australia/Perth': 'AUD',
    'Pacific/Auckland': 'NZD'
  };

  var REG_CUR = {
    UY: 'UYU', AR: 'ARS', CL: 'CLP', CO: 'COP', MX: 'MXN', BR: 'BRL', PE: 'PEN',
    PY: 'PYG', BO: 'BOB', VE: 'VES', EC: 'USD', US: 'USD', CA: 'CAD', GB: 'GBP',
    IE: 'EUR', ES: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', PT: 'EUR', NL: 'EUR',
    BE: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR', SK: 'EUR', SI: 'EUR', EE: 'EUR',
    LV: 'EUR', LT: 'EUR', LU: 'EUR', MT: 'EUR', CY: 'EUR', JP: 'JPY', KR: 'KRW',
    CN: 'CNY', HK: 'HKD', TW: 'TWD', IN: 'INR', AU: 'AUD', NZ: 'NZD', CH: 'CHF',
    SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN', CZ: 'CZK', HU: 'HUF', RO: 'RON',
    BG: 'BGN', RU: 'RUB', UA: 'UAH', TR: 'TRY', ZA: 'ZAR', AE: 'AED', SA: 'SAR',
    IL: 'ILS', SG: 'SGD', TH: 'THB', ID: 'IDR', MY: 'MYR', PH: 'PHP', VN: 'VND',
    EG: 'EGP', NG: 'NGN', MA: 'MAD', KE: 'KES', PK: 'PKR', BD: 'BDT', LK: 'LKR',
    NP: 'NPR'
  };

  function guessCurrency() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && TZ_CUR[tz]) return TZ_CUR[tz];
    } catch (e) {}
    try {
      var lang = (navigator.languages && navigator.languages[0]) || navigator.language || '';
      var region = new Intl.Locale(lang).region;
      if (region && REG_CUR[region]) return REG_CUR[region];
    } catch (e) {}
    return 'USD';
  }

  /* ---------- persistencia: IndexedDB es la fuente de verdad ---------- */
  function load() {
    initIDB();
    if (memoryState) return JSON.parse(JSON.stringify(memoryState));
    try {
      var raw = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY);
      return raw ? migrateData(JSON.parse(raw)) : null;
    } catch (e) { return null; }
  }

  function save(state) {
    var payload = migrateData({
      cfg: state.cfg, months: state.months || {},
      accounts: state.accounts || [], transfers: state.transfers || []
    });
    memoryState = payload;
    pendingWrite = true;
    savePreferences();
    /* La escritura principal es IndexedDB y recibe el estado directamente:
       no depende del espacio libre en localStorage. La promesa se devuelve
       al llamador para que no muestre exito hasta la confirmacion real. */
    return writeIDB(payload).then(function (ok) {
      pendingWrite = false;
      return !!ok;
    }, function () {
      pendingWrite = false;
      return false;
    });
  }

  function clear() {
    memoryState = null;
    pruneLocalState();
    return Promise.all([
      idbDelete(STORE_STATE, STATE_KEY),
      idbClear(STORE_ACCOUNTS),
      idbClear(STORE_TRANSFERS)
    ]).then(function () { return true; }, function () { return false; });
  }

  /* ---------- downloads ---------- */
  function download(filename, text, mime) {
    var blob = new Blob([text], { type: mime || 'application/octet-stream' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function stamp() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

  function exportBackup(state) {
    var payload = {
      app: 'ClearWallet',
      appId: 'clearwallet',
      schemaVersion: SCHEMA_VERSION,
      version: 3,
      exportDate: stamp(),
      exportedAt: new Date().toISOString(),
      cfg: state.cfg,
      months: state.months || {},
      accounts: state.accounts || [],
      transfers: state.transfers || []
    };
    download('clearwallet-backup-' + stamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  /* Valida origen, integridad referencial e importes antes de sobrescribir
     el estado actual. Un respaldo duplicado o con saldos imposibles se
     rechaza por completo: nunca se restaura "a medias". */
  function validateBackup(data) {
    function bad(msgText) { return { ok: false, msgText: msgText }; }
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return bad('El archivo no contiene un respaldo válido.');
    }
    if (data.app && String(data.app).toLowerCase() !== 'clearwallet') {
      return bad('Este respaldo pertenece a otra aplicación y no se importará.');
    }
    if (data.appId && String(data.appId).toLowerCase() !== 'clearwallet') {
      return bad('Este respaldo pertenece a otra aplicación y no se importará.');
    }
    var sv = data.schemaVersion == null ? (typeof data.version === 'number' ? data.version : 1) : Number(data.schemaVersion);
    if (!isFinite(sv) || sv < 1 || sv > SCHEMA_VERSION) {
      return bad('La versión de esquema del respaldo no es compatible.');
    }
    if (!data.cfg || typeof data.cfg !== 'object' || Array.isArray(data.cfg)) {
      return bad('El respaldo está dañado: falta la configuración.');
    }
    var markers = ['cur', 'cats', 'recurring', 'debts', 'rates', 'saveTarget', 'goal', 'accounts', 'transfers'];
    var known = markers.some(function (k) { return Object.prototype.hasOwnProperty.call(data.cfg, k); }) ||
      Array.isArray(data.accounts) || Array.isArray(data.transfers);
    if (!known) return bad('El respaldo está incompleto: la configuración no es reconocible.');
    if (data.months !== undefined && (typeof data.months !== 'object' || Array.isArray(data.months))) {
      return bad('El respaldo está dañado: el historial no es válido.');
    }

    var ids = {}, duplicate = null;
    function claim(id) {
      var key = String(id == null ? '' : id);
      if (!key) { duplicate = duplicate || 'id'; return; }
      if (ids[key]) duplicate = duplicate || key;
      ids[key] = 1;
    }
    function amountOK(v) { var n = Number(v); return isFinite(n) && n > 0; }
    function finiteOK(v) { var n = Number(v); return v == null || isFinite(n); }
    function nonNegativeOK(v) { var n = Number(v); return v == null || n === 0 || (isFinite(n) && n >= 0); }
    function currencyOK(v) { return /^[A-Z]{3}$/.test(String(v || '').toUpperCase()); }
    function dateOK(v) { return /^\d{4}-\d{2}-\d{2}$/.test(String(v || '')); }

    /* Cuentas y transferencias pueden venir en la raiz (v3) o anidadas en
       cfg (versiones preliminares); ambas son aceptadas. */
    var accounts = Array.isArray(data.accounts) ? data.accounts :
      ((Array.isArray(data.cfg.accounts) ? data.cfg.accounts : null));
    var transfers = Array.isArray(data.transfers) ? data.transfers :
      ((Array.isArray(data.cfg.transfers) ? data.cfg.transfers : null));
    var accIds = {};
    if (accounts) {
      if (!Array.isArray(accounts) || accounts.some(function (a) { return !a || typeof a !== 'object' || !a.id; })) {
        return bad('El respaldo está dañado: las cuentas no son válidas.');
      }
      var badAccount = accounts.some(function (a) {
        claim(a.id);
        accIds[String(a.id)] = 1;
        return !currencyOK(a.cur || a.currency) || !finiteOK(a.initial != null ? a.initial : a.balance);
      });
      if (badAccount) return bad('El respaldo contiene un saldo inicial o una divisa de cuenta inválida.');
    }
    if (transfers) {
      if (!Array.isArray(transfers) || transfers.some(function (x) { return !x || typeof x !== 'object' || !x.from || !x.to; })) {
        return bad('El respaldo está dañado: las transferencias no son válidas.');
      }
      var badTransfer = transfers.some(function (x) {
        claim(x.id);
        var rate = Number(x.rate);
        var invalid = !amountOK(x.a != null ? x.a : x.amount) || !isFinite(rate) || !(rate > 0) || x.from === x.to ||
          (accounts && (!accIds[String(x.from)] || !accIds[String(x.to)]));
        if (x.orig != null && !amountOK(x.orig)) return true;
        return invalid;
      });
      if (badTransfer) return bad('El respaldo contiene transferencias con importes, tasas o cuentas inválidas.');
    }

    var debts = Array.isArray(data.cfg.debts) ? data.cfg.debts : [];
    var recs = Array.isArray(data.cfg.recurring) ? data.cfg.recurring : [];
    var badDebt = debts.some(function (d) {
      if (!d || typeof d !== 'object') return true;
      claim(d.id);
      if (!amountOK(d.amount != null ? d.amount : d.a) || !currencyOK(d.cur) || !dateOK(d.date || d.settledAt)) return true;
      var pays = d.payments || [];
      if (!Array.isArray(pays)) return true;
      return pays.some(function (p) {
        if (!p || typeof p !== 'object') return true;
        claim(p.id);
        return !amountOK(p.amount) || !currencyOK(p.cur) || !dateOK(p.d) ||
          !isFinite(Number(p.rate)) || !(Number(p.rate) > 0) ||
          (accounts && p.acc && !accIds[String(p.acc)]);
      });
    });
    if (badDebt) return bad('El respaldo contiene deudas, cuotas o importes inválidos.');
    var badRec = recs.some(function (r) {
      if (!r || typeof r !== 'object') return true;
      claim(r.id);
      var day = Number(r.day != null ? r.day : r.d);
      return !amountOK(r.amount != null ? r.amount : r.a) || !isFinite(day) || day < 1 || day > 31 ||
        (accounts && r.acc && !accIds[String(r.acc)]);
    });
    if (badRec) return bad('El respaldo contiene pagos fijos o importes inválidos.');
    if (data.cfg.rates && typeof data.cfg.rates === 'object') {
      var badRate = Object.keys(data.cfg.rates).some(function (k) {
        return !/^[A-Z]{3}>[A-Z]{3}$/.test(k) || !amountOK(data.cfg.rates[k]);
      });
      if (badRate) return bad('El respaldo contiene tasas de cambio inválidas.');
    }
    if (data.cfg.cats && Array.isArray(data.cfg.cats)) {
      var badCat = data.cfg.cats.some(function (c) {
        return !c || typeof c !== 'object' || !c.id || (c.budget != null && !nonNegativeOK(c.budget));
      });
      if (badCat) return bad('El respaldo contiene categorías o presupuestos inválidos.');
    }

    var months = data.months || {};
    var badTx = Object.keys(months).some(function (ym) {
      if (!validMonthKey(ym) || !Array.isArray(months[ym])) return true;
      return months[ym].some(function (tx) {
        if (!tx || typeof tx !== 'object') return true;
        claim(tx.id);
        if (!amountOK(tx.a) || (tx.orig != null && Number(tx.orig) > 0 && !amountOK(tx.orig))) return true;
        if (tx.t !== 'g' && tx.t !== 'i') return true;
        if (!dateOK(tx.d) || String(tx.d).slice(0, 7) !== ym) return true;
        if (tx.orig != null && tx.cur && !currencyOK(tx.cur)) return true;
        return !!(accounts && tx.acc && !accIds[String(tx.acc)]);
      });
    });
    if (badTx) return bad('El respaldo contiene movimientos con importes, fechas o cuentas inválidos.');
    if (duplicate) return bad('El respaldo contiene identificadores duplicados (' + duplicate + ').');
    return { ok: true, version: sv };
  }

  function validMonthKey(k) { return /^\d{4}-(0[1-9]|1[0-2])$/.test(k); }

  function readBackup(file) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error('missing-file')); return; }
      /* Copia de seguridad en memoria: si el archivo falla, se restaura tal cual. */
      var safety = localSnapshot();
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(String(reader.result || ''));
          var v = validateBackup(data);
          if (!v.ok) {
            restoreSnapshot(safety);
            var err = new Error('invalid');
            err.msgText = v.msgText;
            reject(err);
            return;
          }
          memoryBackup = safety;
          resolve(data);
        } catch (e) {
          restoreSnapshot(safety);
          e.msgText = 'El archivo está dañado o incompleto; tus datos siguen intactos.';
          reject(e);
        }
      };
      reader.onerror = function () {
        restoreSnapshot(safety);
        reject(reader.error || new Error('read-error'));
      };
      reader.readAsText(file);
    });
  }

  /* ---------- CSV ---------- */
  function csvCell(value) {
    var s = value == null ? '' : String(value);
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv(filename, rows) {
    var body = rows.map(function (row) {
      return row.map(csvCell).join(',');
    }).join('\r\n');
    download(filename, '\uFEFF' + body + '\r\n', 'text/csv;charset=utf-8');
  }

  global.CWStorage = {
    KEY: KEY,
    LEGACY_KEY: LEGACY_KEY,
    guessCurrency: guessCurrency,
    load: load,
    save: save,
    clear: clear,
    download: download,
    exportBackup: exportBackup,
    readBackup: readBackup,
    validateBackup: validateBackup,
    exportCsv: exportCsv,
    /* Etapas 1 y 2: almacenamiento durable y sin limite de 5 MB */
    DB_NAME: DB_NAME,
    DB_VERSION: DB_VERSION,
    SCHEMA_VERSION: SCHEMA_VERSION,
    migrateData: migrateData,
    whenReady: whenReady,
    isIndexedDBReady: function () { return idbReady && !idbFailed; },
    /* Fallo real de persistencia: callback y evento `onStorageError`. */
    STORAGE_ERROR_MESSAGE: STORAGE_ERROR_MESSAGE,
    get onStorageError() { return storageErrorHandler; },
    set onStorageError(fn) { storageErrorHandler = typeof fn === 'function' ? fn : null; },
    lastStorageError: function () { return lastStorageError; },
    isStorageHealthy: function () { return !lastStorageError && !idbFailed; },
    putFile: putFile,
    getFile: getFile,
    listFiles: listFiles,
    deleteFile: deleteFile
  };
})(window);
