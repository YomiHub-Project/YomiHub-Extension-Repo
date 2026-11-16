load('config.js');
load('lib_common.js');
// The embed page carries the episode as JSON: {"type":"m3u8","encrypted_url":"<hex>"}; the hex string is the
// stream URL XOR-ed with a fixed text key (same as the site's own player script).
var HH_KEY = 'mySecretKey2024';
function hhUrl(hex) {
  var s = '';
  for (var i = 0; i + 1 < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.substr(i, 2), 16) ^ HH_KEY.charCodeAt((i / 2) % HH_KEY.length));
  return s;
}
function execute(data) {
  if (/\.(m3u8|mp4)(\?|$)/i.test(data)) return Response.success({ type: 'native', data: data, headers: { Referer: 'https://api.hihiphim.com/' } });
  var body = C.check(C.get(data, { headers: { Referer: BASE_URL + '/' } }), data).text() || '';
  var m = /var\s+episode\s*=\s*(\{[^\n]*?\})\s*;/.exec(body), ep = null;
  if (m) { try { ep = JSON.parse(m[1]); } catch (e) { ep = null; } }
  var u = ep && ep.encrypted_url ? hhUrl(String(ep.encrypted_url)) : '';
  if (!/^https?:\/\//.test(u)) u = ep && /^https?:\/\//.test(ep.link || '') ? ep.link : '';
  if (!u) return Response.success({ type: 'webview', data: data });
  if (!/\.(m3u8|mp4)(\?|$)/i.test(u)) return Response.success({ type: 'webview', data: u });
  return Response.success({ type: 'native', data: u, mimeType: /\.m3u8/i.test(u) ? 'application/x-mpegURL' : 'video/mp4', headers: { Referer: 'https://api.hihiphim.com/' } });
}
