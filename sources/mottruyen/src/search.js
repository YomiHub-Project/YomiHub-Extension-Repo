load('config.js');
function execute(key, page, filters) {
  var cat = '';
  if (filters && Array.isArray(filters.genres) && filters.genres.length) cat = filters.genres[0];
  return listPage({ keyword: key || '', cat: cat }, page);
}
