load('config.js');
load('lib_common.js');

function execute(key, page) {
  var rawKey = String(key || '').trim();
  if (!rawKey) return Response.success([]);
  var cleanKey = rawKey.replace(/^#/, '');
  var endpoint = rawKey.charAt(0) === '#'
    ? API_BASE + '/hashtags/label/' + encodeURIComponent(cleanKey) + '/posts?amount=12'
    : API_BASE + '/search/posts?q=' + encodeURIComponent(cleanKey);

  var res = C.get(endpoint, { headers: API_HEADERS });
  if ((!res || !res.ok) && rawKey.charAt(0) === '#') {
    res = C.get(API_BASE + '/search/posts?q=' + encodeURIComponent(cleanKey), { headers: API_HEADERS });
  }
  if (!res || !res.ok) {
    return Response.success([]);
  }
  var list = [];
  try {
    var json = JSON.parse(res.text());
    list = Array.isArray(json) ? json : (json.posts || json.data || []);
  } catch (e) {
    return Response.success([]);
  }
  var items = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
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
  return Response.success(items);
}
