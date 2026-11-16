load('config.js');
load('tw.js');
function execute(key, page) {
  key = String(key || '').split(' — ')[0].trim();
  if (!key) return TW.list('live', page);
  var lg = /twitch\.tv\//.test(key) ? (TW.vod(key) ? '' : TW.login(key)) : '';
  if (TW.vod(key)) return Response.success([{ name: 'Twitch VOD ' + TW.vod(key), link: BASE_URL + '/videos/' + TW.vod(key), cover: '', description: '', host: BASE_URL }], '');
  if (lg) key = lg;
  var c = TW.q('query{searchFor(userQuery:' + TW.s(key) + ',platform:"web",target:{index:CHANNEL' + (page && page !== '1' ? ',cursor:' + TW.s(page) : '') + '}){channels{cursor edges{item{... on User{login displayName description profileImageURL(width:300) stream{title viewersCount game{displayName} previewImageURL(width:640,height:360)}}}}}}}').searchFor;
  c = (c && c.channels) || {};
  var items = [];
  (c.edges || []).forEach(function (e) {
    var u = e.item; if (!u || !u.login) return; var s = u.stream;
    items.push({ name: u.displayName + (s ? ' — ' + (s.title || 'Trực tiếp') : ''), link: BASE_URL + '/' + u.login, cover: (s && s.previewImageURL) || u.profileImageURL || '', description: s ? '🔴 ' + (s.viewersCount || 0) + ' người xem' + (s.game ? ' · ' + s.game.displayName : '') : 'Ngoại tuyến · ' + String(u.description || '').slice(0, 80), host: BASE_URL });
  });
  return Response.success(items, items.length && c.cursor ? c.cursor : '');
}
