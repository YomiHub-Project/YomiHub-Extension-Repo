load('config.js');
load('lib_common.js');

function execute(url) {
  return Response.success([{ name: "Xem video", url: url, host: BASE_URL }]);
}
