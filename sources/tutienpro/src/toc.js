load('config.js');
load('lib_common.js');
function execute(url) {
  var s = ttSlug(url); if (!s) return Response.error('Liên kết truyện không hợp lệ: ' + url);
  var d = ttJson('/story/' + s.slug + '/');
  var idx = ttJson('/story/stories/' + d.id + '/chapters/index/');
  var arr = (idx && idx.chapters) || [], out = [];
  for (var i = 0; i < arr.length; i++) {
    var c = arr[i]; // [số, tên, thời gian]
    out.push({ name: String(c[1] || ('Chương ' + c[0])), url: BASE_URL + '/truyen/' + s.slug + '/chapter-' + c[0], host: BASE_URL });
  }
  return Response.success(out);
}
