var BASE_URL = "https://fapreel.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var G = {
  "tabs": {
    "Shorts": "/",
    "Trending": "/trendingreels",
    "Blowjob": "/reels/blowjob",
    "MILF": "/reels/milf",
    "POV": "/reels/pov",
    "Teen 18+": "/reels/teen-18"
  },
  "search": "/reels/{q}",
  "item": "article.reel",
  "link": ":self@data-src",
  "title": "a.reel-name || a.reel-topniche || :self@id",
  "cover": "img.reel-poster@src",
  "single": "Play Reel"
};
