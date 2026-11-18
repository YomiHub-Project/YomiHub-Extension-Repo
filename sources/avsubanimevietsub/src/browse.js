load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(input, page) {
  var p = C.page(page);

  // 1. Primary: Anime-API (fast JSON from animevsub backend)
  try {
    var resHome = fetch(API_URL + '/api/v1/home', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (resHome && resHome.ok) {
      var d = JSON.parse(resHome.text());
      var raw = [];
      if (d.hot && d.hot.length) raw = raw.concat(d.hot);
      if (d.series && d.series.length) raw = raw.concat(d.series);
      if (d.anime && d.anime.length) raw = raw.concat(d.anime);
      if (d.single && d.single.length) raw = raw.concat(d.single);

      // Deduplicate by slug
      var seen = {};
      var list = [];
      for (var i = 0; i < raw.length; i++) {
        var it = raw[i];
        if (it && it.slug && !seen[it.slug]) {
          seen[it.slug] = true;
          list.push(it);
        }
      }

      var pageSize = 20;
      var start = (p - 1) * pageSize;
      var end = Math.min(list.length, start + pageSize);
      if (start < list.length) {
        var items = [];
        for (var j = start; j < end; j++) {
          var item = list[j];
          var cover = item.poster_url || item.thumb_url || '';
          if (cover && cover.indexOf('http') !== 0) cover = API_URL + cover;
          items.push({
            name: item.name,
            link: BASE_URL + '/phim/' + item.slug,
            cover: cover,
            description: item.episode_current || '',
            host: BASE_URL
          });
        }
        return Response.success(items, C.next(end < list.length, p));
      }
    }
  } catch (e) {}

  // 2. Secondary fallback: movies.xml
  try {
    var rXml = fetchWithDomainFallback('/movies.xml');
    var docXml = rXml.html();
    var itemEls = docXml.select('item');
    if (itemEls && itemEls.size() > 0) {
      var items = [];
      var start = (p - 1) * 20;
      var end = Math.min(itemEls.size(), start + 20);
      for (var i = start; i < end; i++) {
        var el = itemEls.get(i);
        var title = el.select('title').text();
        var link = el.select('link').text() || el.select('guid').text();
        var desc = el.select('description').text();
        if (title && link) {
          items.push({
            name: title.trim(),
            link: C.fix(link.trim()),
            cover: '',
            description: desc || '',
            host: BASE_URL
          });
        }
      }
      if (items.length > 0) {
        return Response.success(items, C.next(end < itemEls.size(), p));
      }
    }
  } catch (e) {}

  // 3. Fallback: Standard HTML browse
  var path = p > 1 ? '/?page=' + p : '/';
  var res = fetchWithDomainFallback(path);
  var doc = res.html();
  var items = [];
  var els = doc.select('.item, .film-item, .flw-item');
  for (var i = 0; i < els.size(); i++) {
    var el = els.get(i);
    var a = el.select('a[href*="/phim/"], a[href*="/anime/"], a').first();
    if (!a) continue;
    var name = a.text() || a.attr('title');
    var link = a.attr('href');
    var img = el.select('img').first();
    var cover = img ? (img.attr('src') || img.attr('data-src')) : '';
    if (name && link) {
      items.push({
        name: name.trim(),
        link: C.fix(link),
        cover: C.fix(cover),
        description: '',
        host: BASE_URL
      });
    }
  }
  return Response.success(items, C.next(items.length >= 10, p));
}
