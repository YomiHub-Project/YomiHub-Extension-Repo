var BASE_URL = "https://global.novelpia.com";
var API_URL = "https://api-global.novelpia.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Bảng xếp hạng": "/ranking"
 },
 "search": "/ranking",
 "item": "div.nv-cover",
 "title": "img@alt || a",
 "link": "a@href",
 "cover": "img@src",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "meta[property=og:image]@content || img@src",
 "d_desc": "meta[property=og:description]@content"
};
