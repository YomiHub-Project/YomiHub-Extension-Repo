load('config.js');
load('lib_common.js');

function execute(url) {
  return Response.success([{ title: "Mặc định", data: url }]);
}
