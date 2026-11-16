load('config.js');
load('lib_common.js');
load('lib_madara.js');
function execute(input, page) { return xtPage(BASE_URL + '/truyen/?m_orderby=' + (input || 'latest'), page); }
