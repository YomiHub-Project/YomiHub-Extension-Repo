load('config.js');
load('lib_shortvideo.js');
load('svx.js');
function execute(url) {
  if (SV.server() && (SV.videoId(url) || /v\.douyin\.com\//.test(url))) {
    // a server error must not block the clip: it then opens on douyin.com in the WebView
    var out = [];
    try { out = SV.dtkStreams(SV.dtk('douyin/video', { url: url }).data); } catch (e) { out = []; }
    if (out.length) return Response.success(out);
  }
  return Response.success([{ title: 'Douyin (WebView)', data: url }]);
}
