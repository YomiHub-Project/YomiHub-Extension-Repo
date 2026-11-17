load('config.js');
load('lib_common.js');
load('lib_generic.js');

function execute(key, page) {
  var q = String(key || '').trim();
  if (q.length < 3) q = q ? (q + ' phim') : 'phim';
  return X.search(q, page);
}
