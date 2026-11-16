load('config.js');
load('lib_shortvideo.js');
load('svx.js');
// One clip = one episode whose URL is the clip's canonical TikTok URL. Stream links come from the cache the
// list filled (no extra request) or from one tikwm call; when tikwm is down the clip still opens in the
// TikTok web player (WebView) instead of failing.
function execute(url) {
  var out = [];
  try {
    if (SV.server()) out = SV.dtkStreams(SV.dtk('tiktok/video', { url: url }).data);
    else out = SV.twStreams(SV.twVideo(url, true));
  } catch (e) {
    if (SV.server()) { try { out = SV.twStreams(SV.twVideo(url, true)); } catch (e2) { out = []; } }
  }
  if (!out.length) return Response.success([{ title: 'Mở trên TikTok (WebView)', data: url }]);
  return Response.success(out);
}
