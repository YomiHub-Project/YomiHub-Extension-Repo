load('config.js');
load('lib_common.js');

function execute(url) {
  // 1. Check if metadata is encoded in hash
  var mHash = /#meta=([^&]+)/.exec(url);
  if (mHash) {
    try {
      var meta = JSON.parse(decodeURIComponent(mHash[1]));
      return Response.success({
        name: meta.title,
        cover: meta.cover || '',
        author: 'Anime47',
        description: meta.desc || '',
        detail: meta.ep ? ('Tổng số tập: ' + meta.ep) : '',
        ongoing: true,
        genres: Array.isArray(meta.genres) ? meta.genres.map(function(g) { return typeof g === 'string' ? g : (g.name || ''); }) : ['Anime'],
        url: url
      });
    } catch (e) {}
  }

  // 2. Extract ID and query API
  var mId = /m([0-9]+)\.html/i.exec(url) || /\/([0-9]+)(?:\/|\.html|$)/.exec(url);
  var id = mId ? mId[1] : '';

  if (id) {
    try {
      var res = requestApiJson('/anime/info/' + id);
      if (res && res.data) {
        var a = res.data;
        return Response.success({
          name: a.title,
          cover: a.image || '',
          author: 'Anime47',
          description: a.description || '',
          detail: a.episodes ? ('Số tập: ' + a.episodes) : '',
          ongoing: a.status === 'Ongoing',
          genres: (a.genres || []).map(function(g) { return typeof g === 'string' ? g : (g.name || ''); }),
          url: url
        });
      }
    } catch (e) {}
  }

  // 3. Fallback name from slug
  var mSlug = /\/phim\/([^\/?#]+)/.exec(url);
  var slugName = mSlug ? mSlug[1].replace(/-/g, ' ').replace(/\b\w/g, function(l){ return l.toUpperCase(); }) : 'Anime47';
  return Response.success({
    name: slugName,
    cover: '',
    author: 'Anime47',
    description: 'Nội dung chi tiết yêu cầu mở WebView và đăng nhập tài khoản Anime47.',
    detail: '',
    ongoing: true,
    genres: ['Anime'],
    url: url
  });
}
