load("config.js");

function parseHtmlSearch(html, page) {
    var doc = Html.parse(html, BASE_ORIGIN + "/");
    var cards = doc.select("article.card, article.flex, div.grid > div.flex.items-start");
    var books = [], seen = {};
    for (var i = 0; i < cards.size(); i++) {
        var el = cards.get(i);
        var a = el.select("h2 a[href*='/truyen/'], a[href*='/truyen/']").first();
        if (!a) continue;
        var href = String(a.attr("href") || "").trim();
        if (!href || href.indexOf("/chuong") >= 0) continue;
        var link = toAbs(href);
        if (seen[link]) continue;
        var h2 = el.select("h2, h3").first();
        var title = cleanText(h2 ? h2.text() : a.text());
        if (!title) continue;
        seen[link] = 1;
        var img = el.select("img").first();
        var cover = img ? toAbs(img.attr("data-src") || img.attr("src") || "") : "";
        books.push({ name: title, link: link, cover: cover, description: "", host: BASE_ORIGIN });
    }
    var cur = parseInt(page || "1", 10);
    var nextEl = doc.select("a[href*='page=" + (cur + 1) + "']").first();
    return Response.success(books, nextEl ? String(cur + 1) : "");
}

function execute(input, page, filters) {
    var keyword = Array.isArray(input) ? (input[0] || "") : (input || "");
    var curPage = parseInt((Array.isArray(input) && !page ? input[1] : page) || "1", 10);
    var target = "";
    if (/^https?:\/\//i.test(String(keyword))) {
        target = String(keyword);
    } else if (!String(keyword).trim() && filters && filters.genres && filters.genres.length) {
        var g = String(filters.genres[0]);
        target = g.indexOf("http") === 0 ? g : (BASE_ORIGIN + (g.charAt(0) === "/" ? "" : "/") + g);
    } else {
        target = BASE_ORIGIN + "/tim-truyen?q=" + encodeURIComponent(String(keyword).trim());
        if (filters && filters.status) target += "&status=" + encodeURIComponent(filters.status);
        if (filters && filters.sort) target += "&sort=" + encodeURIComponent(filters.sort);
    }
    target += (target.indexOf("?") >= 0 ? "&" : "?") + "page=" + curPage;
    var res = fetch(target, {
        headers: { "User-Agent": typeof BASE_UA !== "undefined" ? BASE_UA : "Mozilla/5.0", "Referer": BASE_ORIGIN + "/" }
    });
    if (!res || !res.ok) return Response.success([], "");
    return parseHtmlSearch(res.text(), curPage);
}
