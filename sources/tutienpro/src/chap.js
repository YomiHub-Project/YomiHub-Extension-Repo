load('config.js');
load('lib_common.js');
function execute(url) {
  var s = ttSlug(url); if (!s || !s.chap) return Response.error('Liên kết chương không hợp lệ: ' + url);
  var r = C.get(BASE_URL + '/story/' + s.slug + '/chapter-' + s.chap + '/', { headers: { 'Accept': 'application/json' } });
  if (r.status === 401 || r.status === 402 || r.status === 403) return Response.error('Chương này bị khoá trên tutien.pro (cần đăng nhập / mở khoá bằng vé).');
  C.check(r, url);
  var d = r.json() || {};
  var c = d.content || d.body || d.text || (d.chapter && d.chapter.content) || '';
  if (!c) return Response.error(d.detail || d.message || 'Chương không có nội dung (có thể bị khoá).');
  c = String(c);
  if (!/<p[\s>]|<br\s*\/?>/i.test(c)) c = c.split(/\r?\n+/).map(function (l) { l = l.trim(); return l ? '<p>' + ttEsc(l) + '</p>' : ''; }).join('');
  return Response.success(c, d.title || '');
}
