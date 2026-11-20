load('config.js');
load('lib_common.js');

function execute(url, page) {
  var sort = url || 'trending';
  var endpoint = API_BASE + '/posts?sort=' + encodeURIComponent(sort) + '&amount=12';
  if (page && page !== 1 && typeof page === 'string' && page.length > 5) {
    endpoint += '&afterId=' + encodeURIComponent(page);
  }
  var res = C.get(endpoint, { headers: API_HEADERS });
  if (!res || !res.ok) {
    return Response.error('FikFap API lỗi: HTTP ' + (res ? res.status : 0) + ' (' + API_BASE + '). Nếu nhà mạng chặn, hãy bật DNS-over-HTTPS hoặc VPN.');
  }
  var data = [];
  try {
    var parsed = JSON.parse(res.text());
    data = Array.isArray(parsed) ? parsed : (parsed.posts || parsed.data || []);
  } catch (e) {
    return Response.error('FikFap lỗi phân tích JSON: ' + e.message);
  }
  var items = [];
  for (var i = 0; i < data.length; i++) {
    var item = data[i];
    if (!item) continue;
    var id = item.postId || item.id || item._id;
    if (!id) continue;
    items.push({
      name: ffPickName(item, id),
      link: BASE_URL + '/post/' + id,
      cover: ffPickCover(item),
      description: item.description || (item.author && item.author.username ? '@' + item.author.username : '') || '',
      host: BASE_URL
    });
  }
  var lastId = data && data.length ? (data[data.length - 1].postId || data[data.length - 1].id) : null;
  return Response.success(items, lastId ? String(lastId) : null);
}
