load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var slugMatch = /[\/=]([^\/?#]+-[0-9]+)/.exec(url) || /\/phim\/([^\/?#]+)/.exec(url);
  var slug = slugMatch ? slugMatch[1] : '';

  // 1. Try Anime-API first
  if (slug) {
    try {
      var resApi = fetch(API_URL + '/api/v1/movie/' + slug, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (resApi && resApi.ok) {
        var d = JSON.parse(resApi.text());
        var rawEps = (d.data && d.data.movie && d.data.movie.episodes) ? d.data.movie.episodes : null;
        if (rawEps && rawEps.length > 0) {
          var chapters = [];
          for (var i = 0; i < rawEps.length; i++) {
            var ep = rawEps[i];
            if (!ep.link) continue;
            var label = (ep.server ? ('[' + ep.server + '] ') : '') + (ep.name || ('Tập ' + (i + 1)));
            chapters.push({
              name: label.trim(),
              url: ep.link
            });
          }
          if (chapters.length > 0) {
            return Response.success(chapters);
          }
        }
      }
    } catch (e) {}
  }

  // 2. Fallback: HTML parsing
  var res = fetchWithDomainFallback(url);
  var doc = res.html();
  var chaptersHtml = [];

  var epLinks = doc.select('a[href*="/tap-"], a[href*="tap="], a.btn3dsv, .list-episode a');
  for (var i = 0; i < epLinks.size(); i++) {
    var el = epLinks.get(i);
    var href = el.attr('href') || el.attr('data-link');
    var text = el.text() || el.attr('title') || ('Tập ' + (i + 1));
    if (href) {
      chaptersHtml.push({
        name: text.trim(),
        url: C.fix(href)
      });
    }
  }

  return Response.success(chaptersHtml.length ? chaptersHtml : [{
    name: 'Xem Phim',
    url: url
  }]);
}
