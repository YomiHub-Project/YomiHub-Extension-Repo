load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(key, page, filters) {
  if (C.isUrl(key)) return X.search(key, page);
  var q = String(key || '').trim();
  if (!q && filters && filters.genres && filters.genres.length) {
    return X.search(String(filters.genres[0]), page);
  }
  return X.search(key, page);
}
