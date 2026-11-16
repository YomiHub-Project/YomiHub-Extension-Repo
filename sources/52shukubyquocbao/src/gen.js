load('config.js');

function execute(url, page) {
    if (url.slice(-1) === "/") url = url.slice(0, -1);
    if (!page) page = '1';
    if (page !== '1') url = url + "/index_" + page + ".html";
    let response = fetch(url);
    if (!response.ok) return Response.error("HTTP " + response.status + " " + url);
    let doc = response.html();
    const data = [];
    // 0.0.6: thẻ đầu tiên là khối giới thiệu (không có liên kết truyện) -> bỏ qua thay vì lỗi null
    doc.select(".content-wrap article.excerpt, article.excerpt").forEach(e => {
        let a = e.select("header h2 a, h2 a").first();
        if (!a) return;
        let link = a.attr("href") || "";
        if (link.indexOf(".html") < 0) return;
        let note = e.select(".note").first();
        let date = e.select(".auth-span").first();
        let desc = note ? note.text().replace(/\s+/g, " ").trim() : "";
        if (desc.length > 160) desc = desc.slice(0, 160) + "…";
        data.push({
            name: a.text().trim(),
            link: link,
            description: (date ? date.text().trim() + " " : "") + desc,
            host: BASE_URL
        });
    });
    let next = "";
    let nx = doc.select("a:contains(下一页)").first();
    if (nx) { let m = /index_(\d+)\.html/.exec(nx.attr("href") || ""); if (m && parseInt(m[1], 10) > parseInt(page, 10)) next = m[1]; }
    return Response.success(data, next);
}
