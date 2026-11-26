var BASE_URL = "https://hentaivnreal.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
  "tabs": {
    "Truyện mới": "/danh-sach[?page={p}]",
    "Full màu": "/the-loai/full-color[?page={p}]",
    "Không che": "/the-loai/khong-che[?page={p}]"
  },
  "search": "/tim-kiem?q={q}&type=all[&page={p}]",
  "genre": "main.genre-guide a[href*='/the-loai/'], a.tag[href*='/the-loai/'], a[href*='/the-loai/']",
  "genrePage": "/the-loai",
  "item": "li.item",
  "title": ".box-description p a || .film-name || img@alt",
  "link": ".box-description a@href || .box-cover a@href || a@href",
  "cover": "img.img-list@img || img@img",
  "next": "ul.pagination a:contains(Next), ul.pagination a[href*='page=']",
  "d_title": "h1[itemProp=name] a || h1 || meta[property=og:title]@content",
  "d_cover": "meta[property=og:image]@content || .left-cover img@img || img@img",
  "d_author": ".page-info p:contains(Nhóm dịch) a || .page-info p:contains(Tác giả) a",
  "d_status": ".page-info p:contains(Tình Trạng) span:nth-child(2)",
  "d_desc": ".page-info p:contains(Nội dung) + p || meta[property=og:description]@content || meta[name=description]@content",
  "d_genres": ".page-info a.tag[href*='/the-loai/']",
  "ch_list": "table.listing a[href*='/chap-'], table.listing a",
  "ch_reverse": true,
  "pages": "img[data-idx], img[src*='manga-images']"
};
