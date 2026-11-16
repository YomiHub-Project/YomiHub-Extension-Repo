// 0.0.6: Dailymotion through the public REST API (api.dailymotion.com) for lists/details
// and the player metadata endpoint for the HLS manifest. No account, no signature.
var DM = {
  API: 'https://api.dailymotion.com',
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  F: 'id,title,thumbnail_480_url,owner.screenname,duration,views_total,mode,onair',
  get: function (url) {
    var r = fetch(url, { headers: { 'User-Agent': DM.UA, 'Accept': 'application/json' } });
    if (!r.ok) throw new Error('Dailymotion HTTP ' + r.status);
    return r.json();
  },
  id: function (u) { var m = /(?:dailymotion\.com\/(?:embed\/)?video\/|dai\.ly\/)([a-z0-9]+)/i.exec(String(u)); return m ? m[1] : ''; },
  dur: function (s) { s = parseInt(s, 10) || 0; var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s % 60).slice(-2); },
  items: function (j) {
    var out = [];
    ((j && j.list) || []).forEach(function (v) {
      if (!v.id) return;
      out.push({ name: v.title || v.id, link: BASE_URL + '/video/' + v.id, cover: v['thumbnail_480_url'] || '', description: (v.onair ? '🔴 Trực tiếp · ' : DM.dur(v.duration) + ' · ') + (v['owner.screenname'] || '') + (v.views_total != null ? ' · ' + v.views_total + ' lượt xem' : ''), host: BASE_URL });
    });
    return Response.success(out, j && j.has_more ? String((parseInt(j.page, 10) || 1) + 1) : '');
  },
  // input: query string such as "sort=trending&languages=vi" or "channel=music"; "q=<keyword>" for search
  list: function (input, page) {
    var q = String(input || 'sort=trending'), p = parseInt(page, 10) || 1, path = '/videos';
    var m = /(?:^|&)channel=([a-z0-9_-]+)/.exec(q);
    if (m) { path = '/channel/' + m[1] + '/videos'; q = q.replace(/(?:^|&)channel=[a-z0-9_-]+/, '').replace(/^&/, ''); }
    return DM.items(DM.get(DM.API + path + '?fields=' + DM.F + '&limit=30&page=' + p + (q ? '&' + q : '')));
  }
};
