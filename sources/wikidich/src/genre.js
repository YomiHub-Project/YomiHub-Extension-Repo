load('config.js');
load('lib_common.js');
load('lib_generic.js');
// WikiDich: /tim-kiem?tag=... yêu cầu đăng nhập; dùng các danh mục công khai trên trang chủ
function execute() {
  var allow = [
    ['Truyện nam', '/truyen-nam'],
    ['Nữ tần', '/nu-tan'],
    ['Đam mỹ', '/dam-my'],
    ['Chương mới', '/chuong-moi'],
    ['Bảng xếp hạng', '/bang-xep-hang'],
    ['Ngôn tình', '/ngon-tinh'],
    ['Bách hợp', '/bach-hop'],
    ['Đồng nhân', '/dong-nhan']
  ];
  var allowed = {};
  for (var i = 0; i < allow.length; i++) allowed[allow[i][1]] = allow[i][0];
  var out = [], seen = {};
  try {
    var doc = C.html(BASE_URL + '/');
    var els = doc.select('a[href]');
    for (var j = 0; j < els.size(); j++) {
      var a = els.get(j);
      var href = String(a.attr('href') || '').trim();
      var title = String(a.text() || '').replace(/\s+/g, ' ').trim();
      if (!href || !title) continue;
      var p = href.replace(/^https?:\/\/[^\/]+/i, '').split('?')[0].replace(/\/$/, '');
      if (!allowed[p] || seen[p]) continue;
      seen[p] = 1;
      out.push({ title: title, input: BASE_URL + p, script: 'search.js' });
    }
  } catch (e) {}
  if (!out.length) {
    for (var k = 0; k < allow.length; k++) {
      out.push({ title: allow[k][0], input: BASE_URL + allow[k][1], script: 'search.js' });
    }
  }
  return Response.success(out);
}
