load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var html = res.text();
  var doc = res.html();

  // 1. Look for m3u8 direct button
  var m3u8Btn = doc.select('a.btn3dsv[data-type="m3u8"], a[data-link*=".m3u8"]').first();
  if (m3u8Btn) {
    var link = m3u8Btn.attr('data-link');
    if (link) {
      return Response.success({
        type: 'native',
        data: C.fix(link),
        headers: { Referer: BASE_URL + '/' }
      });
    }
  }

  // 2. Sniff any m3u8 / mp4 in page
  var m = html.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || html.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
  if (m) {
    return Response.success({
      type: 'native',
      data: m[0],
      headers: { Referer: BASE_URL + '/' }
    });
  }

  // 3. Look for embed player
  var embedBtn = doc.select('a.btn3dsv[data-type="embed"], a[data-link*="player"]').first();
  if (embedBtn) {
    var eLink = embedBtn.attr('data-link');
    if (eLink) {
      return Response.success({
        type: 'webview',
        data: C.fix(eLink)
      });
    }
  }

  // 4. Look for iframe
  var ifr = doc.select('iframe[src], iframe[data-src]').first();
  if (ifr) {
    var src = ifr.attr('src') || ifr.attr('data-src');
    if (src) {
      return Response.success({
        type: 'webview',
        data: C.fix(src)
      });
    }
  }

  return Response.success({
    type: 'webview',
    data: url
  });
}
