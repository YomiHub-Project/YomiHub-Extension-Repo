load('config.js');
function execute(input) {
  var sort = input || "index";
  var j = api("/api/sort?sort=" + encodeURIComponent(sort));
  return Response.success((j.data || []).map(book), null);
}
