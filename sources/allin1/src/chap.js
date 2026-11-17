load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var m = url.match(/\/truyen\/([^\/]+)\/(\d+)\/(\d+)\/(\d+)/);
  if (m) {
    var host = m[1], vol = m[2], bookid = m[3], cid = m[4];
    var apiUrl = BASE_URL + "/index.php?bookid=" + bookid + "&h=" + host + "&c=" + cid + "&ngmar=readc&sajax=readchapter&sty=1";
    try {
      var res = fetch(apiUrl, {
        method: "POST",
        headers: {
          "Referer": url,
          "User-Agent": "Mozilla/5.0",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "rescan=true&k="
      });
      if (res.ok) {
        var json = JSON.parse(res.text());
        if (json && json.data && json.data.length > 50) {
          return Response.success(json.data);
        }
      }
    } catch (e) {}
  }
  return Response.success("Trang yêu cầu xác minh bảo mật hoặc tải JavaScript trong trình duyệt. Mở chương bằng WebView để xem nội dung đầy đủ.");
}
