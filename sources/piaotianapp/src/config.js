var BASE_URL = "https://www.piaotianapp.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "首頁推薦": "/"
 },
 "search": "/sou/{q}.html",
 "item": "li:has(a[href*=\"/ptinfo/\"])",
 "link": "a[href*=\"/ptinfo/\"]@href",
 "title": "a[href*=\"/ptinfo/\"]@title || a[href*=\"/ptinfo/\"]",
 "ch_list": "#play_0 li a[rel=chapter]",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_author": ".m-infos a[href*=\"/author/\"] || meta[property=og:novel:author]@content",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || img@img",
 "d_desc": ".intro .content@html || meta[name=description]@content"
};
