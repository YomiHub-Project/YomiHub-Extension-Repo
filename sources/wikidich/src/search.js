load('config.js');
load('lib_common.js');
load('lib_generic.js');
// Tìm kiếm của WikiDich (/tim-kiem?q=) chỉ mở cho tài khoản đã đăng nhập. Chưa đăng nhập (trang trả "Đăng nhập để xem nội dung")
// thì lọc theo tên trong danh sách "Mới cập nhật" + "Truyện hot" để vẫn tìm được truyện đang nổi.
function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
function execute(key, page) {
  if (C.isUrl(key)) return X.search(key, page);
  var n = C.page(page);
  var doc = C.html(BASE_URL + '/tim-kiem?q=' + C.enc(key) + '&qs=1' + (n > 1 ? '&start=' + ((n - 1) * 20) : ''));
  var items = X.items(doc, 's_');
  if (items.length) return Response.success(items, C.next(items.length >= 20, page));
  if (n > 1) return Response.success([], '');
  var k = norm(key), out = [], seen = {}, pages = ['/', '/bang-xep-hang'];
  for (var i = 0; i < pages.length; i++) {
    var d; try { d = C.html(BASE_URL + pages[i]); } catch (e) { continue; }
    var l = X.items(d, '');
    for (var j = 0; j < l.length; j++) if (!seen[l[j].link] && norm(l[j].name).indexOf(k) >= 0) { seen[l[j].link] = 1; out.push(l[j]); }
    if (out.length) break;
  }
  return Response.success(out, '');
}
