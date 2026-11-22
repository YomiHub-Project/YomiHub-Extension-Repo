load('config.js');

function execute(url) {
    if (url.indexOf("/wp-json/initmanga/v1/chapter/") !== -1) {
        var res = fetch(url);
        if (!res || !res.ok) return Response.error("Không tải được nội dung chương");
        var json = res.json();
        if (!json || !json.content) return Response.error("Nội dung chương trống");
        return Response.success(json.content);
    }
    load('crypto.js');
    load('lib_common.js');
    load('lib_generic.js');
    return X.text(url);
}
