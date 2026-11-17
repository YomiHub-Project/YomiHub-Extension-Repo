load('config.js');
load('lib_common.js');

function execute(key, page) {
  var res = fetch(BASE_URL + '/ranking', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': BASE_URL + '/'
    }
  });
  if (!res.ok) return Response.error('HTTP ' + res.status);
  var doc = Html.parse(res.text(), BASE_URL + '/ranking');
  var items = doc.select('div.nv-cover');
  var q = String(key || '').toLowerCase().trim();
  var out = [];
  for (var i = 0; i < items.size(); i++) {
    var el = items.get(i);
    var a = el.select('a').first();
    var img = el.select('img').first();
    var title = img ? img.attr('alt') : (a ? a.text() : '');
    var href = a ? a.attr('href') : '';
    var cover = img ? img.attr('src') : '';
    if (!title || !href) continue;
    if (!q || title.toLowerCase().indexOf(q) >= 0) {
      if (href.indexOf('http') !== 0) href = BASE_URL + (href.indexOf('/') === 0 ? '' : '/') + href;
      if (cover.indexOf('//') === 0) cover = 'https:' + cover;
      out.push({
        name: title,
        link: href,
        cover: cover
      });
    }
  }
  return Response.success(out);
}
