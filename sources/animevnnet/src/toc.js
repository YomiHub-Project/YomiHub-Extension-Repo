load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var u = String(url || '').trim();
  var res = fetchWithRetry(u);
  var doc = res.html();

  var chapters = [];
  var seen = {};
  var epEls = doc.select('li.citem a, a[href*="tap-"]');
  for (var i = 0; i < epEls.size(); i++) {
    var el = epEls.get(i);
    var href = (el.attr('href') || '').trim();
    if (!href || href === '#' || href.indexOf('/the-loai/') !== -1) continue;
    var epUrl = C.fix(href);
    if (seen[epUrl]) continue;
    seen[epUrl] = true;

    var name = el.text() || el.attr('title') || ('Tập ' + (chapters.length + 1));
    name = name.replace(/\s+/g, ' ').trim();
    if (/^[0-9]+$/.test(name)) name = 'Tập ' + name;

    chapters.push({
      name: name,
      url: epUrl
    });
  }

  // Ensure ascending order (Tập 1 -> Tập N)
  if (chapters.length > 1) {
    var firstNum = parseInt(chapters[0].name.replace(/[^0-9]/g, ''), 10);
    var lastNum = parseInt(chapters[chapters.length - 1].name.replace(/[^0-9]/g, ''), 10);
    if (firstNum > lastNum) {
      chapters.reverse();
    }
  }

  return Response.success(chapters.length ? chapters : [{
    name: 'Xem Ngay',
    url: u
  }]);
}
