var BASE_URL = "https://sangtacviet.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
  "tabs": {
    "Mới cập nhật": "/"
  },
  "search_post": {
    "url": "/io/searchtp/searchBooks?find=&findinname={q}",
    "body": "ignores="
  },
  "item": "a.cap[href*='/truyen/'], a.booksearch[href*='/truyen/']",
  "title": "b.searchbooktitle || b",
  "link": ":self@href",
  "cover": ".bookthumb img@src || img@src",
  "d_title": "meta[property=og:title]@content || h1",
  "d_cover": "meta[property=og:image]@content || img@img",
  "d_desc": "meta[property=og:description]@content",
  "s_item": "a.booksearch[href*='/truyen/'], a.cap[href*='/truyen/']",
  "s_title": "b.searchbooktitle || b",
  "s_cover": "img@src",
  "s_link": ":self@href"
};
