load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var u = String(url || '').trim();
  var res = fetchWithRetry(u);
  var html = res.text();

  var servers = [];

  // Extract Hydrax server
  var mHy = /case\s*['"]HY['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
  if (mHy && mHy[1]) {
    var hyUrl = mHy[1].trim();
    if (/[?&]v=[a-zA-Z0-9_\-]+/i.test(hyUrl)) {
      servers.push({ title: 'Server Hydrax', data: hyUrl });
    }
  }

  // Extract AnimeVN player server
  var mAhs = /case\s*['"]AHS['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
  if (mAhs && mAhs[1]) {
    servers.push({ title: 'Server AnimeVN', data: mAhs[1].trim() });
  }

  // Extract backup server
  var mFem = /case\s*['"]FEM['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
  if (mFem && mFem[1]) {
    var femUrl = mFem[1].trim();
    if (femUrl !== 'https://hh3dvietsub.com/embed/' && femUrl !== 'https://hh3dvietsub.com/embed') {
      servers.push({ title: 'Server Dự phòng', data: femUrl });
    }
  }

  // If no servers matched via script, search iframes in DOM
  if (servers.length === 0) {
    var doc = res.html();
    var ifrs = doc.select('iframe[src]');
    for (var i = 0; i < ifrs.size(); i++) {
      var src = (ifrs.get(i).attr('src') || '').trim();
      if (src && src.indexOf('about:blank') === -1) {
        servers.push({ title: 'Server ' + (i + 1), data: src });
      }
    }
  }

  if (servers.length === 0) {
    servers.push({ title: 'Server Mặc định', data: u });
  }

  return Response.success(servers);
}
