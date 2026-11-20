load('config.js');
load('lib_common.js');

function execute(url) {
  var idMatch = String(url || '').match(/post\/([a-zA-Z0-9_-]+)/i);
  var id = idMatch ? idMatch[1] : String(url || '').trim();

  var name = '', cover = '', desc = '', author = 'FikFap', genres = [];

  // 1. Try API endpoint
  var apiUrl = API_BASE + '/posts/' + encodeURIComponent(id);
  var res = C.get(apiUrl, { headers: API_HEADERS });
  if (res && res.status === 404) {
    return Response.error('FikFap: video #' + id + ' không tồn tại hoặc đã bị xóa (HTTP 404).');
  }
  if (res && res.ok) {
    try {
      var d = JSON.parse(res.text());
      name = ffPickName(d, id);
      desc = d.description || (d.author && d.author.description) || '';
      cover = ffPickCover(d);
      if (d.author && d.author.username) author = '@' + d.author.username;
      genres = ffPickGenres(d);
    } catch (e) {}
  }

  // 2. Web fallback only if API didn't return 404 (e.g., temporary API outage)
  if (!name) {
    var webUrl = BASE_URL + '/post/' + id;
    var webRes = C.get(webUrl, { headers: WEB_HEADERS });
    if (webRes && webRes.ok) {
      var html = webRes.text();
      var ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
      if (ldMatch) {
        try {
          var ld = JSON.parse(ldMatch[1]);
          name = name || ld.name || ld.headline;
          desc = desc || ld.description;
          cover = cover || ld.thumbnailUrl;
          if (ld.author && ld.author.name) author = ld.author.name;
        } catch (e) {}
      }
      var doc = Html.parse(html, webUrl);
      name = name || doc.select('meta[property="og:title"]').attr('content') || doc.select('title').text();
      cover = cover || doc.select('meta[property="og:image"]').attr('content');
      desc = desc || doc.select('meta[property="og:description"]').attr('content');
    } else if (!res || !res.ok) {
      return Response.error('FikFap: không tải được thông tin video (API HTTP ' + (res ? res.status : 0) + '). Nếu nhà mạng chặn, hãy bật VPN/DNS-over-HTTPS.');
    }
  }

  name = ffPickName({ label: name }, id);
  if (!genres.length && desc) {
    var tagMatches = desc.match(/#([a-zA-Z0-9_]+)/g);
    if (tagMatches) {
      for (var j = 0; j < tagMatches.length; j++) {
        var t = tagMatches[j].replace(/^#/, '');
        genres.push({ title: '#' + t, input: t, script: 'search.js' });
      }
    }
  }

  return Response.success({
    name: name,
    cover: cover,
    author: author,
    description: desc,
    detail: 'Tác giả: ' + author,
    ongoing: false,
    genres: genres,
    host: BASE_URL
  });
}
