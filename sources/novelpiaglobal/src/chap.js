load('config.js');
load('lib_common.js');

function execute(url) {
  var u = String(url || '');
  var epMatch = u.match(/\/viewer\/(\d+)/);
  var novelMatch = u.match(/[?&]novel_no=(\d+)/);
  if (!epMatch) return Response.error('Không tìm thấy mã chương');

  var episode_no = parseInt(epMatch[1], 10);
  var novel_no = novelMatch ? novelMatch[1] : '';

  if (novel_no) {
    try {
      var res = fetch(API_URL + '/v1/novel/preview?novel_no=' + novel_no, {
        headers: {
          'Accept': 'application/json',
          'Referer': BASE_URL + '/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        var j = res.json();
        var list = (j && j.result && j.result.episode_list) || [];
        for (var i = 0; i < list.length; i++) {
          if (list[i].episode_no === episode_no && list[i].epi_content) {
            return Response.success(list[i].epi_content, list[i].epi_title || '');
          }
        }
      }
    } catch (e) {}
  }

  return Response.success(
    '<p><i>🔒 Chương này yêu cầu tài khoản trả phí trên Novelpia Global. Đăng nhập tại ' + BASE_URL + ' để đọc tiếp.</i></p>',
    'Chương ' + episode_no
  );
}
