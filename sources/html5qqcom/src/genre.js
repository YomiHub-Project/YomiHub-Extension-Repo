function execute() {
    var q = "&start={{page}}&count=20&sort=0&sub=";
    return Response.success([
        { title: "玄幻", input: "groupid=1501" + q, script: "gen.js" },
        { title: "都市", input: "groupid=1505" + q, script: "gen.js" },
        { title: "奇幻", input: "groupid=1502" + q, script: "gen.js" },
        { title: "武侠", input: "groupid=1503" + q, script: "gen.js" },
        { title: "历史", input: "groupid=1506" + q, script: "gen.js" },
        { title: "科幻", input: "groupid=1509" + q, script: "gen.js" },
        { title: "轻小说", input: "groupid=1512" + q, script: "gen.js" }
    ]);
}
