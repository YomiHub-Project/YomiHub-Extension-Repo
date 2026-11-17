var BASE_URL = "https://haccbl.xyz";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/moi-cap-nhat/[page/{p}/]"
 },
 "search": "/?s={q}&post_type=manga",
 "item": "div.manga-item-grid",
 "title": "h3 || a.uk-link-heading || img@alt",
 "link": "a@href",
 "ch_list": "#chapter-list div.chapter-item a",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img@img",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "cover": "img@img",
 "pages": "#chapter-content img",
 "ch_name": "h3",
 "ch_next": "#chapter-list ul.uk-pagination a[aria-label='Trang sau']",
 "ch_reverse": true,
 "initmanga": true,
 "s_item": "div.manga-item-ranking, div.manga-item-grid, article.uk-grid-small",
 "s_title": "a.uk-link-heading || h3 || img@alt",
 "s_link": "a.uk-link-heading@href || a@href",
 "s_cover": "img@img"
};
