var BASE_URL = "https://ncode.syosetu.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var G = {
 "tabs": {
  "日間ランキング": "https://yomou.syosetu.com/rank/list/type/daily_total/[?p={p}]",
  "週間ランキング": "https://yomou.syosetu.com/rank/list/type/weekly_total/[?p={p}]",
  "月間ランキング": "https://yomou.syosetu.com/rank/list/type/monthly_total/[?p={p}]"
 },
 "search": "https://yomou.syosetu.com/search.php?word={q}[&p={p}]",
 "pageParam": "p",
 "q_cut": "[、。　 ]",
 "item": "div.p-ranklist-item, div.searchkekka_box, div.smpnovel_list",
 "title": "div.p-ranklist-item__title a || a.tl || span.novel_h",
 "link": "div.p-ranklist-item__title a@href || a.tl@href || a[href*='ncode.syosetu.com']@href",
 "d_title": "h1.p-novel__title || h1",
 "d_cover": "meta[property=og:image]@content || .thumb img@img || .poster img@img || img@img",
 "d_desc": "div.p-novel__summary || #novel_ex || meta[name=description]@content",
 "ch_list": "div.p-eplist__sublist a.p-eplist__subtitle, .p-eplist__sublist a",
 "s_item": "div.searchkekka_box, div.smpnovel_list",
 "s_title": "a.tl || span.novel_h",
 "s_link": "a.tl@href || a[href*='ncode.syosetu.com']@href",
 "s_cover": "img@img",
 "s_desc": "div.ex",
 "cover": "",
 "ch_next": "a.c-pager__item--next",
 "ch_fallback_single": "本文",
 "content": "div.p-novel__body",
 "c_title": "h1.p-novel__title || h1"
};
