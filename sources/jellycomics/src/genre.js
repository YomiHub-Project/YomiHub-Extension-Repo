load('config.js');
load('lib_common.js');
load('lib_madara.js');
function execute() {
  var doc = C.html(BASE_URL + '/');
  var out = [], seen = {};
  doc.select("a[href*='/the-loai/']").forEach(function (a) {
    var title = String(a.text() || '').trim();
    var href = C.fix(a.attr('href'));
    if (!title || !href || seen[href] || title.length > 35 || /^thể loại$/i.test(title)) return;
    seen[href] = 1;
    out.push({ title: title, input: href, script: 'search.js' });
  });
  return Response.success(out);
}
