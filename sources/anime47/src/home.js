load('config.js');
load('lib_common.js');

function execute() {
  return Response.success([
    { title: "Mới cập nhật", input: "latest", script: "browse.js" },
    { title: "Xem nhiều", input: "most-popular", script: "browse.js" },
    { title: "Đang phát sóng", input: "top-airing", script: "browse.js" }
  ]);
}
