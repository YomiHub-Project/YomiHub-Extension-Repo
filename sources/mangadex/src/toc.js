load("config.js");
function execute(url) {
  var id = mdIdFromUrl(url);
  if (!id) return Response.error("Không tìm thấy Manga ID");
  var q = "/manga/" + id + "/feed?limit=500&includeExternalUrl=0&order[volume]=asc&order[chapter]=asc&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic";
  var j = mdFetch(q + "&translatedLanguage[]=vi&translatedLanguage[]=en");
  var rows = (j && j.data) ? j.data : [];
  if (!rows.length) {
    j = mdFetch(q);
    rows = (j && j.data) ? j.data : [];
  }
  var out = [];
  for (var i = 0; i < rows.length; i++) {
    var c = rows[i], attr = c.attributes || {};
    if (attr.externalUrl || !attr.pages) continue;
    var ch = attr.chapter ? ("Ch. " + attr.chapter) : "Oneshot";
    var name = ch + (attr.title ? (": " + attr.title) : "") + (attr.translatedLanguage ? (" [" + attr.translatedLanguage + "]") : "");
    out.push({ name: name, url: BASE_URL + "/chapter/" + c.id, host: BASE_URL });
  }
  return Response.success(out);
}
