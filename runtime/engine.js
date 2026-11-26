// High-level driver: turns a set of vBook scripts into the operations every host needs
// (popular / latest / search / detail / chapter list / pages / novel text / video streams).
import { createEnv } from './vbook.js';
import { resolveUrl } from './url.js';

function abs(base, u) {
  if (!u) return '';
  u = String(u).trim();
  if (/^data:|^blob:/.test(u)) return u;
  if (u.startsWith('//')) return 'https:' + u;
  if (typeof __abs === 'function') return __abs(base, u); // Rhino: resolved by java.net.URI
  try { return resolveUrl(base, u); } catch (e) { return u; }
}
const str = v => (v == null ? '' : String(v));
const uniq = a => a.filter((x, i) => x && a.indexOf(x) === i);
const DEFAULT_VIDEO_UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36';

function originOf(u, fallback) {
  const m = /^https?:\/\/[^/?#]+/i.exec(str(u));
  return m ? m[0] : str(fallback || '').replace(/\/+$/, '');
}
function isAdIframeUrl(u) {
  u = str(u).trim();
  if (!u || /^(?:about:blank|javascript:|data:text\/html)/i.test(u)) return true;
  return /(?:googlesyndication\.com|doubleclick\.net|googleadservices\.com|adservice\.google|adnxs\.com|popads\.net|popcash\.net|exoclick\.com|juicyads\.com|trafficjunky|mgid\.com|adsterra|propellerads|clickadu|hilltopads|adskeeper|a-ads\.com|monetag|onclickads|tsyndicate|realsrv|betteradsystem|\/popunder|\/ads\.(?:js|html|php))/i.test(u);
}
function unwrapPlayerUrl(u) {
  let cur = str(u).trim();
  for (let i = 0; i < 2; i++) {
    const m = /[?&](?:url|file|src|link|stream|v)=([^&#]+)/i.exec(cur);
    if (!m) break;
    try {
      const dec = decodeURIComponent(m[1]).trim();
      if (/^https?:\/\//i.test(dec) && dec !== cur) cur = dec; else break;
    } catch (e) { break; }
  }
  return cur;
}
function b64decEs5(s) {
  if (!s) return '';
  try {
    if (typeof atob === 'function') return atob(s);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let out = '', buf = 0, bits = 0;
    for (let i = 0; i < s.length; i++) {
      const idx = chars.indexOf(s.charAt(i));
      if (idx < 0 || s.charAt(i) === '=') break;
      buf = (buf << 6) | idx; bits += 6;
      if (bits >= 8) { bits -= 8; out += String.fromCharCode((buf >> bits) & 0xff); }
    }
    return out;
  } catch (e) { return ''; }
}
function unpackDeanEdwards(p) {
  if (!p || p.indexOf('eval(function(p,a,c,k,e,') < 0) return p;
  try {
    const re = /eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]*?\}\s*\('((?:\\.|[^'\\])*)',\s*(\d+),\s*(\d+),\s*'([^']*)'\.split\('\|'\)/g;
    const out = [];
    let m, blocks = 0;
    while ((m = re.exec(p)) && blocks < 5) {
      blocks++;
      const payload = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
      const radix = parseInt(m[2], 10), count = parseInt(m[3], 10), keywords = m[4].split('|');
      const decode = c => (c < radix ? '' : decode(Math.floor(c / radix))) + ((c = c % radix) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
      const dict = {};
      for (let i = 0; i < count; i++) dict[decode(i)] = keywords[i] || decode(i);
      out.push(payload.replace(/\b\w+\b/g, w => dict[w] || w));
    }
    return out.length ? out.join('\n') : p;
  } catch (e) { return p; }
}
function sniffDirectStream(text) {
  if (!text) return '';
  let raw = str(text).replace(/\\\//g, '/').replace(/\\u002[fF]/g, '/').replace(/\\x2[fF]/g, '/').replace(/&amp;/g, '&');
  if (raw.indexOf('eval(function(p,a,c,k,e,') >= 0) raw += '\n' + unpackDeanEdwards(raw);
  const pick = c => { c = unwrapPlayerUrl(c); return c && !isAdIframeUrl(c) ? c : ''; };
  const m3u8 = raw.match(/https?:[^"'\s<>\\]+?\.m3u8[^"'\s<>\\]*/gi) || [];
  for (let i = 0; i < m3u8.length; i++) { const c = pick(m3u8[i]); if (c) return c; }
  const us = raw.match(/(?:var\s+urlStream|hlsUrl|streamUrl|videoUrl|play_url|m3u8Url)\s*[:=]\s*["'](https?:[^"']+)["']/i);
  if (us) { const c = pick(us[1]); if (c && /\.(?:m3u8|mp4)/i.test(c)) return c; }
  const mp4 = raw.match(/https?:[^"'\s<>\\]+?\.mp4[^"'\s<>\\]*/gi) || [];
  for (let i = 0; i < mp4.length; i++) { const c = pick(mp4[i]); if (c) return c; }
  const b64re = /["'](aHR0c[A-Za-z0-9+/=]{16,})["']/g;
  let bm;
  while ((bm = b64re.exec(raw))) {
    const dec = pick(b64decEs5(bm[1]));
    if (dec && /\.(?:m3u8|mp4)/i.test(dec)) return dec;
  }
  return '';
}

export const STANDARD_FILTERS = {
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
  const out = [], seenLabel = {}, seenVal = {};
  for (let i = 0; i < arr.length; i++) {
    const o = arr[i];
    if (!o) continue;
    const label = str(o.label != null ? o.label : o.title || o.name).trim();
    const value = str(o.value != null ? o.value : o.input || label).trim();
    if (!label || seenLabel[label] || (value !== '' && seenVal[value])) continue;
    seenLabel[label] = 1;
    if (value !== '') seenVal[value] = 1;
    out.push({ label, value });
  }
  return out;
}

export function buildFilterSchema(meta, tabs, genres) {
  meta = meta || {};
  const catOpts = [{ label: 'Tất Cả', value: '' }];
  if (Array.isArray(tabs) && tabs.length) {
    for (let i = 0; i < tabs.length; i++) {
      const t = tabs[i];
      if (!t) continue;
      const title = str(t.title || t.name || ('Danh mục ' + (i + 1))).trim();
      if (title) catOpts.push({ label: title, value: 'tab:' + i });
    }
  } else {
    catOpts.push({ label: 'Phổ biến', value: 'popular' }, { label: 'Mới cập nhật', value: 'latest' }, { label: 'Hoàn thành', value: 'completed' });
  }
  const typeKey = meta.type === 'video' ? 'video' : meta.type === 'comic' ? 'comic' : 'novel';
  const rawGenres = (Array.isArray(genres) && genres.length)
    ? genres.map(g => (typeof g === 'string' ? { label: g, value: g } : { label: str(g.title || g.name || g.label), value: str(g.input || g.value || g.title || g.name) }))
    : (STANDARD_FILTERS.genresByType[typeKey] || STANDARD_FILTERS.genresByType.novel).map(g => ({ label: g, value: g }));
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

export function normalizeFilters(raw) {
  const out = {
    sort: '', sortAscending: false, status: '', category: '', content_rating: '',
    country: '', year: '', search_by: '', rating: '', translation: '', genres: [], feed: '',
  };
  if (!raw) return out;
  let f = raw;
  if (typeof f === 'string') {
    const s = f.trim();
    if (!s) return out;
    try { f = JSON.parse(s); } catch (e) { return out; }
  }
  if (!f || typeof f !== 'object') return out;
  if (Array.isArray(f)) {
    for (let i = 0; i < f.length; i++) {
      const item = f[i];
      if (!item || typeof item !== 'object') continue;
      // Aidoku externally-tagged FilterValue: { Text: {id,value} }, { Sort: {id,index,ascending} }, etc.
      if (item.Text && item.Text.id) { out[item.Text.id] = str(item.Text.value).trim(); continue; }
      if (item.Select && item.Select.id) { out[item.Select.id] = str(item.Select.value).trim(); continue; }
      if (item.Sort && item.Sort.id) {
        const opt = STANDARD_FILTERS.sort[item.Sort.index | 0];
        out.sort = opt ? opt.value : '';
        out.sortAscending = !!item.Sort.ascending;
        continue;
      }
      if (item.MultiSelect && item.MultiSelect.id) {
        out[item.MultiSelect.id] = Array.isArray(item.MultiSelect.included) ? item.MultiSelect.included.map(str).filter(Boolean) : [];
        continue;
      }
      // Mangayomi filter object
      const key = str(item.type || item.id).trim();
      if (!key) continue;
      if (item.type_name === 'SortFilter') {
        const idx = item.state && typeof item.state === 'object' ? (item.state.index | 0) : (item.state | 0);
        const vals = Array.isArray(item.values) ? item.values : STANDARD_FILTERS.sort;
        const chosen = vals[idx];
        out.sort = chosen ? str(chosen.value != null ? chosen.value : (STANDARD_FILTERS.sort[idx] ? STANDARD_FILTERS.sort[idx].value : '')) : '';
        out.sortAscending = !!(item.state && item.state.ascending);
      } else if (item.type_name === 'SelectFilter') {
        const v = Array.isArray(item.values) && item.values[item.state | 0];
        if (key in out) out[key] = v ? str(v.value) : '';
      } else if (item.type_name === 'TextFilter') {
        if (key in out) out[key] = str(item.state).trim();
      } else if (item.type_name === 'GroupFilter' && Array.isArray(item.state)) {
        const sel = [];
        for (let j = 0; j < item.state.length; j++) {
          const cb = item.state[j];
          if (cb && cb.state === true) sel.push(str(cb.value || cb.name).trim());
        }
        if (key === 'genres' || key === 'genre') out.genres = sel.filter(Boolean);
      }
    }
    return out;
  }
  const pickVal = v => (v && typeof v === 'object' && !Array.isArray(v) && 'value' in v) ? v.value : v;
  const sVal = pickVal(f.sort);
  if (sVal && typeof sVal === 'object') {
    if ('index' in sVal) {
      const opt = STANDARD_FILTERS.sort[sVal.index | 0];
      out.sort = opt ? opt.value : '';
      out.sortAscending = !!sVal.ascending;
    } else if ('key' in sVal) {
      out.sort = str(sVal.key);
      out.sortAscending = sVal.direction === 'asc' || sVal.direction === 0 || !!sVal.ascending;
    }
  } else {
    out.sort = str(sVal).trim();
    if ('sortAscending' in f) out.sortAscending = !!f.sortAscending;
  }
  const strKeys = ['status', 'category', 'content_rating', 'country', 'year', 'search_by', 'rating', 'translation', 'feed'];
  for (let i = 0; i < strKeys.length; i++) {
    const k = strKeys[i];
    if (f[k] != null) out[k] = str(pickVal(f[k])).trim();
  }
  const gRaw = pickVal(f.genres != null ? f.genres : f.genre);
  if (Array.isArray(gRaw)) out.genres = gRaw.map(str).filter(Boolean);
  else if (gRaw && typeof gRaw === 'object' && Array.isArray(gRaw.include)) out.genres = gRaw.include.map(str).filter(Boolean);
  else if (typeof gRaw === 'string' && gRaw.trim()) out.genres = gRaw.split(',').map(s => s.trim()).filter(Boolean);
  return out;
}

export function isDefaultFilters(f) {
  if (!f) return true;
  return !f.sort && !f.status && !f.category && !f.content_rating && !f.country && !f.year &&
    !f.search_by && !f.rating && !f.translation && (!f.genres || !f.genres.length) && !f.feed;
}

function parseScore(txt) {
  const m = /(?:(\d+(?:\.\d+)?)\s*(?:\/\s*10|sao|★)|★\s*(\d+(?:\.\d+)?))/i.exec(str(txt));
  if (!m) return null;
  const n = parseFloat(m[1] || m[2]);
  return isNaN(n) ? null : n;
}
function parseYear(txt) {
  const m = /\b((?:19|20)\d{2})\b/.exec(str(txt));
  return m ? parseInt(m[1], 10) : null;
}
const COUNTRY_RE = {
  vn: /(?:việt nam|vietnam|truyện việt|phim việt|\bvn\b)/i,
  cn: /(?:trung quốc|china|manhua|tiên hiệp|huyền huyễn|ngôn tình|đam mỹ|convert|\bcn\b)/i,
  jp: /(?:nhật bản|japan|manga|anime|light novel|isekai|\bjp\b)/i,
  kr: /(?:hàn quốc|korea|manhwa|webtoon|\bkr\b)/i,
  us: /(?:âu mỹ|usa|\bus\b|\buk\b|comic|marvel|hollywood)/i,
};
const TRANS_RE = {
  sub: /(?:vietsub|bản dịch|dịch|\bsub\b|trans)/i,
  dub: /(?:thuyết minh|lồng tiếng|\bdub\b)/i,
  convert: /(?:convert|\bcv\b)/i,
  raw: /(?:raw|gốc|engsub|english)/i,
};
function applyClientFilters(items, f, meta) {
  if (!Array.isArray(items) || !items.length) return items || [];
  let res = items.slice();
  const textOf = it => (str(it.name) + ' ' + str(it.description) + ' ' + str(it.tag)).toLowerCase();
  if (f.content_rating === 'nsfw') {
    if (!(meta && meta.nsfw)) {
      const matched = res.filter(it => /(?:18\+|nsfw|hentai|ecchi|adult|smut|sắc|jav)/i.test(textOf(it)));
      res = matched;
    }
  } else if (f.content_rating === 'sfw') {
    if (meta && meta.nsfw) return [];
    res = res.filter(it => !/(?:18\+|nsfw|hentai|adult|jav)/i.test(textOf(it)));
  }
  if (f.status === 'ongoing') {
    res = res.filter(it => !/(?:hoàn thành|hoàn tất|completed|đã kết thúc|\bfull\b)/i.test(textOf(it)));
  } else if (f.status === 'completed') {
    const hasStatusInfo = res.some(it => /(?:hoàn thành|hoàn tất|completed|\bfull\b|đang tiến hành|ongoing|tạm ngưng|hiatus)/i.test(textOf(it)));
    if (hasStatusInfo) res = res.filter(it => /(?:hoàn|complete|full|end)/i.test(textOf(it)));
  } else if (f.status === 'hiatus') {
    const hasHiatus = res.some(it => /(?:tạm ngưng|tạm dừng|hiatus|drop)/i.test(textOf(it)));
    if (hasHiatus) res = res.filter(it => /(?:tạm ngưng|tạm dừng|hiatus|drop)/i.test(textOf(it)));
  }
  if (f.country) {
    const re = COUNTRY_RE[f.country];
    if (re) {
      const hasCountry = res.some(it => COUNTRY_RE.vn.test(textOf(it)) || COUNTRY_RE.cn.test(textOf(it)) || COUNTRY_RE.jp.test(textOf(it)) || COUNTRY_RE.kr.test(textOf(it)) || COUNTRY_RE.us.test(textOf(it)));
      if (hasCountry) res = res.filter(it => re.test(textOf(it)));
    } else if (f.country === 'other') {
      const hasKnown = res.some(it => COUNTRY_RE.vn.test(textOf(it)) || COUNTRY_RE.cn.test(textOf(it)) || COUNTRY_RE.jp.test(textOf(it)) || COUNTRY_RE.kr.test(textOf(it)) || COUNTRY_RE.us.test(textOf(it)));
      if (hasKnown) res = res.filter(it => !COUNTRY_RE.vn.test(textOf(it)) && !COUNTRY_RE.cn.test(textOf(it)) && !COUNTRY_RE.jp.test(textOf(it)) && !COUNTRY_RE.kr.test(textOf(it)) && !COUNTRY_RE.us.test(textOf(it)));
    }
  }
  if (f.year) {
    const hasYear = res.some(it => parseYear(textOf(it)) !== null);
    if (hasYear) {
      res = res.filter(it => {
        const y = parseYear(textOf(it));
        if (y === null) return false;
        return f.year === 'before_2020' ? y < 2020 : String(y) === f.year;
      });
    }
  }
  if (f.rating) {
    const minScore = parseFloat(f.rating);
    if (!isNaN(minScore)) {
      const hasScore = res.some(it => parseScore(textOf(it)) !== null);
      if (hasScore) {
        res = res.filter(it => {
          const sc = parseScore(textOf(it));
          return sc !== null && sc >= minScore;
        });
      }
    }
  }
  if (f.translation && TRANS_RE[f.translation]) {
    const tre = TRANS_RE[f.translation];
    const hasTrans = res.some(it => TRANS_RE.sub.test(textOf(it)) || TRANS_RE.dub.test(textOf(it)) || TRANS_RE.convert.test(textOf(it)) || TRANS_RE.raw.test(textOf(it)));
    if (hasTrans) res = res.filter(it => tre.test(textOf(it)));
  }
  if (f.genres && f.genres.length) {
    const wanted = f.genres.map(g => g.toLowerCase()).filter(g => !/^https?:\/\//.test(g) && g.charAt(0) !== '/');
    if (wanted.length) {
      const hasGenreTag = res.some(it => wanted.some(g => textOf(it).indexOf(g) >= 0));
      if (hasGenreTag) res = res.filter(it => wanted.some(g => textOf(it).indexOf(g) >= 0));
    }
  }
  if (f.sort === 'az') {
    res.sort((a, b) => str(a.name).localeCompare(str(b.name)));
  } else if (f.sort === 'rating') {
    if (res.some(it => parseScore(textOf(it)) !== null)) {
      res.sort((a, b) => (parseScore(textOf(b)) || 0) - (parseScore(textOf(a)) || 0));
    }
  }
  return res;
}

export class VBookEngine {
  constructor(opts) {
    const meta = opts.meta, scripts = opts.scripts, host = opts.host;
    this.meta = meta;
    this.host = host;
    this.env = opts.env || createEnv(host, meta);
    // 0.0.6 — flexible domain switching for EVERY source: a request sent to the default domain or to any known
    // mirror (plugin.json DOMAIN.values + the domains of the owner's Excel sheet) is redirected to the domain the
    // user picked / typed in the settings, so sources with hard-coded URLs follow the switch too.
    { const env = this.env, f = env.fetch, self = this; if (typeof f === 'function' && !f.__kiriLive) { const w = function (u, o) { return f.call(env, self.live(u), o); }; w.__kiriLive = true; w.__raw = f; env.fetch = w; } }
    // 0.1.0 — automatic mirror fallback (all 9 apps): when a request to the selected domain fails at the network level
    // (DNS, connect timeout, blocked = HTTP 0) or with a Cloudflare 52x / 502-504, the same path is tried on the other
    // known mirrors (plugin.json DOMAIN.values + Excel domains). The first mirror that answers becomes the session's
    // domain (remembered per source until the user picks another domain), so dead domains no longer break a source.
    { const env = this.env, f = env.fetch, self = this;
      if (typeof f === 'function' && !f.__kiriAuto) {
        const bad = r => { if (!r || r.status == null) return false; const c = +r.status; return c === 0 || (c >= 520 && c <= 530) || c === 502 || c === 503 || c === 504; };
        const w = function (u, o) {
          const first = f.call(env, u, o);
          const retry = r => {
            if (!bad(r)) return r;
            const alts = self.mirrorAlternatives(str(u)); let i = 0;
            const next = last => {
              if (i >= alts.length) return last;
              const a = alts[i++]; let rr;
              try { rr = (f.__raw || f).call(env, a.url, o); } catch (e) { return next(last); }
              const fin = x => { if (!bad(x)) { self.setAutoBase(a.origin); return x; } return next(x); };
              return rr && typeof rr.then === 'function' ? rr.then(fin, () => next(last)) : fin(rr);
            };
            return next(r);
          };
          return first && typeof first.then === 'function' ? first.then(retry) : retry(first);
        };
        w.__kiriAuto = true; w.__kiriLive = true; env.fetch = w;
      }
    }
    this.scripts = scripts; // name -> async factory(env, cfg) returning execute
    this.cache = {};
    this.tokens = {};
  }
  // 0.0.6: DOMAIN_CUSTOM (free text, any new domain) > DOMAIN (picked from the list) > default domain
  get base() {
    const ok = v => { v = str(v).trim(); return /^https?:\/\/[^/?#\s]+/i.test(v) ? v : ''; };
    const custom = ok(this.host.config('DOMAIN_CUSTOM'));
    if (custom) return custom.replace(/\/+$/, '');
    const picked = (ok(this.host.config('DOMAIN')) || ok((this.meta.configDefaults || {}).DOMAIN) || str(this.meta.source)).replace(/\/+$/, '');
    const auto = this.autoBase();
    return auto && auto.from === picked ? auto.to : picked;
  }
  // 0.1.0: the mirror found by the automatic fallback, valid while the user keeps the same domain selection
  autoBase() {
    if (this._auto !== undefined) return this._auto;
    let a = null; try { const v = this.host.storageGet && this.host.storageGet('__autoBase__'); if (v) a = JSON.parse(v); } catch (e) { a = null; }
    this._auto = a && a.from && a.to ? a : null; return this._auto;
  }
  setAutoBase(origin) {
    const ok = v => { v = str(v).trim(); return /^https?:\/\/[^/?#\s]+/i.test(v) ? v : ''; };
    if (ok(this.host.config('DOMAIN_CUSTOM'))) return;
    const picked = (ok(this.host.config('DOMAIN')) || ok((this.meta.configDefaults || {}).DOMAIN) || str(this.meta.source)).replace(/\/+$/, '');
    this._auto = { from: picked, to: str(origin).replace(/\/+$/, '') };
    try { this.host.storageSet && this.host.storageSet('__autoBase__', JSON.stringify(this._auto)); } catch (e) { }
    try { this.host.log && this.host.log('[YomiHub Ext] ' + picked + ' lỗi mạng → tự chuyển sang ' + this._auto.to); } catch (e) { }
  }
  mirrorAlternatives(u) {
    const o = this.origins; const m = /^https?:\/\/[^/?#]+/i.exec(u); if (!m) return [];
    const h = o.key(m[0]); if (o.hosts[h] !== 1) return [];
    const rest = u.slice(m[0].length); const seen = {}; seen[h] = 1; const out = [];
    for (const org of o.list) { const k = o.key(org); if (seen[k]) continue; seen[k] = 1; out.push({ origin: org, url: org + rest }); if (out.length >= 4) break; }
    return out;
  }
  live(u) {
    u = str(u); const o = this.origins; if (!o.def) return u;
    const b = (/^https?:\/\/[^/?#]+/i.exec(this.base) || [])[0];
    if (!b || o.key(b) === o.key(o.def)) return u;
    const m = /^https?:\/\/[^/?#]+/i.exec(u); if (!m || m[0] === b) return u;
    const h = o.key(m[0]); if (o.hosts[h] !== 1 || h === o.key(b)) return u;
    // o.key() keeps sub-domains (api., img., static.…), which are not in the mirror list and stay untouched
    return b + u.slice(m[0].length);
  }
  // 0.0.3 — stable identities (Resume A Video / reading history): every title / chapter / episode URL handed to
  // an app is written with the source's DEFAULT domain, whatever domain is selected in the settings, and turned
  // back into the current domain before a script runs. The apps (Aniyomi/Nekoyomi, Mangayomi/YomiHub, LNReader,
  // Aidoku) key watch position + read state on that URL, so switching to a mirror domain no longer creates new
  // episodes and the player keeps resuming where the user left off.
  get origins() {
    if (this._orig) return this._orig;
    const d = (this.meta.config || {}).DOMAIN || {};
    const key = u => { const m = /^https?:\/\/(?:www\.|m\.)?([^/?#:]+)/i.exec(str(u).trim()); return m ? m[1].toLowerCase() : ''; };
    const set = {}; [this.meta.source, d.default].concat(d.values || []).map(key).filter(Boolean).forEach(h => { set[h] = 1; });
    const list = []; [d.default].concat(d.values || [], [this.meta.source]).forEach(u => { const mm = /^https?:\/\/[^/?#]+/i.exec(str(u).trim()); if (mm && list.indexOf(mm[0]) < 0) list.push(mm[0]); });
    const m0 = /^https?:\/\/[^/?#]+/i.exec(str(this.meta.source)); this._orig = { key, hosts: set, list, def: m0 ? m0[0] : '' };
    return this._orig;
  }
  canon(u) {
    u = str(u); const o = this.origins; if (!o.def) return u;
    const m = /^https?:\/\/[^/?#]+/i.exec(u); if (!m) return u;
    const h = o.key(m[0]); return (o.hosts[h] === 1 || h === o.key(this.base)) ? o.def + u.slice(m[0].length) : u;
  }
  decanon(u) {
    u = str(u); const o = this.origins; if (!o.def) return u;
    const b = (/^https?:\/\/[^/?#]+/i.exec(this.base) || [])[0];
    if (!b || b === o.def) return u;
    return u.slice(0, o.def.length) === o.def ? b + u.slice(o.def.length) : u;
  }
  has(name) { return !!this.scripts[name]; }
  async run(name, ...args) {
    const factory = this.scripts[name];
    // vBook also accepts script file names ("search.js") in tabs
    if (!factory) throw new Error('script ' + name + ' missing');
    const cfg = k => { if (k === 'DOMAIN') return this.base; const v = this.host.config(k); return v == null ? (this.meta.configDefaults || {})[k] : v; };
    const exec = await factory(this.env, cfg);
    if (typeof exec !== 'function') throw new Error(name + ': execute() not defined');
    const callArgs = args.map(a => (a && typeof a === 'object' ? a : str(a)));
    const res = await exec(...callArgs);
    if (!res) throw new Error(name + ': empty result');
    if (res.code !== 0) throw new Error(name + ': ' + str(res.data || 'error'));
    return res;
  }
  scriptFile(s) { return str(s).replace(/\.js$/, ''); }
  async tabs() {
    if (this.cache.tabs) return this.cache.tabs;
    let tabs = [];
    try { if (this.has('home')) tabs = (await this.run('home')).data || []; } catch (e) { this.host.log && this.host.log('home: ' + e.message); }
    if (!tabs.length && this.has('genre')) { try { tabs = ((await this.run('genre')).data || []).slice(0, 2); } catch (e) { } }
    this.cache.tabs = tabs.filter(t => t && t.script);
    return this.cache.tabs;
  }
  async genres() {
    if (this.cache.genres) return this.cache.genres;
    let list = [];
    try { if (this.has('genre')) list = (await this.run('genre')).data || []; } catch (e) { this.host.log && this.host.log('genre: ' + e.message); }
    this.cache.genres = list.filter(Boolean);
    return this.cache.genres;
  }
  async getFilters() {
    if (this.cache.filters) return this.cache.filters;
    const tabs = await this.tabs();
    const genres = await this.genres();
    this.cache.filters = buildFilterSchema(this.meta, tabs, genres);
    return this.cache.filters;
  }
  async list(scriptName, input, page, filterArg) {
    const sig = filterArg ? '|' + JSON.stringify(filterArg) : '';
    const key = scriptName + '|' + input + sig;
    page = Math.max(1, page | 0);
    const tok = page === 1 ? '' : this.tokens[key + '|' + page];
    if (page > 1 && tok == null) return { items: [], hasNext: false };
    const r = filterArg ? await this.run(scriptName, input, tok, filterArg) : await this.run(scriptName, input, tok);
    const next = str(r.data2);
    if (next) this.tokens[key + '|' + (page + 1)] = next;
    const items = (r.data || []).filter(Boolean).map(it => ({
      name: str(it.name).trim(), link: this.canon(abs(it.host || this.base + '/', it.link)), cover: abs(it.host || this.base + '/', it.cover),
      description: str(it.description), tag: str(it.tag),
    })).filter(it => it.name && it.link);
    return { items, hasNext: !!next && items.length > 0 };
  }
  async popular(page) {
    const tabs = await this.tabs();
    if (tabs[0]) return this.list(this.scriptFile(tabs[0].script), str(tabs[0].input), page);
    return this.search('', page);
  }
  async latest(page) {
    const tabs = await this.tabs();
    const t = tabs[1] || tabs[0];
    if (t) return this.list(this.scriptFile(t.script), str(t.input), page);
    return this.search('', page);
  }
  async search(q, page, rawFilters) {
    const f = normalizeFilters(rawFilters);
    if (isDefaultFilters(f)) {
      if (!this.has('search')) return { items: [], hasNext: false };
      return this.list('search', q, page);
    }
    let query = str(q).trim();
    const sb = str(f.search_by).trim();
    const isModeOnly = /^(?:title|author|keyword|tên|tác giả|từ khóa)$/i.test(sb);
    if (sb && !isModeOnly && !query) query = sb;

    let res = null;
    if (f.feed === 'shorts' && !query) {
      const tabs = await this.tabs();
      const st = tabs.find(t => /short/i.test(str(t.title || t.name) + ' ' + str(t.input)));
      if (st) res = await this.list(this.scriptFile(st.script), str(st.input), page);
    }
    if (!res && !query && f.genres && f.genres.length) {
      const g0 = f.genres[0];
      const glist = await this.genres();
      const match = glist.find(g => str(g.input) === g0 || str(g.title || g.name).toLowerCase() === g0.toLowerCase());
      if (match && match.input) {
        const scr = this.scriptFile(match.script || 'search');
        if (this.has(scr)) res = await this.list(scr, str(match.input), page);
      } else if (/^https?:\/\/|^\//i.test(g0) && this.has('search')) {
        res = await this.list('search', g0, page);
      }
    }
    if (!res && !query && f.category) {
      const tabs = await this.tabs();
      let tab = null;
      if (/^tab:\d+$/.test(f.category)) tab = tabs[parseInt(f.category.slice(4), 10)] || null;
      else tab = tabs.find(t => str(t.title || t.name).toLowerCase() === f.category.toLowerCase() || str(t.input) === f.category) || null;
      if (tab) res = await this.list(this.scriptFile(tab.script), str(tab.input), page);
      else if (f.category === 'latest') res = await this.latest(page);
      else if (f.category === 'popular') res = await this.popular(page);
      else if (f.category === 'completed') {
        const ctab = tabs.find(t => /hoàn|full|complete/i.test(str(t.title || t.name)));
        if (ctab) res = await this.list(this.scriptFile(ctab.script), str(ctab.input), page);
      } else if (/^https?:\/\/|^\//i.test(f.category) && this.has('search')) {
        res = await this.list('search', f.category, page);
      }
    }
    if (!res) {
      if (query) {
        if (!this.has('search')) return { items: [], hasNext: false };
        res = await this.list('search', query, page, f);
      } else {
        if (f.sort === 'latest') res = await this.latest(page);
        else {
          const tabs = await this.tabs();
          if (tabs[0]) res = await this.list(this.scriptFile(tabs[0].script), str(tabs[0].input), page);
          else if (this.has('search')) res = await this.list('search', '', page, f);
          else res = { items: [], hasNext: false };
        }
      }
    }
    return { items: applyClientFilters(res.items || [], f, this.meta), hasNext: !!res.hasNext };
  }
  async detail(url) {
    url = this.decanon(url);
    const d = (await this.run('detail', url)).data || {};
    const genres = [].concat(d.genres || [], d.tags || []).map(g => (typeof g === 'string' ? g : g && g.title)).filter(Boolean);
    return {
      name: str(d.name).trim(), cover: abs(d.host || this.base + '/', d.cover), author: str(d.author).trim(),
      description: stripHtml(str(d.description)), detail: stripHtml(str(d.detail)), ongoing: d.ongoing !== false && d.ongoing !== 'false',
      genres: uniq(genres.map(s => String(s).trim())), url: this.canon(url), format: str(d.format),
    };
  }
  async chapters(url) {
    url = this.decanon(url);
    let list = [];
    if (this.meta.type === 'novel' && this.has('page') && this.has('toc')) {
      // legacy contract: page.js lists TOC pages, toc.js parses each page
      const pages = (await this.run('page', url)).data || [url];
      for (const p of pages) list = list.concat((await this.run('toc', str(p))).data || []);
    } else if (this.has('toc')) list = (await this.run('toc', url)).data || [];
    return list.filter(c => c && c.url && c.type !== 'section').map((c, i) => ({ name: str(c.name).trim() || ('#' + (i + 1)), url: this.canon(abs(c.host || this.base + '/', c.url)), pay: !!(c.pay || c.lock) }));
  }
  async pages(url) {
    url = this.decanon(url);
    let data;
    if (this.has('chap') && this.meta.type === 'comic') data = (await this.run('chap', url)).data;
    else if (this.has('page')) data = (await this.run('page', url)).data;
    else data = [url];
    if (typeof data === 'string') data = data.split(/[\n,]+/);
    // vBook pages may be {link, fallback:[...]}: hosts without fallback support need the best single URL.
    const ph = u => !u || /^data:|loading|lazy|blank|placeholder|spacer|\/nocover|1x1\./i.test(String(u));
    const pick = p => {
      if (typeof p === 'string') return p;
      if (!p) return '';
      const main = p.link || p.url || p.data, fb = Array.isArray(p.fallback) ? p.fallback.filter(Boolean) : [];
      return ph(main) && fb.length ? fb[0] : main;
    };
    return (data || []).map(p => abs(this.base + '/', pick(p))).filter(Boolean);
  }
  async content(url) {
    url = this.decanon(url);
    const r = await this.run('chap', url);
    return { html: str(r.data), title: str(r.data2) };
  }
  async _resolveEmbedStream(rawUrl, referer, depth) {
    depth = depth || 0;
    let u = unwrapPlayerUrl(rawUrl);
    if (!u || isAdIframeUrl(u)) return null;
    const ref = referer || (this.base + '/');
    const hdrs = { Referer: ref, Origin: originOf(ref, this.base), 'User-Agent': DEFAULT_VIDEO_UA };
    if (/\.(?:m3u8|mp4)(?:[?#]|$)/i.test(u)) {
      return { url: u, headers: hdrs, mimeType: /\.m3u8/i.test(u) ? 'application/x-mpegURL' : 'video/mp4' };
    }
    if (depth >= 3 || !this.env || typeof this.env.fetch !== 'function') return null;
    let res;
    try { res = await this.env.fetch(u, { headers: hdrs }); } catch (e) { return null; }
    if (!res || !res.ok) return null;
    const pageUrl = res.url || u;
    const body = str(typeof res.text === 'function' ? res.text() : '');
    if (!body) return null;
    const pageHdrs = { Referer: pageUrl, Origin: originOf(pageUrl, this.base), 'User-Agent': DEFAULT_VIDEO_UA };
    const sniffed = sniffDirectStream(body);
    if (sniffed) {
      return { url: sniffed, headers: pageHdrs, mimeType: /\.m3u8/i.test(sniffed) ? 'application/x-mpegURL' : 'video/mp4' };
    }
    const vidM = /<(?:video|source)\b[^>]*\bsrc=["']([^"']+)["']/i.exec(body);
    if (vidM && vidM[1]) {
      const vu = abs(pageUrl, vidM[1]);
      if (vu && !isAdIframeUrl(vu) && /\.(?:m3u8|mp4)/i.test(vu)) {
        return { url: vu, headers: pageHdrs, mimeType: /\.m3u8/i.test(vu) ? 'application/x-mpegURL' : 'video/mp4' };
      }
    }
    const ifrRe = /<iframe\b[^>]*(?:data-primary-player-url|data-alternate-player-url|src|data-src|data-lazy-src)=["']([^"']+)["'][^>]*>/gi;
    let im, tried = 0;
    while ((im = ifrRe.exec(body)) && tried < 5) {
      const nextUrl = abs(pageUrl, im[1]);
      if (!nextUrl || nextUrl === u || nextUrl === pageUrl || isAdIframeUrl(nextUrl)) continue;
      tried++;
      const found = await this._resolveEmbedStream(nextUrl, pageUrl, depth + 1);
      if (found) return found;
    }
    return null;
  }
  async videos(url) {
    url = this.decanon(url);
    let servers = [{ title: 'Default', data: url }];
    if (this.has('chap')) {
      const d = (await this.run('chap', url)).data;
      if (Array.isArray(d) && d.length) servers = d.map(s => (typeof s === 'string' ? { title: 'Server', data: s } : { title: str(s.title || s.name || 'Server'), data: str(s.data || s.url || s.link) }));
    }
    const out = [];
    for (const s of servers) {
      try {
        const t = (await this.run('track', s.data)).data || {};
        const tracks = Array.isArray(t) ? t : [t];
        for (const tr of tracks) {
          if (!tr || !tr.data) continue;
          let streamUrl = abs(tr.host || this.base + '/', tr.data);
          let hdrs = tr.headers ? Object.assign({}, tr.headers) : { Referer: this.base + '/' };
          if (!hdrs.Referer && !hdrs.referer) hdrs.Referer = this.base + '/';
          if (!hdrs.Origin && !hdrs.origin) hdrs.Origin = originOf(hdrs.Referer || hdrs.referer, this.base);
          if (!hdrs['User-Agent'] && !hdrs['user-agent']) hdrs['User-Agent'] = DEFAULT_VIDEO_UA;
          let mimeType = str(tr.mimeType);
          if (tr.type === 'webview') {
            const resolved = await this._resolveEmbedStream(streamUrl, hdrs.Referer, 0);
            if (!resolved || !resolved.url) continue; // never expose webview/embed pages to the native player
            streamUrl = resolved.url;
            hdrs = Object.assign({}, hdrs, resolved.headers);
            if (!mimeType) mimeType = resolved.mimeType || '';
          }
          out.push({
            url: streamUrl,
            quality: s.title + (tr.quality ? ' ' + tr.quality : ''),
            headers: hdrs,
            subtitles: (tr.subtitles || (tr.subtitle ? [{ data: tr.subtitle, label: 'Sub' }] : [])).map(x => ({ file: abs(this.base + '/', x.data || x.file), label: str(x.label || x.language || 'Sub') })),
            // 0.0.5: separate audio renditions (YouTube serves video-only + audio-only streams)
            audios: (tr.audios || []).map(x => ({ file: abs(this.base + '/', x.data || x.file), label: str(x.label || x.language || 'Audio') })),
            mimeType,
            http2: !!tr.http2, // 0.0.5: stream host refuses HTTP/1.1 (see sources/nguonc/src/track.js)
          });
        }
      } catch (e) { this.host.log && this.host.log('track ' + s.title + ': ' + e.message); }
    }
    return out;
  }
}

export function stripHtml(h) {
  return String(h).replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n').trim();
}
