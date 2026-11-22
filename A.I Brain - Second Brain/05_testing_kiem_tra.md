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

Kết quả qua các bản (mạng thật): 0.0.4: 60 · 0.0.5: 66 · 0.0.6: 69 · **0.0.7: 77/196**. Aidoku-sim 0.0.6: 63/152.

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
- 0.0.8: Đã kiểm thử tự động toàn diện qua script `_work/run_note9_tests_v008.ps1` trên Galaxy Note9 thật (SM-N960N):
  - 81/81 APK mới 0.0.8 được cài đặt thành công (81 OK, 0 FAIL).
  - 6 video screenrecord (.mp4): `01_aniyomi_rec.mp4` (4.04 MB - kiểm tra NguonC HLS, tua và Resume), `02_nekoyomi_rec.mp4` (1.11 MB - kiểm tra chỉ có nguồn Manga, đọc TruyenQQ), `03_mangayomi_rec.mp4` (836 KB - duyệt tiện ích), `04_yomihub_rec.mp4` (3.15 MB - tab Shorts video ngắn dọc và vuốt video), `05_lnreader_rec.mp4` (1.23 MB - đọc tiểu thuyết), `06_vbook_leechtext_rec.mp4` (2.66 MB - giao diện vBook/LeechText).
  - Hơn 20 ảnh chụp màn hình chi tiết từng bước lưu tại `_work/shots/v008/`.
  - Kết quả kiểm thử mạng thật: **94/196 PASS** (tăng +17 nguồn so với 77/196 của 0.0.7), Phim đạt 20/44 PASS (+5). Aidoku đạt 74/152 PASS.
