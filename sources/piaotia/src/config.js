var BASE_URL = "https://www.piaotia.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "req": {
  "charset": "gbk"
 },
 "tabs": {
  "Mới cập nhật": "/[?page={p}]"
 },
 "search": "/tim-kiem?keyword={q}[&page={p}]",
 "search_post": {
  "url": "/modules/article/search.php",
  "body": "searchtype=articlename&searchkey={q}"
 },
 "ch_list": "ul.navlist a",
 "d_title": "meta[property=og:title]@content || title",
 "d_cover": "meta[property=og:image]@content || img@img",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "item": "table.hide > tr, table.grid tr:has(td a[href*='bookinfo'])",
 "link": "a[href*='bookinfo']@href || a@href",
 "title": "a[href*='bookinfo'] || a",
 "content": "div.main.m_foot",
 "genre": "a[href*='booksort']"
};
