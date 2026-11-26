var BASE_URL = "https://kakuyomu.jp";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[?page={p}]"
 },
 "search": "/search?q={q}[&page={p}]",
 "item": ".Heading_heading__lQ85n, h3.widget-workCard-title",
 "title": "a@title || a || img@alt",
 "link": "a@href",
 "ch_list": "div._workId__workToc__P6xQs a",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "meta[name=description]@content",
 "content": ".widget-episodeBody",
 "c_title": ".widget-episodeTitle",
 "genre": "a[href*='/genres/']"
};