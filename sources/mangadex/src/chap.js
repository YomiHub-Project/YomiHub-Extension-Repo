load("config.js");
function execute(url) {
  var id = mdIdFromUrl(url);
  if (!id) return Response.error("Không tìm thấy Chapter ID");
  var j = mdFetch("/at-home/server/" + id);
  if (!j || !j.baseUrl || !j.chapter || !j.chapter.hash) return Response.error("Không lấy được trang ảnh MangaDex");
  var files = (j.chapter.data && j.chapter.data.length) ? j.chapter.data : (j.chapter.dataSaver || []);
  var mode = (j.chapter.data && j.chapter.data.length) ? "/data/" : "/data-saver/";
  var out = [];
  for (var i = 0; i < files.length; i++) {
    out.push(j.baseUrl.replace(/\/+$/, "") + mode + j.chapter.hash + "/" + files[i]);
  }
  return Response.success(out);
}
