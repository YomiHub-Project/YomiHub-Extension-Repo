load('config.js');
load('lib_common.js');

function execute(key, page) {
  if (!key) return Response.success([]);
  var q = encodeURIComponent(key.trim());
  var endpoint = API_URL + '/search/posts?q=' + q;
  var res = C.get(endpoint, { headers: API_HEADERS });
  if (!res || !res.ok) {
    return Response.success([]);
  }
  var list = [];
  try {
    var json = JSON.parse(res.text());
    list = json.posts || json || [];
  } catch (e) {
    return Response.success([]);
  }
  var items = [];
  list.forEach(function(item) {
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
  return Response.success(items);
}
