# 12 – Nhật ký phiên làm việc

Mỗi phiên thêm một mục ở **cuối tệp**: ngày, người/tác nhân, yêu cầu, đã làm, kết quả, việc tiếp theo. Chi tiết kỹ thuật ghi ở `TECHNICAL_UPDATE_NOTES.md`.

## 13/11/2026 — bản 0.0.4 (Claude, Cowork)
- Đọc 2 Excel và TECHNICAL_UPDATE_NOTES, tóm tắt rồi được xác nhận. Quyết định: không sửa YomiHub (để hướng dẫn), giữ + đánh dấu nguồn chết, kiểm thử trên máy ảo.
- Dựng trình chạy nền, record/replay; vòng sửa nguồn r1–r4: 54 → 60 nguồn đạt trên mạng thật (62 trên bản ghi).
- YouTube (InnerTube), TikTok (tikwm + máy chủ DTK), Douyin (bảng nóng + máy chủ DTK); 196 logo; `data/status.json` (37 nguồn ngừng hoạt động).
- Aidoku 152 gói dựng trên đám mây; APK 14.4/1.4.4; phát hành Release v0.0.4 (12/12 tệp).
- Máy ảo: Aniyomi (XemPhimGi phát + Resume ✅; NguonC 403 ❌; YouTube phát quay mãi ❌), Nekoyomi (TruyenQQ đọc ✅), Mangayomi (TikTok phát ✅, cài đặt DTK ✅), LNReader (Navy Team Novel đọc ✅), vBook (thêm kho ✅, cần cập nhật app để cài).
- Chủ dự án yêu cầu giữa chừng: chuyển `.vscode` + `_work` vào thư mục dự án (đã làm, có gitignore). Hỏi đổi mô hình: phiên không tự đổi được, phải chọn trong ứng dụng.

## 13/11/2026 tối — bản 0.0.5 (Claude, Cowork)
- Yêu cầu: Aniyomi/Nekoyomi phải phân biệt được từng extension; kiểm trên điện thoại thật đã cắm.
- Làm: mỗi nguồn một APK (81 APK: 44 Phim + 37 Truyện, tên + logo riêng, source ID giữ nguyên); cầu nối HTTP/2 cho NguonC; YouTube ghép hình + tiếng; sub-agent `wa`/`wb`/`wc` sửa nguồn; gộp `claude/0.0.5-fix1.diff` của phiên đám mây (ROOT key, test 18/18).
- Trình chạy nền đã dừng từ 09:22 UTC, phải bật lại bằng File Explorer. Gradle 81 APK: 412 giây lần đầu, 174 giây lần sau.
- Note9: gỡ 4 APK gộp, cài 81 APK ✅; Aniyomi hiện tên + logo riêng ✅; NguonC phát phim 1:43:26, tua, xem tiếp ✅; YouTube phát có "Âm thanh gốc" ✅; Nekoyomi nguồn manga riêng + TruyenQQ đọc ✅.
- `run-tests` mạng thật: 66/196 (0.0.4: 60).

## 15–16/11/2026 — bản 0.0.6 (Claude, Cowork)
- Đọc 2 Excel + Second Brain + notes; tóm tắt rồi được xác nhận: 9 app, không sửa YomiHub (0.5.7 đã hỗ trợ Shorts), kiểm Note9 + máy ảo, Aidoku bằng aidoku-sim.
- Đo mạng thật: 65/196. Chạy 4 tác tử song song: hết hạn mức 5 giờ 3 lần, nên chỉ sửa được 17 nguồn (11 đạt). Từ nay tự làm, tối đa 1–2 tác tử.
- Hạ tầng:
  - Đổi tên miền linh hoạt trên 9 app (`DOMAIN` + `DOMAIN_CUSTOM`, engine `live()`).
  - Cờ Short `{"shorts":true}` cho YomiHub 0.5.7.
  - Bỏ bảng `encode-html` (−10% gói).
  - `run-tests --dns`.
- Dựng: 81 APK (Gradle), Aidoku 152 gói (đám mây, Rust). Phát hành v0.0.6: commit `32e29cf`, Release 10/10.
- Note9:
  - Aniyomi: tên miền ✅, Twitch phát ✅, Resume ✅.
  - Nekoyomi: TruyenQQ đọc ✅.
  - Mangayomi 0.9.96 (cài đè): tên miền ✅, Twitch phát ❌.
  - LNReader: cài đặt plugin tên miền ✅, đọc ✅.
  - IReader: Play Protect chặn. vBook: cần 1.1.57. LeechText 2.0.0: app crash.
- Lỗi phát sinh: tác tử đổi `locale` Dailymotion vi → global, nên có APK trùng; đã trả về vi.

## 17–18/11/2026 — bản 0.0.7 (Swarm: Coordinator, Patcher, Builder, Supervisor, Monitor)
- Sửa chữa và tối ưu hóa nguồn:
  - Twitch: giải quyết triệt để lỗi treo video player trên Mangayomi/YomiHub bằng cách bóc tách m3u8 usher thành danh sách variant HTTPS streams trực tiếp.
  - Chuyển sang REST API: Bilibili (api.bilibili.tv), VTV Go (api.vtvdigital.org), Novelpia Global (api-global.novelpia.com).
  - Khắc phục các nguồn hỏng: PhimTV (stream m3u8 + 31 phụ đề), Hắc Ám Chi Các (WP-Rocket base64 decode), Mimimoe, Sáng Tác Việt (stvappvi, allin1 - ajax TOC), Biquge (abcbiquge - GBK).
- Dựng toàn bộ 196/196 nguồn sang vBook, Mangayomi, LNReader.
- Dựng 81/81 APK Android qua Gradle (`build_apks.ps1`) đạt 100% trong 220s (44 anime + 37 manga).
- Đo mạng thật: **77/196 PASS** (tăng +8 nguồn so với 69/196 của 0.0.6).
- Kiểm thử thiết bị thật Samsung Galaxy Note9 (SM-N960N): Cài đặt và kiểm thử 6 ứng dụng Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook. Thu thập 19 ảnh chụp màn hình và 6 video màn hình MP4 tại `_work/shots/v007/`.
- Đóng gói 6 release zip bundles và 4 index json vào `Output/`. Sẵn sàng phát hành Release v0.0.7.

## 18/11/2026 sáng–trưa — sau 0.0.7 (Google Antigravity `/swarm`, Claude điều phối)
- @ext_anime sửa Anime47 (API mới `/home-page/latest-episode-posts`, `/search/full/`), Phimmoi (`phimmoii.run` + tên miền dự phòng), AVSub (`animevsub.co.uk` + `anime-api.clubc.org`), AnimeVN (search AJAX POST, `trim()` URL, thử lại có backoff).
- @ext_adult sửa FikFap (header `Authorization-Anonymous`, dự phòng trang web), SexVietTop (`sexvietnam69.com`, gỡ `dead`, POST `/api/player`), Pornhub Shorts (Referer/UA/cookie tuổi).
- @verifier: `node .build/test/<id>.mjs` 7/7 đạt, `npm run build`, commit `441e6a7` (ghi nhầm "v0.5.9" — số phiên bản YomiHub). Nhật ký `_work/NOTES_swarm_0.5.9.md`.
- Commit `c919f87`: cờ `nsfw` cho hentaivn, mimimoe, nettruyen18, vinahentai; `locale` ehentai vi → global (cần quyết định, xem 11-D).
- Cả hai commit đã lên `main`; chưa có Release, chưa ghi `TECHNICAL_UPDATE_NOTES.md`/`CHANGELOG.md`.

## 18/11/2026 tối — sắp xếp lại Second Brain (Claude)
- Yêu cầu: cập nhật nội dung các tệp theo bộ 00–12 (00 bắt buộc đọc, 01 kiến trúc, 02 quy trình, 03 xây dựng bản phát hành, 04 bài học kỹ thuật, 05 kiểm tra, 06 công cụ, 07 quy tắc, 08 mẹo phiên AI, 09 điều phối tác nhân, 10 cấu trúc thư mục, 11 bàn giao, 12 nhật ký).
- Đã làm: viết lại 00–11 theo đúng chủ đề (trước đó nội dung lệch số: 01 là quy trình, 02 là công cụ, 06 là Short Video, 11 chứa phát hành + bàn giao 0.0.5 bị lặp; 03, 07–10 trống). Đổi tên `01_quy-trinh-lam-viec.md` → `01_architecture_kien_truc.md`. Bản cũ lưu ở `_work/_old/second-brain-truoc-2026-11-18/`. Sửa tên tệp 00 trong `AGENTS.md`.
- Phát hiện khi rà: runner tắt từ 16/11; 2 commit sau 0.0.7 chưa có trong notes; ehentai đổi `locale` sẽ sinh APK trùng.
- Việc tiếp theo: bản 0.0.8 (xem 11-D).
