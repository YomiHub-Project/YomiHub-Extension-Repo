load('config.js');
load('dm.js');
function execute(key, page) {
  key = String(key || '').trim();
  var id = DM.id(key);
  if (id) return Response.success([{ name: 'Dailymotion ' + id, link: BASE_URL + '/video/' + id, cover: '', description: '', host: BASE_URL }], '');
  return DM.list('search=' + encodeURIComponent(key) + '&sort=relevance', page);
}
