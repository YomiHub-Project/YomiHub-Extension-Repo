load('config.js');
load('vtv.js');

function execute(key, page) {
  var kLower = String(key || '').trim().toLowerCase();
  var catalogs = VTV.getChannels();
  var progs = VTV.getCurrentPrograms();
  var items = [];
  var seen = {};

  for (var i = 0; i < catalogs.length; i++) {
    var chs = catalogs[i].channels || [];
    for (var j = 0; j < chs.length; j++) {
      var c = chs[j];
      if (!c || !c.channelSlug || seen[c.channelSlug]) continue;
      var nameLower = (c.name || '').toLowerCase();
      var slugLower = (c.channelSlug || '').toLowerCase();
      if (!kLower || nameLower.indexOf(kLower) !== -1 || slugLower.indexOf(kLower) !== -1) {
        seen[c.channelSlug] = true;
        var curProg = progs[c.id] || progs[c.channelSlug] || {};
        var desc = curProg.title ? ('🔴 ' + curProg.title + (curProg.description ? ' - ' + curProg.description : '')) : '🔴 Đang phát sóng trực tiếp';
        items.push({
          name: c.name || c.channelSlug.toUpperCase(),
          link: BASE_URL + '/channel/' + c.channelSlug,
          cover: c.thumbnail || c.logo || '',
          description: desc,
          host: BASE_URL
        });
      }
    }
  }
  return Response.success(items);
}
