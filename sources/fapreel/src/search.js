load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(key, page) {
  key = String(key || '').trim();
  var slug = '';
  if (key.length >= 2) {
    try {
      var res = C.get(BASE_URL + '/search.php?q=' + encodeURIComponent(key));
      if (res && res.ok) {
        var arr = JSON.parse(res.text());
        if (arr && arr.length && arr[0].s) slug = arr[0].s;
      }
    } catch (e) {}
  }
  if (!slug && key) slug = key.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  var searchPath = slug ? '/reels/' + slug : '/';
  try {
    var checkRes = C.get(BASE_URL + searchPath);
    if (!checkRes || !checkRes.ok) searchPath = '/';
  } catch (e2) {
    searchPath = '/';
  }
  return X.browse(searchPath, page);
}
