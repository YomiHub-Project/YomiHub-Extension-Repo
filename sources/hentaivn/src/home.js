load('config.js');
function execute() {
  var t = [];
  for (var k in G.tabs) t.push({ title: k, input: k, script: "gen.js" });
  return Response.success(t);
}
