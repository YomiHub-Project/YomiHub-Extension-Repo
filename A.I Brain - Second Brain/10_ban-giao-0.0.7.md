# 10 – Bàn giao bản 0.0.7 (đã phát hành 18/11/2026)

Tóm tắt kết quả và việc còn lại: xem `TECHNICAL_UPDATE_NOTES.md` → mục 0.0.7 (bảng chi tiết nguồn, kết quả kiểm thử trên Samsung Galaxy Note9, metrics).

## 0.0.7 (18/11/2026) — Bài học & Điểm nhấn kỹ thuật
1. **Khắc phục video Twitch trên Mangayomi / YomiHub (media_kit / libmpv):**
   - Bản 0.0.6 sử dụng data URI (`data:application/x-mpegURL;base64,...`) cho usher master playlist, khiến media_kit (libmpv) trên Flutter bị treo vô hạn (vòng quay tải vô tận).
   - Bản 0.0.7: bóc tách manifest trực tiếp thành các luồng HTTPS chuẩn (`https://*.playlist.ttvnw.net/...m3u8`) kèm đầy đủ HTTP Headers (User-Agent, Origin, Referer). Cho phép chọn độ phân giải mượt mà trên cả Aniyomi (ExoPlayer) lẫn Mangayomi (media_kit).
2. **Dailymotion & PhimTV stream direct:**
   - Dailymotion: chuẩn hóa luồng phát qua `cdndirector.dailymotion.com` và tải phụ đề rời .srt.
   - PhimTV: tích hợp extractor trực tiếp qua `moviking.ayama.fun/geturl`, trích xuất master HLS m3u8 và 31 phụ đề rời đa ngôn ngữ.
3. **Chuyển đổi nguồn SPA sang REST API chính thức:**
   - Bilibili: thay thế toàn bộ DOM parser cũ sang Bilibili International REST API (`api.bilibili.tv/intl/gateway/`), hỗ trợ xem danh mục OGV, tìm kiếm search_v2, 1204+ tập phim và đa luồng mp4 Akamai mirror.
   - VTV Go: chuyển từ SPA sang REST API của VTV Digital (`api.vtvdigital.org/display/v21.0/`), lấy đầy đủ lịch phát sóng trực tiếp và stream live HLS m3u8.
   - Novelpia Global: chuyển sang Nuxt 3 REST API (`api-global.novelpia.com`).
4. **Vượt qua obfuscation JavaScript và minification:**
   - Hắc Ám Chi Các: giải mã script base64 của WordPress WP-Rocket, xử lý các thuộc tính ảnh lười `data-original-src` và `data-mce-src`.
   - Sáng Tác Việt (`stvappvi`, `allin1`): xử lý search POST và API lấy mục lục AJAX động (`/index.php?ngmar=chapterlist`).
   - Biquge (`abcbiquge`): cấu hình giải mã GBK, delay chương và bộ chọn mục lục.
5. **Cơ chế DNS phân giải chống chặn nhà mạng:**
   - Tiếp tục duy trì và mở rộng tuỳ chọn `--dns 1.1.1.1,8.8.8.8` trong `run-tests.mjs` và `one.mjs`. Giúp vượt qua việc DNS nhà mạng tại Việt Nam chặn các tên miền đọc truyện.
6. **Kiểm thử thiết bị Samsung Galaxy Note9 (SM-N960N):**
   - 81/81 APK Android biên dịch hoàn tất và ký số SHA-256 (`b92c172d4939aa8a...`).
   - Cài đặt và kiểm thử trực tiếp trên 6 ứng dụng: Aniyomi, Nekoyomi, Mangayomi, YomiHub, LNReader, vBook.
   - Toàn bộ ảnh chụp màn hình (19 ảnh) và video quay màn hình (6 file MP4) được lưu trữ đầy đủ tại `_work/shots/v007/`.
7. **Kết quả kiểm thử tự động toàn diện:**
   - Mạng trực tiếp: **77/196 nguồn đạt trọn vẹn** (tăng +8 nguồn so với 69/196 của bản 0.0.6).

## Việc cần làm ở bản sau (0.0.8)
- Xây dựng giải pháp reverse proxy hoặc ký API nội bộ cho các nguồn video di động có DRM/chống bot phức tạp: iQIYI, MGTV, FreeReels.
- Kiểm tra các nguồn đang gặp lỗi tên miền WordPress (như TruyệnCV.io) khi quản trị viên cập nhật permalinks.
- Cải thiện tốc độ tải cho các nguồn có Cloudflare Turnstile tương tác.
