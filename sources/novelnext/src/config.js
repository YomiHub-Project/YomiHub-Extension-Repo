var BASE_URL = "https://novelnext.me";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[?page={p}]",
  "Phổ biến": "/most-popular[?page={p}]",
  "Hoàn thành": "/completed-novel[?page={p}]"
 },
 "search": "/search?keyword={q}[&page={p}]",
 "genre": "a[href*='/genre/']",
 "item": ".item, .list-novel .row",
 "title": "h3 a || h3 || a@title || img@alt",
 "link": "h3 a@href || a@href",
 "s_item": ".list-novel .row, .item",
 "s_title": "h3.novel-title a || h3 a || a@title",
 "s_link": "h3.novel-title a@href || h3 a@href || a@href",
 "s_cover": "img@img",
 "ch_list": "ul.list-chapter li a, .list-chapter a",
 "d_title": "h3.title || h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "meta[name=description]@content",
 "d_genres": "ul.info-meta a[href*='/genre/'], a[href*='/genre/']",
 "content": "#chr-content, #chapter-content"
};
