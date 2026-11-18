load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(q, page) {
  var p = C.page(page);
  var path = '/?s=' + encodeURIComponent(q || '') + (p > 1 ? '&page=' + p : '');
  var res = fetchWithDomainFallback(path);
  var doc = res.html();
  var items = [];
  var els = doc.select('.flw-item, ul.list-film > li.item, .film-item');
  for (var i = 0; i < els.size(); i++) {
    var el = els.get(i);
    var a = el.select('.film-name a, a.dynamic-name, a.film-poster-ahref').first();
    if (!a) continue;
    var name = a.text() || a.attr('title');
    var link = a.attr('href');
    var img = el.select('.film-poster-img, img').first();
    var cover = img ? (img.attr('src') || img.attr('data-src')) : '';
    var orig = el.select('.film-name-original').text() || '';
    if (name && link) {
      items.push({
        name: name.trim(),
        link: C.fix(link),
        cover: C.fix(cover),
        description: orig,
        host: BASE_URL
      });
    }
  }
  return Response.success(items, C.next(items.length >= 10, p));
}
