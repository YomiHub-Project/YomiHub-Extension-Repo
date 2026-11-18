# 08 – Mẹo sử dụng phiên làm việc với A.I (Claude)

## Bắt đầu / tiếp tục phiên
- Gắn thư mục máy cho phiên (Add folder trong app Claude desktop): `D:\A.I Project`, `D:\A.I Project\A.I Project - Extension Repo`, `D:\A.I Project\yh`, `D:\A.I Project\GitHub`, `D:\A.I Project\Claude outputs`.
- Phiên mới: đưa 2 tệp Excel + câu "đọc Second Brain, kiểm tra phiên trước làm tới đâu và tiếp tục". Claude đọc thư mục này, `TECHNICAL_UPDATE_NOTES.md`, `git log`, `_work/run/o/` (job mới nhất), `_work/NOTES_*.md` để dựng lại trạng thái.
- Claude Project "Extension Repo Project" có tài liệu bàn giao cũ (`claude/ban-giao-0.0.5-dang-do.md`); nguồn sự thật hiện tại là thư mục này + `TECHNICAL_UPDATE_NOTES.md`.

## Quyền & kết nối máy
- Xin đủ quyền **một lần** ngay đầu phiên (File Explorer, Android Studio, VS Code, GitHub Desktop, PowerShell, Antigravity, clipboard) + quyền xoá trong thư mục dự án. IDE và File Explorer thường chỉ được cấp mức **bấm** (không gõ) → vì vậy mới cần runner nền.
- Quyền điều khiển máy hết hạn sau một thời gian không dùng hoặc khi app desktop cập nhật → nói "xin cấp lại đầy đủ quyền".
- Kết nối máy tính (remote-devices) có thể rớt hẳn giữa phiên. Ghi tiến độ thường xuyên vào `TECHNICAL_UPDATE_NOTES.md`/Second Brain trên máy, và lưu bàn giao vào Claude Project để phiên mới làm tiếp.
- `device_bash` không xoá được tệp khi chưa cấp quyền xoá; khi đó `git commit/pull` có thể để lại `.git/*.lock` → chạy git qua runner Windows (`publish.ps1`) thay vì từ máy ảo Linux.
- Máy ngủ thì runner và điều khiển điện thoại dừng → bật lại `!RUNNER.bat`.

## Hạn mức & thời gian
- Hạn mức sử dụng 5 giờ: tác nhân phụ có thể bị dừng giữa chừng. 0.0.6 chạy 4 tác nhân song song hết hạn mức 3 lần → tối đa 1–2 tác nhân (xem 09).
- Chờ dựng/cài APK dài: dùng lịch hẹn tự kiểm tra (send_later) thay vì hỏi liên tục; lệnh chờ dài bị ngắt khi chủ dự án nhắn — không hỏng gì, chỉ cần kiểm lại trạng thái.
- Ngắt (interrupt) lệnh của Claude cũng dừng các tác nhân nền đang chạy; sau đó phải kiểm lại.
- Phiên không tự đổi được mô hình; chủ dự án chọn mô hình trong ứng dụng.

## Cách giao việc hiệu quả
- Một tin nhắn = một mục tiêu rõ ("làm bản 0.0.8 theo Excel", "phát hành v0.0.8 lên GitHub Release", "cập nhật Second Brain").
- Phát hành: trả lời bằng câu xác nhận rõ (vd. "Đồng ý push và tạo Release v0.0.8") — câu chung chung có thể bị chặn.
- Muốn thấy quá trình: yêu cầu làm trực tiếp trong chat, mỗi bước một câu; mở `TECHNICAL_UPDATE_NOTES.md`/`_work/NOTES_*.md` trong VS Code.
- Cuối đợt: yêu cầu "cập nhật kiến thức" → Claude cập nhật ghi chú kỹ thuật + Second Brain (+ push nếu được xác nhận).
