load('config.js');
load('dm.js');
function execute(url) {
  var id = DM.id(url);
  if (!id) return Response.error('Liên kết Dailymotion không hợp lệ');
  var v = DM.get(DM.API + '/video/' + id + '?fields=title,description,thumbnail_720_url,owner.screenname,duration,views_total,created_time,tags,channel.name,onair');
  var d = String(v.description || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  return Response.success({ name: v.title || id, cover: v['thumbnail_720_url'] || '', author: v['owner.screenname'] || '', description: d, detail: (v.onair ? 'Trực tiếp · ' : DM.dur(v.duration) + ' · ') + (v.views_total || 0) + ' lượt xem' + (v.created_time ? ' · ' + new Date(v.created_time * 1000).toISOString().slice(0, 10) : ''), ongoing: !!v.onair, genres: (v.tags || []).slice(0, 8).map(function (t) { return { title: t, input: 'search=' + encodeURIComponent(t) + '&sort=relevance', script: 'gen.js' }; }), host: BASE_URL });
}
