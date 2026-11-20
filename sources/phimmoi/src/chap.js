load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var doc = res.html();
  var servers = [];
  var seen = {};

  var btns = doc.select('a.btn3dsv[data-link]');
  for (var i = 0; i < btns.size(); i++) {
    var btn = btns.get(i);
    var link = (btn.attr('data-link') || '').trim();
    if (!link || /1s_blank\.mp4/i.test(link) || seen[link]) continue;
    seen[link] = true;
    var title = (btn.text() || '').replace(/\s+/g, ' ').trim() || ('Server ' + (servers.length + 1));
    servers.push({ title: title, data: C.fix(link) });
  }

  if (!servers.length) {
    var ifr = doc.select('iframe[src], iframe[data-src]').first();
    if (ifr) {
      var src = (ifr.attr('src') || ifr.attr('data-src') || '').trim();
      if (src && !/about:blank/i.test(src)) {
        servers.push({ title: 'Server Embed', data: C.fix(src) });
      }
    }
  }

  if (!servers.length) {
    servers.push({ title: 'Server Phimmoi', data: url });
  }

  return Response.success(servers);
}
