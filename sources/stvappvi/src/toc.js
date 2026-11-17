load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(url) {
  var m = url.match(/\/truyen\/([^\/]+)\/(\d+)\/(\d+)/);
  if (!m) return X.toc(url);
  var host = m[1];
  var vol = m[2];
  var bookid = m[3];
  var apiUrl = BASE_URL + "/index.php?ngmar=chapterlist&h=" + host + "&bookid=" + bookid + "&sajax=getchapterlist";
  var res = fetch(apiUrl, {
    headers: { "Referer": url, "User-Agent": "Mozilla/5.0" }
  });
  if (!res.ok) return Response.error("Failed to load chapters: HTTP " + res.status);
  var text = res.text();
  var json = null;
  try { json = JSON.parse(text); } catch (e) {}
  if (!json || !json.data) return Response.error("No chapter data");
  var lines = json.data.split("-//-");
  var chapters = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (!line) continue;
    var parts = line.split("-/-");
    if (parts.length >= 3) {
      var cVol = parts[0];
      var cid = parts[1];
      var cName = parts[2].replace(/([\t\n]+|<br>|&nbsp;)/g, " ").replace(/Thứ ([\d\,]+) chương/i, "Chương $1: ").trim();
      var cUrl = BASE_URL + "/truyen/" + host + "/" + cVol + "/" + bookid + "/" + cid + "/";
      chapters.push({
        name: cName,
        url: cUrl,
        pay: false
      });
    }
  }
  return Response.success(chapters);
}
