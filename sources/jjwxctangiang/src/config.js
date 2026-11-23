var BASE_URL = "https://www.jjwxc.net";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "req": { "charset": "gbk" },
 "tabs": {
  "言情金榜": "/topten.php?orderstr=4&t=0",
  "近代现代": "/topten.php?orderstr=4&t=1",
  "古代言情": "/topten.php?orderstr=4&t=2",
  "纯爱金榜": "/topten.php?orderstr=4&t=3",
  "新晋排行榜": "/topten.php?orderstr=1&t=0"
 },
 "search": "/search.php?kw={q}&t=1",
 "item": "tr:has(a[href*=\"onebook.php?novelid=\"])",
 "link": "a[href*=\"onebook.php?novelid=\"]@href",
 "title": "a[href*=\"onebook.php?novelid=\"]@title || a[href*=\"onebook.php?novelid=\"]",
 "desc": "a[href*=\"oneauthor.php\"]",
 "d_title": "h1 span[itemprop=articleSection] || h1 || meta[property=og:title]@content",
 "d_cover": "img.noveldefaultimage@src || img[itemprop=image]@src",
 "d_author": "span[itemprop=author] || h2 a",
 "d_desc": "div#novelintro || meta[name=Description]@content",
 "ch_list": "a[itemprop=url][href*=\"chapterid=\"]",
 "content": "div.noveltext"
};
