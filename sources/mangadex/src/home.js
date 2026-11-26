load("config.js");
function execute() {
  return Response.success([
    { title: "Mới cập nhật", input: "order[latestUploadedChapter]=desc&hasAvailableChapters=true", script: "browse.js" },
    { title: "Phổ biến", input: "order[followedCount]=desc&hasAvailableChapters=true", script: "browse.js" },
    { title: "Đánh giá cao", input: "order[rating]=desc&hasAvailableChapters=true", script: "browse.js" },
    { title: "Truyện mới", input: "order[createdAt]=desc&hasAvailableChapters=true", script: "browse.js" },
    { title: "Hoàn thành", input: "status[]=completed&order[latestUploadedChapter]=desc&hasAvailableChapters=true", script: "browse.js" }
  ]);
}
