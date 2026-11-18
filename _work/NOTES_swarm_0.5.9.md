# Kế hoạch & Nhật ký nâng cấp Tiện ích Extension Repo v0.5.9 (Swarm Sprint)

**Thời gian khởi tạo:** 18/11/2026  
**Mục tiêu:** Kiểm tra, sửa lỗi, nâng cấp và đồng bộ 7 tiện ích trọng điểm trong `sources/` nhằm chuẩn bị phát hành v0.5.9 cho YomiHub Extension Repo.  
**Đơn vị điều phối & thực hiện:** Swarm Team (Coordinator: @coordinator, Anime/Phim: @ext_anime, 18+/Shorts: @ext_adult, Verifier & Release: @verifier).

---

## 1. Danh sách tiện ích & Nhiệm vụ phân công

| STT | Tiện ích | Thư mục | Người phụ trách | Vấn đề cần khắc phục | Phiên bản mới | Trạng thái |
|:---:|:---|:---|:---:|:---|:---:|:---:|
| 1 | **Anime47** | `sources/anime47` | `@ext_anime` | API mặc định `https://animevui.com/api` trả HTML 404 do SPA Quasar/Vue3. Chuyển sang endpoint `/home-page/latest-episode-posts` và `/search/full/?keyword={q}&page={p}`. Bổ sung `requestApiJson()` bắt HTML báo lỗi và đóng gói metadata hash URL xử lý private mode. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 2 | **Phimmoi** | `sources/phimmoi` | `@ext_anime` | Tên miền cũ `messiahelartista.com` TLS handshake EOF / rỗng luồng phát. Chuyển sang `https://phimmoii.run` và danh sách domain dự phòng (.beer, .vc, .mom, .bid). Thêm cơ chế `fetchWithDomainFallback` tự động đổi URL, cập nhật selector `.flw-item` và bóc tách luồng direct m3u8. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 3 | **AVSub** | `sources/avsubanimevietsub` | `@ext_anime` | Tên miền cũ lỗi TLS handshake EOF / ENOTFOUND / Cloudflare chặn. Cập nhật tên miền `https://animevsub.co.uk` cùng backend API `https://anime-api.clubc.org`. Danh sách domain dự phòng và `fetchWithDomainFallback`, bóc tách luồng direct 1080p HLS. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 4 | **AnimeVN** | `sources/animevnnet` | `@ext_anime` | Search GET /search thất bại (trang dùng AJAX POST `/search/html/{p}`). URL dính khoảng trắng gây `ConnectionAborted`. Chuẩn hóa `trim()`, chuyển search sang AJAX POST, bổ sung `fetchWithRetry` (exponential backoff), chuẩn hóa selector tập `li.citem a`, bóc tách Hydrax / AnimeVn player và báo lỗi rõ ràng khi tập chưa có link. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 5 | **FikFap** | `sources/fikfap` | `@ext_adult` | `api.fikfap.com` trả 404 ở `getDetail`. Cập nhật header `Authorization-Anonymous` UUID token + Desktop UA; thêm Web fallback `https://fikfap.com/post/{id}` parse ld+json/og meta; sửa `track.js` stream native URL kèm headers `Referer: https://fikfap.com/` và `User-Agent`. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 6 | **SexVietTop** | `sources/sexviettop` | `@ext_adult` | `getVideoList` báo 'không lấy được link phát'. Cập nhật domain hoạt động `https://sexvietnam69.com` (gỡ cờ status dead); viết lại `track.js` parse `data-video-id` & `data-server-id`, POST `/api/player` lấy sources JWPlayer/HLS, regex fallback stream `.m3u8` / `.mp4`. | v5 | ✅ Đã kiểm thử đạt (PASS) |
| 7 | **Pornhub Shorts** | `sources/pornhub` | `@ext_adult` | Shorts Pornhub luồng HLS `master.m3u8` phát qua proxy `127.0.0.1` bị CDN chặn. Bổ sung header `G.req` UA, Referer `https://www.pornhub.com/`, cookie age disclaimer; `track.js` trả header stream `{ Referer, User-Agent }`. Kế thừa UA vào `lib/lib_generic.js`. | v5 | ✅ Đã kiểm thử đạt (PASS) |

---

## 2. Kế hoạch kiểm thử & Quy trình đóng gói (@verifier)

1. **Khởi tạo kế hoạch:** Tạo tài liệu `_work/NOTES_swarm_0.5.9.md` theo dõi tiến trình của từng tác tử.
2. **Tiếp nhận kết quả & Xác thực:**
   - Đọc kết quả cập nhật từ `@ext_anime` và `@ext_adult` trên bảng thông báo chung.
   - Ghi nhận chi tiết tệp sửa đổi, diff, phiên bản mới trong `plugin.json`.
3. **Chạy kiểm thử cục bộ độc lập:**
   - `node .build/test/anime47.mjs`
   - `node .build/test/phimmoi.mjs`
   - `node .build/test/avsubanimevietsub.mjs`
   - `node .build/test/animevnnet.mjs`
   - `node .build/test/fikfap.mjs`
   - `node .build/test/sexviettop.mjs`
   - `node .build/test/pornhub.mjs`
4. **Đóng gói Repo (Build):**
   - Chạy `npm run build` tại thư mục gốc Extension Repo để biên dịch lại mã nguồn các nguồn và tạo `repo/index.json`.
   - Kiểm tra tính toàn vẹn của `repo/index.json`.
5. **Kiểm tra trạng thái & Git Commit:**
   - Kiểm tra `git status` đảm bảo không có file lạ rác.
   - Thực hiện `git commit` cục bộ (tuyệt đối KHÔNG push remote).
6. **Báo cáo tổng kết:**
   - Cập nhật nhật ký hoàn chỉnh và báo cáo cho `@coordinator`.

---

## 3. Nhật ký cập nhật chi tiết từng tiện ích

| Thời gian | Tiện ích | Tác tử | Tệp thay đổi | Mô tả thay đổi / Dòng lệnh sửa | Kết quả kiểm thử (.build/test/) | Trạng thái xác nhận |
|---|---|---|---|---|---|---|
| 08:54 | **FikFap** | `@ext_adult` | `plugin.json` (v5), `config.js`, `home.js`, `browse.js`, `search.js`, `detail.js`, `toc.js`, `chap.js`, `track.js` | Endpoint `api.fikfap.com` với header `Authorization-Anonymous` UUID token + Desktop UA; thêm Web fallback `https://fikfap.com/post/{id}` parse ld+json/og meta; sửa track.js headers Referer/UA | `PASS fikfap popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 08:54 | **SexVietTop** | `@ext_adult` | `plugin.json` (v5), `config.js`, `track.js`, `data/status.json` | Cập nhật domain `https://sexvietnam69.com` (gỡ cờ status dead); viết lại track.js parse data-video-id / server-id, POST `/api/player` lấy sources JWPlayer/HLS, regex stream fallback | `PASS sexviettop popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 08:54 | **Pornhub Shorts** | `@ext_adult` | `plugin.json` (v5), `config.js`, `track.js`, `lib/lib_generic.js` | Header `G.req` bổ sung UA, Referer `https://www.pornhub.com/`, cookie age disclaimer; track.js trả header stream `{ Referer, User-Agent }` khắc phục CDN 127.0.0.1 proxy | `PASS pornhub popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 09:15 | **Anime47** | `@ext_anime` | `plugin.json` (v5), `src/config.js`, `src/browse.js`, `src/search.js`, `src/detail.js`, `src/toc.js`, `src/track.js` | Endpoint `/home-page/latest-episode-posts`, search `/search/full/?keyword={q}&page={p}`; `requestApiJson()` phát hiện HTML báo lỗi; hash metadata detail/toc cho private mode | `PASS anime47 popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 09:15 | **Phimmoi** | `@ext_anime` | `plugin.json` (v5), `src/config.js`, `src/browse.js`, `src/search.js`, `src/detail.js`, `src/toc.js`, `src/track.js` | Domain chính `https://phimmoii.run`, fallback `.beer`, `.vc`, `.mom`, `.bid`; `fetchWithDomainFallback`; selector `.flw-item`, direct m3u8 stream | `PASS phimmoi popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 09:15 | **AVSub** | `@ext_anime` | `plugin.json` (v5), `src/config.js`, `src/browse.js`, `src/search.js`, `src/detail.js`, `src/toc.js`, `src/track.js` | Domain chính `https://animevsub.co.uk`, API `https://anime-api.clubc.org`; danh sách fallback domain; direct 1080p HLS stream | `PASS avsubanimevietsub popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |
| 09:15 | **AnimeVN** | `@ext_anime` | `plugin.json` (v5), `src/config.js`, `src/browse.js`, `src/search.js`, `src/detail.js`, `src/toc.js`, `src/track.js` | Search AJAX POST `/search/html/{p}`; trim whitespace URL chống ConnectionAborted; `fetchWithRetry` backoff; selector `li.citem a`; Hydrax / AnimeVn player | `PASS animevnnet popular✓ search✓ detail✓ chapters✓ videos✓` | ✅ Đạt |

---

## 4. Kết quả kiểm tra toàn diện (@verifier)

- [x] `node .build/test/anime47.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/phimmoi.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/avsubanimevietsub.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/animevnnet.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/fikfap.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/sexviettop.mjs` (PASS popular✓ search✓ detail✓ chapters✓ videos✓)
- [x] `node .build/test/pornhub.mjs` (PASS popular✓ detail✓ chapters✓ videos✓)
- [x] `npm run build` (Hoàn thành build 196/196 sources, cập nhật `repo/index.json`, `repo/mangayomi/`, `repo/vbook/`, `repo/lnreader/`, `repo/yomihub/`)
- [x] Local git commit
