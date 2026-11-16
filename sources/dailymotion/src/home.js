load('config.js');
load('dm.js');
function execute() {
  var t = [['Thịnh hành', 'sort=trending'], ['Tiếng Việt', 'sort=trending&languages=vi'], ['Mới nhất', 'sort=recent'], ['Đang trực tiếp', 'live_onair=1&sort=visited-hour'], ['Âm nhạc', 'channel=music&sort=trending'], ['Tin tức', 'channel=news&sort=trending'], ['Thể thao', 'channel=sport&sort=trending'], ['Trò chơi', 'channel=videogames&sort=trending']];
  return Response.success(t.map(function (x) { return { title: x[0], input: x[1], script: 'gen.js' }; }));
}
