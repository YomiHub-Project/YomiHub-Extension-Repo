load('config.js');
load('lib_common.js');
load('lib_generic.js');

function pmExtractEps(doc) {
  var out = [];
  var seen = {};
  var epLinks = doc.select('.donphuongdocma .ep-range a.ep-item, .donphuongdocma .ep-range a');
  for (var i = 0; i < epLinks.size(); i++) {
    var el = epLinks.get(i);
    var href = el.attr('href');
    if (!href || href.indexOf('/xem-phim/') === -1) continue;
    var full = C.fix(href);
    if (seen[full]) continue;
    seen[full] = true;
    var epText = (el.select('.ep-name').text() || el.select('.ssli-order').text() || el.text() || '').replace(/\s+/g, ' ').trim();
    var name = /^\d+(\.\d+)?$/.test(epText) ? ('Tập ' + epText) : (epText || ('Tập ' + (i + 1)));
    out.push({ name: name, url: full });
  }
  return out;
}

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var doc = res.html();
  var chapters = pmExtractEps(doc);

  // Detail page only links to sample watch URLs; load the first watch page for the full episode list.
  if (!chapters.length) {
    var watchA = doc.select('a[href*="/xem-phim/"]').first();
    if (watchA) {
      var watchUrl = C.fix(watchA.attr('href'));
      try {
        var wRes = fetchWithDomainFallback(watchUrl);
        chapters = pmExtractEps(wRes.html());
      } catch (e) {}
      if (!chapters.length) {
        chapters.push({ name: 'Xem Phim', url: watchUrl });
      }
    }
  }

  return Response.success(chapters.length ? chapters : [{
    name: 'Xem Phim',
    url: url
  }]);
}
