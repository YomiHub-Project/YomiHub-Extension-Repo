var BASE_URL = "https://hongguoduanju.com";
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
  "search": "/api/search/result?query={q}[&page={p}]",
  "ch_list": "a.pc-episode-cell-TUQIDr, a[href*=/player/]:not(.pc-hero-btn-play-pQT8cU)",
  "ch_name": "div || :self",
  "video": "video@src, source@src",
  "d_title": "h1 || meta[property=og:title]@content",
  "d_cover": "meta[property=og:image]@content || img@img",
  "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
  "item": "div.m-card-rail-ZAMiX2.m-card-rail-mask-right-nAETKt > a.m-card-vMOsDf",
  "link": ":self@href",
  "title": "[class*=title]",
  "cover": "img@img"
};
