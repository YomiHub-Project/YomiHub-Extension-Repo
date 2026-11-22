load('config.js');

function execute(url) {
    var slug = String(url || "").replace(/\/+$/, "").split("/").pop();
    if (!slug) return null;
    var q = slug.replace(/-/g, "+");
    var res = fetch(BASE_URL + "/wp-json/wp/v2/manga?_embed=1&search=" + q);
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

    var name = (item.title && item.title.rendered) || slug;
    var desc = (item.content && item.content.rendered) || "";
    var cover = "";
    if (item._embedded && item._embedded["wp:featuredmedia"] && item._embedded["wp:featuredmedia"][0]) {
        cover = item._embedded["wp:featuredmedia"][0].source_url || "";
    }
    var author = "";
    var genres = [];
    if (item._embedded && item._embedded["wp:term"]) {
        var termArrays = item._embedded["wp:term"];
        for (var t = 0; t < termArrays.length; t++) {
            var sub = termArrays[t] || [];
            for (var k = 0; k < sub.length; k++) {
                if (sub[k].taxonomy === "author_tax" && !author) {
                    author = sub[k].name;
                } else if (sub[k].taxonomy === "genre") {
                    genres.push({ title: sub[k].name, input: sub[k].slug });
                }
            }
        }
    }

    return Response.success({
        name: name,
        cover: cover,
        author: author,
        description: desc,
        detail: "Mã truyện: " + item.id,
        host: BASE_URL,
        genres: genres,
        ongoing: item.manga_status !== "completed",
        url: url
    });
}
