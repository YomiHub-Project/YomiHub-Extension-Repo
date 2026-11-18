load('config.js');
load('lib_common.js');

function execute(input, page) {
  var p = C.page(page);
  var endpoint = '/home-page/latest-episode-posts';
  if (input === 'most-popular') endpoint = '/home-page/most-popular';
  else if (input === 'top-airing') endpoint = '/home-page/top-airing';

  var data = requestApiJson(endpoint);
  var list = data.data || data.posts || data || [];
  var items = [];
  var pageSize = 20;
  var start = (p - 1) * pageSize;
  var end = Math.min(list.length, start + pageSize);

  for (var i = start; i < end; i++) {
    var it = list[i];
    if (!it) continue;
    var meta = {
      id: it.id,
      title: it.title,
      desc: it.description || '',
      cover: it.image || '',
      ep: it.current_episode || it.episodes || '1',
      genres: it.genres || []
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

  return Response.success(items, C.next(end < list.length, p));
}
