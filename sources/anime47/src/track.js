load('config.js');
load('lib_common.js');

function execute(url) {
  if (/\.m3u8|\.mp4/i.test(url)) {
    return Response.success({
      type: 'native',
      data: url,
      headers: { Referer: BASE_URL + '/' }
    });
  }

  // Attempt to fetch stream via API if episode ID is extractable
  var mEp = /\/([0-9]+)-([0-9]+)\.html/.exec(url);
  if (mEp) {
    var animeId = mEp[1];
    var epNum = mEp[2];
    try {
      var d = requestApiJson('/anime/watch/episode/' + animeId + '?ep=' + epNum);
      if (d && d.data && d.data.stream_url) {
        return Response.success({
          type: 'native',
          data: d.data.stream_url,
          headers: { Referer: BASE_URL + '/' }
        });
      }
    } catch (e) {}
  }

  // 0.1.0: never hand an HTML page to the player as a "native" stream (the player spins forever).
  // Since 11/2026 the API answers 401 PRIVATE_MODE for every episode: the site requires an account.
  return Response.error('Anime47 đang bật chế độ riêng tư: cần đăng nhập tài khoản Anime47 (mở nguồn bằng WebView, đăng nhập rồi tải lại) mới xem được tập này.');
}
