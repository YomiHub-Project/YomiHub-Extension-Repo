load('config.js');

function execute(url) {
  var doc = hakoFetchDoc(url);

  var name = (doc.select('.series-name a').first().text() || doc.select('.series-name').first().text() || '').replace(/\s+/g, ' ').trim();
  if (!name) name = (doc.select('meta[property="og:title"]').attr('content') || '').trim();

  var cover = hakoExtractBg(doc.select('.series-cover .img-in-ratio').first());
  if (!cover) cover = hakoFixUrl(doc.select('meta[property="og:image"]').attr('content'));

  var author = '';
  var statusText = '';
  var detailLines = [];
  var infoItems = doc.select('.series-information .info-item');
  for (var i = 0; i < infoItems.size(); i++) {
    var it = infoItems.get(i);
    var k = (it.select('.info-name').text() || '').replace(/\s+/g, ' ').trim();
    var v = (it.select('.info-value').text() || '').replace(/\s+/g, ' ').trim();
    if (k || v) detailLines.push((k ? k + ' ' : '') + v);
    if (/Tác giả/i.test(k) && v) author = v;
    if (/Tình trạng/i.test(k) && v) statusText = v;
  }
  if (!author) {
    for (var kIdx = 0; kIdx < infoItems.size(); kIdx++) {
      var kIt = infoItems.get(kIdx);
      var kName = (kIt.select('.info-name').text() || '').replace(/\s+/g, ' ').trim();
      var kVal = (kIt.select('.info-value').text() || '').replace(/\s+/g, ' ').trim();
      if (/Nhóm dịch|Họa sĩ/i.test(kName) && kVal) { author = kVal; break; }
    }
  }

  var genres = [];
  var gEls = doc.select('.series-gernes a');
  for (var j = 0; j < gEls.size(); j++) {
    var gEl = gEls.get(j);
    var gTitle = (gEl.text() || '').replace(/\s+/g, ' ').trim();
    var gHref = hakoFixUrl(gEl.attr('href'));
    if (gTitle) {
      genres.push({ title: gTitle, input: gHref, script: 'gen.js' });
    }
  }

  var desc = (doc.select('.summary-content').html() || '').trim();
  var infoHtml = doc.select('.series-information .info-item').html() || '';
  var ongoing = !/(hoàn thành|hoàn tất|tạm ngưng|full|completed)/i.test(statusText || infoHtml);

  return Response.success({
    name: name,
    cover: cover,
    host: BASE_URL,
    author: author,
    description: desc,
    detail: detailLines.join('<br>'),
    genres: genres,
    ongoing: ongoing
  });
}
