# 01 – Kiến trúc dự án

## Ý tưởng chính
**Một định nghĩa nguồn → 9 ứng dụng.** Mỗi nguồn là một gói vBook trong `sources/<id>/` (`plugin.json` + `src/*.js`). vBook được chọn làm chuẩn vì có API phong phú nhất (Rhino + jsoup) và có sẵn khoảng 770 tiện ích cộng đồng để tham khảo. Bộ dựng chuyển gói này sang định dạng của từng app.

| Ứng dụng | Định dạng | Cách chạy | Chỉ mục trong `repo/` |
|---|---|---|---|
| vBook, LeechText, YomiHub-vBook | zip vBook gốc | Rhino của app | `plugin.json` + `vbook/*.zip` |
| Mangayomi, YomiHub | JS (`MProvider`) | engine + `hosts/mangayomi.tail.js` | `index.json` + `mangayomi/*.js` |
| LNReader, IReader | plugin CommonJS ES5 (hạ cấp bằng TypeScript) | `hosts/lnreader.js` | `plugins.min.json` + `lnreader/*.js` |
| Aniyomi (Phim), Nekoyomi (Truyện) | APK, **mỗi nguồn một APK** (từ 0.0.5) | Mozilla Rhino 1.7.15 trong APK + jsoup của app | `index.min.json` + `repo.json` + `apk/` |
| Aidoku (iOS) | gói `.aix` (từ 0.0.3) | WebAssembly Rust chạy engine JS trong `JsContext` của Aidoku | `aidoku/index.min.json` |

Số nguồn: **196** (Phim 44 · Truyện tranh 36 · Tiểu thuyết 116), lấy từ `Project Extension Repo.xlsx` → sheet *Extension Repo Main* → `data/sources.json`. Aidoku có 152 gói (chỉ truyện). APK: 44 Phim + 37 Truyện = 81.

## Các lớp
- `runtime/vbook.js`: API vBook (`fetch` + `Response` có `html()/json()/text(charset)/base64()`, `Html`, `localStorage`, `cacheStorage`, `localConfig`, `localCookie`, `Http.get().html()`…).
- `runtime/dom.js`: DOM tương thích **jsoup** trên htmlparser2 + cheerio-select (`select`, `selectFirst`, `text`, `ownText`, `attr("abs:…")`, `:contains`, `:containsOwn`, `:matches`, `:eq`, `:has`…).
- `runtime/engine.js`: điều phối chung (popular/latest/search/detail/chapters/pages/content/videos, phân trang bằng token vBook), đổi tên miền, định danh ổn định.
- `tools/build/asyncify.mjs`: chuyển script vBook đồng bộ sang async (acorn + escodegen; tự thêm `async`/`await` cho `fetch`, `sleep`, `Http.*`; callback `.map/.forEach` có await đổi sang `__amap/__aforEach`).
- `lib/`: thư viện dùng chung cho nguồn — `lib_generic.js` (mẫu nguồn generic theo `config.js` khối `var G = {...}`), `lib_madara.js`, `lib_common.js`, `lib_shortvideo.js`.
- `hosts/`: lớp ghép cho từng app (`mangayomi.tail.js`, `lnreader.js`, `aidoku.tail.js`, `node.js`/`node-runtime.js` cho kiểm thử, `entry.js`).
- `android/`: `anime-core`, `manga-core` (module thư viện Kotlin + Rhino, biên dịch một lần); `anime`, `manga` (product flavor động từ `flavors.json` do `build-all.mjs` sinh, logo nguồn → `mipmap-xxxhdpi/ic_launcher.png`); `shared/kotlin/kiritokmn/vbook/` (gồm `Http2Bridge.kt`); `stub-anime`, `stub-manga` (stub API từ `aniyomiorg/extensions-lib@14`, `mihonapp/extensions-lib@1.4.2`, compileOnly). Script vBook chạy nguyên bản bằng Rhino chế độ thông dịch (`runtime/rhino-prelude.js` + engine hạ cấp ES5).
- `aidoku/bridge` (Rust, giao thức start/poll/resume) + `hosts/aidoku.tail.js`; `tools/build/aidoku-build.mjs` dựng `repo/aidoku/`.

## Định danh & phiên bản
- APK: gói `eu.kanade.tachiyomi.{animeextension|extension}.<lang>.kiri<id>`. versionCode = 1000·APK_REV + phiên bản nguồn; versionName `14.<code>` / `1.4.<code>`. ID nguồn `hash31('aniyomi:'+id)` giữ nguyên qua mọi bản. **Đổi `locale` của nguồn = đổi tên gói = APK trùng** (xem 04).
- Aidoku: phiên bản gói = `BRIDGE_REV·100 + version nguồn` (`BRIDGE_REV = 4` từ 0.0.6).
- Mangayomi/LNReader: theo `version` trong `plugin.json` của nguồn.

## Tính năng xuyên suốt
- **Định danh ổn định** (0.0.3): `engine.js` `canon()/decanon()` — URL trả cho app luôn theo tên miền mặc định, nên thư viện, lịch sử và vị trí xem tiếp (Resume) không mất khi đổi tên miền.
- **Đổi tên miền trên cả 9 app** (0.0.6): mỗi nguồn có `config.DOMAIN` (danh sách: mặc định + `metadata.source` + gương + URL trong Excel) và ô `DOMAIN_CUSTOM`. Thứ tự ưu tiên: `DOMAIN_CUSTOM` > `DOMAIN` > `configDefaults.DOMAIN` > `metadata.source`. Hàm `live(u)` bọc `env.fetch`, chuyển request tới tên miền cũ/gương sang tên miền đang chọn (kể cả địa chỉ viết cứng trong mã).
- **HTTP/2** (0.0.5): `track.js` trả `http2: true` → APK phát qua `Http2Bridge.kt` (cầu nối loopback HTTP/1.1 → HTTP/2 qua OkHttp của app). Mangayomi/YomiHub chưa có cầu nối.
- **Rãnh tiếng rời** (0.0.5): `track.js` trả `audios: [{data, label}]` (YouTube ghép hình `avc1` + tiếng `audio/mp4`).
- **Short Video**: kho Mangayomi/YomiHub khai báo `additionalParams = {"shorts":true,"short_video":true}` cho nguồn có cờ Short (YomiHub 0.5.7 đọc bằng `ShortsDetect`).
- **Trạng thái nguồn**: `data/status.json` — `dead` (build tự gắn "(Ngừng hoạt động)" vào tên ở mọi định dạng), `blocked`, `login`, `protected`, `api` (README hiện ký hiệu). Hiện có: dead 36, api 12, protected 6, login 5, blocked 4.

## Luồng dữ liệu
Excel (`Project Extension Repo.xlsx`) → `data/sources.json`, `data/specs*.json` → `sources/<id>/` → `npm run build` (`tools/build/build-all.mjs`) → `repo/*` (GitHub, app đọc trực tiếp; YomiHub dự phòng qua jsDelivr) → `android/build_apks.ps1` (APK) → `tools/build/make-output.mjs` → `Output/` (6 zip + 4 json) → GitHub Release `v<version>`.
Tài liệu sâu hơn: `docs/SOURCE_SPEC.md`, `docs/AIDOKU.md`, `docs/YOMIHUB_SHORTS_GUIDE.md`, mục "Kiến trúc" trong `TECHNICAL_UPDATE_NOTES.md`.
