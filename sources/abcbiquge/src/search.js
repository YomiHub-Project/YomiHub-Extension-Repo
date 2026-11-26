load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(key, page) {
  if (C.isUrl(key)) {
    var n = C.page(page);
    var u = String(key).trim();
    if (/\/sort-\d+-\d+\/?$/i.test(u)) {
      if (n > 1) u = u.replace(/(-\d+)(\/?)$/, '-' + n + '$2');
      return X.listPage(u, 1, '');
    }
    return X.search(u, page);
  }
  return X.search(key, page);
}
