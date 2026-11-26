load("config.js");
function execute(input, page) {
  var p = parseInt(page || "1", 10); if (isNaN(p) || p < 1) p = 1;
  var limit = 24, offset = (p - 1) * limit;
  var q = String(input || "order[followedCount]=desc");
  var path = "/manga?limit=" + limit + "&offset=" + offset + "&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica";
  if (q.indexOf("/manga") === 0) path = q + (q.indexOf("?") >= 0 ? "&" : "?") + "limit=" + limit + "&offset=" + offset + "&includes[]=cover_art";
  else if (/^[0-9a-f-]{36}$/i.test(q)) path += "&includedTags[]=" + q + "&order[followedCount]=desc";
  else path += "&" + q;
  var j = mdFetch(path);
  var list = (j && j.data) ? j.data.map(mdToItem) : [];
  var hasMore = j && typeof j.total === "number" ? (offset + list.length < j.total) : (list.length >= limit);
  return Response.success(list, hasMore ? String(p + 1) : "");
}
