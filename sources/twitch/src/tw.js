// 0.0.6: Twitch through its public GQL endpoint (the one the web player uses) with the web Client-ID.
// No account and no request signing. Links are canonical: https://www.twitch.tv/<login> (channel, live)
// and https://www.twitch.tv/videos/<id> (VOD).
var TW = {
  GQL: 'https://gql.twitch.tv/gql',
  CID: 'kimne78kx3ncx6brgo4mv6wki5h1ko',
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  q: function (query) {
    var r = fetch(TW.GQL, { method: 'POST', headers: { 'Client-ID': TW.CID, 'Content-Type': 'text/plain;charset=UTF-8', 'User-Agent': TW.UA }, body: JSON.stringify({ query: query }) });
    if (!r.ok) throw new Error('Twitch GQL HTTP ' + r.status);
    var j = r.json();
    if (!j || !j.data) throw new Error('Twitch GQL: ' + ((j && j.errors && j.errors[0] && j.errors[0].message) || 'không có dữ liệu'));
    return j.data;
  },
  s: function (v) { return JSON.stringify(String(v == null ? '' : v)); },
  lang: function () { var l = ''; try { l = String(LANG || ''); } catch (e) { } return l.trim().toUpperCase().replace(/[^A-Z_]/g, ''); },
  after: function (page) { return page && page !== '1' ? ',after:' + TW.s(page) : ''; },
  login: function (url) { var m = /twitch\.tv\/(?!videos\/|directory\/)([A-Za-z0-9_]{2,30})/.exec(String(url)); return m ? m[1].toLowerCase() : ''; },
  vod: function (url) { var m = /twitch\.tv\/videos\/(\d+)/.exec(String(url)); return m ? m[1] : ''; },
  dur: function (s) { s = parseInt(s, 10) || 0; var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s % 60).slice(-2); },
  STREAM: '{edges{cursor node{title viewersCount broadcaster{login displayName} game{displayName} previewImageURL(width:640,height:360)}}pageInfo{hasNextPage}}',
  // stream connection -> list items + cursor of the last edge
  streams: function (conn) {
    var items = [], last = '';
    ((conn && conn.edges) || []).forEach(function (e) {
      var n = e.node; if (!n || !n.broadcaster) return; last = e.cursor || last;
      items.push({ name: n.broadcaster.displayName + ' — ' + (n.title || 'Trực tiếp'), link: BASE_URL + '/' + n.broadcaster.login, cover: n.previewImageURL || '', description: '🔴 ' + (n.viewersCount || 0) + ' người xem' + (n.game ? ' · ' + n.game.displayName : ''), host: BASE_URL });
    });
    return Response.success(items, conn && conn.pageInfo && conn.pageInfo.hasNextPage && last ? last : '');
  },
  // input: "live" | "lang:VI" | "game:<name>"
  list: function (input, page) {
    input = String(input || 'live'); var a = TW.after(page);
    if (input.indexOf('game:') === 0) { var g = TW.q('query{game(name:' + TW.s(input.slice(5)) + '){streams(first:30' + a + ')' + TW.STREAM + '}}').game; return TW.streams(g && g.streams); }
    var l = input.indexOf('lang:') === 0 ? input.slice(5).toUpperCase().replace(/[^A-Z_]/g, '') : '';
    return TW.streams(TW.q('query{streams(first:30' + (l ? ',languages:[' + l + ']' : '') + a + ')' + TW.STREAM + '}').streams);
  },
  // usher (HLS) URL; the "p" cache buster is fixed so that recorded test runs can be replayed
  usher: function (path, tok) {
    if (!tok || !tok.value) throw new Error('Twitch không cấp quyền phát (video giới hạn người đăng ký hoặc kênh không tồn tại)');
    return 'https://usher.ttvnw.net/' + path + '.m3u8?allow_source=true&allow_audio_only=true&playlist_include_framerate=true&player=twitchweb&p=1234567&supported_codecs=h264&sig=' + tok.signature + '&token=' + encodeURIComponent(tok.value);
  }
};
