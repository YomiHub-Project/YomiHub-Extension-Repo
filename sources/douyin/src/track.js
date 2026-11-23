load('config.js');
load('lib_shortvideo.js');
load('svx.js');
function execute(data) {
  if (/douyin\.com\/(hot|video|search|hashtag|user|note)|v\.douyin\.com/.test(data) && !/\.(mp4|m3u8)/.test(data)) {
    return Response.error('Douyin yêu cầu cấu hình DTK_SERVER để trích xuất luồng phát video trực tiếp');
  }
  return Response.success({ type: 'native', data: data, headers: { 'Referer': 'https://www.douyin.com/', 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' } });
}
