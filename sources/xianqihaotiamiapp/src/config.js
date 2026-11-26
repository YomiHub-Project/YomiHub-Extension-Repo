var BASE_URL = "http://www.xianqihaotianmi.org";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "玄幻": "/list/1-{p}.html",
  "仙侠": "/list/2-{p}.html",
  "言情": "/list/3-{p}.html",
  "历史": "/list/4-{p}.html",
  "网游": "/list/5-{p}.html",
  "科幻": "/list/6-{p}.html",
  "恐怖": "/list/7-{p}.html",
  "其他": "/list/8-{p}.html",
  "总排行": "/book/allvisit-{p}.html"
 },
 "item": ".col-sm-index .media",
 "link": "h4.book-title a@href",
 "title": "h4.book-title a",
 "cover": "img@img",
 "desc": ".book-intro-index",
 "next": "ul.pagination li.active + li a",
 "search_post": {
  "url": "/modules/article/search.php",
  "body": "searchkey={q}"
 },
 "s_item": "table tr:has(a[href*=\"/book/\"])",
 "s_link": "a[href*=\"/book/\"]@href",
 "s_title": "a[href*=\"/book/\"]",
 "d_title": "meta[property=og:novel:book_name]@content || h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img.img-thumbnail@img",
 "d_author": "meta[property=og:novel:author]@content",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "ul.list-charts li a",
 "content": ".content-body.content-ext, .content-body",
 "genre": "a[href*='/list/']"
};