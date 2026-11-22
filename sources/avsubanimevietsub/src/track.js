load('config.js');
load('lib_common.js');
load('lib_generic.js');

var UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function isDirectStream(u) {
  var path = String(u || '').trim().split(/[?#]/)[0];
  return /\.(?:m3u8|mp4)$/i.test(path);
}

function unwrapParam(u) {
  var m = /[?&](?:url|file|src|link)=([^&#]+)/i.exec(String(u || ''));
  if (!m) return '';
  try {
    var decoded = decodeURIComponent(m[1]).trim();
    if (/^https?:\/\//i.test(decoded)) return decoded;
  } catch (e) {}
  return '';
}

function nativeTrack(streamUrl, referer) {
  return Response.success({
    type: 'native',
    data: streamUrl,
    headers: {
      'Referer': referer || (BASE_URL + '/'),
      'User-Agent': UA
    }
  });
}

function resolveTrack(url, depth) {
  depth = depth || 0;
  url = String(url || '').trim();
  if (!url) return Response.success({ type: 'webview', data: BASE_URL });

  // 1. Unwrap embedded player query parameter FIRST (e.g. player.phimapi.com/player/?url=https://.../index.m3u8)
  var unwrapped = unwrapParam(url);
  if (unwrapped) {
    if (isDirectStream(unwrapped)) {
      return nativeTrack(unwrapped, BASE_URL + '/');
    }
    if (depth < 2 && unwrapped !== url) {
      return resolveTrack(unwrapped, depth + 1);
    }
  }

  // 2. Direct stream URL (check path before query string only!)
  if (isDirectStream(url)) {
    return nativeTrack(url, BASE_URL + '/');
  }

  // 3. Fetch web page or external embed page and sniff native stream
  var html = '';
  var doc = null;
  var pageUrl = url;
  try {
    if (/^https?:\/\/[^\/]*(?:animevietsub|animevsub)/i.test(url) || !/^https?:\/\//i.test(url)) {
      var res = fetchWithDomainFallback(url);
      html = res.text();
      doc = res.html();
      pageUrl = res.url || url;
    } else {
      var rExt = fetch(url, {
        headers: {
          'User-Agent': UA,
          'Referer': BASE_URL + '/'
        }
      });
      if (rExt && rExt.ok) {
        html = rExt.text();
        doc = Html.parse(html, url);
      }
    }
  } catch (e) {}

  if (html) {
    var sniffed = (typeof C !== 'undefined' && C.sniff) ? C.sniff(html) : '';
    if (sniffed) {
      var sUnwrapped = unwrapParam(sniffed);
      if (sUnwrapped && isDirectStream(sUnwrapped)) return nativeTrack(sUnwrapped, pageUrl);
      if (isDirectStream(sniffed)) return nativeTrack(sniffed, pageUrl);
    }

    var cleanHtml = html.replace(/\\\//g, '/');
    var m = cleanHtml.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || cleanHtml.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
    if (m) {
      var candidate = m[0];
      var cUnwrapped = unwrapParam(candidate);
      if (cUnwrapped && isDirectStream(cUnwrapped)) return nativeTrack(cUnwrapped, pageUrl);
      if (isDirectStream(candidate)) return nativeTrack(candidate, pageUrl);
    }
  }

  if (doc && depth < 2) {
    var ifr = doc.select('iframe[data-primary-player-url], iframe[src], iframe[data-src]').first();
    if (ifr) {
      var src = ifr.attr('data-primary-player-url') || ifr.attr('src') || ifr.attr('data-src');
      if (src) {
        var fixedSrc = C.fix(src);
        if (fixedSrc && fixedSrc !== url) {
          return resolveTrack(fixedSrc, depth + 1);
        }
      }
    }
  }

  return Response.success({
    type: 'webview',
    data: url
  });
}

function execute(url) {
  return resolveTrack(url, 0);
}
