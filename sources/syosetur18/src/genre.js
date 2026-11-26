load('config.js');
function execute() {
  var list = [
    ["ノクターンノベルズ (男性向け)", "https://noc.syosetu.com/search/search/?word=&nocgenre=1"],
    ["ムーンライトノベルズ (女性向け)", "https://noc.syosetu.com/search/search/?word=&nocgenre=2"],
    ["ムーンライトノベルズ (BL)", "https://noc.syosetu.com/search/search/?word=&nocgenre=3"],
    ["ミッドナイトノベルズ", "https://noc.syosetu.com/search/search/?word=&nocgenre=4"]
  ];
  return Response.success(list.map(function (g) {
    return { title: g[0], input: g[1], script: "search.js" };
  }));
}
