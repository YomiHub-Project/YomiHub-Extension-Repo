load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  // 1. Direct stream URL
  if (/\.m3u8/i.test(url) || /\.mp4/i.test(url)) {
    return Response.success({
      type: 'native',
      data: url,
      headers: { Referer: BASE_URL + '/' }
    });
  }

  // 2. Embedded player URL with stream parameter
  var mParam = /[?&]url=([^&#]+)/i.exec(url);
  if (mParam) {
    var rawUrl = decodeURIComponent(mParam[1]);
    if (/\.m3u8|\.mp4/i.test(rawUrl)) {
      return Response.success({
        type: 'native',
        data: rawUrl,
        headers: { Referer: BASE_URL + '/' }
      });
    }
  }

  // 3. Web page containing player
  var res = fetchWithDomainFallback(url);
  var html = res.text();
  var doc = res.html();

  var m = html.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || html.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
  if (m) {
    return Response.success({
      type: 'native',
      data: m[0],
      headers: { Referer: BASE_URL + '/' }
    });
  }

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
