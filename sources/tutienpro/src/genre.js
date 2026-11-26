load('config.js');
load('lib_common.js');
function execute() {
  var d = ttJson('/story/genres/');
  var arr = Array.isArray(d) ? d : (d && d.results) || [];
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    var g = arr[i];
    if (!g || !g.slug || !g.name) continue;
    out.push({ title: g.name, input: BASE_URL + '/story/stories/filter/?page_size=24&genres=' + encodeURIComponent(g.slug), script: 'search.js' });
  }
  return Response.success(out);
}
