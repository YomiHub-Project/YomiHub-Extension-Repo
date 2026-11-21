var BASE_URL = "https://hentaicube.xyz";
var HOST = "https://hentaicube.xyz";

try {
    if (typeof DOMAIN !== 'undefined' && DOMAIN) {
        var d = String(DOMAIN).replace(/\/+$/, "");
        if (d && /^https?:\/\//i.test(d)) {
            BASE_URL = d;
            HOST = d;
        }
    }
} catch (e) {}

var FETCH_HEADERS = {
    "Referer": BASE_URL + "/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
};
var FETCH_OPTIONS = { headers: FETCH_HEADERS };

function checkCloudflare(res) {
    if (!res) return;
    if (res.status === 403 || res.status === 503) {
        var text = "";
        try { text = res.text() || ""; } catch (e) {}
        if (/Just a moment|challenge-platform|cf-turnstile|Attention Required|Verifying you are human/i.test(text)) {
            throw new Error("CLOUDFLARE: Trang HentaiCube đang bật Cloudflare bảo vệ (HTTP " + res.status + " 'Just a moment...'). Hãy mở WebView trong YomiHub để vượt qua xác minh.");
        }
    }
}

var GENRE_SLUG_RE = /\/theloai\/([^\/?#]+)/;
var SIZE_SUFFIX_RE = /-\d+x\d+(\.[^./?]+)$/;

function selFirst(el, css) {
    var r = el.select(css);
    return r.size() > 0 ? r.get(0) : null;
}

function resolveUrl(url) {
    if (!url) return BASE_URL;
    if (url.indexOf("http") === 0) return url;
    return BASE_URL + (url.charAt(0) === "/" ? url : "/" + url);
}
// Lấy ảnh chất lượng đầy đủ bằng cách bỏ hậu tố kích thước -NxN
function stripSizeSuffix(src) {
    if (!src) return "";
    return src.replace(SIZE_SUFFIX_RE, "$1");
}

// Parse danh sách truyện từ trang list/genre
// Trả về description là chương mới nhất
function parseListItems(doc) {
    var result = [];
    var seen = {};
    var cards = doc.select("div.page-item-detail");
    for (var i = 0; i < cards.size(); i++) {
        var card = cards.get(i);
        var titleA = selFirst(card, ".post-title h3 a, h3.h5 a");
        if (!titleA) continue;
        var name = titleA.text().trim();
        var link = titleA.attr("href") || "";
        if (!link || seen[link]) continue;
        seen[link] = true;

        var imgEl = selFirst(card, ".item-thumb img");
        var cover = imgEl ? stripSizeSuffix(imgEl.attr("src") || "") : "";

        // Chương mới nhất hiển thị dưới mỗi truyện
        var chapA = selFirst(card, ".list-chapter .chapter-item .chapter a");
        var description = chapA ? chapA.text().replace(/\s+/g, " ").trim() : "";

        result.push({ name: name, link: link, host: HOST, cover: cover, description: description });
    }
    return result;
}
