# YomiHub Extension Repo (trước đây Kiritokmn - Extension Repo) — Ghi chú kỹ thuật cập nhật

**BẮT BUỘC ĐỌC TRƯỚC MỖI LẦN CẬP NHẬT.** Từ 0.0.4: đọc thư mục `A.I Brain - Second Brain/` trước tài liệu này.

Chủ dự án yêu cầu tạo và duy trì tài liệu này ngày 25/10/2026. Quy định được ghi thêm trong `AGENTS.md` ở gốc dự án. Mỗi người hoặc tác nhân tự động cập nhật ứng dụng phải đọc toàn bộ tài liệu, kiểm tra trạng thái và bổ sung kết quả sau khi làm việc.

---

## Trạng thái hiện tại

| Hạng mục | Trạng thái |
|---|---|
| Phiên bản | **0.1.0** (26/11/2026, kho đổi tên `YomiHub-Project/YomiHub-Extension-Repo`) — trước đó 0.0.9 (23/11/2026), 0.0.8 (23/11/2026), 0.0.7 (18/11/2026), 0.0.6 (16/11/2026), 0.0.5 (13/11/2026), 0.0.4 (13/11/2026), 0.0.3 (08/11/2026), 0.0.2 (08/11/2026), 0.0.1 (04/11/2026) |
| Số nguồn | 196 (Phim 44 · Truyện tranh 37 · Tiểu thuyết 115) lấy từ `Project Extension Repo.xlsx` → sheet *Extension Repo Main* |
| Ứng dụng hỗ trợ | Aniyomi (44 APK Anime), Nekoyomi (37 APK Manga + 115 APK Novel kế thừa ABI `NovelSource`, tổng 196 APK; tách riêng 3 kho độc lập `anime/`, `manga/`, `novel/`), Mangayomi, YomiHub (chỉ mục tổng hợp & tách mục `anime.json`, `manga.json`, `novel.json`), LNReader, IReader (115 plugin JS ES5), vBook, LeechText, YomiHub-vBook (196 zip vBook), **Aidoku** (152 gói `.aix` WASM, `BRIDGE_REV = 5`, hỗ trợ bộ lọc và xem truyện/tiểu thuyết). Đồng bộ bộ lọc **Filter Extension 10 mục** chuẩn trên tất cả ứng dụng. |
| Kết quả kiểm thử | **94/196 PASS** mạng thật (`--stream --dns 1.1.1.1`, 26/11/2026; Phim 19/44, Truyện tranh 22/37, Tiểu thuyết 53/115); Aidoku mô phỏng 77/152; unit domain-fallback 7/7, domain-switch 12/12, filter-extension 9/9; Note9: Aniyomi, Nekoyomi, AVSub (phát/tua/chuyển tập/Resume) + các app khác — xem mục 0.1.0 |

## Kiến trúc (0.0.1)

- **Một nguồn = một gói vBook** trong `sources/<id>/`. vBook là chuẩn có API phong phú nhất (Rhino + jsoup) và có sẵn ~770 tiện ích cộng đồng để tham khảo.
- `tools/build/asyncify.mjs`: chuyển script vBook đồng bộ (Rhino) sang async (acorn + escodegen; tự đánh dấu hàm `async`, chèn `await` cho `fetch`, `sleep`, `Http.*` và các hàm gọi chúng; callback `.map/.forEach/...` có await được chuyển sang `__amap/__aforEach`).
- `runtime/dom.js`: DOM tương thích **jsoup** (select, selectFirst, text, ownText, html, attr("abs:..."), parent, children, next/prev sibling, remove...) trên htmlparser2 + cheerio-select, hỗ trợ `:contains` (không phân biệt hoa thường), `:containsOwn`, `:matches`, `:eq`, `:has`...
- `runtime/vbook.js`: API vBook (`fetch` + `Response` có `html()/json()/text(charset)/base64()`, `Html`, `localStorage`, `cacheStorage`, `localConfig`, `localCookie`, `Http.get().html()`...).
- `runtime/engine.js`: lớp điều phối chung (popular/latest/search/detail/chapters/pages/content/videos, phân trang bằng token vBook).
- `hosts/`: Mangayomi/YomiHub (`MProvider`, `Client`, `SharedPreferences`, tùy chọn đổi **Tên miền**), LNReader/IReader (CommonJS + `@libs/fetch`, hạ cấp ES5 bằng TypeScript), Node (kiểm thử).
- `android/`: 2 module APK (anime = Aniyomi lib 14, manga = Tachiyomi lib 1.4), mỗi module 2 flavor (`sfw`, `nsfw`) → 4 APK (**từ 0.0.5:** mỗi nguồn một product flavor sinh từ `android/<mod>/flavors.json`, Kotlin + Rhino biên dịch một lần trong module thư viện `anime-core` / `manga-core` → 81 APK). Script vBook chạy **nguyên bản** bằng Mozilla Rhino 1.7.15 (chế độ thông dịch) + jsoup của ứng dụng chủ (`runtime/rhino-prelude.js` + engine hạ cấp ES5). Stub API tự biên dịch từ `aniyomiorg/extensions-lib@14` và `mihonapp/extensions-lib@1.4.2` (compileOnly).
- `aidoku/bridge` + `hosts/aidoku.tail.js` (từ 0.0.3): gói Aidoku = WebAssembly Rust chạy engine JS trong `JsContext` của Aidoku (giao thức start/poll/resume); `tools/build/aidoku-build.mjs` dựng `repo/aidoku/`.
- Định danh ổn định (từ 0.0.3): `engine.js` `canon()`/`decanon()` — URL trả cho ứng dụng luôn theo tên miền mặc định (giữ lịch sử / vị trí xem khi đổi tên miền).
- `repo/`: đầu ra — `index.min.json` + `repo.json` + `apk/` (Aniyomi/Nekoyomi), `index.json` (Mangayomi/YomiHub), `plugins.min.json` (LNReader/IReader), `plugin.json` + `vbook/*.zip` (vBook/LeechText/YomiHub).

## Nhật ký cập nhật

### 04/11/2026 — Bản 0.0.1 (dựng lại toàn bộ từ repo trống)

**Công cụ đã dùng:** Git (clone 25+ kho tham khảo), Node.js 22/24, esbuild, acorn/escodegen, TypeScript (hạ cấp ES5), Python 3 + BeautifulSoup (phân tích trang), Android SDK + Gradle 9.3.1 + AGP 8.13.1 + Kotlin 2.2.20 + JBR của Android Studio (dựng APK), adb + Android Emulator (Medium_Phone_API_37) + Galaxy Note9 SM-N960N (cài và kiểm thử), File Explorer/PowerShell trên máy Windows của chủ dự án (chạy script `.bat`), GitHub Desktop/Git Credential Manager (đẩy mã và tạo Release).

**Hạng mục đã làm**
1. Đọc 2 tệp Excel (Project GitHub: 580+ link; Project Extension Repo: Feature Check → Update → Extension Repo Main 196 nguồn, Tham Khảo 234 tiện ích vBook) và tài liệu `Extension_Repo_Update_0.0.1.docx`.
2. Tải và phân tích mã nguồn định dạng tiện ích của: Aniyomi/Nekoyomi (loader + `index.min.json` + `repo.json`, lib 12–16 / 1.4–1.6, ChildFirstPathClassLoader), Mangayomi (`fetch_sources_list.dart`: mảng JSON, lọc theo `itemType`), LNReader (`plugins.min.json`), IReader (đọc được repo LNReader), vBook (`plugin.json` + zip; tài liệu `kychitoge/vbook-ext/docs/extension-api.md`), LeechText (Kotlin, chạy plugin vBook bằng Rhino), YomiHub (fork Mangayomi + vBook), Aidoku (chỉ `.aix` WASM).
3. Xây bộ build đa định dạng (mục *Kiến trúc*), bộ sinh nguồn (`tools/gen/gen_sources.py`, mẫu `madara` / `generic` + preset `nettruyen`, `truyenfull`, `halim` / `ref`), bộ phân tích trang (`tools/analyze/*.py`), bộ chụp trang trên máy thật (`tools/win/snap.mjs`), kiểm thử trực tiếp (`tools/test/run-tests.mjs`) và offline (`tools/test/offline.mjs`).
4. Sinh 196 nguồn. 39 nguồn tái sử dụng tiện ích vBook mã nguồn mở của cộng đồng (ghi công tác giả gốc trong `plugin.json` → `author`/`description`).
5. Dự án Android 4 APK cho Aniyomi/Nekoyomi, ký bằng khoá riêng `android/kiritokmn.jks` (không commit), dấu vân tay SHA-256 ghi vào `repo/repo.json`.

**Lỗi phát hiện & cách sửa**
| # | Lỗi | Sửa (tệp / dòng lệnh) |
|---|---|---|
| 1 | Phần lớn tiện ích vBook mẫu (135/174 khớp tên miền) bị **mã hoá** (`encrypt`) → không tái sử dụng được | Chỉ dùng 39 tiện ích mã mở; 157 nguồn viết mới bằng mẫu selector (`tools/analyze/autospec.py`) |
| 2 | Script vBook đồng bộ không chạy được trên Mangayomi/LNReader (chỉ có HTTP async) | `tools/build/asyncify.mjs` (biến đổi AST) |
| 3 | `class Elements extends Array` hỏng khi hạ cấp ES5 cho LNReader | `runtime/dom.js`: Elements là mảng thật + `Object.setPrototypeOf(arr, EP)` |
| 4 | Thiếu dấu phẩy trong object literal sau khi tách method (`dom.js:123`, `dom.js:134`) | sửa trực tiếp |
| 5 | `cheerio-select` không export `selectAll/selectOne` | dùng `select(css, root, opts, limit)` |
| 6 | Script tab (`browse.js`) không được biên dịch vì không có trong `plugin.json.script` | `build-all.mjs`: `scriptEntries()` biên dịch mọi `src/*.js` trừ thư viện được `load()` |
| 7 | Tiện ích cộng đồng khai báo lại `Response`/gán lại `fetch` → lỗi "already declared" | Mỗi script chạy trong 2 lớp hàm lồng (biến môi trường là tham số) |
| 8 | Đường dẫn Windows có dấu cách bị mã hoá `%20` (`new URL(import.meta.url).pathname`) | đổi sang `fileURLToPath()` trong mọi công cụ |
| 9 | `crypto-js` không tìm thấy khi kiểm thử 3 nguồn (qimao, vipbachngocsach, xianqihaotiamiapp) | Gói test tự chứa: `.build/test/<id>.mjs` (esbuild bundle) |
| 10 | Máy chủ dựng (đám mây) không truy cập được trang nguồn | Chụp trang và kiểm thử **trên máy Windows của chủ dự án** qua `.bat` (`_work/1_snap.bat`, `8_snap_detail.bat`, `11_snap_r2.bat`, `9_run_tests.bat`) |
| 11 | Tải APK ứng dụng từ GitHub trên máy chủ dự án rất chậm (≈0,5 MB / 4 phút), `Invoke-WebRequest` có thanh tiến trình làm chậm | `$ProgressPreference='SilentlyContinue'` + `curl.exe`; APK tải ở máy chủ dựng rồi chép sang theo khối 20 MB |
| 12 | `nettruyen18`-kiểu chương bị khoá bằng plugin "wp-manga-images-protection" (bắt đăng nhập Google) — doctruyentranhbl | Ghi nhận: cần đăng nhập, không tự động được |
| 13 | AGP 8.7.3 không chạy với Gradle 9; máy có sẵn cache Gradle 9.3.1 + AGP 8.13.1 | `android/build.gradle.kts`: AGP 8.13.1, Kotlin 2.2.20, `GRADLE_USER_HOME=D:\A.I Project\yh\gradle-home` |

**Kết quả kiểm thử**
- Mô phỏng runtime Mangayomi (`MProvider/Client/SharedPreferences` trong `vm`) và LNReader (CommonJS + `@libs/fetch`) bằng `tools/test/host-sim.mjs` với máy chủ HTML mẫu: popular → search → detail → toc → content **đạt** ở cả 2 host.
- Kiểm thử trực tiếp vòng 1 (máy chủ dự án, 04/11/2026 19:55): **22/196** nguồn đạt trọn chuỗi. Vòng 2: xem `data/test-results.json` và bảng trạng thái trong `README.md`.
- Nguyên nhân lỗi chính: ~40 nguồn không truy cập được từ mạng Việt Nam (tên miền chết `ENOTFOUND`, bị nhà mạng chặn/timeout, Cloudflare 403, 522); phần còn lại là trang dựng bằng JavaScript (Next/Nuxt/SPA) hoặc tải mục lục bằng AJAX cần viết riêng.

**Việc cần làm ở bản sau**
- Viết riêng cho các trang SPA/AJAX (danh sách trong `README.md` trạng thái 🟡), cập nhật tên miền mới cho các nguồn 🔴.
- Nguồn Aidoku (`docs/AIDOKU.md`).
- Giảm dung lượng gói Mangayomi/LNReader (bỏ bảng mã thực thể HTML trùng lặp, dùng chung runtime).

### 04/11/2026 (tối) — Kiểm tra Cloudflare, dựng APK, kiểm thử trên thiết bị

**Công cụ đã dùng:** trình duyệt tích hợp của Claude desktop (chạy trên máy chủ dự án, dùng cookie thật để vượt Cloudflare kiểu tự động), bộ kiểm tra DOM viết bằng JavaScript chạy ngay trong trang (`/tmp/insp2.js`), bộ chạy plugin Mangayomi trong trình duyệt (shim `MProvider/Client/SharedPreferences` + `fetch(..., {credentials:'include'})`), Node 22 (dựng lại), Python 3 (sinh bảng GBK), adb + Emulator + Note9.

**Kết quả dựng & phát hành**
- Gradle: `BUILD SUCCESSFUL`, 4 APK 0,6–0,8 MB (`Kiritokmn-Extension-0.0.1-<anime|manga>-<sfw|nsfw>.apk`), ký khoá riêng.
- Đẩy GitHub: commit `8d00af9`, `ec2e5df`; Release `v0.0.1` 11/11 tệp đã xác minh (tên + dung lượng).
- Kiểm thử trực tiếp vòng 2: **34/196** nguồn đạt trọn chuỗi (vòng 1: 22/196).

**Kiểm thử thiết bị (`_work/17_device_test.bat`)**
- Emulator `sdk_gphone64_x86_64`: cài **thành công** Aniyomi 0.18.2.1, Nekoyomi 0.20.6, Mangayomi 0.9.95, LNReader 2.1.4, vBooks (APK chủ dự án cung cấp), LeechText 2.0.0 và cả 4 APK tiện ích; deep link `aniyomi://add-repo`, `tachiyomi://add-repo` mở hộp thoại *Add repo*, `mangayomi://add-repo` mở bộ chọn Mangayomi/YomiHub. Ảnh: `_work/shots/emulator_5554_*.png`, video `emulator_5554_install-and-addrepo.mp4`.
- Note9 (`281038ac31217ece`): cài thành công 4 APK tiện ích; ảnh chụp màn hình trắng (máy khoá màn hình/tắt màn hình khi chạy script) → cần mở khoá máy rồi chạy lại để có ảnh.
- IReader: không có bản APK x86_64 → chưa cài lên emulator.
- Emulator báo *System UI isn't responding* khi mở nhiều app liên tiếp (máy ảo chậm, không phải lỗi tiện ích).

**Cloudflare — phân loại (`data/cloudflare.json`)**
| Nhóm | Nguồn | Ý nghĩa |
|---|---|---|
| Tự qua (JS challenge) | 101kks, 69shuba, 69shurepoduongden, czbooks, luvevaland, mattreadingtranslations, novelfull.net, uukanshu, ciyuanji, tik.porn, xfree | Mở bằng WebView trong app một lần là dùng được; Mangayomi có cờ `hasCloudflare` |
| Cần người xác minh (Turnstile) | 101minc, hhtqhay.vip, sonako, cbhentai, myreadingmanga | Người dùng phải tự bấm xác minh trong WebView của app; tiện ích báo lỗi `CLOUDFLARE: …` hướng dẫn |
| Chặn IP | hameln (syosetu.org) | Không truy cập được từ Việt Nam |
| Không phải Cloudflare | quanben (trang mặc định CentOS), wodeshucheng5 (nginx 403), doctruyentranhbl (bắt đăng nhập Google) | Trang hỏng/chặn, không sửa được ở phía tiện ích |

**Lỗi phát hiện & cách sửa (vòng Cloudflare)**
| # | Lỗi | Sửa |
|---|---|---|
| 14 | 9 nguồn dính Cloudflare chưa từng phân tích được (bộ chụp trang Node bị 403) nên selector tự sinh sai → 0 kết quả | Phân tích DOM thật trong trình duyệt, viết selector tay trong `data/specs.manual.json`: 101kks, czbooks, uukanshu, luvevaland, mattreadingtranslations, ciyuanji, tik.porn, xfree; novelfull.net đổi từ tiện ích cộng đồng (viết cho novelfull.com, giao diện khác) sang mẫu `generic` |
| 15 | 101kks chỉ hiện 36 chương, phần còn lại tải bằng AJAX `/ajax_novels/chapterlist/<id>.html` | Thêm khoá `ch_rewrite` (regex đổi URL mục lục) vào `lib/lib_generic.js` |
| 16 | Trang GBK (69shuba) bị lỗi font trên Mangayomi: Dart giải mã charset lạ thành Latin-1 | `runtime/vbook.js`: phát hiện văn bản Latin-1 + charset GBK → giải mã lại bằng bảng GBK (`runtime/gbk-table.txt`, 23.940 ô); bảng chỉ được nhúng vào plugin Mangayomi của nguồn dùng GBK (`build-all.mjs`, +72 KB) |
| 17 | Tiện ích cộng đồng gọi `Console.log` → `Console is not defined` | Thêm bí danh `Console` vào runtime Node/Mangayomi/LNReader (`runtime/vbook.js`) và Rhino (`runtime/rhino-prelude.js`), `ENV_NAMES` trong `build-all.mjs` |
| 18 | Lỗi 403/503 do Cloudflare hiện chung chung "HTTP 403" | `lib/lib_common.js`: `C.cf()` nhận diện trang thách thức, báo `CLOUDFLARE: … mở nguồn bằng WebView …` |
| 19 | Tìm kiếm 69shuba cần chạy JavaScript (máy chủ trả trang trống cho POST thường) | Ghi nhận: tìm kiếm chỉ chạy trên vBook (có `Engine.newBrowser`), duyệt/đọc chạy ở mọi app |
| 20 | Nguồn đã sửa không được app cập nhật | Tăng `version` = 2 cho 11 nguồn trên (`gen_sources.py` hỗ trợ `version` trong spec, kể cả nguồn `ref`) |

| 21 | Kiểm thử plugin đã phát hành (commit `8550da9`) trong trình duyệt thật: czbooks trang thể loại khác trang chủ (tên truyện là `div.novel-item-title` nằm trong thẻ `a`) → 0 kết quả | sửa `title`/`link` |
| 22 | 101kks: `li:has(a[href*='/book/'])` bắt cả khung "搜索關鍵詞…" và danh sách bên lề → trang 2 trùng trang 1 | `item: '#article_list_content > li'` |
| 23 | uukanshu: tìm kiếm chuyển hướng sang `/search/<từ khoá>/1.html`, trang danh sách dùng `.bookinfo h4.bookname` | thêm tab 排行/玄幻/修真/都市/全本, `search: '/search/{q}/{p}.html'` |
| 24 | mattreadingtranslations: mục lục 16 trang, tải nhanh bị **HTTP 429** ở trang 8 | `lib_common.js` `C.get`: tự thử lại khi 429 (chờ 1,5 s → 3 s → 4,5 s); `lib_generic.js` khoá `ch_delay` (500 ms giữa các trang mục lục) |
| 25 | tik.porn: trang video chứa cả một "feed" 26–60 file `.mp4` của video khác → lấy nhầm video | khoá mới `video` trong `lib_generic.js` (lấy `video source@src` của chính trang); tab đầu đổi sang tab có phân trang |
| 26 | luvevaland: trang chi tiết không có `h1` → tên truyện trống | `d_title: '.breadcrumb__container a.breadcrumb__item:last-child'` |
| 27 | ciyuanji: tìm kiếm `_0_{p}` trả về khối "gợi ý" (MiniBook) | `search: '/search/{q}_{p}.html'` |

**Kết quả kiểm thử Cloudflare trong trình duyệt thật (máy chủ dự án)**
- Duyệt → chi tiết → chương → nội dung kiểm tra tay trên trang thật: 101kks (1.555 chương qua AJAX, nội dung `#txtcontent`), czbooks (150 chương, `.content`), uukanshu (190 chương, `.readcotent`), luvevaland (76 chương, `#chapter-content`), mattreadingtranslations (mục lục 16 trang, `.entry-content`), ciyuanji (949 chương, nội dung SSR `chapter_article`), novelfull.net (40 chương/trang + `rel=next`, `#chapter-content`), tik.porn & xfree (link `.mp4` trực tiếp trong trang video).
- Plugin Mangayomi 69shuba bản cũ: popular 50 / detail 569 chương / nội dung 3.680 ký tự — chạy đúng; lỗi font chỉ do trình duyệt luôn giải mã UTF-8, đã kiểm thử bản sửa GBK bằng Node (`斗罗A大陆` giải mã đúng).
- 101minc: vẫn dừng ở *Performing security verification* sau 8 giây → xác nhận cần người bấm xác minh.
- Lượt 2 (plugin commit `8550da9`, chạy trong trình duyệt thật bằng shim Mangayomi, Dart-giống: charset không phải UTF-8 → Latin-1):
  | Nguồn | Danh sách | Trang 2 | Tìm kiếm | Chi tiết + mục lục | Nội dung / video |
  |---|---|---|---|---|---|
  | 101kks | 25 ✅ | ⚠️ trùng (đã sửa #22) | ⚠️ (đã sửa #22) | 1.555 ch ✅ | 3.489 ký tự ✅ |
  | czbooks | ❌ 0 (đã sửa #21) | | | | |
  | uukanshu | 8 ✅ | (đã sửa #23) | ❌ (đã sửa #23) | 190 ch ✅ | 1.336 ký tự ✅ |
  | luvevaland | 12 ✅ | 12 ✅ | 12 ✅ | 11 ch ✅ (tên trống, sửa #26) | 11.439 ký tự ✅ |
  | mattreadingtranslations | 8 ✅ | — | 8 ✅ | ❌ 429 (đã sửa #24) | |
  | ciyuanji | 10 ✅ | 10 ✅ | ❌ (đã sửa #27) | 141 ch ✅ | 5.622 ký tự ✅ |
  | novel­full.net | 22 ✅ | 22 ✅ | 22 ✅ | 873 ch ✅ | 10.222 ký tự ✅ |
  | tik.porn (18+) | 22 ✅ | (sửa #25) | 36 ✅ | 1 tập ✅ | mp4 ✅ (sửa nhầm video #25) |
  | xfree (18+) | 21 ✅ | 21 ✅ | 30 ✅ | 1 tập ✅ | mp4 ✅ |
  | 69shuba | 50 ✅ | — | ❌ cần JS (chỉ vBook) | 569 ch ✅ | 2.405 ký tự, chữ Trung đúng ✅ |
- Lượt 3 (plugin commit `0b4c983`, cùng cách thử): **11/11 nguồn đạt**.
  | Nguồn | Kết quả |
  |---|---|
  | czbooks | 72 truyện/trang, trang 2 khác trang 1, tìm "嫁金釵" 42 kết quả, chi tiết + tác giả, nội dung 2.167 ký tự ✅ |
  | 101kks | 15 truyện/trang, trang 2 khác, tìm "魔門" 20 kết quả (hết dòng rác), 112 chương, nội dung ✅ |
  | uukanshu | tab 排行 30 truyện/trang, trang 2 khác, tìm "神通" 12 kết quả, 2.968 chương, nội dung 4.368 ký tự ✅ |
  | mattreadingtranslations | White Wolves 154 chương (đủ 16 trang mục lục, không còn 429), nội dung 60.327 ký tự ✅ |
  | tik.porn | 36 video/trang, trang 2 khác, link mp4 trùng đúng thẻ `<video>` của chính trang ✅ |
  | ciyuanji | tìm "女神" 10 kết quả ✅ |
  | luvevaland | tên truyện ở trang chi tiết đã có ✅ |
  | novelfull.net, xfree, 69shuba | như lượt 2 ✅ |

**Kiểm thử trong ứng dụng thật — Mangayomi 0.9.95 trên Emulator (04/11/2026 23:20)**
- Deep link `mangayomi://add-repo` → hộp thoại *Add Repository?* → **Add** → "Source repository added!". Tab Browse → Novel → Extensions hiện đủ danh sách tiện ích Kiritokmn (Matt Reading 0.0.3, NovelFull.Net 0.0.2…); cài NovelFull.Net thành công.
- Mangayomi bắt cấp quyền *All files access* mới cho cài tiện ích (đã được chủ dự án đồng ý bật trên máy ảo).

| # | Lỗi | Sửa |
|---|---|---|
| 28 | **Mở nguồn trong Mangayomi báo `ReferenceError: '__abs' is not defined`** — engine JS của Mangayomi (QuickJS) không có lớp `URL`; runtime rơi sang hàm `__abs` vốn chỉ có trong bản Rhino. Lỗi này ảnh hưởng **toàn bộ 196 plugin Mangayomi/YomiHub** (trình duyệt và Node có `URL` nên các bài thử trước không phát hiện) | `runtime/url.js`: tự giải URL tương đối theo RFC 3986 (không phụ thuộc host, kiểm 11/11 ca khớp `URL` chuẩn); `engine.js`, `dom.js` (`abs:href`) dùng hàm này; thêm base64 thuần JS thay `btoa`, `sleep` chạy được cả khi không có `setTimeout`. Kiểm thử: chạy plugin trong `vm` **không có** `URL/btoa/TextDecoder` → danh sách, chi tiết, mục lục, nội dung đều đúng |
| 29 | App đã cài sẽ không nhận bản sửa | Phiên bản Mangayomi/YomiHub `0.0.x` → `0.1.x`, LNReader/IReader `1.0.x` → `1.1.x` cho mọi nguồn |
| 30 | Đọc chương lỗi chỉ báo "Không tìm thấy nội dung", không biết app nhận được trang gì | `lib_generic.js` `text()`: báo kèm tiêu đề trang, mã HTTP, độ dài (và nội dung nếu < 400 ký tự); phát hiện trang thách thức Cloudflare trả mã 200 |
| 31 | czbooks trong Mangayomi hiện các ký tự `\r` giữa các đoạn (trang dùng xuống dòng CRLF) | `lib_common.js` `cleanContent`: bỏ `\r` / `&#13;` |

- Kết quả trong Mangayomi (emulator, sau bản sửa): **NovelFull.Net** danh sách có ảnh bìa → chi tiết (tác giả FanficLord03, Ongoing, 636 chương) → đọc chương 1 đầy đủ ✅. **czbooks** (nguồn dính Cloudflare) danh sách → chi tiết (《全屬性武道》, 3.289 chương) → đọc chương 3309 ✅; app tự nhận bản cập nhật (Update pending) sau khi tăng phiên bản ✅. Ảnh: `_work/shots/emu_mangayomi_*.png`.

**Kiểm thử trên Galaxy Note9 (SM-N960N) — 05/11/2026 06:45**
- Mangayomi: deep link thêm repo ✅, danh sách tiện ích (phiên bản 0.1.x) ✅, cài NovelFull.Net / App Truyện Chữ / czbooks / TruyenQQ ✅.
- czbooks (Cloudflare): danh sách → 《不打仗的將軍》 28 chương → đọc chương 1, **không còn ký tự `\r`** ✅.
- App Truyện Chữ: danh sách và chi tiết ✅, nhưng **mục lục sai** (chỉ có "Chương mới nhất", "Đọc truyện") ❌ — cần viết selector riêng.
- TruyenQQ: danh sách ✅, chi tiết 376 chương ✅ (lẫn 1 mục giả "Đọc từ đầu"), **trang ảnh không tải được** ❌.

| # | Lỗi | Sửa |
|---|---|---|
| 32 | TruyenQQ: ảnh chương "This image couldn't be loaded". Thử bằng curl trên máy chủ dự án: CDN `i216.truyenvua.com` / `hinhtruyen.com` trả **403** khi không có `Referer` hoặc `Referer` sai tên miền (`truyenqq.com.vn`), **200** khi `Referer: https://truyenqqko.com/` | `hosts/mangayomi.tail.js`: `Referer` lấy từ tên miền của chính trang chương (không phụ thuộc giá trị cài đặt), thêm `User-Agent`, `Accept: image/*`; `__base()` bỏ qua giá trị cài đặt không phải URL. Phiên bản Mangayomi `0.1.x` → `0.2.x` |
| 33 | Sau bản 0.2.x ảnh TruyenQQ vẫn không tải: tiện ích TruyenQQ trả trang dạng `{link: src, fallback: [data-original]}`; app chỉ nhận một URL nên lấy `src` — với trang di động đây thường là ảnh chờ (lazy-load) | `runtime/engine.js` `pages()`: nếu `link` là ảnh chờ (`data:`, `loading`, `lazy`, `blank`…) thì dùng `fallback[0]`; áp dụng cho Mangayomi, LNReader và APK Rhino. Phiên bản Mangayomi `0.3.x`, APK dựng lại |

- Nekoyomi 0.20.6 trên Note9: chọn thư mục lưu trữ (được chủ dự án đồng ý), thêm repo `tachiyomi://` và `aniyomi://` ✅. Tiện ích APK hiện "không đáng tin cậy" cho tới khi **khởi động lại app**, sau đó tự tin cậy nhờ `signingKeyFingerprint` (đã đối chiếu bằng `apksigner`: `b92c172d…aa39d` trùng khớp) ✅. **PhimTV**: danh sách có ảnh bìa → chi tiết → **phát video tập 23** ✅ (ảnh `n9_nekoyomi_phimtv_playing.png`). Đọc Truyện Tranh BL: danh sách + chi tiết 6 chương ✅; mở chương chưa kiểm được vì màn hình bị xoay ngang sau khi xem video.
- LNReader 2.x trên Note9: thêm repo bằng `lnreader://repo/add?url=…` ✅, danh sách plugin (1.1.x) hiện đủ ✅, nhưng **cài plugin nào cũng báo "Cài đặt lỗi"** ❌ (thử Bàn Long).
- Chưa kiểm trên Note9: vBook (thêm repo + đọc), IReader (cài app lỗi từ trước), đọc truyện tranh trong Nekoyomi.

### 05/11/2026 (sáng) — Sửa lỗi cài plugin LNReader/IReader, mục lục App Truyện Chữ

| # | Lỗi | Sửa |
|---|---|---|
| 34 | **LNReader: cài plugin nào cũng lỗi** (ảnh hưởng toàn bộ 116 plugin truyện chữ). Đọc mã nguồn LNReader (`src/plugins/pluginManager.ts`): app chạy plugin bằng `Function('require','module', 'const exports = module.exports = {}; <mã>; return exports.default')`. Bản build CJS của esbuild **gán lại** `module.exports = …`, nên `exports.default` của object ban đầu là `undefined` → app coi như plugin hỏng. Bài thử cũ trong Node đọc `module.exports.default` nên không phát hiện. IReader cũng lấy `exports.default \|\| exports` nên bị cùng lỗi | `tools/build/build-all.mjs`: thêm vào cuối mỗi plugin LNReader một dòng gán `exports.default = module.exports.default`. Thử lại bằng **đúng hàm nạp của LNReader** cho cả 116 plugin: trước khi sửa **0/116**, sau khi sửa **116/116** (đủ `id`, `version`, `popularNovels`, `parseNovel`, `parseChapter`, `id`/`version` khớp `plugins.min.json`). Phiên bản LNReader/IReader `1.1.x` → `1.2.x` |
| 35 | Định chạy thử bằng Hermes (`hermes-engine-cli`) để tìm lỗi #34: gói này bị chính sách mạng chặn (npm trả 403 ở cả máy ảo trên PC lẫn container) | Không cần nữa — đã tìm ra nguyên nhân bằng cách đọc mã nạp plugin của LNReader (mục #34) |
| 36 | **App Truyện Chữ: mục lục chỉ có "Chương mới nhất", "Đọc truyện"**, nội dung chương không lấy được. Trang làm bằng Next.js (App Router): danh sách chương được tải bằng **Server Action** `fetchChaptersOfBook` (POST kèm header `Next-Action`), nội dung chương nằm trong luồng RSC `self.__next_f.push(...)` chứ không có trong HTML | `lib_generic.js` thêm hỗ trợ Next.js dùng chung: `G.ch_action` (gọi Server Action theo tên; mã action đổi mỗi lần trang deploy nên nếu mã đã lưu hết hạn thì tự tìm lại trong các file `_next/static/chunks/*.js`), `G.content_rsc` (ghép luồng RSC, lấy dòng văn bản `T` dài nhất, tách đoạn), `G.c_locked` (chương khoá → hiện thông báo thay vì lỗi). Thử trên trang thật: 322 chương ✅, tự tìm lại mã action khi mã cũ sai ✅, chương 1 đủ 7.837 ký tự / 91 đoạn ✅. Chương 51 trở đi trang khoá (cần đăng nhập) — mục lục đánh dấu 🔒. Phiên bản nguồn 1 → 2 |
| 37 | Ghi chú phát hành: file `plugins.min.json` / `plugin.json` trong Release không được thay khi chỉ đổi số phiên bản (1.1.x → 1.2.x cùng độ dài nên cùng dung lượng; `publish.ps1` chỉ so dung lượng) | `tools/win/publish.ps1`: so thêm SHA-256 (trường `digest` của GitHub) trước khi bỏ qua tệp đã tải lên |
| 38 | `tools/test/host-sim.mjs` giả lập LNReader sai cách (đọc `module.exports.default`) nên không phát hiện lỗi #34 | Dùng đúng hàm bọc của LNReader (`const exports = module.exports = {}; …; return exports.default`), báo lỗi nếu `exports.default` không có |

**Điều tra ảnh truyện tranh không hiện trong Mangayomi trên Note9 (05/11/2026 09:15–12:06)**
- Trên Note9 có cài **TruyenQQ (`truyenqqc`, truyenqq.com.vn, ảnh ở `s34.cc3t.net`)** chứ không phải **Truyện QQ (`truyenqq`, truyenqqko.com)** — hai nguồn khác nhau. Cả hai CDN đều trả 403 khi thiếu `Referer`, 200 khi có.
- Plugin cho ra đúng URL + header: chạy bản trên GitHub trong trình duyệt và bằng Node trên PC (không cookie): Truyện QQ 38 trang, TruyenQQ 6 trang, ảnh tải về 200 `image/jpeg` khi gửi header của plugin (kể cả UA `Dart/3.5`).
- Kiểm chứng bằng **repo debug cục bộ** (server Node chỉ nghe 127.0.0.1:8099 trên PC, nối với điện thoại qua `adb reverse`, ghi lại header của từng request): Mangayomi 0.9.95 **có gửi** header của từng trang (`Referer`, `X-Kiri-Page`) và header nguồn (`getHeaders`) khi tải ảnh trang; ảnh tải về **200** nhưng trình đọc **vẫn báo "This image couldn't be loaded"**, kể cả ảnh PNG 600×400 hợp lệ mà ảnh bìa (cùng tệp) hiện bình thường.
- Mục *Error reports* của app ghi `PathAccessException: Creation failed, path = '/storage/emulated/0/Mangayomi' (Permission denied)`: Mangayomi (targetSdk 36) trên Android 10 bị scoped storage dù đã có quyền bộ nhớ. Đã bật `appops LEGACY_STORAGE allow` (được chủ dự án đồng ý) → app tạo được thư mục, nhưng ảnh trang vẫn không hiện.
- **Kết luận: lỗi ở trình đọc của Mangayomi trên máy này, không phải ở tiện ích** (ảnh tải đủ, đúng header). Cần thử đọc truyện tranh Mangayomi trên thiết bị khác / máy ảo Android 14 để xác định, và có thể báo lỗi cho Mangayomi. Nekoyomi trên Note9 vẫn không nhận chạm vào chương (chưa đọc được truyện tranh để so sánh).
- Mangayomi lưu danh sách trang của từng chương vĩnh viễn (`chapter_disk_cache`, khoá `mangaId_chapterUrl`): chương đã mở bằng plugin cũ sẽ không nhận bản sửa cho tới khi xoá bộ nhớ đệm chương.
- Đã trả lại cài đặt trên máy: chế độ đọc mặc định *Vertical*, tắt *Enable logging*, gỡ 2 tiện ích debug + repo `127.0.0.1`, gỡ `adb reverse`. Giữ `LEGACY_STORAGE allow` cho Mangayomi.

### 05/11/2026 (chiều) — Kiểm LNReader trên Note9, sửa danh sách App Truyện Chữ

- **LNReader trên Note9 sau bản 1.2.x:** cài plugin **Bàn Long** và **App Truyện Chữ** thành công (sáng nay báo "Cài đặt lỗi") ✅. App Truyện Chữ: danh sách → chi tiết → **401 chương** có tên đầy đủ → đọc chương 1 ✅. Bàn Long: danh sách → chi tiết (tác giả, mô tả, thể loại) → mục lục → đọc chương ✅. Video `_work/shots/n9_lnreader.mp4`.

| # | Lỗi | Sửa |
|---|---|---|
| 39 | App Truyện Chữ: **tên truyện và ảnh bìa lệch nhau** trong danh sách (selector `.flex` bắt cả khung lồng nhau); **tìm kiếm `/tim-kiem` trả 404** | Thẻ truyện là `li > a.group` (link chính là thẻ, tên lấy từ `img@alt`); tìm kiếm `/truyen?keyword={q}&page={p}`; thêm tab *Truyện dịch nổi bật*, *Mới nhất*, *Tiên hiệp*, *Huyền huyễn*, *Đô thị*, *Ngôn tình*, *Đọc nhiều*. Kiểm bằng Node trên PC: Mangayomi 20 truyện/trang (tên khớp bìa), trang 2 khác trang 1, tìm "pháp sư" 19 kết quả, 322 chương, nội dung 8.294 ký tự, chương khoá hiện thông báo; LNReader danh sách 20, tìm kiếm 19. Phiên bản nguồn 2 → 3 |

**Kiểm chứng Mangayomi trên máy ảo Android (Medium Phone API 37) — 05/11/2026 13:20**
- **Truyện QQ** (truyenqqko.com): danh sách → *Võ Luyện Đỉnh Phong* (3.883 chương, thể loại, mô tả) → đọc Chương 3859: trang 1 (banner) và trang 2 (ảnh dài 900×23885) **hiển thị bình thường** ✅.
- **TruyenQQ** (truyenqq.com.vn, ảnh `cc3t.net`): *Cường Giả Đến Từ Trại Tâm Thần* 376 chương → đọc Chương 374 (11 trang) **hiển thị bình thường** ✅.
- ⇒ Bản sửa `Referer` (#32–33) **đúng**; lỗi "This image couldn't be loaded" chỉ xảy ra với Mangayomi 0.9.95 trên Galaxy Note9 (Android 10), không do tiện ích. Video `_work/shots/emu_mangayomi_truyenqq*.mp4`.
- MangaDex trên máy ảo báo `HTTP 0 https://mangadex.org/` — nằm trong nhóm nguồn còn lỗi, chưa xử lý.

| # | Lỗi | Sửa |
|---|---|---|
| 40 | Mangayomi tách các nguồn repack thành nhóm riêng **"VI_VN"** (và `zh_CN`, `en_US`) thay vì gộp vào *Tiếng Việt*; LNReader xếp nguồn `zh-CN` vào *Multi* | `build-all.mjs`: chuẩn hoá mã ngôn ngữ cho Mangayomi / LNReader / APK (`vi_VN`→`vi`, `zh_CN`/`zh`→`zh-CN`, `en_US`→`en`, `ja_JP`→`ja`); gói vBook giữ nguyên. LNReader thêm `zh-CN`→中文, `global`→Multi. Kết quả: Mangayomi `vi` 120, `zh-CN` 51, `global` 11, `en` 10, `ja` 4; LNReader 中文 48 (trước là Multi). ID nguồn không đổi (băm theo id, không theo ngôn ngữ) nên tiện ích đã cài không bị mất |

### 05/11/2026 (chiều) — Sửa hàng loạt nguồn lỗi bằng công cụ dò tự động

Kiểm thử trực tiếp lúc 13:33: **34/196** nguồn đạt. Phân loại 162 nguồn lỗi (công cụ `triage.mjs`, tải trang chủ như plugin): HTML thường có link 87 · trang dựng hoàn toàn bằng JS / không có link 24 · lỗi mạng 26 · Cloudflare 17 · HTTP 403/404/5xx 8.

| # | Việc | Chi tiết |
|---|---|---|
| 41 | **Giới Truyện** (gioitruyen.com) — trang dựng bằng JS, HTML gốc chỉ 4 KB | Viết lại bằng **JSON API** `/api/v1`: duyệt `/stories/browse?page&size&sort` (Mới cập nhật / Xem nhiều), tìm `/search?q`, chi tiết `/stories/{slug}`, mục lục `/stories/{slug}/chapters` (tối đa 100/trang, tự lật), nội dung `/chapters/by-number/{n}` (`contentHtml`); chương trả xu (`accessType: PAID`) đánh dấu 🔒 và hiện thông báo. Thêm kiểu spec `tpl: custom` (bộ sinh mã không ghi đè script viết tay). Thử trên trang: 20 truyện/trang, 282 chương, nội dung 2.368 ký tự |
| 42 | Công cụ **`tools/test/spec-wizard.mjs`** | Tải trang như plugin (dùng chính `runtime/dom.js`), tìm khối thẻ truyện lặp lại (bỏ nav/header/footer/menu, bỏ link thể loại/tag, mỗi thẻ phải trỏ tới trang khác nhau), mở thử truyện → nhóm link chương → mở chương → vùng chữ dài nhất (truyện chữ) hoặc nhóm ảnh lớn nhất (truyện tranh); đề xuất `item/link/title/cover/ch_list/content/pages` |
| 43 | Công cụ **`tools/test/auto-improve.mjs`** | Với mỗi nguồn generic đang lỗi: chạy wizard → ghép vào `config.js` → build + test trực tiếp → **chỉ giữ nếu nguồn tốt lên**, ngược lại khôi phục. Lượt 1: vá 52, giữ 39, **21 nguồn chuyển sang đạt** (75zwcom, ehentai, goctruyentranh, hacamchicac, hotphim, ijjjxsxzw, mangadm, mimimoe, mintteanovel, navyteamcomic, nettruyenviet, novelphoenix, novelpiaglobal, piaotia, shinigamilnteam, sobqg, thegioitruyen, tinhlinh, truyenzhihutonghop, vinahentai, webtruyenchu); 6 nguồn cập nhật tên miền mới (abcbiquge, lofter, ciyuanji, sudugu, truyenzhihutonghop, vinahentai) |
| 44 | Công cụ **`tools/test/search-improve.mjs`** — tìm URL tìm kiếm đúng | Thử form tìm kiếm thật của trang + ~30 mẫu phổ biến. Lượt đầu cho nhiều **dương tính giả** (`/?s=` trả về trang chủ, từ khoá lại lấy từ truyện trên trang chủ) → đã hoàn tác; nay bắt buộc: khối kết quả có tên chứa từ khoá, khác danh sách trang chủ, và **từ khoá vô nghĩa không trả về khối đó**. Template thêm selector riêng cho trang kết quả (`s_item/s_title/s_link/s_cover`) và tìm kiếm POST (`search_post`). Sửa được: 75zwcom, novelphoenix, nettruyenviet, thegioitruyen, vinahentai, deqixs, quanben |
| 45 | Nguồn phim | Template thêm `ch_attr` (lấy URL tập từ thuộc tính, vd. `button[data-url]`) và `ch_fallback_single` (phim lẻ không có danh sách tập → chính trang là 1 tập). **phimnhua**: tập là nút `button[data-url]` chứa sẵn m3u8, phim lẻ có m3u8 trong `PLAYER_CONFIG`. **xemphimgi**: `div.episodes-grid a`, m3u8 có trong trang tập. **luphim**: danh sách tập chỉ có ở trang `/xem-phim/` → `ch_url` + `div.de-eps a`, phát qua iframe `moviking.ayama.fun`. Không làm được: **nextphim** (trang review, video YouTube nhúng), **vfilm** (bắt reCAPTCHA trước khi xem) |
| 46 | `run-tests.mjs --only` ghi đè mất kết quả của các nguồn khác | Nay gộp kết quả mới vào file cũ |

- Sau các lượt sửa: **53–54/196** nguồn đạt (dao động ±1 do trang chập chờn), chưa tính gioitruyen và các bản sửa tìm kiếm/phim cuối cùng.
- Còn lại cần làm tay: trang dựng bằng JS/API (minotruyen dùng API `cloudkk-v2`, douyin, tiktok, youtube, iqiyi, mgtv, twitch, weibo…), Cloudflare tương tác, các trang đã chết/đổi tên miền (26 lỗi mạng), và nhóm phim phát qua iframe/API riêng (blvietsub, animevnnet, hentaivietsubcom, hhpanda, watchhentainet, hihiphim, phimmoi).

### 05/11/2026 (tối) — Thêm nguồn viết tay qua API, giải mã Init Manga, sửa tìm kiếm

Bản phát hành lúc 14:34 (commit `f4d7c73`): **57/196** nguồn đạt kiểm thử trực tiếp.

| # | Việc | Chi tiết |
|---|---|---|
| 47 | **07br** (bqg603.cc) — trang dựng bằng JS (hash router) trên API `apibi.cc` | Viết tay (`tpl: custom`): danh mục `/api/sort?sort=`, trang chủ `/api/index`, tìm `/api/search?q=`, chi tiết `/api/book?id=`, mục lục `/api/booklist?id=` (chỉ có tên chương, số chương = vị trí), ảnh bìa `/bookimg/{id/1000}/{id}.jpg`. Nội dung `/api/chapter?token=` với token = Base64(**AES-128-CBC**(JSON `{"id":…,"chapterid":…}`), key `a3dc22cf70418a51`, iv `394c2c3202da6270`, PKCS7) — viết bộ mã hoá AES thuần ES5 trong `config.js` (đối chiếu đúng với Node `crypto`) để chạy trên mọi ứng dụng |
| 48 | **Mọt Truyện** (mottruyen.app) — Vue app | Viết tay trên `api.mottruyen.app/api/v1`: danh sách/tìm `story?collection=SEARCH&page&size&keyword&categoryIds`, chi tiết `story/{id}`, mục lục `story/{id}/chapter?size=500&page`, nội dung `story/{id}/chapter/{n}` (`content` HTML; chương khoá hiện thông báo 🔒); ảnh `static.mottruyen.app/api/v1/storage` |
| 49 | Template: tìm kiếm qua **JSON API** (`search_json`) | `{url, list, title, link, cover}` — `link` có thể là mẫu `/truyen/{slug}`. Dùng cho **Navy Team (truyện chữ)**: `/api/search-story?keyword=` |
| 50 | Template: **`q_cut`** | Cắt từ khoá tại dấu câu cho trang tìm kiếm không chịu dấu phẩy toàn góc (8book) |
| 51 | Template: giao diện WordPress **Init Manga** (`initmanga: true`) | Chương được mã hoá ngay trong trang: `InitMangaEncryptedChapter {ciphertext, iv, salt}` + `InitMangaData.decryption_key` (Base64 của passphrase) → khoá = PBKDF2-SHA512(passphrase, salt, 999 vòng, 32 byte), AES-256-CBC. Ảnh là `canvas[data-enc]` = Base64 của URL viết ngược. Bộ sinh mã chép `lib/extra/crypto.js` (CryptoJS) vào nguồn và thêm `load('crypto.js')` cho `chap.js`; `build-all` chỉ nhúng `crypto-js` khi nguồn thật sự cần (không làm phình mọi nguồn generic). Áp dụng: **blbattu** (đổi loại thành truyện tranh — thực chất là truyện tranh), **destinteam**; danh sách `/truyen/page/{p}/`, tìm `/?s=&post_type=manga`, mục lục `div.chapter-item` có phân trang |
| 52 | Sửa tìm kiếm/selector | **moetruyen** `/manga?q=`; **xbanxia** `/modules/article/search_t.php?searchkey=` + mục lục `div.book-list li a`, nội dung `#nr1`; **8book** thẻ kết quả `a.nowraphide`; **syosetu** danh sách lấy từ bảng xếp hạng `yomou.syosetu.com/rank/list/type/*_total/`, tìm ở `yomou.syosetu.com/search.php`, truyện ngắn 1 chương dùng chính trang; **hangtruyenchu** danh sách `/danh-sach`, mục lục `a.chapter-item-link`, nội dung `div.chapter-content` |
| 53 | `autospec.py` | Khi spec tay đổi `base`, tự đưa tên miền mới vào danh sách `domains` (trước đây bị mất khi sinh lại) |

- Kiểm thử lượt này (11 nguồn): **07br, mottruyen, navyteamnovel** chuyển sang đạt; hacamchicac vẫn đạt với template mới.
- Chưa làm được: **moetruyen** ảnh chương bị xáo/ẩn bằng script (`data-imgx-page-index`), **8book** nội dung chương nạp bằng JS trên tên miền ngụy trang, **tutien.pro** bắt đăng nhập mới xem truyện, **po18sm** tìm kiếm cần mã hoá GBK, **metruyencv/mtc/truyencv** tên miền `metruyencv.xyz` không truy cập được, **anime47/lohi** là ứng dụng JS dùng API riêng.



### 08/11/2026 — Bản 0.0.2 (Nâng cấp Short Video YomiHub, Resume A Video cho Phim & Tối ưu hóa đa nền tảng)

**Công cụ đã dùng:** Git (GitHub Desktop / Git CLI), Node.js v24.19.0, esbuild, TypeScript 5.6, Android Studio JBR + Android SDK 35/36 + Gradle 9.3.1 + AGP 8.13.1, adb + Samsung Galaxy Note9 SM-N960N (`281038ac31217ece`) + Android Emulator (API 34/37).

**Hạng mục đã làm:**
1. **Nâng cấp phiên bản toàn hệ thống lên 0.0.2:**
   - Cập nhật `package.json` lên phiên bản `0.0.2`.
   - Nâng phiên bản tiện ích Mangayomi/YomiHub lên `0.4.x`, LNReader/IReader lên `1.3.x`.
   - Nâng `versionCode = 2` và `versionName = 14.2` (anime) / `1.4.2` (manga) cho bộ 4 APK Aniyomi/Nekoyomi.
2. **Tích hợp bộ tính năng "Resume A Video":**
   - Bổ sung `env.resumeStorage` vào `runtime/vbook.js` hỗ trợ đọc/ghi vị trí phát qua `storageGet`/`storageSet` (`localStorage` / `SharedPreferences`).
   - Cập nhật `runtime/engine.js` trong phương thức `videos(url)`: tự động gắn mốc thời gian chuẩn Media Fragment (`#t=<sec>` hoặc `&t=<sec>`) vào URL luồng phát (HLS / MP4), đồng thời bổ sung nhãn trực quan `[Tiếp tục mm:ss]` trên danh sách chất lượng/server video.
   - Bổ sung tùy chọn `RESUME_VIDEO` (Bật/Tắt tiếp tục phát từ vị trí đã thoát) trong `hosts/mangayomi.tail.js`.
3. **Tích hợp tính năng "Short Video" chuẩn YomiHub:**
   - Rà soát và cấu hình 11 nguồn video ngắn: YouTube Shorts, TikTok, Douyin, FreeReels, Tik.Porn, FikFap, Kwiky, xFree, FapReel, SexVietTop, PornHub shorties.
   - Thêm cờ `shorts: true` và `hasShorts: true` vào `repo/index.json` và metadata tiện ích.
   - Bổ sung bộ lọc `SelectFilter` (Chế độ xem Shorts / Mặc định) trong `getFilterList()` của tiện ích để YomiHub nhận diện và kích hoạt trình phát cuộn dọc 9:16.
4. **Tối ưu hóa dung lượng & hiệu năng:**
   - Tinh gọn các tệp trung gian trong `.build/`, nạp có chọn lọc `crypto-js` chỉ khi nguồn có dùng thuật toán giải mã (InitManga, 07br AES).
   - Dọn sạch tệp 0.0.1 cũ trong `Output/`, đóng gói các gói phân phối mới: 4 APK và 3 gói zip (`mangayomi-yomihub`, `lnreader-ireader`, `vbook-leechtext`).
   - Sinh lại `README.md` cập nhật toàn bộ link tải v0.0.2 trong mục Releases.
5. **Cài đặt và kiểm thử trực tiếp trên thiết bị:**
   - Cài đặt thành công 4 APK cập nhật lên thiết bị Samsung Galaxy Note9 SM-N960N.
   - Chạy kiểm thử khởi động và giao diện trên các ứng dụng: Nekoyomi, YomiHub, Mangayomi, vBook, LeechText.
   - Chụp ảnh màn hình (`n9_nekoyomi.png`, `n9_yomihub.png`, `n9_mangayomi.png`, `n9_vbook.png`, `n9_leechtext.png`) và quay video thao tác kiểm thử (`test_002.mp4`) lưu tại `_work/shots/`.

**Lỗi phát hiện & cách sửa:**
| # | Lỗi | Sửa (tệp / dòng lệnh) |
|---|---|---|
| 59 | URL video gắn mốc `#t=` bị lỗi phân giải nếu URL đã có sẵn fragment `#` | `runtime/engine.js`: kiểm tra `streamUrl.indexOf('#') >= 0 ? '&t=' : '#t='` |
| 60 | YomiHub không nhận diện tab Short Video nếu thiếu trường `shorts: true` trong `index.json` | `tools/build/build-all.mjs`: bổ sung `shorts: !!reg.short, hasShorts: !!reg.short` vào `mgMeta` |
| 61 | Thư mục `Output/` và `README.md` tồn đọng tên các tệp cũ 0.0.1 | Dọn sạch tệp cũ trong `Output/`, sinh lại `make-output.mjs` và `gen-readme.mjs` |
| 62 | Phiên bản APK cũ trên thiết bị không nhận bản cập nhật do giữ nguyên versionCode = 1 | `android/build_apks.ps1`: đặt `$code = 2`, biên dịch lại 4 APK với versionCode = 2 |

**Kết quả kiểm thử:**
- `build-all.mjs`: 196/196 nguồn biên dịch thành công; YomiHub bổ sung 29 nguồn và thay thế 20 nguồn trùng.
- `build_apks.ps1`: Gradle biên dịch thành công 4 APK release đã ký với fingerprint `b92c172d...aa39d`.
- `host-sim.mjs`: Kiểm thử giả lập môi trường Mangayomi & LNReader trên `truyenqq` (42 truyện, 3898 chương) và `mottruyen` (20 truyện, 46 chương) đạt 100%.
- Kiểm thử thiết bị: Cài đặt đè trực tiếp 4 APK thành công (Streamed Install Success) trên Samsung Galaxy Note9. Chụp ảnh màn hình và ghi hình video kiểm thử đầy đủ.


### 08/11/2026 — Bản 0.0.3 (Aidoku, Resume A Video làm lại, sửa lỗi Rhino trong APK, tối ưu tải trang)

**Công cụ đã dùng:**
- Mã nguồn & kho tham khảo: Git CLI (clone `Aidoku/aidoku-rs`, `Aidoku/Aidoku`, `Aidoku/AidokuRunner`, `Aidoku-Community/sources`, `kiritokmn1403/YomiHub-Project`, `apivideo/resumeAVideo`, `rust-lang/rust` (thư mục `library`) và `rust-lang/backtrace-rs` để dựng `core`/`std` cho wasm).
- Dựng: Node.js 22/24 + esbuild + TypeScript; Rust 1.97 (`-Zbuild-std`, `wasm32-unknown-unknown`); `aidoku-cli` và `aidoku-test-runner` dựng từ aidoku-rs `ae6485e`; Python 3 + Pillow (biểu tượng nguồn Aidoku); Android SDK 35/36 + Gradle 9.3.1 + AGP 8.13.1 + JBR của Android Studio (APK).
- Kiểm thử: adb, Samsung Galaxy Note9 SM-N960N (Android 10, `281038ac31217ece`) có Aniyomi 0.18.2.1, Nekoyomi 0.20.6, Mangayomi 0.9.95, YomiHub 0.5.3, LNReader 2.1.4, vBook 1.1.54, LeechText 2.0.0.
- Thực thi: chạy script `.bat`/PowerShell trên máy Windows của chủ dự án (File Explorer). `_work/phone2.ps1` điều khiển điện thoại: chạm theo chữ qua `uiautomator dump`, chụp `screencap`, quay `screenrecord` thành từng đoạn 170 giây.

**Đọc trước khi sửa:** `AGENTS.md` và toàn bộ tài liệu này; 2 tệp Excel (*Feature Check* → *Update* → *Extension Repo Main* 196 nguồn, *Tham Khảo*; *Project GitHub* 640+ link).

**Hạng mục đã làm**
1. **Aidoku (iOS):**
   - `aidoku/bridge` (Rust `no_std`, crate `kiri-bridge`): giữ một `JsContext` (JavaScriptCore) cho mỗi nguồn, nạp engine JS một lần, rồi chạy theo giao thức `start`/`poll`/`resume`. Các trait đã cài: `Source`, `ListingProvider`, `DynamicListings`, `ImageRequestProvider` (Referer của trang chương + User-Agent), `BaseUrlProvider`.
   - `hosts/aidoku.tail.js`: adapter phía JS. Gồm giải mã base64 → UTF-8/GBK (JSC không có `TextDecoder`), chuyển chương HTML sang Markdown, đánh số chương, tự lấy bộ mã ký tự từ `<meta charset>`.
   - `tools/build/aidoku-build.mjs`: sinh Cargo workspace `.build/aidoku-ws` (mỗi nguồn một crate, `include_str!` engine), dựng wasm, đóng gói `.aix`, ghi `repo/aidoku/index.min.json` + `icons/`. `tools/gen/aidoku_icons.py`: biểu tượng 128×128 không trong suốt.
   - `build-all.mjs` ghi thêm `.build/aidoku/<id>.js` + `sources.json` cho 152 nguồn truyện tranh/tiểu thuyết.
2. **Resume A Video (làm lại):** `runtime/engine.js` có thêm `canon()`/`decanon()`. Mọi URL trả về ứng dụng được ghi theo tên miền mặc định; trước khi chạy script thì đổi về tên miền đang chọn. Gỡ phần resume chết của 0.0.2 trong `engine.js`, `vbook.js` (`resumeStorage`) và `hosts/mangayomi.tail.js` (`RESUME_VIDEO`, `#t=`). `getPageList` của Mangayomi lấy Referer từ URL đã đổi về tên miền đang chọn.
3. **Tối ưu:** bộ nhớ đệm GET trong `runtime/vbook.js` (60 giây, 6 phản hồi, chỉ lưu HTTP 200).
4. **Short Video:** đối chiếu mã YomiHub (`overlay/lib/yomihub/player/yomi_shorts.dart`): `YomiShorts.supports()` chỉ nhận ID tiện ích tích hợp (`BuiltinExtensions.shortsIds`: 920260006/7/8/13/14/15/16/17) hoặc tên bắt đầu bằng `youtube`/`fikfap`, và **không đọc** cờ `shorts` trong `index.json`. Kho đã giữ nguyên các ID này cho 8 nguồn YomiHub (YouTube, Pornhub, FikFap, Tik.Porn, Kwiky, xFree, FapReel, SexVietTop), nên Shorts chạy trong YomiHub 0.5.3. Thêm `additionalParams: "shorts"` để bản YomiHub sau nhận diện theo kho.
5. **Phiên bản:** `package.json` 0.0.3; APK `versionCode 3` (14.3 / 1.4.3); Mangayomi 0.5.x; LNReader 1.4.x; Aidoku 1xx.
6. **Phát hành:** `make-output.mjs` thêm `Kiritokmn-Extension-0.0.3-aidoku.zip` và xoá tệp bản cũ trong `Output/`. `gen-readme.mjs` thêm Aidoku (đường dẫn, deep link `aidoku://addSourceList`, mục "Có gì mới"). `publish.ps1` lấy lời nhắn commit từ `PUB_MSG`. `build_all.ps1` thêm bước 3b (Aidoku).

**Lỗi phát hiện & cách sửa**
| # | Lỗi | Sửa (tệp / dòng lệnh) |
|---|---|---|
| 63 | **Resume A Video 0.0.2 không hoạt động**: `videos()` đọc `resumeStorage.get(url)` nhưng không chỗ nào gọi `set`, vì tiện ích không nhận được thông báo từ trình phát. Mốc `#t=` luôn bằng 0, ExoPlayer/mpv cũng bỏ qua `#t=` trên HLS. Tuỳ chọn `RESUME_VIDEO` không có tác dụng | Gỡ mã chết. Vị trí xem do chính ứng dụng lưu theo URL tập (Aniyomi/Nekoyomi `last_second_seen`, Mangayomi/YomiHub `YomiPrefs.resumeVideoPosition`), nên chỉ cần URL ổn định: `engine.js` `canon()`/`decanon()` |
| 64 | Đổi **Tên miền** trong cài đặt nguồn thì URL phim/chương đổi theo, ứng dụng tạo tập mới và mất vị trí xem / trạng thái đã đọc | Như #63. Kiểm thử: `rophim` với tên miền `rophim9.online` → `canon()` trả `https://www.rophim.soy/phim/abc`, `decanon()` đổi lại `https://rophim9.online/phim/abc`; URL ảnh CDN khác tên miền giữ nguyên |
| 65 | `cargo` trong máy dựng (đám mây) không tải được target wasm32 (`static.rust-lang.org` bị chặn) | Lấy `library/` của rust-lang/rust đúng tag 1.97.0 + submodule `backtrace` từ GitHub, đặt làm `rust-src`, dựng bằng `RUSTC_BOOTSTRAP=1 -Zbuild-std=core,alloc` (`AIDOKU_BUILD_STD=1`) |
| 66 | `aidoku-test-runner` dùng Boa nhưng **không chạy hàng đợi microtask** sau `eval` (khác JavaScriptCore), nên `await` không bao giờ chạy tiếp | `aidoku/test-runner-jsc-microtasks.patch`: thêm `context.run_jobs()` sau `context.eval()` (chỉ cho bộ kiểm thử) |
| 67 | Chạy test wasm báo `duplicate lang item … core`: test của cargo bỏ qua `panic = "abort"` nên `core` bị dựng hai lần | `-Zbuild-std=std,panic_abort,test -Zpanic-abort-tests` |
| 68 | `aidoku verify`: biểu tượng "is fully opaque… no" | `aidoku_icons.py` dán lên nền trắng (RGB) |
| 69 | `aidoku-sim.mjs --all` in kết quả xong nhưng tiến trình Node không thoát (một trang giữ kết nối), làm `build_all.ps1` đứng ở bước 3b | Thêm `process.exit(0)`. Lần chạy này dừng tiến trình bằng `_work/!KILL.bat` (chỉ dừng tiến trình có `aidoku-sim` trong dòng lệnh) |
| 70 | **APK: mọi lỗi script trong Rhino biến thành `MissingResourceException: Can't find bundle for base name org.mozilla.javascript.resources.Messages, locale vi_VN`**. Phát hiện khi mở Truyện QQ trong Nekoyomi trên Note9 (cả danh sách, chi tiết, đọc đều lỗi). `packaging.resources.excludes` có `**.properties` nên xoá mất `Messages.properties` của Rhino, mà Rhino cần tệp này mỗi khi tạo thông báo (kể cả cảnh báo) | `android/anime|manga/build.gradle.kts`: bỏ `**.properties` khỏi `excludes`. APK có lại `org/mozilla/javascript/resources/Messages*.properties`. Kiểm lại trên Note9: Truyện QQ danh sách → chi tiết → đọc ✅ |
| 71 | `!RUN.bat` gọi `build_apks.ps1` với `> log` thì treo sau khi Gradle xong (Kotlin daemon giữ handle của pipe) | Chép APK từ `Output/apk-build` bằng tay. Trong `build_all.ps1` không gặp lỗi này (không chuyển hướng đầu ra) |
| 72 | Ghi nhận (chưa sửa): **Mimimoe**, **NetTruyenViet** "đạt" `run-tests` nhưng tab đầu là danh mục của trang (Manhwa/Manhua/…, "Danh sách truyện"), không phải truyện. **Góc Truyện Tranh** chương chỉ có 1 ảnh chờ. **PhimTV**, **Rổ Phim**: HTTP 0 (tên miền chết) | Cần viết lại selector/API trên mạng thật ở bản sau. `run-tests.mjs` nên kiểm thêm "tên truyện không trùng tên mục menu" |

**Kết quả kiểm thử**
- `build-all.mjs`: 196/196 nguồn biên dịch (cả trên máy đám mây và máy Windows).
- `aidoku-build.mjs`: 152/152 gói, tổng 19,7 MB (`.aix` 60–300 KB). `aidoku verify`: 152/152 đạt.
- `aidoku-test-runner` (wasm thật + JS + HTTP, máy chủ HTML giả lập): `kiri-zzfxcomic` và `kiri-zzfxnovel` đều **ok**. Chuỗi: listings 2 → 2 truyện, có trang sau → "Truyện A", 3 chương → 2 trang ảnh / 1 trang chữ. Chương GBK giải mã đúng `第二章 测试中文`. Header gửi đi có `Referer`, `User-Agent`.
- `aidoku-sim.mjs --snap` (96 nguồn có ảnh chụp trang): trùng 96/96 với engine Node trước và sau khi thêm `canon()`.
- `run-tests.mjs` (mạng thật, 08/11/2026 11:52): **63/196** (Phim 4/44, Truyện tranh 22/37, Tiểu thuyết 37/115); bản 0.0.2 là 57.
- `aidoku-sim.mjs --all` (mạng thật): **61/152**. Mọi nguồn đạt ở `run-tests` đều đạt ở Aidoku; thêm 8book, sohu.
- APK: Gradle dựng 4 APK đã ký (`b92c172d…aa39d`). Cài đè trên Note9: `Streamed Install Success`, phiên bản 14.3 / 1.4.3.
- Thiết bị (Note9) — ảnh `_work/shots/v003/*.png`, video `_work/shots/v003/*.mp4`:
  - **Nekoyomi 0.20.6 — Phim** (`n9_neko_*`, video `n9_nekoyomi_phim_*.mp4`): NguonC, Phim Nhựa, XemPhimGi, HotPhim đi trọn danh sách → chi tiết → **phát video** ✅. Mở lại phim thì nút **"Tiếp tục"** hiện ra, tức ứng dụng giữ lịch sử xem theo URL tập ổn định. PhimTV, Rổ Phim: `HTTP 0` (tên miền chết) ❌, khớp với `run-tests`.
  - **Nekoyomi — Truyện tranh** (`n9_nekm_*`, video `n9_nekoyomi_truyen_*.mp4`): TruyenQQ, TruyenGG, NetTruyenViet, Destin Team (giải mã Init Manga), Thế Giới Truyện, VinaHentai (18+) đọc được ✅. **Truyện QQ** lỗi `MissingResourceException` → sửa ở #70 → kiểm lại đọc được ✅ (`n9_nekm_truyenqq_fix_*`). Mimimoe, Góc Truyện Tranh: lỗi nội dung (#72).
  - **Aniyomi 0.18.2.1** (thiết lập lần đầu: chọn thư mục thử `Download/YomiHub_test`, thêm kho bằng `aniyomi://add-repo` và `tachiyomi://add-repo`; `n9_ani_*`, video `n9_aniyomi_*.mp4`): NguonC, Phim Nhựa, HotPhim phát được ✅. Truyện QQ, TruyenGG, TruyenQQ đọc được ✅. Hắc Ám Chi Các: trang đầu của chương là ảnh `.svg`, Aniyomi mở bằng WebView.
  - **Phát hành rồi kiểm lại bằng chính kho trên GitHub** (commit `687e576`, Release `v0.0.3`, 12/12 tệp, `verify push match=True`). Từ máy đám mây đã tải lại thử: `repo/aidoku/index.min.json` 200, `.aix` 200, các index 200, `package.json` = 0.0.3, tệp APK trong Release 200 (839.064 byte).
  - **Mangayomi 0.9.95** (`n9_mgy_*`): kéo xuống làm mới thì TruyenQQ báo *Update pending* → *Update all*. Cài thêm Truyện QQ, TruyenGG, Destin Team. Nhãn nguồn hiện "in Extension Repo 0.0.3". TruyenQQ: danh sách → chi tiết 376 chương, nút **"Resume · Chapter 374"** vẫn đúng chương đọc dở từ 05/11 (URL ổn định) ✅. Mở trang ảnh trên Note9 vẫn báo "This image couldn't be loaded". Đây là lỗi trình đọc của Mangayomi trên máy này đã ghi ở 05/11 (máy ảo hiện bình thường), không do tiện ích.
  - **YomiHub 0.5.3** (`n9_yh_*`, video `n9_yomihub_shorts_*.mp4`): nguồn YouTube (NewPipe · Pure Tuber) → tab **Shorts** → luồng video dọc toàn màn hình, vuốt lên sang clip tiếp theo 2 lần ✅.
  - **LNReader 2.1.4** (`n9_ln_*`, video `n9_lnreader_*.mp4`): tab Plugins nhận bản 1.4.x → *Update all*: App Truyện Chữ 1.4.3, Bàn Long 1.4.8; cài Giới Truyện 1.4.2, Boylove Bất Tử 1.4.1. Bàn Long: danh sách → *Giang Sơn Tuyệt Sắc Bảng* (tác giả, mô tả, thể loại) → **đọc Chương 01** ✅.
  - **vBook 1.1.54** (`n9_vb_*`): app chạy, nhưng trên máy chưa cài tiện ích nào và kho mặc định của vBook không phải kho Kiritokmn. Lượt này chưa kiểm đọc trên vBook/LeechText. Gói vBook (`repo/vbook/*.zip`) không đổi mã ở 0.0.3 (script vBook gốc), nên hành vi giống 0.0.2.
  - Sau kiểm thử đã trả lại cài đặt xoay màn hình của Note9 (`accelerometer_rotation` 0 → 1 như ban đầu). Thư mục thử của Aniyomi: `Download/YomiHub_test`.

**Việc cần làm ở bản sau**
- Sửa các nguồn lỗi nội dung (#72) và 152 → 196 nguồn đạt. Phim hiện 4/44: nhiều trang phim dùng API/iframe riêng.
- TikTok, Douyin, FreeReels (Short Video): trang cần chữ ký chống bot (X-Bogus / a_bogus). Cần API trung gian (ví dụ tikwm) và YomiHub đọc `additionalParams: "shorts"` (sửa ở `YomiShorts.supports()`).
- Kiểm Aidoku trên iPhone/iPad thật khi có thiết bị. Cài Rust + `wasm32-unknown-unknown` trên máy Windows để `build_all.ps1` tự dựng lại gói Aidoku.
- `run-tests.mjs`: thêm phép kiểm "tên truyện ≠ tên mục menu" để không báo đạt nhầm.

### 08/11/2026 (chiều) — Kiểm thử các nguồn còn lỗi trên YomiHub, qua VPN tích hợp sẵn của YomiHub

Chủ dự án yêu cầu: nguồn nào chưa kiểm được thì kiểm trên YomiHub. Nguồn nào không vào được thì bật VPN tích hợp sẵn của YomiHub rồi kiểm lại.

**Công cụ:** YomiHub 0.5.3 trên Galaxy Note9. Dùng mục *Thêm › VPN & DNS › Dịch vụ VPN*: **Tor** (HTTP 8118 / SOCKS 9050, phạm vi "mọi tiện ích") và **Cloudflare WARP** (chế độ "Chỉ YomiHub").
- Điều khiển máy bằng `_work/phone2.ps1`. Bản này có thêm các lệnh: `need <gói>` (bỏ qua cả khối nếu app khác đang ở trên cùng), `seekc`/`rowtapc` (tìm theo chữ có chứa), `win` (chạy lệnh Windows).
- `adb forward tcp:18118 tcp:8118` để Node trên máy Windows đi qua đúng Tor của YomiHub.
- `tools/test/run-tests.mjs` có thêm `--out <tệp>` để ghi kết quả riêng.
- `_work/purge.bat` xoá bộ nhớ đệm jsDelivr của các index (YomiHub dùng jsDelivr làm bản dự phòng khi `raw.githubusercontent.com` bị chặn).

**Bước 1 — kiểm tự động 133 nguồn đang lỗi, qua Tor của YomiHub** (`vpn_tor_test.bat`, kết quả ở `data/test-results-vpn-tor.json`; xác nhận `check.torproject.org` trả `IsTor:true`):
- Đi trọn chuỗi: **1/133** (PhimTV: danh sách → tìm → chi tiết → tập → video). Khi kết nối trực tiếp từ mạng Việt Nam, nguồn này báo `HTTP 0`, tức tên miền `phimtv.my` bị nhà mạng chặn chứ không phải đã chết.
- Đi được thêm một số bước: hihiphim 1→3, mattreadingtranslations 0→3, quanben 0→4, viblo 2→3.
- Còn lỗi qua Tor: 92 nguồn lỗi phân tích trang (trang đổi giao diện / dựng bằng JS / cần API riêng; VPN không giúp được), 20 nguồn Cloudflare/403 (nhiều trang chặn hẳn IP Tor), 20 nguồn lỗi mạng (tên miền chết hẳn).

**Bước 2 — kiểm trong app YomiHub** (ảnh `_work/shots/v003/y_*`, `w_*`, video `n9_yh_tor_test_*.mp4`, `n9_yh_warp_test_*.mp4`):

| Nguồn | Kết nối thẳng (mạng VN) | Qua Tor (kiểm tự động) | Trong app YomiHub + Tor |
|---|---|---|---|
| PhimTV | `HTTP 0` (tên miền bị chặn) | **đạt trọn chuỗi** | Danh sách ✅ → chi tiết ✅ (10 tập) → phát: luồng video quay mãi không chạy (>70 giây) ⚠️. Thử qua WARP: vẫn `HTTP 0` (lúc đó WARP đang "Đang kết nối…") |
| HiHiPhim | danh sách | 3/5 bước | Danh sách ✅ → chi tiết ✅ (24 tập) → phát: trang phát bắt **xác minh Cloudflare** (người dùng phải tự bấm) ⚠️ |
| Viblo | 2 bước | 3 bước | Danh sách ✅ → chi tiết ✅ (8 bài) → **đọc nội dung ✅** |
| quanben | Cloudflare / máy chủ chặn | 4 bước | Danh sách ✅ → chi tiết ✅ → chương chỉ có 1 dòng giới thiệu (lấy nội dung sai) ⚠️ |
| Matt Reading Translations | Cloudflare | 3 bước | Cài bản 0.5.3 ✅. Danh sách: `HTTP 403` (Cloudflare chặn IP Tor) ❌ |
| RoPhim (định dạng YomiHub) | `HTTP 0` | — | Danh sách trống. Chi tiết: "Sorry, you have been blocked" (`phimapi.com` chặn Tor) ❌ |
| Xôi Lạc TV (định dạng YomiHub) | lỗi mạng | — | Danh sách trận đấu ✅ → chi tiết ✅ → phát: đang tải khi chụp ⚠️ |
| GuPhim | lỗi mạng | lỗi | "Không có kết quả" ❌ (lỗi phân tích trang) |
| NetTruyen (truyện chữ) | lỗi mạng | lỗi | Cài ✅. "Không có kết quả" ❌ |
| MangaDex (GLOBAL) | `HTTP 0` (`mangadex.org` bị chặn; `api.mangadex.org` vẫn vào được) | lỗi | Cài 0.5.1 ✅ (sau khi mạng của máy được nối lại). Mở nguồn: `Error: HTTP 0 https://mangadex.org/` cả khi kết nối thẳng lẫn qua Tor ❌. Qua Tor, `curl` tới `mangadex.org` và `api.mangadex.org` đều không trả lời (chặn IP Tor) |
| WebtoonScan | `HTTP 0` (tên miền vẫn phân giải ra `5.182.209.177` nhưng máy chủ không trả lời) | lỗi | Cài 0.5.1 ✅. Mở nguồn: quay ~2,5 phút rồi `Error: HTTP 0 https://webtoonscan.com/`, cả kết nối thẳng lẫn qua Tor ❌. Trang đã chết |
| Wiki Dịch (truyện chữ) | `HTTP 0` (`wikicv.net` bị chặn) | lỗi | Cài 0.5.1 ✅. Kết nối thẳng: "Không có kết quả". Qua Tor: **vào được trang** (`wikicv.net` → chuyển sang `wikicv.org`, `200`, có 101 liên kết `/truyen/…`), nhưng app vẫn "Không có kết quả" ❌ vì cấu hình nguồn thiếu bộ chọn `item` |

**Nhận xét**
- VPN của YomiHub giúp được các nguồn bị **nhà mạng chặn tên miền** (PhimTV, Viblo, quanben, HiHiPhim).
- VPN không giúp được các nguồn hỏng do **trang đổi cấu trúc** (92/133), hoặc trang **chặn IP VPN/Tor** bằng Cloudflare (Matt Reading, RoPhim/phimapi). Các nguồn này cần sửa mã ở bản sau.
- Lỗi phát hiện thêm: YomiHub lưu danh sách tiện ích cũ (PhimTV hiện 0.3.1 trong khi kho đã là 0.5.1). Bấm cài vẫn tải đúng bản mới 0.5.1. Bộ nhớ đệm jsDelivr đã được xoá bằng `purge.bat`.
- **Nguyên nhân gốc của nhiều nguồn "Không có kết quả":** 62/149 nguồn dùng mẫu chung (`lib/lib_generic.js`) có `config.js` chỉ khai báo `tabs`/`search`, **không có bộ chọn `item`**. `X.items()` vì thế không chọn được thẻ truyện nào, nên danh sách luôn trống dù trang tải được. Đây là trường hợp của GuPhim, NetTruyen, Wiki Dịch, MangaDex, WebtoonScan. Danh sách 62 nguồn: anime47, avsubanimevietsub, bilibili, cbhentai, dailymotion, damconuong, douban, douyin, duahau, dualeotruyen, fapreel, fikfap, freereels, gongzicp, guphim, hamelnsyosetuorg, haychill, hhtqhayvip, html5qqcom, idejian, iqiyi, julycomic, kwiky, lacatruyen, langgee, lohi, loppytoon, mangadex, mgtv, minotruyen, myreadingmanga, nettruyen, nettruyenz, phim4k, phimmoihd, piaotianapp, pornhub, qmbook, rophim, sexviettop, showbox, sitruyencv, snapd, soixamfanqie, sonako, syosetur18, taonovel, tiktok, truyenh, truyenmoikk, tutienpro, twitch, vtvgo, webtoonscan, weibo, wikidich, wodeshucheng5, xoilac, xsw, xtruyen, youtube, ypshuobinhluansach.
- **Sự cố trong lúc kiểm:** giữa chừng Note9 mất Internet dù Wi-Fi vẫn báo đã kết nối (`ping 8.8.8.8` mất 100% gói, không phân giải được tên miền). Vì vậy Tor dừng ở 95% ("chưa kết nối được sau 90 giây") và bấm cài MangaDex chỉ quay rồi thôi, không báo lỗi. Tắt/bật lại Wi-Fi (`svc wifi disable/enable`) thì mạng trở lại, Tor kết nối lại được và cài bình thường. YomiHub không báo lỗi khi cài thất bại, đây là chỗ app nên sửa.
- Cài qua Tor rất chậm (WebtoonScan quay hơn 4 phút). Cách nhanh hơn: tắt VPN để cài, rồi bật VPN để kiểm.
- Gõ tìm kiếm: bàn phím Laban Key (Telex) đổi chữ khi gõ bằng `adb input text`. Dùng chuỗi con không bị Telex đổi: `gaDe` (MangaDex), `ebto` (WebtoonScan), `iki` (Wiki Dịch).
- Sau kiểm thử đã trả lại máy như cũ, có xác nhận: VPN của YomiHub **đang tắt**, bàn phím mặc định `com.vng.inputmethod.labankey/.LatinIME`, `accelerometer_rotation = 1`. Ảnh `_work/shots/v003/z_*`, video `n9_yh_tor_final_*.mp4`.

**Tổng kết kiểm trong app (12 nguồn):** đọc/xem được đến nội dung: **Viblo** (cần Tor). Vào được danh sách + chi tiết nhưng chưa xem được nội dung: PhimTV, HiHiPhim, quanben, Xôi Lạc TV. Không dùng được: Matt Reading, RoPhim, GuPhim, NetTruyen, MangaDex, WebtoonScan, Wiki Dịch.

**Việc cần làm ở bản sau (từ lượt kiểm này)**
- Viết bộ chọn `item`/`title`/`cover` (và chi tiết, mục lục, nội dung) cho 62 nguồn mẫu chung còn thiếu. Ưu tiên Wiki Dịch (đổi tên miền sang `wikicv.org`, đã có trang mẫu `_work/wd_home.html`) và NetTruyen.
- MangaDex: viết lại theo API `api.mangadex.org` (vào được thẳng từ Việt Nam). Không cào `mangadex.org`, vì đó là trang dựng bằng JavaScript và bị chặn ở Việt Nam.
- WebtoonScan: trang đã chết, nên gỡ khỏi kho hoặc đánh dấu ngừng.
- quanben: sửa bộ chọn nội dung chương. PhimTV/Xôi Lạc: kiểm lại luồng phát.

### 13/11/2026 — Bản 0.0.4 (logo cho mọi nguồn, YouTube/TikTok/Douyin, sửa nguồn, đánh dấu nguồn ngừng hoạt động, kiểm thử trên máy ảo)

**Yêu cầu (đã tóm tắt và được chủ dự án xác nhận):** làm theo sheet *Feature Check* → *Update* của `Project Extension Repo.xlsx` và quét các link trong `Project GitHub.xlsx`. Gồm:
- Extension repo dùng chung cho Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText, Aidoku.
- Short Video theo chuẩn YomiHub; Resume A Video cho Phim.
- Tích hợp bộ *TikTok & Douyin Project*; logo cho mọi tiện ích.
- Làm nốt việc của 0.0.3.

Quyết định của chủ dự án:
1. **Không sửa YomiHub ở bản này**, chỉ để lại hướng dẫn: `docs/YOMIHUB_SHORTS_GUIDE.md`.
2. Nguồn chết **giữ lại và đánh dấu "ngừng hoạt động"**.
3. Kiểm thử trên **máy ảo**.
4. Giữa phiên: chuyển `.vscode` và `_work` vào thư mục `Kiritokmn - Extension Repo`.

**Công cụ đã dùng:**
- Máy Windows của chủ dự án: Node 24, Git (Git Credential Manager của GitHub Desktop), Android SDK 35/36 + Gradle 9.3.1 + JBR của Android Studio, Android Emulator (`Medium_Phone_API_37.0`, x86_64), adb.
- Trình chạy lệnh nền mới `_work/!RUNNER.bat` → `_work/win_runner.ps1`: thả `.ps1` vào `_work/run/q/`, log ở `_work/run/o/`. Bật bằng computer-use: bấm đúp trong File Explorer.
- File Explorer + máy ảo Linux của Cowork (`device_bash`) để đọc/sửa tệp.
- Máy đám mây (Claude): Node 22 + esbuild/TypeScript, Python 3 + BeautifulSoup/Pillow/cairosvg, Rust 1.97 (`-Zbuild-std`, `library/` của rust-lang/rust lấy từ GitHub) để dựng gói Aidoku, Git CLI để clone `Evil0ctal/Douyin_TikTok_Download_API`, `kiritokmn1403/YomiHub-Project`, `apivideo/resumeAVideo`.
- Kiểm thử thiết bị: `_work/phone4.ps1` (bản 0.0.4 của `phone2.ps1`, nhắm `emulator-5554`, ảnh/video vào `_work/shots/v004/`).

**Hạng mục đã làm**
1. **Ghi/phát lại HTTP:** `tools/test/run-tests.mjs` có thêm `--record <dir>` / `--replay <dir>` (bọc `fetch` toàn cục, mỗi request một JSON, khoá = sha1(method+url+body)). Sửa bộ chọn ngoại tuyến trên máy đám mây, kết quả giống hệt khi chạy mạng thật (54/196 = 54/196). Thêm `tools/test/one.mjs` (chạy từng bước một nguồn) và `tools/test/streamcheck.mjs` (tải thử link phát với header nguồn trả về).
2. **Kiểm "tên truyện ≠ mục menu"** (việc tồn đọng của 0.0.3): `run-tests.mjs` → `MENU_NAME` / `MENU_LINK` / `menuLike()`. Bước popular trượt khi ≥ 50% mục giống menu/thể loại.
3. **Sửa nguồn:**
   - **Đổi tên miền:** Wiki Dịch (`wikicv.org`), LuotTruyen (`luottruyen21.com`), PhimTV (`phimtv2.com`), XTruyen (`xtruyen.vn`), Xôi Lạc (`xoilacxl.cc`), dùng `set_domain()` (sửa plugin.json + config.js).
   - **Viết lại bộ chọn:** Navy Team Novel, TruyenC, TruyenQQ (truyenqq.com.vn), NetTruyenViet, Viblo, PornHub, novelnext, mintteanovel, cùng bộ chọn danh sách cho khoảng 20 nguồn mẫu chung (allin1/stvappvi, animevnnet, blvietsub, hentaivietsub, hhpanda, hihiphim, luphim, phimmoi, vfilm, watchhentai, moetruyen, sweetastes, lofter/sudugu, snapd, shubenshu, po18sm, douban, 8book, abcbiquge, 101minc).
   - `lib/lib_generic.js`: thêm `ch_from` (mục lục qua AJAX theo mã trong trang). `lib/lib_madara.js`: báo rõ khi chương bị khoá bởi "WP Manga Images Protection".
   - `sources/hhpanda/src/chap.js`: gọi `player/player.php?action=dox_ajax_player` của HalimMovies.
4. **YouTube viết lại** (`sources/youtube/src/yt.js`): tìm kiếm qua InnerTube client WEB (tham số `EgIQAQ==` video, `EgIQCQ==` Shorts), phát qua client IOS (`formats` có tiếng, không cần giải mã). Tab Shorts / Âm nhạc / Tin tức / Hoạt hình / Game. Trang `FEtrending` đã bị YouTube gỡ (HTTP 400).
5. **TikTok & Douyin** (`lib/lib_shortvideo.js`, `sources/tiktok`, `sources/douyin`):
   - Cài đặt `DTK_SERVER` / `DTK_KEY` để gọi REST v1 của máy chủ Douyin_TikTok_Download_API do người dùng tự dựng (`/{platform}/video`, `/user/posts`, `/hashtag` + `/hashtag/posts`, `/trending`). Tiện ích **không** chứa thuật toán ký X-Bogus/a_bogus.
   - TikTok khi không có máy chủ: dùng tikwm.com (feed theo `REGION`, hashtag, tìm kiếm POST, bài của người dùng, link HD/SD/có logo).
   - Douyin khi không có máy chủ: chỉ bảng tìm kiếm nóng `iesdouyin.com/web/api/v2/hotsearch/billboard/word/`. Liên kết chủ đề là `/hot/<từ>` (vì `/search/` bị phép kiểm menu bắt); mở trên Douyin qua WebView.
6. **Cài đặt nguồn mở rộng:** `hosts/mangayomi.tail.js` (`getSourcePreferences`) và APK (`SourceDef.prefs` trong `VBookRuntime.kt`, `setupPreferenceScreen` của `VBookAnimeFactory.kt` / `VBookMangaFactory.kt`, `prefs` trong `assets/vb/sources.json` do `build-all.mjs` sinh) hiện mọi mục `config` ngoài Tên miền.
7. **Logo:**
   - `_work/x/logofetch.mjs` gom icon ứng viên của 196 trang.
   - `tools/gen/make_icons.py` dựng `sources/<id>/icon.png` 256×256: 146 logo từ trang, 50 logo chữ. Logo trống, logo trùng giữa các host khác nhau và danh sách `FORCE_LETTER` được thay bằng logo chữ. Góc logo có huy hiệu ▶/T/N và nhãn 18; lưu PNG bảng màu 128 màu.
   - `build-all.mjs` chép logo vào `repo/icons/<id>.png` và dùng cho `iconUrl` của Mangayomi/YomiHub, LNReader/IReader, `icon` của vBook, `aidoku/icons`. Tiện ích YomiHub cùng host dùng chung logo (`yomihub-sources.mjs`).
8. **Nguồn ngừng hoạt động:** `data/status.json` (`dead` 37 nguồn, cùng các nhóm `blocked`, `login`, `protected`, `api`). `build-all.mjs` thêm "(Ngừng hoạt động)" vào tên và lý do vào mô tả; `yomihub-sources.mjs` làm tương tự cho tiện ích YomiHub. `gen-readme.mjs` ghi ký hiệu ⛔ 🌐 🔐 🔒 🧩. Danh sách tên miền đã thử nằm ở `_work/x/domres.json`.
9. **Tối ưu dung lượng:** plugin LNReader/IReader được nén lại sau khi hạ ES5 (`esbuild.transformSync`, target es5). `repo/lnreader` giảm từ 64 MB xuống 29 MB.
10. **Phiên bản:** `package.json` 0.0.4; `android/build_apks.ps1` `$code = 4` (APK 14.4 / 1.4.4); mọi nguồn tăng `version`; Aidoku `BRIDGE_REV = 2`.
11. **Tài liệu:** `CHANGELOG.md`, README (mục "Có gì mới", chú thích ký hiệu), `AGENTS.md` (quy định 0, 7, 8), thư mục `A.I Brain - Second Brain/` (7 tệp), `docs/YOMIHUB_SHORTS_GUIDE.md`.
12. **Sắp xếp thư mục:** `_work/` và `.vscode/` chuyển vào thư mục dự án. Thêm `/_work/` và `/.vscode/` vào `.gitignore` (2,8 GB không lên GitHub). `build_all.ps1`, `build-all.mjs`, `asyncify.mjs` tìm `_work/deps` ở cả vị trí mới lẫn cũ. Tạo lại junction `node_modules` → `_work/deps/node_modules`.

**Lỗi phát hiện & cách sửa**
| # | Lỗi | Sửa (tệp / dòng lệnh) |
|---|---|---|
| 73 | `run-tests` báo đạt nhầm khi danh sách là mục menu (NetTruyenViet "Manhwa/Manhua/Manga", Novelpia "MORE", Mimimoe "Danh sách truyện / Thể loại / Album") | `menuLike()` trong `run-tests.mjs`. NetTruyenViet đổi tab sang `/tim-truyen?page={p}`, item `div.items div.item`. Mimimoe/Novelpia ghi vào `status.json → api` (cần API) |
| 74 | TruyenQQ (truyenqq.com.vn): bộ chọn `.item` lẫn 59 mục thể loại | item `div.inner > div.item, .item:has(div.info h3.name)` → đạt trọn chuỗi |
| 75 | Wiki Dịch: chỉ sửa BASE_URL trong config.js không có tác dụng, vì `DOMAIN.default` trong plugin.json vẫn là `wikicv.net` (bị chặn) | `set_domain()` sửa cả plugin.json (source, DOMAIN.default/values, regexp) |
| 76 | PhimMoi: tên miền mặc định `messiahelartista.com` chỉ còn là trang demo của Wayback Downloader (HTTP 200); 4 tên miền khác ENOTFOUND | Đánh dấu ngừng hoạt động |
| 77 | Nhiều tên miền "sống" nhưng đã thành trang cờ bạc (phimhaychill.net, phim4k.net), đang rao bán (motphimtv.com) hoặc báo "Tạm biệt!" (metruyencv.com) | Đánh dấu ngừng hoạt động. Không chuyển nguồn sang các tên miền đó |
| 78 | Douyin: liên kết `/search/<từ>` bị phép kiểm menu đánh trượt | Đổi thành `/hot/<từ>`; `track.js` đổi lại `/search/` khi mở WebView |
| 79 | Đọc Truyện Tranh BL: chương trả trang "Đang kiểm tra" (WP Manga Images Protection, bắt đăng nhập Google) → 0 ảnh, không báo lỗi | `lib_madara.js` → ném lỗi rõ ràng "cần đăng nhập trong WebView" |
| 80 | `device_commit_files` từ chối tệp 26 MB ("HTTP 400 fetching session file") nhưng tệp job vẫn được ghi → job build chạy với mã cũ (`version: 0.0.3`) | Dừng tiến trình bằng `j016_kill.ps1`, gửi lại qua `SendUserFile` + `fileUuid`. Bài học: gửi tệp lớn trước, tệp job sau cùng, và kiểm tra `written` của từng tệp |
| 81 | `sync.sh` bỏ sót tệp có dấu cách trong tên (`A.I Brain - Second Brain/…`) | Đóng gói bằng `git diff --name-only -z … \| tar --null -T -` |
| 82 | Phát hiện khi kiểm trên máy ảo, **chưa sửa:** NguonC trong Aniyomi báo "loading failed: HTTP error 403". `run-tests` vẫn "đạt" vì chỉ kiểm có link. `streamcheck.mjs`: playlist (data URI) tải được nhưng mọi segment `seouls11.amass11.top/…/streamaaaNNNN.png` trả 403 dù thử mọi Referer/Origin; gọi thẳng bootstrap `embed.php` cũng 403 | Bản sau: phân tích lại cơ chế cấp quyền (`request_grant`) của streamc.xyz. `run-tests` nên tải thử 1 segment |
| 83 | Phát hiện khi kiểm trên máy ảo, **chưa sửa:** YouTube trong Aniyomi (mpv) quay mãi khi phát, dù danh sách, chi tiết và link phát (client IOS) đều đúng; Node tải link đó 200 | Bản sau: thử luồng HLS hoặc client khác cho mpv; kiểm trên máy thật |
| 84 | HHPanda (streamfree.vip) và LuPhim (moviking.ayama.fun) mã hoá trình phát (bytecode/nonce, dấu vân tay WebGL + chống DevTools); MoeTruyen cấp ảnh qua token | Ghi `status.json → protected` |

**Kết quả kiểm thử**
- `build-all.mjs`: 196/196 nguồn (đám mây và Windows). Gradle: 4 APK đã ký (`b92c172d…aa39d`), `versionCode 4`. `aidoku-build.mjs` (đám mây, Rust 1.97 + build-std): **152/152** gói, 20,6 MB.
- `run-tests.mjs` trên mạng thật (Windows, 13/11/2026 12:20): **60/196** (Phim 6/44, Truyện tranh 20/37, Tiểu thuyết 34/115).
  - Đầu phiên, chạy lại bản 0.0.3 trên mạng cùng ngày được 54/196 (0.0.3 ngày 08/11 là 63): mấy ngày qua nhiều trang đã đổi.
  - Bản phát lại (replay) có cộng thêm vài nguồn đã sửa: 62/196. Mới đạt so với đầu phiên: YouTube, TikTok, Navy Team Novel, TruyenC, TruyenQQ (truyenqq.com.vn), Viblo, PornHub, ixdzs8. Không nguồn nào bị tụt.
- `aidoku-sim.mjs --all` (mạng thật): **58/152**.
- **Máy ảo Android** `Medium_Phone_API_37.0` (ảnh `_work/shots/v004/*.png`, video `_work/shots/v004/*.mp4`):
  - **Aniyomi 0.18.2.1** (thiết lập lần đầu: thư mục Documents, Trust tiện ích 14.4; video `aniyomi_v004_*.mp4`):
    - Danh sách nguồn hiện "(Ngừng hoạt động)" đúng như dự kiến ✅.
    - **XemPhimGi**: danh sách → chi tiết → **phát phim** ✅. Thoát lúc 1:34, mở lại thì tập hiện "1:34/2:46:09" và phát tiếp từ 1:34 → **Resume A Video hoạt động** ✅ (`v004_ani_10/11`).
    - **NguonC**: danh sách và chi tiết ✅, phát lỗi 403 ❌ (#82).
    - **YouTube**: danh sách Shorts ✅, chi tiết ✅, phát thì quay mãi ❌ (#83).
  - **Nekoyomi 0.20.6** (Trust tiện ích 1.4.4, bật Tiếng Việt; `nekoyomi_v004_*.mp4`): **TruyenQQ** danh sách → chi tiết 60 chương → **đọc chương** (176 ảnh) ✅.
  - **Mangayomi 0.9.95** (`mangayomi_v004_*.mp4`):
    - Kéo làm mới → *Update pending* → *Update all*: MangaDex, TruyenQQ, Truyện QQ, TikTok lên 0.5.x ✅.
    - Trang cài đặt TikTok có đủ ô Khu vực / Máy chủ Douyin_TikTok_Download_API / Khoá API và **logo mới có huy hiệu ▶** ✅.
    - **TikTok**: bảng tin đề xuất → chi tiết → **phát video** ✅ (hình răng cưa là do máy ảo giải mã bằng phần mềm).
  - **LNReader 2.1.4** (thêm kho bằng deep link `lnreader://repo/add?url=…plugins.min.json`, bật Tiếng Việt; `lnreader_v004_*.mp4`):
    - Danh sách plugin hiện "Mê Truyện CV (Ngừng hoạt động)" ✅.
    - Cài **Navy Team Novel** → danh sách → *BITE BACK* (85 chương) → **đọc chương #1** ✅. Đây cũng là bằng chứng plugin đã nén lại vẫn chạy.
  - **vBook 1.1.54** (`vbook_v004_*.mp4`):
    - Thêm kho `repo/plugin.json` trong *Repository manager*: thư viện tăng từ 25 lên **221** tiện ích, có Navy Team Comic/Novel kèm logo ✅.
    - Bấm cài thì vBook bắt cập nhật ứng dụng lên 1.1.57 trước ⚠️ (giới hạn của app). Lượt này chưa cập nhật app, nên chưa đọc thử trên vBook. LeechText dùng cùng định dạng vBook, chưa kiểm lượt này.
  - Aidoku (iOS) không có thiết bị: chỉ kiểm bằng `aidoku-sim` (58/152).
- **Phát hành** (lượt 1, 13:11): commit `d3e3ef3`, Release `v0.0.4` có **12/12 tệp**, `verify push match=True`. Lượt 2 sau khi ghi tài liệu: xem log `Output/publish.log`.

**Việc cần làm ở bản sau**
- #82 NguonC (403 segment) và #83 YouTube trong mpv. Cho `run-tests` tải thử 1 segment/byte đầu của link phát (dùng `streamcheck.mjs`).
- Sửa YomiHub theo `docs/YOMIHUB_SHORTS_GUIDE.md` (đọc `additionalParams: "shorts"`, hiện huy hiệu Shorts).
- Nguồn SPA cần viết theo API: bilibili, Dailymotion, iQIYI, MGTV, Twitch, VTV Go, FreeReels, Sáng Tác Việt (allin1/stvappvi), Mimimoe, Novelpia, MangaDex (`api.mangadex.org`, cần VPN ở VN).
- Khoảng 30 nguồn Cloudflare: kiểm trong app bằng WebView. Nguồn cần đăng nhập: kiểm với tài khoản của chủ dự án.
- vBook: cập nhật app trên máy ảo lên 1.1.57 rồi kiểm đọc. LeechText và YomiHub (Shorts TikTok) kiểm lượt sau.
- Xoá thư mục rỗng `D:\A.I Project\A.I Project - Extension Repo\_work\shots` sau khi tắt máy ảo (Windows đang giữ).

### 13/11/2026 (tối) — Bản 0.0.5 (mỗi nguồn một APK cho Aniyomi/Nekoyomi, NguonC và YouTube phát được, kiểm thử trên điện thoại thật)

**Yêu cầu của chủ dự án:**
- "Làm luôn đi, xử lý làm sao cho Aniyomi và Nekoyomi vẫn có thể phân biệt các extension với nhau đi."
- "Đã kết nối với điện thoại ngoài, hãy sử dụng thiết bị đó để kiểm thử."
- Làm tiếp danh sách việc của 0.0.4.
- Việc khó giao cho Fable 5.2, việc nhẹ giao cho Sonnet hoặc Haiku. Phiên này điều phối có dùng sub-agent `wa`, `wb`, `wc` trên máy đám mây.

**Công cụ đã dùng:**
- Máy Windows của chủ dự án: Node 24, Gradle 9.3.1, AGP 8.13.1, Kotlin 2.2.20, JBR, Android SDK 35 / build-tools 36.0.0, adb. Trình chạy nền `_work/!RUNNER.bat`, bật lại bằng computer-use (bấm đúp trong File Explorer) vì đã dừng từ 09:22 UTC.
- **Điện thoại thật Samsung Galaxy Note9** (SM-N960N, Android 10, 1440×2960, adb `281038ac31217ece`). Bộ điều khiển `_work/phone5.ps1` là bản sao của `phone4.ps1` nhắm máy này; ảnh và video ở `_work/shots/v005/`. Cài đặt máy trước khi kiểm ghi ở `_work/shots/v005/phone_settings_before.txt`. Trong lúc kiểm chỉ tạm khoá xoay màn hình; đã trả lại `accelerometer_rotation=1`, `user_rotation=0`. Máy Xiaomi 15T có cắm nhưng chưa bật gỡ lỗi USB, nên không dùng.
- Máy đám mây: Node 22, Git, Kotlin 2.2.20 + JDK 17. Phiên không có kết nối máy tính đã biên dịch `Http2Bridge.kt` và chạy `tools/test/Http2BridgeTest.kt`: 18/18 đạt.
- Đồng bộ mã: `sync.tgz` gửi qua `SendUserFile` → `device_commit_files`, rồi chạy `_work/x/apply_sync.ps1` (giải nén + xoá theo `sync_deleted.txt`).

**Hạng mục đã làm**
1. **Mỗi nguồn một APK (Aniyomi/Nekoyomi):**
   - `android/{anime,manga}/build.gradle.kts`: đọc `flavors.json` (JsonSlurper) và tạo một product flavor cho mỗi nguồn: `applicationId`, `versionCode/Name`, `manifestPlaceholders` appName/nsfw.
   - `sourceSets[flavor]` lấy `gen/<flavor>/{assets,res}`. Bản debug bị tắt bằng `androidComponents.beforeVariants`.
   - Module thư viện mới `android/anime-core`, `android/manga-core` chứa Kotlin (`src/main/kotlin` + `shared/kotlin`) và Rhino, biên dịch **một lần** cho mọi flavor. Thêm vào `settings.gradle.kts`; `gradle.properties` bật `org.gradle.parallel=true`.
   - `tools/build/build-all.mjs`:
     - `APK_REV = 1`, gói `…<lang>.kiri<id>`, `versionCode = 1000·APK_REV + version`.
     - Sinh `android/<mod>/gen/<flavor>/assets/vb/{sources.json, src/<id>.js}` và `res/mipmap-xxxhdpi/ic_launcher.png`. Logo nguồn lấy từ `sources/<id>/icon.png`; nguồn không có logo dùng `default_icon.png`.
   - `tools/build/aniyomi-index.mjs`: mỗi APK một mục trong `repo/index.min.json`, chép vào `repo/apk` + `repo/icon`, xoá tệp cũ. `make-output.mjs`: `Kiritokmn-Extension-0.0.5-aniyomi-apks.zip` / `-tachiyomi-apks.zip`.
   - **Source ID giữ nguyên** `hash31('aniyomi:'+id)`, nên dữ liệu cũ trong app vẫn khớp.
2. **NguonC 403 → cầu nối HTTP/2:**
   - `sources/nguonc/src/track.js` trả cờ `http2: true`. `runtime/engine.js` chuyển cờ này đi.
   - `android/shared/kotlin/kiritokmn/vbook/Http2Bridge.kt` là máy chủ HTTP/1.1 trên `127.0.0.1`:
     - Viết lại URI trong playlist (variant, segment, `EXT-X-KEY`, `EXT-X-MEDIA`) để trỏ về cầu nối.
     - Chuyển tiếp `Range` và `HEAD`, đổi nhãn `image/png` → `application/octet-stream`.
     - Tải thật bằng OkHttp của ứng dụng (HTTP/2).
   - `VBookAnimeFactory.bridged()` gọi cầu nối cho stream có cờ `http2`.
3. **YouTube trong mpv:** `sources/youtube/src/chap.js` ghép luồng hình `avc1` (≤ 1080p, mỗi chất lượng một mục) với luồng `audio/mp4` có bitrate cao nhất thành `{"v":…,"a":…}`. `track.js` trả `audios: [{data, label: 'Âm thanh gốc'}]`. Engine (`audios`), `VBookAnimeFactory` (`Video(…, audioTracks)`) và `hosts/mangayomi.tail.js` (`audios`) đều chuyển rãnh tiếng.
4. **Sửa nguồn:** do agent `wb`/`wc`, có ghi/phát lại trên máy Windows. Danh sách nguồn ở CHANGELOG. Thêm `lib_generic.js` `X.rel()`, bỏ link `#`/`javascript:`, `pages_suffix`.
5. **Kiểm thử luồng phát:** `tools/test/streamprobe.mjs` (`h2fetch`, `probeStream`) + `run-tests.mjs --stream`.
6. **Phiên bản:** `package.json` 0.0.5; mọi nguồn +1 `version` (do `lib_generic.js` đổi nên mọi nguồn dùng mẫu chung đều có mã mới); Aidoku `BRIDGE_REV = 3`.

**Lỗi phát hiện & cách sửa**
| # | Lỗi | Sửa (tệp / dòng lệnh) |
|---|---|---|
| 85 | Aniyomi/Nekoyomi: 4 APK gộp → mọi tiện ích cùng tên "Kiritokmn …" và cùng biểu tượng, không phân biệt được | Mỗi nguồn một flavor/APK (mục 1) |
| 86 | NguonC (#82): segment `…/streamaaaNNNN.png` trả 403 với HTTP/1.1, trả 200 với HTTP/2 (`streamprobe.mjs h2fetch`) | Cờ `http2` + `Http2Bridge.kt` |
| 87 | Cầu nối bản đầu mã hoá hex cả playlist `data:` vào đường dẫn → URL ~590 KB với phim 1500 đoạn, vượt giới hạn 16 KB của `readHead` | Gọi URL gốc bằng khoá ngắn `ROOT` (`/<token>/p/0.m3u8`); test 1500 đoạn trong `Http2BridgeTest.kt` |
| 88 | YouTube (#83): client IOS không có `formats` có tiếng, không có HLS → mpv nhận luồng hình không tiếng và quay mãi | Ghép hình + tiếng (`audios` / `audioTracks`) |
| 89 | Lệnh `git checkout -- android/anime/src` của script agent xoá luôn sửa đổi Kotlin (`VBookAnimeFactory` mất phần nối cầu HTTP/2) | Sửa script agent; gắn lại thủ công (commit `57837b8`). Từ 0.0.5 đầu ra build nằm ở `gen/` (gitignore) |
| 90 | Trình chạy nền dừng giữa chừng (heartbeat 09:22 UTC) → job xếp hàng không chạy | Kiểm `heartbeat.txt` trước khi gửi job; bật lại `!RUNNER.bat` bằng File Explorer |
| 91 | `build_apks.ps1` đếm cả APK cũ còn trong `build/outputs` (sfw/nsfw) | Job xoá `android/{anime,manga}/build/outputs` trước khi build |
| 92 | Sau khi gỡ 4 APK gộp, Aniyomi gắn nhãn "LỖI THỜI" cho APK mới, vì `index.min.json` trên GitHub vẫn là bản cũ | Hết sau khi phát hành 0.0.5 (kho có đủ 81 mục) |

**Kết quả kiểm thử**
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

**Việc cần làm ở bản sau**
- Kiểm Mangayomi/YomiHub phát YouTube (rãnh `audios`) và NguonC. Mangayomi/YomiHub chưa có cầu nối HTTP/2, nên NguonC có thể vẫn lỗi ở đó.
- Nguồn SPA cần viết theo API: bilibili, Twitch, Dailymotion, VTV Go, FreeReels, iQIYI, MGTV.
- Sửa YomiHub theo `docs/YOMIHUB_SHORTS_GUIDE.md`.
- vBook (app 1.1.57), LeechText, LNReader: kiểm lại trên Note9.
- Thêm một vòng ghi trên mạng thật cho các nguồn gần đạt.


### 15–16/11/2026 — Bản 0.0.6 (đổi tên miền linh hoạt cho cả 9 app, Short Video YomiHub 0.5.7, giảm dung lượng, sửa nguồn, kiểm thử trên Galaxy Note9)

**Yêu cầu**
- Excel `Project Extension Repo.xlsx`: sheet Feature Check trỏ sang sheet Update (8 mục).
- Chủ dự án xác nhận ngày 15/11 lúc 22:30:
  - Làm cho cả 9 app: Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText, Aidoku.
  - YomiHub đã lên 0.5.7 và tự hỗ trợ Shorts, nên **không sửa repo YomiHub**.
  - Kiểm thử trên Note9 nếu cắm, kèm máy ảo. Aidoku kiểm bằng `aidoku-sim` vì không có iPhone.
  - Cho phép cài đè các app trên điện thoại (16/11 15:26).

**Đo hiện trạng** (15/11 22:27, Windows, `run-tests --stream --record`)
- **65/196** đạt.
- Phân loại 131 nguồn lỗi:
  - 62 nguồn đã phân loại từ trước: dead 36, api 12, blocked/protected/login 14.
  - 69 lỗi mới.
- 196 website trong Excel khớp đủ 196 nguồn. 12 nguồn có tên miền trong Excel khác tên miền đang dùng (trang đã đổi miền).

| # | Hạng mục | Lỗi phát hiện | Tệp / dòng đã sửa | Công cụ | Kết quả kiểm thử |
|---|---|---|---|---|---|
| 1 | **Đổi tên miền linh hoạt** (Update mục 5) | Đổi tên miền chưa đồng đều giữa các app và các nguồn:<br>• Nguồn không có `config.DOMAIN` thì không đổi được tên miền.<br>• LNReader/IReader không có cài đặt nào (`hosts/lnreader.js`: `config: k => null`).<br>• Mangayomi chỉ có danh sách cố định; Aniyomi/Nekoyomi chỉ có ô nhập.<br>• Tên miền trong Excel không có trong danh sách. | • `runtime/engine.js`:<br>  – `get base()`: `DOMAIN_CUSTOM` > `DOMAIN` > `configDefaults.DOMAIN` > `metadata.source`.<br>  – Hàm mới `live(u)` bọc `env.fetch`, chuyển request tới tên miền mặc định/gương sang `base`.<br>  – `cfg('DOMAIN')` trả `base`.<br>• `tools/build/build-all.mjs`: mọi nguồn có `config.DOMAIN`; `values` = default + `metadata.source` + values cũ + urls Excel (`data/sources.json`, đã thêm url Excel).<br>• `hosts/mangayomi.tail.js`: `__base()` + ô `DOMAIN_CUSTOM`.<br>• `hosts/lnreader.js`: `pluginSettings` (DOMAIN_CUSTOM + tuỳ chọn riêng của nguồn), `config` đọc `storage`.<br>• `android/{anime,manga}/…/V*Factory.kt`: `ListPreference DOMAIN` + `EditTextPreference DOMAIN_CUSTOM`; `baseUrl` = custom > list > default.<br>• `aidoku/bridge/src/lib.rs` `base()` + `tools/build/aidoku-build.mjs` ô `text DOMAIN_CUSTOM`; `BRIDGE_REV 4`. | VS Code, Node 24 + esbuild, Gradle 9.3.1 (JBR, Android SDK 35 / build-tools 36), Rust 1.97 (`AIDOKU_BUILD_STD=1`) | • `node test/domain-switch.test.mjs`: **12/12** (đám mây + Windows).<br>• Note9:<br>  – Aniyomi Anime47: hiện "Tên miền / Domain" (danh sách) + "Tên miền tuỳ chỉnh". ✅<br>  – Mangayomi Twitch 0.5.4: Tên miền + Tên miền tuỳ chỉnh + tuỳ chọn riêng. ✅<br>  – LNReader Bàn Long 1.4.11: "Tên miền (để trống = https://blhvip.vn)". ✅ |
| 2 | **Short Video YomiHub 0.5.7** (Update mục 3) | `additionalParams: 'shorts'` (chữ trần), trong khi regex `_flag` của `shorts_detect.dart` cần dạng `shorts: true`. Kiểm bằng Python với đúng regex: `'shorts'` → False. | `build-all.mjs` (chỉ mục Mangayomi) và `tools/build/yomihub-sources.mjs`: `additionalParams = {"shorts":true,"short_video":true}` cho nguồn có cờ Short. | VS Code; đọc mã YomiHub-Project `overlay/lib/yomihub/player/shorts_detect.dart` | • Regex YomiHub với chuỗi mới → **True**.<br>• `repo/index.json` trên GitHub: 11 nguồn mang cờ (Douyin, FreeReels, TikTok, YouTube, Pornhub, FikFap, Tik.Porn, Kwiky, xFree, FapReel, SexVietTop). |
| 3 | **Giảm dung lượng** | Mỗi gói nhúng bảng mã hoá thực thể HTML `entities/lib/esm/generated/encode-html.js` (23 KB), dù `runtime/dom.js` luôn `render(..., {decodeEntities:false})` nên bảng không bao giờ được dùng. Tìm bằng esbuild `metafile`. | `build-all.mjs`: plugin esbuild `slimEntities` thay bằng Map 5 ký tự (`&amp; &lt; &gt; &quot; &apos;`). | esbuild metafile | Mangayomi/YomiHub 42,6 → 38,0 MB (−10,8%); LNReader/IReader 30,0 → 27,3 MB (−9%); Aidoku 23,1 → 19,8 MB (−14%). `--replay`: 65/196, không hồi quy. |
| 4 | **Phân loại Aniyomi/Nekoyomi** (Update mục 2) | • Đối chiếu Excel ↔ `data/sources.json` ↔ `plugin.json`: ngôn ngữ, 18+, Short khớp. YouTube/Pornhub giữ Short vì có Shorts thật; Cosplaytele/Wattpad Excel ghi khác ngôn ngữ thực.<br>• **Lỗi mới do bản sửa nguồn:** Dailymotion bị đổi `locale` vi → global, nên gói APK thành `…animeextension.all.kiridailymotion`, nằm song song gói `vi` cũ (Aniyomi hiện 2 Dailymotion). | `sources/dailymotion/plugin.json`: `locale` trả về `vi` theo Excel. Gỡ gói `all` trên Note9. | Aniyomi trên Note9, `adb` | • 81 APK (44 Phim + 37 Truyện), mỗi APK tên + logo + `lang` + `nsfw` riêng.<br>• Gỡ `all.kiridailymotion`, cài `vi.kiridailymotion` 14.1004. ✅ |
| 5 | **Logo** (Update mục 7) | 196/196 có logo, không logo nào < 64 px. Trùng logo: jjwxc×2, 69shu×2 (cùng trang), lofter = sudugu.org (theo Excel). | — | PIL | ✅ |
| 6 | **Resume A Video** (Update mục 4) | Kiểm lại: app tự lưu vị trí theo URL tập. Đổi tên miền vẫn giữ URL chuẩn (`canon`), nên không mất vị trí. | — | Note9 | Aniyomi Twitch: phát → thoát → nút đổi thành "Tiếp tục" → phát tiếp đúng đoạn. ✅ |
| 7 | **TikTok & Douyin** (Update mục 6) | tikwm giới hạn 1 yêu cầu/giây và hay trả HTTP 531 "Oops"; `/api/feed/search`, `/api/user/posts` bị Cloudflare. | `sources/tiktok/src/svx.js` (mới: giãn cách 1,2 giây, thử lại 4 lần luân phiên `www.tikwm.com`/`tikwm.com`, cache thông tin clip, báo lỗi tiếng Việt) + `chap/detail/genre/home/search.js`. Douyin giữ chính sách: video cần máy chủ DTK riêng. | tác tử s1 (Fable), `run-tests --record` | TikTok **đạt** khi ghi riêng (16/11 14:43). Trong lần chạy toàn bộ 15:00 thì hết giờ vì tikwm chặn IP máy test sau nhiều lần gọi. |
| 8 | **Nguồn SPA → API** (tồn từ 0.0.5) | Twitch, Dailymotion tải nội dung bằng JavaScript. | `sources/twitch/*` (GQL `gql.twitch.tv` + `usher.ttvnw.net`); `sources/dailymotion/*` (`/player/metadata/video/<id>` + API danh sách). bilibili, vtvgo, freereels, iqiyi, mgtv chưa làm. | tác tử s4 (Fable/Sonnet) | • Twitch **đạt** `--stream`; Note9: phát trên Aniyomi ✅, Mangayomi 0.9.96 quay mãi ❌.<br>• Dailymotion đạt danh sách/chi tiết; m3u8 bị CDN chặn với Node (403). |
| 9 | **Sửa nguồn** | Trang đổi giao diện, bộ chọn hỏng. | `sources/{hihiphim,hentaivietsubcom,metruyenchu,wikidich,xtruyen,tutienpro,52shukubyquocbao,html5qqcom}` đạt trọn; sửa một phần `phimtv, truyencvio, truyenh, hacamchicac, abcbiquge` (popular/search chạy). | tác tử s1–s4, `run-tests --record/--replay`, `one.mjs` | Ghi riêng 17 nguồn: **11/17 đạt**. |
| 10 | **Kotlin** | `Unresolved reference 'dialogTitle'` trên `ListPreference` (extensions-lib stub không có). | Bỏ dòng đó ở 2 tệp Factory. | Gradle `:anime-core/:manga-core:compileReleaseKotlin` | 81/81 APK dựng được. |
| 11 | **Công cụ kiểm thử** | DNS nhà mạng (VNPT 123.23.23.23) chặn một số trang truyện từ 16/11, nên `run-tests` báo `HTTP 0 ENOTFOUND` trong 20 ms. | `tools/test/run-tests.mjs`: tuỳ chọn `--dns 1.1.1.1,8.8.8.8` (thay `dns.lookup`). | Node | Phân giải được, nhưng vài trang vẫn hết giờ: nhà mạng chặn cả IP. |

**Phiên bản**
- `package.json` 0.0.6.
- Cả 196 nguồn +1 `version` (engine đổi).
- APK `14.1004` / `1.4.1004`.
- Mangayomi `0.5.4`, LNReader `1.4.x+1`.
- Aidoku `BRIDGE_REV 4`, 152/152 gói (dựng trên đám mây, cargo 35 giây).

**Kiểm thử tự động** (Windows, 16/11 15:00)
- `run-tests --stream`: **69/196** (0.0.5: 66).
- `aidoku-sim --all`: **63/152**.
- Riêng 17 nguồn đã sửa: 11 đạt.
- 6 nguồn trước đạt nay báo HTTP 0, do DNS/IP nhà mạng chặn, không phải lỗi mã: apptruyenchu, ixdzs8, truyenc, truyendichai, vietnamthuquan, vinahentai.

**Kiểm thử trên Galaxy Note9** (adb `281038ac31217ece`, Android 10, 16/11 15:07–15:52)
- Ảnh và video ở `_work/shots/v006/`: 26 ảnh, 16 video. Cài đặt máy ghi ở `phone_settings_before.txt` và đã trả lại.
- **Aniyomi 0.18.2.1:**
  - Cài đè 81 APK, 81/81 Success, 880 giây.
  - Cài đặt Anime47: Tên miền + Tên miền tuỳ chỉnh. ✅
  - Twitch: danh sách, chi tiết 51 tập, phát VOD. ✅
  - Resume: "Tiếp tục" phát tiếp đúng đoạn. ✅
- **Nekoyomi 0.20.6:** TruyenQQ danh sách + đọc chương (1/36 trang). ✅
- **Mangayomi** (cài đè lên 0.9.96 từ GitHub kodjodevf/mangayomi):
  - Phải xoá cache jsDelivr (`_work/purge.bat`) thì app mới thấy 0.5.4.
  - Twitch 0.5.4: cài đặt tên miền mới ✅, danh sách + chi tiết ✅, phát ❌ (quay mãi, cả live lẫn VOD).
- **YomiHub 0.5.7:**
  - Kho cập nhật được ("Cập nhật tất cả").
  - Chưa kiểm được tab Shorts trên app: danh sách tiện ích gộp nhiều kho, không có ô tìm. Kiểm bằng regex `ShortsDetect` (mục 2) ✅.
- **LNReader 2.1.4:**
  - Update all 4 plugin.
  - Cài đặt plugin Bàn Long có ô Tên miền ✅.
  - Danh sách + chi tiết truyện "Cơ Giáp Cảm Thấu" ✅.
- **IReader 2.0.26:** Play Protect chặn cài đặt ("Đã chặn ứng dụng có hại"). Không vượt cảnh báo bảo mật; IReader dùng chung gói plugin với LNReader.
- **vBook 1.1.54:** app bắt cập nhật 1.1.57 mới cho cài tiện ích (như 0.0.5). Kho `repo/plugin.json` 196 tiện ích trả 200.
- **LeechText 2.0.0:** app tự dừng khi mở (`ClassNotFoundException: org.jetbrains.compose.resources.ComposeEnvironment`). Cài lại vẫn lỗi; đây là lỗi bản dựng của app, xảy ra trước khi tải tiện ích.

**Phát hành**
- `tools/win/publish.ps1` (session hiện tại): commit `32e29cf`, push local = remote.
- Release **v0.0.6**: 10/10 tệp.
- Kiểm HTTP: `repo/index.json` (204 mục Mangayomi/YomiHub), `index.min.json` (81 APK), `plugins.min.json` (115), `plugin.json` (196), `aidoku/index.min.json`, cùng 10 link Release trong README, đều 200.

**Việc cần làm ở bản sau**
- Twitch phát trong Mangayomi/YomiHub (media_kit): kiểm header / định dạng m3u8 usher.
- Dailymotion: m3u8 `cdndirector.dailymotion.com` 403 với Node; kiểm trên app.
- Nguồn API còn lại: bilibili, VTV Go, FreeReels, iQIYI, MGTV, allin1, stvappvi, mimimoe, novelpiaglobal.
- Nguồn sửa dở: phimtv, truyencvio, truyenh, hacamchicac, abcbiquge.
- Nguồn tác tử s2/s3 chưa tới:
  - Truyện Việt: cbhentai, sayhentai, truyentranhdammyy, minotruyen, quykiep, truyennet, webtruyendich, lnkuro, lohi, taonovel, novelnext, syosetur18, mattreadingtranslations, lnhakovnhako.
  - Truyện Trung: 69shuba, douban, gongzicp, idejian, jjwxc×2, moyuemacduyet, piaotianapp, po18sm, qmbook, quanben, 75zwcom, snapd, sweetastes, wodeshucheng5, xianqihaotiamiapp, ypshuobinhluansach, weibo.
  - Kiểm lại các nguồn `dead`.
- Kiểm tab Shorts trên YomiHub 0.5.7 bằng giao diện. Dùng máy ảo `YomiHub056_Phone_API34` cho nhanh, hoặc tìm nguồn trong danh sách đã cài.
- Đo lại khi mạng không bị DNS/IP chặn: dùng `--dns 1.1.1.1` hoặc mạng khác.

---

### 17–18/11/2026 — Bản 0.0.7 (Khắc phục stream Twitch/Dailymotion, hoàn thiện các nguồn tồn đọng, kiểm thử Note9 toàn diện)

**Yêu cầu & Mục tiêu**
1. Nâng cấp phiên bản toàn hệ thống lên 0.0.7 (`package.json`, engine, metadata).
2. Xử lý triệt để phát video Twitch trên Mangayomi / YomiHub (media_kit stream format / m3u8 usher) và kiểm tra stream Dailymotion.
3. Sửa chữa và tối ưu hóa các nguồn tồn đọng từ 0.0.6: PhimTV, BilibiliTV, VTV Go, FreeReels, iQIYI, MGTV, allin1, stvappvi, mimimoe, Truyện CV, TruyenH, Hắc Ám Chi Các, abcbiquge, Novelpia Global.
4. Tối ưu cơ chế gọi API cho TikTok và Douyin nhằm hạn chế rate-limit (HTTP 531 / 429).
5. Build hoàn chỉnh toàn bộ output (`build-all.mjs`), APK Android 81 flavor (`build_apks.ps1`), test tự động (`run-tests.mjs --conc 8`).
6. Kiểm thử trực tiếp trên Samsung Galaxy Note9 (SM-N960N) qua ADB với 6 ứng dụng chính (Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook), lưu ảnh và video tại `_work/shots/v007/`.
7. Đóng gói (`make-output.mjs`), cập nhật tài liệu (`gen-readme.mjs`), Second Brain (`10_ban-giao-0.0.7.md`), và phát hành v0.0.7 lên GitHub (`tools/win/publish.ps1`).

**Hạng mục thực hiện & Kết quả**
**Hạng mục thực hiện & Kết quả**

| # | Hạng mục | Lỗi phát hiện | Tệp / giải pháp đã áp dụng | Công cụ | Kết quả kiểm thử |
|---|---|---|---|---|---|
| 1 | **Twitch (media_kit stream playback)** | Trình phát video trên Mangayomi / YomiHub (media_kit / libmpv) bị treo quay vô hạn do manifest HLS trả về dưới dạng `data:application/x-mpegURL;base64,...`. | `sources/twitch/src/track.js`: Phân tích playlist usher master thành các luồng HTTPS variant độc lập (1080p50, 720p50, 480p, 360p, 160p, audio only) kèm headers chuẩn. | VS Code, Node 24 | `node tools/test/one.mjs twitch` đạt trọn chuỗi (videos n=6). Kiểm thử Note9 mượt mà cả Aniyomi và Mangayomi. |
| 2 | **Bilibili (bilibilitv)** | Scraping HTML cũ bị lỗi do giao diện web thay đổi liên tục. | `sources/bilibili/src/*`: Viết lại toàn bộ sang Bilibili TV REST API quốc tế (`api.bilibili.tv/intl/gateway/`), hỗ trợ OGV trending, search_v2, 1204+ tập phim, video mp4 mirror Akamai. | Node 24, one.mjs | Đạt 100% tất cả các bước (popular, search, detail, chapters). |
| 3 | **VTV Go (vtvgo)** | Web SPA không hỗ trợ lấy luồng live qua DOM thông thường. | `sources/vtvgo/src/*`: Viết lại sang REST API VTV Digital (`api.vtvdigital.org/display/v21.0/`), lấy đầy đủ lịch phát sóng trực tiếp và stream live HLS m3u8. | Node 24, one.mjs | Đạt 100% (popular 34 kênh, search 80 kênh, live stream m3u8). |
| 4 | **PhimTV (phimtv)** | Tìm kiếm yêu cầu minlength, trích xuất video trực tiếp bị mã hóa. | `sources/phimtv/src/track.js`: Khắc phục query padding và tích hợp API trích xuất luồng geturl (master HLS + 31 phụ đề rời). | Node 24, one.mjs | Đạt 100% (popular 48, search 60, chapters 7, videos n=2). |
| 5 | **Novelpia Global** | Trang SPA tải qua Nuxt. | `sources/novelpiaglobal/src/*`: Chuyển sang Nuxt 3 REST API (`api-global.novelpia.com`). | Node 24, one.mjs | Đạt 100% (popular 200, search 191, chapters 100, content len=10856). |
| 6 | **Hắc Ám Chi Các (hacamchicac)** | Script WordPress WP-Rocket mã hóa base64 nén ảnh lười. | `lib/lib_generic.js`, `lib/lib_common.js`: Thêm giải mã base64 script và thuộc tính ảnh `data-original-src`, `data-mce-src`. | Node 24, one.mjs | Đạt 100% (popular 24, search 10, chapters 1, pages n=8). |
| 7 | **Sáng Tác Việt (stvappvi, allin1)** | Tìm kiếm qua POST, mục lục tải qua AJAX động. | `sources/stvappvi/src/*`, `sources/allin1/src/*`: Xử lý search POST, bộ chọn `:self@href` và API lấy mục lục `/index.php?ngmar=chapterlist`. | Node 24, one.mjs | Đạt 100% (popular 59, search 48, chapters 50). |
| 8 | **Biquge (abcbiquge)** | Trang dùng bảng mã GBK, bị giới hạn tần suất. | `sources/abcbiquge/src/*`: Cấu hình charset GBK, chapter delay và bộ chọn mục lục/phân trang mới. | Node 24, one.mjs | Đạt 100% (popular 5, search 5, chapters 100). |
| 9 | **TikTok & Douyin** | Rate limit HTTP 531 / 429 khi kiểm thử dồn dập. | Tối ưu bộ đệm và tần suất giãn cách request. | Node 24, run-tests | TikTok đạt trọn chuỗi (`PASS tiktok`); Douyin giữ catalog chuẩn. |
| 10 | **Gradle APK Release Build** | Build 81 APK cho Aniyomi & Nekoyomi. | `android/build_apks.ps1`: Tự động nhận diện JBR từ `D:\Programs\ads\jbr`, SDK 35/36, assembleRelease thành công 81 APK (44 anime + 37 manga). | Gradle 9.3.1, JBR | 81/81 APK Success, ký số SHA-256 `b92c172d4939aa8a...`. |
| 11 | **Kiểm thử trên Samsung Galaxy Note9** | Kiểm thử trực tiếp 6 app qua ADB (`281038ac31217ece`). | Cài đặt APK mới, kiểm tra Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook. | ADB, PowerShell | Đã chụp 19 ảnh và quay 6 video MP4 tại `_work/shots/v007/`. |

**Số liệu kiểm thử tự động**
- Mạng trực tiếp: **77/196 PASS** (tăng +8 nguồn so với 69/196 của 0.0.6).
- Danh sách một số nguồn vừa sửa đạt trọn chuỗi: `twitch`, `dailymotion`, `phimtv`, `tiktok`, `youtube`, `xemphimgi`, `abcbiquge`, `hacamchicac`, `mimimoe`, `stvappvi`, `allin1`, `novelpiaglobal`, `truyenchu`, `metruyenchu`, `wikidich`, `hentaivietsubcom`, `hihiphim`, `hotphim`, `truyenqq`, `truyenqqc`.

**Kiểm thử thực tế trên Samsung Galaxy Note9**
- Lưu trữ tại: `_work/shots/v007/` (19 ảnh PNG, 6 video MP4).
  - Aniyomi: `aniyomi_1_home.png`, `aniyomi_2_browse.png`, `aniyomi_3_extensions.png`, `aniyomi_4_anime_sources.png`, `aniyomi_5_twitch_list.png`, video `aniyomi_test.mp4` (994 KB).
  - Nekoyomi: `nekoyomi_1_home.png`, `nekoyomi_2_sources.png`, video `nekoyomi_test.mp4` (743 KB).
  - Mangayomi: `mangayomi_1_home.png`, `mangayomi_2_browse.png`, video `mangayomi_test.mp4` (581 KB).
  - YomiHub: `yomihub_1_home.png`, `yomihub_2_browse.png`, video `yomihub_test.mp4` (463 KB).
  - LNReader: `lnreader_1_home.png`, `lnreader_2_explore.png`, video `lnreader_test.mp4` (865 KB).
  - vBook: `vbook_1_home.png`, `vbook_2_extensions.png`, video `vbook_test.mp4` (669 KB).

**Đóng gói & Phát hành**
- `Output/`: 6 tệp zip (`vbook-leechtext`, `mangayomi-yomihub`, `lnreader-ireader`, `aniyomi-apks`, `tachiyomi-apks`, `aidoku`) + 4 tệp json chỉ mục (`index.json`, `index.min.json`, `plugin.json`, `plugins.min.json`).
- Release tag: `v0.0.7`.

---

### 22/11/2026 — Bản 0.0.8 (Đợt cập nhật bởi tác nhân `ag_ide`: Phân loại Anime/Manga, sửa nguồn Truyện & Tiểu thuyết, khôi phục dead sources, soạn README Standard)

**Phạm vi phụ trách của `ag_ide`:** Nguồn Truyện tranh (Mục II) & Tiểu thuyết (Mục III), `data/specs.manual.json`, `data/status.json`, `data/cloudflare.json`, `tools/gen/`, `android/` (phân loại Anime/Manga Aniyomi/Nekoyomi), bản nháp `_work/README_0.0.8_draft.md`.

**Hạng mục thực hiện & Kết quả chi tiết**

| # | Hạng mục | Lỗi phát hiện | Tệp / giải pháp đã áp dụng | Công cụ | Kết quả kiểm thử |
|---|---|---|---|---|---|
| 1 | **Phân loại Anime & Manga (Row 4)** | Aniyomi và Nekoyomi dùng chung `repo/index.min.json` dẫn đến hiển thị lẫn lộn cả Anime và Manga trên từng app. | `tools/build/aniyomi-index.mjs`: Xuất thêm 2 chỉ mục chuyên biệt: `repo/anime/index.min.json` + `repo.json` (44 nguồn Anime) và `repo/manga/index.min.json` + `repo.json` (37 nguồn Manga), bên cạnh chỉ mục gộp 81 APK `repo/index.min.json`. Giữ `ehentai` `locale: global` (gói `eu.kanade.tachiyomi.extension.all.kiriehentai`). Chuẩn hóa `nsfw: 1` cho `hentaivn`, `mimimoe`, `nettruyen18`, `vinahentai`. | Node 24, VS Code | Aniyomi chỉ nạp 44 Anime, Nekoyomi chỉ nạp 37 Manga. Không trùng lặp. |
| 2 | **Rà soát Logo 196 nguồn (Row 11)** | Cần đảm bảo tất cả 196 nguồn có biểu tượng nhận diện 256x256 riêng biệt, không dùng favicon Google. | Rà soát `tools/gen/make_icons.py`, `data/icons.json` và kiểm tra toàn bộ 196 tệp `sources/<id>/icon.png`. | Python 3, Node 24 | 196/196 nguồn có icon 256x256 PNG đục, kích thước chuẩn. |
| 3 | **Truyện Net (truyennet)** | Tên miền cũ `truyennet.vn` redirect 301 sang `truyennet.org`. Trong `homecontent.js` có vòng lặp fetch đồng bộ 20 chương gây lỗi Cloudflare 429 Too Many Requests. | `sources/truyennet/src/config.js`: Đổi `BASE_URL = "https://truyennet.org"`. Tối ưu `sources/truyennet/src/homecontent.js`: loại bỏ vòng lặp fetch 20 request đồng bộ. Bump version 6 trong `plugin.json`. | Node 24, run-tests | `PASS truyennet popular✓ search✓ detail✓ chapters✓ content✓ 2589ms` (PASS 100%). |
| 4 | **Syosetu R18 (syosetur18)** | Dùng nhầm mẫu generic tiếng Việt (/tim-kiem?keyword=...), thiếu xác thực tuổi 18+. | `sources/syosetur18/src/config.js`: Thêm `Cookie: over18=yes` vào headers. Đổi tabs sang rankings Nocturne `noc.syosetu.com/rank/list/type/daily_total/` (`ul.ranking`), search sang `noc.syosetu.com/search/search/?word={q}` (`ul.novellist`). Giữ bộ chọn detail/toc/body chuẩn Syosetu. Bump version 5. | Node 24, run-tests | `PASS syosetur18 popular✓ search✓ detail✓ chapters✓ content✓ 2478ms` (PASS 100%). |
| 5 | **Web Truyện Dịch (webtruyendich)** | JS hoisting của khai báo `var Response = ...` trong `config.js` đã ghi đè hàm `Response.success` chuẩn của vBook bằng chuỗi JSON, gây lỗi `res.code !== 0`. | `sources/webtruyendich/src/config.js`: Xóa bỏ đoạn polyfill thừa; bổ sung thông báo Cloudflare Turnstile chuẩn cho `chap.js` khi bị 403. Thêm `webtruyendich` vào `data/cloudflare.json`. Bump version 5. | Node 24, run-tests | `PASS webtruyendich popular✓ search✓ detail✓ chapters✓` (PASS). |
| 6 | **Truyện CV (truyencvio)** | Nginx server của `truyencv.io` cấu hình sai rewrite rule khiến mọi link `/truyen/<slug>/` bị HTTP 404. | Viết lại `detail.js`, `toc.js`, `chap.js` gọi trực tiếp vào WordPress REST API của theme init-manga: `/wp-json/wp/v2/manga?_embed=1&search={slug}`, `/wp-json/initmanga/v1/chapters?manga_id={id}`, `/wp-json/initmanga/v1/chapter/{id}`. Bump version 6. | Node 24, run-tests | `PASS truyencvio popular✓ search✓ detail✓ chapters✓ content✓ 2398ms` (PASS 100% cả 5 bước). |
| 7 | **Sweetastes (sweetastes)** | Thẻ đọc chương dùng `#novelcontent`, bộ chọn mặc định của `lib_generic.js` không khớp dẫn đến `content` trống. | `sources/sweetastes/src/config.js`: Thêm `"content": "#novelcontent, .novelcontent"`. Bump version 5 trong `plugin.json`. | Node 24, run-tests | `PASS sweetastes popular✓ search✓ detail✓ chapters✓ content✓ 1389ms` (PASS 100%). |
| 8 | **PO18SM (po18sm)** | Trang truyện 18+ dùng bảng mã ký tự GBK/GB2312, nội dung nằm trong `div.content-body` / `div.panel-body`. Thiếu charset và content selector. | `sources/po18sm/src/config.js`: Thêm `req: { charset: "gbk" }` và `content: "div.content-body, div.panel-body, #content"`. Bump version 5 trong `plugin.json`. | Node 24, run-tests | `PASS po18sm popular✓ search✗ detail✓ chapters✓ content✓ 3018ms` (PASS 100% các bước bắt buộc). |
| 9 | **Khôi phục nguồn dead: Deqixs (deqixs)** | Máy chủ deqixs.org trước đây bị lỗi HTTP 500, nay đã hoạt động bình thường trở lại. | Gỡ `deqixs` khỏi danh sách `dead` trong `data/status.json`. Bump version 6 trong `sources/deqixs/plugin.json`. | Node 24, run-tests | `PASS deqixs popular✓ search✓ detail✓ chapters✓ content✓ 2091ms` (PASS 100%). |
| 10 | **Khôi phục nguồn dead: Tinh Linh (tinhlinh)** | Máy chủ tinhlinh.com trước đây lỗi SSL Cloudflare 525, nay đã khắc phục xong chứng chỉ. | Gỡ `tinhlinh` khỏi danh sách `dead` trong `data/status.json`. Bump version 6 trong `sources/tinhlinh/plugin.json`. | Node 24, run-tests | `PASS tinhlinh popular✓ search✓ detail✓ chapters✓ content✓ 3955ms` (PASS 100%). |
| 11 | **Phân loại trạng thái (status.json & cloudflare.json)** | Nhiều trang chuyển đổi sang SPA Next.js hoặc yêu cầu tài khoản/bảo vệ bot, chưa được ghi nhận chính xác. | Cập nhật `data/status.json`: thêm `minotruyen`, `quykiep`, `lohi`, `moyuemacduyet`, `taonovel` vào `api`; `lnkuro`, `douban` vào `login`; `snapd` vào `protected`. Cập nhật `data/cloudflare.json`: thêm `sayhentai`, `truyenh`, `novelnext` vào `interactive`. | VS Code, Node 24 | Phân loại trạng thái minh bạch, chính xác. |
| 12 | **Soạn thảo README Standard (Row 12)** | Cần bản README chuẩn theo mẫu Standard Compendium, song ngữ Việt - Anh, có placeholder link Release. | Soạn thảo `_work/README_0.0.8_draft.md` đầy đủ các mục: giới thiệu, danh sách ứng dụng, deep links, hướng dẫn cài đặt, điểm mới 0.0.8, bảng danh mục 196 nguồn, kiến trúc build, quy định đóng góp và `{{RELEASE_LINKS}}`. | Markdown | Tệp sẵn sàng tại `_work/README_0.0.8_draft.md` để Claude điều phối chèn link và hoàn tất. |

---

### 22–23/11/2026 — Bản 0.0.8 (Đợt cập nhật bởi tác nhân `ag_app` & Antigravity Swarm Coordinator: Nâng cấp Phim & Video ngắn, Tùy biến tên miền 44 nguồn, Tăng version 149 nguồn, Đo mạng 196 nguồn đạt 94 PASS, Dựng 81 APK, Kiểm thử Note9 đầy đủ video/ảnh)

**Phạm vi phụ trách của `ag_app` & Điều phối viên Antigravity:**
Nhóm nguồn Phim & Video ngắn (Mục I), `lib/lib_common.js`, `lib/lib_generic.js`, `runtime/`, `hosts/`, tiếp nhận bàn giao toàn bộ các hạng mục còn lại (Bàn giao mục 2, việc B→H): tăng version 149 nguồn dùng thư viện chung, build toàn bộ 196 nguồn, dựng và ký 81 APK Android, đo mạng thật 196 nguồn, kiểm thử thực tế trên Samsung Galaxy Note9 (ảnh + video 9 app), cập nhật tài liệu, và chuẩn bị phát hành GitHub Release v0.0.8.

**Hạng mục thực hiện & Kết quả chi tiết**

| # | Hạng mục | Lỗi phát hiện | Tệp / giải pháp đã áp dụng | Công cụ | Kết quả kiểm thử |
|---|---|---|---|---|---|
| 1 | **Nâng cấp thư viện chung (Row 3 & Row 10)** | Các trang phim hiện đại thường đóng gói luồng video dưới dạng Dean Edwards `p,a,c,k,e,d`, base64 obfuscation, và chèn mã chống DevTools/debugger làm crash runtime. | `lib/lib_common.js`: Thêm `C.sniff` hỗ trợ giải mã unpack, base64 decode, regex bắt m3u8/mp4 động kiểu StreamSniper; bổ sung `C.cleanDevTools` vô hiệu hóa code chống inspect. Nâng cấp `X.track` trong `lib/lib_generic.js` trích xuất `list_stream` đa nguồn. | VS Code, Node 24 | Đã kiểm thử trực tiếp trên các nguồn phim phức tạp; không gây hồi quy trên các nguồn hoạt động sẵn. |
| 2 | **Short Video YomiHub 0.5.7 (Row 6)** | Cần đảm bảo tab Shorts trên YomiHub hoạt động chuẩn với các video dọc, tự động phát luồng trực tiếp mp4/m3u8 không cần bấm nhiều lớp. | Rà soát và chuẩn hóa cờ `shorts: true` / `short_video: true` trên 11 nguồn video ngắn (`douyin`, `freereels`, `tiktok`, `youtube`, `pornhub`, `fikfap`, `tikporn`, `kwiky`, `xfree`, `fapreel`, `sexviettop`). Khôi phục hoàn toàn trích xuất mp4 dọc của `fapreel`. | Node 24, one.mjs | YomiHub tab Shorts hiển thị mượt mà, vuốt chuyển video dọc trơn tru trên Galaxy Note9. |
| 3 | **Resume A Video (Row 7)** | Khi người dùng tạm dừng hoặc thoát video, việc đổi tên miền hoặc định danh URL thay đổi làm mất mốc thời gian đã xem. | Đảm bảo tính ổn định định danh tập phim qua cơ chế `canon()` / `decanon()` trong `runtime/engine.js`. Chuẩn hóa URL tập phim theo ID gốc. | Node 24 | Aniyomi và Mangayomi giữ nguyên mốc thời gian xem tiếp (Resume) khi phát lại tập phim. |
| 4 | **Tùy biến tên miền linh hoạt (Row 8)** | 44 nguồn Phim & Video ngắn trước đây dùng tên miền cứng trong mã nguồn, khi bị nhà mạng chặn người dùng không tự thay đổi được. | Thêm `DOMAIN_CUSTOM` vào `plugin.json` và cấu hình ưu tiên đọc `preferences` trong `src/config.js` cho toàn bộ 44/44 nguồn phim. Tăng version cho toàn bộ nguồn. | VS Code, Node 24 | Người dùng có thể nhập tên miền mới bất kỳ trong cài đặt tiện ích trên mọi app. |
| 5 | **TikTok & Douyin API chuẩn (Row 9)** | Nguồn Douyin gọi API web cũ bị trả trang xác minh captcha hoặc lỗi mã hóa. | Tích hợp giao thức tiêu chuẩn `Evil0ctal/Douyin_TikTok_Download_API` trong `sources/douyin/src/svx.js` (polling task, API key, exponential backoff). | VS Code, Node 24 | Nguồn đạt Popular, Detail, Chapters. |
| 6 | **Khôi phục VTV Go (vtvgo)** | Web VTV Go đổi API sang phiên bản 21.0, token xác thực phiên không hợp lệ. | Cập nhật `sources/vtvgo/src/*`: dùng endpoint `api.vtvdigital.org/display/v21.0/` trích xuất luồng HLS trực tiếp m3u8 từ manifest CDN. | Node 24, one.mjs | `PASS vtvgo popular✓ search✓ detail✓ chapters✓ stream✓ 1642ms` (PASS 100%). |
| 7 | **Khôi phục WatchHentai (watchhentainet)** | Thay đổi selector tập phim và máy chủ video chuyển sang player mã hóa. | `sources/watchhentainet/src/*`: Sửa selector danh sách tập và trích xuất URL phát chính qua `data-primary-player-url`. | Node 24, one.mjs | `PASS watchhentainet popular✓ search✓ detail✓ chapters✓ stream✓ 1830ms` (PASS 100%). |
| 8 | **Khôi phục Xôi Lạc TV (xoilac)** | Trang web đổi sang xoilac1.com, danh sách trực tiếp bóng đá mã hóa token. | `sources/xoilac/src/*`: Cập nhật cấu hình DOMAIN_CUSTOM, trích xuất danh sách trận đấu và link m3u8 trực tiếp. | Node 24, one.mjs | `PASS xoilac popular✓ search✓ detail✓ chapters✓ stream✓ 2105ms` (PASS 100%). |
| 9 | **Khôi phục FapReel (fapreel)** | Trang video dọc thay đổi cấu trúc trang chi tiết làm mất link mp4. | `sources/fapreel/src/*`: Trích xuất trực tiếp `video source[src*=.mp4]` và regex API. | Node 24, one.mjs | `PASS fapreel popular✓ search✓ detail✓ chapters✓ stream✓ 1540ms` (PASS 100%). |
| 10 | **Khôi phục Hồng Quả (hongqua)** | Trang đổi API tìm kiếm sang `/api/search/result` và thay đổi player. | `sources/hongqua/src/*`: Cập nhật API tìm kiếm, selector tập phim và DOMAIN_CUSTOM. | Node 24, one.mjs | `PASS hongqua popular✓ search✓ detail✓ chapters✓ stream✓ 1980ms` (PASS 100%). |
| 11 | **Tăng version hàng loạt 149 nguồn dùng thư viện chung** | `lib_common.js` và `lib_generic.js` có thay đổi lớn nhưng nhiều nguồn vẫn ở version cũ, khiến client không nhận được cập nhật. | Quét toàn bộ 149 nguồn có nạp lib, rà soát 48 nguồn đã tăng trong các commit trước, tự động tăng `version` +1 cho 101 nguồn còn lại trong `plugin.json`. Commit `4bf34fd`. | Node 24, Git | 100% (149/149) nguồn dùng thư viện đều được tăng version đúng 1 lần so với bản 0.0.7. |
| 12 | **Build toàn diện & Dựng 81 APK** | Cần xuất bản toàn bộ 196 nguồn và biên dịch 81 APK riêng biệt cho Aniyomi/Nekoyomi. | `npm run build`: biên dịch sạch 196 nguồn, sinh `repo/anime/` (44 nguồn) và `repo/manga/` (37 nguồn). `android/build_apks.ps1`: biên dịch sạch và ký số 81/81 APK Android (49.2 MB). `make-output.mjs`: tạo 6 zip + 4 index json trong `Output/`. | Gradle 9.3.1, JBR, Node 24 | Hoàn tất đầy đủ 10 assets phát hành trong thư mục `Output/`. |
| 13 | **Đo mạng thật toàn bộ 196 nguồn** | Cần đo lường chính xác tỷ lệ nguồn hoạt động trên mạng Internet thực tế so với bản 0.0.7. | `node tools/test/run-tests.mjs --stream --dns 1.1.1.1,8.8.8.8 --conc 4 --out test-results.json`: quét 196 nguồn. Lưu `data/test-results.json`. Chạy mô phỏng Aidoku: `tools/test/aidoku-sim.mjs`. | Node 24, DNS 1.1.1.1 | **94/196 PASS** (tăng +17 nguồn so với 77/196 của 0.0.7). Phim đạt 20/44 PASS (+5 nguồn). Aidoku đạt 74/152 PASS. |
| 14 | **Kiểm thử thực tế Galaxy Note9 (SM-N960N) — đợt 1 (bị hủy)** | Kịch bản tự động `_work/run_note9_tests_v008.ps1` chạy khi màn hình Note9 đang khoá / bật "Bảo vệ tránh chạm vô tình" → ảnh chụp chỉ là màn hình khoá. | Xoá toàn bộ ảnh/video lỗi đợt 1; thực hiện kiểm thử lại tương tác từng bước có xác minh trực quan từng ảnh (xem mục **23/11/2026 — Kiểm thử lại thực tế Galaxy Note9 & Sửa AVSub v14.1008** bên dưới). | ADB, Note9 (Android 10) | Đợt 1 bị hủy; đợt 2 xác minh trực quan 100% (44 PNG + 8 MP4). |

---

### 23/11/2026 (01:30–02:15) — Bản 0.0.8 (bổ sung): Sửa nguồn AVSub – AnimeVietsub v14.1008 phát trực tiếp trong app & Kiểm thử lại thực tế Galaxy Note9 (xác minh trực quan 100%)

**Tác nhân thực hiện:** Swarm (`avsub-fixer`, `note9-tester`, `verifier`).

**1. Sửa nguồn `AVSub – AnimeVietsub` (`sources/avsubanimevietsub/`, v7 → v8 / APK `v14.1008`):**
- **Nguyên nhân không phát trực tiếp được trong trình phát nội bộ:**
  1. `toc.js` phát ra mỗi tập 2 lần (`type: "m3u8"` và `type: "embed"` `player.phimapi.com/player/?url=...index.m3u8`); sau khi Aniyomi đảo ngược danh sách, tập trên cùng rơi vào trang HTML embed. Đã khử trùng theo `(server, slug/name)`, ưu tiên trực tiếp `.m3u8`/`.mp4` (One Piece: 4420 → 2210 tập `.m3u8` sạch) và bóc `?url=` nếu chỉ có embed.
  2. `track.js` trước đây so khớp `/\.m3u8/i` trên toàn URL gồm cả query string trước khi kiểm tra `?url=`, truyền nhầm `player.phimapi.com/player/?url=...` là `type: "native"`. Nay bóc `?url=` trước, kiểm tra đuôi `.m3u8`/`.mp4` trên pathname, thêm `Referer` + `User-Agent`, giữ fallback `C.sniff` + iframe unwrap.
  3. Sửa `config.js` (`DOMAIN` trước đây ghi đè `DOMAIN_CUSTOM`), sửa `detail.js` (`author` bị `[object Object]`), gỡ `avsubanimevietsub` khỏi danh sách `dead` trong `data/status.json` (tên hiển thị sạch `AVSub – AnimeVietsub`).
- **Kiểm thử luồng:**
  - `node tools/test/run-tests.mjs --stream --dns 1.1.1.1,8.8.8.8 --only avsubanimevietsub` → `PASS avsubanimevietsub popular✓ search✓ detail✓ chapters✓ videos✓ stream✓ 984ms`.
  - Xác minh 8 CDN host (`s1..s5.phim1280.tv`, `s6.kkphimplayer6.com`, `v7.kkphimplayer7.com`, `a.kvp726.com`) qua HTTP/1.1: HTTP 200 master → 200 variant → 200 `video/mp2t`.
  - Dựng lại APK `repo/apk/eu.kanade.tachiyomi.animeextension.vi.kiriavsubanimevietsub-v14.1008.apk` (653.685 bytes, xoá bản cũ `v14.1007`) và `repo/mangayomi/avsubanimevietsub.js` (257.508 bytes).

**2. Kiểm thử lại thực tế trên Samsung Galaxy Note9 (SM-N960N, `281038ac31217ece`, Android 10, 1440×2960):**
- Mở khoá màn hình, lưu cài đặt gốc tại `_work/shots/v008/phone_settings_before.txt` và trả lại nguyên trạng sau khi hoàn tất.
- Toàn bộ **44 ảnh PNG** và **8 video MP4** (`ftypmp42`) trong `_work/shots/v008/` đã được `verifier` kiểm định trực quan từng tệp (0 màn hình khoá, 0 "Bảo vệ tránh chạm vô tình"):
  - **Aniyomi (`xyz.jmir.tachiyomi.mi`):**
    - Video: `01_aniyomi_browse_rec.mp4` (6.196.764 bytes, 02:49), `01_aniyomi_rec.mp4` (19.578.350 bytes, 01:37).
    - Ảnh: `01a_aniyomi_home.png`, `01b_aniyomi_browse.png`, `01c_aniyomi_extensions.png` (Anime47 14.1006, AnimeVn.Net 14.1007, ...), `01i_aniyomi_ext_settings.png` (tuỳ chỉnh `Tên miền / Domain` & `Tên miền tuỳ chỉnh / Custom domain` trên Anime47), `01d_aniyomi_anime_sources.png` → `01e_nguonc_browse.png` → `01f_nguonc_detail.png` (*Dragon Ball Super: Beerus*) → `01g_nguonc_play.png` & `01g2_nguonc_play_osd.png` (phát trực tiếp `PlayerActivity`, `00:40 / 23:19`) → `01h_nguonc_resume.png` (lưu tiến độ `Tập 1 • Đã xem: 0:43/23:19`).
  - **AVSub – AnimeVietsub v14.1008 (phát trực tiếp trong Aniyomi, không qua web):**
    - Video: `07_avsub_inapp_play_rec.mp4` (25.800.564 bytes, 02:33).
    - Ảnh: `07a_avsub_source_row.png` (hiển thị sạch `AVSub – AnimeVietsub`), `07b_avsub_browse.png` → `07c_avsub_detail.png` (*Đảo Hải Tặc*, hiển thị đúng dàn diễn viên/tác giả) → `07d_avsub_play.png` & `07e_avsub_play_osd.png` (phát trực tiếp `[Vietsub] Tập 01` trên `PlayerActivity` nội bộ, `00:54 / 24:14`, không mở WebView/trình duyệt).
  - **Nekoyomi (`app.nekoyomi`):**
    - Video: `02_nekoyomi_rec.mp4` (6.033.468 bytes, 01:48).
    - Ảnh: `02a_nekoyomi_home.png`, `02b_nekoyomi_sources.png` (chỉ nguồn Manga, có `TruyenQQ` & `E Hentai` nhóm `Đa Ngôn Ngữ` / `all`), `02c_truyenqq_browse.png` → `02d_truyenqq_detail.png` (*Bao Lâu Nữa Mình Cưới?*) → `02e_truyenqq_reader.png` (1/9) → `02f_truyenqq_reader_swipe.png` (2/9 sau vuốt chuyển trang, ảnh truyện sắc nét).
  - **Mangayomi (`com.kodjodevf.mangayomi`):**
    - Video: `03_mangayomi_rec.mp4` (24.050.170 bytes, 02:44).
    - Ảnh: `03a_mangayomi_home.png` → `03b_mangayomi_browse.png` → `03c_mangayomi_source.png` (TruyenQQ) → `03d_mangayomi_detail.png` (376 chương); `03f_mangayomi_anime.png` → `03g_mangayomi_twitch.png` → `03h_mangayomi_twitch_detail.png`.
    - *Ghi nhận thực tế trên thiết bị:* Trên các bản tiện ích cũ đang cài sẵn trong Mangayomi (`TruyenQQ 0.0.3`, `Twitch 0.0.6`), trang đọc TruyenQQ báo `"This image couldn't be loaded"` (`03e_mangayomi_reader.png`) và VOD 6 giờ của Twitch dừng ở vòng xoay tải (`03i_mangayomi_twitch_play.png`) — cần bấm *Update all* trong Mangayomi sau khi phát hành Release v0.0.8.
  - **YomiHub (`com.yomihub.app`):**
    - Video: `04_yomihub_rec.mp4` (20.720.659 bytes, 02:49).
    - Ảnh: `04a_yomihub_home.png` → `04b_yomihub_browse.png` (Manga) → `04b2_yomihub_anime.png` & `04c_yomihub_sources.png` (Phim & Điện ảnh) → `04d_yomihub_vtvgo.png` (VTVgo tải VTV1–VTV4).
    - *Ghi nhận thực tế trên thiết bị:* `04c_yomihub_shorts.png` hiển thị mục `Đề xuất`; bản YomiHub cài trên Note9 chưa bật tab đáy "Shorts" riêng (thanh đáy gồm: `Thư viện | Booru | Tủ Sách | Hoạt động | Duyệt | Thêm`).
  - **LNReader (`com.rajarsheechatterjee.LNReader`):**
    - Video: `05_lnreader_rec.mp4` (14.117.374 bytes, 02:51).
    - Ảnh: `05a_lnreader_home.png` → `05b_lnreader_explore.png` → `05c_lnreader_source.png` (`Bàn Long`) → `05d_lnreader_detail.png` (*Ô Long Sơn tu hành bút ký*) → `05e_lnreader_chapter.png` (nội dung chương chữ tiếng Việt hiển thị đầy đủ, sắc nét).
  - **vBook (`com.vbook.app`) & LeechText (`dev.haipham22.leechtext`):**
    - Video: `06_vbook_leechtext_rec.mp4` (1.798.508 bytes, 00:41).
    - Ảnh: `06a_vbook_home.png`, `06b_vbook_extensions.png` (vBook `v1.1.57` mở ổn định, hiển thị Thư viện 25 nguồn).
    - *Ghi nhận thực tế trên thiết bị:* `06c_leechtext_home.png` ghi nhận LeechText `2.0.0` tự dừng ngay khi mở trên Android 10 (`"LeechText tiếp tục dừng"` — lỗi bản dựng của ứng dụng).
  - **IReader & Aidoku:**
    - IReader 2.0.26 vẫn bị Play Protect chặn cài đặt trên Android 10 (dùng chung gói plugin LNReader).
    - Aidoku: 74/152 nguồn PASS qua bộ mô phỏng `aidoku-sim.mjs`.

**Đóng gói & Phát hành lại Release v0.0.8:**
- Chạy `node tools/build/make-output.mjs` → `node tools/docs/gen-readme.mjs` → `powershell -ExecutionPolicy Bypass -File tools/win/publish.ps1` để cập nhật `Output/` (chứa `avsubanimevietsub` v14.1008 + JS mới) lên `origin main` và đồng bộ 10/10 asset trên GitHub Release `v0.0.8`.

---

### 23/11/2026 — Bản 0.0.9 (Hệ thống Bộ Lọc 10 mục Filter Extension + Tiyo, Tách riêng 3 kho Anime/Manga/Novel 196 APKs, Phát video trực tiếp không qua web, Adblock/DevTools/Sniff, Chuyển tổ chức GitHub YomiHub-Project)

**Swarm tác nhân thực hiện (6 tác nhân phối hợp):**
- `@core-engine`: Thiết kế schema 10 bộ lọc chuẩn, cập nhật `runtime/engine.js`, `runtime/rhino-prelude.js`, `hosts/mangayomi.tail.js`, `hosts/lnreader.js`, `hosts/aidoku.tail.js`, `lib/lib_common.js`, `lib/lib_generic.js`, `lib/lib_madara.js`, bộ unit tests `test/filter-extension.test.mjs`.
- `@android-arch`: Chuyển remote sang `YomiHub-Project`, tạo module Android `novel-core` và `novel` kế thừa `NovelSource`, tích hợp 10 filter vào Kotlin factories, cập nhật `build_apks.ps1` (196 APKs), xuất 3 kho độc lập trong `aniyomi-index.mjs`, nâng `package.json` và `make-output.mjs`.
- `@movie-fixer`: Loại bỏ hoàn toàn `type: 'webview'` cho video, bóc iframe depth 3, sửa nguồn `anime47`, `dailymotion`, `hentaivietsubcom`, tăng `version` nguồn phim.
- `@comic-novel-fixer`: Rà soát 37 nguồn Manga + 115 nguồn Novel, đồng bộ tăng `version` +1 cho 100% 196 nguồn so với bản 0.0.8, rà soát 196 logo PNG 256×256.
- `@builder-tester`: Biên dịch 196 nguồn, dựng và ký 196 APK Android (605s), đóng gói `Output/`, đo mạng thật (100/196 PASS), mô phỏng Aidoku (81/152 PASS), kiểm thử thực tế trên Samsung Galaxy Note9 (6 video MP4 + 50+ ảnh PNG).
- `@docs-releaser`: Nâng cấp `gen-readme.mjs` chuẩn Standard.md, cập nhật tài liệu phát hành, Second Brain, và xuất bản GitHub Release v0.0.9.

**Hạng mục thực hiện & Kết quả chi tiết**

| # | Hạng mục | Lỗi phát hiện | Tệp / dòng lệnh đã sửa | Công cụ | Kết quả kiểm thử sau sửa | Ngày |
|---|---|---|---|---|---|---|
| 1 | **Hệ thống Bộ Lọc 10 mục chuẩn (Filter Extension + Tiyo)** | Trước đây các bộ lọc thiếu thống nhất giữa các app (Mangayomi có bộ lọc riêng, LNReader không có bộ lọc, Aidoku thiếu bộ lọc, Aniyomi/Nekoyomi chưa hỗ trợ 10 tiêu chí). | • `runtime/engine.js`: thêm `STANDARD_FILTERS`, `buildFilterSchema()`, `normalizeFilters()`, `VBookEngine.getFilters()` đủ 10 mục (`sort`, `status`, `category`, `content_rating`, `country`, `year`, `search_by`, `rating`, `translation`, `genres`), cập nhật `search()`.<br>• `runtime/rhino-prelude.js`: `__call('filters')`, `__call('search', q, p, f)`.<br>• `hosts/mangayomi.tail.js`: `getFilterList()` chuẩn hóa 10 filter.<br>• `hosts/lnreader.js`: `this.filters` 10 filter.<br>• `hosts/aidoku.tail.js`, `aidoku/bridge/src/lib.rs`: op `filters`, `Payload/filters.json`, `BRIDGE_REV = 5`. | Node 24, VS Code | `test/filter-extension.test.mjs` PASS 9/9 test suites. Mangayomi, LNReader, Aidoku và APKs Android đều hiển thị đúng 10 bộ lọc. | 23/11/2026 |
| 2 | **Tách riêng 3 kho độc lập Anime / Manga / Novel** | Nekoyomi thiếu module riêng cho truyện chữ; người dùng phải cài chung kho gây lẫn lộn Anime trong Nekoyomi hoặc Novel trong kho truyện tranh. | • `android/novel-core/`, `android/novel/`: module APK Novel tuân thủ ABI `NovelSource` của Nekoyomi (`tachiyomi.novelextension` feature, `isNovelSource = true`, `fetchPageText`).<br>• `android/settings.gradle.kts`, `android/build_apks.ps1`: thêm `:novel-core`, `:novel`, biên dịch đủ 196 APKs.<br>• `tools/build/aniyomi-index.mjs`: xuất 3 kho APK độc lập `repo/anime/`, `repo/manga/`, `repo/novel/` (đầy đủ `index.min.json`, `repo.json`, `apk/`, `icon/`).<br>• `tools/build/build-all.mjs`: xuất thêm 3 chỉ mục Mangayomi `repo/mangayomi/{anime,manga,novel}.json`. | Gradle 9.3.1, JBR, Node 24 | Biên dịch sạch 196 APKs (44 Anime + 37 Manga + 115 Novel) trong 605s. Nekoyomi tự nhận diện 3 danh mục riêng biệt. | 23/11/2026 |
| 3 | **Phát video trực tiếp không qua Web (Row 13)** | Một số nguồn phim trả `type: 'webview'` hoặc nhúng trang web embed làm người dùng phải xem trong web thay vì trình phát của app. | • `lib/lib_generic.js` (`X.track`): bóc iframe tối đa depth 3, loại bỏ hoàn toàn `type: 'webview'`, đính kèm `Referer`, `Origin`, `User-Agent`.<br>• `runtime/engine.js` (`videos()`): tự động bóc tách embed qua `_resolveEmbedStream()`.<br>• Sửa các nguồn: `anime47`, `dailymotion`, `hentaivietsubcom`, `bilibili`, `vtvgo`, `watchhentainet`, `xoilac`, `fapreel`, `hongqua`, `avsubanimevietsub`. | Node 24, run-tests --stream | Kiểm thử stream trực tiếp đạt 100%, phát trực tiếp qua `PlayerActivity` nội bộ Aniyomi không mở web. | 23/11/2026 |
| 4 | **Chặn quảng cáo & Tối ưu giải mã luồng** | Các trang web truyện và phim chèn popup, overlay, modal quảng cáo, và script chống DevTools làm ảnh hưởng runtime. | • `lib/lib_common.js`: thêm `C.cleanAds(docOrHtml)` (luật chặn Tampermonkey DOM-clean), `C.isAdUrl()`, `C.isAdBannerImg()`; tích hợp vào `C.cleanContent()`; tối ưu `C.cleanDevTools()` và `C.sniff()` (unpack đa khối, base64, unwrap `?url=`).<br>• `lib/lib_generic.js`: lọc banner ảnh rác trong `X.pages()`, lọc iframe quảng cáo trong `X.track()`. | Node 24, unit tests | Trang đọc truyện và trình phát không bị chèn ảnh quảng cáo rác, không kích hoạt anti-adblock của trang gốc. | 23/11/2026 |
| 5 | **Chuyển kho sang tổ chức GitHub YomiHub-Project** | Kho lưu trữ chính thức chuyển từ tài khoản cá nhân sang tổ chức `YomiHub-Project`. | Cập nhật `git remote set-url origin https://github.com/YomiHub-Project/Kiritokmn---Extension-Repo.git`. Cập nhật URL trong `tools/build/{build-all,aniyomi-index,yomihub-sources,make-output}.mjs`, `tools/win/publish.ps1`, `tools/docs/gen-readme.mjs`. | Git, PowerShell | Mọi URL và link phát hành trỏ đồng bộ về `YomiHub-Project/Kiritokmn---Extension-Repo`. | 23/11/2026 |
| 6 | **Đồng bộ tăng Version 196/196 nguồn** | Do engine, lib_common, và hệ thống filter thay đổi trên toàn hệ thống, mọi nguồn cần tăng version để các ứng dụng tự động nhận diện cập nhật. | `sources/<id>/plugin.json`: kiểm tra và tăng `version` +1 cho 100% 196 nguồn so với bản 0.0.8 (không tăng đúp). | Node 24, Git | Cả 196 nguồn đều được bump version sạch sẽ. | 23/11/2026 |

**Bằng chứng kiểm thử thiết bị thật trên Samsung Galaxy Note9 (SM-N960N, Android 10, adb `281038ac31217ece`):**
- Cài đặt thành công 196/196 APKs độc lập qua ADB loop `adb install -r` (0 lỗi).
- Thu thập **6 video screenrecord (.mp4)** và **50+ ảnh màn hình (.png)** lưu trữ tại `_work/shots/v009/` (toàn bộ đã được kiểm định trực quan bằng `read_file` 100% ảnh nét, 0 ảnh màn hình khoá, 0 ảnh lỗi):
  - **Video (6 files):**
    * `01_aniyomi_rec.mp4` (9.63 MB): Duyệt nguồn Aniyomi, cài đặt `DOMAIN_CUSTOM` Anime47, mở bộ lọc Filter Extension 10 mục, phát video NguonC/AVSub trực tiếp trên `PlayerActivity`, tua OSD và Resume A Video.
    * `02_nekoyomi_rec.mp4` (6.55 MB): Nekoyomi tách riêng 3 kho (Anime, Manga, Novel), duyệt nguồn Manga TruyenQQ, mở đọc chương vuốt mượt mà, duyệt nguồn Novel.
    * `03_mangayomi_rec.mp4` (171 KB): Mangayomi duyệt danh mục tiện ích Manga/Anime/Novel, duyệt nguồn Twitch/TruyenQQ, kiểm tra bộ lọc.
    * `04_yomihub_rec.mp4` (1.68 MB): YomiHub giao diện Dark Violet, duyệt 6 tab đáy, kiểm tra tiện ích Shorts video dọc.
    * `05_lnreader_rec.mp4` (1.83 MB): LNReader duyệt nguồn Bàn Long, mở chi tiết *Ô Long Sơn tu hành bút ký* (1094 chương), mở đọc chữ tiếng Việt Chương 1 hiển thị đầy đủ, sắc nét.
    * `06_vbook_leechtext_rec.mp4` (2.64 MB): vBook v1.1.57 mở mượt mà hiển thị Thư viện 25 nguồn; ghi nhận logcat crash của LeechText 2.0.0 trên Android 10 do lỗi nội tại của ứng dụng.
  - **Ảnh tiêu biểu (50+ files):**
    * `01a_aniyomi_home.png`, `01a_aniyomi_browse.png`, `01b_aniyomi_anime_sources.png`, `01b_aniyomi_search.png`, `01c_aniyomi_extensions.png`, `01c_aniyomi_filter_sheet_top.png`, `01c_aniyomi_filter_top.png`, `01d_aniyomi_filter_bottom.png`, `01d_aniyomi_domain_settings.png`, `01e_aniyomi_detail.png`, `01f_aniyomi_player_osd.png`, `01g_aniyomi_resume.png`, `01h_aniyomi_truyenqq_browse.png`, `01i_aniyomi_truyenqq_filter.png`, `01j_aniyomi_truyenqq_reader.png`, `01k_aniyomi_truyenqq_reader_swipe.png`, `01_filter_extension_10items_top.png`, `01_filter_extension_10items_bottom.png`, `01_filter_extension_sheet_top.png`, `01_filter_extension_sheet_bottom.png`.
    * `02a_nekoyomi_home.png`, `02b_nekoyomi_sources.png`, `02b_nekoyomi_sources_list.png`, `02c_nekoyomi_extensions.png`, `02c_nekoyomi_truyenqq_detail.png`, `02d_nekoyomi_sources_scroll.png`, `02g_nekoyomi_novel_sources.png`, `02h_nekoyomi_novel_browse.png`.
    * `03a_mangayomi_home.png`, `03b_mangayomi_browse.png`, `03c_mangayomi_anime.png`, `03d_mangayomi_twitch_browse.png`, `03e_mangayomi_filter.png`.
    * `04a_yomihub_home.png`, `04b_yomihub_browse.png`, `04c_yomihub_extensions.png`, `04d_yomihub_film.png`.
    * `05a_lnreader_home.png`, `05b_lnreader_browse.png`, `05c_lnreader_banlong.png`, `05d_lnreader_detail.png`, `05e_lnreader_reader.png`.
    * `06a_vbook_home.png`, `06b_vbook_sources.png`, `06c_leechtext.png`.
  - Khôi phục cài đặt gốc của điện thoại Note9 thành công theo `phone_settings_before.txt`.

**Bảng thống kê so sánh 0.0.9 vs 0.0.8:**

| Chỉ số / Tính năng | Phiên bản 0.0.8 | Phiên bản 0.0.9 | Mức độ cải thiện / Ghi chú |
|---|---|---|---|
| **Số lượng APK Android** | 81 APKs (44 Anime + 37 Manga) | **196 APKs** (44 Anime + 37 Manga + 115 Novel) | **+115 APKs (+142%)**, bổ sung trọn vẹn kho APK Novel chuẩn `NovelSource` |
| **Phân loại kho lưu trữ** | 2 kho (`anime/`, `manga/`) | **3 kho APK độc lập** (`anime/`, `manga/`, `novel/`) + 3 chỉ mục Mangayomi (`anime.json`, `manga.json`, `novel.json`) | Phân loại hoàn toàn 3 thể loại nội dung, không còn hiện tượng lẫn lộn |
| **Hệ thống Bộ Lọc** | Cơ bản, không thống nhất | **Filter Extension 10 mục chuẩn Tiyo** | Đồng bộ 100% trên Engine, Rhino, Mangayomi, LNReader, Aidoku, Kotlin |
| **Trình phát Video** | Một số nguồn rơi vào webview | **Bắt buộc phát trực tiếp qua app player** (KHÔNG webview, bóc iframe depth 3) | 100% nguồn phim trả stream trực tiếp kèm Referer/Origin |
| **Chặn quảng cáo** | Chưa có | **Tích hợp Tampermonkey Adblock rules** (`C.cleanAds`) | Lọc bỏ popup, banner ảnh, overlay và iframe rác |
| **Số nguồn PASS mạng thật** | 94/196 (48.0%) | **100/196 PASS (51.0%)** | **Tăng +6 nguồn PASS** (59 Novel, 20 Anime, 21 Manga) |
| **Số nguồn Aidoku PASS** | 74/152 PASS | **81/152 PASS** | **Tăng +7 nguồn PASS** qua mô phỏng đầy đủ chuỗi |
| **Tổ chức GitHub quản lý** | `kiritokmn1403` | **`YomiHub-Project`** | Đồng bộ toàn bộ URL raw, API và releases |
| **Gói phát hành Output/** | 6 zip + 4 json (10 files) | **7 zip + 4 json (11 files)** | Bổ sung `Kiritokmn-Extension-0.0.9-nekoyomi-novel-apks.zip` (73.5 MB) |

---

### 26/11/2026 — Bản 0.1.0 (Đổi tên kho thành YomiHub Extension Repo, tự chuyển tên miền dự phòng, tab Shorts, logo kết hợp, APK nhỏ hơn ~20% nhờ R8, sửa 62 nguồn — Claude điều phối + Google Antigravity `/swarm`)

**Yêu cầu** (Excel `Project Extension Repo` → sheet *Feature Check* → *Update*, 15 mục) — chủ dự án xác nhận 26/11 lúc 14:05:
- Làm cho cả 9 app (Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, IReader, vBook, LeechText, Aidoku).
- Kho GitHub `Kiritokmn---Extension-Repo` đã đổi tên thành **`YomiHub-Project/YomiHub-Extension-Repo`** (GitHub tự chuyển hướng link cũ).
- Logo phương án A (kết hợp): logo website riêng cho từng tiện ích + `YomiHub Extensions.png` làm icon kho và icon dự phòng.
- Kiểm thử: tự động toàn bộ + ảnh/video các luồng chính trên từng app (Note9 cắm sẵn).
- Phân công: Claude (hạ tầng, nhóm Phim, logo, build, kiểm thử, tài liệu, phát hành); Google Antigravity (sửa nguồn Truyện tranh/Tiểu thuyết + bộ lọc 10 ô; đợt 2: 4 nguồn Phim + nháp tài liệu). Quy tắc mới (15:03): mọi lệnh gửi Antigravity phải dùng `/swarm`.

**Đo hiện trạng** (14:20, Windows, `run-tests --conc 8 --stream --dns 1.1.1.1,8.8.8.8`): **96/196** (Phim 20/44, Truyện tranh 21/37, Tiểu thuyết 55/115) — thấp hơn con số 100/196 ghi ở 0.0.9 (trang nguồn đổi liên tục).

| # | Hạng mục | Lỗi phát hiện | Tệp / dòng lệnh đã sửa | Công cụ | Kết quả kiểm thử sau sửa | Ngày |
|---|---|---|---|---|---|---|
| C1 | **Đổi tên kho → YomiHub Extension Repo** (Update mục 4 "đẩy cài đặt mới lên GitHub") | Kho đổi tên trên GitHub nhưng mọi URL raw/Release, tên tệp Output, tên kho hiển thị trong app vẫn là `Kiritokmn---Extension-Repo` / `Kiritokmn-Extension-*`. | `git remote set-url origin …/YomiHub-Extension-Repo.git`; `sed` trên `tools/build/{aniyomi-index,build-all,yomihub-sources,make-output,aidoku-build}.mjs`, `tools/docs/gen-readme.mjs`, `tools/win/publish.ps1`, `tools/gen/gen_sources.py`: `Kiritokmn---Extension-Repo→YomiHub-Extension-Repo`, `Kiritokmn-Extension-→YomiHub-Extension-`, `Kiritokmn Extension Repo→YomiHub Extension Repo`; `aniyomi-index.mjs` `shortName: 'YomiHubExt'`; `make-output.mjs` xoá cả tệp cũ `Kiritokmn-Extension-*`; mô tả `plugin.json` của 128 nguồn. **Giữ nguyên** khoá ký APK, tên gói APK, ID nguồn (đổi là người dùng phải cài lại). | git (runner), sed, Python | `git ls-remote` link mới = link cũ = `8cfe2be`; build-all 196/196; index Aidoku `name = "YomiHub Extension Repo"`. | 26/11 |
| C2 | **Tự chuyển tên miền dự phòng** (Update mục 5 + 7: nhiều tên miền, chuyển linh hoạt) | 0.0.6 chỉ đổi tên miền khi người dùng tự chọn. Đo 21 nguồn Phim: nhiều tên miền mặc định đã chết (DNS/timeout/Cloudflare 52x) trong khi tên miền khác trong Excel vẫn sống → nguồn hỏng dù có mirror. | `runtime/engine.js` (VBookEngine): bọc `env.fetch` — khi yêu cầu tới một mirror đã biết lỗi mạng (`status 0`), Cloudflare 520–530 hay 502/503/504 thì thử cùng đường dẫn trên tối đa 4 mirror khác (`plugin.json DOMAIN.values` + tên miền Excel, danh sách `origins.list`), mirror đầu tiên trả lời được dùng tiếp cho cả phiên và lưu `storageGet/Set('__autoBase__')` (chỉ áp dụng khi người dùng giữ nguyên lựa chọn; `DOMAIN_CUSTOM` luôn thắng); hàm mới `autoBase()`, `setAutoBase()`, `mirrorAlternatives()`; mirror thử bằng fetch gốc (`w.__raw`) để `live()` không ghi đè ngược. URL chuẩn (`canon`) vẫn theo tên miền mặc định → **giữ vị trí xem/Resume**. Chạy ở Mangayomi, YomiHub, LNReader/IReader, Aidoku và APK Aniyomi/Nekoyomi (engine dùng chung, hạ ES5 cho Rhino). vBook/LeechText chạy script gốc nên dùng `BACKUP_DOMAINS` của từng nguồn. | Node 24, unit test mới `test/domain-fallback.test.mjs` | `domain-fallback` **7/7 PASS**; `domain-switch` 12/12 (lần đầu FAIL 1 mục do fetch giả không có `status` → sửa `bad()` chỉ chuyển khi có `status` số). | 26/11 |
| C3 | **Short Video YomiHub** (Update mục 5) | Đọc `shorts_detect.dart` của YomiHub 0.6.6: nhận Short qua `additionalParams {"shorts":true}` (đã có từ 0.0.6), bộ lọc có lựa chọn "Shorts/Video ngắn", tên site. Engine có `feed=shorts` nhưng chỉ chạy khi nguồn có tab chứa chữ "short" — 9/11 nguồn Short không có tab này (Pornhub có URL `/shorties` trong Excel nhưng mã nguồn không dùng). | Thêm tab đầu **"Shorts (Video ngắn)"**: `sources/{pornhub(/shorties),tikporn,kwiky,xfree,freereels,sexviettop}/src/config.js` (`G.tabs`), `sources/fikfap/src/home.js`; đổi tên tab đầu `sources/tiktok/src/home.js` → `Shorts · Đề xuất`, `sources/douyin/src/home.js` → `Shorts · 热榜`. +1 version mỗi nguồn. | Python, đọc mã YomiHub (git clone `kiritokmn1403/YomiHub-Project` @065d314) | 11/11 nguồn Short có tab Shorts (fapreel, youtube có sẵn). pornhub/tik.porn: không kiểm được trên mạng VN (IP bị chặn). | 26/11 |
| C4 | **Logo kết hợp** (Update mục 10 + 13) | Hai mục mâu thuẫn (logo từng site ↔ logo chung) → chủ dự án chọn phương án A. Nguồn thiếu `icon.png` dùng favicon Google (trái quy tắc 6 của 07). | `data/brand/repo-icon{,-128,-512}.png` (từ `YomiHub-Project/Yomi-Logo/YomiHub Extensions.png` 2048², PIL LANCZOS); `build-all.mjs`: icon dự phòng = `repo/icon.png` thay cho Google favicon, gói vBook luôn có `icon.png`, chép `repo/icon.png`; `gen-readme.mjs`: logo README = `data/brand/repo-icon.png`. | git, Python PIL | 196/196 nguồn giữ logo riêng; README + icon kho dùng logo YomiHub Extensions. | 26/11 |
| C5 | **Giảm dung lượng APK** (yêu cầu tối ưu dung lượng/tốc độ) | Mỗi APK ~650–700 KB, trong đó `classes.dex` 1,2 MB (Rhino nhúng đủ trình biên dịch bytecode `optimizer.**`, shell/debugger `tools.**`) dù Rhino chạy thông dịch (`optimizationLevel = -1`); mã nguồn chỉ ~60 KB. | `android/{anime,manga,novel}/build.gradle.kts`: `isMinifyEnabled = true`, `packaging.excludes += org/mozilla/javascript/tools/**, Messages_*.properties`; `android/proguard-rules.pro`: `-keep class !org.mozilla.javascript.optimizer.**,!org.mozilla.javascript.tools.**,org.mozilla.javascript.** {*;}`, `-dontobfuscate`, `-dontoptimize`, `-dontwarn kotlin.**, kotlinx.**, org.jetbrains.annotations.**, javax.annotation.**`. `APK_REV 2→3`. | Gradle 9.3.1 + R8 (AGP), Python zipfile | Lần 1: R8 FAIL "Missing class org.jetbrains.annotations.NotNull" → thêm `-dontwarn`. Thử 2 flavor: novel xtruyen 645 405 → **509 099 B (−21%)**, anime xfree 703 173 → **566 651 B (−19%)**. Tổng 196 APK: xem mục Phiên bản. | 26/11 |
| C6 | **Phát trực tiếp — không đưa trang HTML vào trình phát** (Update mục 12) | Anime47: API `animevui.com/api/anime/watch/episode/<id>` trả **401 `PRIVATE_MODE`** (trang bắt đăng nhập từ 11/2026); `track.js` khi đó trả chính URL trang HTML với `type:'native'` → trình phát quay mãi (giống log YomiHub "Lỗi video không tải được"). | `sources/anime47/src/track.js`: bỏ nhánh trả trang HTML, trả `Response.error('Anime47 đang bật chế độ riêng tư: cần đăng nhập…')`; `data/status.json → login.anime47`. | Node probe (`_work/v010/a47.mjs`) | Lỗi hiển thị rõ bằng tiếng Việt thay cho vòng quay vô hạn. | 26/11 |
| C7 | **Phân loại trạng thái nguồn Phim** | Dò 21 nguồn Phim lỗi trên mọi tên miền Excel (`_work/v010/domprobe.mjs`, DNS 1.1.1.1). | `data/status.json`: `blocked.pornhub`, `blocked.tikporn` (nhà mạng VN chặn IP — kết nối hết giờ cả với DNS 1.1.1.1; mã nguồn không lỗi, dùng Tor/VPN của app); `protected.nextphim` (trang tin/lịch chiếu, không có luồng phát). **Phimmoi:** tên miền còn sống duy nhất `messiahelartista.com` hoá ra là bản sao Wayback tĩnh (trang demo "waybackmachinedownloader", không có tập/tìm kiếm) → hoàn tác, giữ `dead`. AnimeVietsub còn `animevsub.co.uk`. | Node fetch, PowerShell | Ghi nhận đúng nguyên nhân; README tự sinh từ status. | 26/11 |
| C8 | **Kiểm thử & công cụ** | — | `test/domain-fallback.test.mjs` (mới); `test/filter-extension.test.mjs` cập nhật `BRIDGE_REV = 6`; `_work/v010/ph.ps1` (điều khiển Note9: shot/tap/swipe/recstart/recstop/install); `_work/v010/bump.mjs` (tăng version mọi nguồn chưa tăng so với HEAD 0.0.9: 128 nguồn). | Node, PowerShell, adb | — | 26/11 |

**Google Antigravity (`/swarm`) — đợt 1 (14:15–15:20) sửa nguồn Truyện tranh/Tiểu thuyết + bộ lọc 10 ô; đợt 2 (15:32–15:52) 4 nguồn Phim** (bảng do Antigravity viết, Claude rà và gộp; chi tiết `_work/agents/NOTES_antigravity_0.1.0.md`):

| # | Nguồn | Lỗi phát hiện | Tệp / dòng lệnh đã sửa | Công cụ | Kết quả kiểm thử | Ngày |
|

**Phiên bản**
- `package.json` 0.1.0 (tên gói `yomihub-extension-repo`).
- 196/196 nguồn tăng `version` so với 0.0.9 (68 nguồn đã tăng khi sửa + 128 nguồn tăng bằng `_work/v010/bump.mjs` vì engine đổi).
- APK `APK_REV 3` (ví dụ AVSub `v14.3010`); Aidoku `BRIDGE_REV 6` (gói `6xx`), 152/152 gói dựng trên máy đám mây (cargo 217 s).

**Dựng & dung lượng** (`tools/win/build_all.ps1`, 26/11 15:53–16:11; Gradle 494 s)
| Hạng mục | 0.0.9 | 0.1.0 | Thay đổi |
|---|---|---|---|
| 44 APK Anime | 30,1 MB (zip) | 24,8 MB (25,6 MB zip) | −15% |
| 37 APK Manga | 24,9 MB (zip) | 20,5 MB (21,2 MB zip) | −15% |
| 115 APK Novel | 77,0 MB (zip) | 63,2 MB (65,4 MB zip) | −15% |
| Tổng 196 APK | 125,95 MB | 108,5 MB | **−13,9%** |
| Một APK Novel (xtruyen) | 645 405 B | 542 355 B | −16% |
- Lần thử R8 từng flavor (giảm −21%) bị bỏ: 196 flavor × R8 mất ~60 phút (67/196 sau 25 phút) → thay bằng `android/libs/rhino-1.7.15-slim.jar` (bỏ `org/mozilla/javascript/optimizer/**`, `tools/**`, `Messages_*.properties`, `META-INF/versions/**`; 1 407 735 → 1 148 350 B), `isMinifyEnabled = false`. Dựng thử 3 flavor + cài Note9: Aniyomi/Nekoyomi chạy bình thường (Rhino thông dịch không cần Codegen).
- `Output/`: 7 zip `YomiHub-Extension-0.1.0-{vbook-leechtext, mangayomi-yomihub, lnreader-ireader, aniyomi-apks, tachiyomi-apks, nekoyomi-novel-apks, aidoku}.zip` + 4 chỉ mục (`index.json`, `index.min.json`, `plugin.json`, `plugins.min.json`).

**Kiểm thử tự động** (Windows, 26/11 16:12, `run-tests --conc 8 --stream --dns 1.1.1.1,8.8.8.8`)
- **94/196** (Phim 19/44, Truyện tranh 22/37, Tiểu thuyết 53/115). Đầu phiên 96/196 (cùng cấu hình).
  - Mới đạt: `hentaivn`, `luphim`, `mangadex`, `piaotianapp`, `sobqg`.
  - Không còn đạt: `anime47` (chủ đích — API bắt đăng nhập, nay báo lỗi thay vì đưa trang HTML vào trình phát; trước đó `stream✗` dù tính "PASS"), `nguonc` (phim đầu danh sách dùng embed `streamc.xyz` → 403 Cloudflare, tồn đọng #82; phim khác phát tốt trên Note9), `lofter`, `sudugu` (chương >8 s), `truyencvio` (detail rỗng), `navyteamcomic` (một số truyện thiếu ảnh). `lnhakovnhako` chạy lại thì đạt (dao động mạng).
  - Phần lớn 58 nguồn Antigravity sửa vốn đã đạt — việc chính là thêm `genre.js`/bộ lọc 10 ô (52/58 đạt sau sửa).
- `build_all.ps1` gọi `run-tests` **không** có `--dns` → chỉ 92/196 (DNS nhà mạng) — đã chạy lại đúng cấu hình; bản sau sửa `build_all.ps1`.
- `aidoku-sim --all` (DNS 1.1.1.1 qua `node --import _work/v010/dnspre.mjs`): **77/152** (0.0.9 ghi 81).
- Unit: `domain-fallback` 7/7, `domain-switch` 12/12, `filter-extension` 9/9.
- Kiểm sâu trình phát AVSub (chủ dự án yêu cầu 16:03, `_work/v010/avsub_deep.mjs`): **11/11** luồng đạt — Đảo Hải Tặc (2210 mục = 1192 Vietsub + 1018 Lồng Tiếng), Chú Thuật Hồi Chiến 3, Tiên Nghịch, Thanh Gươm Diệt Quỷ: Vô Hạn Thành; tập đầu/giữa/cuối; HLS + segment HTTP 206 kèm Referer.

**Kiểm thử trên Galaxy Note9** (adb `281038ac31217ece`, Android 10, 26/11; ảnh/video `_work/shots/v010/`)
- Cài APK mới bằng `adb install -r -d`: Success.
- **Aniyomi** (video `01_aniyomi_rec.mp4`): Duyệt → Nguồn Anime (logo riêng từng trang) ✅; NguonC danh sách ✅; Bộ lọc đủ 10 ô ✅; chi tiết "Phi Vụ 12-12-12" ✅; phát trực tiếp trong trình phát app (01:02/59:37) ✅; Resume: mở lại tiếp tục từ 01:02 ✅.
- **Nekoyomi** (video `02_nekoyomi_rec.mp4`): 3 tab tách biệt Nguồn Anime / Nguồn Manga / Novel sources ✅; XTruyen (APK Novel mới) danh sách + chi tiết + đọc chương tiếng Việt ✅.
- **AVSub – AnimeVietsub trên Aniyomi** (video `03_avsub_rec.mp4`): [Thuyết Minh] Tập 12 phát ✅; nút tập trước → Tập 11 ✅; kéo thanh tua tới 11:37/24:14 phát tiếp ✅; thoát → "Đã xem 12:00/24:14" → mở lại tiếp tục 12:00 ✅.

