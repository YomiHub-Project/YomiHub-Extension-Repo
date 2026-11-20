load('config.js');
load('lib_common.js');
load('lib_generic.js');

function pmBase64Ascii(str) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var out = '';
  for (var i = 0; i < str.length; i += 3) {
    var a = str.charCodeAt(i), b = str.charCodeAt(i + 1), c = str.charCodeAt(i + 2);
    var n = (a << 16) | ((b || 0) << 8) | (c || 0);
    out += chars.charAt((n >> 18) & 63) + chars.charAt((n >> 12) & 63)
      + (i + 1 < str.length ? chars.charAt((n >> 6) & 63) : '=')
      + (i + 2 < str.length ? chars.charAt(n & 63) : '=');
  }
  return out;
}

function pmStreamcBootstrap(embedUrl) {
  var originMatch = /^(https?:\/\/[^\/]+)/i.exec(embedUrl);
  var embedOrigin = originMatch ? originMatch[1] : embedUrl;
  var r = fetch(embedUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': PM_UA,
      'Origin': embedOrigin,
      'Referer': embedUrl
    },
    body: JSON.stringify({
      action: 'bootstrap',
      referrer: BASE_URL + '/',
      frame_origins: [BASE_URL],
      request_grant: true,
      playlist_format: 'hls',
      pretty_url: true,
      path_chunks: true,
      bootstrap_format: 'json'
    })
  });
  if (!r || !r.ok) return null;
  var json = null;
  try { json = JSON.parse(r.text()); } catch (e) { return null; }
  var playlist = json && json.preissued && json.preissued.playlist;
  if (!playlist) return null;

  var plRes = fetch(playlist, {
    headers: {
      'User-Agent': PM_UA,
      'Referer': embedOrigin + '/'
    }
  });
  if (plRes && plRes.ok) {
    var m3u8 = plRes.text() || '';
    if (m3u8.indexOf('#EXTM3U') === 0) {
      playlist = 'data:application/x-mpegURL;base64,' + pmBase64Ascii(m3u8);
    }
  }

  return {
    type: 'native',
    data: playlist,
    host: embedOrigin,
    mimeType: 'application/x-mpegURL',
    http2: true,
    headers: {
      'User-Agent': PM_UA,
      'Referer': embedOrigin + '/'
    }
  };
}

function execute(url) {
  var target = String(url || '').trim();

  // 1. Direct stream URL (never treat theme placeholder 1s_blank.mp4 as playable stream)
  if ((/\.m3u8(\?|$)/i.test(target) || /\.mp4(\?|$)/i.test(target)) && !/1s_blank\.mp4/i.test(target)) {
    return Response.success({
      type: 'native',
      data: target,
      headers: { 'Referer': BASE_URL + '/', 'User-Agent': PM_UA }
    });
  }

  // 2. streamc.xyz embed (NguonC player used by Phimmoi)
  if (/streamc\.xyz\/embed\.php/i.test(target)) {
    var sc = pmStreamcBootstrap(target);
    if (sc) return Response.success(sc);
  }

  // 3. Embedded player URL carrying ?url=*.m3u8
  var mInner = /[?&](?:url|link|src|file)=([^&]+\.(?:m3u8|mp4)[^&]*)/i.exec(target);
  if (mInner) {
    var inner = decodeURIComponent(mInner[1]);
    if (!/1s_blank\.mp4/i.test(inner)) {
      return Response.success({
        type: 'native',
        data: inner,
        headers: { 'Referer': BASE_URL + '/', 'User-Agent': PM_UA }
      });
    }
  }

  // 4. Fallback: if given a Phimmoi watch page URL directly
  if (/\/xem-phim\//i.test(target) || target.indexOf(BASE_URL) === 0) {
    var res = fetchWithDomainFallback(target);
    var html = res.text();
    var doc = res.html();

    var btns = doc.select('a.btn3dsv[data-link]');
    for (var i = 0; i < btns.size(); i++) {
      var link = (btns.get(i).attr('data-link') || '').trim();
      if (!link || /1s_blank\.mp4/i.test(link)) continue;
      if (/\.m3u8(\?|$)/i.test(link) || /\.mp4(\?|$)/i.test(link)) {
        return Response.success({
          type: 'native',
          data: C.fix(link),
          headers: { 'Referer': BASE_URL + '/', 'User-Agent': PM_UA }
        });
      }
      if (/streamc\.xyz\/embed\.php/i.test(link)) {
        var sc2 = pmStreamcBootstrap(C.fix(link));
        if (sc2) return Response.success(sc2);
      }
    }

    var cleanHtml = html.replace(/https?:[^"'\s<>\\]*1s_blank\.mp4[^"'\s<>\\]*/gi, '');
    var m = cleanHtml.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || cleanHtml.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
    if (m) {
      return Response.success({
        type: 'native',
        data: m[0],
        headers: { 'Referer': BASE_URL + '/', 'User-Agent': PM_UA }
      });
    }
  }

  return Response.error('Phimmoi: không trích xuất được luồng phát trực tiếp từ máy chủ.');
}
