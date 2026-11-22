load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(url) {
    try {
        var r = fetch(url, G.req);
        if (r && (r.status === 403 || r.status === 503)) {
            var body = r.text();
            if (/cf_chl|challenge-platform|Just a moment|cf-turnstile/i.test(body)) {
                return Response.error('CLOUDFLARE: Trang TruyenH yêu cầu xác minh Turnstile. Mở chương bằng WebView trong ứng dụng để tiếp tục đọc.');
            }
        }
        return X.text(url);
    } catch (e) {
        return Response.error(e.message || String(e));
    }
}
