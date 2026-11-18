load('config.js');
load('lib_common.js');

function execute() {
  return Response.success([
    { title: "Thịnh hành", input: "trending", script: "browse.js" },
    { title: "Mới nhất", input: "latest", script: "browse.js" },
    { title: "Hàng đầu", input: "top", script: "browse.js" },
    { title: "Ngẫu nhiên", input: "random", script: "browse.js" }
  ]);
}
