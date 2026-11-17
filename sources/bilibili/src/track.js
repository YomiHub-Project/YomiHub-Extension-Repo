load('config.js');
load('bili.js');

function execute(data) {
  var epId = String(data || '').trim();
  if (!epId) return Response.error('Mã tập phim không hợp lệ');

  var j = BILI.get('/intl/gateway/web/playurl', { ep_id: epId, device: 'wap' });
  if (j && (j.code === 10004005 || j.code === 10004004 || j.code === 10023006)) {
    return Response.error('Tập phim này yêu cầu tài khoản VIP trên Bilibili');
  }
  if (!j || !j.data || !j.data.playurl) {
    return Response.error('Không thể lấy luồng phát: ' + ((j && j.message) || 'Lỗi Bilibili'));
  }

  var purl = j.data.playurl;
  var bestAudio = '';
  if (purl.audio_resource && purl.audio_resource.length) {
    for (var a = 0; a < purl.audio_resource.length; a++) {
      var ar = purl.audio_resource[a];
      if (ar && ar.url) { bestAudio = ar.url; break; }
    }
  }

  var subs = [];
  try {
    var subRes = BILI.get('/intl/gateway/m/subtitle', { ep_id: epId });
    var subList = (subRes && subRes.data && subRes.data.subtitles) || [];
    for (var s = 0; s < subList.length; s++) {
      var sb = subList[s];
      if (sb && sb.url) {
        subs.push({ data: sb.url, label: sb.title || sb.key || 'Phụ đề' });
      }
    }
  } catch (e) {}

  var qMap = { 120: '4K', 112: '1080p60', 80: '1080p', 64: '720p', 32: '480p', 16: '360p', 6: '240p', 5: '144p' };
  var tracks = [];
  var videos = purl.video || [];
  for (var v = 0; v < videos.length; v++) {
    var vr = videos[v] && videos[v].video_resource;
    if (vr && vr.url) {
      var qLabel = (videos[v].stream_info && videos[v].stream_info.desc_words) || qMap[vr.quality] || (vr.quality + 'P');
      var tr = {
        type: 'native',
        data: vr.url,
        quality: qLabel,
        host: BASE_URL,
        mimeType: vr.mime_type || 'video/mp4',
        headers: { 'User-Agent': BILI.UA, 'Referer': BASE_URL + '/', 'Origin': BASE_URL }
      };
      if (bestAudio) tr.audios = [{ data: bestAudio, label: 'Âm thanh gốc' }];
      if (subs.length) tr.subtitles = subs;
      tracks.push(tr);
    }
  }

  if (tracks.length === 0) {
    return Response.error('Không tìm thấy luồng phát khả dụng cho tập này');
  }

  return Response.success(tracks);
}
