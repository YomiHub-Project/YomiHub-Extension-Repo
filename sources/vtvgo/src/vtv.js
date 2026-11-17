var VTV = {
  API: 'https://api.vtvdigital.org',
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  getChannels: function () {
    var res = fetch(VTV.API + '/display/v21.0/catalogs/with-channels', {
      headers: {
        'User-Agent': VTV.UA,
        'Referer': BASE_URL + '/',
        'Origin': BASE_URL
      }
    });
    if (!res.ok) throw new Error('VTV Go Catalogs HTTP ' + res.status);
    var j = res.json();
    return (j && j.data) || [];
  },
  getCurrentPrograms: function () {
    try {
      var res = fetch(VTV.API + '/display/v21.0/channels/current-programs', {
        headers: {
          'User-Agent': VTV.UA,
          'Referer': BASE_URL + '/',
          'Origin': BASE_URL
        }
      });
      if (res.ok) {
        var j = res.json();
        return (j && j.data) || {};
      }
    } catch (e) {}
    return {};
  },
  slug: function (u) {
    var m = /(?:channel\/|channels\/|xem\/)?([a-z0-9_-]+)$/i.exec(String(u || '').trim().replace(/\/+$/, ''));
    return m ? m[1].toLowerCase() : '';
  },
  list: function (categoryKey) {
    var catalogs = VTV.getChannels();
    var progs = VTV.getCurrentPrograms();
    var items = [];
    for (var i = 0; i < catalogs.length; i++) {
      var cat = catalogs[i];
      var nameLower = (cat.name || '').toLowerCase();
      if (categoryKey === 'vtv' && nameLower.indexOf('kênh vtv') === -1) continue;
      if (categoryKey === 'local' && nameLower.indexOf('địa phương') === -1 && nameLower.indexOf('thiết yếu') === -1) continue;
      if (categoryKey === 'vtvcab' && nameLower.indexOf('vtvcab') === -1 && nameLower.indexOf('thể thao') === -1 && nameLower.indexOf('sport') === -1) continue;
      if (categoryKey === 'sctv' && nameLower.indexOf('sctv') === -1) continue;
      if (categoryKey === 'intl' && nameLower.indexOf('quốc tế') === -1 && nameLower.indexOf('tin tức') === -1 && nameLower.indexOf('giải trí') === -1) continue;
      var chs = cat.channels || [];
      for (var k = 0; k < chs.length; k++) {
        var c = chs[k];
        if (!c || !c.channelSlug) continue;
        var curProg = progs[c.id] || progs[c.channelSlug] || {};
        var desc = curProg.title ? '🔴 ' + curProg.title + (curProg.description ? ' - ' + curProg.description : '') : '🔴 Đang phát sóng trực tiếp';
        items.push({
          name: c.name || c.channelSlug.toUpperCase(),
          link: BASE_URL + '/channel/' + c.channelSlug,
          cover: c.thumbnail || c.logo || '',
          description: desc,
          host: BASE_URL
        });
      }
    }
    return Response.success(items);
  }
};
