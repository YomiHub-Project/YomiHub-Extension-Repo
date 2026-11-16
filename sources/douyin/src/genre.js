load('config.js');
load('lib_shortvideo.js');
load('svx.js');
// Boards are topics; a topic's "episodes" are its videos (hashtag boards) or the topic page itself.
// input: board name | "user:<sec_uid or profile url>" | "tag:<hashtag_id>"
function execute(input, page) {
  input = String(input || 'hot');
  if (input.indexOf('user:') === 0) {
    var j = SV.dtk('douyin/user/posts', { url: input.slice(5).indexOf('http') === 0 ? input.slice(5) : 'https://www.douyin.com/user/' + input.slice(5), cursor: page && page !== '1' ? page : '', count: 20 });
    return Response.success(SV.dtkItems(j).map(SV.dtkItem), SV.dtkNext(j));
  }
  if (page && page !== '1') return Response.success([], '');
  var words = [];
  var srv = SV.server(), d = null;
  if (srv) { try { d = SV.dtk('douyin/trending', { board: input }).data; } catch (e0) { if (input !== 'hot') throw e0; srv = ''; } }
  if (srv) {
    (d && d.items ? d.items : d || []).forEach(function (w) {
      var name = w.word || w.name || w.title || w.keyword || '';
      if (!name) return;
      var id = w.hashtag_id || w.challenge_id || w.id || '';
      words.push({ name: name, link: input === 'challenge' && id ? BASE_URL + '/hashtag/' + id : BASE_URL + '/hot/' + encodeURIComponent(name), cover: w.cover && w.cover.url ? w.cover.url : '', description: w.hot_value ? '🔥 ' + w.hot_value : '', host: BASE_URL });
    });
  } else {
    // unsigned hot-search board: two tries, then the last good board (≤ 24 h old) instead of an error
    var o = null;
    for (var a = 0; a < 2 && !(o && o.word_list && o.word_list.length); a++) {
      if (a) SV.nap(1200);
      try { var r = fetch('https://www.iesdouyin.com/web/api/v2/hotsearch/billboard/word/' + (a ? '?_r=' + a : ''), { headers: { 'Accept': 'application/json', 'Referer': 'https://www.douyin.com/' } }); o = r.ok ? r.json() : null; } catch (e) { o = null; }
    }
    var list = o && o.word_list && o.word_list.length ? o.word_list : null;
    if (list) SV.cset('dy_hot', list.map(function (w) { return { word: w.word, hot_value: w.hot_value }; })); else list = SV.cget('dy_hot', 24 * 3600000);
    if (!list) throw new Error('Douyin: không tải được bảng tìm kiếm nóng (iesdouyin.com). Thử lại sau, hoặc đặt máy chủ Douyin_TikTok_Download_API (DTK_SERVER) trong cài đặt nguồn.');
    list.forEach(function (w) { if (w.word) words.push({ name: w.word, link: BASE_URL + '/hot/' + encodeURIComponent(w.word), cover: '', description: '🔥 ' + (w.hot_value || ''), host: BASE_URL }); });
  }
  return Response.success(words, '');
}
