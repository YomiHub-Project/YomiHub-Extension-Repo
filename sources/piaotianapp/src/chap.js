load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(url) {
  var visited = [], cur = url, paras = [], title = '';
  for (var page = 0; page < 15 && cur; page++) {
    if (visited.indexOf(cur) >= 0) break;
    visited.push(cur);
    var doc = C.html(cur, G.req);
    if (!title) title = X.pick(doc, 'h1 || title');
    var els = doc.select('#content p.reader-text');
    for (var i = 0; i < els.size(); i++) {
      var p = els.get(i), txt = String(p.text() || '').trim();
      if (!txt) continue;
      if ((p.attr('class') || '').indexOf('js-reversed-text') >= 0) {
        txt = txt.split('').reverse().join('');
      }
      paras.push('<p>' + txt.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p>');
    }
    var nx = doc.select('#content a[rel=next], .m-tpage a[rel=next]').first();
    var nh = nx ? nx.attr('href') : '';
    if (!nh || nh.indexOf('/ptchapter/') < 0) break;
    cur = C.fix(nh);
  }
  if (!paras.length) return X.text(url);
  return Response.success(paras.join(''), title);
}
