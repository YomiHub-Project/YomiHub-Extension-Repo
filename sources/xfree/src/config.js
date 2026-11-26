var BASE_URL = "https://www.xfree.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
 "tabs": {
  "Shorts (Video ngắn)": "/[?page={p}]",
    "Trang chủ": "/[?page={p}]",
  "MILF": "/tag/milf[?page={p}]",
  "Amateur": "/tag/amateurs[?page={p}]",
  "Gay": "/gay[?page={p}]"
 },
 "search": "/search?q={q}[&page={p}]",
 "ch_list": "a[href*=chuong], a[href*=chap], a[href*=tap-], a[href*=episode]",
 "item": ".wall__item",
 "title": "img@alt",
 "link": "a@href",
 "cover": "img@img",
 "pageSize": 10,
 "d_title": "meta[property=og:title]@content || h1",
 "d_cover": "meta[property=og:image]@content",
 "d_desc": "meta[property=og:description]@content",
 "single": "Xem video"
};
