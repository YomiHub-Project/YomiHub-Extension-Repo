load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(key, page) {
  var p = C.page(page);
  var kw = String(key || '').trim();
  if (!kw) return Response.success([]);

  // 1. Primary: Ajax search endpoint
  try {
    var res = fetchWithRetry(BASE_URL + '/search/html/' + p, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: 'keyword=' + encodeURIComponent(kw)
    });

    if (res && res.ok) {
      var doc = res.html();
      var items = [];
      var els = doc.select('li');
      for (var i = 0; i < els.size(); i++) {
        var el = els.get(i);
        var a = el.select('a').first();
        if (!a) continue;
        var href = a.attr('href');
        if (!href) continue;
        var img = a.select('img').first();
        var name = (img ? img.attr('alt') : '') || a.text();
        var cover = img ? (img.attr('src') || img.attr('data-src')) : '';
        var ep = el.select('.chapter-name').text();

        items.push({
          name: (name || '').trim(),
          link: C.fix(href.trim()),
          cover: C.fix(cover),
          description: (ep || '').trim(),
          host: BASE_URL
        });
      }
      if (items.length > 0) {
        return Response.success(items);
      }
    }
  } catch (e) {}

  // 2. Fallback: GET search.html?q=
  try {
    var resGet = fetchWithRetry(BASE_URL + '/search.html?q=' + encodeURIComponent(kw) + (p > 1 ? '&page=' + p : ''));
    if (resGet && resGet.ok) {
      var docGet = resGet.html();
      var itemsGet = [];
      var elsGet = docGet.select('div.item:has(div.anime-cover), li:has(.thumb)');
      for (var j = 0; j < elsGet.size(); j++) {
        var itemEl = elsGet.get(j);
        var linkEl = itemEl.select('a[href*="/anime/"]').first();
        if (!linkEl) continue;
        var itemHref = linkEl.attr('href');
        var imgEl = itemEl.select('img').first();
        var title = (imgEl ? imgEl.attr('alt') : '') || itemEl.select('h3, .name').text() || linkEl.attr('title');
        var itemCover = imgEl ? (imgEl.attr('src') || imgEl.attr('data-src')) : '';
        if (title && itemHref) {
          itemsGet.push({
            name: title.trim(),
            link: C.fix(itemHref.trim()),
            cover: C.fix(itemCover),
            description: '',
            host: BASE_URL
          });
        }
      }
      if (itemsGet.length > 0) {
        return Response.success(itemsGet);
      }
    }
  } catch (e) {}

  return Response.success([]);
}
