# 04 – Bài học kỹ thuật

## A. Sửa nguồn nhanh và đúng
- Vòng làm việc: `node tools/test/run-tests.mjs --record <dir> --only a,b` (Windows, mạng thật) → kéo `<dir>` về → `--replay <dir>` (máy đám mây) cho kết quả **giống hệt**. Khoá bản ghi = sha1(method + url + body). URL chưa có trong bản ghi báo `replay miss` (HTTP 0) và nằm trong `_misses.json`; vòng record sau sẽ lấy.
- `node tools/test/one.mjs <id> [--replay <dir>] [--dns 1.1.1.1]` in từng bước popular → search → detail → chapters → nội dung, kèm URL. Dùng để tìm đúng trang cần xem.
- Sửa `config.js` (mẫu generic) bằng `patch.py` (đọc/ghi khối `var G = {...}` JSON). Đổi tên miền dùng `set_domain()`: sửa **cả** `plugin.json` (metadata.source, DOMAIN.default/values, regexp) **và** BASE_URL trong config.js. Chỉ sửa config.js thì DOMAIN mặc định trong plugin.json vẫn đè lên.
- Script phân tích (xem 06): `cards.py`, `an.py`, `getrec.py`, `peek.py`, `domprobe.mjs`.

## B. Bẫy hay gặp khi sửa nguồn
- **Danh sách lấy nhầm menu** ("Manhwa | Manhua | Manga", "MORE", liên kết `/the-loai/`). Bộ chọn chung như `.item` dễ dính menu. Từ 0.0.4, `run-tests` đánh trượt khi ≥50% mục giống menu. Liên kết Douyin `/search/…` cũng bị coi là menu, nên Douyin dùng `/hot/<từ khoá>`.
- **Trang chủ là trang giới thiệu**, danh sách thật nằm ở `/tim-truyen` (NetTruyenViet).
- **Tên truyện ở `h2`**, còn `h1` là logo (Navy Team).
- **Một trang "Novel" lẫn cả truyện tranh**: dùng trang danh mục tiểu thuyết.
- **Chương mới nhất bị khoá**: dùng `ch_reverse` để chương 1 đứng đầu.
- **Link chương tương đối**: `lib_generic.js` `X.rel()` (0.0.5); link `?page=2` giữ nguyên đường dẫn trang; bỏ link `#…`/`javascript:`; `pages_suffix`.
- **Kiểm tên miền trước khi kết luận chết**: thử mọi tên miền trong `DOMAIN.values` + tên miền đoán thêm (`domprobe.mjs`), xem `<title>`. Tên miền "sống" nhưng thành trang cờ bạc (LaskarTogel, SINGTOTO), trang rao bán (Spaceship) hay "Tạm biệt!" vẫn tính là chết. Tên miền mặc định có thể là trang demo của Wayback Downloader (PhimMoi): HTTP 200 nhưng chỉ có 4 trang.
- **Search bằng AJAX POST** thay vì GET (AnimeVN `/search/html/{p}`, Sáng Tác Việt). URL dính khoảng trắng gây `ConnectionAborted` → luôn `trim()`.
- **Mục lục tải động**: Sáng Tác Việt `/index.php?ngmar=chapterlist`; WordPress WP-Rocket nén script bằng base64, ảnh lười ở `data-original-src`/`data-mce-src` (Hắc Ám Chi Các, 0.0.7).
- **Bảng mã GBK** (Biquge): cấu hình charset + giãn cách chương để khỏi bị chặn.
- **API trả HTML báo lỗi với HTTP 200** (Anime47, SPA Quasar/Vue3): kiểm nội dung trước khi `json()` (`requestApiJson()`).
- **Tên miền xoay vòng** (Phimmoi, AVSub): danh sách dự phòng + `fetchWithDomainFallback`.
- **CDN chặn khi thiếu header**: trả `Referer`/`User-Agent` (và cookie xác nhận tuổi nếu cần) trong `track.js` (Pornhub, FikFap, 18/11).
- **Không sửa được bằng bộ chọn** — đừng sa lầy, ghi vào `data/status.json`:
  - Cloudflare challenge → app vượt bằng WebView. Cloudflare Turnstile tương tác vẫn chậm (việc 0.0.8).
  - Cổng đăng nhập Google (WP Manga Images Protection).
  - Trình phát dùng dấu vân tay WebGL hoặc bytecode/nonce (LuPhim, streamfree.vip của HHPanda).
  - Ảnh chương cấp qua token (MoeTruyen). Nội dung tải bằng JS (8book).
  - DRM/chống bot di động: iQIYI, MGTV, FreeReels (việc 0.0.8).
- **SPA → dùng REST API chính thức** thay vì DOM: Bilibili (`api.bilibili.tv/intl/gateway/`), VTV Go (`api.vtvdigital.org/display/v21.0/`), Novelpia Global (`api-global.novelpia.com`), Twitch (GQL `gql.twitch.tv` + `usher.ttvnw.net`), Dailymotion (`/player/metadata/video/<id>`).

## C. Phiên bản, phân loại, APK
- Sửa `lib/*.js` thì phải tăng `version` của **mọi** nguồn dùng lib đó, không thì app không cập nhật.
- **Đổi `locale` của nguồn = đổi tên gói APK** (`…<lang>.kiri<id>`) → máy người dùng có 2 APK cùng nguồn. 0.0.6: tác tử đổi Dailymotion vi → global, phải trả về vi và gỡ gói `all`. Chỉ đổi `locale` khi chủ dự án đồng ý, và ghi hướng dẫn gỡ gói cũ.
- Kotlin: `ListPreference.dialogTitle` không có trong stub extensions-lib → lỗi `Unresolved reference` (0.0.6, đã bỏ).
- **Không** chạy `git checkout -- android/anime/src android/manga/src` để dọn đầu ra build: lệnh đó xoá luôn sửa đổi Kotlin. Từ 0.0.5 đầu ra nằm ở `android/*/gen/` (gitignore).
- Giảm dung lượng: tìm phần thừa bằng esbuild `metafile`. 0.0.6 bỏ bảng `entities/…/encode-html.js` (23 KB mỗi gói, không bao giờ dùng vì `render(…, {decodeEntities:false})`) → −9 đến −14%.
- Short Video YomiHub: `additionalParams` phải là JSON `{"shorts":true}`; chữ trần `shorts` không khớp regex `_flag` của `shorts_detect.dart` (0.0.6).

## D. Video & stream
- **"Có link phát" chưa phải "phát được".** Dùng `run-tests.mjs --stream` / `streamcheck.mjs` (tải thử vài KB, thử cả HTTP/2).
- **CDN chỉ nhận HTTP/2** (NguonC: segment `.png` trả 403 với HTTP/1.1) → `http2: true`, APK phát qua `Http2Bridge.kt`. NguonC trả cả playlist dạng `data:` URI; mã hoá hex vào đường dẫn làm URL khoảng 590 KB, vượt giới hạn 16 KB của `readHead` → gọi URL gốc bằng khoá ngắn `ROOT` (`/<token>/p/0.m3u8`).
- **media_kit/libmpv (Mangayomi, YomiHub) không phát manifest dạng `data:application/x-mpegURL;base64,…`** (quay mãi). 0.0.7 Twitch: tách usher master thành các luồng variant HTTPS (`*.playlist.ttvnw.net`) kèm User-Agent/Origin/Referer. ExoPlayer (Aniyomi) chấp nhận cả hai.
- Link googlevideo gắn với IP của máy gọi `player`; trong APK chính điện thoại gọi nên khớp IP. Node trên máy test bị 403 với Dailymotion `cdndirector` dù app phát được.
- Video trên máy ảo hay răng cưa (giải mã phần mềm); vẫn tính phát được nếu thời gian chạy.

## E. YouTube, TikTok, Douyin
- **YouTube** (InnerTube): `youtubei/v1/search` client WEB, không cần khoá; lọc `EgIQAQ==` (video), `EgIQCQ==` (Shorts). `player` client **IOS** (11/2026) không trả `formats` có tiếng, không có `hlsManifestUrl`, chỉ `adaptiveFormats` → `chap.js` ghép hình `avc1` ≤ 1080p + `audio/mp4` bitrate cao nhất, `track.js` trả `audios` (Aniyomi có rãnh "Âm thanh gốc"). ANDROID_VR, TVHTML5 bị "LOGIN_REQUIRED"; MWEB "UNPLAYABLE". `FEtrending` đã bị gỡ (HTTP 400). Invidious công khai gần như đều 403.
- **TikTok**: tikwm.com không cần khoá (`/api/feed/list?region=VN` chậm khoảng 5 giây, `/api/feed/search` POST form, `/api/user/posts`, `/api/?url=`). Giới hạn 1 yêu cầu/giây, hay trả HTTP 531 "Oops" → `sources/tiktok/src/svx.js`: giãn cách 1,2 giây, thử lại 4 lần luân phiên `www.tikwm.com`/`tikwm.com`, cache thông tin clip. Chạy kiểm toàn bộ dồn dập thì tikwm chặn IP máy test. API web gốc của TikTok trả rỗng nếu thiếu chữ ký.
- **Douyin**: mọi API video đòi a_bogus; trang share iesdouyin có thử thách JS VM. Chỉ `iesdouyin.com/web/api/v2/hotsearch/billboard/word/` không cần chữ ký. Xem video phải dùng máy chủ Douyin_TikTok_Download_API người dùng tự dựng (`DTK_SERVER` + `DTK_KEY` trong cài đặt nguồn). `demo.douyin.wtf` không được dùng làm dịch vụ cho app khác.
- **Chính sách**: không đưa thuật toán ký chống bot vào tiện ích; việc ký để máy chủ riêng của người dùng làm (xem 07).

## F. Mạng Việt Nam
- Nhà mạng chặn một số tên miền (mangadex, wattpad, phimtv.my…); `api.mangadex.org` bị chặn DNS. Từ 16/11 DNS VNPT (123.23.23.23) chặn thêm vài trang truyện → `HTTP 0 ENOTFOUND` trong 20 ms. Dùng `--dns 1.1.1.1,8.8.8.8` (thay `dns.lookup`). Một số trang bị chặn cả IP → vẫn hết giờ; đó không phải lỗi mã.

## G. Logo
- `_work/x/logofetch.mjs` (Windows) gom icon ứng viên → `tools/gen/make_icons.py` chọn ảnh lớn nhất, bỏ ảnh trống và ảnh trùng giữa host khác nhau (hamming ≤ 12 trên average-hash 12×12), tạo logo chữ nếu không còn ảnh. Xem lại bằng bảng ghép và thêm `FORCE_LETTER` cho logo rác. Không dùng dịch vụ favicon của Google làm biểu tượng chính.
- Aidoku yêu cầu logo **không trong suốt**. Lưu PNG bảng màu 128 màu cho nhẹ.

## H. Bài học kỹ thuật phiên bản 0.0.8
- **Tách riêng chỉ mục repo Anime & Manga (`aniyomi-index.mjs`):** Aniyomi và Nekoyomi cần hai kho lưu trữ chuyên biệt (`repo/anime/index.min.json` cho 44 nguồn anime và `repo/manga/index.min.json` cho 37 nguồn manga). Việc này giải quyết triệt để lỗi hiển thị lẫn lộn anime trong danh sách truyện hoặc ngược lại khi dùng chung `repo/index.min.json`.
- **Tùy biến tên miền linh hoạt (`DOMAIN_CUSTOM`):** Khai báo trong `plugin.json` và ưu tiên đọc `preferences` trong `src/config.js` cho toàn bộ 44 nguồn phim. Giúp người dùng tự điền tên miền thay thế khi nhà mạng chặn IP/DNS mà không cần chờ bản cập nhật tiện ích mới.
- **Bộ dò luồng nâng cao (`C.sniff`) & Dean Edwards Unpacking:** Các trang web xem phim hiện đại thường đóng gói luồng video dưới dạng packed script (`p,a,c,k,e,d`) hoặc base64 kết hợp mã chống DevTools. Việc giải mã trực tiếp bằng `C.sniff` trong `lib_common.js` giúp trích xuất link `.m3u8` / `.mp4` trực tiếp với tốc độ cực nhanh, không làm crash runtime.
- **Cài đặt hàng loạt APK trên thiết bị thật:** Lệnh `adb install-multiple` được Android thiết kế dành riêng cho split APKs của cùng một ứng dụng. Khi cài đặt 81 APK độc lập, lệnh này sẽ báo lỗi `INSTALL_FAILED_INVALID_APK: Split null was defined multiple times`. Bắt buộc phải dùng script PowerShell lặp `adb install -r <apk>` tuần tự để đảm bảo 100% gói cài đặt thành công.
- **Di chuyển package E-Hentai từ `vi` sang `all`:** Khi chuyển ngôn ngữ từ Tiếng Việt sang Đa ngôn ngữ, package name đổi từ `eu.kanade.tachiyomi.extension.vi.kiriehentai` sang `eu.kanade.tachiyomi.extension.all.kiriehentai`. Trên thiết bị Android cần gỡ package cũ (`adb uninstall`) để tránh xung đột thư viện và xuất hiện 2 extension cùng tên.

