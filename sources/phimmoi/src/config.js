var BACKUP_DOMAINS = [
  "https://phimmoii.run",
  "https://phimmoii.beer",
  "https://phimmoic.vc",
  "https://phimmoii.mom",
  "https://phimmoii.bid"
];
var BASE_URL = BACKUP_DOMAINS[0];
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
    "Mới cập nhật": "/[page/{p}/]"
  },
  "search": "/?s={q}[&page={p}]",
  "item": ".flw-item, ul.list-film > li.item, .film-item",
  "title": ".film-name a || .dynamic-name || .title || .name || img@alt || a@title",
  "link": "a.film-poster-ahref@href || .film-name a@href || a@href",
  "cover": ".film-poster-img@src || .film-poster-img@data-src || img@src",
  "d_title": "h1 || meta[property='og:title']@content",
  "d_cover": "meta[property='og:image']@content || .film-poster-img@src || .thumb img@src",
  "d_desc": "meta[property='og:description']@content || .film-description || .description",
  "ch_list": "a[href*='/xem-phim/'], a.btn3dsv, a[href*='tap-']"
};

// Auto-switch domain helper for network errors / TLS handshake EOF
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
        if (text && (text.indexOf('waybackmachinedownloader.com') !== -1 || text.indexOf('DEMO version only includes') !== -1)) {
          continue; // Skip Wayback Machine demo page
        }
        BASE_URL = dom;
        return {
          ok: true,
          status: res.status,
          text: function () { return text; },
          html: function () { return Html.parse(text, targetUrl); },
          url: targetUrl
        };
      }
    } catch (e) {
      lastErr = e;
      // Network/TLS EOF -> try next domain in pool
    }
  }
  throw new Error('Không thể kết nối đến máy chủ Phimmoi sau khi tự động đổi tên miền dự phòng: ' + (lastErr ? lastErr.message : 'HTTP lỗi'));
}
