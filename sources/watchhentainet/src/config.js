var BASE_URL = "https://watchhentai.net";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
 "tabs": {
  "Mới cập nhật": "/[page/{p}/]"
 },
 "search": "/?s={q}[&page={p}]",
 "item": "article.item.tvshows",
 "title": "h3 || .data h3 || img@alt",
 "link": "a@href",
 "ch_list": "ul.episodios a.tv-ep-card-link, ul.episodios a",
 "ch_name": ".eptitle || a@title",
 "iframe": "iframe#search_iframe, iframe[data-primary-player-url], iframe[src], iframe[data-src]",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "meta[name=description]@content"
};
