load('config.js');

function execute(key, page) {
  var q = String(key || '').trim();
  if (!q) return Response.success([]);

  var p = parseInt(page || '1', 10);
  if (isNaN(p) || p < 1) p = 1;

  var url = BASE_URL + '/tim-kiem?keywords=' + encodeURIComponent(q) + '&page=' + p;
  var doc = hakoFetchDoc(url);

  var novelList = [];
  var cards = doc.select('.sect-body .thumb-item-flow, .thumb-item-flow');
  var seen = {};

  for (var i = 0; i < cards.size(); i++) {
    var e = cards.get(i);
    var a = e.select('.series-title a').first();
    if (!a) continue;
    var name = (a.attr('title') || a.text() || '').replace(/\s+/g, ' ').trim();
    var link = hakoFixUrl(a.attr('href'));
    if (!name || !link || seen[link]) continue;
    seen[link] = true;
    var cover = hakoExtractBg(e.select('.img-in-ratio').first());
    var desc = (e.select('.chapter-title').text() || '').replace(/\s+/g, ' ').trim();
    novelList.push({
      name: name,
      link: link,
      description: desc,
      cover: cover,
      host: BASE_URL
    });
  }

  var nextEl = doc.select('.pagination-footer a.current + a, .pagination_wrap a.current + a').first();
  var next = nextEl ? (nextEl.text() || '').trim() : '';
  if (!next) {
    var nextBtn = doc.select('a.paging_item.next:not(.disabled), a.paging_prevnext.next:not(.disabled)').first();
    if (nextBtn && novelList.length > 0) next = String(p + 1);
  }

  return Response.success(novelList, next || null);
}
