var BASE_URL = "https://mangadm.me";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Truyện chữ Đam mỹ": "/2021/08/01/truyen-chu-dam-my/",
  "Mới cập nhật": "/2021/12/26/mangadm/",
  "Manhua BL": "/2020/08/30/manhua-2/",
  "Manga BL": "/2020/08/30/manga-2/",
  "Manhwa BL": "/2020/08/30/manhwa-2/"
 },
 "search": "/?s={q}[&page={p}]",
 "search_json": {
  "url": "/wp-json/wp/v2/search?search={q}&per_page=20",
  "title": "title",
  "link": "url",
  "cover": ""
 },
 "genre": "nav a[href*='mangadm.me/202']",
 "item": ".wp-block-gallery figure.wp-block-image, figure.wp-block-image:has(figcaption)",
 "title": "figcaption || img@alt",
 "link": "a@href",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img@img",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "#page a, .entry-content a[href*='mangadm.me/']:not([href*='truyen-chu'])",
 "cover": "img@img",
 "content": "div.entry-content"
};
