load('config.js');
function execute() {
  var cats = [
    ["Doujinshi", 1021],
    ["Manga", 1019],
    ["Artist CG", 1015],
    ["Game CG", 1007],
    ["Western", 511],
    ["Non-H", 767],
    ["Image Set", 991],
    ["Cosplay", 959],
    ["Asian Porn", 895],
    ["Misc", 1022]
  ];
  return Response.success(cats.map(function (c) {
    return { title: c[0], input: BASE_URL + "/?f_cats=" + c[1], script: "search.js" };
  }));
}
