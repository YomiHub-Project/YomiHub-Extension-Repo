load('config.js');
load('tw.js');
// channel: the live stream first, then the latest recordings (VODs); VOD link: a single entry
function execute(url) {
  if (TW.vod(url)) return Response.success([{ name: 'Xem video', url: BASE_URL + '/videos/' + TW.vod(url), host: BASE_URL }]);
  var lg = TW.login(url);
  if (!lg) return Response.error('Liên kết Twitch không hợp lệ');
  var u = TW.q('query{user(login:' + TW.s(lg) + '){stream{title} videos(first:50,sort:TIME){edges{node{id title lengthSeconds publishedAt}}}}}').user;
  if (!u) return Response.error('Không tìm thấy kênh Twitch ' + lg);
  var out = [{ name: (u.stream ? '🔴 Trực tiếp: ' + (u.stream.title || lg) : 'Trực tiếp (kênh đang ngoại tuyến)'), url: BASE_URL + '/' + lg, host: BASE_URL }];
  ((u.videos && u.videos.edges) || []).forEach(function (e) { var v = e.node; if (v && v.id) out.push({ name: String(v.publishedAt || '').slice(0, 10) + ' · ' + (v.title || 'VOD') + ' (' + TW.dur(v.lengthSeconds) + ')', url: BASE_URL + '/videos/' + v.id, host: BASE_URL }); });
  return Response.success(out);
}
