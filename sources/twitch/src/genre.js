load('config.js');
load('tw.js');
// categories = the games / topics with the most viewers right now
function execute() {
  var g = TW.q('query{games(first:60){edges{node{name displayName}}}}').games;
  return Response.success(((g && g.edges) || []).map(function (e) { return { title: e.node.displayName || e.node.name, input: 'game:' + e.node.name, script: 'gen.js' }; }));
}
