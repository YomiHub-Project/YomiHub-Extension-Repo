load('config.js');
load('lib_common.js');
load('lib_generic.js');
// The visible <h1> is the site name; the film's own name is in the page data ("movie":{"id":…,"name":"…"}).
function execute(url) {
  var r = C.check(C.get(url), url), body = r.text() || '', doc = Html.parse(body, url);
  var m = /movie\\":\{\\"id\\":(\d+),\\"name\\":\\"([^"\\]+)/.exec(body);
  var name = m ? m[2] : (X.pick(doc, 'meta[property=og:title]@content') || '').replace(/^Phim\s+/i, '').replace(/\s+(FHD|HD|4K|CAM|SD)\b.*$/i, '');
  var st = /episode_current\\":\\"([^"\\]+)/.exec(body);
  return Response.success({ name: name, cover: C.fix(X.pick(doc, 'meta[property=og:image]@content')), author: '', description: X.pick(doc, 'meta[property=og:description]@content || meta[name=description]@content'), detail: st ? 'Tình trạng: ' + st[1] : '', ongoing: st ? !/hoàn tất|full/i.test(st[1]) : false, genres: [], host: BASE_URL });
}
