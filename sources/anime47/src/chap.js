load('config.js');
load('lib_common.js');

function execute(url) {
  return Response.success([{
    title: 'Server Anime47',
    data: url
  }]);
}
