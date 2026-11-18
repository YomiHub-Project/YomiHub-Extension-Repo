load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var doc = res.html();
  var chapters = [];

  // Check if current page is already a watch page with episodes
  var epLinks = doc.select('.donphuongdocma .ep-range a, a.btn3dsv[data-id], a[href*="/xem-phim/"]');
  if (epLinks && epLinks.size() > 2) {
    for (var i = 0; i < epLinks.size(); i++) {
      var el = epLinks.get(i);
      var link = el.attr('href') || el.attr('data-link');
      var name = el.text() || el.attr('title') || el.attr('data-id') || ('Tập ' + (i + 1));
      if (link && link.indexOf('/xem-phim/') !== -1) {
        chapters.push({
          name: name.trim(),
          url: C.fix(link)
        });
      }
    }
  }

  // If this is the detail page, follow the first watch link to load the full episode list
  if (!chapters.length) {
    var watchA = doc.select('a[href*="/xem-phim/"]').first();
    if (watchA) {
      var watchUrl = C.fix(watchA.attr('href'));
      try {
        var wRes = fetchWithDomainFallback(watchUrl);
        var wDoc = wRes.html();
        var wLinks = wDoc.select('.donphuongdocma .ep-range a, a[href*="/xem-phim/"]');
        for (var j = 0; j < wLinks.size(); j++) {
          var wEl = wLinks.get(j);
          var wHref = wEl.attr('href');
          var wName = wEl.text() || wEl.attr('title') || ('Tập ' + (j + 1));
          if (wHref && wHref.indexOf('/xem-phim/') !== -1) {
            chapters.push({
              name: wName.trim(),
              url: C.fix(wHref)
            });
          }
        }
      } catch (e) {}
      if (!chapters.length) {
        chapters.push({
          name: 'Xem Phim',
          url: watchUrl
        });
      }
    }
  }

  // Deduplicate chapters by URL
  var seen = {};
  var unique = [];
  for (var k = 0; k < chapters.length; k++) {
    var ch = chapters[k];
    if (!seen[ch.url]) {
      seen[ch.url] = true;
      unique.push(ch);
    }
  }

  return Response.success(unique.length ? unique : [{
    name: 'Xem Phim',
    url: url
  }]);
}
