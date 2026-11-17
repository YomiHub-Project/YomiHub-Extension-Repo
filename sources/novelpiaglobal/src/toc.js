load('config.js');
load('lib_common.js');

function execute(url) {
  var m = String(url || '').match(/\/novel\/(\d+)/);
  if (!m) return Response.error('Không tìm thấy mã truyện');
  var novel_no = m[1];

  var out = [];
  var page = 1;
  while (page <= 5) {
    var res = fetch(API_URL + '/v1/novel/episode/list?novel_no=' + novel_no + '&page=' + page, {
      headers: {
        'Accept': 'application/json',
        'Referer': BASE_URL + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) break;
    var j = res.json();
    if (!j || !j.result || !j.result.list || !j.result.list.length) break;
    var list = j.result.list;
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      out.push({
        name: item.epi_title || ('Chương ' + item.epi_num),
        url: BASE_URL + '/viewer/' + item.episode_no + '?novel_no=' + novel_no,
        host: BASE_URL
      });
    }
    if (list.length < 20) break;
    page++;
  }

  return Response.success(out);
}
