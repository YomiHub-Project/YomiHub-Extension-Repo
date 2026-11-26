var BASE_URL = "https://novel18.syosetu.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "req": {
  "headers": {
   "Cookie": "over18=yes"
  }
 },
 "tabs": {
  "日間ランキング": "https://noc.syosetu.com/rank/list/type/daily_total/[?p={p}]",
  "週間ランキング": "https://noc.syosetu.com/rank/list/type/weekly_total/[?p={p}]",
  "月間ランキング": "https://noc.syosetu.com/rank/list/type/monthly_total/[?p={p}]"
 },
 "search": "https://noc.syosetu.com/search/search/?word={q}[&p={p}]",
 "pageParam": "p",
 "item": "ul.ranking, ul.novellist, div.searchkekka_box",
 "title": "li.title a || a.tl",
 "link": "li.title a@href || a.tl@href",
 "d_title": "h1.p-novel__title || h1",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "div.p-novel__summary || #novel_ex || meta[name=description]@content",
 "ch_list": "div.p-eplist__sublist a.p-eplist__subtitle, .p-eplist__sublist a",
 "s_item": "ul.novellist, div.searchkekka_box",
 "s_title": "li.title a || a.tl",
 "s_link": "li.title a@href || a.tl@href",
 "s_cover": "img@img",
 "s_desc": "li.ex || div.ex",
 "cover": "",
 "ch_next": "a.c-pager__item--next",
 "ch_fallback_single": "本文",
 "content": "div.p-novel__body",
 "c_title": "h1.p-novel__title || h1"
};
