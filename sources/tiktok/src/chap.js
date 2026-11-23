load('config.js');
load('lib_shortvideo.js');
load('svx.js');
function execute(url) {
  var out = [];
  try {
    if (SV.server()) out = SV.dtkStreams(SV.dtk('tiktok/video', { url: url }).data);
    else out = SV.twStreams(SV.twVideo(url, true));
  } catch (e) {
    if (SV.server()) { try { out = SV.twStreams(SV.twVideo(url, true)); } catch (e2) { out = []; } }
  }
  if (!out.length) return Response.error('Không tìm thấy luồng video trực tiếp');
  return Response.success(out);
}
