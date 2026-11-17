load('config.js');
load('vtv.js');

function execute(url) {
  var slug = VTV.slug(url);
  var catalogs = VTV.getChannels();
  var progs = VTV.getCurrentPrograms();
  var target = null;

  for (var i = 0; i < catalogs.length; i++) {
    var chs = catalogs[i].channels || [];
    for (var j = 0; j < chs.length; j++) {
      if (chs[j] && (chs[j].channelSlug === slug || chs[j].id === slug)) {
        target = chs[j];
        break;
      }
    }
    if (target) break;
  }

  var name = target ? (target.name || slug.toUpperCase()) : slug.toUpperCase();
  var cover = target ? (target.thumbnail || target.logo || '') : '';
  var curProg = target ? (progs[target.id] || progs[target.channelSlug] || {}) : {};
  var desc = curProg.title ? (curProg.title + (curProg.description ? '\n' + curProg.description : '')) : 'Kênh truyền hình trực tuyến VTV Go';

  return Response.success({
    name: name,
    cover: cover,
    author: 'VTV Digital',
    description: desc,
    detail: '🔴 Trực tiếp · ' + (curProg.title || 'Chương trình phát sóng'),
    ongoing: true,
    genres: ['Truyền hình', 'Trực tiếp', 'Thời sự'],
    url: BASE_URL + '/channel/' + slug
  });
}
