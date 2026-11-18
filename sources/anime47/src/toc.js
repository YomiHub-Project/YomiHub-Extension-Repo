load('config.js');
load('lib_common.js');

function execute(url) {
  var chapters = [];
  var epCount = 1;
  var id = '';
  var slug = 'anime';

  var mHash = /#meta=([^&]+)/.exec(url);
  if (mHash) {
    try {
      var meta = JSON.parse(decodeURIComponent(mHash[1]));
      epCount = parseInt(meta.ep, 10) || 1;
      id = meta.id || '';
    } catch (e) {}
  }

  var mId = /m([0-9]+)\.html/i.exec(url) || /\/([0-9]+)(?:\/|\.html|$)/.exec(url);
  if (!id && mId) id = mId[1];

  var mSlug = /\/phim\/([^\/?#]+)/.exec(url);
  if (mSlug) slug = mSlug[1];

  // Try API /anime/{id}/episodes if available
  if (id) {
    try {
      var d = requestApiJson('/anime/' + id + '/episodes');
      var list = d.data || d.episodes || [];
      if (list && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          chapters.push({
            name: item.name || ('Tập ' + (i + 1)),
            url: BASE_URL + '/xem-phim-' + slug + '-ep-' + (item.episode_number || (i + 1)) + '/' + id + '-' + (item.episode_number || (i + 1)) + '.html'
          });
        }
        return Response.success(chapters);
      }
    } catch (e) {}
  }

  // Generate episode list based on epCount
  for (var i = 1; i <= Math.max(1, epCount); i++) {
    chapters.push({
      name: 'Tập ' + i,
      url: BASE_URL + '/xem-phim-' + slug + '-ep-' + i + '/' + (id || '0') + '-' + i + '.html'
    });
  }

  return Response.success(chapters);
}
