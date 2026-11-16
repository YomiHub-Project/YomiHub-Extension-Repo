load('config.js');
load('tw.js');
// The usher host sometimes resets the first connection (seen on Vietnamese networks, 11/2026), and the player
// gives up without retrying. So the master playlist is downloaded here (up to 3 tries) and handed over as a
// data: URI (it only contains absolute variant URLs); the player then talks to the video CDN only.
function execute(data) {
  var url = String(data || ''), h = { 'User-Agent': TW.UA, 'Referer': BASE_URL + '/', 'Origin': BASE_URL }, out = url;
  for (var i = 0; i < 3; i++) {
    var r = fetch(url, { headers: h });
    if (r.ok) { var t = r.text(); if (t.indexOf('#EXTM3U') === 0) { out = 'data:application/x-mpegURL;base64,' + b64(t); break; } }
    if (r.status === 403 || r.status === 404) return Response.error(r.status === 404 ? 'Kênh đang ngoại tuyến hoặc video đã bị xoá' : 'Twitch từ chối phát video này (giới hạn vùng hoặc chỉ dành cho người đăng ký)');
  }
  return Response.success({ type: 'native', data: out, host: BASE_URL, mimeType: 'application/x-mpegURL', headers: h });
}
// the playlist may contain non-ASCII titles: encode as UTF-8 bytes
function b64(str) {
  var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', s = unescape(encodeURIComponent(str)), o = '';
  for (var i = 0; i < s.length; i += 3) {
    var a = s.charCodeAt(i), b = s.charCodeAt(i + 1), d = s.charCodeAt(i + 2), n = (a << 16) | ((b || 0) << 8) | (d || 0);
    o += c.charAt(n >> 18 & 63) + c.charAt(n >> 12 & 63) + (i + 1 < s.length ? c.charAt(n >> 6 & 63) : '=') + (i + 2 < s.length ? c.charAt(n & 63) : '=');
  }
  return o;
}
