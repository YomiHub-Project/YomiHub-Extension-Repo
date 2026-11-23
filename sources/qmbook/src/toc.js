load('config.js');
function execute(url) {
  var id = bookId(url), b = api("/api/book?token=" + token({ id: parseInt(id, 10) }));
  var dirid = b.dirid || parseInt(id, 10);
  var j = api("/api/booklist?token=" + token({ id: parseInt(dirid, 10) }));
  return Response.success((j.list || []).map(function (name, i) {
    return { name: name, url: BASE_URL + "/#/book/" + id + "/" + (i + 1) + ".html", host: BASE_URL };
  }));
}
