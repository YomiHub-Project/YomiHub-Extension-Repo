load('config.js');

function execute() {
  var t = [
    ['Kênh VTV', 'vtv'],
    ['Kênh địa phương', 'local'],
    ['VTVcab & Thể thao', 'vtvcab'],
    ['Kênh SCTV', 'sctv'],
    ['Quốc tế & Giải trí', 'intl'],
    ['Tất cả kênh', 'all']
  ];
  return Response.success(t.map(function (x) {
    return { title: x[0], input: x[1], script: 'gen.js' };
  }));
}
