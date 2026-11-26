var BASE_URL = "https://www.pornhub.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

var G = {
  "req": {
    "headers": {
      "User-Agent": UA,
      "Referer": BASE_URL + "/",
      "Cookie": "accessAgeDisclaimerPH=1; platform=pc; age_verified=1"
    }
  },
  "tabs": {
    "Shorts (Video ngắn)": "/shorties[?page={p}]",
    "Thịnh hành": "/video?o=tr[&page={p}]",
    "Mới nhất": "/video?o=mr[&page={p}]",
    "Xem nhiều": "/video?o=mv[&page={p}]",
    "Đánh giá cao": "/video?o=tr[&page={p}]"
  },
  "search": "/video/search?search={q}[&page={p}]",
  "item": "li:has(div.singleVideo), li.pcVideoListItem, .videoBox",
  "link": "a[href*=view_video]@href",
  "title": "a[title]@title || img@alt || .title a",
  "cover": "img@src || img@data-mediumthumb || img@data-thumb_url || img@data-image",
  "d_title": "h1.title || h1 || meta[property=og:title]@content",
  "d_cover": "meta[property=og:image]@content || #player picture img@src",
  "d_desc": "meta[name=description]@content",
  "d_genres": ".categoriesWrapper a, .tagsWrapper a",
  "single": "Xem video"
};
