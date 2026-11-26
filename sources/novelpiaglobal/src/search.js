load('config.js');
load('lib_common.js');

function execute(key, page, filters) {
  var isUrl = /^https?:\/\//i.test(String(key || '').trim());
  var targetUrl = isUrl ? String(key).trim() : (BASE_URL + '/ranking');
  var res = fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': BASE_URL + '/'
    }
  });
  if (!res.ok) return Response.error('HTTP ' + res.status);
  var doc = Html.parse(res.text(), targetUrl);
  var items = doc.select(isUrl ? 'div.nv-list-item, div.nv-cover' : 'div.nv-cover');
  var q = isUrl ? '' : String(key || '').toLowerCase().trim();
  var out = [], seen = {};
  for (var i = 0; i < items.size(); i++) {
    var el = items.get(i);
    var a = el.select("a[href*='/novel/']").first() || el.select('a').first();
    var img = el.select('img').first();
    var title = (el.select('h3, h4, .title, .nv-title').first() ? el.select('h3, h4, .title, .nv-title').first().text().trim() : '') || (img ? img.attr('alt') : '') || (a ? a.text().trim() : '');
    var href = a ? a.attr('href') : '';
    var cover = img ? (img.attr('data-src') || img.attr('src')) : '';
    if (!title || !href) continue;
    if (!q || title.toLowerCase().indexOf(q) >= 0) {
      if (href.indexOf('http') !== 0) href = BASE_URL + (href.indexOf('/') === 0 ? '' : '/') + href;
      if (seen[href]) continue;
      seen[href] = 1;
      if (cover && cover.indexOf('//') === 0) cover = 'https:' + cover;
      out.push({ name: title, link: href, cover: cover || '' });
    }
  }
  return Response.success(out);
}
