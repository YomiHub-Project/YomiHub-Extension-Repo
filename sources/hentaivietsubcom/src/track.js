load('config.js');
load('lib_common.js');
load('lib_generic.js');
// The player page (vcast.name / streamforester …/videos/<id>/play) carries
// window.videoData = {"sources":[{"file":"/videos/<id>/master.m3u8"}]} with a path relative to the player host.
function execute(data) {
  if (/\.(m3u8|mp4)(\?|$)/i.test(data)) return X.track(data);
  var m = /^(https?:\/\/[^\/]+)\/videos\/([0-9a-f]+)\/play/i.exec(data);
  if (!m) return X.track(data);
  var r = C.get(data), body = r && r.ok ? (r.text() || '') : '';
  var f = /"file"\s*:\s*"([^"]+?\.m3u8[^"]*)"/.exec(body.replace(/\\\//g, '/'));
  var u = f ? f[1] : '/videos/' + m[2] + '/master.m3u8';
  if (!/^https?:/.test(u)) u = m[1] + (u.charAt(0) === '/' ? '' : '/') + u;
  return Response.success({ type: 'native', data: u, mimeType: 'application/x-mpegURL', headers: { Referer: m[1] + '/' } });
}
