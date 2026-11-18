load('config.js');
load('lib_common.js');

function execute(key, page) {
  var p = C.page(page);
  var q = String(key || '').trim();
  if (!q) return Response.success([]);

  var data = requestApiJson('/search/full/?keyword=' + encodeURIComponent(q) + '&page=' + p);
  var results = (data.data && data.data.results) ? data.data.results : (data.results || data.data || []);
  var items = [];

  for (var i = 0; i < results.length; i++) {
    var it = results[i];
    if (!it) continue;
    var meta = {
      id: it.id || it.legacy_id,
      title: it.title,
      desc: it.description || '',
      cover: it.image || '',
      ep: it.current_episode || it.episodes || '1',
      genres: (it.genres || []).map(function(g) { return typeof g === 'string' ? g : (g.name || ''); })
    };
    var hashMeta = encodeURIComponent(JSON.stringify(meta));
    var link = it.link ? (BASE_URL + it.link) : (BASE_URL + '/phim/' + (it.slug || it.id) + '/m' + it.id + '.html');
    link += '#meta=' + hashMeta;

    items.push({
      name: it.title,
      link: link,
      cover: it.image || '',
      description: it.current_episode ? ('Tập ' + it.current_episode) : '',
      host: BASE_URL
    });
  }

  var hasNext = (data.data && data.data.current_page < data.data.total_pages) ? true : false;
  return Response.success(items, C.next(hasNext, p));
}
