load('config.js');
load('tw.js');
// playback access token (public GQL) -> usher master playlist with every quality (HLS)
function execute(url) {
  var vid = TW.vod(url), P = '{platform:"web",playerBackend:"mediaplayer",playerType:"site"}';
  if (vid) {
    var t = TW.q('query{videoPlaybackAccessToken(id:' + TW.s(vid) + ',params:' + P + '){value signature}}').videoPlaybackAccessToken;
    return Response.success([{ title: 'Twitch VOD', data: TW.usher('vod/' + vid, t) }]);
  }
  var lg = TW.login(url);
  if (!lg) return Response.error('Liên kết Twitch không hợp lệ');
  var d = TW.q('query{user(login:' + TW.s(lg) + '){stream{id}} streamPlaybackAccessToken(channelName:' + TW.s(lg) + ',params:' + P + '){value signature}}');
  if (!d.user || !d.user.stream) return Response.error('Kênh ' + lg + ' đang ngoại tuyến — hãy chọn một video phát lại');
  return Response.success([{ title: 'Twitch trực tiếp', data: TW.usher('api/channel/hls/' + lg, d.streamPlaybackAccessToken) }]);
}
