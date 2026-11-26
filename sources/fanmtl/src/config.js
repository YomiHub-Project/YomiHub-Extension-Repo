var BASE_URL = "https://www.fanmtl.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[?page={p}]"
 },
 "search": "/tim-kiem?keyword={q}[&page={p}]",
 "search_post": {
  "url": "/e/search/index.php",
  "body": "show=title&tempid=1&tbname=news&keyboard={q}"
 },
 "search_post": {
  "url": "/e/search/index.php",
  "body": "show=title&tempid=1&tbname=news&keyboard={q}"
 },
 "s_item": ".novel-item",
 "s_title": "h4 || a@title || img@alt",
 "s_link": "a@href",
 "item": ".novel-item",
 "title": "h4 || a@title || img@alt",
 "link": "a@href",
 "ch_list": "#chpagedlist a",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "meta[name=description]@content",
 "ch_reverse": true,
 "content": ".chapter-content, #chapter-content, .content",
 "genre": "a[href*='/list/']",
 "genrePage": "/list/all/all-onclick-0.html"
};