load('config.js');
function execute(key, page) {
  var p = parseInt(page || '1', 10) || 1;
  var u = BASE_URL + '/so/search.php?q=' + encodeURIComponent(key || '') + (p > 1 ? '&page=' + p : '');
  var res = fetch(u, { headers: { 'Referer': BASE_URL + '/' } });
  if (!res || !res.ok) return Response.error('HTTP ' + (res ? res.status : 0) + ' ' + u);
  var doc = res.html();
  var data = [], seen = {};
  doc.select('.content-wrap article.excerpt, article.excerpt').forEach(function (e) {
    var a = e.select('header h2 a, h2 a').first();
    if (!a) return;
    var link = a.attr('href') || '';
    if (link.indexOf('.html') < 0 || seen[link]) return;
    seen[link] = 1;
    var note = e.select('.note').first();
    data.push({ name: a.text().trim(), link: link, description: note ? note.text().replace(/\s+/g, ' ').trim().slice(0, 160) : '', host: BASE_URL });
  });
  if (!data.length) {
    doc.select('h2 a[href*=".html"], .list a[href*=".html"]').forEach(function (a) {
      var link = a.attr('href') || '', name = a.text().trim();
      if (!name || link.indexOf('.html') < 0 || seen[link]) return;
      seen[link] = 1;
      data.push({ name: name, link: link.indexOf('http') === 0 ? link : BASE_URL + (link.charAt(0) === '/' ? '' : '/') + link, description: '', host: BASE_URL });
    });
  }
  var nx = doc.select('a:contains(下一页), .next-page a').first();
  return Response.success(data, nx && data.length ? String(p + 1) : '');
}
