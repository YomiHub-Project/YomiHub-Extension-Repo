load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(data) {
  var target = String(data || '').trim();
  if (!target) {
    throw new Error('Tập phim hiện chưa có link phát từ máy chủ AnimeVn.');
  }

  // 1. Direct stream
  if (/\.m3u8|\.mp4/i.test(target)) {
    return Response.success({
      type: 'native',
      data: target,
      headers: { Referer: BASE_URL + '/' }
    });
  }

  // 2. Hydrax host
  if (target.indexOf('playhydrax.com') !== -1) {
    var mV = /[?&]v=([a-zA-Z0-9_\-]+)/i.exec(target);
    if (mV && mV[1]) {
      return Response.success({
        type: 'native',
        data: target,
        headers: { Referer: BASE_URL + '/' }
      });
    }
  }

  // 3. AnimeVn internal player
  if (target.indexOf('player/v/') !== -1) {
    try {
      var rPlayer = fetchWithRetry(target);
      var hPlayer = rPlayer.text();
      var mSrc = /<source[^>]+src=["']([^"']+)["']/i.exec(hPlayer);
      if (mSrc && mSrc[1]) {
        var stream = mSrc[1].trim();
        if (stream) {
          return Response.success({
            type: 'native',
            data: stream,
            headers: { Referer: BASE_URL + '/' }
          });
        }
      }
    } catch (e) {}
  }

  // 4. Episode page URL -> fetch and resolve stream or player
  if (target.indexOf('/tap-') !== -1) {
    var res = fetchWithRetry(target);
    var html = res.text();

    // Check direct media in page
    var mMedia = html.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || html.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
    if (mMedia) {
      return Response.success({
        type: 'native',
        data: mMedia[0],
        headers: { Referer: BASE_URL + '/' }
      });
    }

    // Check Hydrax in startStreaming
    var mHy = /case\s*['"]HY['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
    if (mHy && mHy[1]) {
      var hyUrl = mHy[1].trim();
      if (/[?&]v=([a-zA-Z0-9_\-]+)/i.test(hyUrl)) {
        return Response.success({
          type: 'native',
          data: hyUrl,
          headers: { Referer: BASE_URL + '/' }
        });
      }
    }

    // Check AnimeVn player in startStreaming
    var mAhs = /case\s*['"]AHS['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
    if (mAhs && mAhs[1]) {
      var ahsUrl = mAhs[1].trim();
      try {
        var rAhs = fetchWithRetry(ahsUrl);
        var hAhs = rAhs.text();
        var mAhsSrc = /<source[^>]+src=["']([^"']+)["']/i.exec(hAhs);
        if (mAhsSrc && mAhsSrc[1] && mAhsSrc[1].trim()) {
          return Response.success({
            type: 'native',
            data: mAhsSrc[1].trim(),
            headers: { Referer: BASE_URL + '/' }
          });
        }
      } catch (e) {}
    }
  }

  // If no playable stream link could be found
  throw new Error('Tập phim hiện chưa có link phát từ máy chủ AnimeVn. Vui lòng chọn tập khác hoặc kiểm tra lại sau.');
}
