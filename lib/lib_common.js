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
  // 0.0.8: Dean Edwards packer unpacker for web video players (0.0.9: multi-block + e,d/e,r variants)
  unpack: function (p) {
    if (!p || p.indexOf('eval(function(p,a,c,k,e,') < 0) return p;
    try {
      var text = String(p), out = [];
      var re = /eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]*?\}\s*\('((?:\\.|[^'\\])*)',\s*(\d+),\s*(\d+),\s*'([^']*)'\.split\('\|'\)/g;
      var m, countBlocks = 0;
      while ((m = re.exec(text)) && countBlocks < 5) {
        countBlocks++;
        var payload = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
        var radix = parseInt(m[2], 10), count = parseInt(m[3], 10), keywords = m[4].split('|');
        var decode = function (c) {
          return (c < radix ? '' : decode(Math.floor(c / radix))) +
            ((c = c % radix) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
        };
        var dict = {};
        for (var i = 0; i < count; i++) { dict[decode(i)] = keywords[i] || decode(i); }
        out.push(payload.replace(/\b\w+\b/g, function (w) { return dict[w] || w; }));
      }
      return out.length ? out.join('\n') : p;
    } catch (e) { return p; }
  },
  // 0.0.9: Ad / tracker / popunder / betting banner detection (inspired by Tampermonkey Adblock Script without anti-adblock triggers)
  isAdUrl: function (u) {
    if (!u) return true;
    u = String(u).trim();
    if (!u || /^(?:about:blank|javascript:|data:text\/html)/i.test(u)) return true;
    return /(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google|adnxs\.com|popads\.net|popcash\.net|exoclick\.com|juicyads\.com|trafficjunky|mgid\.com|adsterra|propellerads|clickadu|hilltopads|adskeeper|a-ads\.com|monetag|onclickads|tsyndicate|realsrv|betteradsystem|\/popunder|\/ads\.(?:js|html|php)|banner[-_]?quang[-_]?cao)/i.test(u);
  },
  isAdBannerImg: function (u) {
    if (!u) return true;
    u = String(u).trim();
    if (C.isAdUrl(u)) return true;
    if (/dflazy|lazy\.|placeholder|blank\.(gif|png)|spacer\.(gif|png)|1x1\.(gif|png|webp)|pixel\.(gif|png)|\/nocover/i.test(u)) return true;
    return /\/(?:banner[-_]?quang[-_]?cao|quang[-_]?cao|ad[-_]?banner|banner[-_]?ads|pop[-_]?banner|nha[-_]?cai|ca[-_]?cuoc|khuyen[-_]?mai[-_]?(?:nap|vip)|(?:kubet|jun88|fb88|hi88|789bet|new88|shbet|mb66|okvip|go88|sunwin|hitclub|rikvip)[^/]*\.(?:gif|png|jpe?g|webp))/i.test(u);
  },
  unwrapUrl: function (u) {
    var cur = String(u || '').trim();
    for (var i = 0; i < 2; i++) {
      var m = /[?&](?:url|file|src|link|stream|v)=([^&#]+)/i.exec(cur);
      if (!m) break;
      try {
        var dec = decodeURIComponent(m[1]).trim();
        if (/^https?:\/\//i.test(dec) && dec !== cur) cur = dec; else break;
      } catch (e) { break; }
    }
    return cur;
  },
  // 0.0.8 + 0.0.9: m3u8_StreamSniper & Tiyo-inspired universal stream sniffer (m3u8, mp4, packed, base64, ?url=)
  sniff: function (text) {
    if (!text) return '';
    var raw = String(text)
      .replace(/\\\//g, '/')
      .replace(/\\u002[fF]/g, '/')
      .replace(/\\x2[fF]/g, '/')
      .replace(/&amp;/g, '&');
    if (raw.indexOf('eval(function(p,a,c,k,e,') >= 0) {
      raw = raw + '\n' + C.unpack(raw);
    }
    var pick = function (cand) {
      if (!cand) return '';
      cand = C.unwrapUrl(cand);
      if (!cand || C.isAdUrl(cand)) return '';
      return cand;
    };
    var m3u8 = raw.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/gi) || [];
    for (var i = 0; i < m3u8.length; i++) { var c1 = pick(m3u8[i]); if (c1) return c1; }
    var usm = raw.match(/var\s+urlStream\s*=\s*["'](https?:[^"']+)["']/i) ||
              raw.match(/(?:hlsUrl|streamUrl|videoUrl|play_url|m3u8Url)\s*[:=]\s*["'](https?:[^"']+)["']/i);
    if (usm) { var c2 = pick(usm[1]); if (c2 && /\.(?:m3u8|mp4)/i.test(c2)) return c2; }
    var reSrc = /(?:file|source|src)\s*[:=]\s*["'](https?:[^"']+)["']/gi, m2;
    while ((m2 = reSrc.exec(raw))) {
      var c3 = pick(m2[1]);
      if (c3 && /\.(?:m3u8|mp4)(?:[?#]|$)/i.test(c3)) return c3;
    }
    var mp4 = raw.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/gi) || [];
    for (var j = 0; j < mp4.length; j++) { var c4 = pick(mp4[j]); if (c4) return c4; }
    var b64re = /["'](aHR0c[A-Za-z0-9+/=]{16,})["']/g, bm;
    while ((bm = b64re.exec(raw))) {
      var dec = pick(C.b64dec(bm[1]));
      if (dec && /\.(?:m3u8|mp4)/i.test(dec)) return dec;
    }
    return '';
  },
  // 0.0.8 + 0.0.9: DevTools & anti-debugger cleaner (AEPKILL/devtools-detector, neokatin/Bypass-DevTools-Detection)
  cleanDevTools: function (html) {
    if (!html) return '';
    return String(html)
      .replace(/<script[^>]*>(?:(?!<\/script>)[\s\S])*?(?:devtools-detector|anti-debug|disable-devtool|console-ban|devtools-detect|isDevToolsOpen|Firebug\.chrome|outerWidth\s*-\s*(?:window\.)?innerWidth)[\s\S]*?<\/script>/gi, '')
      .replace(/set(?:Interval|Timeout)\s*\(\s*function\s*\(\s*\)\s*\{[^}]*debugger\s*;?[^}]*\}\s*,\s*\d+\s*\)\s*;?/gi, '')
      .replace(/Function\s*\(\s*["']debugger["']\s*\)\s*\(\s*\)\s*;?/gi, '')
      .replace(/\(\s*function\s*\(\s*\)\s*\{\s*\}\s*\)\s*\.constructor\s*\(\s*["']debugger["']\s*\)\s*\(\s*\)\s*;?/gi, '')
      .replace(/console\.clear\s*\(\s*\)\s*;?/gi, '')
      .replace(/\bdebugger\s*;?/gi, '');
  },
  // 0.0.9: DOM/HTML ad & anti-adblock overlay cleaner (DerFichtl Tampermonkey Adblock Script strategy)
  cleanAds: function (docOrHtml) {
    if (!docOrHtml) return typeof docOrHtml === 'string' ? '' : docOrHtml;
    var adSel = 'script, style, ins, iframe, noscript, .ads, .ad, .ad-box, .ad-banner, .ads-box, .adsbox, .ad-container, .ad-wrapper, .ad-overlay, .popup-ad, .pop-ad, .overlay-ad, .banner-ad, .adsbygoogle, [class*="ads-"], [class*="ad-banner"], [id*="ads"], [id*="ad-box"], [id*="ad_"], [data-ad], [data-ads], [data-ad-client], [data-ad-slot], .anti-adblock, .adblock-modal, .adblock-overlay, #adblock-detector-modal, .cookie-banner, .cookie-consent, [class*="popunder"], [id*="popunder"]';
    if (typeof docOrHtml !== 'string' && typeof docOrHtml.select === 'function') {
      try { docOrHtml.select(adSel).remove(); } catch (e) {}
      try {
        var imgs = docOrHtml.select('img');
        for (var i = 0; i < imgs.size(); i++) {
          var im = imgs.get(i);
          var src = im.attr('data-src') || im.attr('data-original') || im.attr('src');
          if (src && C.isAdBannerImg(src)) im.remove();
        }
        var links = docOrHtml.select('a');
        for (var j = 0; j < links.size(); j++) {
          var a = links.get(j);
          var href = a.attr('href');
          if (href && C.isAdUrl(href) && !a.text().trim()) a.remove();
        }
      } catch (e2) {}
      return docOrHtml;
    }
    var s = C.cleanDevTools(String(docOrHtml));
    if (typeof Html !== 'undefined' && Html && typeof Html.parse === 'function') {
      try {
        var doc = Html.parse('<div id="__kiri_adroot__">' + s + '</div>', '');
        var root = doc.select('#__kiri_adroot__').first();
        if (root) {
          C.cleanAds(root);
          return C.cleanDevTools(root.html());
        }
      } catch (e3) {}
    }
    return s
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, '')
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<div\b[^>]*(?:class|id)=["'][^"']*(?:adsbygoogle|adblock|popunder|popup-ad|banner-ad|ad-banner|ad-overlay|\bads?\b)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
  },
  // Remove ads/scripts and empty paragraphs from novel content
  cleanContent: function (el) {
    if (!el) return '';
    if (typeof el === 'string') {
      return C.cleanAds(el).replace(/\r\n?/g, '\n').replace(/&#13;|&#x0?[dD];/g, '').replace(/&nbsp;/g, ' ').replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
    }
    C.cleanAds(el);
    el.select('button, form').remove();
    return C.cleanDevTools(el.html()).replace(/\r\n?/g, '\n').replace(/&#13;|&#x0?[dD];/g, '').replace(/&nbsp;/g, ' ').replace(/(<br\s*\/?>\s*){3,}/gi, '<br><br>');
  },
  ongoing: function (s) { return !/(hoàn thành|hoàn tất|full|completed|完结|完本|已完结|finished|end)/i.test(s || ''); }
};
