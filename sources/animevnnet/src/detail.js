load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var u = String(url || '').trim();
  var res = fetchWithRetry(u);
  var doc = res.html();

  var name = doc.select('h1').text() || doc.select('meta[property="og:title"]').attr('content');
  if (name) name = name.replace(/^Phim\s+/i, '').replace(/\s+-\s+Anime.*$/i, '').trim();

  var cover = doc.select('meta[property="og:image"]').attr('content') || doc.select('.thumb img, .poster img').attr('src');
  var desc = doc.select('meta[name="description"]').attr('content') || doc.select('.description, .detail-content').text();

  var genres = [];
  var genreEls = doc.select('a[href*="/the-loai/"]');
  for (var i = 0; i < genreEls.size(); i++) {
    var g = genreEls.get(i).text();
    if (g && genres.indexOf(g) === -1) genres.push(g.trim());
  }

  return Response.success({
    name: name || 'AnimeVn',
    cover: C.fix(cover ? cover.trim() : ''),
    author: 'AnimeVn',
    description: (desc || '').trim(),
    detail: '',
    ongoing: true,
    genres: genres,
    url: u
  });
}
