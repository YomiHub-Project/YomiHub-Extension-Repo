load('config.js');
load('lib_shortvideo.js');
load('svx.js');
function execute(url) {
  var v = null, c, err = null;
  if (SV.server()) {
    try {
      c = SV.dtk('tiktok/video', { url: url }).data;
      return Response.success({ name: SV.title(c.title || c.description, c.content_id), cover: SV.dtkCover(c), author: c.author ? c.author.nickname : '', description: c.description || '', detail: c.stats ? '▶ ' + (c.stats.play_count || 0) + ' · ♥ ' + (c.stats.digg_count || 0) : '', ongoing: false, genres: (c.tags || []).map(function (t) { return { title: '#' + t, input: 'tag:' + t, script: 'genre.js' }; }), host: BASE_URL });
    } catch (e0) { err = e0; }
  }
  // cache filled by the list -> one tikwm call -> TikTok oEmbed -> bare entry (the clip still opens in WebView)
  try { v = SV.twVideo(url, false); } catch (e) { err = err || e; v = SV.ttOembed(url); }
  if (!v) v = { title: '', author: {}, id: SV.videoId(url) };
  var a = v.author || {};
  var stats = v.play_count || v.digg_count || v.duration ? '▶ ' + (v.play_count || 0) + ' · ♥ ' + (v.digg_count || 0) + (v.duration ? ' · ' + v.duration + 's' : '') : '';
  return Response.success({ name: SV.title(v.title, v.id || v.video_id || SV.videoId(url)), cover: SV.twAbs(v.cover || v.origin_cover), author: a.nickname || a.unique_id || '', description: v.title || (err ? String(err.message || err) : ''), detail: stats, ongoing: false, genres: a.unique_id ? [{ title: '@' + a.unique_id, input: 'user:' + a.unique_id, script: 'genre.js' }] : [], host: BASE_URL });
}
