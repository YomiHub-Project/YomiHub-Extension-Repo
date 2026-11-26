// Generates README.md following Standard.md (The-Documentation-Compendium), bilingual VI/EN,
// with YomiHub-Project URLs, 9-app repository links, Filter Extension 10-item overview,
// full Output/ release download table, and per-source status tables from data/test-results.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const GH = 'YomiHub-Project/YomiHub-Extension-Repo';
const RAW = `https://raw.githubusercontent.com/${GH}/main/repo`;
const REL = `https://github.com/${GH}/releases/download/v${VERSION}`;

const src = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/sources.json'), 'utf8'));
const trp = path.join(ROOT, 'data/test-results.json');
const tr = fs.existsSync(trp) ? JSON.parse(fs.readFileSync(trp, 'utf8')) : null;
const byId = Object.fromEntries((tr ? tr.results : []).map(r => [r.id, r]));

const akTestPath = path.join(ROOT, 'data/aidoku-test-results.json');
let akTests = null;
if (fs.existsSync(akTestPath)) {
  try {
    akTests = JSON.parse(fs.readFileSync(akTestPath, 'utf8'));
  } catch {
    try {
      const raw = fs.readFileSync(akTestPath, 'utf8').replace(/^\uFEFF/, '');
      const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
      akTests = lines.map(l => ({ ok: l.trim().startsWith('OK') }));
    } catch {}
  }
}

const CF = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cloudflare.json'), 'utf8'));
const ST = fs.existsSync(path.join(ROOT, 'data/status.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data/status.json'), 'utf8')) : {};

const outDir = path.join(ROOT, 'Output');
const assets = fs.existsSync(outDir)
  ? fs.readdirSync(outDir)
      .filter(f => !fs.statSync(path.join(outDir, f)).isDirectory() && !/\.log$/i.test(f))
      .sort()
  : [];

const counts = {
  movie: src.filter(s => s.type === 'movie').length,
  comic: src.filter(s => s.type === 'comic').length,
  novel: src.filter(s => s.type === 'novel').length,
};

const TYPE_HEADING = {
  movie: 'Phim & Video / Anime & Video',
  comic: 'Truyện tranh / Manga & Comic',
  novel: 'Tiểu thuyết / Novel & Light Novel',
};

function fmtBytes(bytes) {
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function assetDesc(name) {
  if (name.includes('aniyomi-apks')) return 'Gói ZIP 44 APK Anime cho Aniyomi / *44 Anime APKs for Aniyomi*';
  if (name.includes('tachiyomi-apks')) return 'Gói ZIP 37 APK Manga cho Nekoyomi / Tachiyomi / *37 Manga APKs*';
  if (name.includes('nekoyomi-novel-apks')) return 'Gói ZIP 115 APK Novel cho Nekoyomi (`NovelSource`) / *115 Novel APKs*';
  if (name.includes('mangayomi-yomihub')) return 'Gói ZIP module JS cho Mangayomi & YomiHub / *Mangayomi & YomiHub JS bundle*';
  if (name.includes('lnreader-ireader')) return 'Gói ZIP plugin ES5 cho LNReader & IReader / *LNReader & IReader plugins*';
  if (name.includes('vbook-leechtext')) return 'Gói ZIP tiện ích chuẩn vBook & LeechText / *vBook & LeechText packages*';
  if (name.includes('aidoku')) return 'Gói ZIP `.aix` WASM cho Aidoku (iOS/iPadOS) / *Aidoku WASM packages*';
  if (name === 'index.json') return 'Chỉ mục kho Mangayomi / YomiHub / *Mangayomi & YomiHub index*';
  if (name === 'index.min.json') return 'Chỉ mục kho APK tổng hợp Aniyomi / Nekoyomi / *Combined APK repo index*';
  if (name === 'plugins.min.json') return 'Chỉ mục kho LNReader / IReader / *LNReader & IReader plugin index*';
  if (name === 'plugin.json') return 'Chỉ mục kho vBook / LeechText / *vBook & LeechText repo index*';
  return 'Tệp phát hành / *Release asset*';
}

function akCount() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'repo/aidoku/index.min.json'), 'utf8')).sources.length;
  } catch {
    return counts.comic + counts.novel;
  }
}

function status(r, id) {
  if (r && r.pass) return '✅ Hoạt động';
  if ((ST.dead || {})[id]) return '⛔ **Ngừng hoạt động** – ' + ST.dead[id];
  if ((ST.blocked || {})[id]) return '🌐 ' + ST.blocked[id];
  if ((ST.login || {})[id]) return '🔐 ' + ST.login[id];
  if ((ST.protected || {})[id]) return '🔒 ' + ST.protected[id];
  if ((ST.api || {})[id]) return '🧩 ' + ST.api[id];
  if ((CF.interactive || []).includes(id)) return '🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView';
  if ((CF.ipblock || []).includes(id)) return '🛡️ Cloudflare chặn IP Việt Nam – cần VPN';
  if ((CF.notcf || {})[id]) return '🟠 ' + CF.notcf[id];
  if ((CF.auto || []).includes(id) && !(r && r.pass)) return '🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần';
  if (!r) return '⚪ Chưa kiểm thử';
  const s = r.steps || {};
  const f = Object.entries(s).find(([, v]) => !v.ok);
  const e = f ? f[1].error || '' : r.error || '';
  if (/HTTP 0|ENOTFOUND|fetch failed|ECONN|timeout popular/.test(e) || (f && f[0] === 'popular' && /HTTP 0/.test(e))) {
    return '🔴 Không truy cập được (tên miền chết / bị chặn)';
  }
  if (/HTTP 403|HTTP 5\d\d/.test(e)) return '🟠 Bị Cloudflare / máy chủ chặn';
  if (/Headless browser/.test(e)) return '🟠 Cần WebView (chỉ chạy trên vBook)';
  const ok = Object.entries(s).filter(([, v]) => v.ok).map(([k]) => k);
  return '🟡 Một phần (' + (ok.length ? ok.join(', ') + ' ✓; ' : '') + (f ? f[0] + ' lỗi' : 'lỗi') + ')';
}

const passCount = tr ? tr.results.filter(r => r.pass).length : 0;
const passByType = t => tr ? tr.results.filter(r => r.pass && r.type === t).length : 0;
const akPass = Array.isArray(akTests) ? akTests.filter(r => r.ok).length : 0;
const akTotal = Array.isArray(akTests) ? akTests.length : akCount();
const testDate = tr && tr.date ? tr.date.slice(0, 10) : '';

let catalogRows = '';
for (const t of ['movie', 'comic', 'novel']) {
  const list = src.filter(s => s.type === t);
  catalogRows += `\n### ${TYPE_HEADING[t]} (${list.length})\n\n`;
  catalogRows += `| # | Nguồn / Source | Tên miền / Domain | Ngôn ngữ / Lang | 18+ | Trạng thái / Status |\n`;
  catalogRows += `|---|---|---|---|---|---|\n`;
  list.forEach((s, i) => {
    const dom = (s.urls && s.urls[0] ? s.urls[0] : s.host || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
    catalogRows += `| ${i + 1} | ${s.name} | ${dom} | ${s.lang_code} | ${s.nsfw ? '🔞' : ''} | ${status(byId[s.id], s.id)} |\n`;
  });
}

function yhSection() {
  const mp = path.join(ROOT, 'sources-yomihub/meta.json');
  if (!fs.existsSync(mp)) return { count: 0, md: '' };
  const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
  const T = { 0: 'Truyện tranh', 1: 'Phim & Điện ảnh', 2: 'Tiểu thuyết' };
  let t = `\n### Tiện ích YomiHub / YomiHub Extensions (${m.sources.length})\n\n`;
  t += `Các tiện ích website chuyển từ bản tích hợp sẵn trong YomiHub ${m.version} sang kho (\`repo/yomihub/\`, định dạng Mangayomi JS), giữ nguyên ID để nhận cập nhật tự động.\n\n`;
  t += '| # | Tiện ích / Extension | Mục / Category | Trang chủ / Website | Ngôn ngữ / Lang | 18+ | Mã nguồn / Code |\n|---|---|---|---|---|---|---|\n';
  m.sources.forEach((s, i) => {
    t += `| ${i + 1} | ${s.name} | ${T[s.itemType]} | ${s.baseUrl} | ${s.lang} | ${s.nsfw ? '🔞' : ''} | [${s.asset}](repo/yomihub/${s.asset}) |\n`;
  });
  return { count: m.sources.length, md: t };
}

const yh = yhSection();

const dlRows = assets.length
  ? assets.map(a => {
      const sz = fmtBytes(fs.statSync(path.join(outDir, a)).size);
      return `| [${a}](${REL}/${encodeURIComponent(a)}) | ${sz} | ${assetDesc(a)} |`;
    }).join('\n')
  : '| *(đang cập nhật)* | — | — |';

const verSlug = VERSION.replace(/\./g, '');
const passPct = src.length ? ((passCount * 100) / src.length).toFixed(1) : '0.0';

const md = `# Kiritokmn - Extension Repo

<p align="center">
  <img src="data/brand/repo-icon.png" alt="YomiHub Extension Repo Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Universal Extension Repository for Anime, Manga &amp; Novel Readers</strong><br>
  <em>Một kho tiện ích đa nền tảng dùng chung cho Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText và Aidoku</em>
</p>

<p align="center">
  <a href="#điểm-mới-trong-phiên-bản-${verSlug}--whats-new-in-${verSlug}"><img src="https://img.shields.io/badge/Version-${encodeURIComponent(VERSION)}-blue.svg?style=flat-square" alt="Version ${VERSION}"></a>
  <a href="#danh-mục-nguồn--source-catalog"><img src="https://img.shields.io/badge/Sources-${src.length}%20Total-green.svg?style=flat-square" alt="${src.length} Sources"></a>
  <a href="#phim--video--anime--video-${counts.movie}"><img src="https://img.shields.io/badge/Anime-${counts.movie}%20Sources-orange.svg?style=flat-square" alt="${counts.movie} Anime Sources"></a>
  <a href="#truyện-tranh--manga--comic-${counts.comic}"><img src="https://img.shields.io/badge/Manga-${counts.comic}%20Sources-purple.svg?style=flat-square" alt="${counts.comic} Manga Sources"></a>
  <a href="#tiểu-thuyết--novel--light-novel-${counts.novel}"><img src="https://img.shields.io/badge/Novel-${counts.novel}%20Sources-red.svg?style=flat-square" alt="${counts.novel} Novel Sources"></a>
  <a href="#đóng-góp--giấy-phép--contributing--license"><img src="https://img.shields.io/badge/License-GPL--3.0-lightgrey.svg?style=flat-square" alt="GPL-3.0 License"></a>
</p>

---

## Mục lục / Table of Contents

- [Giới thiệu dự án / About The Project](#giới-thiệu-dự-án--about-the-project)
  - [Ứng dụng hỗ trợ / Supported Applications](#ứng-dụng-hỗ-trợ--supported-applications)
  - [Tính năng nổi bật / Key Features](#tính-năng-nổi-bật--key-features)
- [Cài đặt & Sử dụng / Getting Started](#cài-đặt--sử-dụng--getting-started)
  - [Đường dẫn Repository / Repository URLs](#đường-dẫn-repository--repository-urls)
  - [Cài đặt nhanh bằng Deep Link / One-Click Deep Links](#cài-đặt-nhanh-bằng-deep-link--one-click-deep-links)
  - [Hướng dẫn chi tiết từng ứng dụng / Installation by App](#hướng-dẫn-chi-tiết-từng-ứng-dụng--installation-by-app)
- [Tải về bản phát hành / Releases & Downloads](#tải-về-bản-phát-hành--releases--downloads)
- [Điểm mới trong phiên bản ${VERSION} / What's New in ${VERSION}](#điểm-mới-trong-phiên-bản-${verSlug}--whats-new-in-${verSlug})
- [Danh mục nguồn / Source Catalog](#danh-mục-nguồn--source-catalog)
  - [Phim & Video / Anime & Video (${counts.movie})](#phim--video--anime--video-${counts.movie})
  - [Truyện tranh / Manga & Comic (${counts.comic})](#truyện-tranh--manga--comic-${counts.comic})
  - [Tiểu thuyết / Novel & Light Novel (${counts.novel})](#tiểu-thuyết--novel--light-novel-${counts.novel})${yh.count ? `\n  - [Tiện ích YomiHub / YomiHub Extensions (${yh.count})](#tiện-ích-yomihub--yomihub-extensions-${yh.count})` : ''}
- [Kiến trúc & Phát triển / Development & Architecture](#kiến-trúc--phát-triển--development--architecture)
- [Đóng góp & Giấy phép / Contributing & License](#đóng-góp--giấy-phép--contributing--license)

---

## Giới thiệu dự án / About The Project

**VI**: **Kiritokmn - Extension Repo** là kho tiện ích mở rộng đa năng cho các ứng dụng xem phim hoạt hình (Anime), đọc truyện tranh (Manga) và tiểu thuyết chữ (Light Novel / Web Novel). Kiến trúc **Write Once, Run Everywhere** cho phép định nghĩa mỗi nguồn **một lần duy nhất** theo chuẩn vBook (JavaScript), sau đó bộ biên dịch tự động đóng gói sang định dạng gốc của toàn bộ **9 ứng dụng** phổ biến nhất hiện nay.

**EN**: **Kiritokmn - Extension Repo** is a universal multi-platform extension repository for Anime, Manga, and Novel reader applications. Each source is authored **once** in standard vBook JavaScript and automatically transpiled, optimized, and packaged into native extension formats for all **9 supported applications**.

### Ứng dụng hỗ trợ / Supported Applications

| # | Ứng dụng / Application | Nền tảng / OS | Thể loại / Category | Định dạng xuất / Target Format |
|---|---|---|---|---|
| 1 | **Aniyomi** | Android | Anime, Phim & Video (${counts.movie}) | APK riêng từng nguồn (\`eu.kanade.tachiyomi.animeextension.*\`, Rhino + jsoup) |
| 2 | **Nekoyomi / Tachiyomi** | Android | Manga (${counts.comic}) + Novel (${counts.novel}) | APK riêng từng nguồn (\`extension.*\` & \`novelextension.*\` chuẩn \`NovelSource\`) |
| 3 | **Mangayomi** | Android, iOS, Desktop | Anime, Manga, Novel | Module JavaScript (\`MProvider\`), hỗ trợ chỉ mục tổng hợp & tách mục |
| 4 | **YomiHub** | Android, Desktop | Anime, Manga, Novel | Mangayomi JS modules + gói vBook + cờ Short Video |
| 5 | **LNReader** | Android | Tiểu thuyết (Novel, ${counts.novel}) | Plugin JavaScript CommonJS ES5 |
| 6 | **IReader** | Android, Desktop | Tiểu thuyết (Novel, ${counts.novel}) | Dùng chung kho plugin JS ES5 với LNReader |
| 7 | **vBook** | Android | Manga, Novel (${src.length}) | Gói zip chuẩn vBook (\`.zip\`) |
| 8 | **LeechText** | Android | Manga, Novel (${src.length}) | Dùng chung kho gói zip chuẩn vBook |
| 9 | **Aidoku** | iOS, iPadOS, macOS | Manga + Novel (${akCount()}) | Gói \`.aix\` (WebAssembly Rust + JavaScriptCore) — xem [docs/AIDOKU.md](docs/AIDOKU.md) |

### Tính năng nổi bật / Key Features

- **Filter Extension 10 mục thống nhất (0.0.9)**: Bộ lọc tìm kiếm & duyệt đầy đủ 10 tiêu chí (*Sắp Xếp, Tình Trạng, Danh Mục, Phân Loại Nội Dung, Quốc Gia Phát Hành, Năm Phát Hành, Tìm Theo, Đánh Giá, Bản Dịch, Thể Loại*) hoạt động đồng bộ trên Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader và Aidoku.
- **Tách riêng 3 kho Anime / Manga / Novel (0.0.9)**: Cung cấp 3 kho APK độc lập (\`repo/anime/index.min.json\`, \`repo/manga/index.min.json\`, \`repo/novel/index.min.json\`) kèm 3 chỉ mục tách mục cho Mangayomi/YomiHub (\`repo/mangayomi/{anime,manga,novel}.json\`).
- **Phát video trực tiếp trong app — không qua WebView (0.0.9)**: Tự động bóc iframe đa tầng (tối đa 3 lớp), giải mã luồng \`m3u8\`/\`mp4\` kèm \`Referer\`/\`Origin\`/\`User-Agent\` để phát thẳng trong trình phát nội bộ.
- **Chặn quảng cáo & Bảo vệ runtime (0.0.9)**: Tích hợp \`C.cleanAds\` (Tampermonkey Adblock rules), \`C.cleanDevTools\` và \`C.sniff\` (chuẩn Tiyo / StreamSniper) trong \`lib/lib_common.js\`.
- **Tùy biến tên miền & Giữ nguyên tiến độ xem**: Cho phép chọn gương hoặc nhập \`DOMAIN_CUSTOM\` trên mọi app mà không làm mất thư viện, lịch sử hay mốc **Resume A Video** (\`canon()\`/\`decanon()\`).
- **Biểu tượng riêng 256×256 & Kiểm thử mạng thật**: 196/196 nguồn có logo PNG 256×256 riêng biệt và được kiểm thử tự động trước khi phát hành.

---

## Cài đặt & Sử dụng / Getting Started

### Đường dẫn Repository / Repository URLs

| Ứng dụng / App | Mục đích / Purpose | Đường dẫn Repo / Repository URL |
|---|---|---|
| **Aniyomi** | Chỉ Anime & Video (${counts.movie} APK) | \`${RAW}/anime/index.min.json\` |
| **Nekoyomi** | Chỉ Truyện tranh (${counts.comic} APK) | \`${RAW}/manga/index.min.json\` |
| **Nekoyomi (Novel)** | Chỉ Tiểu thuyết (${counts.novel} APK \`NovelSource\`) | \`${RAW}/novel/index.min.json\` |
| **Aniyomi / Nekoyomi (Tổng hợp)** | Toàn bộ ${src.length} APK (Anime + Manga + Novel) | \`${RAW}/index.min.json\` |
| **Mangayomi / YomiHub (Tổng hợp)** | Tất cả Anime, Manga & Novel | \`${RAW}/index.json\` |
| **Mangayomi / YomiHub (Tách mục)** | Chỉ Anime / Manga / Novel | \`${RAW}/mangayomi/anime.json\` · \`.../manga.json\` · \`.../novel.json\` |
| **LNReader / IReader** | Tiểu thuyết (${counts.novel} nguồn) | \`${RAW}/plugins.min.json\` |
| **vBook / LeechText / YomiHub (vBook)** | Tất cả nguồn dạng gói \`.zip\` | \`${RAW}/plugin.json\` |
| **Aidoku** (iOS / iPadOS) | Manga & Novel (${akCount()} gói \`.aix\`) | \`${RAW}/aidoku/index.min.json\` |

> **Gốc CDN / Base CDN**: \`${RAW}/\`

### Cài đặt nhanh bằng Deep Link / One-Click Deep Links

Mở trang này trên điện thoại và chạm vào liên kết tương ứng để thêm kho tự động:

- **Aniyomi (Anime — ${counts.movie} nguồn)**:  
  [\`aniyomi://add-repo?url=${RAW}/anime/index.min.json\`](aniyomi://add-repo?url=${RAW}/anime/index.min.json)
- **Nekoyomi / Tachiyomi (Manga — ${counts.comic} nguồn)**:  
  [\`tachiyomi://add-repo?url=${RAW}/manga/index.min.json\`](tachiyomi://add-repo?url=${RAW}/manga/index.min.json)
- **Nekoyomi (Novel — ${counts.novel} nguồn)**:  
  [\`tachiyomi://add-repo?url=${RAW}/novel/index.min.json\`](tachiyomi://add-repo?url=${RAW}/novel/index.min.json)
- **Mangayomi / YomiHub**:  
  [\`mangayomi://add-repo?repo_name=Kiritokmn&manga_url=${RAW}/index.json&anime_url=${RAW}/index.json&novel_url=${RAW}/index.json\`](mangayomi://add-repo?repo_name=Kiritokmn&manga_url=${RAW}/index.json&anime_url=${RAW}/index.json&novel_url=${RAW}/index.json)
- **LNReader / IReader**:  
  [\`lnreader://repo/add?url=${RAW}/plugins.min.json\`](lnreader://repo/add?url=${RAW}/plugins.min.json)
- **Aidoku (iOS / iPadOS)**:  
  [\`aidoku://addSourceList?url=${RAW}/aidoku/index.min.json\`](aidoku://addSourceList?url=${RAW}/aidoku/index.min.json)

### Hướng dẫn chi tiết từng ứng dụng / Installation by App

1. **Aniyomi / Nekoyomi**: Vào **Thêm** (*More*) → **Cài đặt** (*Settings*) → **Duyệt** (*Browse*) → **Kho tiện ích** (*Extension repositories*) → \`+\` → dán link tách riêng (\`anime/index.min.json\`, \`manga/index.min.json\`, \`novel/index.min.json\`) hoặc \`index.min.json\`.
   - *Lưu ý nâng cấp từ 0.0.4 trở về trước*: gỡ 4 tiện ích gộp cũ rồi cài APK từng nguồn mới; Source ID giữ nguyên nên không mất thư viện hay lịch sử.
   - *Lưu ý E-Hentai*: từ 0.0.8, gói đổi sang \`eu.kanade.tachiyomi.extension.all.kiriehentai\` (Đa ngôn ngữ); hãy gỡ bản \`vi\` cũ nếu còn cài song song.
2. **Mangayomi / YomiHub**: Vào **Tiện ích** (*Extensions*) → \`⋮\` → **Kho tiện ích** (*Repository*) → \`+\` → dán \`${RAW}/index.json\` (hoặc các link tách mục \`mangayomi/{anime,manga,novel}.json\`).
3. **LNReader / IReader**: Vào **Tiện ích** (*Plugins*) → **Kho** (*Repositories*) → \`+\` → dán \`${RAW}/plugins.min.json\`.
4. **vBook / LeechText**: Vào **Cài đặt** → **Kho tiện ích** → **Thêm** → dán \`${RAW}/plugin.json\`.
5. **Aidoku** (≥ 0.8.3): Vào **Settings** → **Source Lists** → \`+\` → dán \`${RAW}/aidoku/index.min.json\`, sau đó vào **Browse** để cài gói \`.aix\`.

---

## Tải về bản phát hành / Releases & Downloads

Trang phát hành chính thức: **https://github.com/${GH}/releases/tag/v${VERSION}**

| Tệp / Asset | Dung lượng / Size | Mô tả / Description |
|---|---|---|
${dlRows}

---

## Điểm mới trong phiên bản ${VERSION} / What's New in ${VERSION}

Xem lịch sử chi tiết tại [CHANGELOG.md](CHANGELOG.md) và ghi chú kỹ thuật tại [TECHNICAL_UPDATE_NOTES.md](TECHNICAL_UPDATE_NOTES.md).

- **Hệ thống Bộ Lọc thống nhất 10 mục (Filter Extension + chuẩn Tiyo):**
  - Triển khai đồng bộ 10 bộ lọc trên \`runtime/engine.js\`, \`runtime/rhino-prelude.js\`, \`hosts/mangayomi.tail.js\`, \`hosts/lnreader.js\`, \`hosts/aidoku.tail.js\`, \`aidoku/bridge\` (\`BRIDGE_REV = 5\`), và các module Android Kotlin (\`VBookAnimeFactory\`, \`VBookMangaFactory\`, \`VBookNovelFactory\`):
    1. \`sort\` — *Sắp Xếp* (Mặc định, Mới cập nhật, Phổ biến nhất, Xem nhiều nhất, Đánh giá cao, Tên A-Z)
    2. \`status\` — *Tình Trạng* (Tất Cả, Đang Tiến Hành, Tạm Ngưng, Hoàn Thành)
    3. \`category\` — *Danh Mục* (tự động từ \`tabs\` của nguồn)
    4. \`content_rating\` — *Phân Loại Nội Dung* (Tất Cả, An toàn SFW, 18+ NSFW)
    5. \`country\` — *Quốc Gia Phát Hành* (Việt Nam, Trung Quốc, Nhật Bản, Hàn Quốc, Âu Mỹ, Khác)
    6. \`year\` — *Năm Phát Hành* (2026 → 2020, Trước 2020)
    7. \`search_by\` — *Tìm Theo* (Tên, Tác giả, Từ khóa)
    8. \`rating\` — *Đánh Giá* (9+, 8+, 7+, 5+ sao)
    9. \`translation\` — *Bản Dịch* (Vietsub / Dịch, Thuyết minh / Lồng tiếng, Convert, Raw / Gốc)
    10. \`genres\` — *Thể Loại* (nhóm CheckBox theo nguồn / thể loại chuẩn)
- **Tách riêng hoàn toàn Anime / Manga / Novel (${counts.movie} / ${counts.comic} / ${counts.novel}):**
  - Bổ sung module Android \`novel-core\` và \`novel\` chuẩn ABI \`NovelSource\` của Nekoyomi, dựng **${src.length} APK** (${counts.movie} Anime + ${counts.comic} Manga + ${counts.novel} Novel) với \`APK_REV = 2\`.
  - Xuất 3 kho APK độc lập (\`repo/anime/\`, \`repo/manga/\`, \`repo/novel/\`) có đầy đủ \`index.min.json\`, \`repo.json\`, \`apk/\`, \`icon/\` và 3 chỉ mục tách mục Mangayomi (\`repo/mangayomi/{anime,manga,novel}.json\`).
- **Phát video trực tiếp trong ứng dụng (Direct In-App Playback — KHÔNG qua WebView):**
  - Nâng cấp \`track()\` trong \`lib/lib_generic.js\` và \`videos()\` trong \`runtime/engine.js\`: bóc iframe nhiều tầng (tối đa depth 3), loại bỏ \`type: 'webview'\` khi dò được luồng phát, gắn đầy đủ \`Referer\`/\`Origin\`/\`User-Agent\`.
- **Chặn quảng cáo & Giải mã nâng cao (Tampermonkey Adblock Script + DevTools Project):**
  - Bổ sung \`C.cleanAds(docOrHtml)\` trong \`lib/lib_common.js\` (loại banner, popup, overlay, iframe quảng cáo không kích hoạt anti-adblock), lọc ảnh rác trong \`pages()\` và iframe quảng cáo trong \`track()\`, củng cố \`C.cleanDevTools\` và \`C.sniff\`.
- **Chuyển kho chính thức sang tổ chức \`${GH}\`:**
  - Cập nhật toàn bộ URL \`raw.githubusercontent.com\`, GitHub Releases, và cấu hình \`publish.ps1\` / \`build-all.mjs\` / \`aniyomi-index.mjs\`.
- **Kiểm thử mạng thật (${testDate || 'mới nhất'}):** Đạt **${passCount}/${src.length} PASS (${passPct}%)** (Phim ${passByType('movie')}/${counts.movie} · Truyện tranh ${passByType('comic')}/${counts.comic} · Tiểu thuyết ${passByType('novel')}/${counts.novel}); mô phỏng Aidoku đạt **${akPass}/${akTotal}**.

---

## Danh mục nguồn / Source Catalog

Kiểm thử tự động trên mạng Việt Nam${testDate ? ` (${testDate})` : ''}: **${passCount}/${src.length}** nguồn chạy trọn chuỗi danh sách → chi tiết → mục lục → nội dung/luồng phát.

Ký hiệu: ✅ hoạt động · ⛔ ngừng hoạt động (vẫn giữ trong kho) · 🛡️ Cloudflare · 🌐 bị chặn ở VN (cần VPN) · 🔐 cần đăng nhập · 🔒 chống lấy dữ liệu · 🧩 cần API/máy chủ riêng · 🟡 chạy một phần · 🔴 không truy cập được. Nguồn lỗi truy cập thường do trang đổi tên miền — vào cài đặt nguồn để đổi **Tên miền**.
${catalogRows}${yh.md}

---

## Kiến trúc & Phát triển / Development & Architecture

### Cấu trúc thư mục / Directory Layout

\`\`\`
YomiHub-Extension-Repo/
├── sources/<id>/             # 196 nguồn chuẩn vBook (plugin.json + src/*.js) [NƠI DUY NHẤT SỬA NGUỒN]
├── sources-yomihub/          # Tiện ích website chuyển từ YomiHub 0.5.3
├── lib/                      # Thư viện dùng chung (lib_common.js, lib_generic.js, lib_madara.js, ...)
├── runtime/                  # Engine (engine.js, dom.js, vbook.js, url.js, rhino-prelude.js)
├── hosts/                    # Adapter cho Mangayomi, LNReader/IReader, Aidoku, Node test
├── aidoku/                   # Cầu nối Rust/WASM cho Aidoku (bridge/) + icons
├── android/                  # Gradle APK: anime/ (44), manga/ (37), novel/ (115) + *-core + shared/
├── tools/                    # Công cụ build, kiểm thử mạng thật (run-tests.mjs), gen-readme.mjs
├── data/                     # Danh sách nguồn, trạng thái (status.json), kết quả kiểm thử
├── test/                     # Unit tests (domain-switch.test.mjs, filter-extension.test.mjs)
├── repo/                     # ĐẦU RA BIÊN DỊCH cho các ứng dụng (không sửa tay)
└── Output/                   # Gói zip và chỉ mục json tải lên GitHub Releases
\`\`\`

### Quy trình biên dịch & kiểm thử / Build & Test Commands

\`\`\`bash
npm install
node test/domain-switch.test.mjs
node test/filter-extension.test.mjs
npm run build                                            # Biên dịch 196 nguồn -> repo/ & android/*/gen/
node tools/test/run-tests.mjs --stream --dns 1.1.1.1,8.8.8.8 --conc 6
node tools/test/aidoku-sim.mjs --all --conc 6
powershell android/build_apks.ps1                        # Dựng & ký 196 APK (Anime + Manga + Novel)
node tools/build/make-output.mjs                         # Đóng gói Output/
node tools/docs/gen-readme.mjs                           # Sinh README.md
\`\`\`

---

## Đóng góp & Giấy phép / Contributing & License

### Quy định đóng góp / Contribution Guidelines

1. **Đọc tài liệu bắt buộc**: Đọc toàn bộ \`A.I Brain - Second Brain/\` (00 → 12), \`AGENTS.md\` và \`TECHNICAL_UPDATE_NOTES.md\` trước khi chỉnh sửa.
2. **Không sửa tay \`repo/\`**: \`repo/\` là đầu ra tự động của \`npm run build\`. Mọi thay đổi nguồn thực hiện trong \`sources/<id>/\`.
3. **Tăng phiên bản**: Tăng \`version\` trong \`sources/<id>/plugin.json\` khi sửa nguồn; tăng \`package.json\` khi phát hành.
4. **Không xóa nguồn chết**: Đánh dấu vào \`data/status.json\` → \`dead\` để giữ thư viện người dùng cũ.
5. **Bảo mật khóa ký**: Tuyệt đối không commit \`android/*.jks\`, \`android/keystore.properties\`, \`*.cer\`.

### Giấy phép / License

Dự án được phân phối dưới giấy phép mã nguồn mở **GNU General Public License v3.0 (GPL-3.0)**. Một số nguồn tái sử dụng tiện ích vBook mã nguồn mở của cộng đồng (ghi công tác giả gốc trong \`plugin.json\`).

---

<p align="center">
  <em>Được bảo trì và phát triển bởi <strong>Kiritokmn</strong> &amp; <strong>YomiHub-Project</strong>.</em>
</p>
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('README written', md.length, 'bytes, version', VERSION, 'assets', assets.length);
