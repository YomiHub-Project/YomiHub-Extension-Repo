var BACKUP_DOMAINS = [
  "https://sexviettuyenchon.com",
  "https://sexvietnam69.com",
  "https://phimsexviet113.com",
  "https://top1sexvn.com",
  "https://sexviettop.net"
];
var BASE_URL = BACKUP_DOMAINS[0];
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

var G = {
  "req": {
    "headers": {
      "User-Agent": UA,
      "Referer": BASE_URL + "/"
    }
  },
  "tabs": {
    "Phim sex Nhật Bản": "/phim-sex-nhat-ban/[trang/{p}/]",
    "Phim sex Vietsub": "/phim-sex-vietsub/[trang/{p}/]",
    "Phim sex Trung Quốc": "/phim-sex-trung-quoc/[trang/{p}/]",
    "Phim sex Châu Âu": "/phim-sex-chau-au/[trang/{p}/]",
    "Phim sex Việt Nam": "/phim-sex-viet-nam/[trang/{p}/]",
    "Mới nhất": "/[trang/{p}/]"
  },
  "search": "/?s={q}[&page={p}]",
  "item": "li.item-movie, .item-movie",
  "link": "a@href",
  "title": "a@title || .title a || h3 || h2",
  "cover": "img@data-original || img@data-src || img@src",
  "desc": ".description || .desc",
  "d_title": "meta[property=og:title]@content || title || h1",
  "d_cover": "meta[property=og:image]@content || .image img@src",
  "d_desc": "meta[name=description]@content || .desc || .detail",
  "d_genres": ".category a, .tags a, .genre a",
  "single": "Xem phim"
};
