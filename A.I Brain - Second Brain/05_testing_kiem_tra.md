# 05 – Quy trình kiểm tra

## Nguyên tắc
- Không báo "đạt" khi chưa có kết quả `run-tests` hoặc chưa có ảnh/video thật trên app. Người kiểm phải tự mở ảnh/video, không chỉ đọc báo cáo của tác nhân.
- "Có link phát" chưa phải "phát được": nguồn Phim phải qua bước `stream` hoặc phát thật trên app.
- Kết quả bản trước đã cũ: luôn đo lại trên mạng thật đầu mỗi bản.

## 1. Kiểm thử tự động (Node)
| Lệnh | Dùng khi |
|---|---|
| `node tools/test/run-tests.mjs --conc 8 --dns 1.1.1.1,8.8.8.8` | Đo toàn bộ 196 nguồn (khoảng 6 phút), ghi `test-results.json` |
| `… --record <dir> --only a,b` / `--replay <dir>` | Ghi trang thật trên Windows / chạy lại y hệt trên máy đám mây |
| `… --stream` | Thêm bước `stream`: tải thử vài KB luồng phát, thử cả HTTP/2 |
| `… --out <file>` | Ghi kết quả ra tệp riêng |
| `node tools/test/one.mjs <id>` | Xem từng bước một nguồn kèm URL |
| `node tools/test/streamcheck.mjs <id…>` / `streamprobe.mjs` | Tải thử link phát kèm header |
| `node tools/test/aidoku-sim.mjs --all --conc 6` | Mô phỏng adapter Aidoku (cùng JS chạy trong JavaScriptCore) |
| `node test/domain-switch.test.mjs` | Kiểm đổi tên miền (12/12 từ 0.0.6) |
| `node .build/test/<id>.mjs` | Kiểm nhanh một nguồn đã dựng (Antigravity dùng, 18/11) |
| `tools/test/Http2BridgeTest.kt` | Test JVM cầu nối HTTP/2 (18/18; cách chạy ở đầu tệp) |

Kết quả qua các bản (mạng thật): 0.0.4: 60 · 0.0.5: 66 · 0.0.6: 69 · 0.0.7: 77/196 · **0.0.8: 94/196 (+ AVSub v14.1008 PASS 100%)**. Aidoku-sim: 0.0.6: 63/152 · **0.0.8: 74/152**.

## 2. Điều khiển thiết bị từ máy ảo Linux
- `_work/phone4.ps1` (máy ảo Android) / `_work/phone5.ps1` (Galaxy Note9): chạy qua runner bằng job một dòng `& '...\_work\phone5.ps1'` (**không** dùng Start-Process lồng trong job vì tiến trình con bị mất). Đọc lệnh từ `_work/phone_cmd.txt`; sau mỗi lô lệnh chụp `shots/phone_now.png` + `ui_now.xml`. Tắt bằng lệnh `quit`.
- Gửi lệnh: `~/pc.sh` / `~/pc5.sh "lệnh1" "lệnh2"…` → chờ `snap`, in chữ + toạ độ từ `ui_now.xml`. Log có CRLF, đếm `snap` phải `tr -d '\r'`.
- Lệnh: `launch <gói>`, `stop <gói>`, `text "Chữ đúng"`, `textc "chứa"`, `seek "Tên nguồn"` (cuộn tìm rồi chạm), `rowtapc "chữ" X` (chạm nút cùng hàng, ví dụ nút Cài ở x=985), `tap X Y`, `swipe`, `type <chữ>`, `key 4` (Back), `url <deeplink> <gói>`, `shot <tên>`, `rec <tên>` / `recstop` (screenrecord, mỗi đoạn 170 giây).
- `ui_now.xml` bị cũ (uiautomator không dump được trình phát mpv và vài màn hình) → stage `phone_now.png` về xem ảnh.
- Nút ← của app (79,136) đáng tin hơn `key 4` khi đang mở bàn phím.
- Trước chuỗi chạm: chụp màn hình kiểm trước — hộp thoại hệ thống (Google xác minh đăng nhập) có thể đè lên app.

## 3. Thiết bị
- **Máy ảo** `Medium_Phone_API_37.0` (x86_64, 1080×2400): khởi động `_work/emu_start.ps1` (khoảng 45 giây). APK x86_64 của các app ở `_work/apks/`.
- **Galaxy Note9** `SM-N960N`, Android 10, 1440×2960, adb `281038ac31217ece`. Xiaomi 15T cắm cùng lúc không hiện trong `adb devices` (chưa bật gỡ lỗi USB).
  - **Trước khi kiểm**: ghi cài đặt máy vào `shots/v<ver>/phone_settings_before.txt` (xoay màn hình, độ sáng, hoạt ảnh, giữ màn hình sáng). **Sau khi kiểm**: trả lại đúng như cũ.
  - Aniyomi giữ màn hình ngang khi thoát trình phát → trong lúc kiểm khoá dọc (`accelerometer_rotation 0`, `user_rotation 0`), xong bật lại `accelerometer_rotation 1`.
  - `adb install` 81 APK: 7 phút (cài mới) đến 880 giây (cài đè). Log job chỉ ghi khi xong; xem tiến độ bằng job khác đếm `pm list packages | Select-String kiri`.
  - Cài APK qua adb trên máy thật: Aniyomi không hỏi "Trust" nhưng gắn **LỖI THỜI** nếu kho trên GitHub chưa có gói đó (hết sau khi phát hành).

## 4. Thiết lập lần đầu từng app
- **Aniyomi / Nekoyomi**: Next → *Select a folder* → Documents → USE THIS FOLDER → ALLOW → Next → Get started. Extensions: bấm **Trust** cho từng APK (máy ảo cài bằng adb là "UNTRUSTED"). Sources → Filter (1006,147) → bật Global / Tiếng Việt / 中文.
- **Mangayomi**: kéo xuống **từ đầu danh sách** Extensions để làm mới → *Update all*. Danh sách "chưa cài" có thể hiện phiên bản cũ; mục đã cài thì đúng. Chưa thấy bản mới → xoá cache jsDelivr.
- **YomiHub**: "Cập nhật tất cả" trong kho. Danh sách tiện ích gộp nhiều kho, không có ô tìm.
- **LNReader**: theme → Complete. Thêm kho bằng deep link `lnreader://repo/add?url=<plugins.min.json>`. ⋮ → Browse Settings → Languages → bật **Tiếng Việt**.
- **vBook**: Library → ⋮ → Repository manager → `+` → dán URL `repo/plugin.json` → OK (đừng bấm ESC). Nút ⬇ bên phải mỗi kho là **xoá kho**. vBook 1.1.54 bắt cập nhật 1.1.57 mới cho cài tiện ích.
- **IReader 2.0.26**: Play Protect chặn cài ("Đã chặn ứng dụng có hại") — không vượt cảnh báo bảo mật; IReader dùng chung gói plugin với LNReader.
- **LeechText 2.0.0**: app tự dừng khi mở (`ClassNotFoundException: org.jetbrains.compose.resources.ComposeEnvironment`) — lỗi bản dựng của app.
- **Aidoku**: không có iPhone → kiểm bằng `aidoku-sim`.

## 5. Kịch bản kiểm từng tính năng
- **Phát video**: danh sách → chi tiết → phát; tua bằng `swipe` chậm (800 ms) từ nút tròn của thanh tua mpv (chạm không tua được).
- **Rãnh tiếng**: đang phát → chạm giữa màn hình → biểu tượng ♪ góc trên phải → phải có "#1: Âm thanh gốc".
- **Resume A Video**: phát khoảng 20 giây → Back → tập hiện `m:ss/tổng`, nút đổi thành "Tiếp tục" → mở lại phát tiếp đúng mốc.
- **Đổi tên miền**: mở cài đặt nguồn → có "Tên miền" (danh sách) + "Tên miền tuỳ chỉnh"; đổi rồi tải lại danh sách.
- **Tên + logo riêng** (APK): Aniyomi/Nekoyomi → Extensions hiện đúng tên, logo, ngôn ngữ, nhãn 18+ từng nguồn.

## 6. Bằng chứng
- Ảnh/video lưu ở `_work/shots/v<ver>/` (`v003` … `v008`), kèm `phone_settings_before.txt`. Liệt kê tên tệp trong `TECHNICAL_UPDATE_NOTES.md`.
- 0.0.7: 19 ảnh + 6 video (mỗi app 1 video 0,5–1 MB) — chủ yếu là màn hình chính/duyệt.
- 0.0.8 (kiểm thử lại tương tác, xác minh trực quan 100% trên Galaxy Note9 SM-N960N, Android 10 — bài học: **TUYỆT ĐỐI KHÔNG chạy script ADB mù không xem ảnh**, đợt 1 chạy khi màn hình khoá / "Bảo vệ tránh chạm vô tình" đã phải huỷ và làm lại):
  - 81/81 APK 0.0.8 + `avsubanimevietsub-v14.1008.apk` cài đặt thành công; cài đặt máy lưu ở `phone_settings_before.txt` và trả lại nguyên trạng sau khi kiểm.
  - **8 video screenrecord (.mp4, `ftypmp42`)** + **44 ảnh chụp màn hình (.png)** đã được kiểm định trực quan từng tệp tại `_work/shots/v008/`:
    - `01_aniyomi_browse_rec.mp4` (6.2 MB, 02:49) & `01_aniyomi_rec.mp4` (19.6 MB, 01:37) + `01a..01i`: Aniyomi duyệt nguồn, tuỳ chỉnh `Tên miền / Custom domain` (Anime47), NguonC phát HLS `PlayerActivity` (`00:40/23:19`) và lưu Resume (`Đã xem: 0:43/23:19`).
    - `07_avsub_inapp_play_rec.mp4` (25.8 MB, 02:33) + `07a..07e`: **AVSub – AnimeVietsub v14.1008** phát trực tiếp `[Vietsub] Tập 01` (*Đảo Hải Tặc*, `00:54/24:14`) bằng trình phát nội bộ Aniyomi, không mở WebView/web.
    - `02_nekoyomi_rec.mp4` (6.0 MB, 01:48) + `02a..02f`: Nekoyomi chỉ có Manga (gồm `E Hentai` đa ngôn ngữ), TruyenQQ mở & vuốt đọc trang 1/9 → 2/9 sắc nét.
    - `03_mangayomi_rec.mp4` (24.0 MB, 02:44) + `03a..03i`: Mangayomi duyệt TruyenQQ & Twitch thành công (ghi nhận trung thực: bản tiện ích cũ `0.0.3`/`0.0.6` cài sẵn trên máy lỗi ảnh TruyenQQ & quay vòng VOD Twitch 6h, cần *Update all* sau Release).
    - `04_yomihub_rec.mp4` (20.7 MB, 02:49) + `04a..04d`: YomiHub duyệt Manga/Video, VTVgo tải VTV1–VTV4 (bản cài trên máy chưa bật tab đáy Shorts riêng).
    - `05_lnreader_rec.mp4` (14.1 MB, 02:51) + `05a..05e`: LNReader duyệt `Bàn Long`, mở chi tiết & đọc chương *Ô Long Sơn tu hành bút ký* mượt.
    - `06_vbook_leechtext_rec.mp4` (1.8 MB, 00:41) + `06a..06c`: vBook `v1.1.57` hiển thị Thư viện 25 nguồn; LeechText `2.0.0` tự dừng khi mở trên Android 10 (lỗi app).
  - Kết quả kiểm thử mạng thật: **94/196 PASS** (+17 nguồn so với 0.0.7) + `avsubanimevietsub` v14.1008 PASS 100% (`--stream`). Aidoku đạt 74/152 PASS.
