load('config.js');
load('tw.js');
function execute(url) {
  var vid = TW.vod(url);
  if (vid) {
    var v = TW.q('query{video(id:' + TW.s(vid) + '){title description lengthSeconds publishedAt viewCount previewThumbnailURL(width:640,height:360) owner{login displayName} game{name displayName}}}').video;
    if (!v) return Response.error('Không tìm thấy video Twitch ' + vid);
    return Response.success({ name: v.title || ('VOD ' + vid), cover: v.previewThumbnailURL || '', author: v.owner ? v.owner.displayName : '', description: v.description || '', detail: TW.dur(v.lengthSeconds) + ' · ' + (v.viewCount || 0) + ' lượt xem · ' + String(v.publishedAt || '').slice(0, 10), ongoing: false, genres: v.game ? [{ title: v.game.displayName, input: 'game:' + v.game.name, script: 'gen.js' }] : [], host: BASE_URL });
  }
  var lg = TW.login(url);
  if (!lg) return Response.error('Liên kết Twitch không hợp lệ');
  var u = TW.q('query{user(login:' + TW.s(lg) + '){login displayName description profileImageURL(width:300) followers{totalCount} stream{title viewersCount game{name displayName} previewImageURL(width:640,height:360)}}}').user;
  if (!u) return Response.error('Không tìm thấy kênh Twitch ' + lg);
  var s = u.stream;
  return Response.success({ name: u.displayName + (s && s.title ? ' — ' + s.title : ''), cover: (s && s.previewImageURL) || u.profileImageURL || '', author: u.displayName, description: u.description || '', detail: (s ? '🔴 Đang trực tiếp · ' + (s.viewersCount || 0) + ' người xem' : 'Ngoại tuyến') + ' · ' + ((u.followers && u.followers.totalCount) || 0) + ' người theo dõi', ongoing: true, genres: s && s.game ? [{ title: s.game.displayName, input: 'game:' + s.game.name, script: 'gen.js' }] : [], host: BASE_URL });
}
