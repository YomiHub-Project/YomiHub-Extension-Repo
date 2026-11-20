load('config.js');

function execute(url) {
  var doc = hakoFetchDoc(url);
  var list = [];
  var sections = doc.select('section.volume-list, .volume-list');

  for (var i = 0; i < sections.size(); i++) {
    var section = sections.get(i);
    var sectionName = (section.select('.sect-title').first().text() || '').replace(/\s+/g, ' ').trim();
    var chapters = section.select('ul.list-chapters li, .list-chapters li');

    for (var j = 0; j < chapters.size(); j++) {
      var chapter = chapters.get(j);
      var a = chapter.select('.chapter-name a').first();
      if (!a) continue;
      var chName = (a.attr('title') || a.text() || '').replace(/\s+/g, ' ').trim();
      var href = hakoFixUrl(a.attr('href'));
      if (!href) continue;
      var fullName = sectionName ? (sectionName + ' - ' + chName) : chName;
      list.push({
        name: fullName,
        url: href,
        host: BASE_URL
      });
    }
  }

  return Response.success(list);
}
