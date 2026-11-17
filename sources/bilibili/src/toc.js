load('config.js');
load('bili.js');

function execute(url) {
  var sid = BILI.id(url);
  if (!sid) return Response.error('Không tìm thấy mã phim');
  var j = BILI.get('/intl/gateway/web/v2/ogv/play/episodes', { season_id: sid });
  var list = [];
  var sections = (j && j.data && (j.data.sections || [{ episodes: j.data.episodes }])) || [];
  for (var i = 0; i < sections.length; i++) {
    var eps = sections[i] && sections[i].episodes;
    if (eps) {
      for (var k = 0; k < eps.length; k++) {
        var ep = eps[k];
        if (!ep || !ep.episode_id) continue;
        var name = ep.title_display || (ep.short_title_display + ' ' + (ep.long_title_display || '')).trim();
        list.push({
          name: name || ('Tập ' + (k + 1)),
          url: BASE_URL + '/vi/play/' + sid + '/' + ep.episode_id,
          pay: ep.limit !== 1
        });
      }
    }
  }
  return Response.success(list);
}
