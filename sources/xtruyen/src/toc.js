load('config.js');
load('lib_common.js');
load('lib_madara.js');
function execute(url) {
  var doc = C.html(url), base = url.replace(/[?#].*$/, '').replace(/\/+$/, '') + '/';
  var groups = doc.select('.listing-chapters_wrap ul.main > li.has-child');
  var list = [], seen = {};
  var add = function (name, href) { if (href && !seen[href]) { seen[href] = 1; list.push({ name: name, url: href, host: BASE_URL }); } };
  if (!groups.size()) {
    var els = M.chapterEls(doc, url);
    for (var i = els.size() - 1; i >= 0; i--) add(els.get(i).text().trim(), els.get(i).attr('href'));
    return Response.success(list);
  }
  for (var g = 0; g < groups.size(); g++) {
    var li = groups.get(g), as = li.select('li.wp-manga-chapter a');
    if (as.size()) { for (var j = 0; j < as.size(); j++) add(as.get(j).text().trim(), as.get(j).attr('href')); continue; }
    // nhóm chưa nạp (trang tải bằng AJAX khi bấm): đường dẫn chương luôn là .../chuong-N/ nên dựng theo khoảng "A-to-B"
    var m = /^(\d+)-to-(\d+)/.exec(li.attr('data-value') || '');
    if (!m) continue;
    for (var n = parseInt(m[1], 10), end = parseInt(m[2], 10); n <= end && end - n < 2000; n++) add('Chương ' + n, base + 'chuong-' + n + '/');
  }
  return Response.success(list);
}
