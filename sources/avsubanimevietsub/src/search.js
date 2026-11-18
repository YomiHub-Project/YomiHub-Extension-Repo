load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(q, page) {
  var p = C.page(page);
  var keyword = String(q || '').trim();

  // 1. Primary: Anime-API search
  if (keyword) {
    try {
      var res = fetch(API_URL + '/api/v1/search?q=' + encodeURIComponent(keyword) + '&page=' + p, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res && res.ok) {
        var d = JSON.parse(res.text());
        var movieData = (d.data && d.data.movies && d.data.movies.data) ? d.data.movies.data : null;
        if (movieData && movieData.length > 0) {
          var items = [];
          for (var i = 0; i < movieData.length; i++) {
            var m = movieData[i];
            var cover = m.poster_url || m.thumb_url || '';
            if (cover && cover.indexOf('http') !== 0) cover = API_URL + cover;
            items.push({
              name: m.name,
              link: BASE_URL + '/phim/' + m.slug,
              cover: cover,
              description: m.episode_current || '',
              host: BASE_URL
            });
          }
          var hasNext = d.data.movies.current_page < d.data.movies.last_page;
          return Response.success(items, C.next(hasNext, p));
        }
      }
    } catch (e) {}
  }

  // 2. Fallback: Search within movies.xml
  try {
    var rXml = fetchWithDomainFallback('/movies.xml');
    var docXml = rXml.html();
    var itemEls = docXml.select('item');
    if (itemEls && itemEls.size() > 0) {
      var kLower = keyword.toLowerCase();
      var itemsXml = [];
      for (var i = 0; i < itemEls.size(); i++) {
        var el = itemEls.get(i);
        var title = el.select('title').text();
        var link = el.select('link').text() || el.select('guid').text();
        var desc = el.select('description').text();
        if (title && link) {
          if (!kLower || title.toLowerCase().indexOf(kLower) !== -1 || (desc && desc.toLowerCase().indexOf(kLower) !== -1)) {
            itemsXml.push({
              name: title.trim(),
              link: C.fix(link.trim()),
              cover: '',
              description: desc || '',
              host: BASE_URL
            });
          }
        }
      }
      if (itemsXml.length > 0) {
        return Response.success(itemsXml.slice(0, 30));
      }
    }
  } catch (e) {}

  // 3. Fallback: HTML search
  var path = '/tim-kiem?keyword=' + encodeURIComponent(keyword) + (p > 1 ? '&page=' + p : '');
  var resHtml = fetchWithDomainFallback(path);
  var doc = resHtml.html();
  var itemsHtml = [];
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
      itemsHtml.push({
        name: name.trim(),
        link: C.fix(link),
        cover: C.fix(cover),
        description: '',
        host: BASE_URL
      });
    }
  }
  return Response.success(itemsHtml, C.next(itemsHtml.length >= 10, p));
}
