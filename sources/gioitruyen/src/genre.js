load('config.js');
function execute() {
  var j = api("/categories");
  var groups = (j && j.groups) || [];
  var out = [], seen = {};
  for (var gi = 0; gi < groups.length; gi++) {
    var cats = (groups[gi] && groups[gi].categories) || [];
    for (var i = 0; i < cats.length; i++) {
      var c = cats[i];
      if (!c || !c.slug || !c.name || seen[c.slug]) continue;
      seen[c.slug] = 1;
      out.push({ title: c.name, input: BASE_URL + "/api/v1/categories/" + encodeURIComponent(c.slug) + "/stories", script: "search.js" });
    }
  }
  return Response.success(out);
}
