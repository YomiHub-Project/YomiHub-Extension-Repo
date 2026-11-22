// Shared helpers for Kiritokmn Extension Repo sources (vBook API, ES5 so it also runs on Rhino).
var C = {
  img: function (el) {
    if (!el) return '';
    var a = ['data-src', 'data-lazy-src', 'data-original', 'data-original-src', 'data-mce-src', 'data-lazyload', 'data-cfsrc', 'data-url', 'src'];
    for (var i = 0; i < a.length; i++) {
      var v = el.attr(a[i]);
      if (v && v.indexOf('data:image') !== 0 && !/dflazy|lazy\.|placeholder|blank\.(gif|png)/i.test(v)) return C.fix(v.trim());
    }
    var ss = el.attr('data-srcset') || el.attr('srcset');
    if (ss) return C.fix(ss.split(',').pop().trim().split(' ')[0]);
    return '';
  },
  fix: function (u) {
    if (!u) return '';
    u = String(u).trim();
    if (u.indexOf('//') === 0) return 'https:' + u;
    if (u.indexOf('http') === 0) return u;
    if (u.charAt(0) === '/') return BASE_URL + u;
    return BASE_URL + '/' + u;
  },
  text: function (doc, sels) {
    for (var i = 0; i < sels.length; i++) { var t = doc.select(sels[i]).text(); if (t) return t.trim(); }
    return '';
  },
  get: function (url, opt) {
    opt = opt || {};
    var h = { 'Referer': BASE_URL + '/' };
    if (opt.headers) for (var k in opt.headers) h[k] = opt.headers[k];
    var r = fetch(url, { method: opt.method, headers: h, body: opt.body });
    // 429 Too Many Requests: back off and retry (WordPress/Cloudflare rate limits when paging a long TOC)
    for (var tries = 0; r && r.status === 429 && tries < 3 && !C.cf(r); tries++) { sleep(1500 * (tries + 1)); r = fetch(url, { method: opt.method, headers: h, body: opt.body }); }
    return r;
  },
  cf: function (r) {
    if (r.status !== 403 && r.status !== 503 && r.status !== 429) return false;
    var t = r.text() || '';
    return /cf_chl|challenge-platform|Just a moment|Attention Required|cf-turnstile|Verifying you are human/i.test(t.slice(0, 20000));
  },
  check: function (r, url) {
    if (r.ok) return r;
    if (C.cf(r)) throw new Error('CLOUDFLARE: trang ' + url.split('/').slice(0, 3).join('/') + ' yêu cầu xác minh. Mở nguồn bằng WebView trong ứng dụng, đợi qua bước kiểm tra rồi tải lại.');
    throw new Error('HTTP ' + r.status + ' ' + url);
  },
  html: function (url, opt) {
    var r = C.check(C.get(url, opt), url);
    return r.html(opt && opt.charset);
  },
  json: function (url, opt) {
    var r = C.check(C.get(url, opt), url);
    return r.json();
  },
  page: function (p) { var n = parseInt(p || '1', 10); return isNaN(n) || n < 1 ? 1 : n; },
  next: function (hasMore, p) { return hasMore ? String(C.page(p) + 1) : ''; },
  isUrl: function (s) { return /^(https?:)?\/\//.test(s || '') || (s || '').charAt(0) === '/'; },
  enc: function (s) { return encodeURIComponent(s || ''); },
  // 0.0.8: Base64 decode (pure ES5, works on Rhino, QuickJS, JSC, Node)
  b64dec: function (s) {
    if (!s) return '';
    try {
      if (typeof atob === 'function') return atob(s);
      var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var out = '', buf = 0, bits = 0;
      for (var i = 0; i < s.length; i++) {
        var idx = chars.indexOf(s.charAt(i));
        if (idx < 0 || s.charAt(i) === '=') break;
        buf = (buf << 6) | idx;
        bits += 6;
        if (bits >= 8) { bits -= 8; out += String.fromCharCode((buf >> bits) & 0xff); }
      }
      return out;
    } catch (e) { return ''; }
  },
  // 0.0.8: Dean Edwards packer unpacker for web video players
  unpack: function (p) {
    if (!p || p.indexOf('eval(function(p,a,c,k,e,') < 0) return p;
    try {
      var m = /}\s*\('(.*)',\s*(\d+),\s*(\d+),\s*'([^']*)'\.split\('\|'\)/.exec(p);
      if (!m) return p;
      var payload = m[1], radix = parseInt(m[2], 10), count = parseInt(m[3], 10), keywords = m[4].split('|');
      var decode = function (c) {
        return (c < radix ? '' : decode(Math.floor(c / radix))) +
          ((c = c % radix) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
      };
      var dict = {};
      for (var i = 0; i < count; i++) { dict[decode(i)] = keywords[i] || decode(i); }
      return payload.replace(/\b\w+\b/g, function (w) { return dict[w] || w; });
    } catch (e) { return p; }
  },
  // 0.0.8: m3u8_StreamSniper-inspired universal stream sniffer (m3u8, mp4, packed, base64)
  sniff: function (text) {
    if (!text) return '';
    text = String(text).replace(/\\\//g, '/');
    if (text.indexOf('eval(function(p,a,c,k,e,') >= 0) {
      text = text + '\n' + C.unpack(text);
    }
    var m = text.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/i) || text.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/i);
    if (m) return m[0];
    var usm = text.match(/var\s+urlStream\s*=\s*["'](https?:[^"']+)["']/i);
    if (usm) return usm[1];
    var m2 = text.match(/(?:file|source|src)\s*:\s*["'](https?:[^"']+)["']/i);
    if (m2 && /\.(?:m3u8|mp4)/i.test(m2[1])) return m2[1];
    var b64m = text.match(/["'](aHR0c[A-Za-z0-9+/=]{16,})["']/);
    if (b64m) {
      var dec = C.b64dec(b64m[1]);
      if (/\.(?:m3u8|mp4)/i.test(dec)) return dec;
    }
    return '';
  },
  // 0.0.8: DevTools & anti-debugger cleaner (Bypass-DevTools-Detection)
  cleanDevTools: function (html) {
    if (!html) return '';
    return String(html)
      .replace(/debugger\s*;?/gi, '')
      .replace(/setInterval\s*\(\s*function\s*\(\s*\)\s*\{\s*debugger\s*;?\s*\}\s*,\s*\d+\s*\)\s*;?/gi, '')
      .replace(/Function\s*\(\s*["']debugger["']\s*\)\s*\(\s*\)\s*;?/gi, '')
      .replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?(?:devtools-detector|anti-debug|disable-devtool)[\s\S]*?<\/script>/gi, '');
  },
  // Remove ads/scripts and empty paragraphs from novel content
  cleanContent: function (el) {
    el.select('script, style, ins, iframe, noscript, .ads, .ad, [class*=ads-], [id*=ads], .adsbygoogle, button, form').remove();
    return el.html().replace(/\r\n?/g, '\n').replace(/&#13;|&#x0?[dD];/g, '').replace(/&nbsp;/g, ' ').replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
  },
  ongoing: function (s) { return !/(hoàn thành|hoàn tất|full|completed|完结|完本|已完结|finished|end)/i.test(s || ''); }
};
