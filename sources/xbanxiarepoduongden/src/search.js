load('config.js');
load('lib_common.js');
load('lib_generic.js');
function execute(key, page) {
  if (C.isUrl(key) && /\/list\/\d+_\d+\.html/i.test(key) && C.page(page) > 1) {
    key = String(key).replace(/_\d+(\.html)/i, '_' + C.page(page) + '$1');
    return X.search(key, 1);
  }
  return X.search(key, page);
}
