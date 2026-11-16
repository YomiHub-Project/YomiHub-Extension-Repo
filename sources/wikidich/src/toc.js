load('crypto.js');
load('config.js');
load('lib_common.js');
load('lib_generic.js');
// Mục lục WikiDich nạp qua /book/index, cần chữ ký: sign = SHA256(fuzzySign(signKey + start + size)).
function execute(url) {
  var r = C.check(C.get(url), url), body = r.text() || '';
  var bid = /var\s+bookId\s*=\s*"([^"]+)"/.exec(body), sk = /var\s+signKey\s*=\s*"([^"]+)"/.exec(body);
  if (!bid || !sk) return Response.error('Không tìm thấy bookId/signKey trên trang ' + url);
  var fz = /text\.substring\((\d+)\)\s*\+\s*text\.substring\(0,\s*(\d+)\)/.exec(body), cut = fz ? parseInt(fz[1], 10) : 95;
  var lb = /loadBookIndex\((\d+),\s*(\d+)/.exec(body), size = lb ? parseInt(lb[2], 10) : 99;
  var sign = function (start, sz) { var t = sk[1] + start + sz; return CryptoJS.SHA256(t.substring(cut) + t.substring(0, cut)).toString(); };
  var list = [], seen = {}, todo = [[lb ? parseInt(lb[1], 10) : 0, size]], done = {};
  for (var guard = 0; guard < 80 && todo.length; guard++) {
    var cur = todo.shift(); if (done[cur[0]]) continue; done[cur[0]] = 1;
    var u = BASE_URL + '/book/index?bookId=' + bid[1] + '&start=' + cur[0] + '&size=' + cur[1] + '&signKey=' + sk[1] + '&sign=' + sign(cur[0], cur[1]);
    var rr = C.get(u, { headers: { 'X-Requested-With': 'XMLHttpRequest', 'Referer': url } });
    if (!rr || !rr.ok) { if (!list.length) return Response.error('Không tải được mục lục (HTTP ' + (rr ? rr.status : 0) + ')'); break; }
    var doc = rr.html();
    var els = doc.select('li.chapter-name a, .chapter-name a');
    for (var i = 0; i < els.size(); i++) {
      var a = els.get(i), h = a.attr('href');
      if (!h || h.charAt(0) === '#' || seen[h]) continue;
      seen[h] = 1; list.push({ name: a.text(), url: C.fix(h), host: BASE_URL });
    }
    var pg = doc.select('[data-action=loadBookIndex], a[data-start]');
    for (var j = 0; j < pg.size(); j++) {
      var st = parseInt(pg.get(j).attr('data-start'), 10), sz = parseInt(pg.get(j).attr('data-size') || String(cur[1]), 10);
      if (!isNaN(st) && !done[st]) todo.push([st, sz]);
    }
  }
  return Response.success(list);
}
