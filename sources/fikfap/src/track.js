load('config.js');
load('lib_common.js');

function execute(data) {
  var stream = null;
  if (/\.(m3u8|mp4)(\?|$)/i.test(data)) {
    stream = data;
  } else {
    var idMatch = String(data || '').match(/post\/([a-zA-Z0-9_-]+)/i);
    var id = idMatch ? idMatch[1] : String(data || '').trim();

    // 1. Try API
    var apiUrl = API_BASE + '/posts/' + encodeURIComponent(id);
    var res = C.get(apiUrl, { headers: API_HEADERS });
    if (res && res.status === 404) {
      return Response.error('FikFap: video #' + id + ' không tồn tại hoặc đã bị xóa (HTTP 404).');
    }
    if (res && res.ok) {
      try {
        var d = JSON.parse(res.text());
        stream = d.videoStreamUrl || d.videoUrl || d.playbackUrl || (d.video && d.video.url);
      } catch (e) {}
    }

    // 2. Fallback to Web only if API wasn't 404
    if (!stream) {
      var webUrl = BASE_URL + '/post/' + id;
      var webRes = C.get(webUrl, { headers: WEB_HEADERS });
      if (webRes && webRes.ok) {
        var html = webRes.text();
        var ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
        if (ldMatch) {
          try {
            var ld = JSON.parse(ldMatch[1]);
            stream = ld.contentUrl || ld.embedUrl;
          } catch (e) {}
        }
        if (!stream) {
          var m = html.match(/https?:[^"'\s<>\\]+?\.(?:m3u8|mp4)[^"'\s<>\\]*/i);
          if (m) stream = m[0].replace(/\\\//g, '/');
        }
      }
    }
  }

  if (stream) {
    return Response.success({
      type: 'native',
      data: stream,
      headers: {
        'Referer': BASE_URL + '/',
        'User-Agent': UA
      }
    });
  }

  return Response.error('FikFap: không lấy được link phát video.');
}
