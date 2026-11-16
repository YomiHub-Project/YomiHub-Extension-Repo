load('config.js');
load('dm.js');
// channels (categories) of Dailymotion
function execute() {
  var j = DM.get(DM.API + '/channels?fields=id,name&limit=50&localization=vi');
  return Response.success(((j && j.list) || []).map(function (c) { return { title: c.name || c.id, input: 'channel=' + c.id + '&sort=trending', script: 'gen.js' }; }));
}
