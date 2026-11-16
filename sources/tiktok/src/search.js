load('config.js');
load('lib_shortvideo.js');
load('svx.js');
// "@name" / profile link -> that account's clips; clip link -> that clip; "#tag" -> hashtag; text -> keyword search
function execute(key, page) {
  key = String(key || '').trim();
  var m = /tiktok\.com\/@([\w.-]+)\/?(?:\?|$)/.exec(key) || /^@([\w.-]+)$/.exec(key);
  if (m) return SV.ttList('user:' + m[1], page);
  if (SV.videoId(key) || /vm\.tiktok\.com|vt\.tiktok\.com/.test(key)) return Response.success([{ name: 'Video TikTok', link: key, cover: '', description: key, host: BASE_URL }], '');
  if (/^#\S+$/.test(key)) return SV.ttList('tag:' + key.slice(1), page);
  var n = SV.page(page), srvErr = null;
  if (SV.server()) {
    try {
      var j = SV.dtk('tiktok/search/posts', { keyword: key, cursor: n > 1 ? page : '', count: 20 });
      return Response.success(SV.dtkItems(j).map(SV.dtkItem), SV.dtkNext(j));
    } catch (e) {
      // TikTok refuses keyword search to guest identities (IDENTITY_LOGIN_REQUIRED): fall back to tikwm, page 1 only
      if (n > 1) throw e;
      srvErr = e;
    }
  }
  try { return SV.twSearch(key, n); } catch (e2) { throw srvErr || e2; }
}
