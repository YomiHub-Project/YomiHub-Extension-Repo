load('bypass.js');
load('config.js');
function execute() {
  var doc = bypass(BASE_URL + '/tim-kiem-nang-cao.html', fetch(BASE_URL + '/tim-kiem-nang-cao.html').html());
  if (!doc) return Response.success([]);
  var genres = [], seen = {};
  doc.select("a[href*='/the-loai/']").forEach(function (e) {
    var href = String(e.attr('href') || '').replace(/^https?:\/\/[^/]+/i, '');
    var title = String(e.text() || '').trim();
    if (!href || !title || seen[href] || title.length > 35) return;
    seen[href] = 1;
    genres.push({ input: href, title: title, script: 'gen.js' });
  });
  return Response.success(genres);
}
