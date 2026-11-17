load('config.js');
load('tw.js');
// 0.0.7: Parse usher master playlist into variant streams with real HTTPS URLs so players
// (especially media_kit in Mangayomi/YomiHub, ExoPlayer in Aniyomi) can play directly and select quality,
// avoiding data: URIs which cause media_kit to hang forever.
function execute(data) {
  var url = String(data || ''), h = { 'User-Agent': TW.UA, 'Referer': BASE_URL + '/', 'Origin': BASE_URL };
  var rawPlaylist = '';
  for (var i = 0; i < 3; i++) {
    var r = fetch(url, { headers: h });
    if (r.ok) {
      var t = r.text();
      if (t.indexOf('#EXTM3U') === 0) { rawPlaylist = t; break; }
    }
    if (r.status === 403 || r.status === 404) {
      return Response.error(r.status === 404 ? 'Kênh đang ngoại tuyến hoặc video đã bị xoá' : 'Twitch từ chối phát video này (giới hạn vùng hoặc chỉ dành cho người đăng ký)');
    }
  }

  if (rawPlaylist) {
    var lines = rawPlaylist.split('\n'), tracks = [], curQ = '';
    for (var j = 0; j < lines.length; j++) {
      var l = lines[j].trim();
      if (l.indexOf('#EXT-X-MEDIA:') === 0) {
        var mName = /NAME="([^"]+)"/.exec(l);
        if (mName) curQ = mName[1];
      } else if (l.indexOf('#EXT-X-STREAM-INF:') === 0) {
        var mRes = /RESOLUTION=(\d+x\d+)/.exec(l);
        var q = curQ || (mRes ? mRes[1] : 'Auto');
        curQ = '';
        var next = (lines[j + 1] || '').trim();
        if (next && next.indexOf('http') === 0) {
          tracks.push({ type: 'native', data: next, quality: q, host: BASE_URL, mimeType: 'application/x-mpegURL', headers: h });
        }
      }
    }
    if (tracks.length > 0) return Response.success(tracks);
  }

  return Response.success({ type: 'native', data: url, quality: 'Auto', host: BASE_URL, mimeType: 'application/x-mpegURL', headers: h });
}
