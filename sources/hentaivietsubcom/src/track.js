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
  if (!f) {
    var dm = /"domain"\s*:\s*"([^"]+)"/.exec(body);
    var cfgUrl = m[1] + '/videos/' + m[2] + '/config?d=' + encodeURIComponent(dm ? dm[1] : 'hentaivietsub.com');
    var cr = C.get(cfgUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Referer': data, 'Origin': m[1] }, body: '{}' });
    var cbody = cr && cr.ok ? (cr.text() || '') : '';
    f = /"file"\s*:\s*"([^"]+?\.m3u8[^"]*)"/.exec(cbody.replace(/\\\//g, '/'));
  }
  if (!f) return Response.error('Máy chủ phát không trả về luồng HLS khả dụng');
  var u = f[1];
  if (!/^https?:/.test(u)) u = m[1] + (u.charAt(0) === '/' ? '' : '/') + u;
  return Response.success({ type: 'native', data: u, mimeType: 'application/x-mpegURL', headers: { Referer: m[1] + '/' } });
}
