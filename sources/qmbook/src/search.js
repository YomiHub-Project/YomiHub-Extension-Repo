load('config.js');
function execute(key, page, filters) {
  var q = String(key || '').trim();
  if (!q && filters && filters.genres && filters.genres.length) {
    var sort = String(filters.genres[0]);
    var js = api("/api/sort?sort=" + encodeURIComponent(sort));
    return Response.success((js.data || []).map(book), null);
  }
  var j = api("/api/search?q=" + encodeURIComponent(q));
  return Response.success((j.data || []).map(book), null);
}
