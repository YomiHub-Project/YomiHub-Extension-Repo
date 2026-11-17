var BILI = {
  API: 'https://api.bilibili.tv',
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  get: function (path, params) {
    var qs = '?s_locale=vi_VN&platform=web';
    if (params) {
      for (var k in params) {
        if (params[k] != null && params[k] !== '') {
          qs += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
        }
      }
    }
    var res = fetch(BILI.API + path + qs, {
      headers: {
        'User-Agent': BILI.UA,
        'Referer': BASE_URL + '/',
        'Origin': BASE_URL
      }
    });
    if (!res.ok) throw new Error('Bilibili API HTTP ' + res.status);
    return res.json();
  },
  id: function (u) {
    var m = /(?:play|detail|video)\/(\d+)/.exec(String(u || ''));
    return m ? m[1] : '';
  },
  epId: function (u) {
    var m = /(?:play|detail)\/\d+\/(\d+)/.exec(String(u || ''));
    if (m) return m[1];
    var m2 = /(?:play|detail|video)\/(\d+)/.exec(String(u || ''));
    return m2 ? m2[1] : '';
  },
  list: function (input, page) {
    var path = '/intl/gateway/web/v2/home/ogv/trending';
    if (input === 'popular') path = '/intl/gateway/web/v2/home/popular';
    var j = BILI.get(path);
    var items = [];
    var cards = j && j.data && j.data.cards || [];
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      if (!c || !c.season_id) continue;
      items.push({
        name: c.title || 'Anime',
        link: BASE_URL + '/vi/play/' + c.season_id,
        cover: c.cover || '',
        description: (c.index_show ? c.index_show + ' · ' : '') + (c.view || ''),
        host: BASE_URL
      });
    }
    return Response.success(items);
  }
};
