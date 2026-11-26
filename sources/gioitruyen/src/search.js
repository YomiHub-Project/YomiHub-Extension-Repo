load('config.js');
function execute(key, page, filters) {
  var k = String(key || '').trim();
  var p = parseInt(page || "1", 10) || 1;
  if (/^https?:\/\//i.test(k) && k.indexOf('/api/v1/') >= 0) {
    var path = k.replace(/^https?:\/\/[^\/]+/i, '').replace(/^\/api\/v1/, '');
    var j1 = api(path + (path.indexOf('?') >= 0 ? '&' : '?') + "page=" + p + "&limit=20");
    var arr1 = Array.isArray(j1) ? j1 : (j1 && j1.items) || [];
    var list1 = arr1.map(function (x) { return story(x.story || x); });
    return Response.success(list1, list1.length >= 20 ? String(p + 1) : null);
  }
  if (!k && filters && ((filters.genres && filters.genres.length) || filters.sort || filters.status)) {
    if (filters.genres && filters.genres.length) {
      var g0 = String(filters.genres[0]);
      var m = /\/categories\/([^\/]+)\/stories/.exec(g0);
      var slug = m ? m[1] : encodeURIComponent(g0);
      var j2 = api("/categories/" + slug + "/stories?page=" + p + "&limit=20");
      var arr2 = Array.isArray(j2) ? j2 : (j2 && j2.items) || [];
      var list2 = arr2.map(function (x) { return story(x.story || x); });
      return Response.success(list2, list2.length >= 20 ? String(p + 1) : null);
    }
    var sort = filters.sort === 'views' || filters.sort === 'popular' ? 'views' : 'latest';
    var j3 = api("/stories/browse?page=" + p + "&size=20&sort=" + sort);
    var list3 = (j3.items || []).map(story);
    return Response.success(list3, p < (j3.totalPages || 0) ? String(p + 1) : null);
  }
  var j = api("/search?q=" + encodeURIComponent(k));
  var list = (j.items || []).map(function (x) { return story(x.story || x); });
  return Response.success(list, null);
}
