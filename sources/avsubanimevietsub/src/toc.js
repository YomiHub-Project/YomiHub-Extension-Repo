load('config.js');
load('lib_common.js');
load('lib_generic.js');

function unwrapDirectStream(u) {
  u = String(u || '').trim();
  if (!u) return '';
  var m = /[?&](?:url|file|src|link)=([^&#]+)/i.exec(u);
  if (m) {
    try {
      var inner = decodeURIComponent(m[1]).trim();
      if (/^https?:\/\//i.test(inner)) {
        var innerPath = inner.split(/[?#]/)[0];
        if (/\.(?:m3u8|mp4)$/i.test(innerPath)) return inner;
      }
    } catch (e) {}
  }
  return u;
}

function isDirectStream(u) {
  var path = String(u || '').trim().split(/[?#]/)[0];
  return /\.(?:m3u8|mp4)$/i.test(path);
}

function execute(url) {
  var slugMatch = /[\/=]([^\/?#]+-[0-9]+)/.exec(url) || /\/phim\/([^\/?#]+)/.exec(url);
  var slug = slugMatch ? slugMatch[1] : '';

  // 1. Try Anime-API first (deduplicate embed mirrors, prefer direct m3u8/mp4 streams)
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
          var byKey = {};
          for (var i = 0; i < rawEps.length; i++) {
            var ep = rawEps[i];
            if (!ep || !ep.link) continue;
            var srv = String(ep.server || '').trim();
            var epName = String(ep.name || ('Tập ' + (i + 1))).trim();
            var label = (srv ? ('[' + srv + '] ') : '') + epName;
            var key = (srv + '|' + (ep.slug || epName)).toLowerCase();
            var link = unwrapDirectStream(ep.link);
            var isDirect = ep.type === 'm3u8' || isDirectStream(link);

            if (byKey[key] === undefined) {
              byKey[key] = { idx: chapters.length, direct: isDirect };
              chapters.push({
                name: label,
                url: link
              });
            } else if (isDirect && !byKey[key].direct) {
              // Upgrade previously stored embed entry to direct native stream
              chapters[byKey[key].idx].url = link;
              byKey[key].direct = true;
            }
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
  var seen = {};

  var epLinks = doc.select('a[href*="/tap-"], a[href*="tap="], a.btn3dsv, .list-episode a');
  for (var i = 0; i < epLinks.size(); i++) {
    var el = epLinks.get(i);
    var href = el.attr('href') || el.attr('data-link');
    var text = el.text() || el.attr('title') || ('Tập ' + (i + 1));
    if (href) {
      var fixed = C.fix(href);
      if (!seen[fixed]) {
        seen[fixed] = true;
        chaptersHtml.push({
          name: text.trim(),
          url: fixed
        });
      }
    }
  }

  return Response.success(chaptersHtml.length ? chaptersHtml : [{
    name: 'Xem Phim',
    url: url
  }]);
}
