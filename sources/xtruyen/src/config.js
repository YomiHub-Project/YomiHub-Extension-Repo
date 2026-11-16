var BASE_URL = "https://xtruyen.vn";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var MADARA = {"path": "truyen", "novel": true};
// XTruyện = Madara đã tuỳ biến: thẻ truyện là div.popular-item-wrap, phân trang bằng ?page=N,
// mục lục chia nhóm 100 chương (li.has-child[data-value="101-to-200"]), chỉ nhóm đầu có sẵn trong HTML.
function xtList(doc) {
  var els = doc.select('div.popular-item-wrap'), out = [], seen = {};
  for (var i = 0; i < els.size(); i++) {
    var e = els.get(i), a = e.select('.widget-title a').first() || e.select('a').first();
    if (!a) continue;
    var link = a.attr('href'), name = a.text() || a.attr('title');
    if (!link || !name || seen[link]) continue;
    seen[link] = 1;
    var last = e.select('.list-chapter a.btn-link').first();
    out.push({ name: name.trim(), link: link, cover: C.img(e.select('img').first()), description: last ? last.text().trim() : '', host: BASE_URL });
  }
  return out;
}
function xtPage(url, p) {
  var n = C.page(p);
  var doc = C.html(url + (n > 1 ? (url.indexOf('?') > 0 ? '&' : '?') + 'page=' + n : ''));
  var items = xtList(doc);
  if (!items.length) items = M.list(doc);
  var more = doc.select('ul.pagination a[href*="page=' + (n + 1) + '"]').size() > 0;
  return Response.success(items, C.next(more && items.length > 0, p));
}
