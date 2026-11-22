var BACKUP_DOMAINS = [
  "https://phimmoii.run",
  "https://phimmoii.beer",
  "https://phimmoic.vc",
  "https://phimmoii.bid",
  "https://phimmoii.mom",
  "https://phimmoic.ws",
  "https://phimmois.sh"
];
var BASE_URL = BACKUP_DOMAINS[0];
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
try {
  if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    var d = String(DOMAIN).replace(/\/+$/, "");
    if (d && /^https?:\/\//i.test(d)) {
      BASE_URL = d;
      if (BACKUP_DOMAINS.indexOf(d) === -1) BACKUP_DOMAINS.unshift(d);
    }
  }
} catch (e) {}

var PM_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

var G = {
  "tabs": {
    "Mới cập nhật": "/[page/{p}/]"
  },
  "search": "/?s={q}[&page={p}]",
  "item": ".flw-item, ul.list-film > li.item, .film-item",
  "title": ".film-name a || .dynamic-name || .title || .name || img@alt || a@title",
  "link": "a.film-poster-ahref@href || .film-name a@href || a@href",
  "cover": ".film-poster-img@src || .film-poster-img@data-src || img@src",
  "d_title": "h1.film-name || h1 || meta[property='og:title']@content",
  "d_cover": "meta[property='og:image']@content || .film-poster-img@src || .thumb img@src",
  "d_desc": "meta[property='og:description']@content || .film-description || .description",
  "ch_list": ".donphuongdocma .ep-range a, a[href*='/xem-phim/']"
};

// Auto-switch domain helper: always prioritizes BASE_URL for known mirror URLs so dead saved mirrors don't stall.
function fetchWithDomainFallback(pathOrUrl, opt) {
  opt = opt || {};
  var headers = opt.headers || {};
  headers['User-Agent'] = headers['User-Agent'] || PM_UA;

  var isAbs = /^https?:\/\//i.test(pathOrUrl);
  var path = isAbs ? pathOrUrl.replace(/^https?:\/\/[^\/]+/i, '') : pathOrUrl;
  if (!path || path.charAt(0) !== '/') path = '/' + path;

  var domList = [BASE_URL];
  for (var b = 0; b < BACKUP_DOMAINS.length; b++) {
    if (domList.indexOf(BACKUP_DOMAINS[b]) === -1) domList.push(BACKUP_DOMAINS[b]);
  }
  if (isAbs) {
    var m = /^https?:\/\/[^\/]+/i.exec(pathOrUrl);
    if (m && domList.indexOf(m[0]) === -1) domList.unshift(m[0]);
  }

  var lastErr = '';
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
        var text = res.text() || '';
        if (text.indexOf('waybackmachinedownloader.com') !== -1 || text.indexOf('DEMO version only includes') !== -1) {
          lastErr = dom + ': trang demo';
          continue;
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
      lastErr = dom + ': HTTP ' + (res ? res.status : 0);
    } catch (e) {
      lastErr = dom + ': ' + (e && e.message ? e.message : String(e));
    }
  }
  throw new Error('Không thể kết nối đến máy chủ Phimmoi sau khi thử các tên miền dự phòng (' + (lastErr || 'lỗi mạng') + ') – trang có thể đang lỗi hoặc bị nhà mạng chặn. Thử bật VPN/Tor cho tiện ích hoặc đổi tên miền.');
}
