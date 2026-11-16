# 09 – Bàn giao bản 0.0.6 (đã phát hành 16/11/2026)

Tóm tắt kết quả và việc còn lại: xem `TECHNICAL_UPDATE_NOTES.md` → mục 0.0.6 (bảng 11 hạng mục, kiểm thử Note9, "Việc cần làm ở bản sau").

## 0.0.6 (15–16/11/2026) — bài học
- **Hạn mức 5 giờ dùng chung cho cả phiên**, mọi mô hình (Fable, Sonnet, Opus) và mọi tác tử phụ đều tính vào. Chạy 4 tác tử song song làm hết hạn mức sau khoảng 1 giờ, 3 lần liền. Mỗi lần mỗi tác tử chỉ sửa được 1–3 nguồn.
  - Từ nay: **tối đa 1–2 tác tử**.
  - Bắt tác tử lưu bản vá sau **mỗi** nguồn.
  - Việc hạ tầng (engine, host, build) tự làm, không giao cho tác tử.
- **Bộ kiểm duyệt lệnh (auto mode classifier) có lúc lỗi hàng loạt** ("gave no verdict"). Quá 10 lần liền thì lượt làm bị dừng. Khi gặp: chờ 1–2 phút (`computer_wait`), trong lúc đó dùng công cụ chỉ đọc hoặc `Write`; `device_bash` đôi khi vẫn chạy khi `Bash` trên đám mây bị chặn.
- **Sau khoảng nghỉ dài** (máy ngủ, hết hạn mức): mất quyền điều khiển máy, mất quyền xoá tệp, trình chạy nền dừng (heartbeat cũ). Thứ tự khôi phục:
  1. `computer_resolve_access` → `computer_request_access`.
  2. `device_request_delete_permission`.
  3. File Explorer → This PC → DATA (D:) → A.I Project → A.I Project - Extension Repo → Kiritokmn - Extension Repo → `_work` → bấm đúp **biểu tượng** `!RUNNER.bat`. Bấm đúp vào *tên* sẽ vào chế độ đổi tên; khi đó bấm ra chỗ trống để thoát.
  4. Zalo hoặc cửa sổ Claude có thể che File Explorer: mở lại File Explorer bằng `computer_open_application`.
- **Note9 báo `offline`** khi chưa bấm "Cho phép gỡ lỗi USB". Thử `adb kill-server`, `adb reconnect offline`, rồi nhờ chủ dự án bấm cho phép.
- **Play Protect trên Note9 chặn IReader 2.0.26** ("Đã chặn ứng dụng có hại"). Không vượt cảnh báo bảo mật; IReader dùng chung gói với LNReader nên kiểm bằng LNReader.
- **DNS nhà mạng (VNPT 123.23.23.23) chặn một số trang truyện** từ 16/11 (truyenc.net, vnthuquan.org, vinahentai…), nên `run-tests` báo `HTTP 0` chỉ sau 20 ms. Dùng `run-tests --dns 1.1.1.1,8.8.8.8` (thêm ở 0.0.6). Nếu vẫn hết thời gian chờ thì nhà mạng chặn cả IP; ghi chú cho người dùng bật Private DNS.
- **tikwm.com:** giới hạn 1 yêu cầu/giây; gọi nhiều trong ngày thì bị chặn theo IP vài giờ. Đừng chạy `--stream` TikTok liên tục; kiểm TikTok riêng, `--conc 1`.
- **`device_bash` mặc định chờ 120 giây.** Job dài thì đặt `timeout_ms: 180000` hoặc gửi job với thời gian chờ 3–5 giây rồi kiểm `.done` sau.
- **PowerShell `>` làm hỏng tệp nhị phân** (screencap). Dùng `adb shell screencap -p /sdcard/x.png` rồi `adb pull`.
- **Kotlin:** extensions-lib (stub) không có `dialogTitle` cho `ListPreference`, chỉ có cho `EditTextPreference`.
- **Rust/Aidoku trên đám mây** (cách cũ vẫn đúng): clone sparse `library` của rust-lang/rust tag 1.97.0, rồi `ln -s` vào `~/.rustup/toolchains/stable-*/lib/rustlib/src/rust/library` và `AIDOKU_BUILD_STD=1`. Lần đầu khoảng 3 phút, lần sau khoảng 35 giây. Lệnh Bash đặt `run_in_background`, đừng dùng `timeout 175`.

## Đổi tên miền (0.0.6) — cách hoạt động
- `runtime/engine.js`:
  - `base` = `DOMAIN_CUSTOM` (gõ tay) > `DOMAIN` (chọn từ danh sách) > `configDefaults.DOMAIN` > `metadata.source`.
  - `live(u)` bọc `env.fetch`: URL tới tên miền mặc định hoặc gương (có trong `DOMAIN.values`) được đổi sang `base`. Tên miền con (`api.`, `img.`) không bị đổi.
  - `canon()` / `decanon()` giữ link gốc nên thư viện và Resume không mất.
- `build-all.mjs` tự gộp `DOMAIN.values` + `metadata.source` + urls trong `data/sources.json` (từ Excel), và tạo `config.DOMAIN` cho nguồn chưa có.
- Kiểm bằng: `node test/domain-switch.test.mjs`.
