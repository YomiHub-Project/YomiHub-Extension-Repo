load('config.js');
load('lib_common.js');

function execute(data) {
  if (/\.(m3u8|mp4)(\?|$)/i.test(data)) {
    return Response.success({
      type: 'native',
      data: data,
      headers: {
        'Referer': BASE_URL + '/',
        'User-Agent': UA
      }
    });
  }

  var res = C.get(data, {
    headers: {
      'User-Agent': UA,
      'Referer': BASE_URL + '/'
    }
  });

  if (!res || !res.ok) {
    var relPath = String(data || '').replace(/^https?:\/\/[^\/]+/i, '');
    if (typeof BACKUP_DOMAINS !== 'undefined') {
      for (var bi = 0; bi < BACKUP_DOMAINS.length; bi++) {
        var bUrl = BACKUP_DOMAINS[bi] + relPath;
        try {
          var bRes = C.get(bUrl, { headers: { 'User-Agent': UA, 'Referer': BACKUP_DOMAINS[bi] + '/' } });
          if (bRes && bRes.ok) { res = bRes; data = bUrl; break; }
        } catch (e) {}
      }
    }
  }

  if (!res || !res.ok) {
    return Response.error('SexVietTop: không lấy được nội dung trang video.');
  }

  var pageUrl = (res.url && /^https?:\/\//i.test(res.url)) ? res.url : data;
  var hostMatch = /^(https?:\/\/[^\/]+)/i.exec(pageUrl);
  var activeHost = hostMatch ? hostMatch[1] : BASE_URL;

  var body = res.text() || '';
  var stream = null;

  // 1. Extract video ID and Server IDs
  var vidMatch = body.match(/id=["']video["'][^>]*data-video-id=["']?(\d+)/i) || body.match(/data-video-id=["']?(\d+)/i);
  var vidId = vidMatch ? vidMatch[1] : null;

  if (vidId) {
    var svMatch = body.match(/data-server-id=["']?(\d+)/gi);
    var seenServers = {};
    var servers = [];
    if (svMatch) {
      for (var i = 0; i < svMatch.length; i++) {
        var num = (svMatch[i].match(/\d+/) || [])[0];
        if (num && !seenServers[num]) {
          seenServers[num] = true;
          servers.push(num);
        }
      }
    }
    if (!servers.length) servers.push('1');

    var apiHosts = [activeHost];
    if (apiHosts.indexOf(BASE_URL) === -1) apiHosts.push(BASE_URL);
    for (var j = 0; j < servers.length; j++) {
      var sv = servers[j];
      for (var ah = 0; ah < apiHosts.length; ah++) {
        var curHost = apiHosts[ah];
        var pRes = null;
        try {
          pRes = C.get(curHost + '/api/player', {
            method: 'POST',
            headers: {
              'User-Agent': UA,
              'Referer': pageUrl,
              'Origin': curHost,
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: 'id=' + vidId + '&server=' + sv
          });
        } catch (e) {}

        if (pRes && pRes.ok) {
          try {
            var json = JSON.parse(pRes.text());
            var d = json.data || {};
            if (d.type === 'jwplayer' && d.sources && d.sources.length) {
              for (var k = 0; k < d.sources.length; k++) {
                var s = d.sources[k];
                var f = typeof s === 'string' ? s : (s.file || s.src || s.url);
                if (f && /\.(m3u8|mp4)/i.test(f)) {
                  stream = f;
                  activeHost = curHost;
                  break;
                }
              }
            } else if (d.source) {
              var srcStr = String(d.source);
              var srcMatch = srcStr.match(/src=["']([^"']+)/i);
              var cand = srcMatch ? srcMatch[1] : srcStr;
              if (/\.(m3u8|mp4)/i.test(cand)) {
                stream = cand;
                activeHost = curHost;
              }
            }
          } catch (e) {}
        }
        if (stream) break;
      }
      if (stream) break;
    }
  }

  // 2. Direct regex sniff on HTML
  if (!stream) {
    var m = body.match(/https?:[^"'\s<>\\]+?\.(?:m3u8|mp4)[^"'\s<>\\]*/i);
    if (m) stream = m[0].replace(/\\\//g, '/');
  }

  // 3. Check iframe fallback
  if (!stream) {
    var ifr = body.match(/<iframe[^>]*src=["']([^"']+)["']/i);
    if (ifr && ifr[1]) {
      var ifrUrl = ifr[1].startsWith('//') ? 'https:' + ifr[1] : ifr[1];
      var ifrRes = C.get(ifrUrl, { headers: { 'User-Agent': UA, 'Referer': data } });
      if (ifrRes && ifrRes.ok) {
        var ifrHtml = ifrRes.text() || '';
        var im = ifrHtml.match(/https?:[^"'\s<>\\]+?\.(?:m3u8|mp4)[^"'\s<>\\]*/i);
        if (im) stream = im[0].replace(/\\\//g, '/');
      }
    }
  }

  if (stream) {
    return Response.success({
      type: 'native',
      data: stream,
      headers: {
        'Referer': activeHost + '/',
        'User-Agent': UA
      }
    });
  }

  return Response.error('SexVietTop: không lấy được link phát.');
}
