var BASE_URL = "https://hihiphim.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
 "tabs": {
  "Phim bộ": "/phim-bo[?page={p}]",
  "Phim lẻ": "/phim-le[?page={p}]",
  "Mới cập nhật": "/"
 },
 "search": "/tim-kiem?q={q}[&page={p}]",
 "item": "div.sw-item, div.h-item",
 "title": "h4.item-title || h3 || img@alt",
 "link": "a@href",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img@img",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "a[href*='/xem-phim/']",
 "cover": "img@img",
 "desc": ".pin-new strong",
 "pageSize": 15
};
