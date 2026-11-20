load('config.js');

function hakoB64Decode(str) {
  var A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var map = {};
  for (var i = 0; i < 64; i++) map[A.charAt(i)] = i;
  var clean = String(str || '').replace(/[^A-Za-z0-9+/]/g, '');
  var out = [];
  var buf = 0, bits = 0;
  for (var j = 0; j < clean.length; j++) {
    buf = (buf << 6) | map[clean.charAt(j)];
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push((buf >> bits) & 0xff);
    }
  }
  return out;
}

function hakoBytesToUtf8(bytes) {
  var s = '', i = 0;
  while (i < bytes.length) {
    var c = bytes[i++];
    var cp;
    if (c < 0x80) cp = c;
    else if (c < 0xe0) cp = ((c & 0x1f) << 6) | (bytes[i++] & 0x3f);
    else if (c < 0xf0) cp = ((c & 0x0f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
    else cp = ((c & 0x07) << 18) | ((bytes[i++] & 0x3f) << 12) | ((bytes[i++] & 0x3f) << 6) | (bytes[i++] & 0x3f);
    if (cp > 0xffff) {
      cp -= 0x10000;
      s += String.fromCharCode(0xd800 + (cp >> 10), 0xdc00 + (cp & 0x3ff));
    } else {
      s += String.fromCharCode(cp);
    }
  }
  return s;
}

function hakoDecodeProtected(dataC, mode, key) {
  if (!dataC) return '';
  mode = mode || 'none';
  key = key || '';
  var trimmed = String(dataC).replace(/^\s+|\s+$/g, '');

  if (trimmed.charAt(0) === '[') {
    try {
      var arr = JSON.parse(trimmed);
      if (arr && arr.length > 0) {
        arr.sort(function (a, b) {
          return parseInt(String(a).substring(0, 4), 10) - parseInt(String(b).substring(0, 4), 10);
        });
        var out = [];
        for (var i = 0; i < arr.length; i++) {
          var s = String(arr[i]).substring(4);
          if (mode === 'base64_reverse') s = s.split('').reverse().join('');
          var bytes = hakoB64Decode(s);
          if (mode === 'xor_shuffle' && key) {
            for (var k = 0; k < bytes.length; k++) {
              bytes[k] = bytes[k] ^ key.charCodeAt(k % key.length);
            }
          }
          out.push(hakoBytesToUtf8(bytes));
        }
        return out.join('');
      }
    } catch (e) {}
  }

  try {
    var rawBytes = hakoB64Decode(trimmed);
    if ((mode === 'xor' || mode === 'xor_shuffle') && key) {
      for (var m = 0; m < rawBytes.length; m++) {
        rawBytes[m] = rawBytes[m] ^ key.charCodeAt(m % key.length);
      }
    }
    var dec = hakoBytesToUtf8(rawBytes);
    if (dec && dec.replace(/\s+/g, '').length > 0) return dec;
  } catch (e2) {}

  return '';
}

function execute(url) {
  var doc = hakoFetchDoc(url);
  doc.select('.note-reg').remove();

  var htm = '';
  var prot = doc.select('#chapter-c-protected').first();
  if (prot) {
    htm = hakoDecodeProtected(prot.attr('data-c'), prot.attr('data-s') || 'none', prot.attr('data-k') || '');
    if (htm) {
      htm = htm.replace(/\[note(\d+)\]/gi, '<sup>[$1]</sup>');
      var notes = [];
      var noteEls = doc.select('.note-content');
      for (var i = 0; i < noteEls.size(); i++) {
        var nt = (noteEls.get(i).text() || '').replace(/\s+/g, ' ').trim();
        if (nt) notes.push(nt);
      }
      if (notes.length > 0) {
        htm += '<hr>';
        for (var j = 0; j < notes.length; j++) {
          htm += '<p><small>[' + (j + 1) + '] ' + notes[j] + '</small></p>';
        }
      }
    }
  }

  if (!htm) {
    var contentEl = doc.select('div#chapter-content').first();
    if (!contentEl) {
      throw new Error('Hako: không tìm thấy nội dung chương (#chapter-content).');
    }
    contentEl.select('p.none, [style*="display: none"], [style*="display:none"], script, style, ins, iframe').remove();
    contentEl.select('img[src*="/images/banners/"], img[src*="/lightnovel/banners/"]').remove();
    contentEl.select('p:contains(Tham gia Hako Discord), p:contains(Theo dõi Fanpage Hako)').remove();
    htm = contentEl.html() || '';
  }

  htm = htm
    .replace(/<p[^>]*id="\d+"[^>]*>/gi, '<p>')
    .replace(/\[note\d+\]/gi, '')
    .replace(/\r\n?/g, '\n')
    .replace(/&nbsp;/g, ' ');

  var plainLen = htm.replace(/<[^>]+>/g, '').replace(/\s+/g, '').length;
  var hasImg = /<img\b/i.test(htm);
  if (plainLen < 20 && !hasImg) {
    throw new Error('Hako: chương trống hoặc yêu cầu đăng nhập/JavaScript để xem.');
  }

  return Response.success(htm);
}
