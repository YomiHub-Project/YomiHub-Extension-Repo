var BASE_URL = "https://navyteams.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[?page={p}]",
  "Truyện tranh": "/danh-sach-truyen/truyen-tranh[?page={p}]",
  "Oneshot": "/the-loai/oneshot[?page={p}]",
  "BL": "/the-loai/bl[?page={p}]",
  "GL": "/the-loai/gl[?page={p}]"
 },
 "search": "/tim-kiem?keyword={q}[&page={p}]",
 "search_json": {
  "url": "/api/search-story?keyword={q}",
  "title": "title",
  "link": "/truyen/{slug}",
  "cover": "cover"
 },
 "genre": "a[href*='/the-loai/']",
 "item": "div.comic-grid.normal > div.comic-item, div.comic-item",
 "title": "h3 || .comic-title || img@alt",
 "link": "a@href",
 "ch_list": "div.episode-cover a, div.bodyL a",
 "d_title": "h2 || h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || img@img",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "d_genres": "a[href*='/the-loai/']",
 "pages": "div.content-type-manga img",
 "cover": "img@img"
};
