var BASE_URL = "https://phimtv2.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
 "tabs": {
  "Phim mới": "/the-loai/phim-moi-{p}",
  "Phim lẻ": "/the-loai/phim-le-{p}",
  "Phim bộ": "/the-loai/phim-bo-{p}",
  "Chiếu rạp": "/the-loai/phim-chieu-rap-{p}"
 },
 "search": "/search?k={q}",
 "item": "a.card-movie",
 "title": "h3.title || :self@title || img@alt",
 "link": ":self@href",
 "ch_list": "ul.card-episode-nav a",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "meta[name=description]@content",
 "cover": "img@img",
 "desc": ".ribbon",
 "ch_url": "a[href*=\"/xem-phim/\"]@href",
 "ch_fallback_single": "Xem phim",
 "iframe": "#iframeStream",
 "pageSize": 20,
 "servers": "a.btn-stream",
 "server_data": ":self@href"
};
