load('config.js');
load('bili.js');

function execute(url) {
  var sid = BILI.id(url);
  if (!sid) return Response.error('Không tìm thấy mã phim');
  var j = BILI.get('/intl/gateway/web/v2/ogv/media/season_info', { season_id: sid });
  var sn = (j && j.data && j.data.season) || {};
  var genres = [];
  if (sn.styles) {
    for (var i = 0; i < sn.styles.length; i++) {
      if (sn.styles[i] && sn.styles[i].title) genres.push(sn.styles[i].title);
    }
  }
  return Response.success({
    name: sn.title || 'Bilibili Anime',
    cover: sn.vertical_cover || sn.horizontal_cover || sn.cover || '',
    author: sn.origin_name || (sn.actors && sn.actors[0] && sn.actors[0].name) || 'Bilibili',
    description: sn.description || '',
    detail: (sn.index_show || '') + (sn.view ? ' · ' + sn.view : ''),
    ongoing: (sn.index_show || '').indexOf('Trọn bộ') === -1,
    genres: genres,
    url: BASE_URL + '/vi/play/' + sid
  });
}
