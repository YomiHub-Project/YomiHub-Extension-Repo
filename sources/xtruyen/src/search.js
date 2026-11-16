load('config.js');
load('lib_common.js');
load('lib_madara.js');
function execute(key, page) {
  if (C.isUrl(key)) return xtPage(C.fix(key), page);
  return xtPage(BASE_URL + '/?s=' + C.enc(key) + '&post_type=wp-manga', page);
}
