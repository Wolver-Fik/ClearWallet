/* ClearWallet — storage, local persistence, JSON backups and CSV export */
(function (global) {
  'use strict';

  var KEY = 'clearwallet-v1';
  var LEGACY_KEY = 'plata-al-dia-v1';

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
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ cfg: state.cfg, months: state.months || {} }));
      return true;
    } catch (e) {
      return false;
    }
  }

  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
    try { localStorage.removeItem(LEGACY_KEY); } catch (e) {}
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
      version: 2,
      exportedAt: new Date().toISOString(),
      cfg: state.cfg,
      months: state.months || {}
    };
    download('clearwallet-backup-' + stamp() + '.json', JSON.stringify(payload, null, 2), 'application/json');
  }

  function readBackup(file) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error('missing-file')); return; }
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var data = JSON.parse(String(reader.result || ''));
          if (!data || typeof data !== 'object' || !data.cfg) throw new Error('invalid');
          resolve(data);
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = function () { reject(reader.error || new Error('read-error')); };
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
    exportCsv: exportCsv
  };
})(window);
