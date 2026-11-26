# Kiritokmn - Extension Repo

<p align="center">
  <img src="data/brand/repo-icon.png" alt="YomiHub Extension Repo Logo" width="128" height="128">
</p>

<p align="center">
  <strong>Universal Extension Repository for Anime, Manga &amp; Novel Readers</strong><br>
  <em>Một kho tiện ích đa nền tảng dùng chung cho Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText và Aidoku</em>
</p>

<p align="center">
  <a href="#điểm-mới-trong-phiên-bản-010--whats-new-in-010"><img src="https://img.shields.io/badge/Version-0.1.0-blue.svg?style=flat-square" alt="Version 0.1.0"></a>
  <a href="#danh-mục-nguồn--source-catalog"><img src="https://img.shields.io/badge/Sources-196%20Total-green.svg?style=flat-square" alt="196 Sources"></a>
  <a href="#phim--video--anime--video-44"><img src="https://img.shields.io/badge/Anime-44%20Sources-orange.svg?style=flat-square" alt="44 Anime Sources"></a>
  <a href="#truyện-tranh--manga--comic-37"><img src="https://img.shields.io/badge/Manga-37%20Sources-purple.svg?style=flat-square" alt="37 Manga Sources"></a>
  <a href="#tiểu-thuyết--novel--light-novel-115"><img src="https://img.shields.io/badge/Novel-115%20Sources-red.svg?style=flat-square" alt="115 Novel Sources"></a>
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
- [Điểm mới trong phiên bản 0.1.0 / What's New in 0.1.0](#điểm-mới-trong-phiên-bản-010--whats-new-in-010)
- [Danh mục nguồn / Source Catalog](#danh-mục-nguồn--source-catalog)
  - [Phim & Video / Anime & Video (44)](#phim--video--anime--video-44)
  - [Truyện tranh / Manga & Comic (37)](#truyện-tranh--manga--comic-37)
  - [Tiểu thuyết / Novel & Light Novel (115)](#tiểu-thuyết--novel--light-novel-115)
  - [Tiện ích YomiHub / YomiHub Extensions (29)](#tiện-ích-yomihub--yomihub-extensions-29)
- [Kiến trúc & Phát triển / Development & Architecture](#kiến-trúc--phát-triển--development--architecture)
- [Đóng góp & Giấy phép / Contributing & License](#đóng-góp--giấy-phép--contributing--license)

---

## Giới thiệu dự án / About The Project

**VI**: **Kiritokmn - Extension Repo** là kho tiện ích mở rộng đa năng cho các ứng dụng xem phim hoạt hình (Anime), đọc truyện tranh (Manga) và tiểu thuyết chữ (Light Novel / Web Novel). Kiến trúc **Write Once, Run Everywhere** cho phép định nghĩa mỗi nguồn **một lần duy nhất** theo chuẩn vBook (JavaScript), sau đó bộ biên dịch tự động đóng gói sang định dạng gốc của toàn bộ **9 ứng dụng** phổ biến nhất hiện nay.

**EN**: **Kiritokmn - Extension Repo** is a universal multi-platform extension repository for Anime, Manga, and Novel reader applications. Each source is authored **once** in standard vBook JavaScript and automatically transpiled, optimized, and packaged into native extension formats for all **9 supported applications**.

### Ứng dụng hỗ trợ / Supported Applications

| # | Ứng dụng / Application | Nền tảng / OS | Thể loại / Category | Định dạng xuất / Target Format |
|---|---|---|---|---|
| 1 | **Aniyomi** | Android | Anime, Phim & Video (44) | APK riêng từng nguồn (`eu.kanade.tachiyomi.animeextension.*`, Rhino + jsoup) |
| 2 | **Nekoyomi / Tachiyomi** | Android | Manga (37) + Novel (115) | APK riêng từng nguồn (`extension.*` & `novelextension.*` chuẩn `NovelSource`) |
| 3 | **Mangayomi** | Android, iOS, Desktop | Anime, Manga, Novel | Module JavaScript (`MProvider`), hỗ trợ chỉ mục tổng hợp & tách mục |
| 4 | **YomiHub** | Android, Desktop | Anime, Manga, Novel | Mangayomi JS modules + gói vBook + cờ Short Video |
| 5 | **LNReader** | Android | Tiểu thuyết (Novel, 115) | Plugin JavaScript CommonJS ES5 |
| 6 | **IReader** | Android, Desktop | Tiểu thuyết (Novel, 115) | Dùng chung kho plugin JS ES5 với LNReader |
| 7 | **vBook** | Android | Manga, Novel (196) | Gói zip chuẩn vBook (`.zip`) |
| 8 | **LeechText** | Android | Manga, Novel (196) | Dùng chung kho gói zip chuẩn vBook |
| 9 | **Aidoku** | iOS, iPadOS, macOS | Manga + Novel (152) | Gói `.aix` (WebAssembly Rust + JavaScriptCore) — xem [docs/AIDOKU.md](docs/AIDOKU.md) |

### Tính năng nổi bật / Key Features

- **Filter Extension 10 mục thống nhất (0.0.9)**: Bộ lọc tìm kiếm & duyệt đầy đủ 10 tiêu chí (*Sắp Xếp, Tình Trạng, Danh Mục, Phân Loại Nội Dung, Quốc Gia Phát Hành, Năm Phát Hành, Tìm Theo, Đánh Giá, Bản Dịch, Thể Loại*) hoạt động đồng bộ trên Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader và Aidoku.
- **Tách riêng 3 kho Anime / Manga / Novel (0.0.9)**: Cung cấp 3 kho APK độc lập (`repo/anime/index.min.json`, `repo/manga/index.min.json`, `repo/novel/index.min.json`) kèm 3 chỉ mục tách mục cho Mangayomi/YomiHub (`repo/mangayomi/{anime,manga,novel}.json`).
- **Phát video trực tiếp trong app — không qua WebView (0.0.9)**: Tự động bóc iframe đa tầng (tối đa 3 lớp), giải mã luồng `m3u8`/`mp4` kèm `Referer`/`Origin`/`User-Agent` để phát thẳng trong trình phát nội bộ.
- **Chặn quảng cáo & Bảo vệ runtime (0.0.9)**: Tích hợp `C.cleanAds` (Tampermonkey Adblock rules), `C.cleanDevTools` và `C.sniff` (chuẩn Tiyo / StreamSniper) trong `lib/lib_common.js`.
- **Tùy biến tên miền & Giữ nguyên tiến độ xem**: Cho phép chọn gương hoặc nhập `DOMAIN_CUSTOM` trên mọi app mà không làm mất thư viện, lịch sử hay mốc **Resume A Video** (`canon()`/`decanon()`).
- **Biểu tượng riêng 256×256 & Kiểm thử mạng thật**: 196/196 nguồn có logo PNG 256×256 riêng biệt và được kiểm thử tự động trước khi phát hành.

---

## Cài đặt & Sử dụng / Getting Started

### Đường dẫn Repository / Repository URLs

| Ứng dụng / App | Mục đích / Purpose | Đường dẫn Repo / Repository URL |
|---|---|---|
| **Aniyomi** | Chỉ Anime & Video (44 APK) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/anime/index.min.json` |
| **Nekoyomi** | Chỉ Truyện tranh (37 APK) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/manga/index.min.json` |
| **Nekoyomi (Novel)** | Chỉ Tiểu thuyết (115 APK `NovelSource`) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/novel/index.min.json` |
| **Aniyomi / Nekoyomi (Tổng hợp)** | Toàn bộ 196 APK (Anime + Manga + Novel) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.min.json` |
| **Mangayomi / YomiHub (Tổng hợp)** | Tất cả Anime, Manga & Novel | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json` |
| **Mangayomi / YomiHub (Tách mục)** | Chỉ Anime / Manga / Novel | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/mangayomi/anime.json` · `.../manga.json` · `.../novel.json` |
| **LNReader / IReader** | Tiểu thuyết (115 nguồn) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugins.min.json` |
| **vBook / LeechText / YomiHub (vBook)** | Tất cả nguồn dạng gói `.zip` | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugin.json` |
| **Aidoku** (iOS / iPadOS) | Manga & Novel (152 gói `.aix`) | `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/aidoku/index.min.json` |

> **Gốc CDN / Base CDN**: `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/`

### Cài đặt nhanh bằng Deep Link / One-Click Deep Links

Mở trang này trên điện thoại và chạm vào liên kết tương ứng để thêm kho tự động:

- **Aniyomi (Anime — 44 nguồn)**:  
  [`aniyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/anime/index.min.json`](aniyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/anime/index.min.json)
- **Nekoyomi / Tachiyomi (Manga — 37 nguồn)**:  
  [`tachiyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/manga/index.min.json`](tachiyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/manga/index.min.json)
- **Nekoyomi (Novel — 115 nguồn)**:  
  [`tachiyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/novel/index.min.json`](tachiyomi://add-repo?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/novel/index.min.json)
- **Mangayomi / YomiHub**:  
  [`mangayomi://add-repo?repo_name=Kiritokmn&manga_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json&anime_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json&novel_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json`](mangayomi://add-repo?repo_name=Kiritokmn&manga_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json&anime_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json&novel_url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json)
- **LNReader / IReader**:  
  [`lnreader://repo/add?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugins.min.json`](lnreader://repo/add?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugins.min.json)
- **Aidoku (iOS / iPadOS)**:  
  [`aidoku://addSourceList?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/aidoku/index.min.json`](aidoku://addSourceList?url=https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/aidoku/index.min.json)

### Hướng dẫn chi tiết từng ứng dụng / Installation by App

1. **Aniyomi / Nekoyomi**: Vào **Thêm** (*More*) → **Cài đặt** (*Settings*) → **Duyệt** (*Browse*) → **Kho tiện ích** (*Extension repositories*) → `+` → dán link tách riêng (`anime/index.min.json`, `manga/index.min.json`, `novel/index.min.json`) hoặc `index.min.json`.
   - *Lưu ý nâng cấp từ 0.0.4 trở về trước*: gỡ 4 tiện ích gộp cũ rồi cài APK từng nguồn mới; Source ID giữ nguyên nên không mất thư viện hay lịch sử.
   - *Lưu ý E-Hentai*: từ 0.0.8, gói đổi sang `eu.kanade.tachiyomi.extension.all.kiriehentai` (Đa ngôn ngữ); hãy gỡ bản `vi` cũ nếu còn cài song song.
2. **Mangayomi / YomiHub**: Vào **Tiện ích** (*Extensions*) → `⋮` → **Kho tiện ích** (*Repository*) → `+` → dán `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/index.json` (hoặc các link tách mục `mangayomi/{anime,manga,novel}.json`).
3. **LNReader / IReader**: Vào **Tiện ích** (*Plugins*) → **Kho** (*Repositories*) → `+` → dán `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugins.min.json`.
4. **vBook / LeechText**: Vào **Cài đặt** → **Kho tiện ích** → **Thêm** → dán `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/plugin.json`.
5. **Aidoku** (≥ 0.8.3): Vào **Settings** → **Source Lists** → `+` → dán `https://raw.githubusercontent.com/YomiHub-Project/YomiHub-Extension-Repo/main/repo/aidoku/index.min.json`, sau đó vào **Browse** để cài gói `.aix`.

---

## Tải về bản phát hành / Releases & Downloads

Trang phát hành chính thức: **https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/tag/v0.1.0**

| Tệp / Asset | Dung lượng / Size | Mô tả / Description |
|---|---|---|
| [YomiHub-Extension-0.1.0-aidoku.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-aidoku.zip) | 23.16 MB | Gói ZIP `.aix` WASM cho Aidoku (iOS/iPadOS) / *Aidoku WASM packages* |
| [YomiHub-Extension-0.1.0-aniyomi-apks.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-aniyomi-apks.zip) | 24.44 MB | Gói ZIP 44 APK Anime cho Aniyomi / *44 Anime APKs for Aniyomi* |
| [YomiHub-Extension-0.1.0-lnreader-ireader.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-lnreader-ireader.zip) | 7.64 MB | Gói ZIP plugin ES5 cho LNReader & IReader / *LNReader & IReader plugins* |
| [YomiHub-Extension-0.1.0-mangayomi-yomihub.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-mangayomi-yomihub.zip) | 12.62 MB | Gói ZIP module JS cho Mangayomi & YomiHub / *Mangayomi & YomiHub JS bundle* |
| [YomiHub-Extension-0.1.0-nekoyomi-novel-apks.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-nekoyomi-novel-apks.zip) | 62.40 MB | Gói ZIP 115 APK Novel cho Nekoyomi (`NovelSource`) / *115 Novel APKs* |
| [YomiHub-Extension-0.1.0-tachiyomi-apks.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-tachiyomi-apks.zip) | 20.23 MB | Gói ZIP 37 APK Manga cho Nekoyomi / Tachiyomi / *37 Manga APKs* |
| [YomiHub-Extension-0.1.0-vbook-leechtext.zip](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/YomiHub-Extension-0.1.0-vbook-leechtext.zip) | 4.11 MB | Gói ZIP tiện ích chuẩn vBook & LeechText / *vBook & LeechText packages* |
| [index.json](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/index.json) | 135.6 KB | Chỉ mục kho Mangayomi / YomiHub / *Mangayomi & YomiHub index* |
| [index.min.json](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/index.min.json) | 62.8 KB | Chỉ mục kho APK tổng hợp Aniyomi / Nekoyomi / *Combined APK repo index* |
| [plugin.json](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/plugin.json) | 96.1 KB | Chỉ mục kho vBook / LeechText / *vBook & LeechText repo index* |
| [plugins.min.json](https://github.com/YomiHub-Project/YomiHub-Extension-Repo/releases/download/v0.1.0/plugins.min.json) | 41.5 KB | Chỉ mục kho LNReader / IReader / *LNReader & IReader plugin index* |

---

## Điểm mới trong phiên bản 0.1.0 / What's New in 0.1.0

Xem lịch sử chi tiết tại [CHANGELOG.md](CHANGELOG.md) và ghi chú kỹ thuật tại [TECHNICAL_UPDATE_NOTES.md](TECHNICAL_UPDATE_NOTES.md).

- **Hệ thống Bộ Lọc thống nhất 10 mục (Filter Extension + chuẩn Tiyo):**
  - Triển khai đồng bộ 10 bộ lọc trên `runtime/engine.js`, `runtime/rhino-prelude.js`, `hosts/mangayomi.tail.js`, `hosts/lnreader.js`, `hosts/aidoku.tail.js`, `aidoku/bridge` (`BRIDGE_REV = 5`), và các module Android Kotlin (`VBookAnimeFactory`, `VBookMangaFactory`, `VBookNovelFactory`):
    1. `sort` — *Sắp Xếp* (Mặc định, Mới cập nhật, Phổ biến nhất, Xem nhiều nhất, Đánh giá cao, Tên A-Z)
    2. `status` — *Tình Trạng* (Tất Cả, Đang Tiến Hành, Tạm Ngưng, Hoàn Thành)
    3. `category` — *Danh Mục* (tự động từ `tabs` của nguồn)
    4. `content_rating` — *Phân Loại Nội Dung* (Tất Cả, An toàn SFW, 18+ NSFW)
    5. `country` — *Quốc Gia Phát Hành* (Việt Nam, Trung Quốc, Nhật Bản, Hàn Quốc, Âu Mỹ, Khác)
    6. `year` — *Năm Phát Hành* (2026 → 2020, Trước 2020)
    7. `search_by` — *Tìm Theo* (Tên, Tác giả, Từ khóa)
    8. `rating` — *Đánh Giá* (9+, 8+, 7+, 5+ sao)
    9. `translation` — *Bản Dịch* (Vietsub / Dịch, Thuyết minh / Lồng tiếng, Convert, Raw / Gốc)
    10. `genres` — *Thể Loại* (nhóm CheckBox theo nguồn / thể loại chuẩn)
- **Tách riêng hoàn toàn Anime / Manga / Novel (44 / 37 / 115):**
  - Bổ sung module Android `novel-core` và `novel` chuẩn ABI `NovelSource` của Nekoyomi, dựng **196 APK** (44 Anime + 37 Manga + 115 Novel) với `APK_REV = 2`.
  - Xuất 3 kho APK độc lập (`repo/anime/`, `repo/manga/`, `repo/novel/`) có đầy đủ `index.min.json`, `repo.json`, `apk/`, `icon/` và 3 chỉ mục tách mục Mangayomi (`repo/mangayomi/{anime,manga,novel}.json`).
- **Phát video trực tiếp trong ứng dụng (Direct In-App Playback — KHÔNG qua WebView):**
  - Nâng cấp `track()` trong `lib/lib_generic.js` và `videos()` trong `runtime/engine.js`: bóc iframe nhiều tầng (tối đa depth 3), loại bỏ `type: 'webview'` khi dò được luồng phát, gắn đầy đủ `Referer`/`Origin`/`User-Agent`.
- **Chặn quảng cáo & Giải mã nâng cao (Tampermonkey Adblock Script + DevTools Project):**
  - Bổ sung `C.cleanAds(docOrHtml)` trong `lib/lib_common.js` (loại banner, popup, overlay, iframe quảng cáo không kích hoạt anti-adblock), lọc ảnh rác trong `pages()` và iframe quảng cáo trong `track()`, củng cố `C.cleanDevTools` và `C.sniff`.
- **Chuyển kho chính thức sang tổ chức `YomiHub-Project/YomiHub-Extension-Repo`:**
  - Cập nhật toàn bộ URL `raw.githubusercontent.com`, GitHub Releases, và cấu hình `publish.ps1` / `build-all.mjs` / `aniyomi-index.mjs`.
- **Kiểm thử mạng thật (2026-11-26):** Đạt **94/196 PASS (48.0%)** (Phim 0/44 · Truyện tranh 22/37 · Tiểu thuyết 53/115); mô phỏng Aidoku đạt **76/152**.

---

## Danh mục nguồn / Source Catalog

Kiểm thử tự động trên mạng Việt Nam (2026-11-26): **94/196** nguồn chạy trọn chuỗi danh sách → chi tiết → mục lục → nội dung/luồng phát.

Ký hiệu: ✅ hoạt động · ⛔ ngừng hoạt động (vẫn giữ trong kho) · 🛡️ Cloudflare · 🌐 bị chặn ở VN (cần VPN) · 🔐 cần đăng nhập · 🔒 chống lấy dữ liệu · 🧩 cần API/máy chủ riêng · 🟡 chạy một phần · 🔴 không truy cập được. Nguồn lỗi truy cập thường do trang đổi tên miền — vào cài đặt nguồn để đổi **Tên miền**.

### Phim & Video / Anime & Video (44)

| # | Nguồn / Source | Tên miền / Domain | Ngôn ngữ / Lang | 18+ | Trạng thái / Status |
|---|---|---|---|---|---|
| 1 | Anime47 | anime47.best | vi |  | 🔐 từ 11/2026 API animevui.com trả 401 PRIVATE_MODE: phải đăng nhập tài khoản Anime47 mới xem được tập (danh sách/tìm kiếm/chi tiết vẫn chạy) |
| 2 | AnimeVn.Net | animevn.net/the-loai/anime | vi |  | ✅ Hoạt động |
| 3 | Bilibili | www.bilibili.tv | vi |  | ✅ Hoạt động |
| 4 | VTV Go | vtvgo.vn | vi |  | ✅ Hoạt động |
| 5 | Rổ Phim | www.rophimhd.com/phimhay | vi |  | ⛔ **Ngừng hoạt động** – mọi tên miền chết |
| 6 | HotPhim | hotphim.org | vi |  | ✅ Hoạt động |
| 7 | AVSub – AnimeVietsub | animevietsub.nl | vi |  | ✅ Hoạt động |
| 8 | HayChill | phimhaychill.org | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết; phimhaychill.net là trang cờ bạc |
| 9 | XemPhimGi | xemphimgi.com | vi |  | ✅ Hoạt động |
| 10 | NextPhim | nextphim.net | vi |  | 🔒 trang tin/lịch chiếu/đánh giá phim rạp (nextphim.net), không có luồng phát – chỉ xem danh sách & thông tin phim |
| 11 | Vfilm | vfilm.vn | vi |  | 🔐 yêu cầu đăng nhập hoặc sử dụng 3G/GPRS Vinaphone để xem phim |
| 12 | Phimmoi | phimmoii.mom | vi |  | ⛔ **Ngừng hoạt động** – mọi tên miền chết; tên miền mặc định chỉ còn trang demo |
| 13 | PornHub | www.pornhub.com | all | 🔞 | 🌐 nhà mạng Việt Nam chặn IP (kết nối hết giờ cả khi dùng DNS 1.1.1.1) – bật Tor/VPN trong app; mã nguồn không lỗi |
| 14 | FikFap | fikfap.com | all | 🔞 | ✅ Hoạt động |
| 15 | Tik.Porn | tik.porn | all | 🔞 | 🌐 nhà mạng Việt Nam chặn IP (kết nối hết giờ cả khi dùng DNS 1.1.1.1) – bật Tor/VPN trong app; mã nguồn không lỗi |
| 16 | Kwiky | kwiky.com/cams?AFNO=2-162764.38182 | all | 🔞 | 🧩 trang SPA (kwiky.com) không có endpoint danh sách video công khai; các /api/* trả 401 Unauthorized khi chưa đăng nhập |
| 17 | xFree | www.xfree.com | all | 🔞 | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 18 | FapReel | fapreel.com | all | 🔞 | ✅ Hoạt động |
| 19 | SexVietTop | top1sexvn.com | vi | 🔞 | ✅ Hoạt động |
| 20 | Xôi Lạc | xoilacxxi.cc | vi |  | 🟡 Một phần (popular lỗi) |
| 21 | MotPhim | motphimc.my | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / motphimtv.com đang rao bán |
| 22 | HiHiPhim | hihiphim.com | vi |  | ✅ Hoạt động |
| 23 | PhimMoiHD | phimmoihd.online | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết (ENOTFOUND / 530) |
| 24 | BLVietsub | www.blvietsub.vip | vi |  | 🔒 trình phát dùng Cloudflare Turnstile token verification (Worker Siteverify), mở trong WebView để xem |
| 25 | Dailymotion | www.dailymotion.com/vn | vi |  | ✅ Hoạt động |
| 26 | Douyin | www.douyin.com | zh |  | 🧩 danh sách chủ đề nóng chạy không cần máy chủ; xem video cần máy chủ Douyin_TikTok_Download_API tự dựng (đặt trong cài đặt nguồn) |
| 27 | FreeReels | free-reels.com | vi |  | 🧩 SPA — cần API, để bản sau |
| 28 | GuPhim | guphimz.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết (guphimz.com, guphim.com/.net) |
| 29 | HentaiVietsub.com | hentaivietsub.com | vi | 🔞 | ✅ Hoạt động |
| 30 | HHPanda | hhpanda.st | vi |  | 🔒 trình phát (streamfree.vip) mã hoá luồng phát bằng bytecode + nonce, không lấy được link phát |
| 31 | HHTQHAY.VIP | hhtqhay.vip | vi |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 32 | Hồng Quả | hongguoduanju.com | zh |  | ✅ Hoạt động |
| 33 | iQIYI | www.iq.com | zh |  | 🧩 SPA — cần API, để bản sau |
| 34 | LuPhim | luphim.com | vi |  | ✅ Hoạt động |
| 35 | MGTV | w.mgtv.com | vi |  | 🧩 SPA — cần API, để bản sau |
| 36 | NguonC | phim.nguonc.com | vi |  | 🟡 Một phần (popular, search, detail, chapters ✓; videos lỗi) |
| 37 | Phim Nhựa | phimnhua.online | vi |  | ⛔ **Ngừng hoạt động** – Cloudflare 530 (máy chủ gốc ngừng) |
| 38 | Phim4K | phim4k.xyz | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết; phim4k.net là trang cờ bạc |
| 39 | PhimTV | phimtv.my | vi |  | ✅ Hoạt động |
| 40 | Showbox | pixnet.cc | vi |  | ⛔ **Ngừng hoạt động** – pixnet.cc không phân giải |
| 41 | TikTok | www.tiktok.com | all |  | ✅ Hoạt động |
| 42 | Twitch | www.twitch.tv | all |  | ✅ Hoạt động |
| 43 | WatchHentai.net | watchhentai.net | en | 🔞 | ✅ Hoạt động |
| 44 | YouTube | www.youtube.com | all |  | ✅ Hoạt động |

### Truyện tranh / Manga & Comic (37)

| # | Nguồn / Source | Tên miền / Domain | Ngôn ngữ / Lang | 18+ | Trạng thái / Status |
|---|---|---|---|---|---|
| 1 | CBHentai | hentaicube.xyz | vi | 🔞 | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 2 | Dâm Cô Nương | damconuong.pet | vi | 🔞 | 🔐 yêu cầu đăng nhập trên damconuong.help để xem chi tiết/chương truyện |
| 3 | SayHentai | sayhentai.cx | vi | 🔞 | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 4 | CBunu Comic | cucbongunu.com | vi | 🔞 | ✅ Hoạt động |
| 5 | cosplaytele | cosplaytele.com | vi | 🔞 | ✅ Hoạt động |
| 6 | Destin Team | destinteam.xyz | vi |  | ✅ Hoạt động |
| 7 | Dưa Leo truyện | dualeotruyenbet.com | vi | 🔞 | ⛔ **Ngừng hoạt động** – tên miền chết |
| 8 | E Hentai | e-hentai.org | vi | 🔞 | ✅ Hoạt động |
| 9 | Góc Truyện Tranh | goctruyentranhvui41.com | vi |  | ✅ Hoạt động |
| 10 | HentaiVN | hentaivnreal.com | vi |  | ✅ Hoạt động |
| 11 | Hắc Ám Chi Các | haccbl.xyz | vi |  | ✅ Hoạt động |
| 12 | Jelly Comics | jellycomics.online | vi |  | ✅ Hoạt động |
| 13 | JulyComic | julycomics.site | vi |  | ⛔ **Ngừng hoạt động** – Cloudflare 522 (máy chủ gốc ngừng) |
| 14 | LuotTruyen | luottruyen.net | vi |  | 🔐 chương truyện yêu cầu đăng nhập trong WebView |
| 15 | MangaDex | mangadex.org | all |  | ✅ Hoạt động |
| 16 | ManhwaBuddy | manhwabuddy.com | vi |  | ✅ Hoạt động |
| 17 | Mimimoe | mimimoe.moe | vi |  | 🧩 trang dựng bằng Next.js; danh sách truyện tải bằng API — bản trước "đạt" nhầm vì lấy menu (Danh sách truyện, Thể loại…) |
| 18 | Misskon | misskon.com | vi |  | ✅ Hoạt động |
| 19 | MoeTruyen | truyen.moe | vi |  | 🔒 ảnh chương cấp qua token "page-access" (bảo vệ ảnh) |
| 20 | My Reading Manga | myreadingmanga.info | all |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 21 | Navy Team Comic | navyteams.com | vi |  | 🟡 Một phần (popular, search, detail, chapters ✓; pages lỗi) |
| 22 | NetTruyen18 | nettruyen18.com | vi |  | ✅ Hoạt động |
| 23 | NetTruyenViet | nettruyenviet10.com | vi |  | ✅ Hoạt động |
| 24 | NetTruyenZ | nettruyenz.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chỉ còn trang "Site is created successfully!" |
| 25 | Roads Team | roadsteami.net | vi |  | ✅ Hoạt động |
| 26 | Thế Giới Truyện | thegioitruyen.vn | vi |  | ✅ Hoạt động |
| 27 | TruyenGG | truyenggvn.com | vi |  | ✅ Hoạt động |
| 28 | TruyenQQ | truyenqqko.com | vi |  | ✅ Hoạt động |
| 29 | TruyenQQ | truyenqq.com.vn | vi |  | ✅ Hoạt động |
| 30 | Truyentranhdammyy | truyentranhdammyy.site | vi |  | ✅ Hoạt động |
| 31 | TVKH | bananacoo.com | vi |  | ✅ Hoạt động |
| 32 | VinaHentai | vinahentai.bond | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết (vinahentai.bio/.bond không phản hồi) |
| 33 | WebtoonScan | webtoonscan.com | en |  | ⛔ **Ngừng hoạt động** – trang đã chết (máy chủ không trả lời) |
| 34 | Weeb Central | weebcentral.com | en |  | ✅ Hoạt động |
| 35 | Đọc Truyện Tranh BL | truyentranhbl.com | vi |  | 🔐 chương truyện chỉ mở khi đăng nhập Google (WP Manga Images Protection) — đăng nhập trong WebView |
| 36 | Ưng Tỷ Comics | ungtycomics.net | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / chứng chỉ lỗi |
| 37 | BL Bất Tử | blbattu.com | vi |  | ✅ Hoạt động |

### Tiểu thuyết / Novel & Light Novel (115)

| # | Nguồn / Source | Tên miền / Domain | Ngôn ngữ / Lang | 18+ | Trạng thái / Status |
|---|---|---|---|---|---|
| 1 | Ln.Hako.Vn (Hako) | ln.hako.vn | vi |  | 🟡 Một phần (popular, search, detail, chapters ✓; content lỗi) |
| 2 | Sonako | sonako.fandom.com/vi/wiki/Sonako_Light_Novel | vi |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 3 | 07br | www.bqg128.xyz/# | zh |  | ✅ Hoạt động |
| 4 | 101kks | 101kks.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 5 | 101Minc | www.101Minc.com | zh |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 6 | 52shuku by QuocBao | www.52shuku.net | zh |  | ✅ Hoạt động |
| 7 | 69shu - repo Đường đen | 69shuba.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 8 | 69书吧 | www.69shuba.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 9 | 75zwcom | m.qiwubiquge.com | zh |  | 🟠 Bị Cloudflare / máy chủ chặn |
| 10 | 8book | www.8book.com | zh |  | 🔒 nội dung chương tải bằng JavaScript (read.js) |
| 11 | alicesw | www.alicesw.com | zh | 🔞 | 🟡 Một phần (popular lỗi) |
| 12 | allin1 | 14.225.254.182 | vi |  | ✅ Hoạt động |
| 13 | App Truyện Chữ | apptruyenchu.pro | vi |  | 🔴 Không truy cập được (tên miền chết / bị chặn) |
| 14 | Boylove Bất Tử | boylovebattu.com | vi |  | ✅ Hoạt động |
| 15 | Bàn Long | blhvip.vn | vi |  | ✅ Hoạt động |
| 16 | ciyuanji | www.ciyuanji.com | zh |  | ⛔ **Ngừng hoạt động** – không phản hồi / 403 |
| 17 | czbooks - repo Đường đen | czbooks.net | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 18 | Deqixs | www.deqixss.com | zh |  | ✅ Hoạt động |
| 19 | douban | read.douban.com | zh |  | 🔐 read.douban.com là kho sách điện tử trả phí, chương truyện yêu cầu mua/đăng nhập qua tài khoản Douban |
| 20 | Dưa Hấu | xgmf.zuanqianyi.com | zh |  | ⛔ **Ngừng hoạt động** – HTTP 404 toàn trang |
| 21 | Faloo | faloo.com | zh |  | ✅ Hoạt động |
| 22 | Fan MTL | www.fanmtl.com | en |  | ✅ Hoạt động |
| 23 | Giới Truyện | gioitruyen.com | vi |  | ✅ Hoạt động |
| 24 | gongzicp | www.gongzicp.com | zh |  | 🧩 truyencp/gongzicp trả lỗi API "访问异常" trên chapterList/search và HTML /novel-*.html là Vue SPA |
| 25 | Gấu Mèo Team | gaumeoteam.com | vi |  | ✅ Hoạt động |
| 26 | Hameln (Syosetu.org) | syosetu.org | ja |  | 🛡️ Cloudflare chặn IP Việt Nam – cần VPN |
| 27 | Hang Truyện Chữ | hangtruyenchu.com | vi |  | ✅ Hoạt động |
| 28 | html5.qq.com | bookshelf.html5.qq.com | zh |  | ✅ Hoạt động |
| 29 | idejian | www.idejian.com | zh |  | 🟡 Một phần (popular lỗi) |
| 30 | ijjjxsxzw | m.ijjjxsxzw.com | zh |  | ✅ Hoạt động |
| 31 | ixdzs8 | ixdzs8.com | zh |  | 🟠 Bị Cloudflare / máy chủ chặn |
| 32 | JJWXC · Tấn Giang | www.jjwxc.net | zh |  | ✅ Hoạt động |
| 33 | Jjwxc-repo duongden💰✅ | www.jjwxc.net | zh |  | ✅ Hoạt động |
| 34 | Kakuyomu | kakuyomu.jp | ja |  | ✅ Hoạt động |
| 35 | Kho Truyện Chữ | khotruyenchu.fun | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / không phản hồi |
| 36 | La Cà Truyện | lacatruyen.live | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 37 | Langgee | v5.langge.uk | zh |  | ⛔ **Ngừng hoạt động** – HTTP 502 |
| 38 | LN Kuro | lnkuro.top | vi |  | 🔐 toàn trang yêu cầu đăng nhập tài khoản (kuro-kmssccttan) |
| 39 | LOFTER | www.sudugu.org | zh |  | 🟡 Một phần (popular, search, detail ✓; chapters lỗi) |
| 40 | LoHi | lohi2.com | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 41 | LoppyToon | loppytoon.com | vi | 🔞 | ⛔ **Ngừng hoạt động** – tên miền chết |
| 42 | Luvevaland | luvevalandn2.co | vi |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 43 | MangaDM | mangadm.me | vi |  | ✅ Hoạt động |
| 44 | Matt Reading Translations | mattreadingtranslations.com | en |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 45 | Mino Truyện | minotruyenv6.xyz | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 46 | Minttea Novel | mintteanovel.com | vi |  | 🔐 chương mới bị khoá (cần đăng nhập/mở khoá trên trang) |
| 47 | MonkeyD | monkeydd.com | vi |  | ✅ Hoạt động |
| 48 | Moyue · Mặc Duyệt | moyue.app | vi |  | 🧩 trang dựng bằng SPA/API di động (Fanqie/番茄) — nội dung tải bằng JavaScript |
| 49 | MTC | metruyencv.biz | vi |  | ⛔ **Ngừng hoạt động** – metruyencv.xyz không phân giải |
| 50 | Mê Truyện Chữ | metruyenchu.com.vn | vi |  | 🟡 Một phần (popular lỗi) |
| 51 | Mê Truyện CV | metruyencv.com.vn | vi |  | ⛔ **Ngừng hoạt động** – trang báo "Tạm biệt!" (đóng cửa) |
| 52 | Mê Đọc Truyện | medoctruyen.vn | vi |  | ✅ Hoạt động |
| 53 | Mọt Truyện | mottruyen.app | vi |  | ✅ Hoạt động |
| 54 | Navy Team Novel | navyteams.com | vi |  | ✅ Hoạt động |
| 55 | NetTruyen | nettruyen.com.vn | vi |  | 🌐 máy chủ dùng khoá TLS cũ (DH key too small), ứng dụng Android từ chối kết nối |
| 56 | Novel Next | www.novelnext.me | en |  | ✅ Hoạt động |
| 57 | NovelFull.Net | novelfull.net | en |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 58 | NovelPhoenix | novelphoenix.net | en |  | ✅ Hoạt động |
| 59 | Novelpia Global | global.novelpia.com | en |  | ✅ Hoạt động |
| 60 | piaotian-app | www.piaotianapp.com | zh |  | ✅ Hoạt động |
| 61 | po18 | www.po18.tw | zh | 🔞 | 🔐 yêu cầu xác minh 18+/đăng nhập |
| 62 | po18sm | www.po18sm.com | zh | 🔞 | ✅ Hoạt động |
| 63 | qimao | www.qimao.com | zh |  | ⛔ **Ngừng hoạt động** – không kết nối được |
| 64 | qmbook | m.bqg998.cc/# | zh |  | ✅ Hoạt động |
| 65 | quanben | quanben.io | zh |  | 🟠 máy chủ trả trang mặc định CentOS (403) – trang hỏng |
| 66 | quanwenyuedu | www.quanwenyuedu.io | zh |  | ⛔ **Ngừng hoạt động** – chứng chỉ SSL hết hạn |
| 67 | QuyKiep | quykiep.com | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 68 | Shinigami LN Team | shinigamilnteam.com | vi |  | ✅ Hoạt động |
| 69 | Si Truyện CV | sitruyencv.com | vi |  | ⛔ **Ngừng hoạt động** – máy chủ không phản hồi |
| 70 | Snapd | m.snapd.net | zh |  | 🔒 nội dung chương chuyển hướng xác minh chống bot (/userverify) |
| 71 | sohu | www.sohu.com | zh |  | ✅ Hoạt động |
| 72 | STV App Vi | sangtacviet.com | vi |  | ✅ Hoạt động |
| 73 | sudugu | www.sudugu.org | zh |  | 🟡 Một phần (popular, search, detail ✓; chapters lỗi) |
| 74 | sweetastes | www.bjtriz.com | zh |  | 🟡 Một phần (popular lỗi) |
| 75 | Syosetu | syosetu.com | ja |  | ✅ Hoạt động |
| 76 | Syosetu R18 | novel18.syosetu.com | ja | 🔞 | ✅ Hoạt động |
| 77 | Sói Xám (Fanqie) | api.langge.cf | zh |  | ⛔ **Ngừng hoạt động** – api.langge.cf không phân giải |
| 78 | TaoNovel | tybook.taoyuewenhua.net | zh |  | 🧩 máy chủ API di động (tybook.taoyuewenhua.net) yêu cầu app id/token (errcode 202: Empty app id) |
| 79 | Tinh Linh | tinhlinh.com | vi |  | ✅ Hoạt động |
| 80 | Tiệm Truyện Chữ | tiemtruyenchu.cloud | vi |  | 🔐 toàn trang yêu cầu đăng nhập |
| 81 | Truyen H | truyenh.top | vi | 🔞 | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 82 | TruyenC | truyenc.net | vi |  | ✅ Hoạt động |
| 83 | TruyenCV.io | truyencv.io | vi |  | 🟡 Một phần (popular, search ✓; detail lỗi) |
| 84 | TruyenDich.AI | truyendich.space | vi |  | ✅ Hoạt động |
| 85 | truyenfull | truyenfull.live | vi |  | ✅ Hoạt động |
| 86 | Truyện Chữ | truyenchu.net | vi |  | ✅ Hoạt động |
| 87 | Truyện Dịch AI | truyendichai.com | vi |  | ✅ Hoạt động |
| 88 | Truyện Full | truyenfull.today | vi |  | ✅ Hoạt động |
| 89 | Truyện Mới | truyenmoi.app | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 90 | Truyện Mới KK | truyenmoikk.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 91 | Truyện Net | truyennet.vn | vi |  | ✅ Hoạt động |
| 92 | Truyện Zhihu Tổng Hợp | www.truyendexuat.com | vi |  | 🔴 Không truy cập được (tên miền chết / bị chặn) |
| 93 | TruyệnCV | metruyencv.com | vi |  | ⛔ **Ngừng hoạt động** – metruyencv.com đóng cửa ("Tạm biệt!") |
| 94 | Tu Tiên (.pro) | tutien.pro | vi |  | ✅ Hoạt động |
| 95 | uukanshu | uukanshu.cc | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 96 | Valvrareteam | valvrareteam.net | vi |  | ✅ Hoạt động |
| 97 | Viblo | viblo.asia | vi |  | ✅ Hoạt động |
| 98 | vivutruyencom | vivutruyen.com | vi |  | ✅ Hoạt động |
| 99 | Việt Nam Thư Quán | vnthuquan.org | vi |  | 🔴 Không truy cập được (tên miền chết / bị chặn) |
| 100 | Wattpad | www.wattpad.com | all |  | 🌐 wattpad.com bị chặn ở Việt Nam — cần VPN |
| 101 | Web Truyện Chữ | webtruyenchu.com | vi |  | ✅ Hoạt động |
| 102 | Web Truyện Dịch | webtruyendich.com | vi |  | 🔒 trang chương bị bảo vệ bởi Cloudflare Turnstile (403) — mở chương bằng WebView |
| 103 | Weibo | m.weibo.cn | zh |  | 🟡 Một phần (popular lỗi) |
| 104 | Wiki Dịch | wikicv.org | vi |  | ✅ Hoạt động |
| 105 | wodeshucheng5 | www.wodeshucheng5.com | zh |  | 🟠 nginx 403 – chặn IP/khu vực |
| 106 | Xbanxia - repo Đường đen | www.xbanxia.cc | zh |  | ✅ Hoạt động |
| 107 | Xianqihaotiami APP | www.xianqihaotianmi.org | zh |  | ✅ Hoạt động |
| 108 | xsw | m.xsw.tw | zh |  | ⛔ **Ngừng hoạt động** – chứng chỉ SSL không hợp lệ |
| 109 | XTruyen | www.xtruyen.net | vi |  | ✅ Hoạt động |
| 110 | YPShuo - Bình luận sách | www.ypshuo.com | zh |  | 🔒 ypshuo.com là trang đánh giá/review sách (liên kết sang qidian.com), không lưu nội dung chương |
| 111 | 【VIP】Bạch Ngọc Sách | bnsvip.net | vi |  | ⛔ **Ngừng hoạt động** – máy chủ ngắt kết nối (ECONNRESET) |
| 112 | 书本书 Shubenshu | www.shubenshu.com | zh |  | ✅ Hoạt động |
| 113 | 搜笔趣阁 | www.sobqg.com | zh |  | ✅ Hoạt động |
| 114 | 笔趣阁-abcbiquge | m.abcbiquge.com | zh |  | ✅ Hoạt động |
| 115 | 飘天文学 | www.piaotia.com | zh |  | ✅ Hoạt động |

### Tiện ích YomiHub / YomiHub Extensions (29)

Các tiện ích website chuyển từ bản tích hợp sẵn trong YomiHub 0.6.6 sang kho (`repo/yomihub/`, định dạng Mangayomi JS), giữ nguyên ID để nhận cập nhật tự động.

| # | Tiện ích / Extension | Mục / Category | Trang chủ / Website | Ngôn ngữ / Lang | 18+ | Mã nguồn / Code |
|---|---|---|---|---|---|---|
| 1 | Hako (Light Novel) | Tiểu thuyết | https://ln.hako.vn | vi |  | [hako.js](repo/yomihub/hako.js) |
| 2 | Sonako (Light Novel) | Tiểu thuyết | https://sonako.fandom.com | vi |  | [sonako.js](repo/yomihub/sonako.js) |
| 3 | AnimeVN | Phim & Điện ảnh | https://animevn.net | vi |  | [animevn.js](repo/yomihub/animevn.js) |
| 4 | AVSub – AnimeVietsub | Phim & Điện ảnh | https://animevsub.co.uk | vi |  | [avsub.js](repo/yomihub/avsub.js) |
| 5 | RoPhim | Phim & Điện ảnh | https://www.rophimhd.com | vi |  | [rophim.js](repo/yomihub/rophim.js) |
| 6 | HotPhim | Phim & Điện ảnh | https://hotphim.org | vi |  | [hotphim.js](repo/yomihub/hotphim.js) |
| 7 | Anime47 | Phim & Điện ảnh | https://anime47.best | vi |  | [anime47.js](repo/yomihub/anime47.js) |
| 8 | VTVgo – Truyền hình | Phim & Điện ảnh | https://vtvgo.vn | vi |  | [vtvgo.js](repo/yomihub/vtvgo.js) |
| 9 | YouTube (NewPipe · Pure Tuber) | Phim & Điện ảnh | https://www.youtube.com | all |  | [youtube.js](repo/yomihub/youtube.js) |
| 10 | Pornhub (18+) | Phim & Điện ảnh | https://www.pornhub.com | all | 🔞 | [pornhub.js](repo/yomihub/pornhub.js) |
| 11 | FikFap (18+) | Phim & Điện ảnh | https://fikfap.com | all | 🔞 | [fikfap.js](repo/yomihub/fikfap.js) |
| 12 | HihiSex (18+) | Phim & Điện ảnh | https://hihisex.men | vi | 🔞 | [hihisex.js](repo/yomihub/hihisex.js) |
| 13 | Tik.Porn (18+) | Phim & Điện ảnh | https://tik.porn | all | 🔞 | [tikporn.js](repo/yomihub/tikporn.js) |
| 14 | Kwiky (18+) | Phim & Điện ảnh | https://kwiky.com | all | 🔞 | [kwiky.js](repo/yomihub/kwiky.js) |
| 15 | xFree (18+) | Phim & Điện ảnh | https://www.xfree.com | all | 🔞 | [xfree.js](repo/yomihub/xfree.js) |
| 16 | FapReel (18+) | Phim & Điện ảnh | https://fapreel.com | all | 🔞 | [fapreel.js](repo/yomihub/fapreel.js) |
| 17 | SexVietTop (18+) | Phim & Điện ảnh | https://sexviettuyenchon.com | vi | 🔞 | [sexviettop.js](repo/yomihub/sexviettop.js) |
| 18 | HayChill | Phim & Điện ảnh | https://phimhaychill.org | vi |  | [haychill.js](repo/yomihub/haychill.js) |
| 19 | XemPhimGi | Phim & Điện ảnh | https://xemphimgi.com | vi |  | [xemphimgi.js](repo/yomihub/xemphimgi.js) |
| 20 | NextPhim | Phim & Điện ảnh | https://nextphim.net | vi |  | [nextphim.js](repo/yomihub/nextphim.js) |
| 21 | Vfilm | Phim & Điện ảnh | http://vfilm.vn | vi |  | [vfilm.js](repo/yomihub/vfilm.js) |
| 22 | CBHentai (18+) | Truyện tranh | https://hentaicube.xyz | vi | 🔞 | [cbhentai.js](repo/yomihub/cbhentai.js) |
| 23 | Dâm Cô Nương (18+) | Truyện tranh | https://damconuong.pet | vi | 🔞 | [damconuong.js](repo/yomihub/damconuong.js) |
| 24 | SayHentai (18+) | Truyện tranh | https://sayhentai.cx | vi | 🔞 | [sayhentai.js](repo/yomihub/sayhentai.js) |
| 25 | Xôi Lạc TV | Phim & Điện ảnh | https://xoilacxxi.cc | vi |  | [xoilac.js](repo/yomihub/xoilac.js) |
| 26 | Phimmoi | Phim & Điện ảnh | https://phimmoii.run | vi |  | [phimmoi.js](repo/yomihub/phimmoi.js) |
| 27 | MotPhim | Phim & Điện ảnh | https://motphimc.my | vi |  | [motphim.js](repo/yomihub/motphim.js) |
| 28 | HiHiPhim | Phim & Điện ảnh | https://hihiphim.com | vi |  | [hihiphim.js](repo/yomihub/hihiphim.js) |
| 29 | PhimMoiHD | Phim & Điện ảnh | https://phimmoihd.online | vi |  | [phimmoihd.js](repo/yomihub/phimmoihd.js) |


---

## Kiến trúc & Phát triển / Development & Architecture

### Cấu trúc thư mục / Directory Layout

```
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
```

### Quy trình biên dịch & kiểm thử / Build & Test Commands

```bash
npm install
node test/domain-switch.test.mjs
node test/filter-extension.test.mjs
npm run build                                            # Biên dịch 196 nguồn -> repo/ & android/*/gen/
node tools/test/run-tests.mjs --stream --dns 1.1.1.1,8.8.8.8 --conc 6
node tools/test/aidoku-sim.mjs --all --conc 6
powershell android/build_apks.ps1                        # Dựng & ký 196 APK (Anime + Manga + Novel)
node tools/build/make-output.mjs                         # Đóng gói Output/
node tools/docs/gen-readme.mjs                           # Sinh README.md
```

---

## Đóng góp & Giấy phép / Contributing & License

### Quy định đóng góp / Contribution Guidelines

1. **Đọc tài liệu bắt buộc**: Đọc toàn bộ `A.I Brain - Second Brain/` (00 → 12), `AGENTS.md` và `TECHNICAL_UPDATE_NOTES.md` trước khi chỉnh sửa.
2. **Không sửa tay `repo/`**: `repo/` là đầu ra tự động của `npm run build`. Mọi thay đổi nguồn thực hiện trong `sources/<id>/`.
3. **Tăng phiên bản**: Tăng `version` trong `sources/<id>/plugin.json` khi sửa nguồn; tăng `package.json` khi phát hành.
4. **Không xóa nguồn chết**: Đánh dấu vào `data/status.json` → `dead` để giữ thư viện người dùng cũ.
5. **Bảo mật khóa ký**: Tuyệt đối không commit `android/*.jks`, `android/keystore.properties`, `*.cer`.

### Giấy phép / License

Dự án được phân phối dưới giấy phép mã nguồn mở **GNU General Public License v3.0 (GPL-3.0)**. Một số nguồn tái sử dụng tiện ích vBook mã nguồn mở của cộng đồng (ghi công tác giả gốc trong `plugin.json`).

---

<p align="center">
  <em>Được bảo trì và phát triển bởi <strong>Kiritokmn</strong> &amp; <strong>YomiHub-Project</strong>.</em>
</p>
