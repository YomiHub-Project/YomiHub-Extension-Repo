load('config.js');
load('lib_shortvideo.js');
load('svx.js');
function execute(url) {
  if (SV.server() && (SV.videoId(url) || /v\.douyin\.com\//.test(url))) {
    var out = [];
    try { out = SV.dtkStreams(SV.dtk('douyin/video', { url: url }).data); } catch (e) { out = []; }
    if (out.length) return Response.success(out);
  }
  return Response.error('Douyin yêu cầu máy chủ DTK_SERVER để phân giải luồng phát trực tiếp');
}
