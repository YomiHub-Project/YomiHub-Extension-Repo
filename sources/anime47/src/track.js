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

  // Return native playback target with headers
  return Response.success({
    type: 'native',
    data: url,
    headers: { Referer: BASE_URL + '/' }
  });
}
