load('config.js');
load('dm.js');
// player metadata -> HLS manifest (adaptive, up to 1080p) + subtitles
function execute(data) {
  var id = DM.id(data) || String(data || '');
  var m = DM.get('https://www.dailymotion.com/player/metadata/video/' + id);
  if (m.error) return Response.error((m.error.title || 'Video không khả dụng') + (m.error.message ? ': ' + m.error.message : ''));
  var q = m.qualities || {}, src = '', mime = 'application/x-mpegURL';
  (q.auto || []).forEach(function (s) { if (!src && s.url) src = s.url; });
  if (!src) for (var k in q) (q[k] || []).forEach(function (s) { if (!src && s.url) { src = s.url; mime = s.type || mime; } });
  if (!src) return Response.error('Không có luồng phát (video riêng tư, giới hạn vùng hoặc chỉ dành cho người đăng ký)');
  var tr = { type: 'native', data: src, host: BASE_URL, mimeType: mime, headers: { 'User-Agent': DM.UA, 'Referer': BASE_URL + '/', 'Origin': BASE_URL } };
  var subs = [], sd = (m.subtitles && m.subtitles.data) || {};
  for (var l in sd) { var u = sd[l] && sd[l].urls && sd[l].urls[0]; if (u) subs.push({ data: u, label: sd[l].label || l }); }
  if (subs.length) tr.subtitles = subs;
  return Response.success(tr);
}
