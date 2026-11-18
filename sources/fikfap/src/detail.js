load('config.js');
load('lib_common.js');

function execute(url) {
  var idMatch = url.match(/post\/([a-zA-Z0-9_-]+)/i);
  var id = idMatch ? idMatch[1] : url.trim();

  var name = '', cover = '', desc = '', author = 'FikFap', genres = [];

  // 1. Try API endpoint
  var apiUrl = API_URL + '/posts/' + id;
  var res = C.get(apiUrl, { headers: API_HEADERS });
  if (res && res.ok) {
    try {
      var d = JSON.parse(res.text());
      name = d.label || d.description || ('FikFap #' + id);
      desc = d.description || '';
      cover = d.thumbnailUrl || (d.preview ? d.preview.url : '');
      if (d.author && d.author.username) author = d.author.username;
      if (d.hashtags && Array.isArray(d.hashtags)) {
        genres = d.hashtags.map(function(t) { return { title: '#' + t, input: t, script: 'search.js' }; });
      }
    } catch (e) {}
  }

  // 2. Web fallback if API returned 404 or incomplete metadata
  if (!name || !cover) {
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
    }
  }

  name = (name || ('FikFap #' + id)).replace(/#[a-zA-Z0-9_]+/g, '').trim() || ('FikFap #' + id);
  if (!genres.length && desc) {
    var tagMatches = desc.match(/#([a-zA-Z0-9_]+)/g);
    if (tagMatches) {
      genres = tagMatches.map(function(t) { return { title: t, input: t.replace(/^#/, ''), script: 'search.js' }; });
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
