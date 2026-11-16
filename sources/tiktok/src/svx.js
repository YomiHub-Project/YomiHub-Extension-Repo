// 0.0.6 — hardening for the short-video sources (TikTok, Douyin). Loaded right after lib_shortvideo.js and
// replaces a few SV functions (the shared lib itself is left untouched). ES5: runs in Rhino, QuickJS, JSC, Node.
//
//  * Douyin_TikTok_Download_API (DTK_SERVER): a "202 still running" answer after ?wait= is polled through
//    /api/v1/tasks/<id> instead of being read as a result; retryable error codes are retried with the
//    server's retry_after; errors are reported by their stable code, in Vietnamese.
//  * tikwm.com (measured 15/11/2026): free limit = 1 request/second ("Free Api Limit"), the region feed
//    sometimes answers "Oops, an error occurred", and /api/feed/search, /api/user/posts, /api/user/info sit
//    behind a Cloudflare challenge. So: one request per ~1.2 s, retries, the other host name as a second
//    try, hashtag lists through /api/challenge/*, keyword search falls back to the best matching hashtag,
//    and everything a list already returned (title, cover, stream links) is cached so opening a clip
//    costs no further request.
// No request signing happens here: signed TikTok/Douyin calls stay with the user's own DTK server.
SV.now = function () { return new Date().getTime(); };
SV.cget = function (k, maxAge) {
  try { var s = cacheStorage.getItem(k); if (!s) return null; var o = JSON.parse(s); if (!o || !o.t) return null; if (maxAge && SV.now() - o.t > maxAge) return null; return o.v; } catch (e) { return null; }
};
SV.cset = function (k, v) { try { cacheStorage.setItem(k, JSON.stringify({ t: SV.now(), v: v })); } catch (e) { } };
SV.nap = function (ms) { try { sleep(ms); } catch (e) { } };
SV.fail = function (msg, code) { var e = new Error(msg); e.svCode = code || ''; return e; };

// ---------------------------------------------------------------- Douyin_TikTok_Download_API
SV.DTK_RETRY = { RATE_LIMITED: 1, QUEUE_FULL: 1, IDENTITY_POOL_EXHAUSTED: 1, ENDPOINT_CIRCUIT_OPEN: 1, UPSTREAM_RISK_CONTROL: 1, SIGNING_FAILED: 1, UPSTREAM_UNREACHABLE: 1, INTERNAL: 1 };
SV.DTK_HINT = {
  NETWORK: 'không kết nối được máy chủ — kiểm tra địa chỉ DTK_SERVER và mạng',
  'HTTP 401': 'máy chủ từ chối khoá — kiểm tra DTK_KEY (X-API-Key)',
  'HTTP 403': 'khoá API không đủ quyền (cần quyền đọc tiktok/douyin)',
  UNAUTHORIZED: 'máy chủ từ chối khoá — kiểm tra DTK_KEY (X-API-Key)',
  FORBIDDEN: 'khoá API không đủ quyền (cần quyền đọc tiktok/douyin)',
  RATE_LIMITED: 'máy chủ đang giới hạn tốc độ, thử lại sau ít giây',
  QUEUE_FULL: 'hàng đợi của máy chủ đang đầy, thử lại sau ít giây',
  IDENTITY_POOL_EXHAUSTED: 'máy chủ hết danh tính rảnh, thử lại sau',
  IDENTITY_LOGIN_REQUIRED: 'yêu cầu này cần danh tính đã đăng nhập trên máy chủ (nhập cookie tài khoản vào máy chủ)',
  UNSUPPORTED_CONTENT: 'nền tảng không phục vụ loại nội dung này',
  CONTENT_PRIVATE: 'nội dung ở chế độ riêng tư',
  NOT_FOUND: 'không tìm thấy nội dung',
  UPSTREAM_RISK_CONTROL: 'nền tảng đang chặn (risk control), thử lại sau',
  UPSTREAM_UNREACHABLE: 'máy chủ không vào được nền tảng',
  TIMEOUT: 'máy chủ chưa xử lý xong trong thời gian chờ'
};
SV.dtkHeaders = function () { var h = { 'Accept': 'application/json' }, key = SV.cfg('DTK_KEY'); if (key) h['X-API-Key'] = key; return h; };
// one GET -> { st, j }  (st 0 = network failure)
SV.dtkGet = function (u) {
  var r = null, j = null;
  try { r = fetch(u, { headers: SV.dtkHeaders() }); } catch (e) { r = null; }
  if (r) { try { j = r.json(); } catch (e2) { j = null; } }
  return { st: r ? r.status : 0, j: j };
};
// wait for a task that was still queued/running when ?wait= ran out; -> { j } or { err: {code, message, retry_after} }
SV.dtkPoll = function (id) {
  var u = SV.server() + '/api/v1/tasks/' + encodeURIComponent(id);
  for (var i = 0; i < 12; i++) {
    SV.nap(2000);
    var x = SV.dtkGet(u + '?_=' + i), d = x.j && x.j.data;
    if (!d) { if (x.j && x.j.error) return { err: x.j.error }; continue; }
    if (d.state === 'done') return { j: { success: true, data: d.data, error: null, meta: d.result_meta || {} } };
    if (d.state === 'failed') return { err: d.error || { code: 'INTERNAL' } };
  }
  return { err: { code: 'TIMEOUT' } };
};
SV.dtk = function (path, q) {
  q = q || {}; q.wait = q.wait || 25;
  var u = SV.server() + '/api/v1/' + path + '?' + SV.qs(q), code = '', msg = '';
  for (var a = 0; a < 3; a++) {
    var x = SV.dtkGet(u), j = x.j, err = null;
    if (j && j.success !== false && j.data && j.data.task_id && (x.st === 202 || /^(queued|running)$/.test(j.data.state || ''))) {
      var p = SV.dtkPoll(j.data.task_id); if (p.j) return p.j; err = p.err;
    } else if (x.st >= 200 && x.st < 300 && j && j.success !== false) return j;
    else err = j && j.error ? j.error : { code: x.st ? 'HTTP ' + x.st : 'NETWORK' };
    code = String(err.code || 'INTERNAL'); msg = String(err.message || '');
    var again = SV.DTK_RETRY[code] || x.st === 0 || x.st === 502 || x.st === 504 || (err.retryable === true && code !== 'TASK_NOT_FOUND');
    if (!again || a === 2) break;
    var wait = err.retry_after ? err.retry_after * 1000 : 1500 * (a + 1);
    SV.nap(wait > 8000 ? 8000 : wait < 500 ? 500 : wait);
  }
  throw SV.fail('Máy chủ Douyin_TikTok_Download_API (' + path + '): ' + code + (SV.DTK_HINT[code] ? ' — ' + SV.DTK_HINT[code] : (msg ? ' — ' + msg : '')), code);
};

// ---------------------------------------------------------------- tikwm.com
SV.TWH = ['https://www.tikwm.com', 'https://tikwm.com'];
SV.TW_NOTE = ' — có thể đặt máy chủ Douyin_TikTok_Download_API (DTK_SERVER) trong cài đặt nguồn';
// free tier = 1 request/second for the whole IP: keep ~1.2 s between two calls, also across scripts
SV.twGate = function () {
  var last = 0; try { last = parseInt(cacheStorage.getItem('tw_last') || '0', 10) || 0; } catch (e) { }
  var d = SV.now() - last; if (d >= 0 && d < 1200) SV.nap(1200 - d);
  try { cacheStorage.setItem('tw_last', String(SV.now())); } catch (e2) { }
};
SV.twCf = function (r) { if (!r || (r.status !== 403 && r.status !== 503)) return false; var t = ''; try { t = r.text() || ''; } catch (e) { } return /Just a moment|challenge-platform|cf_chl|Attention Required/i.test(t.slice(0, 6000)); };
// tikwm call with throttle + retry. Throws an Error with svCode: CF (Cloudflare), LIMIT, DOWN, API (not retryable)
SV.tw = function (path, q, post) {
  var body = SV.qs(q), why = '', code = 'DOWN';
  for (var a = 0; a < 4; a++) {
    SV.twGate();
    var host = SV.TWH[a === 1 || a === 3 ? 1 : 0];
    var opt = { headers: { 'Accept': 'application/json', 'Referer': host + '/' } }, u = host + path;
    // "_r": the hosts keep GET answers for a minute, a retry has to be a different URL
    if (post) { opt.method = 'POST'; opt.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'; opt.body = body; } else u += '?' + body + (a ? '&_r=' + a : '');
    var r = null, j = null;
    try { r = fetch(u, opt); } catch (e) { r = null; }
    if (r) { try { j = r.json(); } catch (e2) { j = null; } }
    if (j && j.code === 0) return j.data;
    if (SV.twCf(r)) { why = 'tikwm.com đang bật kiểm tra Cloudflare cho ' + path; code = 'CF'; if (a >= 1) break; continue; }
    var m = j && j.msg ? String(j.msg) : '';
    if (/limit/i.test(m)) { why = 'tikwm.com giới hạn tốc độ (1 yêu cầu/giây)'; code = 'LIMIT'; SV.nap(1300); continue; }
    if (!j || /oops|try again|timeout|busy|later/i.test(m)) { why = 'tikwm.com ' + (m ? 'báo lỗi: ' + m : 'không trả lời (HTTP ' + (r ? r.status : 0) + ')'); code = 'DOWN'; if (a >= 2) break; SV.nap(800 * (a + 1)); continue; }
    why = 'tikwm.com: ' + m; code = 'API'; break;
  }
  throw SV.fail(why + SV.TW_NOTE, code);
};
// ---- per-clip cache: what a list returned is enough to open the clip (no second request)
SV.twPack = function (v) { var a = v.author || {}; return { i: String(v.video_id || v.id || ''), n: v.title || '', c: v.cover || v.origin_cover || '', k: a.nickname || '', u: a.unique_id || '', p: v.play || '', h: v.hdplay || '', w: v.wmplay || '', d: v.duration || 0, pc: v.play_count || 0, dc: v.digg_count || 0, t: SV.now() }; };
SV.twUnpack = function (o) { return { id: o.i, video_id: o.i, title: o.n, cover: o.c, author: { nickname: o.k, unique_id: o.u }, play: o.p, hdplay: o.h, wmplay: o.w, duration: o.d, play_count: o.pc, digg_count: o.dc }; };
SV.twRemember = function (list) {
  if (!list || !list.length) return;
  var m = SV.cget('tw_v') || {}, ids = [], i;
  for (i = 0; i < list.length; i++) { var o = SV.twPack(list[i]); if (o.i) m[o.i] = o; }
  for (var k in m) ids.push(k);
  if (ids.length > 60) { ids.sort(function (x, y) { return m[x].t - m[y].t; }); for (i = 0; i < ids.length - 60; i++) delete m[ids[i]]; }
  SV.cset('tw_v', m);
};
// stream links carry their expiry (…/<md5>/<hex unix time>/…); without one they are trusted for 3 hours
SV.twFresh = function (o) {
  var m = /\/[0-9a-f]{32}\/([0-9a-f]{8})\//.exec(o.p || o.h || '');
  if (m) return parseInt(m[1], 16) * 1000 - SV.now() > 600000;
  return SV.now() - o.t < 3 * 3600000;
};
SV.twCached = function (url, needStream) {
  var id = SV.videoId(url); if (!id) return null;
  var o = (SV.cget('tw_v') || {})[id]; if (!o) return null;
  if (needStream && (!(o.p || o.h) || !SV.twFresh(o))) return null;
  return SV.twUnpack(o);
};
SV.twVideo = function (url, needStream) {
  var v = SV.twCached(url, needStream); if (v) return v;
  v = SV.tw('/api/', { url: url, hd: 1 });
  if (v && !v.video_id) v.video_id = v.id;
  SV.twRemember([v]);
  return v;
};
SV.twPage = function (d, n) { var list = (d && d.videos) || []; SV.twRemember(list); return Response.success(list.map(SV.twItem), d && d.hasMore && list.length ? String(n + 1) : ''); };
// hashtag name -> numeric id (kept forever: ids never change)
SV.twTagId = function (name) {
  name = String(name || '').replace(/^#/, '').trim();
  var k = 'tw_tag_' + name.toLowerCase(), id = '';
  try { id = localStorage.getItem(k) || ''; } catch (e) { }
  if (id) return id;
  var bare = name.replace(/\s+/g, '');
  try { id = String((SV.tw('/api/challenge/info', { challenge_name: bare }) || {}).id || ''); } catch (e1) { if (e1.svCode === 'CF' || e1.svCode === 'LIMIT' || e1.svCode === 'DOWN') throw e1; }
  if (!id) {
    var l = (SV.tw('/api/challenge/search', { keywords: name, count: 5, cursor: 0 }) || {}).challenge_list || [];
    for (var i = 0; i < l.length && !id; i++) if (String(l[i].cha_name).toLowerCase() === bare.toLowerCase()) id = String(l[i].id);
    if (!id && l.length) id = String(l[0].id);
  }
  if (!id) throw SV.fail('Không tìm thấy hashtag #' + name + ' trên TikTok', 'API');
  try { localStorage.setItem(k, id); } catch (e2) { }
  return id;
};
SV.twTag = function (name, n) { return SV.twPage(SV.tw('/api/challenge/posts', { challenge_id: SV.twTagId(name), count: 20, cursor: (n - 1) * 20 }), n); };
// keyword search: /api/feed/search when it answers; when Cloudflare blocks it (remembered for 30 min) the
// videos of the closest hashtag are returned instead
SV.twSearch = function (key, n) {
  if (!SV.cget('tw_nosearch', 1800000)) {
    try { return SV.twPage(SV.tw('/api/feed/search', { keywords: key, count: 20, cursor: (n - 1) * 20, HD: 1 }, true), n); }
    catch (e) { if (e.svCode === 'CF') SV.cset('tw_nosearch', 1); else if (e.svCode !== 'DOWN' && e.svCode !== 'API') throw e; }
  }
  return SV.twTag(key, n);
};
// TikTok list: "feed" (region feed) | "tag:<hashtag>" | "user:<unique_id>"
SV.ttList = function (input, page) {
  input = String(input || 'feed');
  var n = SV.page(page), d;
  if (SV.server()) {
    var j, cur = page && page !== '1' ? page : '';
    if (input.indexOf('user:') === 0) j = SV.dtk('tiktok/user/posts', { url: 'https://www.tiktok.com/@' + input.slice(5), cursor: cur, count: 20 });
    else j = SV.dtk('tiktok/hashtag/posts', { hashtag_id: SV.dtkTag('tiktok', input.indexOf('tag:') === 0 ? input.slice(4) : 'fyp'), cursor: cur, count: 20 });
    return Response.success(SV.dtkItems(j).map(SV.dtkItem), SV.dtkNext(j));
  }
  if (input.indexOf('user:') === 0) {
    try { d = SV.tw('/api/user/posts', { unique_id: input.slice(5), count: 20, cursor: page && page !== '1' ? page : 0 }); }
    catch (e) { if (e.svCode === 'CF') throw SV.fail('tikwm.com đang chặn danh sách video theo tài khoản (Cloudflare). Xem video của @' + input.slice(5) + ' cần máy chủ Douyin_TikTok_Download_API (DTK_SERVER) trong cài đặt nguồn.', 'CF'); throw e; }
    SV.twRemember(d.videos || []);
    return Response.success((d.videos || []).map(SV.twItem), d.hasMore ? String(d.cursor) : '');
  }
  if (input.indexOf('tag:') === 0) return SV.twTag(input.slice(4), n);
  // region feed = a fresh random batch per call ("_p" keeps every page a different URL). When tikwm is down the
  // last good batch (≤ 12 h old) is shown instead of an error, then the #fyp hashtag.
  var ck = 'tw_feed_' + SV.region();
  try {
    d = SV.tw('/api/feed/list', { region: SV.region(), count: 20, _p: n > 1 ? n : '' });
    if (d && d.length) { SV.twRemember(d); if (n === 1) SV.cset(ck, d.map(SV.twPack)); return Response.success(d.map(SV.twItem), n < 30 ? String(n + 1) : ''); }
  } catch (e3) {
    var old = n === 1 ? SV.cget(ck, 12 * 3600000) : null;
    if (old && old.length) return Response.success(old.map(SV.twUnpack).map(SV.twItem), '2');
    if (e3.svCode === 'CF') throw e3;
    try { return SV.twTag('fyp', n); } catch (e4) { throw e3; }
  }
  return SV.twTag('fyp', n);
};
// clip metadata without tikwm: TikTok's own oEmbed endpoint (public, unsigned)
SV.ttOembed = function (url) {
  try {
    var r = fetch('https://www.tiktok.com/oembed?url=' + encodeURIComponent(url), { headers: { 'Accept': 'application/json' } });
    if (!r.ok) return null; var j = r.json(); if (!j || !(j.title || j.author_name)) return null;
    return { title: j.title || '', cover: j.thumbnail_url || '', author: { nickname: j.author_name || '', unique_id: j.author_unique_id || '' } };
  } catch (e) { return null; }
};
