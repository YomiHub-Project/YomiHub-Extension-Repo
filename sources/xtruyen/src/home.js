load('config.js');
load('lib_common.js');
load('lib_madara.js');
function execute() { return Response.success([{ title: "Mới cập nhật", input: "latest", script: "browse.js" }, { title: "Hot", input: "trending", script: "browse.js" }, { title: "Xem nhiều", input: "views", script: "browse.js" }, { title: "Nhiều chương", input: "chapter-number", script: "browse.js" }]); }
