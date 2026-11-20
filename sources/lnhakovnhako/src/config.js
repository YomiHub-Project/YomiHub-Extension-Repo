var HAKO_MIRRORS = [
  'https://docln.sbs',
  'https://ln.hako.vn',
  'https://docln.net'
];
var BASE_URL = HAKO_MIRRORS[0];

try {
  var cfgDom = typeof DOMAIN !== 'undefined' && DOMAIN ? String(DOMAIN).trim() : '';
  if (!cfgDom && typeof localConfig !== 'undefined' && localConfig && localConfig.getItem) {
    cfgDom = String(localConfig.getItem('DOMAIN') || '').trim();
  }
  if (!cfgDom && typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
    cfgDom = String(CONFIG_URL).trim();
  }
  if (cfgDom && /^https?:\/\//i.test(cfgDom)) {
    BASE_URL = cfgDom.replace(/\/+$/, '');
  }
} catch (e) {}

var HAKO_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
var HAKO_HOST_RE = /^https?:\/\/(?:www\.)?(?:ln\.hako\.vn|ln\.hako\.re|docln\.net|docln\.sbs|hako\.vn|hako\.vip)(?=\/|$)/i;

function hakoNormalizeUrl(url, mirror) {
  var u = String(url || '').trim();
  var base = (mirror || BASE_URL).replace(/\/+$/, '');
  if (!u) return base + '/';
  if (u.indexOf('//') === 0) u = 'https:' + u;
  if (u.charAt(0) === '/') return base + u;
  if (!/^https?:\/\//i.test(u)) return base + '/' + u;
  return HAKO_HOST_RE.test(u) ? u.replace(HAKO_HOST_RE, base) : u;
}

function hakoIsCloudflare(status, body) {
  if (status !== 403 && status !== 503 && status !== 429) return false;
  var head = String(body || '').slice(0, 20000);
  return /cf_chl|challenge-platform|Just a moment|Attention Required|cf-turnstile|Verifying you are human/i.test(head);
}

function hakoFetchDoc(url) {
  var pool = [BASE_URL];
  for (var i = 0; i < HAKO_MIRRORS.length; i++) {
    if (pool.indexOf(HAKO_MIRRORS[i]) === -1) pool.push(HAKO_MIRRORS[i]);
  }

  var hadCf = false;
  var lastErr = '';

  for (var j = 0; j < pool.length; j++) {
    var mirror = pool[j];
    var target = hakoNormalizeUrl(url, mirror);
    try {
      var res = fetch(target, {
        headers: {
          'User-Agent': HAKO_UA,
          'Referer': mirror + '/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8'
        }
      });
      if (!res) {
        lastErr = mirror + ': không nhận được phản hồi';
        continue;
      }
      var text = res.text() || '';
      if (hakoIsCloudflare(res.status, text)) {
        hadCf = true;
        lastErr = mirror + ': Cloudflare HTTP ' + res.status;
        continue;
      }
      if (res.status >= 400 || res.status === 0 || text.length < 500) {
        lastErr = mirror + ': HTTP ' + res.status + ' (' + text.length + 'B)';
        continue;
      }
      BASE_URL = mirror;
      return Html.parse(text, target);
    } catch (err) {
      lastErr = mirror + ': ' + (err && err.message ? err.message : String(err));
    }
  }

  if (hadCf) {
    throw new Error('CLOUDFLARE: Trang Hako yêu cầu xác minh chống bot. Vui lòng mở nguồn bằng WebView trong ứng dụng, hoàn tất xác minh rồi tải lại.');
  }
  throw new Error('Hako: không kết nối được máy chủ (' + (lastErr || 'lỗi mạng') + '). Kiểm tra mạng/VPN hoặc đổi Tên miền trong Cài đặt.');
}

function hakoExtractBg(el) {
  if (!el) return '';
  var bg = el.attr('data-bg') || el.attr('data-src') || '';
  if (!bg) {
    var st = el.attr('style') || '';
    var m = /url\(\s*['"]?([^'")]+)['"]?\s*\)/i.exec(st);
    if (m) bg = m[1];
  }
  if (!bg) return '';
  if (bg.indexOf('//') === 0) return 'https:' + bg;
  if (bg.indexOf('/') === 0) return BASE_URL + bg;
  return bg;
}

function hakoFixUrl(u) {
  if (!u) return '';
  u = String(u).trim();
  if (u.indexOf('//') === 0) return 'https:' + u;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.charAt(0) === '/') return BASE_URL + u;
  return BASE_URL + '/' + u;
}
