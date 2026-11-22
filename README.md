# Kiritokmn - Extension Repo

**Phiên bản: 0.0.8** · Một kho tiện ích dùng chung cho **Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText và Aidoku** — 196 nguồn Phim, Truyện tranh, Tiểu thuyết (Tiếng Việt, Trung, Anh, Nhật).

Mỗi nguồn được viết **một lần** theo chuẩn vBook (JavaScript). Bộ build tự chuyển sang định dạng của từng ứng dụng:

| Ứng dụng | Thêm repo bằng đường dẫn | Định dạng |
|---|---|---|
| **Aniyomi** (chỉ Phim & Video, 44 nguồn) | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/anime/index.min.json` | Mỗi nguồn một APK riêng, có tên + logo riêng (Rhino + jsoup) |
| **Nekoyomi** (chỉ Truyện tranh, 37 nguồn) | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/manga/index.min.json` | Mỗi nguồn một APK riêng, có tên + logo riêng (Rhino + jsoup) |
| **Aniyomi / Nekoyomi gộp** (81 nguồn) | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.min.json` | Cả Phim và Truyện gộp chung trong 1 kho |
| **Mangayomi / YomiHub** | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json` | JS source (MProvider) |
| **LNReader / IReader** (Tiểu thuyết) | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugins.min.json` | Plugin JS (ES5) |
| **vBook / LeechText / YomiHub (tab vBook)** | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugin.json` | Gói vBook `.zip` |
| **Aidoku** (iOS / iPadOS, Truyện tranh + Tiểu thuyết) | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/aidoku/index.min.json` | Gói `.aix` (WebAssembly + JavaScriptCore), 152 nguồn — xem [docs/AIDOKU.md](docs/AIDOKU.md) |

> Cả 4 đường dẫn đều nằm chung một gốc: **`https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/`** — Aniyomi/Nekoyomi chỉ cần gốc này.

### Cách thêm nhanh
- **Aniyomi / Nekoyomi**: Thêm → Cài đặt → Duyệt → Kho tiện ích → `+` → dán `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.min.json` (thêm ở cả mục Anime và Manga). Từ 0.0.5 **mỗi nguồn là một tiện ích riêng** (tên + logo của nguồn): chỉ cài nguồn mình dùng.
  - **Nâng cấp từ 0.0.4 trở về trước:** gỡ 4 tiện ích gộp cũ (*Kiritokmn Phim*, *Kiritokmn Phim 18+*, *Kiritokmn Truyện*, *Kiritokmn Truyện 18+*), rồi cài các nguồn mới. Mã nguồn (source ID) giữ nguyên, nên thư viện, lịch sử xem/đọc và vị trí xem tiếp không mất.
- **Mangayomi / YomiHub**: Tiện ích → ⋮ → Kho tiện ích → thêm `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json` cho từng tab (Truyện tranh / Phim / Tiểu thuyết).
- **LNReader / IReader**: Tiện ích (Plugins) → Kho → thêm `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugins.min.json`.
- **vBook / LeechText**: Cài đặt → Kho tiện ích → thêm `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugin.json`.
- **Aidoku** (cần Aidoku 0.8.3 trở lên): Settings → Source Lists → `+` → dán `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/aidoku/index.min.json`, rồi vào Browse để cài nguồn. Hoặc mở trên iPhone: `aidoku://addSourceList?url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/aidoku/index.min.json`.

### Thêm bằng liên kết (deep link, mở trên điện thoại)
```
aniyomi://add-repo?url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.min.json
tachiyomi://add-repo?url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.min.json
mangayomi://add-repo?repo_name=Kiritokmn&manga_url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json&anime_url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json&novel_url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json
aidoku://addSourceList?url=https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/aidoku/index.min.json
```

### Có gì mới trong 0.0.8
Xem [CHANGELOG.md](CHANGELOG.md) — tóm tắt:
- **Tách riêng kho lưu trữ Aniyomi & Nekoyomi:** Aniyomi có kho riêng `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/anime/index.min.json` (44 Anime), Nekoyomi có kho riêng `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/manga/index.min.json` (37 Manga) tránh lẫn lộn.
- **Tùy biến tên miền linh hoạt (Feature Check Row 8):** Toàn bộ 44 nguồn Phim & Video ngắn có cấu hình `DOMAIN_CUSTOM` cho phép người dùng tự điền tên miền thay thế khi bị nhà mạng chặn.
- **Nâng cấp bộ dò luồng & Trích xuất video (Row 3 & 10):** Bổ sung `C.sniff` (StreamSniper unpack, base64, m3u8), `C.cleanDevTools` bypass chống debug trong `lib_common.js`. Tăng version cho 149 nguồn nạp lib.
- **Tối ưu video ngắn & YomiHub (Row 6):** Chuẩn hóa 11 nguồn video ngắn với cờ `shorts: true`, khôi phục trích xuất mp4 dọc mượt mà cho FapReel.
- **Resume A Video (Row 7):** Giữ ổn định ID/URL tập phim qua cơ chế `canon()`/`decanon()` trong `runtime/engine.js`.
- **Khôi phục các nguồn phim lớn:** VTV Go (REST API v21.0 live HLS 100% PASS), WatchHentai, Xôi Lạc TV, FapReel, Hồng Quả.
- **Sửa chữa nguồn Truyện & Tiểu thuyết:** Syosetu R18 (Nocturne ranking, cookie 18+), Truyện Net (truyennet.org), Truyện CV (WP REST API), Web Truyện Dịch, Sweetastes, PO18SM. Khôi phục Deqixs và Tinh Linh.
- **Lưu ý di chuyển gói E-Hentai:** Gói APK đổi sang `eu.kanade.tachiyomi.extension.all.kiriehentai` (Đa ngôn ngữ). Vui lòng gỡ tiện ích cũ và cài bản mới.
- **Đo mạng thật 94/196 PASS (48.0%):** Tăng +17 nguồn so với 0.0.7 (77/196). Kiểm thử thực tế trên Samsung Galaxy Note9 đạt 81/81 APKs hoạt động hoàn hảo.

## Tiện ích YomiHub (29) — chuyển từ bản tích hợp sẵn trong YomiHub 0.6.6

Từ YomiHub 0.5.3, các tiện ích website này **không còn tích hợp trong ứng dụng** mà nằm trong kho này (`repo/yomihub/`, định dạng Mangayomi JS). YomiHub 0.5.3 tự thêm kho vào cả 3 mục; tiện ích đã cài giữ nguyên id nên nhận cập nhật từ kho. Mangayomi cũng cài được (cùng `index.json`).

| # | Tiện ích | Mục | Trang | Ngôn ngữ | 18+ | Mã nguồn |
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


## Tải về (Releases v0.0.8)

| Tệp |
|---|
| [index.json](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/index.json) |
| [index.min.json](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/index.min.json) |
| [Kiritokmn-Extension-0.0.8-aidoku.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-aidoku.zip) |
| [Kiritokmn-Extension-0.0.8-aniyomi-apks.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-aniyomi-apks.zip) |
| [Kiritokmn-Extension-0.0.8-lnreader-ireader.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-lnreader-ireader.zip) |
| [Kiritokmn-Extension-0.0.8-mangayomi-yomihub.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-mangayomi-yomihub.zip) |
| [Kiritokmn-Extension-0.0.8-tachiyomi-apks.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-tachiyomi-apks.zip) |
| [Kiritokmn-Extension-0.0.8-vbook-leechtext.zip](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/Kiritokmn-Extension-0.0.8-vbook-leechtext.zip) |
| [plugin.json](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/plugin.json) |
| [plugins.min.json](https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/download/v0.0.8/plugins.min.json) |

Trang phát hành: https://github.com/kiritokmn1403/Kiritokmn---Extension-Repo/releases/tag/v0.0.8

## Trạng thái nguồn (kiểm thử tự động 2026-11-22: 94/196 chạy trọn chuỗi danh sách → chi tiết → mục lục → nội dung)

Kiểm thử chạy thật trên mạng Việt Nam (máy của chủ dự án). Ký hiệu: ✅ hoạt động · ⛔ ngừng hoạt động (vẫn giữ trong kho) · 🛡️ Cloudflare · 🌐 bị chặn ở Việt Nam (cần VPN) · 🔐 cần đăng nhập · 🔒 trang chống lấy dữ liệu · 🧩 cần API/máy chủ riêng · 🟡 chạy một phần. Nguồn "không truy cập được" thường do tên miền đã đổi — vào cài đặt nguồn để đổi **Tên miền**.

### Phim & Video (44)

| # | Nguồn | Trang | Ngôn ngữ | 18+ | Trạng thái |
|---|---|---|---|---|---|
| 1 | Anime47 | anime47.best | vi |  | ✅ hoạt động |
| 2 | AnimeVn.Net | animevn.net/the-loai/anime | vi |  | ✅ hoạt động |
| 3 | Bilibili | www.bilibili.tv | vi |  | 🧩 trang dựng bằng JavaScript (SPA) — cần viết theo API, để bản sau |
| 4 | VTV Go | vtvgo.vn | vi |  | ✅ hoạt động |
| 5 | Rổ Phim | www.rophimhd.com/phimhay | vi |  | ⛔ **Ngừng hoạt động** – mọi tên miền chết |
| 6 | HotPhim | hotphim.org | vi |  | ✅ hoạt động |
| 7 | AVSub – AnimeVietsub | animevietsub.nl | vi |  | ✅ hoạt động |
| 8 | HayChill | phimhaychill.org | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết; phimhaychill.net là trang cờ bạc |
| 9 | XemPhimGi | xemphimgi.com | vi |  | ✅ hoạt động |
| 10 | NextPhim | nextphim.net | vi |  | 🔒 nextphim.net hiện là trang tin tức/review phim, không có phim để xem |
| 11 | Vfilm | vfilm.vn | vi |  | 🔐 yêu cầu đăng nhập hoặc sử dụng 3G/GPRS Vinaphone để xem phim |
| 12 | Phimmoi | phimmoii.mom | vi |  | ⛔ **Ngừng hoạt động** – mọi tên miền chết; tên miền mặc định chỉ còn trang demo |
| 13 | PornHub | www.pornhub.com | all | Có | 🔴 không truy cập được (tên miền chết / bị chặn) |
| 14 | FikFap | fikfap.com | all | Có | ✅ hoạt động |
| 15 | Tik.Porn | tik.porn | all | Có | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 16 | Kwiky | kwiky.com/cams?AFNO=2-162764.38182 | all | Có | 🟡 một phần (popular lỗi) |
| 17 | xFree | www.xfree.com | all | Có | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 18 | FapReel | fapreel.com | all | Có | ✅ hoạt động |
| 19 | SexVietTop | top1sexvn.com | vi | Có | ✅ hoạt động |
| 20 | Xôi Lạc | xoilacxxi.cc | vi |  | ✅ hoạt động |
| 21 | MotPhim | motphimc.my | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / motphimtv.com đang rao bán |
| 22 | HiHiPhim | hihiphim.com | vi |  | ✅ hoạt động |
| 23 | PhimMoiHD | phimmoihd.online | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết (ENOTFOUND / 530) |
| 24 | BLVietsub | www.blvietsub.vip | vi |  | 🔒 trình phát dùng Cloudflare Turnstile token verification (Worker Siteverify), mở trong WebView để xem |
| 25 | Dailymotion | www.dailymotion.com/vn | vi |  | ✅ hoạt động |
| 26 | Douyin | www.douyin.com | zh |  | 🧩 danh sách chủ đề nóng chạy không cần máy chủ; xem video cần máy chủ Douyin_TikTok_Download_API tự dựng (đặt trong cài đặt nguồn) |
| 27 | FreeReels | free-reels.com | vi |  | 🧩 SPA — cần API, để bản sau |
| 28 | GuPhim | guphimz.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết (guphimz.com, guphim.com/.net) |
| 29 | HentaiVietsub.com | hentaivietsub.com | vi | Có | ✅ hoạt động |
| 30 | HHPanda | hhpanda.st | vi |  | 🔒 trình phát (streamfree.vip) mã hoá luồng phát bằng bytecode + nonce, không lấy được link phát |
| 31 | HHTQHAY.VIP | hhtqhay.vip | vi |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 32 | Hồng Quả | hongguoduanju.com | zh |  | ✅ hoạt động |
| 33 | iQIYI | www.iq.com | zh |  | 🧩 SPA — cần API, để bản sau |
| 34 | LuPhim | luphim.com | vi |  | 🔒 trình phát dùng dấu vân tay WebGL + chống DevTools, không lấy được luồng phát |
| 35 | MGTV | w.mgtv.com | vi |  | 🧩 SPA — cần API, để bản sau |
| 36 | NguonC | phim.nguonc.com | vi |  | ✅ hoạt động |
| 37 | Phim Nhựa | phimnhua.online | vi |  | ⛔ **Ngừng hoạt động** – Cloudflare 530 (máy chủ gốc ngừng) |
| 38 | Phim4K | phim4k.xyz | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết; phim4k.net là trang cờ bạc |
| 39 | PhimTV | phimtv.my | vi |  | ✅ hoạt động |
| 40 | Showbox | pixnet.cc | vi |  | ⛔ **Ngừng hoạt động** – pixnet.cc không phân giải |
| 41 | TikTok | www.tiktok.com | all |  | ✅ hoạt động |
| 42 | Twitch | www.twitch.tv | all |  | ✅ hoạt động |
| 43 | WatchHentai.net | watchhentai.net | en | Có | ✅ hoạt động |
| 44 | YouTube | www.youtube.com | all |  | ✅ hoạt động |

### Truyện tranh (37)

| # | Nguồn | Trang | Ngôn ngữ | 18+ | Trạng thái |
|---|---|---|---|---|---|
| 1 | CBHentai | hentaicube.xyz | vi | Có | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 2 | Dâm Cô Nương | damconuong.pet | vi | Có | ⛔ **Ngừng hoạt động** – tên miền chết (ENOTFOUND / 525) |
| 3 | SayHentai | sayhentai.cx | vi | Có | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 4 | CBunu Comic | cucbongunu.com | vi | Có | ✅ hoạt động |
| 5 | cosplaytele | cosplaytele.com | vi | Có | ✅ hoạt động |
| 6 | Destin Team | destinteam.xyz | vi |  | ✅ hoạt động |
| 7 | Dưa Leo truyện | dualeotruyenbet.com | vi | Có | ⛔ **Ngừng hoạt động** – tên miền chết |
| 8 | E Hentai | e-hentai.org | vi | Có | ✅ hoạt động |
| 9 | Góc Truyện Tranh | goctruyentranhvui41.com | vi |  | ✅ hoạt động |
| 10 | HentaiVN | hentaivnreal.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 11 | Hắc Ám Chi Các | haccbl.xyz | vi |  | ✅ hoạt động |
| 12 | Jelly Comics | jellycomics.online | vi |  | 🟡 một phần (popular, detail ✓; search lỗi) |
| 13 | JulyComic | julycomics.site | vi |  | ⛔ **Ngừng hoạt động** – Cloudflare 522 (máy chủ gốc ngừng) |
| 14 | LuotTruyen | luottruyen.net | vi |  | 🔐 chương truyện yêu cầu đăng nhập trong WebView |
| 15 | MangaDex | mangadex.org | all |  | 🌐 mangadex.org và api.mangadex.org bị chặn ở Việt Nam — bật VPN (ví dụ VPN của YomiHub) |
| 16 | ManhwaBuddy | manhwabuddy.com | vi |  | ✅ hoạt động |
| 17 | Mimimoe | mimimoe.moe | vi |  | ✅ hoạt động |
| 18 | Misskon | misskon.com | vi |  | ✅ hoạt động |
| 19 | MoeTruyen | truyen.moe | vi |  | 🔒 ảnh chương cấp qua token "page-access" (bảo vệ ảnh) |
| 20 | My Reading Manga | myreadingmanga.info | all |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 21 | Navy Team Comic | navyteams.com | vi |  | ✅ hoạt động |
| 22 | NetTruyen18 | nettruyen18.com | vi |  | ✅ hoạt động |
| 23 | NetTruyenViet | nettruyenviet10.com | vi |  | ✅ hoạt động |
| 24 | NetTruyenZ | nettruyenz.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chỉ còn trang "Site is created successfully!" |
| 25 | Roads Team | roadsteami.net | vi |  | ✅ hoạt động |
| 26 | Thế Giới Truyện | thegioitruyen.vn | vi |  | ✅ hoạt động |
| 27 | TruyenGG | truyenggvn.com | vi |  | ✅ hoạt động |
| 28 | TruyenQQ | truyenqqko.com | vi |  | ✅ hoạt động |
| 29 | TruyenQQ | truyenqq.com.vn | vi |  | ✅ hoạt động |
| 30 | Truyentranhdammyy | truyentranhdammyy.site | vi |  | ✅ hoạt động |
| 31 | TVKH | bananacoo.com | vi |  | ✅ hoạt động |
| 32 | VinaHentai | vinahentai.bond | vi |  | 🔴 không truy cập được (tên miền chết / bị chặn) |
| 33 | WebtoonScan | webtoonscan.com | en |  | ⛔ **Ngừng hoạt động** – trang đã chết (máy chủ không trả lời) |
| 34 | Weeb Central | weebcentral.com | en |  | ✅ hoạt động |
| 35 | Đọc Truyện Tranh BL | truyentranhbl.com | vi |  | 🔐 chương truyện chỉ mở khi đăng nhập Google (WP Manga Images Protection) — đăng nhập trong WebView |
| 36 | Ưng Tỷ Comics | ungtycomics.net | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / chứng chỉ lỗi |
| 37 | BL Bất Tử | blbattu.com | vi |  | ✅ hoạt động |

### Tiểu thuyết (115)

| # | Nguồn | Trang | Ngôn ngữ | 18+ | Trạng thái |
|---|---|---|---|---|---|
| 1 | Ln.Hako.Vn (Hako) | ln.hako.vn | vi |  | 🟡 một phần (popular, search, detail, chapters ✓; content lỗi) |
| 2 | Sonako | sonako.fandom.com/vi/wiki/Sonako_Light_Novel | vi |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 3 | 07br | www.bqg128.xyz/# | zh |  | ✅ hoạt động |
| 4 | 101kks | 101kks.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 5 | 101Minc | www.101Minc.com | zh |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 6 | 52shuku by QuocBao | www.52shuku.net | zh |  | ✅ hoạt động |
| 7 | 69shu - repo Đường đen | 69shuba.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 8 | 69书吧 | www.69shuba.com | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 9 | 75zwcom | m.qiwubiquge.com | zh |  | 🟠 bị Cloudflare/máy chủ chặn |
| 10 | 8book | www.8book.com | zh |  | 🔒 nội dung chương tải bằng JavaScript (read.js) |
| 11 | alicesw | www.alicesw.com | zh | Có | ✅ hoạt động |
| 12 | allin1 | 14.225.254.182 | vi |  | ✅ hoạt động |
| 13 | App Truyện Chữ | apptruyenchu.pro | vi |  | 🔴 không truy cập được (tên miền chết / bị chặn) |
| 14 | Boylove Bất Tử | boylovebattu.com | vi |  | ✅ hoạt động |
| 15 | Bàn Long | blhvip.vn | vi |  | ✅ hoạt động |
| 16 | ciyuanji | www.ciyuanji.com | zh |  | ⛔ **Ngừng hoạt động** – không phản hồi / 403 |
| 17 | czbooks - repo Đường đen | czbooks.net | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 18 | Deqixs | www.deqixss.com | zh |  | ✅ hoạt động |
| 19 | douban | read.douban.com | zh |  | 🔐 read.douban.com là kho sách điện tử trả phí, chương truyện yêu cầu mua/đăng nhập qua tài khoản Douban |
| 20 | Dưa Hấu | xgmf.zuanqianyi.com | zh |  | ⛔ **Ngừng hoạt động** – HTTP 404 toàn trang |
| 21 | Faloo | faloo.com | zh |  | ✅ hoạt động |
| 22 | Fan MTL | www.fanmtl.com | en |  | ✅ hoạt động |
| 23 | Giới Truyện | gioitruyen.com | vi |  | ✅ hoạt động |
| 24 | gongzicp | www.gongzicp.com | zh |  | 🟡 một phần (popular lỗi) |
| 25 | Gấu Mèo Team | gaumeoteam.com | vi |  | ✅ hoạt động |
| 26 | Hameln (Syosetu.org) | syosetu.org | ja |  | 🛡️ Cloudflare chặn IP Việt Nam – cần VPN |
| 27 | Hang Truyện Chữ | hangtruyenchu.com | vi |  | ✅ hoạt động |
| 28 | html5.qq.com | bookshelf.html5.qq.com | zh |  | ✅ hoạt động |
| 29 | idejian | www.idejian.com | zh |  | 🟡 một phần (popular lỗi) |
| 30 | ijjjxsxzw | m.ijjjxsxzw.com | zh |  | ✅ hoạt động |
| 31 | ixdzs8 | ixdzs8.com | zh |  | 🟠 bị Cloudflare/máy chủ chặn |
| 32 | JJWXC · Tấn Giang | www.jjwxc.net | zh |  | 🟡 một phần (popular, detail ✓; search lỗi) |
| 33 | Jjwxc-repo duongden💰✅ | www.jjwxc.net | zh |  | 🟡 một phần (popular, detail ✓; search lỗi) |
| 34 | Kakuyomu | kakuyomu.jp | ja |  | ✅ hoạt động |
| 35 | Kho Truyện Chữ | khotruyenchu.fun | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết / không phản hồi |
| 36 | La Cà Truyện | lacatruyen.live | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 37 | Langgee | v5.langge.uk | zh |  | ⛔ **Ngừng hoạt động** – HTTP 502 |
| 38 | LN Kuro | lnkuro.top | vi |  | 🔐 toàn trang yêu cầu đăng nhập tài khoản (kuro-kmssccttan) |
| 39 | LOFTER | www.sudugu.org | zh |  | ✅ hoạt động |
| 40 | LoHi | lohi2.com | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 41 | LoppyToon | loppytoon.com | vi | Có | ⛔ **Ngừng hoạt động** – tên miền chết |
| 42 | Luvevaland | luvevalandn2.co | vi |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 43 | MangaDM | mangadm.me | vi |  | ✅ hoạt động |
| 44 | Matt Reading Translations | mattreadingtranslations.com | en |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 45 | Mino Truyện | minotruyenv6.xyz | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 46 | Minttea Novel | mintteanovel.com | vi |  | 🔐 chương mới bị khoá (cần đăng nhập/mở khoá trên trang) |
| 47 | MonkeyD | monkeydd.com | vi |  | ✅ hoạt động |
| 48 | Moyue · Mặc Duyệt | moyue.app | vi |  | 🧩 trang dựng bằng SPA/API di động (Fanqie/番茄) — nội dung tải bằng JavaScript |
| 49 | MTC | metruyencv.biz | vi |  | ⛔ **Ngừng hoạt động** – metruyencv.xyz không phân giải |
| 50 | Mê Truyện Chữ | metruyenchu.com.vn | vi |  | ✅ hoạt động |
| 51 | Mê Truyện CV | metruyencv.com.vn | vi |  | ⛔ **Ngừng hoạt động** – trang báo "Tạm biệt!" (đóng cửa) |
| 52 | Mê Đọc Truyện | medoctruyen.vn | vi |  | ✅ hoạt động |
| 53 | Mọt Truyện | mottruyen.app | vi |  | ✅ hoạt động |
| 54 | Navy Team Novel | navyteams.com | vi |  | ✅ hoạt động |
| 55 | NetTruyen | nettruyen.com.vn | vi |  | 🌐 máy chủ dùng khoá TLS cũ (DH key too small), ứng dụng Android từ chối kết nối |
| 56 | Novel Next | www.novelnext.me | en |  | ✅ hoạt động |
| 57 | NovelFull.Net | novelfull.net | en |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 58 | NovelPhoenix | novelphoenix.net | en |  | ✅ hoạt động |
| 59 | Novelpia Global | global.novelpia.com | en |  | ✅ hoạt động |
| 60 | piaotian-app | www.piaotianapp.com | zh |  | 🟡 một phần (popular lỗi) |
| 61 | po18 | www.po18.tw | zh | Có | 🔐 yêu cầu xác minh 18+/đăng nhập |
| 62 | po18sm | www.po18sm.com | zh | Có | ✅ hoạt động |
| 63 | qimao | www.qimao.com | zh |  | ⛔ **Ngừng hoạt động** – không kết nối được |
| 64 | qmbook | m.bqg998.cc/# | zh |  | 🟡 một phần (popular lỗi) |
| 65 | quanben | quanben.io | zh |  | 🟠 máy chủ trả trang mặc định CentOS (403) – trang hỏng |
| 66 | quanwenyuedu | www.quanwenyuedu.io | zh |  | ⛔ **Ngừng hoạt động** – chứng chỉ SSL hết hạn |
| 67 | QuyKiep | quykiep.com | vi |  | 🧩 trang dựng bằng Next.js (SPA) — danh sách truyện tải bằng API |
| 68 | Shinigami LN Team | shinigamilnteam.com | vi |  | ✅ hoạt động |
| 69 | Si Truyện CV | sitruyencv.com | vi |  | ⛔ **Ngừng hoạt động** – máy chủ không phản hồi |
| 70 | Snapd | m.snapd.net | zh |  | 🔒 nội dung chương chuyển hướng xác minh chống bot (/userverify) |
| 71 | sohu | www.sohu.com | zh |  | ✅ hoạt động |
| 72 | STV App Vi | sangtacviet.com | vi |  | ✅ hoạt động |
| 73 | sudugu | www.sudugu.org | zh |  | ✅ hoạt động |
| 74 | sweetastes | www.bjtriz.com | zh |  | ✅ hoạt động |
| 75 | Syosetu | syosetu.com | ja |  | ✅ hoạt động |
| 76 | Syosetu R18 | novel18.syosetu.com | ja | Có | ✅ hoạt động |
| 77 | Sói Xám (Fanqie) | api.langge.cf | zh |  | ⛔ **Ngừng hoạt động** – api.langge.cf không phân giải |
| 78 | TaoNovel | tybook.taoyuewenhua.net | zh |  | 🧩 máy chủ API di động (tybook.taoyuewenhua.net) yêu cầu app id/token (errcode 202: Empty app id) |
| 79 | Tinh Linh | tinhlinh.com | vi |  | ✅ hoạt động |
| 80 | Tiệm Truyện Chữ | tiemtruyenchu.cloud | vi |  | 🔐 toàn trang yêu cầu đăng nhập |
| 81 | Truyen H | truyenh.top | vi | Có | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 82 | TruyenC | truyenc.net | vi |  | 🔴 không truy cập được (tên miền chết / bị chặn) |
| 83 | TruyenCV.io | truyencv.io | vi |  | ✅ hoạt động |
| 84 | TruyenDich.AI | truyendich.space | vi |  | ✅ hoạt động |
| 85 | truyenfull | truyenfull.live | vi |  | ✅ hoạt động |
| 86 | Truyện Chữ | truyenchu.net | vi |  | ✅ hoạt động |
| 87 | Truyện Dịch AI | truyendichai.com | vi |  | 🟡 một phần (popular lỗi) |
| 88 | Truyện Full | truyenfull.today | vi |  | ✅ hoạt động |
| 89 | Truyện Mới | truyenmoi.app | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 90 | Truyện Mới KK | truyenmoikk.com | vi |  | ⛔ **Ngừng hoạt động** – tên miền chết |
| 91 | Truyện Net | truyennet.vn | vi |  | ✅ hoạt động |
| 92 | Truyện Zhihu Tổng Hợp | www.truyendexuat.com | vi |  | ✅ hoạt động |
| 93 | TruyệnCV | metruyencv.com | vi |  | ⛔ **Ngừng hoạt động** – metruyencv.com đóng cửa ("Tạm biệt!") |
| 94 | Tu Tiên (.pro) | tutien.pro | vi |  | ✅ hoạt động |
| 95 | uukanshu | uukanshu.cc | zh |  | 🛡️ Cloudflare (tự vượt qua trong WebView) – mở WebView 1 lần |
| 96 | Valvrareteam | valvrareteam.net | vi |  | ✅ hoạt động |
| 97 | Viblo | viblo.asia | vi |  | ✅ hoạt động |
| 98 | vivutruyencom | vivutruyen.com | vi |  | ✅ hoạt động |
| 99 | Việt Nam Thư Quán | vnthuquan.org | vi |  | 🔴 không truy cập được (tên miền chết / bị chặn) |
| 100 | Wattpad | www.wattpad.com | all |  | 🌐 wattpad.com bị chặn ở Việt Nam — cần VPN |
| 101 | Web Truyện Chữ | webtruyenchu.com | vi |  | ✅ hoạt động |
| 102 | Web Truyện Dịch | webtruyendich.com | vi |  | 🛡️ Cloudflare Turnstile – cần **xác minh thủ công** trong WebView |
| 103 | Weibo | m.weibo.cn | zh |  | 🟡 một phần (popular lỗi) |
| 104 | Wiki Dịch | wikicv.org | vi |  | ✅ hoạt động |
| 105 | wodeshucheng5 | www.wodeshucheng5.com | zh |  | 🟠 nginx 403 – chặn IP/khu vực |
| 106 | Xbanxia - repo Đường đen | www.xbanxia.cc | zh |  | ✅ hoạt động |
| 107 | Xianqihaotiami APP | www.xianqihaotianmi.org | zh |  | 🟡 một phần (popular lỗi) |
| 108 | xsw | m.xsw.tw | zh |  | ⛔ **Ngừng hoạt động** – chứng chỉ SSL không hợp lệ |
| 109 | XTruyen | www.xtruyen.net | vi |  | ✅ hoạt động |
| 110 | YPShuo - Bình luận sách | www.ypshuo.com | zh |  | 🟡 một phần (popular lỗi) |
| 111 | 【VIP】Bạch Ngọc Sách | bnsvip.net | vi |  | ⛔ **Ngừng hoạt động** – máy chủ ngắt kết nối (ECONNRESET) |
| 112 | 书本书 Shubenshu | www.shubenshu.com | zh |  | ✅ hoạt động |
| 113 | 搜笔趣阁 | www.sobqg.com | zh |  | ✅ hoạt động |
| 114 | 笔趣阁-abcbiquge | m.abcbiquge.com | zh |  | ✅ hoạt động |
| 115 | 飘天文学 | www.piaotia.com | zh |  | ✅ hoạt động |

## Cấu trúc dự án

```
sources/<id>/        nguồn chuẩn vBook (plugin.json + src/*.js)   ← nơi duy nhất cần sửa
lib/                 thư viện mẫu dùng chung (Madara, generic selector, ...)
runtime/             engine + DOM tương thích jsoup + vBook API (JS) và prelude Rhino
hosts/               lớp chuyển đổi cho Mangayomi, LNReader/IReader, Aidoku, Node test
aidoku/              cầu nối Rust/WASM cho Aidoku (bridge/) + biểu tượng nguồn
android/             APK Aniyomi/Nekoyomi: mỗi nguồn một product flavor (anime-core / manga-core dùng chung)
tools/               build, sinh nguồn, phân tích trang, kiểm thử
repo/                ĐẦU RA cho các ứng dụng (index.json, plugins.min.json, plugin.json, index.min.json, apk/, aidoku/)
data/                danh sách nguồn từ Excel, kết quả kiểm thử
```

Build: `npm run build` · Aidoku: `node tools/build/aidoku-build.mjs` (cần Rust + wasm32) · Kiểm thử: `npm test`, `node tools/test/aidoku-sim.mjs --all` · APK: `android/build_apks.ps1`. Ghi chú kỹ thuật: [TECHNICAL_UPDATE_NOTES.md](TECHNICAL_UPDATE_NOTES.md).

Một số nguồn tái sử dụng tiện ích vBook mã nguồn mở của cộng đồng (ghi công tác giả gốc trong `plugin.json`). Giấy phép: GPL-3.0.
