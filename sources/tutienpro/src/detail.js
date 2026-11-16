load('config.js');
load('lib_common.js');
function execute(url) {
  var s = ttSlug(url); if (!s) return Response.error('Liên kết truyện không hợp lệ: ' + url);
  var d = ttJson('/story/' + s.slug + '/');
  var genres = (d.genres || []).map(function (g) { return { title: g.name, input: '/story/list/' + g.slug + '/?page_size=24', script: 'browse.js' }; });
  var au = d.author && typeof d.author === 'object' ? d.author.name : d.author;
  return Response.success({
    name: d.title, cover: C.fix(d.cover_image || ''), author: au || '',
    description: ttEsc(d.description).replace(/\r?\n/g, '<br>'),
    detail: 'Số chương: ' + (d.total_chapters || 0) + '<br>Tình trạng: ' + (d.is_completed ? 'Hoàn thành' : 'Đang ra'),
    ongoing: !d.is_completed, genres: genres, host: BASE_URL
  });
}
