var BASE_URL = "https://sexvietnam69.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

var G = {
  "req": {
    "headers": {
      "User-Agent": UA,
      "Referer": BASE_URL + "/"
    }
  },
  "tabs": {
    "Mới nhất": "/[trang-{p}.html]",
    "Phim sex Việt Nam": "/phim-sex-viet-nam/[trang-{p}.html]",
    "Phim sex Loạn Luân": "/phim-sex-loan-luan/[trang-{p}.html]",
    "Phim sex Châu Á": "/phim-sex-chau-a/[trang-{p}.html]",
    "Phim sex Châu Âu": "/phim-sex-chau-au/[trang-{p}.html]"
  },
  "search": "/?s={q}[&page={p}]",
  "item": "li.item-movie, .item-movie",
  "link": "a@href",
  "title": "a@title || .title a || h3 || h2",
  "cover": "img@data-original || img@data-src || img@src",
  "desc": ".description || .desc",
  "d_title": "meta[property=og:title]@content || title || h1",
  "d_cover": "meta[property=og:image]@content || .image img@src",
  "d_desc": "meta[name=description]@content || .desc || .detail",
  "d_genres": ".category a, .tags a, .genre a",
  "single": "Xem phim"
};
