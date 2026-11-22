var BACKUP_DOMAINS = [
  "https://animevsub.co.uk",
  "https://animevietsub.bid",
  "https://animevietsub.tv",
  "https://animevietsub.fan",
  "https://animevietsub.moe",
  "https://animevietsub.cc",
  "https://animevietsub.vip",
  "https://animevietsub.sale",
  "https://animevietsub.nl"
];
var BASE_URL = BACKUP_DOMAINS[0];
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var API_URL = "https://anime-api.clubc.org";

try {
  if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    var d = String(DOMAIN).replace(/\/+$/, "");
    if (d) {
      BASE_URL = d;
      if (BACKUP_DOMAINS.indexOf(d) === -1) BACKUP_DOMAINS.unshift(d);
    }
  }
} catch (e) {}

var G = {
  "tabs": {
    "Mới cập nhật": "/[?page={p}]"
  },
  "search": "/tim-kiem?keyword={q}[&page={p}]",
  "item": ".item, .film-item, .flw-item",
  "title": ".title || .name || h3 || a@title",
  "link": "a@href",
  "cover": "img@src || img@data-src",
  "ch_list": "a[href*=chuong], a[href*=chap], a[href*=tap-], a[href*=episode]"
};

// Auto-switch domain helper for TLS handshake EOF / ENOTFOUND / network errors
function fetchWithDomainFallback(pathOrUrl, opt) {
  opt = opt || {};
  var headers = opt.headers || {};
  headers['User-Agent'] = headers['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  var isAbs = /^https?:\/\//i.test(pathOrUrl);
  var path = isAbs ? pathOrUrl.replace(/^https?:\/\/[^\/]+/i, '') : pathOrUrl;
  if (!path || path.charAt(0) !== '/') path = '/' + path;

  var domList = BACKUP_DOMAINS.slice();
  if (isAbs) {
    var m = /^https?:\/\/[^\/]+/i.exec(pathOrUrl);
    if (m && domList.indexOf(m[0]) === -1) domList.unshift(m[0]);
  }

  var lastErr = null;
  var hadCf = false;
  for (var i = 0; i < domList.length; i++) {
    var dom = domList[i];
    var targetUrl = dom + path;
    try {
      headers['Referer'] = dom + '/';
      var res = fetch(targetUrl, {
        method: opt.method || 'GET',
        headers: headers,
        body: opt.body
      });
      if (res && res.ok) {
        var text = res.text();
        BASE_URL = dom;
        return {
          ok: true,
          status: res.status,
          text: function () { return text; },
          html: function () { return Html.parse(text, targetUrl); },
          url: targetUrl
        };
      }
      if (res && (res.status === 403 || res.status === 503)) {
        var cfText = res.text() || '';
        if (/cf_chl|challenge-platform|Just a moment|Attention Required|cf-turnstile|Verifying you are human/i.test(cfText)) {
          hadCf = true;
          continue;
        }
      }
    } catch (e) {
      lastErr = e;
    }
  }

  if (hadCf) {
    throw new Error('CLOUDFLARE: Trang AnimeVietsub yêu cầu xác minh. Mở nguồn bằng WebView trong ứng dụng để tiếp tục.');
  }
  throw new Error('Không thể kết nối đến máy chủ AnimeVietsub sau khi thử các tên miền dự phòng: ' + (lastErr ? lastErr.message : 'HTTP lỗi'));
}
