load('config.js');
load('lib_common.js');
function execute() {
  var doc = C.html('https://yomou.syosetu.com/search.php', G.req);
  var els = doc.select("a[href*='search.php?genre=']");
  var out = [], seen = {};
  for (var i = 0; i < els.size(); i++) {
    var a = els.get(i);
    var href = String(a.attr('href') || '').trim();
    var title = String(a.text() || '').replace(/\s+/g, ' ').trim();
    if (!href || !title) continue;
    var u = href.indexOf('http') === 0 ? href : ('https://yomou.syosetu.com' + (href.charAt(0) === '/' ? '' : '/') + href);
    if (seen[u]) continue;
    seen[u] = 1;
    out.push({ title: title, input: u, script: 'search.js' });
  }
  return Response.success(out);
}
