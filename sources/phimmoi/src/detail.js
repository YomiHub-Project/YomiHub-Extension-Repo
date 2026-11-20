load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var doc = res.html();

  var name = doc.select('h1.film-name, h1').first().text();
  if (!name) name = doc.select('meta[property="og:title"]').attr('content');
  if (name) name = name.replace(/^Xem Phim\s+/i, '').replace(/\s+[-|]\s+Phimmoi.*$/i, '').trim();

  var cover = doc.select('.film-poster-img').first().attr('src') || doc.select('.film-poster-img').first().attr('data-src');
  if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');

  var desc = doc.select('.film-description, .description, #film-content').first().text();
  if (!desc) desc = doc.select('meta[property="og:description"]').attr('content');

  var author = doc.select('.film-name-original').first().text() || 'Phimmoi';
  var genres = [];
  var genreEls = doc.select('.anisc-info a[href*="/genres/"], .anisc-info a.genre, .anisc-info a[href*="/the-loai/"]');
  if (!genreEls.size()) genreEls = doc.select('.detail-infor a[href*="/genres/"], .film-info a[href*="/genres/"]');
  for (var i = 0; i < genreEls.size(); i++) {
    var g = (genreEls.get(i).text() || '').trim();
    if (g && genres.indexOf(g) === -1) genres.push(g);
  }

  return Response.success({
    name: name || 'Phim Mới',
    cover: C.fix(cover),
    author: author.trim(),
    description: (desc || '').trim(),
    detail: author.trim(),
    ongoing: true,
    genres: genres,
    url: url
  });
}
