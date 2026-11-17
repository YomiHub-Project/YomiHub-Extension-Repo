load('config.js');
load('vtv.js');

function execute(url) {
  var slug = VTV.slug(url);
  return Response.success([
    {
      name: '🔴 Trực tiếp',
      url: BASE_URL + '/channel/' + slug,
      pay: false
    }
  ]);
}
