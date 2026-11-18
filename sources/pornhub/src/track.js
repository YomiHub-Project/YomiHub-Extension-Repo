load('config.js');
load('lib_common.js');

function execute(data) {
  if (/\.(m3u8|mp4)(\?|$)/i.test(data)) {
    return Response.success({
      type: 'native',
      data: data,
      headers: {
        'Referer': BASE_URL + '/',
        'User-Agent': UA
      }
    });
  }

  var res = C.get(data, {
    headers: {
      'User-Agent': UA,
      'Referer': BASE_URL + '/',
      'Cookie': 'accessAgeDisclaimerPH=1; platform=pc; age_verified=1'
    }
  });

  if (!res || !res.ok) {
    return Response.error('PornHub: không lấy được nội dung video.');
  }

  var html = res.text() || '';
  var stream = null;

  // 1. Check flashvars mediaDefinitions
  var fvMatch = html.match(/flashvars_\d+\s*=\s*(\{[\s\S]*?\});/);
  if (fvMatch) {
    try {
      var fv = JSON.parse(fvMatch[1]);
      var media = fv.mediaDefinitions || [];
      // Prefer HLS master.m3u8
      for (var i = 0; i < media.length; i++) {
        var m = media[i];
        if (m.format === 'hls' && m.videoUrl && /master\.m3u8/i.test(m.videoUrl)) {
          stream = m.videoUrl;
          break;
        }
      }
      if (!stream) {
        for (var j = 0; j < media.length; j++) {
          if (media[j].videoUrl) {
            stream = media[j].videoUrl;
            break;
          }
        }
      }
    } catch (e) {}
  }

  // 2. Regex search for master.m3u8 or mp4
  if (!stream) {
    var m3u8 = html.match(/https?:[^"'\s<>\\]+?master\.m3u8[^"'\s<>\\]*/i);
    if (m3u8) {
      stream = m3u8[0].replace(/\\\//g, '/');
    }
  }

  if (!stream) {
    var mp4 = html.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
    if (mp4) {
      stream = mp4[0].replace(/\\\//g, '/');
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

  return Response.error('PornHub: không lấy được link phát video.');
}
