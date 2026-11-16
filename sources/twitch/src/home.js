load('config.js');
load('tw.js');
function execute() {
  var t = [], l = TW.lang();
  if (l) t.push({ title: 'Trực tiếp (' + l + ')', input: 'lang:' + l, script: 'gen.js' });
  t.push({ title: 'Đang trực tiếp', input: 'live', script: 'gen.js' });
  if (l !== 'VI') t.push({ title: 'Tiếng Việt', input: 'lang:VI', script: 'gen.js' });
  [['Trò chuyện', 'Just Chatting'], ['Liên Minh Huyền Thoại', 'League of Legends'], ['VALORANT', 'VALORANT'], ['GTA V', 'Grand Theft Auto V'], ['Âm nhạc', 'Music'], ['Thể thao', 'Sports']]
    .forEach(function (x) { t.push({ title: x[0], input: 'game:' + x[1], script: 'gen.js' }); });
  return Response.success(t);
}
