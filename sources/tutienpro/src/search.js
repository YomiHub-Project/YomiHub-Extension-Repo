load('config.js');
load('lib_common.js');
function execute(key, page) {
  if (C.isUrl(key)) return ttList(String(key).replace(BASE_URL, ''), page);
  return ttList('/story/user/search/?q=' + C.enc(key) + '&page_size=10', page);
}
