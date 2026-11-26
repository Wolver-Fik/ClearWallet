/* ClearWallet — storage, local persistence, JSON backups and CSV export */
(function (global) {
  'use strict';

  var KEY = 'clearwallet-v1';
  var LEGACY_KEY = 'plata-al-dia-v1';

  /* ---------- Capa IndexedDB (Etapa 1) ----------
     IndexedDB pasa a ser el almacen principal; localStorage sigue siendo el
     espejo sincrono que consume app.js. Los archivos van al store 'files',
     fuera del limite de 5 MB de localStorage. */
  var DB_NAME = 'clearwallet_db';
  var DB_VERSION = 1;
  var SCHEMA_VERSION = 2;
  var STORE_STATE = 'state';
  var STORE_FILES = 'files';
  var STATE_KEY = 'main';
  var MIRROR_KEYS = [KEY, LEGACY_KEY, 'clearwallet-lang-v1'];
  var dbPromise = null, idbReady = false, idbFailed = false, pendingWrite = false;
  var initPromise = null, writeChain = Promise.resolve(), memoryBackup = null;

  function idbOpen() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!('indexedDB' in global)) { reject(new Error('IndexedDB no disponible')); return; }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE_STATE)) db.createObjectStore(STORE_STATE);
        if (!db.objectStoreNames.contains(STORE_FILES)) db.createObjectStore(STORE_FILES, { keyPath: 'id' });
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
  function localSnapshot() {
    var snap = {};
    try { MIRROR_KEYS.forEach(function (k) { var v = localStorage.getItem(k); if (v !== null) snap[k] = v; }); } catch (e) {}
    return snap;
  }
  function restoreSnapshot(snap) {
    try {
      MIRROR_KEYS.forEach(function (k) {
        if (Object.prototype.hasOwnProperty.call(snap, k)) localStorage.setItem(k, snap[k]);
      });
    } catch (e) {}
  }
  function writeIDB(data) {
    writeChain = writeChain.then(function () {
      return idbPut(STORE_STATE, STATE_KEY, {
        schemaVersion: SCHEMA_VERSION, app: 'clearwallet', data: data,
        localStorage: localSnapshot(), updatedAt: new Date().toISOString()
      });
    }).catch(function () { idbFailed = true; });
    return writeChain;
  }
  function initIDB() {
    if (initPromise) return initPromise;
    initPromise = idbOpen().then(function () { return idbGet(STORE_STATE, STATE_KEY); })
      .then(function (rec) {
        var local = null;
        try { local = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY) || 'null'); } catch (e) {}
        if (!rec) { if (local) writeIDB(local); return; }
        var remote = (rec.schemaVersion && rec.data) ? rec.data : rec;
        /* Si el usuario ya guardo en esta sesion, esa escritura es la fuente
           de verdad: no se encola una version antigua de IndexedDB. */
        if (pendingWrite) return;
        if (!local || (remote && remote.cfg && (!local.cfg || !hasData(local)))) {
          // IndexedDB tenia datos que localStorage ya no tenia: se restauran.
          try { localStorage.setItem(KEY, JSON.stringify(remote)); } catch (e) {}
          writeIDB(remote);
        } else writeIDB(local);
      }).catch(function () { idbFailed = true; });
    return initPromise;
  }
  function hasData(d) {
    if (!d || !d.months || typeof d.months !== 'object') return false;
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

  /* ---------- local persistence ---------- */
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) {
        raw = localStorage.getItem(LEGACY_KEY);
        if (raw) {
          try { localStorage.setItem(KEY, raw); } catch (e) {}
        }
      }
      var parsed = raw ? JSON.parse(raw) : null;
      /* Migracion automatica localStorage -> IndexedDB (sin perder registros). */
      initIDB();
      return parsed;
    } catch (e) {
      initIDB();
      return null;
    }
  }

  function save(state) {
    var payload = { cfg: state.cfg, months: state.months || {} };
    var ok;
    try {
      localStorage.setItem(KEY, JSON.stringify({
        app: 'clearwallet', schemaVersion: SCHEMA_VERSION, v: 2,
        cfg: payload.cfg, months: payload.months
      }));
      ok = true;
    } catch (e) {
      ok = false;
    }
    pendingWrite = true;
    writeIDB(payload).then(function () { pendingWrite = false; }, function () { pendingWrite = false; });
    return ok;
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { localStorage.removeItem(LEGACY_KEY); } catch (e) {}
    idbDelete(STORE_STATE, STATE_KEY).catch(function () {});
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
      schemaVersion: SCHEMA_VERSION,
      version: 2,
      exportedAt: new Date().toISOString(),
      cfg: state.cfg,
      months: state.months || {}
    };
    download('clearwallet-backup-' + stamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  /* Valida origen y estructura antes de sobrescribir el estado actual. */
  function validateBackup(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return { ok: false, msgText: 'El archivo no contiene un respaldo válido.' };
    }
    if (data.app && String(data.app).toLowerCase() !== 'clearwallet') {
      return { ok: false, msgText: 'Este respaldo pertenece a otra aplicación y no se importará.' };
    }
    var sv = data.schemaVersion == null ? (typeof data.version === 'number' ? data.version : 1) : Number(data.schemaVersion);
    if (!isFinite(sv) || sv < 1 || sv > SCHEMA_VERSION) {
      return { ok: false, msgText: 'La versión de esquema del respaldo no es compatible.' };
    }
    if (!data.cfg || typeof data.cfg !== 'object' || Array.isArray(data.cfg)) {
      return { ok: false, msgText: 'El respaldo está dañado: falta la configuración.' };
    }
    var markers = ['cur', 'cats', 'recurring', 'debts', 'rates', 'saveTarget', 'goal'];
    if (!markers.some(function (k) { return Object.prototype.hasOwnProperty.call(data.cfg, k); })) {
      return { ok: false, msgText: 'El respaldo está incompleto: la configuración no es reconocible.' };
    }
    if (data.months !== undefined && (typeof data.months !== 'object' || Array.isArray(data.months))) {
      return { ok: false, msgText: 'El respaldo está dañado: el historial no es válido.' };
    }
    return { ok: true, version: sv };
  }

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
    /* Etapa 1: almacenamiento durable y sin limite de 5 MB */
    DB_NAME: DB_NAME,
    SCHEMA_VERSION: SCHEMA_VERSION,
    whenReady: whenReady,
    isIndexedDBReady: function () { return idbReady && !idbFailed; },
    putFile: putFile,
    getFile: getFile,
    listFiles: listFiles,
    deleteFile: deleteFile
  };
})(window);
