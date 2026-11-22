load('config.js');
load('vtv.js');
function execute(input, page) {
  return VTV.list(input || 'all');
}
