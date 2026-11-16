load('config.js');
load('dm.js');
function execute(url) { var id = DM.id(url); return Response.success([{ name: 'Xem video', url: BASE_URL + '/video/' + id, host: BASE_URL }]); }
