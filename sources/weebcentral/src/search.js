load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(key, page, filters) {
  if (C.isUrl(key)) return X.search(key, page);
  var q = String(key || '').trim();
  if (!q && filters && (filters.genres || filters.status || filters.sort)) {
    var u = BASE_URL + "/search/data?text=&order=Descending&official=Any&anime=Any&adult=Any&display_mode=Full+Display";
    if (filters.genres && filters.genres.length) {
      var g = String(filters.genres[0]);
      if (C.isUrl(g)) return X.search(g, page);
      u += "&included_tag=" + encodeURIComponent(g);
    }
    if (filters.status === 'ongoing') u += "&included_status=Ongoing";
    else if (filters.status === 'completed') u += "&included_status=Complete";
    u += "&sort=" + (filters.sort === 'views' || filters.sort === 'popular' ? 'Popularity' : 'Latest+Updates');
    return X.search(u, page);
  }
  return X.search(key, page);
}
