load('config.js');
load('lib_common.js');
// Episodes come from the site's own JSON endpoint, keyed by the numeric film id found in the film page.
// Episode URL = https://api.hihiphim.com/embed/<episode id>: the id never changes, so "resume" keeps working.
function execute(url) {
  var page = url.replace(/\/xem-phim\//, '/phim/');
  var body = C.check(C.get(page), page).text() || '';
  var m = /movie\\":\{\\"id\\":(\d+)/.exec(body) || /movieId\\":(\d+)/.exec(body);
  if (!m) return Response.error('Không tìm thấy mã phim trên trang ' + page);
  var eps = C.json(BASE_URL + '/baseapi/api/v1/episodes/by-idMovie/' + m[1]);
  if (!eps || !eps.length) return Response.error('Phim chưa có tập nào');
  var groups = {}, order = [];
  eps.forEach(function (e) { var s = e.server || 'Server'; if (!groups[s]) { groups[s] = []; order.push(s); } groups[s].push(e); });
  var num = function (e) { var x = /\d+(\.\d+)?/.exec(String(e.name)); return (e.season_number || 1) * 100000 + (x ? parseFloat(x[0]) : 0); };
  var out = [];
  order.forEach(function (s) {
    if (order.length > 1) out.push({ name: s, type: 'section' });
    groups[s].sort(function (a, b) { return num(a) - num(b); }).forEach(function (e) {
      var n = String(e.name || '');
      out.push({ name: (/^\d+(\.\d+)?$/.test(n) ? 'Tập ' + n : n || 'Xem phim') + (order.length > 1 ? ' · ' + s : ''), url: 'https://api.hihiphim.com/embed/' + e.id, host: BASE_URL });
    });
  });
  return Response.success(out);
}
