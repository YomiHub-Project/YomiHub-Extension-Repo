var BASE_URL = "https://mimihentai.moe";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/lib[?page={p}]"
 },
 "search": "/lib?search={q}[&page={p}]",
 "item": "a.group[href*='/manga/']",
 "title": "h3",
 "link": ":self@href",
 "cover": "img[src*='moe-cdn.net']@src || img:not([src*='loading'])@src",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img[src*='moe-cdn.net']@src",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "a[href*='/chapter/']",
 "ch_name": ":self",
 "pages": "img[src*='manga-pages']"
};
