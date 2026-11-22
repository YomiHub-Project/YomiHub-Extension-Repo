load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var slugMatch = /[\/=]([^\/?#]+-[0-9]+)/.exec(url) || /\/phim\/([^\/?#]+)/.exec(url);
  var slug = slugMatch ? slugMatch[1] : '';

  // 1. Try Anime-API first
  if (slug) {
    try {
      var resApi = fetch(API_URL + '/api/v1/movie/' + slug, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (resApi && resApi.ok) {
        var d = JSON.parse(resApi.text());
        var m = (d.data && d.data.movie) ? d.data.movie : null;
        if (m && m.name) {
          var cover = m.poster_url || m.thumb_url || '';
          if (cover && cover.indexOf('http') !== 0) cover = API_URL + cover;
          var genres = [];
          if (m.categories && m.categories.length) {
            for (var i = 0; i < m.categories.length; i++) {
              if (m.categories[i] && m.categories[i].name) genres.push(m.categories[i].name);
            }
          }
          var fmtNames = function (arr) {
            if (!arr) return '';
            if (typeof arr === 'string') return arr.trim();
            if (!Array.isArray(arr)) return arr.name ? String(arr.name).trim() : '';
            var out = [];
            for (var k = 0; k < arr.length; k++) {
              var n = typeof arr[k] === 'string' ? arr[k] : (arr[k] && arr[k].name ? arr[k].name : '');
              n = String(n || '').trim();
              if (n && n.toLowerCase() !== 'đang cập nhật' && out.indexOf(n) === -1) out.push(n);
            }
            return out.slice(0, 5).join(', ');
          };
          var author = fmtNames(m.directors) || fmtNames(m.actors) || 'AnimeVietsub';
          return Response.success({
            name: m.name,
            cover: cover,
            author: author,
            description: (m.content || m.content2 || '').replace(/<[^>]+>/g, '').trim(),
            detail: m.episode_current ? ('Tiến độ: ' + m.episode_current) : '',
            ongoing: m.status === 'ongoing',
            genres: genres,
            url: url
          });
        }
      }
    } catch (e) {}
  }

  // 2. Fallback: HTML parsing
  var res = fetchWithDomainFallback(url);
  var doc = res.html();

  var name = doc.select('h1, .title, .film-name').text();
  if (!name) name = doc.select('meta[property="og:title"]').attr('content');
  if (name) name = name.replace(/^Xem Phim\s+/i, '').replace(/\s+-\s+Anime.*$/i, '').trim();

  var cover = doc.select('.film-poster-img, .thumb img').attr('src');
  if (!cover) cover = doc.select('meta[property="og:image"]').attr('content');

  var desc = doc.select('.film-description, .description, #film-content').text();
  if (!desc) desc = doc.select('meta[property="og:description"]').attr('content');

  var genresHtml = [];
  var genreEls = doc.select('a[href*="/the-loai/"]');
  for (var i = 0; i < genreEls.size(); i++) {
    var g = genreEls.get(i).text();
    if (g && genresHtml.indexOf(g) === -1) genresHtml.push(g);
  }

  return Response.success({
    name: name || 'AnimeVietsub',
    cover: C.fix(cover),
    author: 'AnimeVietsub',
    description: desc || '',
    detail: '',
    ongoing: true,
    genres: genresHtml,
    url: url
  });
}
