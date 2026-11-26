load('config.js');
function execute() {
  var j = api('/category');
  var arr = (j && (j.sub_category || (j.data && j.data.sub_category))) || [];
  return Response.success(arr.map(function (c) {
    return { title: c.name, input: c.id, script: 'browse.js' };
  }));
}
