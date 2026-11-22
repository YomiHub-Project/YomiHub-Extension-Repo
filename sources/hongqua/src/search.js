load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(key, page) {
  page = page || 1;
  var url = BASE_URL + '/api/search/result?query=' + encodeURIComponent(key) + (page > 1 ? '&page=' + page : '');
  try {
    var r = fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': BASE_URL + '/'
      }
    });
    if (r.status !== 200) return Response.error('HTTP ' + r.status);
    var d = JSON.parse(r.text());
    var list = d.searchList || [];
    var items = [];
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var vd = item.video_data || {};
      var title = item.name || vd.series_title;
      var sid = vd.series_id || item.keyword;
      if (title && sid) {
        items.push({
          name: title,
          link: BASE_URL + '/detail?series_id=' + sid,
          cover: vd.series_cover || '',
          description: vd.episode_right_text || (vd.episode_cnt ? '全' + vd.episode_cnt + '集' : ''),
          tag: ''
        });
      }
    }
    return Response.success(items, d.hasMore ? String(page + 1) : null);
  } catch (e) {
    return Response.error(String(e));
  }
}
