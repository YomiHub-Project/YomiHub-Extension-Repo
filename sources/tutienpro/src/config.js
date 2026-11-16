var BASE_URL = "https://tutien.pro";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
// TruyenCv - Tu Tiên Game (tutien.pro) là SPA (Vite/React); dữ liệu lấy từ API JSON công khai cùng tên miền:
//   /story/stories/?page_size=24&page=N   /story/user/search/?q=&page=&page_size=   /story/<slug>/
//   /story/stories/<id>/chapters/index/   /story/<slug>/chapter-<số>/
function ttJson(path) {
  var r = C.check(C.get(BASE_URL + path, { headers: { 'Accept': 'application/json' } }), BASE_URL + path);
  return r.json();
}
function ttSlug(url) {
  var m = /\/(?:truyen|story)\/([^\/?#]+)(?:\/chapter-(\d+))?/.exec(String(url));
  return m ? { slug: m[1], chap: m[2] || '' } : null;
}
function ttItems(d) {
  var out = [], arr = (d && d.results) || [];
  for (var i = 0; i < arr.length; i++) {
    var o = arr[i]; if (o && o.story && o.story.slug) o = o.story;
    if (!o || !o.slug || !o.title) continue;
    var au = o.author && typeof o.author === 'object' ? o.author.name : o.author;
    out.push({ name: o.title, link: BASE_URL + '/truyen/' + o.slug, cover: C.fix(o.cover_image || ''), description: au || '', host: BASE_URL });
  }
  return out;
}
function ttList(path, page) {
  var n = C.page(page);
  var d = ttJson(path + (path.indexOf('?') >= 0 ? '&' : '?') + 'page=' + n);
  var items = ttItems(d);
  return Response.success(items, C.next(!!(d && d.next) && items.length > 0, page));
}
function ttEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
