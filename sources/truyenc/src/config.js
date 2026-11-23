var BASE_URL = "https://truyenc.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "Truyện ma": "/tim-truyen-ma[?page={p}]",
  "Truyện 18+": "/tim-truyen-18[?page={p}]",
  "Truyện cười": "/tim-truyen-cuoi[?page={p}]"
 },
 "search": "/tim-kiem?keyword={q}[&page={p}]",
 "item": ".card-full-left .d-flex",
 "link": "a[href*=\"/truyen/\"]@href",
 "title": "a[href*=\"/truyen/\"]@title || a[href*=\"/truyen/\"]",
 "cover": "img.story-image@src || img@src",
 "next": ".pagination li.active + li a, a[rel=next]",
 "d_title": "h1 || meta[property=og:title]@content",
 "d_cover": "img.story-image@src || meta[property=og:image]@content",
 "d_desc": "meta[property=og:description]@content || meta[name=description]@content",
 "ch_list": "#storyChapMain a.story-chap-item",
 "content": ".story-content"
};
