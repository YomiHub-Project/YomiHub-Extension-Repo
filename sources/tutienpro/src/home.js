load('config.js');
load('lib_common.js');
function execute() {
  return Response.success([
    { title: "Mới cập nhật", input: "/story/stories/?page_size=24", script: "browse.js" },
    { title: "Hoàn thành", input: "/story/stories/completed/?page_size=24", script: "browse.js" },
    { title: "Lọc truyện", input: "/story/stories/filter/?page_size=24", script: "browse.js" }
  ]);
}
