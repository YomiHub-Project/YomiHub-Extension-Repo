load('config.js');
load('vtv.js');

function execute(data) {
  var slug = String(data || '').trim();
  if (!slug) return Response.error('Không tìm thấy kênh');

  var res = fetch(VTV.API + '/live-channel/v21.0/playback/source', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': VTV.UA,
      'Referer': BASE_URL + '/',
      'Origin': BASE_URL
    },
    body: JSON.stringify({
      channelId: slug,
      platform: 'web',
      appVersion: '1.0.0'
    })
  });

  if (!res.ok) return Response.error('VTV Go Playback HTTP ' + res.status);
  var j = res.json();
  if (!j || !j.data || !j.data.sourceModes) {
    return Response.error('Không lấy được luồng phát: ' + ((j && j.error && j.error.message) || 'Lỗi phát'));
  }

  var modes = j.data.sourceModes;
  var streamUrl = '';
  for (var m = 0; m < modes.length; m++) {
    var ms = modes[m].multiSource || [];
    for (var s = 0; s < ms.length; s++) {
      var sources = ms[s].sources || [];
      for (var k = 0; k < sources.length; k++) {
        if (sources[k] && sources[k].url) {
          streamUrl = sources[k].url;
          break;
        }
      }
      if (streamUrl) break;
    }
    if (streamUrl) break;
  }

  if (!streamUrl) return Response.error('Kênh hiện không có luồng phát');

  return Response.success({
    type: 'native',
    data: streamUrl,
    quality: 'Trực tiếp HLS',
    host: BASE_URL,
    mimeType: 'application/x-mpegURL',
    headers: {
      'User-Agent': VTV.UA,
      'Referer': BASE_URL + '/',
      'Origin': BASE_URL
    }
  });
}
