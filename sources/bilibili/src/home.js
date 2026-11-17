load('config.js');

function execute() {
  var t = [
    ['Thịnh hành', 'trending'],
    ['Phổ biến', 'popular']
  ];
  return Response.success(t.map(function (x) {
    return { title: x[0], input: x[1], script: 'gen.js' };
  }));
}
