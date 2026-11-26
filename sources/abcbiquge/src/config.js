var BASE_URL = "https://m.bqg6.xyz";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
  "req": { "charset": "gbk" },
  "tabs": {
    "Mới cập nhật": "/"
  },
  "search": "/?searchkey={q}",
  "ch_rewrite": ["/info-(\\d+)/?$", "/wapbook-$1_1/"],
  "ch_list": ".chapter li a",
  "ch_next": "div.page a:contains(下一页)",
  "ch_delay": 200,
  "ch_maxPages": 5,
  "content": "div.text",
  "item": "div.article > div.block, p.line",
  "link": "a[href*='/info-']@href || a.blue@href || a@href",
  "title": "h2 || a.blue || a[href*='/info-'] || a",
  "d_title": "h1 || meta[property=og:title]@content",
  "d_cover": "meta[property=og:image]@content || img@img",
  "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
  "genrePage": "/sort.html",
  "genre": "a[href*='/sort-']"
};
