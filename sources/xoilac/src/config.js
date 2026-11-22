var BASE_URL = "https://xoilacvbf.tv";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
  "tabs": {
    "Trực tiếp": "/"
  },
  "search": "/?s={q}",
  "item": "div.main-grid-match",
  "link": "a.redirectPopup@href || a[href*=/truc-tiep/]@href",
  "title": "a.redirectPopup@title || a[href*=/truc-tiep/]@title",
  "cover": "img.gmd-comp_logo@src || img@src",
  "single": "Xem trực tiếp"
};
