load('config.js');
load('vtv.js');

function execute(url) {
  var slug = VTV.slug(url);
  return Response.success([
    { title: 'VTV Go Server', data: slug }
  ]);
}
