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

  // Extract AnimeVN player server (only if URL is complete)
  var mAhs = /case\s*['"]AHS['"][\s\S]*?src=["']([^"']+)["']/i.exec(html);
  if (mAhs && mAhs[1]) {
    var ahsUrl = mAhs[1].trim();
    if (ahsUrl && !/[?=\/]$/.test(ahsUrl)) {
      servers.push({ title: 'Server AnimeVN', data: ahsUrl });
    }
  }

  // Extract backup servers (FEM / DAI)
  var backups = [['FEM', 'Server Dự phòng'], ['DAI', 'Server Dailymotion']];
  for (var b = 0; b < backups.length; b++) {
    var reB = new RegExp("case\\s*['\"]" + backups[b][0] + "['\"][\\s\\S]*?src=[\"']([^\"']+)[\"']", 'i');
    var mB = reB.exec(html);
    if (mB && mB[1]) {
      var bUrl = mB[1].trim();
      if (bUrl && !/\/embed\/?$/i.test(bUrl) && !/[?=\/]$/.test(bUrl)) {
        servers.push({ title: backups[b][1], data: bUrl });
      }
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
