var BASE_URL = "https://animevn.net";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}

var G = {
  "tabs": {
    "Mới cập nhật": "/[?page={p}]"
  },
  "search": "/search.html?q={q}",
  "item": "div.item:has(div.anime-cover), li:has(.thumb)",
  "title": "h3 || .name || img@alt || a@title",
  "link": "a@href",
  "ch_list": "li.citem a[href*=tap-], a[href*=tap-]",
  "d_title": "h1 || meta[property=og:title]@content",
  "d_cover": "meta[property=og:image]@content || .thumb img@src || .poster img@src || img@src",
  "d_desc": "meta[name=description]@content"
};

function fetchWithRetry(url, opt, retries) {
  retries = typeof retries === 'number' ? retries : 3;
  opt = opt || {};
  var headers = opt.headers || {};
  headers['User-Agent'] = headers['User-Agent'] || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  var cleanUrl = String(url || '').trim();
  if (!cleanUrl) {
    throw new Error('URL không hợp lệ hoặc để trống.');
  }
  if (!/^https?:\/\//i.test(cleanUrl)) {
    cleanUrl = BASE_URL + (cleanUrl.charAt(0) === '/' ? '' : '/') + cleanUrl;
  }

  var lastErr = null;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      headers['Referer'] = BASE_URL + '/';
      var res = fetch(cleanUrl, {
        method: opt.method || 'GET',
        headers: headers,
        body: opt.body
      });
      if (res && res.ok) {
        return res;
      }
      if (res && res.status >= 500 && attempt < retries) {
        sleep(500 * attempt);
        continue;
      }
      if (res) return res;
    } catch (e) {
      lastErr = e;
      if (attempt < retries) {
        sleep(500 * attempt);
      }
    }
  }

  throw new Error('Lỗi kết nối máy chủ AnimeVn (' + (lastErr ? lastErr.message : 'ConnectionAborted') + '). Đã thử lại ' + retries + ' lần thất bại.');
}
