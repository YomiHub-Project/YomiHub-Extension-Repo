load('config.js');
load('bili.js');

function execute(url) {
  var epId = BILI.epId(url);
  if (!epId) return Response.error('Không tìm thấy tập phim');
  return Response.success([{ title: 'Bilibili Server', data: epId }]);
}
