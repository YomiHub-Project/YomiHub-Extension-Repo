load("config.js");
function execute(url) {
  var id = mdIdFromUrl(url);
  if (!id) return Response.error("Không tìm thấy Manga ID");
  var j = mdFetch("/manga/" + id + "?includes[]=cover_art&includes[]=author&includes[]=artist");
  var m = j && j.data;
  if (!m) return Response.error("Không tìm thấy truyện");
  var attr = m.attributes || {};
  var tags = (attr.tags || []).map(function (t) {
    return { title: mdTitle(t.attributes && t.attributes.name), input: t.id, script: "browse.js" };
  }).filter(function (g) { return g.title; });
  var status = attr.status || "ongoing";
  return Response.success({
    name: mdTitle(attr.title) || id,
    cover: mdCover(m),
    author: mdAuthor(m),
    description: mdTitle(attr.description),
    detail: "Tình trạng: " + status + (attr.year ? (" · Năm: " + attr.year) : ""),
    ongoing: status !== "completed" && status !== "cancelled",
    genres: tags,
    host: BASE_URL
  });
}
