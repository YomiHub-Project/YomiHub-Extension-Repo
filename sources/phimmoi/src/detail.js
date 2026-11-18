load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var res = fetchWithDomainFallback(url);
  var doc = res.html();

  var name = doc.select('h1, h2.film-name, .film-name').text();
  if (!name) name = doc.select('meta[property="og:title"]').attr('content');
  if (name) name = name.replace(/^Xem Phim\s+/i, '').replace(/\s+-\s+Phimmoi.*$/i, '').trim();

  var cover = doc.select('.film-poster-img').attr('src') || doc.select('.film-poster-img').attr('data-src');
  if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');

  var desc = doc.select('.film-description, .description, #film-content').text();
  if (!desc) desc = doc.select('meta[property="og:description"]').attr('content');

  var author = doc.select('.film-name-original').text() || 'Phimmoi';
  var genres = [];
  var genreEls = doc.select('a[href*="/the-loai/"], a[href*="/categories/"], .film-info a');
  for (var i = 0; i < genreEls.size(); i++) {
    var g = genreEls.get(i).text();
    if (g && genres.indexOf(g) === -1) genres.push(g);
  }

  return Response.success({
    name: name || 'Phim Mới',
    cover: C.fix(cover),
    author: author,
    description: desc || '',
    detail: author,
    ongoing: true,
    genres: genres,
    url: url
  });
}
