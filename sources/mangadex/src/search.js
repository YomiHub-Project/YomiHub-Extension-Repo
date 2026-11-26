load("config.js");
function execute(key, page, filters) {
  var p = parseInt(page || "1", 10); if (isNaN(p) || p < 1) p = 1;
  var limit = 24, offset = (p - 1) * limit;
  var params = ["limit=" + limit, "offset=" + offset, "includes[]=cover_art"];
  var q = String(key || "").trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q)) {
    params.push("includedTags[]=" + q);
  } else if (q.indexOf("/title/") >= 0 || /^https?:\/\//i.test(q)) {
    var id = mdIdFromUrl(q);
    if (id) params.push("ids[]=" + id);
  } else if (q) {
    params.push("title=" + encodeURIComponent(q));
  }
  var f = filters || {};
  var sortMap = {
    latest: "order[latestUploadedChapter]=desc",
    popular: "order[followedCount]=desc",
    views: "order[followedCount]=desc",
    rating: "order[rating]=desc",
    az: "order[title]=asc"
  };
  if (f.sort && sortMap[f.sort]) params.push(sortMap[f.sort]);
  else params.push("order[followedCount]=desc");

  if (f.status === "ongoing" || f.status === "completed" || f.status === "hiatus") {
    params.push("status[]=" + f.status);
  }
  if (f.content_rating === "sfw") {
    params.push("contentRating[]=safe", "contentRating[]=suggestive");
  } else if (f.content_rating === "nsfw") {
    params.push("contentRating[]=erotica", "contentRating[]=pornographic");
  } else {
    params.push("contentRating[]=safe", "contentRating[]=suggestive", "contentRating[]=erotica");
  }
  var langMap = { jp: "ja", kr: "ko", cn: "zh", vn: "vi", us: "en" };
  if (f.country && langMap[f.country]) params.push("originalLanguage[]=" + langMap[f.country]);
  if (f.year && /^\d{4}$/.test(String(f.year))) params.push("year=" + f.year);
  if (Array.isArray(f.genres)) {
    for (var i = 0; i < f.genres.length; i++) {
      if (/^[0-9a-f-]{36}$/i.test(f.genres[i])) params.push("includedTags[]=" + f.genres[i]);
    }
  }
  var j = mdFetch("/manga?" + params.join("&"));
  var list = (j && j.data) ? j.data.map(mdToItem) : [];
  var hasMore = j && typeof j.total === "number" ? (offset + list.length < j.total) : (list.length >= limit);
  return Response.success(list, hasMore ? String(p + 1) : "");
}
