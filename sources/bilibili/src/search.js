load('config.js');
load('bili.js');

function execute(key, page) {
  var p = parseInt(page, 10) || 1;
  var j = BILI.get('/intl/gateway/web/v2/search_v2', {
    keyword: key,
    pn: p,
    ps: 20
  });
  var items = [];
  var modules = (j && j.data && j.data.modules) || [];
  for (var i = 0; i < modules.length; i++) {
    var m = modules[i];
    var list = (m && m.items) || [];
    for (var k = 0; k < list.length; k++) {
      var it = list[k];
      if (!it) continue;
      if (it.seasons && it.seasons.length) {
        for (var s = 0; s < it.seasons.length; s++) {
          var sn = it.seasons[s];
          if (!sn || !sn.season_id) continue;
          items.push({
            name: sn.title || it.title || 'Anime',
            link: BASE_URL + '/vi/play/' + sn.season_id,
            cover: sn.cover || it.cover || '',
            description: (sn.index_show ? sn.index_show + ' · ' : '') + (sn.view || ''),
            host: BASE_URL
          });
        }
      } else if (it.season_id) {
        items.push({
          name: it.title || 'Anime',
          link: BASE_URL + '/vi/play/' + it.season_id,
          cover: it.cover || '',
          description: (it.index_show ? it.index_show + ' · ' : '') + (it.view || ''),
          host: BASE_URL
        });
      } else if (it.aid) {
        items.push({
          name: it.title || 'Video',
          link: BASE_URL + '/vi/play/' + it.aid,
          cover: it.cover || '',
          description: (it.duration ? it.duration + ' · ' : '') + (it.view || ''),
          host: BASE_URL
        });
      }
    }
  }
  return Response.success(items, j && j.data && j.data.has_next ? String(p + 1) : '');
}
