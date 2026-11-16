var BASE_URL = "https://truyencv.io";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/moi-cap-nhat/[page/{p}/]",
  "Bảng xếp hạng": "/bang-xep-hang-truyen/[page/{p}/]"
 },
 "search": "/[page/{p}/]?s={q}",
 "item": "div.uk-panel.uk-position-relative",
 "title": "h3 a.uk-link-heading || h3 || img@alt",
 "link": "h3 a.uk-link-heading@href || a[href*='/truyen/']@href",
 "cover": "img@img",
 "s_item": "article.uk-grid-small",
 "s_title": "a.uk-link-heading",
 "s_link": "a.uk-link-heading@href",
 "s_cover": "img@img",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "#chapter-list div.chapter-item a",
 "ch_name": "h3",
 "ch_next": "#chapter-list ul.uk-pagination a[aria-label='Trang sau']",
 "ch_reverse": true,
 "initmanga": true,
 "content": "#chapter-content, div.uk-article-content"
};
