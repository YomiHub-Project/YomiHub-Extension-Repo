load('config.js');

function execute(url) {
    var slug = String(url || "").replace(/\/+$/, "").split("/").pop();
    if (!slug) return null;
    var q = slug.replace(/-/g, "+");
    var res = fetch(BASE_URL + "/wp-json/wp/v2/manga?search=" + q);
    if (!res || !res.ok) return null;
    var list = res.json();
    if (!list || !list.length) return null;
    var item = null;
    for (var i = 0; i < list.length; i++) {
        if (list[i].slug === slug) {
            item = list[i];
            break;
        }
    }
    if (!item) item = list[0];
    var mangaId = item.id;

    var chapters = [];
    var paged = 1;
    var totalPages = 1;

    while (paged <= totalPages && paged <= 50) {
        var tocRes = fetch(BASE_URL + "/wp-json/initmanga/v1/chapters?manga_id=" + mangaId + "&paged=" + paged + "&per_page=100");
        if (!tocRes || !tocRes.ok) break;
        var json = tocRes.json();
        if (!json || !json.items || !json.items.length) break;
        totalPages = json.total_pages || 1;

        for (var c = 0; c < json.items.length; c++) {
            var it = json.items[c];
            chapters.push({
                name: it.title || ("Chương " + it.number),
                url: BASE_URL + "/wp-json/initmanga/v1/chapter/" + it.id,
                host: BASE_URL
            });
        }
        paged++;
    }

    // Chapters are returned newest first (e.g. 420 -> 1), reverse so chapter 1 is first
    chapters.reverse();
    return Response.success(chapters);
}
