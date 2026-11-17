load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(data) {
  var url = String(data || '').trim();
  if (!url) return Response.error('KhÃ´ng cÃ³ URL táº­p');
  if (url.indexOf('http') !== 0) {
    url = BASE_URL + (url.indexOf('/') === 0 ? '' : '/') + url;
  }

  try {
    var epRes = fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': BASE_URL + '/'
      }
    });
    if (!epRes.ok) return X.track(data);
    var epHtml = epRes.text();

    var iframeMatch = epHtml.match(/<iframe[^>]+id=["']iframeStream["'][^>]+src=["']([^"']+)["']/i) || epHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (!iframeMatch) return X.track(data);

    var iframeUrl = iframeMatch[1].replace(/&amp;/g, '&');
    if (iframeUrl.indexOf('//') === 0) iframeUrl = 'https:' + iframeUrl;

    var videoIdMatch = iframeUrl.match(/[?&]id=([^&]+)/);
    if (!videoIdMatch) return X.track(data);
    var videoId = videoIdMatch[1];

    var webMatch = iframeUrl.match(/[?&]web=([^&]+)/);
    var web = webMatch ? webMatch[1] : 'phimtv2.com';

    var langMatch = iframeUrl.match(/[?&]lang=([^&]+)/);
    var lang = langMatch ? langMatch[1] : 'vi';

    var originMatch = iframeUrl.match(/^(https?:\/\/[^\/]+)/);
    var embedOrigin = originMatch ? originMatch[1] : 'https://moviking.ayama.fun';

    var bodyStr = 'renderer=' + encodeURIComponent('ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0, D3D11)') +
      '&id=' + encodeURIComponent('2a5b678c901234ef5678901234567890') +
      '&videoId=' + encodeURIComponent(videoId) +
      '&domain=' + encodeURIComponent(BASE_URL + '/');

    var tokenRes = fetch(embedOrigin + '/geturl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': iframeUrl,
        'Origin': embedOrigin,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: bodyStr
    });

    if (!tokenRes.ok) return X.track(data);
    var tokenStr = tokenRes.text().trim();

    var cdn = 'https://cdn5.nanani2.fun';
    var streamPageUrl = cdn + '/streaming?id=' + videoId + '&subId=&web=' + encodeURIComponent(web) + '&' + tokenStr + '&cdn=' + encodeURIComponent(cdn) + '&lang=' + encodeURIComponent(lang);

    var sRes = fetch(streamPageUrl, {
      headers: {
        'Referer': embedOrigin + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!sRes.ok) return X.track(data);
    var sHtml = sRes.text();

    var streamFile = '';
    var urlConcatMatch = sHtml.match(/var\s+url\s*=\s*['"]([^'"]+)['"]\s*\+\s*videoId\s*\+\s*['"]([^'"]+)['"]/);
    if (urlConcatMatch) {
      streamFile = urlConcatMatch[1] + videoId + urlConcatMatch[2];
    } else {
      var fileMatch = sHtml.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
      if (fileMatch) streamFile = fileMatch[1];
    }

    if (!streamFile) return X.track(data);

    var subtitles = [];
    var tracksMatch = sHtml.match(/tracks:\s*(\[[^\]]+\])/);
    if (tracksMatch) {
      try {
        var rawTracks = JSON.parse(tracksMatch[1]);
        for (var i = 0; i < rawTracks.length; i++) {
          var t = rawTracks[i];
          if (t && (t.kind === 'captions' || t.kind === 'subtitles') && t.file) {
            subtitles.push({
              data: t.file,
              label: t.label || 'Sub'
            });
          }
        }
      } catch (e) {}
    }

    return Response.success({
      type: 'native',
      data: streamFile,
      quality: 'Server Gá»‘c HLS',
      mimeType: 'application/x-mpegURL',
      headers: {
        'Referer': cdn + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      subtitles: subtitles
    });
  } catch (err) {
    return X.track(data);
  }
}
