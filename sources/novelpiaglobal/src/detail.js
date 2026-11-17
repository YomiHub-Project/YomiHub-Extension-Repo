load('config.js');
load('lib_common.js');

function execute(url) {
  var m = String(url || '').match(/\/novel\/(\d+)/);
  if (!m) return Response.error('Không tìm thấy mã truyện');
  var novel_no = m[1];

  var res = fetch(API_URL + '/v1/novel?novel_no=' + novel_no, {
    headers: {
      'Accept': 'application/json',
      'Referer': BASE_URL + '/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!res.ok) return Response.error('API HTTP ' + res.status);
  var j = res.json();
  if (!j || !j.result || !j.result.novel) return Response.error('Không tải được thông tin truyện');

  var novel = j.result.novel;
  var writer = (j.result.writer_list && j.result.writer_list[0] && j.result.writer_list[0].writer_name) || '';
  var genres = (j.result.tag_list || []).map(function(t) { return t.tag_name; });
  var cover = novel.novel_img || '';
  if (cover.indexOf('//') === 0) cover = 'https:' + cover;

  return Response.success({
    name: novel.novel_name || 'Novelpia',
    cover: cover,
    author: writer,
    description: novel.novel_story || '',
    detail: 'Lượt xem: ' + (novel.count_view || 0) + ' | Thích: ' + (novel.count_good || 0),
    ongoing: novel.flag_complete === 0,
    genres: genres,
    url: BASE_URL + '/novel/' + novel_no
  });
}
