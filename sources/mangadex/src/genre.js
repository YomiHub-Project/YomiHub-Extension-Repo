load("config.js");
function execute() {
  var j = mdFetch("/manga/tag");
  var out = [];
  var arr = (j && j.data) ? j.data : [];
  for (var i = 0; i < arr.length; i++) {
    var t = arr[i];
    var title = mdTitle(t.attributes && t.attributes.name);
    if (title && t.id) out.push({ title: title, input: t.id, script: "browse.js" });
  }
  out.sort(function (a, b) { return a.title < b.title ? -1 : a.title > b.title ? 1 : 0; });
  return Response.success(out);
}
