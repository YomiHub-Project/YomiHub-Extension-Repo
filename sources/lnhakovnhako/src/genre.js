load('config.js');

function execute(url, page) {
  var doc = hakoFetchDoc(BASE_URL + '/danh-sach');
  var data = [];
  var seen = {};
  var links = doc.select('ul.filter-type li.filter-type_item a, a[href*="/the-loai/"]');
  for (var i = 0; i < links.size(); i++) {
    var a = links.get(i);
    var title = (a.text() || '').replace(/\s+/g, ' ').trim();
    var href = hakoFixUrl(a.attr('href'));
    if (!title || !href || href.indexOf('/the-loai/') === -1 || seen[href]) continue;
    seen[href] = true;
    data.push({
      title: title,
      input: href,
      script: 'gen.js'
    });
  }
  return Response.success(data);
}
