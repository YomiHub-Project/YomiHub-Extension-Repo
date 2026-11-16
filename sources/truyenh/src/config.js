var BASE_URL = "https://truyenh.top";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[page/{p}/]"
 },
 "search": "/[page/{p}/]?s={q}",
 "item": "div.row.post-row",
 "title": "h3 a.title || h3 a",
 "link": "h3 a@href",
 "next": "ul.pagination a[href*='/page/']",
 "d_title": "h3.title || h1",
 "d_cover": ".book img@img",
 "d_desc": ".desc-text@html",
 "d_author": ".info div:contains(Tác giả)@own",
 "d_genres": ".info a[rel~=category]",
 "ch_list": "#list-chapter ul.list-chapter li a",
 "ch_next": "#pagination li.active + li a",
 "content": "#chapter-c, .chapter-c, .chapter-content, #chapter-content"
};
