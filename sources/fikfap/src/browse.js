load('config.js');
load('lib_common.js');

function execute(url, page) {
  var sort = url || 'trending';
  var endpoint = API_URL + '/posts?sort=' + sort + '&amount=12';
  if (page && page !== 1 && typeof page === 'string' && page.length > 5) {
    endpoint += '&afterId=' + encodeURIComponent(page);
  }
  var res = C.get(endpoint, { headers: API_HEADERS });
  if (!res || !res.ok) {
    return Response.error('FikFap API error: ' + (res ? res.status : 'no response'));
  }
  var data = [];
  try {
    data = JSON.parse(res.text());
  } catch (e) {
    return Response.error('FikFap parse error: ' + e.message);
  }
  var items = [];
  (data || []).forEach(function(item) {
    var id = item.postId || item.id || item._id;
    if (!id) return;
    var name = item.label || item.description || ('FikFap #' + id);
    name = name.replace(/#[a-zA-Z0-9_]+/g, '').trim() || ('FikFap #' + id);
    var cover = item.thumbnailUrl || (item.preview ? item.preview.url : '') || '';
    items.push({
      name: name,
      link: BASE_URL + '/post/' + id,
      cover: cover,
      description: item.description || '',
      host: BASE_URL
    });
  });
  var lastId = data && data.length ? (data[data.length - 1].postId || data[data.length - 1].id) : null;
  return Response.success(items, lastId ? String(lastId) : null);
}
