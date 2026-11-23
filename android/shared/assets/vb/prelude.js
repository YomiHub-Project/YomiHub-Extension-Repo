// Rhino (Android) prelude for Aniyomi / Nekoyomi APKs. ES5 only.
// Provides the vBook API on top of `__host` (Kotlin: OkHttp + jsoup) and exposes __call() to Kotlin.
var __DEFAULT_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
function __s(v) { return v == null ? '' : String(v); }

// ---------- jsoup wrappers (same surface as runtime/dom.js) ----------
function __El(j) { this.j = j; }
__El.prototype = {
  select: function (c) { return __wrapEls(this.j.select(c)); },
  selectFirst: function (c) { var r = this.j.selectFirst(c); return r == null ? null : new __El(r); },
  is: function (c) { return !!this.j.is(c); },
  text: function () { return __s(this.j.text()); },
  ownText: function () { return __s(this.j.ownText()); },
  wholeText: function () { return __s(this.j.wholeText()); },
  data: function () { return __s(this.j.data()); },
  html: function () { return __s(this.j.html()); },
  outerHtml: function () { return __s(this.j.outerHtml()); },
  toString: function () { return __s(this.j.outerHtml()); },
  tagName: function () { return __s(this.j.tagName()); },
  nodeName: function () { return __s(this.j.nodeName()); },
  id: function () { return __s(this.j.id()); },
  className: function () { return __s(this.j.className()); },
  hasClass: function (c) { return !!this.j.hasClass(c); },
  attr: function (n, v) { if (v !== undefined) { this.j.attr(n, __s(v)); return this; } return __s(this.j.attr(n)); },
  absUrl: function (n) { return __s(this.j.absUrl(n)); },
  hasAttr: function (n) { return !!this.j.hasAttr(n); },
  removeAttr: function (n) { this.j.removeAttr(n); return this; },
  attributes: function () { var o = {}; var it = this.j.attributes().iterator(); while (it.hasNext()) { var a = it.next(); o[__s(a.getKey())] = __s(a.getValue()); } return o; },
  val: function () { return __s(this.j.val()); },
  parent: function () { var p = this.j.parent(); return p == null ? null : new __El(p); },
  parents: function () { return __wrapEls(this.j.parents()); },
  closest: function (c) { var p = this.j.closest(c); return p == null ? null : new __El(p); },
  children: function () { return __wrapEls(this.j.children()); },
  child: function (i) { try { return new __El(this.j.child(i)); } catch (e) { return null; } },
  childrenSize: function () { return this.j.childrenSize(); },
  nextElementSibling: function () { var n = this.j.nextElementSibling(); return n == null ? null : new __El(n); },
  previousElementSibling: function () { var n = this.j.previousElementSibling(); return n == null ? null : new __El(n); },
  siblingElements: function () { return __wrapEls(this.j.siblingElements()); },
  elementSiblingIndex: function () { return this.j.elementSiblingIndex(); },
  getElementsByTag: function (t) { return __wrapEls(this.j.getElementsByTag(t)); },
  getElementsByClass: function (c) { return __wrapEls(this.j.getElementsByClass(c)); },
  getElementById: function (i) { var r = this.j.getElementById(i); return r == null ? null : new __El(r); },
  remove: function () { this.j.remove(); return this; },
  empty: function () { this.j.empty(); return this; },
  title: function () { try { return __s(this.j.title()); } catch (e) { var t = this.j.selectFirst('title'); return t ? __s(t.text()) : ''; } },
  body: function () { try { return new __El(this.j.body()); } catch (e) { return this; } },
  head: function () { try { return new __El(this.j.head()); } catch (e) { return this; } },
  location: function () { return __s(this.j.baseUri()); }
};
var __EP = [];
function __wrapEls(jl) { var a = []; if (jl != null) { var n = jl.size(); for (var i = 0; i < n; i++) a.push(new __El(jl.get(i))); } return __mkEls(a); }
function __mkEls(a) { Object.setPrototypeOf(a, __ElsProto); return a; }
var __ElsProto = Object.create(Array.prototype);
(function () {
  var m = {
    size: function () { return this.length; }, isEmpty: function () { return this.length === 0; },
    get: function (i) { return this[i] || null; }, first: function () { return this[0] || null; }, last: function () { return this[this.length - 1] || null; },
    eq: function (i) { return __mkEls(this[i] ? [this[i]] : []); },
    text: function () { var o = []; for (var i = 0; i < this.length; i++) { var t = this[i].text(); if (t) o.push(t); } return o.join(' '); },
    eachText: function () { var o = []; for (var i = 0; i < this.length; i++) { var t = this[i].text(); if (t) o.push(t); } return o; },
    html: function () { var o = []; for (var i = 0; i < this.length; i++) o.push(this[i].html()); return o.join('\n'); },
    outerHtml: function () { var o = []; for (var i = 0; i < this.length; i++) o.push(this[i].outerHtml()); return o.join('\n'); },
    toString: function () { return this.outerHtml(); },
    attr: function (n, v) { var i; if (v !== undefined) { for (i = 0; i < this.length; i++) this[i].attr(n, v); return this; } for (i = 0; i < this.length; i++) if (this[i].hasAttr(n.replace(/^abs:/, ''))) return this[i].attr(n); return ''; },
    eachAttr: function (n) { var o = []; for (var i = 0; i < this.length; i++) if (this[i].hasAttr(n)) o.push(this[i].attr(n)); return o; },
    hasAttr: function (n) { for (var i = 0; i < this.length; i++) if (this[i].hasAttr(n)) return true; return false; },
    hasClass: function (c) { for (var i = 0; i < this.length; i++) if (this[i].hasClass(c)) return true; return false; },
    val: function () { return this.length ? this[0].val() : ''; },
    select: function (c) { var o = []; for (var i = 0; i < this.length; i++) { var r = this[i].select(c); for (var k = 0; k < r.length; k++) if (o.indexOf(r[k]) < 0) o.push(r[k]); } return __mkEls(o); },
    selectFirst: function (c) { for (var i = 0; i < this.length; i++) { var r = this[i].selectFirst(c); if (r) return r; } return null; },
    is: function (c) { for (var i = 0; i < this.length; i++) if (this[i].is(c)) return true; return false; },
    not: function (c) { var o = []; for (var i = 0; i < this.length; i++) if (!this[i].is(c)) o.push(this[i]); return __mkEls(o); },
    next: function () { var o = []; for (var i = 0; i < this.length; i++) { var n = this[i].nextElementSibling(); if (n) o.push(n); } return __mkEls(o); },
    prev: function () { var o = []; for (var i = 0; i < this.length; i++) { var n = this[i].previousElementSibling(); if (n) o.push(n); } return __mkEls(o); },
    parents: function () { var o = []; for (var i = 0; i < this.length; i++) o = o.concat(this[i].parents()); return __mkEls(o); },
    remove: function () { for (var i = 0; i < this.length; i++) this[i].remove(); return this; },
    empty: function () { for (var i = 0; i < this.length; i++) this[i].empty(); return this; },
    removeAttr: function (n) { for (var i = 0; i < this.length; i++) this[i].removeAttr(n); return this; }
  };
  for (var k in m) Object.defineProperty(__ElsProto, k, { value: m[k], writable: true, configurable: true });
})();

// ---------- vBook environment ----------
function __VResp(r, req) {
  this._r = r; this.status = r.status; this.ok = r.status >= 200 && r.status < 300; this.url = __s(r.url);
  this.statusText = String(r.status);
  try { this.headers = JSON.parse(__s(r.headers)); } catch (e) { this.headers = {}; }
  this.request = { url: req.url, headers: req.headers };
}
__VResp.prototype = {
  header: function (k) { for (var h in this.headers) if (h.toLowerCase() === String(k).toLowerCase()) return this.headers[h]; return ''; },
  text: function (cs) { return __s(this._r.text(cs || null)); },
  string: function (cs) { return this.text(cs); },
  html: function (cs) { return new __El(__host.parse(this.text(cs), this.url)); },
  json: function () { try { return JSON.parse(this.text()); } catch (e) { return null; } },
  base64: function () { return __s(this._r.base64()); },
  blob: function () { var self = this; return { size: this._r.size(), type: this.header('content-type'), base64: function () { return self.base64(); } }; }
};
function __qs(o) { var p = []; for (var k in o) p.push(encodeURIComponent(k) + '=' + encodeURIComponent(o[k])); return p.join('&'); }
var __env = {
  Response: { success: function (d, d2) { return { code: 0, data: d === undefined ? null : d, data2: d2 === undefined ? null : d2 }; }, error: function (m) { return { code: 1, data: __s(m) }; } },
  fetch: function (url, opts) {
    opts = opts || {}; var u = String(url);
    if (opts.queries) { var q = __qs(opts.queries); if (q) u += (u.indexOf('?') >= 0 ? '&' : '?') + q; }
    var h = { 'User-Agent': __DEFAULT_UA }; var k;
    if (opts.headers) for (k in opts.headers) h[k] = String(opts.headers[k]);
    var ck = __host.storageGet('__cookie__'); var hasCk = false; for (k in h) if (k.toLowerCase() === 'cookie') hasCk = true;
    if (ck && !hasCk) h.Cookie = __s(ck);
    var body = opts.body;
    if (body != null && typeof body === 'object') {
      var ct = null; for (k in h) if (k.toLowerCase() === 'content-type') ct = h[k];
      if (ct && /json/i.test(ct)) body = JSON.stringify(body); else { body = __qs(body); if (!ct) h['Content-Type'] = 'application/x-www-form-urlencoded'; }
    }
    var method = (opts.method || (body != null ? 'POST' : 'GET')).toUpperCase();
    var r = __host.request(u, method, JSON.stringify(h), body == null ? null : String(body));
    return new __VResp(r, { url: u, headers: h });
  },
  Html: { parse: function (s, b) { return new __El(__host.parse(__s(s), __s(b))); }, clean: function (s) { return __s(s); } },
  localStorage: { getItem: function (k) { var v = __host.storageGet('ls:' + k); return v == null ? null : __s(v); }, setItem: function (k, v) { __host.storageSet('ls:' + k, v == null ? null : String(v)); }, removeItem: function (k) { __host.storageSet('ls:' + k, null); }, clear: function () { } },
  cacheStorage: { getItem: function (k) { var v = __host.storageGet('cs:' + k); return v == null ? null : __s(v); }, setItem: function (k, v) { __host.storageSet('cs:' + k, v == null ? null : String(v)); }, removeItem: function (k) { __host.storageSet('cs:' + k, null); }, clear: function () { } },
  localConfig: { getItem: function (k) { var v = __host.config(k); return v == null ? null : __s(v); } },
  localCookie: { setCookie: function (c) { __host.storageSet('__cookie__', String(c).split(';')[0]); }, getCookie: function () { return __s(__host.storageGet('__cookie__')); } },
  sleep: function (ms) { __host.sleep(Number(ms) || 0); },
  Log: { log: function (m) { __host.log(typeof m === 'string' ? m : JSON.stringify(m)); } },
  console: { log: function (m) { __host.log(typeof m === 'string' ? m : JSON.stringify(m)); }, error: function (m) { __host.log(String(m)); }, warn: function (m) { __host.log(String(m)); }, info: function (m) { __host.log(String(m)); } },
  Console: { log: function (m) { __host.log(typeof m === 'string' ? m : JSON.stringify(m)); }, error: function (m) { __host.log(String(m)); }, warn: function (m) { __host.log(String(m)); }, info: function (m) { __host.log(String(m)); } },
  log: function (m) { __host.log(String(m)); },
  UserAgent: { system: function () { return __DEFAULT_UA; }, chrome: function () { return __DEFAULT_UA; }, android: function () { return __DEFAULT_UA; }, ios: function () { return __DEFAULT_UA; } },
  Engine: { newBrowser: function () { throw new Error('Headless browser is not available in Aniyomi/Nekoyomi'); } },
  Graphics: { createCanvas: function () { throw new Error('Graphics API not available'); }, createImage: function () { throw new Error('Graphics API not available'); } },
  Script: { execute: function () { throw new Error('Script.execute not available'); } }
};
__env.Http = {
  get: function (u) { return __httpB('GET', u); }, post: function (u) { return __httpB('POST', u); }
};
function __httpB(m, u) {
  var st = { method: m, headers: {}, body: undefined, queries: undefined };
  var b = {
    headers: function (h) { for (var k in h) st.headers[k] = h[k]; return b; }, header: function (k, v) { st.headers[k] = v; return b; },
    params: function (q) { st.queries = q; return b; }, queries: function (q) { st.queries = q; return b; }, body: function (x) { st.body = x; return b; },
    html: function (cs) { return __env.fetch(u, st).html(cs); }, string: function (cs) { return __env.fetch(u, st).text(cs); }, text: function (cs) { return __env.fetch(u, st).text(cs); }, json: function () { return __env.fetch(u, st).json(); }
  };
  return b;
}
// URL resolution for the engine (Rhino has no URL class)
function __abs(base, u) { u = __s(u).trim(); if (!u) return ''; if (/^data:|^blob:/.test(u)) return u; if (u.indexOf('//') === 0) return 'https:' + u; return __s(__host.resolve(base, u)); }

var __SRC = null, __ENG = null;
function __register(def) { __SRC = def; }
function __call(method) {
  var args = Array.prototype.slice.call(arguments, 1);
  try {
    if (!__ENG) {
      __ENG = new VBookEngine({ meta: __SRC.META, scripts: __SRC.SCRIPTS, env: __env, host: { config: function (k) { var v = __host.config(k); return v == null ? null : __s(v); }, log: function (m) { __host.log(String(m)); } } });
    }
    if (method === 'filters') {
      return JSON.stringify({ ok: true, result: __ENG.getFilters() });
    }
    if (method === 'popular' || method === 'latest') args[0] = parseInt(args[0], 10) || 1;
    if (method === 'search') {
      args[0] = __s(args[0]);
      args[1] = parseInt(args[1], 10) || 1;
      if (args.length > 2 && args[2] != null && args[2] !== '') {
        if (typeof args[2] === 'string') {
          try { args[2] = JSON.parse(args[2]); } catch (pe) { args[2] = {}; }
        }
      } else if (args.length > 2) {
        args[2] = {};
      }
    }
    var mapped = [];
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      mapped.push((typeof a === 'number' || (a && typeof a === 'object')) ? a : __s(a));
    }
    var r = __ENG[method].apply(__ENG, mapped);
    return JSON.stringify({ ok: true, result: r });
  } catch (e) {
    return JSON.stringify({ error: true, message: __s(e && (e.message || e)) });
  }
}

function abs(base, u) {
    if (!u)
        return '';
    u = String(u).trim();
    if (/^data:|^blob:/.test(u))
        return u;
    if (u.startsWith('//'))
        return 'https:' + u;
    if (typeof __abs === 'function')
        return __abs(base, u);
    try {
        return resolveUrl(base, u);
    }
    catch (e) {
        return u;
    }
}
var str = function (v) { return (v == null ? '' : String(v)); };
var uniq = function (a) { return a.filter(function (x, i) { return x && a.indexOf(x) === i; }); };
var DEFAULT_VIDEO_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';
function originOf(u, fallback) {
    var m = /^https?:\/\/[^/?#]+/i.exec(str(u));
    return m ? m[0] : str(fallback || '').replace(/\/+$/, '');
}
function isAdIframeUrl(u) {
    u = str(u).trim();
    if (!u || /^(?:about:blank|javascript:|data:text\/html)/i.test(u))
        return true;
    return /(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google|adnxs\.com|popads\.net|popcash\.net|exoclick\.com|juicyads\.com|trafficjunky|mgid\.com|adsterra|propellerads|clickadu|hilltopads|adskeeper|a-ads\.com|monetag|onclickads|tsyndicate|realsrv|betteradsystem|\/popunder|\/ads\.(?:js|html|php))/i.test(u);
}
function unwrapPlayerUrl(u) {
    var cur = str(u).trim();
    for (var i = 0; i < 2; i++) {
        var m = /[?&](?:url|file|src|link|stream|v)=([^&#]+)/i.exec(cur);
        if (!m)
            break;
        try {
            var dec = decodeURIComponent(m[1]).trim();
            if (/^https?:\/\//i.test(dec) && dec !== cur)
                cur = dec;
            else
                break;
        }
        catch (e) {
            break;
        }
    }
    return cur;
}
function b64decEs5(s) {
    if (!s)
        return '';
    try {
        if (typeof atob === 'function')
            return atob(s);
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var out = '', buf = 0, bits = 0;
        for (var i = 0; i < s.length; i++) {
            var idx = chars.indexOf(s.charAt(i));
            if (idx < 0 || s.charAt(i) === '=')
                break;
            buf = (buf << 6) | idx;
            bits += 6;
            if (bits >= 8) {
                bits -= 8;
                out += String.fromCharCode((buf >> bits) & 0xff);
            }
        }
        return out;
    }
    catch (e) {
        return '';
    }
}
function unpackDeanEdwards(p) {
    if (!p || p.indexOf('eval(function(p,a,c,k,e,') < 0)
        return p;
    try {
        var re = /eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]*?\}\s*\('((?:\\.|[^'\\])*)',\s*(\d+),\s*(\d+),\s*'([^']*)'\.split\('\|'\)/g;
        var out = [];
        var m = void 0, blocks = 0;
        var _loop_1 = function () {
            blocks++;
            var payload = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
            var radix = parseInt(m[2], 10), count = parseInt(m[3], 10), keywords = m[4].split('|');
            var decode = function (c) { return (c < radix ? '' : decode(Math.floor(c / radix))) + ((c = c % radix) > 35 ? String.fromCharCode(c + 29) : c.toString(36)); };
            var dict = {};
            for (var i = 0; i < count; i++)
                dict[decode(i)] = keywords[i] || decode(i);
            out.push(payload.replace(/\b\w+\b/g, function (w) { return dict[w] || w; }));
        };
        while ((m = re.exec(p)) && blocks < 5) {
            _loop_1();
        }
        return out.length ? out.join('\n') : p;
    }
    catch (e) {
        return p;
    }
}
function sniffDirectStream(text) {
    if (!text)
        return '';
    var raw = str(text).replace(/\\\//g, '/').replace(/\\u002[fF]/g, '/').replace(/\\x2[fF]/g, '/').replace(/&amp;/g, '&');
    if (raw.indexOf('eval(function(p,a,c,k,e,') >= 0)
        raw += '\n' + unpackDeanEdwards(raw);
    var pick = function (c) { c = unwrapPlayerUrl(c); return c && !isAdIframeUrl(c) ? c : ''; };
    var m3u8 = raw.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/gi) || [];
    for (var i = 0; i < m3u8.length; i++) {
        var c = pick(m3u8[i]);
        if (c)
            return c;
    }
    var us = raw.match(/(?:var\s+urlStream|hlsUrl|streamUrl|videoUrl|play_url|m3u8Url)\s*[:=]\s*["'](https?:[^"']+)["']/i);
    if (us) {
        var c = pick(us[1]);
        if (c && /\.(?:m3u8|mp4)/i.test(c))
            return c;
    }
    var mp4 = raw.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/gi) || [];
    for (var i = 0; i < mp4.length; i++) {
        var c = pick(mp4[i]);
        if (c)
            return c;
    }
    var b64re = /["'](aHR0c[A-Za-z0-9+/=]{16,})["']/g;
    var bm;
    while ((bm = b64re.exec(raw))) {
        var dec = pick(b64decEs5(bm[1]));
        if (dec && /\.(?:m3u8|mp4)/i.test(dec))
            return dec;
    }
    return '';
}
var STANDARD_FILTERS = {
    sort: [
        { label: 'Mặc định', value: '' },
        { label: 'Mới cập nhật', value: 'latest' },
        { label: 'Phổ biến nhất', value: 'popular' },
        { label: 'Xem nhiều nhất', value: 'views' },
        { label: 'Đánh giá cao', value: 'rating' },
        { label: 'Tên A-Z', value: 'az' },
    ],
    status: [
        { label: 'Tất Cả', value: '' },
        { label: 'Đang Tiến Hành', value: 'ongoing' },
        { label: 'Tạm Ngưng', value: 'hiatus' },
        { label: 'Hoàn Thành', value: 'completed' },
    ],
    content_rating: [
        { label: 'Tất Cả', value: '' },
        { label: 'An toàn (SFW)', value: 'sfw' },
        { label: '18+ (NSFW)', value: 'nsfw' },
    ],
    country: [
        { label: 'Tất Cả', value: '' },
        { label: 'Việt Nam', value: 'vn' },
        { label: 'Trung Quốc', value: 'cn' },
        { label: 'Nhật Bản', value: 'jp' },
        { label: 'Hàn Quốc', value: 'kr' },
        { label: 'Âu Mỹ', value: 'us' },
        { label: 'Khác', value: 'other' },
    ],
    year: [
        { label: 'Tất Cả', value: '' },
        { label: '2026', value: '2026' },
        { label: '2025', value: '2025' },
        { label: '2024', value: '2024' },
        { label: '2023', value: '2023' },
        { label: '2022', value: '2022' },
        { label: '2021', value: '2021' },
        { label: '2020', value: '2020' },
        { label: 'Trước 2020', value: 'before_2020' },
    ],
    search_by: [
        { label: 'Tên', value: 'title' },
        { label: 'Tác giả', value: 'author' },
        { label: 'Từ khóa', value: 'keyword' },
    ],
    rating: [
        { label: 'Tất Cả', value: '' },
        { label: 'Từ 9+ sao', value: '9' },
        { label: 'Từ 8+ sao', value: '8' },
        { label: 'Từ 7+ sao', value: '7' },
        { label: 'Từ 5+ sao', value: '5' },
    ],
    translation: [
        { label: 'Tất Cả', value: '' },
        { label: 'Vietsub / Dịch', value: 'sub' },
        { label: 'Thuyết minh / Lồng tiếng', value: 'dub' },
        { label: 'Convert', value: 'convert' },
        { label: 'Raw / Gốc', value: 'raw' },
    ],
    genresByType: {
        video: ['Hành động', 'Tình cảm', 'Hài hước', 'Cổ trang', 'Hoạt hình', 'Kinh dị', 'Viễn tưởng', 'Tâm lý', 'Võ thuật', 'Phiêu lưu', 'Anime', '18+'],
        comic: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Manhwa', 'Manhua', 'Manga', 'Romance', 'School Life', 'Shounen', 'Slice of Life', 'Tiên Hiệp', 'Xuyên Không'],
        novel: ['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn', 'Xuyên Không', 'Trọng Sinh', 'Hệ Thống', 'Đam Mỹ', 'Bách Hợp', 'Light Novel', 'Mạt Thế'],
    },
};
function dedupeOptions(arr) {
    var out = [], seenLabel = {}, seenVal = {};
    for (var i = 0; i < arr.length; i++) {
        var o = arr[i];
        if (!o)
            continue;
        var label = str(o.label != null ? o.label : o.title || o.name).trim();
        var value = str(o.value != null ? o.value : o.input || label).trim();
        if (!label || seenLabel[label] || (value !== '' && seenVal[value]))
            continue;
        seenLabel[label] = 1;
        if (value !== '')
            seenVal[value] = 1;
        out.push({ label: label, value: value });
    }
    return out;
}
function buildFilterSchema(meta, tabs, genres) {
    meta = meta || {};
    var catOpts = [{ label: 'Tất Cả', value: '' }];
    if (Array.isArray(tabs) && tabs.length) {
        for (var i = 0; i < tabs.length; i++) {
            var t = tabs[i];
            if (!t)
                continue;
            var title = str(t.title || t.name || ('Danh mục ' + (i + 1))).trim();
            if (title)
                catOpts.push({ label: title, value: 'tab:' + i });
        }
    }
    else {
        catOpts.push({ label: 'Phổ biến', value: 'popular' }, { label: 'Mới cập nhật', value: 'latest' }, { label: 'Hoàn thành', value: 'completed' });
    }
    var typeKey = meta.type === 'video' ? 'video' : meta.type === 'comic' ? 'comic' : 'novel';
    var rawGenres = (Array.isArray(genres) && genres.length)
        ? genres.map(function (g) { return (typeof g === 'string' ? { label: g, value: g } : { label: str(g.title || g.name || g.label), value: str(g.input || g.value || g.title || g.name) }); })
        : (STANDARD_FILTERS.genresByType[typeKey] || STANDARD_FILTERS.genresByType.novel).map(function (g) { return ({ label: g, value: g }); });
    return [
        { id: 'sort', title: 'Sắp Xếp', type: 'sort', options: STANDARD_FILTERS.sort.slice(), defaultValue: '' },
        { id: 'status', title: 'Tình Trạng', type: 'select', options: STANDARD_FILTERS.status.slice(), defaultValue: '' },
        { id: 'category', title: 'Danh Mục', type: 'select', options: dedupeOptions(catOpts), defaultValue: '' },
        { id: 'content_rating', title: 'Phân Loại Nội Dung', type: 'select', options: STANDARD_FILTERS.content_rating.slice(), defaultValue: '' },
        { id: 'country', title: 'Quốc Gia Phát Hành', type: 'select', options: STANDARD_FILTERS.country.slice(), defaultValue: '' },
        { id: 'year', title: 'Năm Phát Hành', type: 'select', options: STANDARD_FILTERS.year.slice(), defaultValue: '' },
        { id: 'search_by', title: 'Tìm Theo', type: 'text', placeholder: 'Tên, Tác giả hoặc Từ khóa', options: STANDARD_FILTERS.search_by.slice(), defaultValue: '' },
        { id: 'rating', title: 'Đánh Giá', type: 'select', options: STANDARD_FILTERS.rating.slice(), defaultValue: '' },
        { id: 'translation', title: 'Bản Dịch', type: 'select', options: STANDARD_FILTERS.translation.slice(), defaultValue: '' },
        { id: 'genres', title: 'Thể Loại', type: 'multi-select', options: dedupeOptions(rawGenres), defaultValue: [] },
    ];
}
function normalizeFilters(raw) {
    var out = {
        sort: '', sortAscending: false, status: '', category: '', content_rating: '',
        country: '', year: '', search_by: '', rating: '', translation: '', genres: [], feed: '',
    };
    if (!raw)
        return out;
    var f = raw;
    if (typeof f === 'string') {
        var s = f.trim();
        if (!s)
            return out;
        try {
            f = JSON.parse(s);
        }
        catch (e) {
            return out;
        }
    }
    if (!f || typeof f !== 'object')
        return out;
    if (Array.isArray(f)) {
        for (var i = 0; i < f.length; i++) {
            var item = f[i];
            if (!item || typeof item !== 'object')
                continue;
            if (item.Text && item.Text.id) {
                out[item.Text.id] = str(item.Text.value).trim();
                continue;
            }
            if (item.Select && item.Select.id) {
                out[item.Select.id] = str(item.Select.value).trim();
                continue;
            }
            if (item.Sort && item.Sort.id) {
                var opt = STANDARD_FILTERS.sort[item.Sort.index | 0];
                out.sort = opt ? opt.value : '';
                out.sortAscending = !!item.Sort.ascending;
                continue;
            }
            if (item.MultiSelect && item.MultiSelect.id) {
                out[item.MultiSelect.id] = Array.isArray(item.MultiSelect.included) ? item.MultiSelect.included.map(str).filter(Boolean) : [];
                continue;
            }
            var key = str(item.type || item.id).trim();
            if (!key)
                continue;
            if (item.type_name === 'SortFilter') {
                var idx = item.state && typeof item.state === 'object' ? (item.state.index | 0) : (item.state | 0);
                var vals = Array.isArray(item.values) ? item.values : STANDARD_FILTERS.sort;
                var chosen = vals[idx];
                out.sort = chosen ? str(chosen.value != null ? chosen.value : (STANDARD_FILTERS.sort[idx] ? STANDARD_FILTERS.sort[idx].value : '')) : '';
                out.sortAscending = !!(item.state && item.state.ascending);
            }
            else if (item.type_name === 'SelectFilter') {
                var v = Array.isArray(item.values) && item.values[item.state | 0];
                if (key in out)
                    out[key] = v ? str(v.value) : '';
            }
            else if (item.type_name === 'TextFilter') {
                if (key in out)
                    out[key] = str(item.state).trim();
            }
            else if (item.type_name === 'GroupFilter' && Array.isArray(item.state)) {
                var sel = [];
                for (var j = 0; j < item.state.length; j++) {
                    var cb = item.state[j];
                    if (cb && cb.state === true)
                        sel.push(str(cb.value || cb.name).trim());
                }
                if (key === 'genres' || key === 'genre')
                    out.genres = sel.filter(Boolean);
            }
        }
        return out;
    }
    var pickVal = function (v) { return (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v) ? v.value : v; };
    var sVal = pickVal(f.sort);
    if (sVal && typeof sVal === 'object') {
        if ('index' in sVal) {
            var opt = STANDARD_FILTERS.sort[sVal.index | 0];
            out.sort = opt ? opt.value : '';
            out.sortAscending = !!sVal.ascending;
        }
        else if ('key' in sVal) {
            out.sort = str(sVal.key);
            out.sortAscending = sVal.direction === 'asc' || sVal.direction === 0 || !!sVal.ascending;
        }
    }
    else {
        out.sort = str(sVal).trim();
        if ('sortAscending' in f)
            out.sortAscending = !!f.sortAscending;
    }
    var strKeys = ['status', 'category', 'content_rating', 'country', 'year', 'search_by', 'rating', 'translation', 'feed'];
    for (var i = 0; i < strKeys.length; i++) {
        var k = strKeys[i];
        if (f[k] != null)
            out[k] = str(pickVal(f[k])).trim();
    }
    var gRaw = pickVal(f.genres != null ? f.genres : f.genre);
    if (Array.isArray(gRaw))
        out.genres = gRaw.map(str).filter(Boolean);
    else if (gRaw && typeof gRaw === 'object' && Array.isArray(gRaw.include))
        out.genres = gRaw.include.map(str).filter(Boolean);
    else if (typeof gRaw === 'string' && gRaw.trim())
        out.genres = gRaw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    return out;
}
function isDefaultFilters(f) {
    if (!f)
        return true;
    return !f.sort && !f.status && !f.category && !f.content_rating && !f.country && !f.year &&
        !f.search_by && !f.rating && !f.translation && (!f.genres || !f.genres.length) && !f.feed;
}
function parseScore(txt) {
    var m = /(?:(\d+(?:\.\d+)?)\s*(?:\/\s*10|sao|★)|★\s*(\d+(?:\.\d+)?))/i.exec(str(txt));
    if (!m)
        return null;
    var n = parseFloat(m[1] || m[2]);
    return isNaN(n) ? null : n;
}
function parseYear(txt) {
    var m = /\b((?:19|20)\d{2})\b/.exec(str(txt));
    return m ? parseInt(m[1], 10) : null;
}
var COUNTRY_RE = {
    vn: /(?:việt nam|vietnam|truyện việt|phim việt|\bvn\b)/i,
    cn: /(?:trung quốc|china|manhua|tiên hiệp|huyền huyễn|ngôn tình|đam mỹ|convert|\bcn\b)/i,
    jp: /(?:nhật bản|japan|manga|anime|light novel|isekai|\bjp\b)/i,
    kr: /(?:hàn quốc|korea|manhwa|webtoon|\bkr\b)/i,
    us: /(?:âu mỹ|usa|\bus\b|\buk\b|comic|marvel|hollywood)/i,
};
var TRANS_RE = {
    sub: /(?:vietsub|bản dịch|dịch|\bsub\b|trans)/i,
    dub: /(?:thuyết minh|lồng tiếng|\bdub\b)/i,
    convert: /(?:convert|\bcv\b)/i,
    raw: /(?:raw|gốc|engsub|english)/i,
};
function applyClientFilters(items, f, meta) {
    if (!Array.isArray(items) || !items.length)
        return items || [];
    var res = items.slice();
    var textOf = function (it) { return (str(it.name) + ' ' + str(it.description) + ' ' + str(it.tag)).toLowerCase(); };
    if (f.content_rating === 'nsfw') {
        if (!(meta && meta.nsfw)) {
            var matched = res.filter(function (it) { return /(?:18\+|nsfw|hentai|ecchi|adult|smut|sắc|jav)/i.test(textOf(it)); });
            res = matched;
        }
    }
    else if (f.content_rating === 'sfw') {
        if (meta && meta.nsfw)
            return [];
        res = res.filter(function (it) { return !/(?:18\+|nsfw|hentai|adult|jav)/i.test(textOf(it)); });
    }
    if (f.status === 'ongoing') {
        res = res.filter(function (it) { return !/(?:hoàn thành|hoàn tất|completed|đã kết thúc|\bfull\b)/i.test(textOf(it)); });
    }
    else if (f.status === 'completed') {
        var hasStatusInfo = res.some(function (it) { return /(?:hoàn thành|hoàn tất|completed|\bfull\b|đang tiến hành|ongoing|tạm ngưng|hiatus)/i.test(textOf(it)); });
        if (hasStatusInfo)
            res = res.filter(function (it) { return /(?:hoàn|complete|full|end)/i.test(textOf(it)); });
    }
    else if (f.status === 'hiatus') {
        var hasHiatus = res.some(function (it) { return /(?:tạm ngưng|tạm dừng|hiatus|drop)/i.test(textOf(it)); });
        if (hasHiatus)
            res = res.filter(function (it) { return /(?:tạm ngưng|tạm dừng|hiatus|drop)/i.test(textOf(it)); });
    }
    if (f.country) {
        var re_1 = COUNTRY_RE[f.country];
        if (re_1) {
            var hasCountry = res.some(function (it) { return COUNTRY_RE.vn.test(textOf(it)) || COUNTRY_RE.cn.test(textOf(it)) || COUNTRY_RE.jp.test(textOf(it)) || COUNTRY_RE.kr.test(textOf(it)) || COUNTRY_RE.us.test(textOf(it)); });
            if (hasCountry)
                res = res.filter(function (it) { return re_1.test(textOf(it)); });
        }
        else if (f.country === 'other') {
            var hasKnown = res.some(function (it) { return COUNTRY_RE.vn.test(textOf(it)) || COUNTRY_RE.cn.test(textOf(it)) || COUNTRY_RE.jp.test(textOf(it)) || COUNTRY_RE.kr.test(textOf(it)) || COUNTRY_RE.us.test(textOf(it)); });
            if (hasKnown)
                res = res.filter(function (it) { return !COUNTRY_RE.vn.test(textOf(it)) && !COUNTRY_RE.cn.test(textOf(it)) && !COUNTRY_RE.jp.test(textOf(it)) && !COUNTRY_RE.kr.test(textOf(it)) && !COUNTRY_RE.us.test(textOf(it)); });
        }
    }
    if (f.year) {
        var hasYear = res.some(function (it) { return parseYear(textOf(it)) !== null; });
        if (hasYear) {
            res = res.filter(function (it) {
                var y = parseYear(textOf(it));
                if (y === null)
                    return false;
                return f.year === 'before_2020' ? y < 2020 : String(y) === f.year;
            });
        }
    }
    if (f.rating) {
        var minScore_1 = parseFloat(f.rating);
        if (!isNaN(minScore_1)) {
            var hasScore = res.some(function (it) { return parseScore(textOf(it)) !== null; });
            if (hasScore) {
                res = res.filter(function (it) {
                    var sc = parseScore(textOf(it));
                    return sc !== null && sc >= minScore_1;
                });
            }
        }
    }
    if (f.translation && TRANS_RE[f.translation]) {
        var tre_1 = TRANS_RE[f.translation];
        var hasTrans = res.some(function (it) { return TRANS_RE.sub.test(textOf(it)) || TRANS_RE.dub.test(textOf(it)) || TRANS_RE.convert.test(textOf(it)) || TRANS_RE.raw.test(textOf(it)); });
        if (hasTrans)
            res = res.filter(function (it) { return tre_1.test(textOf(it)); });
    }
    if (f.genres && f.genres.length) {
        var wanted_1 = f.genres.map(function (g) { return g.toLowerCase(); }).filter(function (g) { return !/^https?:\/\//.test(g) && g.charAt(0) !== '/'; });
        if (wanted_1.length) {
            var hasGenreTag = res.some(function (it) { return wanted_1.some(function (g) { return textOf(it).indexOf(g) >= 0; }); });
            if (hasGenreTag)
                res = res.filter(function (it) { return wanted_1.some(function (g) { return textOf(it).indexOf(g) >= 0; }); });
        }
    }
    if (f.sort === 'az') {
        res.sort(function (a, b) { return str(a.name).localeCompare(str(b.name)); });
    }
    else if (f.sort === 'rating') {
        if (res.some(function (it) { return parseScore(textOf(it)) !== null; })) {
            res.sort(function (a, b) { return (parseScore(textOf(b)) || 0) - (parseScore(textOf(a)) || 0); });
        }
    }
    return res;
}
var VBookEngine = (function () {
    function VBookEngine(opts) {
        var meta = opts.meta, scripts = opts.scripts, host = opts.host;
        this.meta = meta;
        this.host = host;
        this.env = opts.env || createEnv(host, meta);
        {
            var env_1 = this.env, f_1 = env_1.fetch, self_1 = this;
            if (typeof f_1 === 'function' && !f_1.__kiriLive) {
                var w = function (u, o) { return f_1.call(env_1, self_1.live(u), o); };
                w.__kiriLive = true;
                env_1.fetch = w;
            }
        }
        this.scripts = scripts;
        this.cache = {};
        this.tokens = {};
    }
    Object.defineProperty(VBookEngine.prototype, "base", {
        get: function () {
            var ok = function (v) { v = str(v).trim(); return /^https?:\/\/[^/?#\s]+/i.test(v) ? v : ''; };
            return (ok(this.host.config('DOMAIN_CUSTOM')) || ok(this.host.config('DOMAIN')) || ok((this.meta.configDefaults || {}).DOMAIN) || str(this.meta.source)).replace(/\/+$/, '');
        },
        enumerable: false,
        configurable: true
    });
    VBookEngine.prototype.live = function (u) {
        u = str(u);
        var o = this.origins;
        if (!o.def)
            return u;
        var b = (/^https?:\/\/[^/?#]+/i.exec(this.base) || [])[0];
        if (!b || o.key(b) === o.key(o.def))
            return u;
        var m = /^https?:\/\/[^/?#]+/i.exec(u);
        if (!m || m[0] === b)
            return u;
        var h = o.key(m[0]);
        if (o.hosts[h] !== 1 || h === o.key(b))
            return u;
        return b + u.slice(m[0].length);
    };
    Object.defineProperty(VBookEngine.prototype, "origins", {
        get: function () {
            if (this._orig)
                return this._orig;
            var d = (this.meta.config || {}).DOMAIN || {};
            var key = function (u) { var m = /^https?:\/\/(?:www\.|m\.)?([^/?#:]+)/i.exec(str(u).trim()); return m ? m[1].toLowerCase() : ''; };
            var set = {};
            [this.meta.source, d.default].concat(d.values || []).map(key).filter(Boolean).forEach(function (h) { set[h] = 1; });
            var m0 = /^https?:\/\/[^/?#]+/i.exec(str(this.meta.source));
            this._orig = { key: key, hosts: set, def: m0 ? m0[0] : '' };
            return this._orig;
        },
        enumerable: false,
        configurable: true
    });
    VBookEngine.prototype.canon = function (u) {
        u = str(u);
        var o = this.origins;
        if (!o.def)
            return u;
        var m = /^https?:\/\/[^/?#]+/i.exec(u);
        if (!m)
            return u;
        var h = o.key(m[0]);
        return (o.hosts[h] === 1 || h === o.key(this.base)) ? o.def + u.slice(m[0].length) : u;
    };
    VBookEngine.prototype.decanon = function (u) {
        u = str(u);
        var o = this.origins;
        if (!o.def)
            return u;
        var b = (/^https?:\/\/[^/?#]+/i.exec(this.base) || [])[0];
        if (!b || b === o.def)
            return u;
        return u.slice(0, o.def.length) === o.def ? b + u.slice(o.def.length) : u;
    };
    VBookEngine.prototype.has = function (name) { return !!this.scripts[name]; };
    VBookEngine.prototype.run = function (name) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var factory = this.scripts[name];
        if (!factory)
            throw new Error('script ' + name + ' missing');
        var cfg = function (k) { if (k === 'DOMAIN')
            return _this.base; var v = _this.host.config(k); return v == null ? (_this.meta.configDefaults || {})[k] : v; };
        var exec = factory(this.env, cfg);
        if (typeof exec !== 'function')
            throw new Error(name + ': execute() not defined');
        var callArgs = args.map(function (a) { return (a && typeof a === 'object' ? a : str(a)); });
        var res = exec.apply(void 0, callArgs);
        if (!res)
            throw new Error(name + ': empty result');
        if (res.code !== 0)
            throw new Error(name + ': ' + str(res.data || 'error'));
        return res;
    };
    VBookEngine.prototype.scriptFile = function (s) { return str(s).replace(/\.js$/, ''); };
    VBookEngine.prototype.tabs = function () {
        if (this.cache.tabs)
            return this.cache.tabs;
        var tabs = [];
        try {
            if (this.has('home'))
                tabs = (this.run('home')).data || [];
        }
        catch (e) {
            this.host.log && this.host.log('home: ' + e.message);
        }
        if (!tabs.length && this.has('genre')) {
            try {
                tabs = ((this.run('genre')).data || []).slice(0, 2);
            }
            catch (e) { }
        }
        this.cache.tabs = tabs.filter(function (t) { return t && t.script; });
        return this.cache.tabs;
    };
    VBookEngine.prototype.genres = function () {
        if (this.cache.genres)
            return this.cache.genres;
        var list = [];
        try {
            if (this.has('genre'))
                list = (this.run('genre')).data || [];
        }
        catch (e) {
            this.host.log && this.host.log('genre: ' + e.message);
        }
        this.cache.genres = list.filter(Boolean);
        return this.cache.genres;
    };
    VBookEngine.prototype.getFilters = function () {
        if (this.cache.filters)
            return this.cache.filters;
        var tabs = this.tabs();
        var genres = this.genres();
        this.cache.filters = buildFilterSchema(this.meta, tabs, genres);
        return this.cache.filters;
    };
    VBookEngine.prototype.list = function (scriptName, input, page, filterArg) {
        var _this = this;
        var sig = filterArg ? '|' + JSON.stringify(filterArg) : '';
        var key = scriptName + '|' + input + sig;
        page = Math.max(1, page | 0);
        var tok = page === 1 ? '' : this.tokens[key + '|' + page];
        if (page > 1 && tok == null)
            return { items: [], hasNext: false };
        var r = filterArg ? this.run(scriptName, input, tok, filterArg) : this.run(scriptName, input, tok);
        var next = str(r.data2);
        if (next)
            this.tokens[key + '|' + (page + 1)] = next;
        var items = (r.data || []).filter(Boolean).map(function (it) { return ({
            name: str(it.name).trim(), link: _this.canon(abs(it.host || _this.base + '/', it.link)), cover: abs(it.host || _this.base + '/', it.cover),
            description: str(it.description), tag: str(it.tag),
        }); }).filter(function (it) { return it.name && it.link; });
        return { items: items, hasNext: !!next && items.length > 0 };
    };
    VBookEngine.prototype.popular = function (page) {
        var tabs = this.tabs();
        if (tabs[0])
            return this.list(this.scriptFile(tabs[0].script), str(tabs[0].input), page);
        return this.search('', page);
    };
    VBookEngine.prototype.latest = function (page) {
        var tabs = this.tabs();
        var t = tabs[1] || tabs[0];
        if (t)
            return this.list(this.scriptFile(t.script), str(t.input), page);
        return this.search('', page);
    };
    VBookEngine.prototype.search = function (q, page, rawFilters) {
        var f = normalizeFilters(rawFilters);
        if (isDefaultFilters(f)) {
            if (!this.has('search'))
                return { items: [], hasNext: false };
            return this.list('search', q, page);
        }
        var query = str(q).trim();
        var sb = str(f.search_by).trim();
        var isModeOnly = /^(?:title|author|keyword|tên|tác giả|từ khóa)$/i.test(sb);
        if (sb && !isModeOnly && !query)
            query = sb;
        var res = null;
        if (f.feed === 'shorts' && !query) {
            var tabs = this.tabs();
            var st = tabs.find(function (t) { return /short/i.test(str(t.title || t.name) + ' ' + str(t.input)); });
            if (st)
                res = this.list(this.scriptFile(st.script), str(st.input), page);
        }
        if (!res && !query && f.genres && f.genres.length) {
            var g0_1 = f.genres[0];
            var glist = this.genres();
            var match = glist.find(function (g) { return str(g.input) === g0_1 || str(g.title || g.name).toLowerCase() === g0_1.toLowerCase(); });
            if (match && match.input) {
                var scr = this.scriptFile(match.script || 'search');
                if (this.has(scr))
                    res = this.list(scr, str(match.input), page);
            }
            else if (/^https?:\/\/|^\//i.test(g0_1) && this.has('search')) {
                res = this.list('search', g0_1, page);
            }
        }
        if (!res && !query && f.category) {
            var tabs = this.tabs();
            var tab = null;
            if (/^tab:\d+$/.test(f.category))
                tab = tabs[parseInt(f.category.slice(4), 10)] || null;
            else
                tab = tabs.find(function (t) { return str(t.title || t.name).toLowerCase() === f.category.toLowerCase() || str(t.input) === f.category; }) || null;
            if (tab)
                res = this.list(this.scriptFile(tab.script), str(tab.input), page);
            else if (f.category === 'latest')
                res = this.latest(page);
            else if (f.category === 'popular')
                res = this.popular(page);
            else if (f.category === 'completed') {
                var ctab = tabs.find(function (t) { return /hoàn|full|complete/i.test(str(t.title || t.name)); });
                if (ctab)
                    res = this.list(this.scriptFile(ctab.script), str(ctab.input), page);
            }
            else if (/^https?:\/\/|^\//i.test(f.category) && this.has('search')) {
                res = this.list('search', f.category, page);
            }
        }
        if (!res) {
            if (query) {
                if (!this.has('search'))
                    return { items: [], hasNext: false };
                res = this.list('search', query, page, f);
            }
            else {
                if (f.sort === 'latest')
                    res = this.latest(page);
                else {
                    var tabs = this.tabs();
                    if (tabs[0])
                        res = this.list(this.scriptFile(tabs[0].script), str(tabs[0].input), page);
                    else if (this.has('search'))
                        res = this.list('search', '', page, f);
                    else
                        res = { items: [], hasNext: false };
                }
            }
        }
        return { items: applyClientFilters(res.items || [], f, this.meta), hasNext: !!res.hasNext };
    };
    VBookEngine.prototype.detail = function (url) {
        url = this.decanon(url);
        var d = (this.run('detail', url)).data || {};
        var genres = [].concat(d.genres || [], d.tags || []).map(function (g) { return (typeof g === 'string' ? g : g && g.title); }).filter(Boolean);
        return {
            name: str(d.name).trim(), cover: abs(d.host || this.base + '/', d.cover), author: str(d.author).trim(),
            description: stripHtml(str(d.description)), detail: stripHtml(str(d.detail)), ongoing: d.ongoing !== false && d.ongoing !== 'false',
            genres: uniq(genres.map(function (s) { return String(s).trim(); })), url: this.canon(url), format: str(d.format),
        };
    };
    VBookEngine.prototype.chapters = function (url) {
        var _this = this;
        url = this.decanon(url);
        var list = [];
        if (this.meta.type === 'novel' && this.has('page') && this.has('toc')) {
            var pages = (this.run('page', url)).data || [url];
            for (var _i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                var p = pages_1[_i];
                list = list.concat((this.run('toc', str(p))).data || []);
            }
        }
        else if (this.has('toc'))
            list = (this.run('toc', url)).data || [];
        return list.filter(function (c) { return c && c.url && c.type !== 'section'; }).map(function (c, i) { return ({ name: str(c.name).trim() || ('#' + (i + 1)), url: _this.canon(abs(c.host || _this.base + '/', c.url)), pay: !!(c.pay || c.lock) }); });
    };
    VBookEngine.prototype.pages = function (url) {
        var _this = this;
        url = this.decanon(url);
        var data;
        if (this.has('chap') && this.meta.type === 'comic')
            data = (this.run('chap', url)).data;
        else if (this.has('page'))
            data = (this.run('page', url)).data;
        else
            data = [url];
        if (typeof data === 'string')
            data = data.split(/[\n,]+/);
        var ph = function (u) { return !u || /^data:|loading|lazy|blank|placeholder|spacer|\/nocover|1x1\./i.test(String(u)); };
        var pick = function (p) {
            if (typeof p === 'string')
                return p;
            if (!p)
                return '';
            var main = p.link || p.url || p.data, fb = Array.isArray(p.fallback) ? p.fallback.filter(Boolean) : [];
            return ph(main) && fb.length ? fb[0] : main;
        };
        return (data || []).map(function (p) { return abs(_this.base + '/', pick(p)); }).filter(Boolean);
    };
    VBookEngine.prototype.content = function (url) {
        url = this.decanon(url);
        var r = this.run('chap', url);
        return { html: str(r.data), title: str(r.data2) };
    };
    VBookEngine.prototype._resolveEmbedStream = function (rawUrl, referer, depth) {
        depth = depth || 0;
        var u = unwrapPlayerUrl(rawUrl);
        if (!u || isAdIframeUrl(u))
            return null;
        var ref = referer || (this.base + '/');
        var hdrs = { Referer: ref, Origin: originOf(ref, this.base), 'User-Agent': DEFAULT_VIDEO_UA };
        if (/\.(?:m3u8|mp4)(?:[?#]|$)/i.test(u)) {
            return { url: u, headers: hdrs, mimeType: /\.m3u8/i.test(u) ? 'application/x-mpegURL' : 'video/mp4' };
        }
        if (depth >= 3 || !this.env || typeof this.env.fetch !== 'function')
            return null;
        var res;
        try {
            res = this.env.fetch(u, { headers: hdrs });
        }
        catch (e) {
            return null;
        }
        if (!res || !res.ok)
            return null;
        var pageUrl = res.url || u;
        var body = str(typeof res.text === 'function' ? res.text() : '');
        if (!body)
            return null;
        var pageHdrs = { Referer: pageUrl, Origin: originOf(pageUrl, this.base), 'User-Agent': DEFAULT_VIDEO_UA };
        var sniffed = sniffDirectStream(body);
        if (sniffed) {
            return { url: sniffed, headers: pageHdrs, mimeType: /\.m3u8/i.test(sniffed) ? 'application/x-mpegURL' : 'video/mp4' };
        }
        var vidM = /<(?:video|source)\b[^>]*\bsrc=["']([^"']+)["']/i.exec(body);
        if (vidM && vidM[1]) {
            var vu = abs(pageUrl, vidM[1]);
            if (vu && !isAdIframeUrl(vu) && /\.(?:m3u8|mp4)/i.test(vu)) {
                return { url: vu, headers: pageHdrs, mimeType: /\.m3u8/i.test(vu) ? 'application/x-mpegURL' : 'video/mp4' };
            }
        }
        var ifrRe = /<iframe\b[^>]*(?:data-primary-player-url|data-alternate-player-url|src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
        var im, tried = 0;
        while ((im = ifrRe.exec(body)) && tried < 5) {
            var nextUrl = abs(pageUrl, im[1]);
            if (!nextUrl || nextUrl === u || nextUrl === pageUrl || isAdIframeUrl(nextUrl))
                continue;
            tried++;
            var found = this._resolveEmbedStream(nextUrl, pageUrl, depth + 1);
            if (found)
                return found;
        }
        return null;
    };
    VBookEngine.prototype.videos = function (url) {
        var _this = this;
        url = this.decanon(url);
        var servers = [{ title: 'Default', data: url }];
        if (this.has('chap')) {
            var d = (this.run('chap', url)).data;
            if (Array.isArray(d) && d.length)
                servers = d.map(function (s) { return (typeof s === 'string' ? { title: 'Server', data: s } : { title: str(s.title || s.name || 'Server'), data: str(s.data || s.url || s.link) }); });
        }
        var out = [];
        for (var _i = 0, servers_1 = servers; _i < servers_1.length; _i++) {
            var s = servers_1[_i];
            try {
                var t = (this.run('track', s.data)).data || {};
                var tracks = Array.isArray(t) ? t : [t];
                for (var _a = 0, tracks_1 = tracks; _a < tracks_1.length; _a++) {
                    var tr = tracks_1[_a];
                    if (!tr || !tr.data)
                        continue;
                    var streamUrl = abs(tr.host || this.base + '/', tr.data);
                    var hdrs = tr.headers ? Object.assign({}, tr.headers) : { Referer: this.base + '/' };
                    if (!hdrs.Referer && !hdrs.referer)
                        hdrs.Referer = this.base + '/';
                    if (!hdrs.Origin && !hdrs.origin)
                        hdrs.Origin = originOf(hdrs.Referer || hdrs.referer, this.base);
                    if (!hdrs['User-Agent'] && !hdrs['user-agent'])
                        hdrs['User-Agent'] = DEFAULT_VIDEO_UA;
                    var mimeType = str(tr.mimeType);
                    if (tr.type === 'webview') {
                        var resolved = this._resolveEmbedStream(streamUrl, hdrs.Referer, 0);
                        if (!resolved || !resolved.url)
                            continue;
                        streamUrl = resolved.url;
                        hdrs = Object.assign({}, hdrs, resolved.headers);
                        if (!mimeType)
                            mimeType = resolved.mimeType || '';
                    }
                    out.push({
                        url: streamUrl,
                        quality: s.title + (tr.quality ? ' ' + tr.quality : ''),
                        headers: hdrs,
                        subtitles: (tr.subtitles || (tr.subtitle ? [{ data: tr.subtitle, label: 'Sub' }] : [])).map(function (x) { return ({ file: abs(_this.base + '/', x.data || x.file), label: str(x.label || x.language || 'Sub') }); }),
                        audios: (tr.audios || []).map(function (x) { return ({ file: abs(_this.base + '/', x.data || x.file), label: str(x.label || x.language || 'Audio') }); }),
                        mimeType: mimeType,
                        http2: !!tr.http2,
                    });
                }
            }
            catch (e) {
                this.host.log && this.host.log('track ' + s.title + ': ' + e.message);
            }
        }
        return out;
    };
    return VBookEngine;
}());
function stripHtml(h) {
    return String(h).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/\n{3,}/g, '\n\n').trim();
}
