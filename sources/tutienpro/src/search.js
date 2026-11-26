load('config.js');
load('lib_common.js');
function execute(key, page, filters) {
  if (C.isUrl(key)) return ttList(String(key).replace(BASE_URL, ''), page);
  var q = String(key || '').trim();
  if (!q && filters && ((filters.genres && filters.genres.length) || filters.status)) {
    var p = '/story/stories/filter/?page_size=24';
    if (filters.genres && filters.genres.length) {
      var slugs = [];
      for (var i = 0; i < filters.genres.length; i++) {
        var m = /[?&]genres=([^&]+)/.exec(String(filters.genres[i]));
        slugs.push(m ? m[1] : encodeURIComponent(String(filters.genres[i])));
      }
      p += '&genres=' + slugs.join(',');
    }
    if (filters.status === 'completed') p += '&status=completed';
    else if (filters.status === 'ongoing') p += '&status=ongoing';
    return ttList(p, page);
  }
  return ttList('/story/user/search/?q=' + C.enc(key) + '&page_size=10', page);
}
