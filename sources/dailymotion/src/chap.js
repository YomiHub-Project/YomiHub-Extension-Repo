load('config.js');
load('dm.js');
function execute(url) {
  var id = DM.id(url);
  if (!id) return Response.error('Liên kết Dailymotion không hợp lệ');
  return Response.success([{ title: 'Dailymotion', data: id }]);
}
