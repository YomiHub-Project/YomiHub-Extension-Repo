load('config.js');
function execute() {
  var t = [["玄幻", "xuanhuan"], ["武侠", "wuxia"], ["都市", "dushi"], ["历史", "lishi"], ["网游", "wangyou"], ["科幻", "kehuan"], ["女生", "mm"]];
  return Response.success(t.map(function (x) { return { title: x[0], input: x[1], script: 'browse.js' }; }));
}
