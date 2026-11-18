# 02 – Quy trình làm việc (một bản cập nhật)

1. **Đọc**: thư mục này (00 → 12) → `AGENTS.md` → `TECHNICAL_UPDATE_NOTES.md`. Phần "Việc cần làm ở bản sau" của bản trước và mục D của `11_…` là việc tồn đọng phải làm tiếp.
2. **Đọc Excel** chủ dự án gửi:
   - `Project Extension Repo.xlsx`: sheet *Feature Check* → *Update* → *Extension Repo Main* → *Tham Khảo*. *Feature Check* chỉ trỏ sang *Update*; yêu cầu thật nằm ở *Update*.
   - `Project GitHub.xlsx`: khoảng 700 dòng link mã nguồn tham khảo.
3. **Tóm tắt yêu cầu bằng tiếng Việt và xin xác nhận** trước khi làm. Hỏi luôn các quyết định có hậu quả:
   - Làm cho những app nào (mặc định cả 9)?
   - Có sửa repo khác (YomiHub) không? Mặc định **không** (0.0.4, 0.0.6).
   - Xoá hay giữ nguồn chết? Mặc định giữ + đánh dấu.
   - Kiểm trên thiết bị thật (Note9 có cắm không?) hay máy ảo? Có được cài đè app trên điện thoại không?
4. **Xin đủ quyền một lần** ngay từ đầu (chủ dự án yêu cầu): File Explorer, Android Studio, VS Code, GitHub Desktop, PowerShell, Antigravity (nếu dùng) + quyền xoá trong thư mục dự án. Xem 08.
5. **Bật trình chạy lệnh nền** `_work/!RUNNER.bat` nếu `_work/run/heartbeat.txt` đã cũ (xem 06). Từ đó mọi lệnh Windows chạy bằng cách thả tệp `.ps1` vào `_work/run/q/`.
6. **Đo hiện trạng**: `run-tests.mjs --record --stream --dns 1.1.1.1,8.8.8.8` toàn bộ 196 nguồn trên mạng thật (khoảng 6 phút). Trang web đổi liên tục, kết quả bản trước đã cũ. Phân loại nguồn lỗi sớm: chết / chặn / đăng nhập / bảo vệ / cần API / sửa được bằng bộ chọn.
7. **Sửa nguồn theo vòng** (xem 04, 05): sửa trên máy đám mây với `--replay` → gửi gói thay đổi → Windows `--record` các nguồn còn lỗi → kéo bản ghi về → lặp lại. Mỗi vòng khoảng 6–8 phút. Ghi tiến độ sau mỗi vòng.
8. **Tăng phiên bản & dựng** (xem 03): `package.json`, `version` nguồn đã sửa, `BRIDGE_REV` nếu engine/lib đổi → `tools/win/build_all.ps1`; Aidoku dựng trên máy đám mây (có Rust).
9. **Kiểm thử trên app** (xem 05): bằng chính kho đã phát hành hoặc APK vừa dựng; lưu ảnh/video vào `_work/shots/v<ver>/`; trả lại cài đặt điện thoại.
10. **Ghi tài liệu**: `TECHNICAL_UPDATE_NOTES.md` (bảng: hạng mục, lỗi phát hiện, tệp/dòng sửa, công cụ, kết quả kiểm thử, ngày), `CHANGELOG.md`, README (`gen-readme.mjs`), thư mục này (04/05/06/09/12, mục D của 11).
11. **Phát hành** (xem 03) sau khi chủ dự án xác nhận → kiểm link sau phát hành → nếu có sửa tài liệu thì phát hành lần cuối (chỉ tài liệu).
12. **Bàn giao** theo `11_…`.

## Kinh nghiệm thời gian
- Sửa nguồn chiếm nhiều thời gian nhất. Mỗi trang hỏng có lý do riêng (Cloudflare, đăng nhập, mã hoá trình phát, SPA). Đừng sa lầy: hết khoảng 20 phút mà chưa ra hướng thì ghi vào `data/status.json` và chuyển nguồn khác.
- Gradle 81 APK: 412 giây lần đầu, 174–220 giây các lần sau. `adb install` 81 APK: 7–15 phút.
- Nhiều tác nhân song song làm cạn hạn mức 5 giờ rất nhanh (xem 09).
