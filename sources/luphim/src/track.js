load('config.js');
load('lib_common.js');
load('lib_generic.js');

function luphimTrim(s) { return String(s || '').replace(/^\s+|\s+$/g, ''); }
function luphimDecodeEntities(u) { return String(u || '').replace(/&amp;/g, '&'); }
function luphimOrigin(u) {
  var m = /^https?:\/\/[^/?#]+/i.exec(String(u || ''));
  return m ? m[0] : BASE_URL;
}
function luphimVar(html, name) {
  var re = new RegExp('(?:var|let|const)\\s+' + name + '\\s*=\\s*[\'"]([^\'"]*)[\'"]');
  var m = re.exec(html);
  return m ? m[1] : '';
}

function execute(data) {
  var epUrl = luphimTrim(data);
  if (!epUrl) return Response.error('Không có URL tập phim');
  var ua = (typeof UserAgent !== 'undefined' && UserAgent.chrome)
    ? UserAgent.chrome()
    : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36';

  try {
    var epRes = C.get(epUrl, { headers: { 'Referer': BASE_URL + '/', 'User-Agent': ua } });
    var epHtml = epRes ? (epRes.text() || '') : '';
    var ifM = /<iframe[^>]+src=["']([^"']+)["']/i.exec(epHtml);
    if (!ifM || !ifM[1]) return X.track(epUrl);

    var embedUrl = luphimDecodeEntities(ifM[1]);
    if (embedUrl.indexOf('//') === 0) embedUrl = 'https:' + embedUrl;
    if (embedUrl.indexOf('http') !== 0) embedUrl = luphimOrigin(epUrl) + (embedUrl.charAt(0) === '/' ? '' : '/') + embedUrl;
    if (!/moviking|ayama/i.test(embedUrl)) return X.track(embedUrl, 1, epUrl);

    var emRes = C.get(embedUrl, { headers: { 'Referer': BASE_URL + '/', 'User-Agent': ua } });
    var emHtml = emRes ? (emRes.text() || '') : '';
    var embedOrigin = luphimOrigin(embedUrl);

    var videoId = luphimVar(emHtml, 'videoId');
    if (!videoId) {
      var idM = /[?&]id=([a-zA-Z0-9_-]+)/.exec(embedUrl);
      videoId = idM ? idM[1] : '';
    }
    var subId = luphimVar(emHtml, 'subId');
    var web = luphimVar(emHtml, 'web') || 'luphim.com';
    var cdn = luphimVar(emHtml, 'cdn') || 'https://cdn5.tuitito.fun';
    var lang = luphimVar(emHtml, 'lang') || 'vi';
    var domain = luphimVar(emHtml, 'domain') || (BASE_URL + '/');
    if (!videoId) return X.track(embedUrl, 1, epUrl);

    var boundary = '----YHBoundary7MA4YWxkTrZu0gW';
    var fields = {
      renderer: 'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver)',
      id: 'a1b2c3d4e5f60718293a4b5c6d7e8f90',
      videoId: videoId,
      domain: domain
    };
    var body = '';
    for (var k in fields) {
      if (Object.prototype.hasOwnProperty.call(fields, k)) {
        body += '--' + boundary + '\r\nContent-Disposition: form-data; name="' + k + '"\r\n\r\n' + fields[k] + '\r\n';
      }
    }
    body += '--' + boundary + '--\r\n';

    var guRes = fetch(embedOrigin + '/geturl', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Referer': embedUrl,
        'Origin': embedOrigin,
        'User-Agent': ua
      },
      body: body
    });
    if (!guRes || !guRes.ok) return Response.error('LuPhim geturl HTTP ' + (guRes ? guRes.status : 0));
    var tokenData = luphimTrim(guRes.text()).replace(/^"|"$/g, '');
    if (!tokenData || tokenData.charAt(0) === '<') return Response.error('LuPhim geturl không trả token');

    var stUrl = cdn.replace(/\/+$/, '') + '/streaming?id=' + encodeURIComponent(videoId)
      + '&subId=' + encodeURIComponent(subId)
      + '&web=' + encodeURIComponent(web)
      + '&' + tokenData
      + '&cdn=' + encodeURIComponent(cdn)
      + '&lang=' + encodeURIComponent(lang);

    var stRes = C.get(stUrl, { headers: { 'Referer': embedOrigin + '/', 'User-Agent': ua } });
    var stHtml = stRes ? (stRes.text() || '') : '';

    var m3u8Url = '';
    var uConcat = /var\s+url\s*=\s*['"]([^'"]+)['"]\s*\+\s*videoId\s*\+\s*['"]([^'"]+)['"]/.exec(stHtml);
    if (uConcat) {
      m3u8Url = uConcat[1] + videoId + uConcat[2];
    } else {
      var uDirect = /var\s+url\s*=\s*['"](https?:\/\/[^'"]+)['"]/.exec(stHtml);
      if (uDirect) m3u8Url = uDirect[1];
    }
    if (!m3u8Url) m3u8Url = X.sniff(stHtml);
    if (!m3u8Url) return Response.error('LuPhim không tìm thấy luồng HLS trong /streaming');

    var cdnOrigin = luphimOrigin(cdn);
    return Response.success({
      type: 'native',
      data: m3u8Url,
      mimeType: /\.mp4(?:[?#]|$)/i.test(m3u8Url) ? 'video/mp4' : 'application/x-mpegURL',
      headers: {
        'Referer': cdnOrigin + '/',
        'Origin': cdnOrigin,
        'User-Agent': ua
      }
    });
  } catch (e) {
    return Response.error('LuPhim lỗi trích luồng: ' + (e && e.message ? e.message : e));
  }
}
