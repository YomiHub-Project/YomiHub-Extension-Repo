# YomiHub Extension Repo — v0.1.0 (26/11/2026)

> Kho đã đổi tên: **`YomiHub-Project/Kiritokmn---Extension-Repo` → `YomiHub-Project/YomiHub-Extension-Repo`** (GitHub tự chuyển hướng link cũ; nên thêm lại kho bằng link mới trong README). Tên gói APK, khoá ký và ID nguồn **không đổi** — chỉ cần "Cập nhật", không phải gỡ cài lại.

## Tính năng mới
- **Tự chuyển tên miền dự phòng (9 app):** khi tên miền đang dùng chết (DNS, hết giờ, bị chặn) hoặc Cloudflare 52x/502–504, tiện ích tự thử các tên miền khác của trang (danh sách Excel + `DOMAIN.values`), nhớ tên miền dùng được; Tên miền tuỳ chỉnh luôn được ưu tiên; vị trí xem/đọc (Resume) không bị mất.
- **Tab "Shorts (Video ngắn)"** cho 11 nguồn Short (PornHub `/shorties`, Tik.Porn, Kwiky, xFree, FreeReels, SexVietTop, FikFap, TikTok, Douyin, FapReel, YouTube) → nút/feed Short của YomiHub mở đúng video dọc.
- **Logo kết hợp:** mỗi tiện ích giữ logo riêng của trang web; logo **YomiHub Extensions** làm icon kho, icon README và icon dự phòng (bỏ favicon Google).
- **APK nhẹ hơn ~14%** (196 APK: 125,95 MB → 108,5 MB): Rhino rút gọn (`android/libs/rhino-1.7.15-slim.jar`, bỏ trình biên dịch bytecode/shell không dùng).
- Bộ lọc 10 ô (Filter Extension) đầy đủ cho thêm ~50 nguồn Truyện tranh/Tiểu thuyết (`genre.js` thật từ trang nguồn, `search.js` nhận `filters`).

## Sửa lỗi
- **Phim:** LuPhim phát HLS trực tiếp (`/geturl` → `/streaming`); Anime47 không còn quay mãi — báo rõ "trang bắt đăng nhập" (API trả 401 PRIVATE_MODE); AVSub – AnimeVietsub kiểm sâu 11/11 luồng (Vietsub/Thuyết Minh/Lồng Tiếng, phát/tua/chuyển tập/Resume trên Note9).
- **Truyện tranh/Tiểu thuyết (58 nguồn, Google Antigravity):** khôi phục HentaiVN (`hentaivnreal.com`), MangaDex (API v5), NovelNext, MangaDM, Kakuyomu, NovelPhoenix, NovelpiaGlobal, WebTruyenChu, Wikidich, Syosetu/Syosetu R18, Piaotia, CBunu, WeebCentral, Cosplaytele, FanMTL, AbcBiquge…; DamCoNuong sang tên miền mới (`damconuong.help/.tech`, cần đăng nhập).
- **YomiHub – AVSub:** bản YomiHub riêng hết đọc được danh sách vì animevsub.co.uk đổi giao diện → nay dùng chung mã AVSub của kho (cùng id, tự cập nhật lên 0.6.7).
- Trạng thái nguồn rõ ràng hơn trong README: PornHub/Tik.Porn (nhà mạng VN chặn IP → bật Tor/VPN), NextPhim (trang tin, không có phim), BLVietsub (Cloudflare Turnstile), HHPanda (luồng mã hoá), Kwiky (cần đăng nhập), VinaHentai/Phimmoi (chết mọi tên miền).

## Kiểm thử
- Mạng thật **94/196** nguồn đạt trọn chuỗi; Aidoku mô phỏng 77/152; unit test 28/28.
- Galaxy Note9: Aniyomi, Nekoyomi (3 kho tách biệt), Mangayomi, YomiHub (AVSub), LNReader — ảnh + video trong `_work/shots/v010/` (máy chủ dự án). vBook 1.1.57 bắt cập nhật app trước khi cài tiện ích; LeechText 2.0.0 crash trên Android 10 (lỗi phía app).
- Mới: kiểm tự động 29 nguồn riêng của YomiHub (15/29, phần lỗi đều do trang nguồn) và bản Mangayomi/YomiHub của 94 nguồn đạt (92/94).

---

# Kiritokmn Extension Repo — v0.0.9 (23/11/2026)

## Điểm nổi bật & Tính năng mới
- **Hệ thống Bộ Lọc thống nhất 10 mục (Filter Extension + Chuẩn Tiyo):**
  - Tích hợp schema 10 bộ lọc chuẩn: (1) Sắp Xếp (*Mặc định, Mới cập nhật, Phổ biến nhất, Xem nhiều nhất, Đánh giá cao, Tên A-Z*), (2) Tình Trạng (*Tất Cả, Đang Tiến Hành, Tạm Ngưng, Hoàn Thành*), (3) Danh Mục (tự động từ tabs nguồn), (4) Phân Loại Nội Dung (*An toàn SFW, 18+ NSFW*), (5) Quốc Gia Phát Hành (*Việt Nam, Trung Quốc, Nhật Bản, Hàn Quốc, Âu Mỹ, Khác*), (6) Năm Phát Hành (2026 → 2020, Trước 2020), (7) Tìm Theo (Tên, Tác giả, Từ khóa), (8) Đánh Giá (9+, 8+, 7+, 5+ sao), (9) Bản Dịch (*Vietsub/Dịch, Thuyết minh/Lồng tiếng, Convert, Raw/Gốc*), (10) Thể Loại (nhóm CheckBox đa lựa chọn).
  - Hoạt động đồng bộ 100% trên `runtime/engine.js`, `runtime/rhino-prelude.js`, `hosts/mangayomi.tail.js`, `hosts/lnreader.js`, `hosts/aidoku.tail.js` (Aidoku `BRIDGE_REV = 5`), và các module Android Kotlin (`VBookAnimeFactory`, `VBookMangaFactory`, `VBookNovelFactory`).
- **Tách riêng 3 kho độc lập Anime / Manga / Novel (44 Anime + 37 Manga + 115 Novel):**
  - Aniyomi: Kho độc lập `repo/anime/index.min.json` + `repo.json` (44 tiện ích Anime / Phim / Video).
  - Nekoyomi: Kho độc lập `repo/manga/index.min.json` + `repo.json` (37 tiện ích Manga) và kho `repo/novel/index.min.json` (115 tiện ích Novel).
  - Bổ sung module Android `novel-core` và `novel` kế thừa chuẩn ABI `NovelSource` của Nekoyomi (`tachiyomi.novelextension` feature, `isNovelSource = true`, `fetchPageText`), xuất xưởng **196 APK riêng biệt** (`APK_REV = 2`).
  - Mangayomi / YomiHub: Bổ sung 3 chỉ mục tách mục `repo/mangayomi/anime.json`, `repo/mangayomi/manga.json`, `repo/mangayomi/novel.json`.
- **Bắt buộc phát video trực tiếp trong app (Direct In-App Playback — KHÔNG qua WebView):**
  - Loại bỏ hoàn toàn `type: 'webview'` cho các luồng phát; `lib/lib_generic.js` (`track()`) và `runtime/engine.js` (`videos()`) tự động bóc iframe đa tầng (tối đa depth 3), trích xuất trực tiếp URL `.m3u8` / `.mp4` kèm đầy đủ headers `Referer`, `Origin`, `User-Agent`.
  - Khắc phục triệt để các nguồn video: Anime47, Dailymotion, HentaiVietsub, Bilibili TV, VTV Go, WatchHentai, Xôi Lạc TV, FapReel, Hồng Quả, AVSub – AnimeVietsub.
- **Tích hợp Chặn quảng cáo & Giải mã (Tampermonkey Adblock + DevTools Project + Tiyo):**
  - `lib/lib_common.js`: Bổ sung `C.cleanAds(docOrHtml)` loại bỏ popup, banner quảng cáo, overlay, iframe rác theo bộ lọc Tampermonkey Adblock không kích hoạt anti-adblock; tích hợp vào `C.cleanContent()`, lọc banner ảnh trong `pages()` và lọc iframe rác trong `track()`.
  - Tối ưu `C.cleanDevTools` bypass anti-debugging và `C.sniff` bóc luồng Dean Edwards unpack đa khối, base64, giải bọc `?url=`.
- **Chuyển kho chính thức sang tổ chức YomiHub-Project:**
  - Chuyển `origin` và tất cả đường dẫn tài nguyên sang `https://github.com/YomiHub-Project/Kiritokmn---Extension-Repo`.

## Sửa chữa & Phục hồi nguồn
- **Nhóm Phim & Video (20/44 PASS mạng thật, phát trực tiếp không qua web):**
  - Sửa lỗi stream kiểm thử tự động cho `anime47`, `dailymotion`, `hentaivietsubcom`.
  - Nâng cấp bóc tách player cho `vtvgo`, `watchhentainet`, `xoilac`, `fapreel`, `hongqua`, `avsubanimevietsub`.
- **Nhóm Truyện tranh & Tiểu thuyết (80 nguồn PASS):**
  - Khôi phục và ổn định: `truyencvio`, `truyennet`, `syosetur18`, `sweetastes`, `po18sm`, `webtruyendich`, `deqixs`, `tinhlinh`, `07br`, `hacamchicac`, `abcbiquge`, `stvappvi`, `allin1`.
  - Rà soát 196/196 logo biểu tượng 256×256 PNG sắc nét, tăng `version` +1 cho 100% 196 nguồn so với bản 0.0.8.

## Kết quả kiểm thử & Thiết bị thật Galaxy Note9
- **Kiểm thử tự động trên mạng thật:** Đạt **100/196 PASS** (51.0%, tăng +6 nguồn so với 94/196 của 0.0.8) gồm 20 Anime, 21 Manga, 59 Novel.
- **Mô phỏng Aidoku:** Đạt **81/152 PASS** (tăng +7 nguồn so với 74/152 của 0.0.8).
- **Unit Tests:** 12/12 domain-switch tests PASS, 9/9 filter-extension test suites PASS (100%).
- **Kiểm thử thiết bị thật Samsung Galaxy Note9 (SM-N960N, Android 10):**
  - Cài đặt thành công 196/196 APKs (44 Anime + 37 Manga + 115 Novel) qua ADB.
  - Thu thập 6 video screenrecord (.mp4) và 50+ ảnh chụp màn hình xác minh trực quan 100% lưu tại `_work/shots/v009/`:
    - Aniyomi: Tách kho Anime, Filter Extension 10 mục, `DOMAIN_CUSTOM`, phát video trực tiếp trong `PlayerActivity`, Resume A Video.
    - Nekoyomi: Tách riêng 3 kho (Anime, Manga, Novel sources), đọc Manga TruyenQQ, duyệt Novel.
    - Mangayomi & YomiHub: Duyệt các kho tổng hợp & tách mục, bộ lọc, Shorts video dọc.
    - LNReader: Duyệt Bàn Long, đọc tiểu thuyết tiếng Việt chương dài sắc nét.
    - vBook v1.1.57 & LeechText: Thư viện 25 nguồn vBook.
  - Hoàn trả nguyên trạng cài đặt máy theo `phone_settings_before.txt`.

---

# Kiritokmn Extension Repo — v0.0.8 (23/11/2026)

## Điểm nổi bật & Tính năng mới
- **Tách riêng kho lưu trữ Aniyomi & Nekoyomi:**
  - Aniyomi có chỉ mục chuyên biệt `repo/anime/index.min.json` + `repo.json` (chỉ nạp 44 tiện ích Anime / Phim / Video).
  - Nekoyomi có chỉ mục chuyên biệt `repo/manga/index.min.json` + `repo.json` (chỉ nạp 37 tiện ích Manga / Truyện tranh).
  - Tách bạch hoàn toàn nội dung, không còn hiện tượng hiển thị lẫn lộn giữa truyện và phim trên từng ứng dụng.
- **Tùy biến tên miền linh hoạt (Feature Check Row 8):**
  - Cập nhật toàn bộ 44/44 nguồn Phim & Video ngắn có cấu hình `DOMAIN_CUSTOM` trong `plugin.json` và `src/config.js`. Người dùng có thể tự nhập tên miền mới bất kỳ trong Cài đặt tiện ích khi bị nhà mạng chặn.
- **Nâng cấp bộ dò luồng & Trích xuất video (Feature Check Row 3 & 10):**
  - Bổ sung `C.sniff` trong `lib_common.js` hỗ trợ giải mã Dean Edwards unpack, base64 decode, trích xuất m3u8/mp4 động kiểu StreamSniper.
  - Bổ sung `C.cleanDevTools` vô hiệu hóa mã chống debug / inspect của các trang web.
  - Tăng version +1 cho toàn bộ 149 nguồn sử dụng `lib_generic` / `lib_common`.
- **Tối ưu video ngắn & YomiHub (Feature Check Row 6):**
  - Chuẩn hóa cờ `shorts: true` / `short_video: true` trên toàn bộ 11 nguồn video ngắn (`douyin`, `freereels`, `tiktok`, `youtube`, `pornhub`, `fikfap`, `tikporn`, `kwiky`, `xfree`, `fapreel`, `sexviettop`). Khôi phục trích xuất mp4 dọc mượt mà cho `fapreel`.
- **Tính năng Resume A Video (Feature Check Row 7):**
  - Giữ vững định danh tập phim qua cơ chế `canon()` / `decanon()` trong `runtime/engine.js`, đảm bảo mốc thời gian xem tiếp khi người dùng chuyển đổi tên miền.
- **TikTok & Douyin API chuẩn (Feature Check Row 9):**
  - Tích hợp giao thức tiêu chuẩn `Evil0ctal/Douyin_TikTok_Download_API` trong `sources/douyin/src/svx.js` (polling task, API key, exponential backoff).
- **Rà soát biểu tượng 196 nguồn (Feature Check Row 11):**
  - 100% (196/196) nguồn sở hữu logo nhận diện 256x256 PNG chuẩn riêng biệt, không phụ thuộc dịch vụ favicon Google.

## Sửa chữa & Phục hồi nguồn
- **Nhóm Phim & Video ngắn (20/44 PASS mạng thật, tăng +5 nguồn):**
  - **VTV Go (`vtvgo`):** Chuyển sang REST API v21.0 (`api.vtvdigital.org`), phát live stream HLS m3u8 trực tiếp (PASS 100%).
  - **WatchHentai (`watchhentainet`):** Sửa selector danh sách tập và trích xuất `data-primary-player-url` (PASS 100%).
  - **Xôi Lạc TV (`xoilac`):** Khôi phục phát luồng trực tiếp bóng đá HLS m3u8 và hỗ trợ `DOMAIN_CUSTOM` (PASS 100%).
  - **FapReel (`fapreel`):** Khôi phục trích xuất mp4 dọc trực tiếp và tối ưu tìm kiếm thông minh (PASS 100%).
  - **Hồng Quả (`hongqua`):** Cập nhật search API `/api/search/result` và player episode selector (PASS 100%).
  - **AVSub – AnimeVietsub (`avsubanimevietsub`, v14.1008):** Khử trùng danh sách tập và ưu tiên luồng `.m3u8` trực tiếp, sửa `track.js` bóc `?url=` trước khi kiểm tra đuôi m3u8/mp4 kèm header `Referer`/`User-Agent`, sửa lỗi `DOMAIN_CUSTOM` và `author`, gỡ khỏi danh sách `dead` — **phát video trực tiếp bằng trình phát có sẵn trên Aniyomi (không cần mở web/WebView)**, PASS 100% kiểm thử `--stream` trên cả 8 CDN host và đã xác minh phát thật trên Galaxy Note9.
  - **Anime47, Phimmoi, AnimeVN, FikFap, SexVietTop:** Khôi phục tên miền mới và dự phòng kết nối.
- **Nhóm Truyện tranh & Tiểu thuyết:**
  - **Syosetu R18 (`syosetur18`):** Sửa Nocturne ranking selector, cookie `over18=yes`, kết nối `noc.syosetu.com` (PASS 100%).
  - **Truyện Net (`truyennet`):** Đổi tên miền sang `truyennet.org`, loại bỏ vòng lặp fetch 20 request đồng bộ tránh lỗi Cloudflare 429 (PASS 100%).
  - **Truyện CV (`truyencvio`):** Viết lại sang WordPress REST API của theme init-manga (PASS 100%).
  - **Web Truyện Dịch (`webtruyendich`):** Loại bỏ lỗi hoisting biến và bổ sung thông báo Cloudflare Turnstile chuẩn.
  - **Sweetastes & PO18SM:** Cấu hình bảng mã GBK và selector nội dung đọc chương (PASS 100%).
  - **Khôi phục nguồn dead:** Gỡ bỏ `deqixs` và `tinhlinh` khỏi danh sách `dead` do máy chủ gốc đã hoạt động trở lại bình thường (PASS 100%).
- **Gắn nhãn 18+ (NSFW):**
  - Chuẩn hóa cờ `nsfw: 1` cho `hentaivn`, `mimimoe`, `nettruyen18`, `vinahentai`, `ehentai`. Ứng dụng sẽ tự động ẩn các nguồn này nếu tắt nội dung 18+.

## Lưu ý nâng cấp APK E-Hentai cho người dùng Nekoyomi/Aniyomi
Vì E-Hentai chuyển ngôn ngữ từ Tiếng Việt sang Đa ngôn ngữ (`global`), gói APK đổi tên từ `eu.kanade.tachiyomi.extension.vi.kiriehentai` sang `eu.kanade.tachiyomi.extension.all.kiriehentai`.
Sau khi cập nhật lên bản 0.0.8, bạn sẽ thấy 2 tiện ích E-Hentai. Hãy gỡ bản cũ:
1. Mở Nekoyomi/Aniyomi → **Duyệt** → **Tiện ích**.
2. Tìm **E-Hentai** có nhãn ngôn ngữ **Tiếng Việt** (bản cũ) → bấm vào → **Gỡ cài đặt**.
3. Giữ bản mới ở nhóm **Đa ngôn ngữ**. Truyện trong thư viện từ bản cũ cần chuyển nguồn (Migrate) sang bản mới.

## Kết quả kiểm thử & Thiết bị thật Galaxy Note9
- **Kiểm thử mạng thật toàn bộ:** Đạt **94/196 PASS** (48.0%) ở lượt đo toàn bộ (+17 nguồn so với 0.0.7), bổ sung **AVSub – AnimeVietsub (`avsubanimevietsub` v14.1008)** PASS 100% (`popular✓ search✓ detail✓ chapters✓ videos✓ stream✓`).
- **Mô phỏng Aidoku:** 74/152 nguồn PASS trọn chuỗi.
- **Kiểm thử trực quan trên Samsung Galaxy Note9 (SM-N960N, Android 10):** Cài đặt thành công 81/81 APK + cập nhật `avsubanimevietsub-v14.1008.apk`, xác minh trực quan 100% với **8 video screenrecord (.mp4)** và **44 ảnh chụp màn hình (.png)** tại `_work/shots/v008/`:
  - **Aniyomi:** NguonC phát HLS + lưu tiến độ Resume (`0:43/23:19`), **AVSub – AnimeVietsub v14.1008** phát trực tiếp trong `PlayerActivity` (`00:54/24:14`, không qua web), Anime47 hiển thị tuỳ chỉnh tên miền (`Tên miền / Custom domain`).
  - **Nekoyomi:** Chỉ hiển thị nguồn Manga (có `E Hentai` nhóm `Đa Ngôn Ngữ`), TruyenQQ tải & vuốt đọc trang mượt.
  - **LNReader:** `Bàn Long` mở chi tiết & đọc chương tiếng Việt đầy đủ.
  - **YomiHub:** Duyệt nguồn Manga/Video, VTVgo tải danh sách kênh VTV1–VTV4 (bản cài trên máy chưa bật tab Shorts riêng).
  - **Mangayomi:** Duyệt TruyenQQ & Twitch thành công (các bản tiện ích cũ `0.0.3`/`0.0.6` cài sẵn trên máy cần bấm *Update all* sau khi phát hành Release v0.0.8).
  - **vBook (`v1.1.57`):** Mở sạch, hiển thị Thư viện 25 nguồn. **LeechText (`2.0.0`):** tự dừng khi mở trên Android 10 (lỗi ứng dụng).

---

# Kiritokmn Extension Repo — v0.0.7 (18/11/2026)

## Sửa & Tối ưu hóa nguồn
- **Twitch (Khắc phục triệt để treo media_kit trên Mangayomi / YomiHub):**
  - Chuyển đổi usher playlist từ data URI sang các luồng variant HTTPS trực tiếp (1080p60, 720p60, 480p, 360p, 160p, audio only).
  - Bổ sung đầy đủ Origin / Referer HTTP headers, hỗ trợ tua, chuyển chất lượng mượt mà trên cả ExoPlayer (Aniyomi) và media_kit / libmpv (Mangayomi, YomiHub).
- **Dailymotion:** Chuẩn hóa streaming resolver qua CDN direct manifest kèm phụ đề đa ngôn ngữ .srt.
- **Chuyển đổi sang REST API chính thức:**
  - **Bilibili (`bilibili`):** Viết lại toàn bộ từ scraping sang Bilibili TV REST API quốc tế (`api.bilibili.tv/intl/gateway/`), hỗ trợ xem danh mục thịnh hành, tìm kiếm search_v2, hiển thị 1200+ tập phim và đa luồng mp4 Akamai.
  - **VTV Go (`vtvgo`):** Chuyển từ web SPA sang VTV Digital REST API (`api.vtvdigital.org`), lấy chính xác lịch phát sóng trực tiếp và luồng live HLS m3u8.
  - **Novelpia Global (`novelpiaglobal`):** Chuyển sang Nuxt 3 REST API (`api-global.novelpia.com`), tải danh mục 200 truyện và nội dung chương hoàn chỉnh.
- **Sửa chữa & phục hồi các nguồn:**
  - **PhimTV (`phimtv`):** Khắc phục tìm kiếm minlength, trích xuất luồng HLS m3u8 và 31 phụ đề rời qua API geturl.
  - **Hắc Ám Chi Các (`hacamchicac`):** Giải mã script base64 nén bởi WP-Rocket, hỗ trợ lazy-load attributes `data-original-src` và `data-mce-src`.
  - **Mimimoe (`mimimoe`):** Cập nhật routes `/lib`, `/manga/` và bộ chọn trang truyện.
  - **Sáng Tác Việt (`stvappvi` & `allin1`):** Hỗ trợ tìm kiếm POST, bộ chọn `:self@href` và API tải mục lục AJAX động (`/index.php?ngmar=chapterlist`).
  - **Biquge (`abcbiquge`):** Cấu hình giải mã bảng ký tự GBK, chống chặn với delay chương và bộ chọn mục lục/phân trang mới.
  - **TikTok & Douyin:** Tối ưu hóa bộ đệm và điều tiết tần suất gọi (rate-limit backoff).

## Phiên bản
- `package.json` 0.0.7.
- Cả 196 nguồn được đồng bộ biên dịch lại.
- Dựng đủ 81 APK Android (44 Anime + 37 Manga), ký số SHA-256 (`b92c172d4939aa8a...`).

## Kiểm thử
- **Kiểm thử tự động trên mạng thật:**
  - `run-tests --conc 8 --dns 1.1.1.1,8.8.8.8`: **77/196 PASS** (tăng +8 nguồn so với 69/196 của bản 0.0.6).
  - Vượt qua rào cản phân giải DNS của các ISP tại Việt Nam.
- **Kiểm thử thực tế trên Samsung Galaxy Note9 (SM-N960N):**
  - Cài đặt và xác nhận tương thích trên 6 ứng dụng chính: Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook.
  - Lưu trữ 19 ảnh chụp màn hình và 6 video màn hình MP4 đầy đủ tại `_work/shots/v007/`.

---

# Kiritokmn Extension Repo — v0.0.6 (16/11/2026)

## Tính năng mới
- **Đổi tên miền linh hoạt trên cả 9 app.** Khi trang đổi địa chỉ, bạn tự đổi trong cài đặt nguồn, không phải chờ bản cập nhật.
  - Mỗi nguồn (cả 196) có **danh sách tên miền**, gồm tên miền hiện tại, các tên miền gương và tên miền ghi trong Excel của dự án.
  - Thêm ô **"Tên miền tuỳ chỉnh"** để gõ bất kỳ tên miền mới nào. Ô này được ưu tiên trước danh sách; để trống thì dùng danh sách.
  - Cách hiện trên từng app:
    - Aniyomi/Nekoyomi: danh sách chọn kèm ô nhập.
    - Mangayomi/YomiHub: danh sách kèm ô nhập.
    - **LNReader/IReader: lần đầu có mục cài đặt plugin.**
    - Aidoku: ô chọn kèm ô nhập.
    - vBook/LeechText: dùng cấu hình của app.
  - Nguồn có địa chỉ viết cứng trong mã cũng tự đi theo tên miền đã chọn: engine chuyển hướng request tới tên miền cũ hoặc gương sang tên miền mới.
  - Link truyện/phim được lưu theo tên miền gốc, nên **thư viện, lịch sử và vị trí xem tiếp (Resume) không mất khi đổi tên miền**.
- **Short Video tương thích YomiHub 0.5.7:** kho khai báo `additionalParams = {"shorts": true}` cho mọi nguồn có cờ Short. Trước đây kho ghi chữ `shorts` trần, và bộ nhận diện ShortsDetect của YomiHub không đọc được dạng này.
- **Giảm dung lượng:** bỏ bảng mã hoá thực thể HTML (23 KB mỗi gói), vốn không bao giờ được dùng.
  - Mangayomi/YomiHub: 42,6 → 38,0 MB (−10,8%).
  - LNReader/IReader: 30,0 → 27,3 MB (−9%).
  - Aidoku: 23,1 → 19,8 MB (−14%).

## Sửa nguồn
- **TikTok:** tikwm.com giới hạn 1 yêu cầu/giây và hay báo "Oops, an error occurred".
  - Nay tiện ích giãn cách các lần gọi, thử lại tối đa 4 lần và luân phiên `www.tikwm.com` / `tikwm.com`.
  - Lưu thông tin clip vào cache để giảm số lần gọi; lỗi được báo bằng tiếng Việt rõ ràng.
- **Twitch, Dailymotion:** viết lại theo API JSON công khai, thay cho trang SPA.
- **Đạt trọn chuỗi trên mạng thật:** HiHiPhim, HentaiVietsub, Mê Truyện Chữ, Wiki Dịch, XTruyện, Tu Tiên Pro, 52shuku, html5.qq.
- **Sửa một phần** (danh sách và tìm kiếm chạy, còn bước chương/nội dung): PhimTV, Truyện CV, TruyenH, Hắc Ám Chi Các, abcbiquge.
- **Douyin:** muốn xem video vẫn cần máy chủ Douyin_TikTok_Download_API riêng (cài `DTK_SERVER`), vì tiện ích không đưa thuật toán ký chống bot vào.

## Phiên bản
- `package.json` 0.0.6.
- Mọi nguồn tăng `version` 1 bậc, vì engine dùng chung thay đổi.
- Aidoku `BRIDGE_REV 4`.

## Kiểm thử
- **Tự động** (Windows, 16/11/2026):
  - `run-tests --stream`: 69/196 (0.0.5: 66).
  - Ghi riêng 17 nguồn vừa sửa: 11 đạt.
  - `aidoku-sim`: 63/152.
  - `test/domain-switch.test.mjs`: 12/12.
  - Lưu ý: DNS nhà mạng VNPT chặn vài trang truyện, nên kiểm thử có thêm tuỳ chọn `--dns 1.1.1.1`.
- **Galaxy Note9** (16/11/2026):
  - Aniyomi: 81/81 APK cài đè thành công. Cài đặt tên miền mới hiện đúng. Twitch phát được. "Tiếp tục" xem đúng chỗ. ✅
  - Nekoyomi: đọc TruyenQQ. ✅
  - Mangayomi 0.9.96: cài đặt tên miền mới, danh sách và chi tiết Twitch ✅. Trình phát Twitch quay mãi ❌, để bản sau.
  - LNReader: cập nhật plugin, ô "Tên miền" trong cài đặt plugin, đọc Bàn Long. ✅
  - YomiHub 0.5.7: cập nhật kho. Cờ Short kiểm bằng đúng quy tắc ShortsDetect của YomiHub. ✅
  - Không kiểm được trên máy:
    - IReader: Play Protect chặn cài app.
    - vBook 1.1.54: bắt cập nhật app 1.1.57.
    - LeechText 2.0.0: app tự dừng khi mở, lỗi thiếu lớp Compose của chính app.
- Sửa thêm khi kiểm thử: Dailymotion bị đổi ngôn ngữ thành "Đa Ngôn Ngữ", nên Aniyomi hiện 2 tiện ích Dailymotion. Đã trả về Tiếng Việt theo Excel.

---

# Kiritokmn Extension Repo — v0.0.5 (13/11/2026)

## Tính năng mới
- **Aniyomi / Nekoyomi: mỗi nguồn là một tiện ích (APK) riêng.** Trước đây chỉ có 4 APK gộp (Phim, Phim 18+, Truyện, Truyện 18+) nên trong danh sách Tiện ích mọi nguồn trông giống nhau. Nay có **81 APK** (44 Phim + 37 Truyện tranh). Mỗi APK mang **tên và logo của nguồn**, nên phân biệt được ở cả tab *Tiện ích* lẫn *Nguồn*, và bạn chỉ cần cài nguồn mình dùng.
  - Gói: `eu.kanade.tachiyomi.animeextension.<ngôn ngữ>.kiri<id>` (Phim) / `eu.kanade.tachiyomi.extension.<ngôn ngữ>.kiri<id>` (Truyện).
  - **Source ID giữ nguyên** như 0.0.4. Gỡ 4 APK gộp cũ rồi cài APK mới thì thư viện, lịch sử và vị trí xem tiếp vẫn còn (đã kiểm trên Galaxy Note9).
  - Phiên bản APK theo phiên bản từng nguồn (`14.1xxx` / `1.4.1xxx`), nên sửa nguồn nào thì chỉ nguồn đó báo cập nhật.
- **Rãnh âm thanh riêng cho luồng phát:** nguồn có thể trả hình và tiếng tách rời (`audios`). Aniyomi/Nekoyomi dùng `audioTracks`, Mangayomi/YomiHub dùng `audios`.
- Kiểm thử tự động có thêm bước **tải thử luồng phát** (`run-tests.mjs --stream`): tải vài KB đầu của link phát hoặc segment HLS đầu tiên, thử cả HTTP/2.

## Sửa lỗi
- **NguonC không phát trong Aniyomi (lỗi 403):** CDN segment của NguonC chỉ trả dữ liệu qua **HTTP/2** và từ chối HTTP/1.1, trong khi trình phát mpv của Aniyomi chỉ nói HTTP/1.1. APK nay có **cầu nối HTTP/2 nội bộ** (`127.0.0.1`): mpv gọi cầu nối, cầu nối tải lại bằng OkHttp (HTTP/2) của ứng dụng. Playlist cả phim (khoảng 1500 đoạn, gửi dạng `data:`) cũng được phục vụ đúng. **Kết quả trên điện thoại thật:** phim 1:43:26 phát được, tua được, thoát ra mở lại thì xem tiếp.
- **YouTube quay mãi trong Aniyomi:** client iOS của YouTube chỉ trả luồng hình và luồng tiếng tách rời. Trước đây tiện ích đưa luồng hình không tiếng cho mpv. Nay mỗi chất lượng (1080p, 720p, 480p…) ghép với luồng tiếng AAC tốt nhất, thành rãnh "Âm thanh gốc". **Đã phát được trên điện thoại thật.**
- **Sửa nguồn:**
  - Sohu và Syosetu đạt trọn chuỗi.
  - Mangadm hết báo "đạt nhầm" do link "Skip to content".
  - Wiki Dịch, NetTruyenViet, Weeb Central, Sudugu, Lofter, PO18, Sweetastes, NovelNext, HiHiPhim, HentaiVietsub: sửa bộ chọn, các nguồn này qua thêm bước.
- `lib_generic.js`:
  - Link chương tương đối được tính theo trang hiện tại.
  - Link `?page=2` giữ nguyên đường dẫn trang.
  - Bỏ qua link `#…` và `javascript:`.
  - Thêm `pages_suffix`.

## Phiên bản
- `package.json` 0.0.5.
- Mọi nguồn tăng `version` 1 bậc.
- APK `versionCode = 1000 + version nguồn`.
- Aidoku `BRIDGE_REV 3`, 152 gói dựng lại.

## Kiểm thử
- `run-tests.mjs --stream` trên mạng thật (máy Windows, 13/11/2026 23:19): **66/196** (0.0.4: 60). Phim 5/44, Truyện tranh 21/37, Tiểu thuyết 40/115. Bước tải thử luồng phát đạt với NguonC, HotPhim, XemPhimGi, YouTube, TikTok.
  - Mới đạt: Sohu, Syosetu, Sudugu, Lofter, Shubenshu, Weeb Central.
  - Không đạt lần này do trang lỗi hoặc mạng: PornHub (bị chặn ở VN), PhimNhựa (HTTP 530), Tinh Linh (HTTP 525), ixdzs8, Mê Truyện Chữ.
- `aidoku-sim.mjs --all`: **64/152** (0.0.4: 58). Aidoku: 152/152 gói dựng lại.
- Gradle: **81/81 APK** (44 Phim, 26,6 MB + 37 Truyện, 22,4 MB), đã ký bằng khoá `b92c172d…aa39d` như các bản trước.
- **Điện thoại thật Galaxy Note9** (Android 10). Ảnh và video ở `_work/shots/v005/`:
  - Gỡ 4 APK gộp, cài 81 APK mới ✅.
  - Aniyomi: mỗi tiện ích/nguồn hiện **tên + logo riêng** ✅.
  - NguonC: phát phim 1:43:26, tua, thoát ra mở lại xem tiếp ✅.
  - YouTube: phát được, có rãnh "Âm thanh gốc" ✅.
  - Nekoyomi: nguồn truyện tranh có logo riêng, TruyenQQ đọc 160 trang ✅.

---

# Kiritokmn Extension Repo — v0.0.4 (13/11/2026)

## Tính năng mới
- **Logo cho từng tiện ích (196 nguồn).** Mỗi nguồn có logo 256×256 riêng (`sources/<id>/icon.png`, `repo/icons/<id>.png`). Logo lấy từ chính trang web: apple-touch-icon, `<link rel=icon>`, web manifest, favicon. Trang không có logo, hoặc có logo mặc định trùng với trang khác (biểu tượng của bộ mã CMS, trang lỗi Cloudflare, chữ W của WordPress), được tạo **logo chữ viết tắt** với màu riêng. Góc logo có huy hiệu **▶ Phim / T Truyện tranh / N Tiểu thuyết** và nhãn **18**. Nhờ đó các tiện ích phân biệt được với nhau trên Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText và Aidoku. Trước đây Mangayomi/LNReader lấy favicon qua dịch vụ Google, nên trang chết hiện hình quả địa cầu giống hệt nhau.
  - Aniyomi/Nekoyomi dùng một biểu tượng cho mỗi APK đa nguồn. Đây là giới hạn của ứng dụng; các nguồn bên trong phân biệt bằng tên.
- **YouTube viết lại** theo API InnerTube (API của chính ứng dụng YouTube). Dùng client WEB để tìm kiếm và client iOS để lấy link phát trực tiếp, không cần giải mã chữ ký. Có tab **Shorts**, Âm nhạc, Tin tức, Hoạt hình, Game; dán link YouTube vào ô tìm kiếm cũng mở được video.
- **TikTok và Douyin**:
  - Đã quét bộ *TikTok & Douyin Project* (Evil0ctal/Douyin_TikTok_Download_API).
  - Cả hai tiện ích có ô cài đặt **Máy chủ Douyin_TikTok_Download_API** và **Khoá API**. Khi đặt máy chủ, tiện ích gọi REST API v1 của máy chủ đó (`/{platform}/video`, `/user/posts`, `/hashtag/posts`, `/trending`). Máy chủ tự ký yêu cầu (X-Bogus/a_bogus) bằng nhóm danh tính của nó, nên tiện ích không phải mang thuật toán ký.
  - TikTok khi không có máy chủ: dùng tikwm.com, gồm bảng tin đề xuất theo quốc gia (cài đặt **Khu vực**, mặc định VN), hashtag, tìm kiếm, video của người dùng. Có link HD/SD không logo.
  - Douyin khi không có máy chủ: chỉ có bảng **tìm kiếm nóng** (iesdouyin, không cần chữ ký); bấm vào chủ đề thì mở trên Douyin. **Xem video Douyin trong ứng dụng cần máy chủ**, vì Douyin từ chối khách và mọi API video đều đòi chữ ký.
  - Liên kết video luôn là địa chỉ gốc (`tiktok.com/@user/video/<id>`, `douyin.com/video/<id>`), nên ứng dụng giữ đúng lịch sử xem / Resume A Video.
- **Cài đặt nguồn mở rộng:** mọi mục `config` trong `plugin.json` (ngoài Tên miền) hiện thành ô nhập trong cài đặt nguồn của Mangayomi/YomiHub và của APK Aniyomi/Nekoyomi.
- **Đánh dấu nguồn ngừng hoạt động:** 37 nguồn có tên miền chết, đang rao bán, thành trang cờ bạc hoặc lỗi máy chủ vĩnh viễn. Các nguồn này **vẫn giữ trong kho** nhưng tên có thêm **(Ngừng hoạt động)** và mô tả ghi lý do, áp dụng ở mọi định dạng kể cả tiện ích YomiHub. Danh sách và lý do ở `data/status.json`.
- **README** ghi trạng thái từng nguồn: ✅ / ⛔ / 🛡️ Cloudflare / 🌐 bị chặn ở VN / 🔐 cần đăng nhập / 🔒 chống lấy dữ liệu / 🧩 cần API.
- **Hướng dẫn sửa YomiHub** để nhận Shorts theo cờ của kho (`docs/YOMIHUB_SHORTS_GUIDE.md`). Theo quyết định của chủ dự án, phần này để bản sau.

## Sửa lỗi
- **Kiểm thử báo "đạt" nhầm:** danh sách lấy phải mục menu hoặc thể loại ("Manhwa | Manhua | Manga", "MORE"). `run-tests.mjs` nay đánh trượt khi từ 50% mục trở lên giống menu. Phép kiểm phát hiện **NetTruyenViet**, **TruyenQQ (truyenqq.com.vn)** và **Novelpia**; hai nguồn đầu đã được viết lại bộ chọn.
- **Navy Team Novel:** trước đây lấy cả truyện tranh. Nay dùng mục *Tiểu thuyết*, sửa tên truyện (`h2`) và nội dung chương (`.reader-content`).
- **TruyenC:** mục lục lấy nhầm liên kết menu → chỉ lấy `/chuong-`, đảo thứ tự. **Viblo:** mỗi bài viết là một "chương", đọc được nội dung. **PornHub:** trang video là tập duy nhất, có link phát. **ixdzs8:** chạy lại được.
- **Đổi tên miền:** Wiki Dịch → `wikicv.org`, LuotTruyen → `luottruyen21.com`, PhimTV → `phimtv2.com` (`phimtv.my` bị chặn), XTruyen → `xtruyen.vn`, Xôi Lạc → `xoilacxl.cc`. Tên miền cũ vẫn có trong danh sách chọn.
- **Madara (Đọc Truyện Tranh BL):** khi trang bật "WP Manga Images Protection" (bắt đăng nhập Google), tiện ích báo rõ "cần đăng nhập trong WebView" thay vì trả về 0 ảnh.
- `lib_generic.js`: thêm `ch_from` để lấy mục lục từ API AJAX theo mã trong trang chi tiết (kiểu novelfull/novelnext).

## Tối ưu
- **LNReader/IReader nhỏ đi ~55%:** mã sau khi hạ xuống ES5 được nén lại. Thư mục `repo/lnreader` giảm từ 64 MB xuống 29 MB; tải plugin và cập nhật nhanh hơn.
- Logo lưu dạng PNG bảng màu 128 màu, tổng 2,2 MB cho 196 logo, nhỏ hơn khoảng 4 lần so với PNG RGB.
- Công cụ phát triển: `run-tests.mjs --record/--replay` ghi lại phản hồi HTTP trên mạng thật để sửa bộ chọn ngoại tuyến; `tools/test/one.mjs` chạy từng bước một nguồn; `tools/gen/make_icons.py` dựng logo.

## Phiên bản
- `package.json` 0.0.4 · APK Aniyomi/Nekoyomi `versionCode 4` (`14.4` anime, `1.4.4` manga) · mọi nguồn tăng `version` (có logo mới) · Aidoku `BRIDGE_REV 2` (gói `2xx`).

## Kiểm thử
- `run-tests.mjs` (mạng thật, máy Windows của chủ dự án, 13/11/2026): **60/196** nguồn đi trọn chuỗi; bản 0.0.3 chạy lại cùng ngày được 54. `aidoku-sim.mjs`: 58/152. Aidoku: 152/152 gói dựng thành công.
- **Máy ảo Android (API 37):**
  - Aniyomi: XemPhimGi phát phim, **Resume A Video** phát tiếp đúng mốc 1:34 ✅.
  - Nekoyomi: TruyenQQ đọc chương ✅.
  - Mangayomi: cập nhật tiện ích, cài đặt mới của TikTok, TikTok phát video ✅.
  - LNReader: thêm kho, Navy Team Novel đọc chương ✅.
  - vBook: thêm kho (221 tiện ích, có logo) ✅; app bắt cập nhật lên 1.1.57 mới cho cài tiện ích.
  - Lỗi còn lại, để bản sau: NguonC trả 403 ở luồng phát trong Aniyomi; YouTube trong mpv của Aniyomi quay mãi.
  - Ảnh và video ở `_work/shots/v004/` trên máy của chủ dự án.

---

# Kiritokmn Extension Repo — v0.0.3 (08/11/2026)

## Tính năng mới
- **Aidoku (iOS / iPadOS):** lần đầu có nguồn cho Aidoku, gồm **152 nguồn** (37 truyện tranh + 115 tiểu thuyết). Thêm vào Aidoku bằng đường dẫn `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/aidoku/index.min.json`, hoặc mở liên kết `aidoku://addSourceList?url=…`.
  - Mỗi nguồn là một gói `.aix`: WebAssembly viết bằng Rust (`aidoku/bridge`), bên trong chạy **chung engine JavaScript** với Mangayomi/LNReader/vBook qua JavaScriptCore của iOS. Nhờ vậy sửa nguồn một lần là cả 9 ứng dụng cùng được sửa.
  - Truyện chữ hiển thị bằng trình đọc chữ của Aidoku (Markdown). Ảnh truyện tranh gửi kèm `Referer` của trang chương. Đọc được trang mã hoá GBK (Trung Quốc). Mỗi tab trang chủ của nguồn thành một mục trong Browse. Đổi được tên miền trong cài đặt nguồn.
  - Cần Aidoku 0.8.3 trở lên. Chi tiết: `docs/AIDOKU.md`.
- **Resume A Video (làm lại cho đúng):** Aniyomi, Nekoyomi, Mangayomi và YomiHub tự lưu vị trí xem theo **địa chỉ (URL) của tập phim**. Từ bản này, địa chỉ phim/truyện/tập/chương luôn được ghi theo **tên miền mặc định** của nguồn, dù người dùng chọn tên miền nào trong cài đặt. Vì vậy khi trang đổi tên miền, ứng dụng vẫn nhận ra đúng tập cũ, vẫn **xem tiếp từ chỗ đã thoát** và không mất lịch sử đọc/xem. Áp dụng cho cả 4 APK, Mangayomi/YomiHub, LNReader/IReader và Aidoku.
- **Tăng tốc:** engine giữ lại các trang vừa tải trong 60 giây (tối đa 6 trang). Khi mở một truyện/phim, `detail.js` và `toc.js` dùng chung một lần tải trang chi tiết, nên bớt một lượt mạng mỗi lần mở.
- **Short Video (YomiHub):** ghi thêm cờ `additionalParams: "shorts"` trong `index.json` cho các nguồn có Short Video, để bản YomiHub sau đọc được mà không cần ghi cứng ID tiện ích.

## Sửa lỗi
- **Resume A Video của 0.0.2 không hoạt động:** `engine.js` có đọc vị trí đã lưu (`resumeStorage.get`) nhưng không chỗ nào ghi vào, vì tiện ích không nhận được thông báo từ trình phát. Vì thế mốc `#t=` luôn bằng 0 và nhãn "[Tiếp tục mm:ss]" không bao giờ hiện. Hơn nữa, ExoPlayer/mpv bỏ qua `#t=` trên link HLS. Đã gỡ phần mã này cùng tuỳ chọn `RESUME_VIDEO` (bật/tắt không có tác dụng) và thay bằng cơ chế ở mục *Tính năng mới*.
- **Đổi tên miền làm mất lịch sử:** trước đây đổi tên miền thì ứng dụng tạo tập/chương mới, mất vị trí xem và trạng thái đã đọc. Đã sửa nhờ địa chỉ ổn định.
- `tools/win/publish.ps1`: lời nhắn commit bị ghi cứng nội dung của 0.0.2. Nay đọc từ biến `PUB_MSG`.
- `Output/` còn sót tệp của bản cũ khi phát hành: `make-output.mjs` nay tự xoá các tệp `Kiritokmn-Extension-<phiên bản khác>-*`.

## Phiên bản
- `package.json` 0.0.3 · APK Aniyomi/Nekoyomi `versionCode 3` (`14.3` anime, `1.4.3` manga) · Mangayomi/YomiHub `0.5.x` · LNReader/IReader `1.4.x` · Aidoku `1xx` (= 100 + phiên bản nguồn).

## Kiểm thử
- `run-tests.mjs` (mạng thật, máy chủ dự án): **63/196** nguồn đi trọn chuỗi; bản 0.0.2 là 57.
- `aidoku-sim.mjs` (adapter Aidoku trong ngữ cảnh JS trần giống JavaScriptCore, mạng thật): **61/152** nguồn đạt. Nguồn nào đạt ở `run-tests` thì cũng đạt ở Aidoku.
- `aidoku-test-runner` (WASM + JS + mạng, công cụ chính thức của aidoku-rs): đạt trọn chuỗi với 2 nguồn mẫu (truyện tranh + truyện chữ, có chương GBK) trên máy chủ giả lập. `aidoku verify`: 152/152 gói đạt.
- Galaxy Note9: cài 4 APK 0.0.3 và kiểm tra Nekoyomi, Aniyomi, Mangayomi, YomiHub, LNReader, vBook, LeechText. Ảnh và video ở `_work/shots/v003/`.

---

# Kiritokmn Extension Repo — v0.0.2 (08/11/2026)

## Tính năng mới & Cải tiến trong bản 0.0.2
- **Tích hợp "Resume A Video" cho toàn bộ 44 nguồn Phim & Video**:
  - Ghi nhớ tiến trình và thời gian xem phim (`resumeStorage` thông qua `localStorage` / `SharedPreferences`).
  - Tự động gắn mốc phát Media Fragment (`#t=` hoặc `&t=`) trực tiếp vào URL luồng phát (HLS / MP4), giúp ExoPlayer (Aniyomi / Nekoyomi) và trình phát Mangayomi / YomiHub tự động tiếp tục phát từ chính xác giây người dùng thoát ra trước đó.
  - Hiển thị nhãn trực quan `[Tiếp tục mm:ss]` trên danh sách server/chất lượng video.
  - Bổ sung tùy chọn `RESUME_VIDEO` (Bật/Tắt tiếp tục phát từ vị trí đã thoát) trong cài đặt nguồn tiện ích.
- **Hỗ trợ tính năng "Short Video" chuẩn YomiHub**:
  - Cấu hình 11 nguồn video ngắn dọc 9:16 (YouTube Shorts, TikTok, Douyin, FreeReels, Tik.Porn, FikFap, Kwiky, xFree, FapReel, SexVietTop, PornHub shorties).
  - Bổ sung trường `shorts: true` và `hasShorts: true` vào metadata tiện ích và `repo/index.json`.
  - Bổ sung bộ lọc `SelectFilter` (Chế độ Shorts / Mặc định) trong `getFilterList()` để YomiHub nhận diện và kích hoạt chế độ cuộn dọc 9:16.
- **Nâng cấp phiên bản toàn hệ thống**:
  - `package.json` lên `0.0.2`.
  - Bộ 4 APK Aniyomi/Nekoyomi lên `versionCode = 2`, `versionName = 14.2` (anime) và `1.4.2` (manga).
  - Tiện ích Mangayomi/YomiHub lên `0.4.x`, LNReader/IReader lên `1.3.x`.
- **Tối ưu hóa hiệu năng & Dung lượng**:
  - Tinh gọn mã nguồn trung gian, loại trừ thư viện mã hóa `crypto-js` dư thừa đối với các nguồn không cần thiết.
  - Đóng gói toàn bộ các file cài đặt vào thư mục `Output/` và cập nhật danh sách link tải Releases trên `README.md`.
- **Kiểm thử thiết bị thực tế**:
  - Cài đặt và kiểm thử trực tiếp trên điện thoại Samsung Galaxy Note9 (SM-N960N).
  - Kiểm thử giao diện và tương thích trên các ứng dụng: Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook, LeechText.
  - Chụp ảnh màn hình và quay video toàn bộ quá trình kiểm thử lưu tại `_work/shots/`.

---

# Kiritokmn Extension Repo — v0.0.1 (04/11/2026)

Bản đầu tiên: dựng lại toàn bộ repo (trước đó chỉ có README/LICENSE).


## Cập nhật 06/11/2026 — nhận 29 tiện ích website từ YomiHub 0.5.3
- Thêm thư mục `sources-yomihub/` (mã nguồn tiện ích YomiHub định dạng Mangayomi JS + `_common.js` + `meta.json`) và đầu ra `repo/yomihub/<tên>.js` (tự chứa).
- `repo/index.json` có thêm 29 tiện ích (Hako, Sonako, AnimeVN, AVSub, RoPhim, HotPhim, Anime47, VTVgo, YouTube, Pornhub 18+, FikFap 18+, HihiSex 18+, Tik.Porn 18+, Kwiky 18+, xFree 18+, FapReel 18+, SexVietTop 18+, HayChill, XemPhimGi, NextPhim, Vfilm, CBHentai 18+, Dâm Cô Nương 18+, SayHentai 18+, Xôi Lạc TV, Phimmoi, MotPhim, HiHiPhim, PhimMoiHD), **giữ nguyên id** 920260001… của bản tích hợp cũ → bản đã cài trong YomiHub nhận cập nhật từ kho (phiên bản 0.5.3).
- 20 mục Mangayomi chuyển đổi từ vBook trùng trang web được bỏ khỏi `index.json` (vẫn còn ở định dạng vBook / LNReader / Aniyomi).
- Công cụ: `tools/build/yomihub-sources.mjs` (chạy tự động cuối `build-all.mjs`); README có bảng "Tiện ích YomiHub".

## Tính năng mới
- **Một kho, một thư mục gốc cho 8 ứng dụng**: Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText (`repo/`).
- **196 nguồn** từ sheet *Extension Repo Main*: 44 Phim & Video, 36 Truyện tranh, 116 Tiểu thuyết; gắn cờ 18+ (22 nguồn) theo chuẩn từng ứng dụng.
- **APK đa nguồn cho Aniyomi/Nekoyomi**: *Kiritokmn Phim*, *Kiritokmn Phim 18+*, *Kiritokmn Truyện*, *Kiritokmn Truyện 18+* (thay vì hàng trăm APK riêng lẻ → nhẹ, cập nhật một lần).
- **Đổi tên miền** ngay trong cài đặt nguồn (Aniyomi, Nekoyomi, Mangayomi, YomiHub, vBook).
- Bộ chuyển đổi tự động vBook → Mangayomi / LNReader / IReader / Rhino-APK; bộ kiểm thử trực tiếp và offline.

## Cập nhật trong ngày 04/11/2026 (tối) — sửa nguồn dính Cloudflare
- Viết lại selector cho 9 nguồn dính Cloudflare (101kks, czbooks, uukanshu, luvevaland, mattreadingtranslations, ciyuanji, novelfull.net, tik.porn 18+, xfree 18+) — phiên bản nguồn 2.
- Mangayomi/YomiHub: đọc đúng trang mã GBK (69shuba).
- Báo lỗi rõ ràng khi gặp Cloudflare: "CLOUDFLARE: … mở nguồn bằng WebView".
- 5 nguồn cần người dùng tự xác minh Cloudflare trong WebView: 101minc, hhtqhay.vip, sonako, cbhentai, myreadingmanga.

## Cài đặt
| Ứng dụng | Đường dẫn repo |
|---|---|
| Aniyomi / Nekoyomi | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.min.json` |
| Mangayomi / YomiHub | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/index.json` |
| LNReader / IReader | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugins.min.json` |
| vBook / LeechText | `https://raw.githubusercontent.com/kiritokmn1403/Kiritokmn---Extension-Repo/main/repo/plugin.json` |

## Lưu ý
- Trạng thái từng nguồn: xem bảng trong README. Nguồn không truy cập được thường do đổi tên miền → đổi trong cài đặt nguồn.
- Aidoku (iOS) chưa có nguồn trong bản này.
