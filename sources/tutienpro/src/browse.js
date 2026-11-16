load('config.js');
load('lib_common.js');
function execute(input, page) { return ttList(input || '/story/stories/?page_size=24', page); }
