# 07 – Các quy tắc thực hiện (bắt buộc)

Bổ sung cho `AGENTS.md`; khi hai nơi khác nhau thì làm theo quy tắc chặt hơn và báo chủ dự án.

## Mã nguồn & dữ liệu
1. Nguồn chỉ sửa trong `sources/<id>/` (hoặc `data/specs.manual.json` + `tools/gen/gen_sources.py`). **Không sửa tay `repo/`.**
2. Tăng `version` nguồn mỗi khi sửa; sửa `lib/`/`runtime/` thì tăng mọi nguồn dùng chung; tăng `package.json` mỗi lần phát hành (xem 03).
3. Nguồn chết **không xoá**: ghi `data/status.json` → `dead`. `blocked`/`login`/`protected`/`api` chỉ để README ghi chú.
4. Không đổi `locale`, ID nguồn hay tên gói APK khi chưa được chủ dự án đồng ý (đổi là sinh APK trùng, xem 04-C).
5. Không sửa repo khác (YomiHub-Project…) trừ khi chủ dự án yêu cầu rõ.
6. Logo: dùng `tools/gen/make_icons.py`, không dùng dịch vụ favicon của Google làm biểu tượng chính.
7. Không chạy lệnh dọn/ghi đè hàng loạt (`git checkout -- …`, `git clean`, xoá thư mục) khi chưa kiểm phạm vi. Thứ cần bỏ thì chuyển vào `_to_delete/` hoặc `_work/_old/`.
8. Sau khi tác nhân bị ngắt giữa chừng: chạy `one.mjs`/`run-tests --replay` cho các nguồn đã đổi trước khi dựng.

## Chính sách nội dung
9. Không đưa thuật toán ký chống bot (a_bogus, X-Bogus…) vào tiện ích; việc ký để máy chủ riêng của người dùng làm (Douyin_TikTok_Download_API).
10. Không dùng `demo.douyin.wtf` hay dịch vụ demo của dự án khác làm máy chủ cho app.
11. Không vượt DRM, không giải CAPTCHA/Cloudflare thay người dùng; không vượt cảnh báo bảo mật (Play Protect chặn IReader).
12. Nguồn 18+ phải có `nsfw: true` để app ẩn theo cài đặt của người dùng.

## Bảo mật
13. Không commit khoá ký APK (`android/*.jks`, `android/keystore.properties`, `*.cer`). Mất khoá = người dùng Aniyomi/Nekoyomi phải gỡ và cài lại tiện ích.
14. Không ghi token, mật khẩu, tài khoản vào ghi chú, log chia sẻ, Second Brain hay GitHub. Token GitHub chỉ lấy lúc chạy từ Git Credential Manager.

## Kiểm thử
15. Không báo "hoạt động" cho nguồn chưa qua `run-tests.mjs`; ghi rõ trạng thái trong README.
16. Không chấp nhận "đạt" khi chưa có log/ảnh/video thật (xem 05).
17. Kiểm trên điện thoại thật: ghi cài đặt máy trước, trả lại đúng như cũ sau; cài đè app chỉ khi chủ dự án cho phép.

## Phát hành
18. Push `main` và tạo GitHub Release chỉ sau khi chủ dự án xác nhận rõ trong chat. Commit cục bộ thì được.
19. Lời nhắn commit ghi đúng phiên bản Extension Repo; dòng `Claude-Session:` là của phiên hiện tại.

## Ghi chép & báo cáo
20. Đọc toàn bộ Second Brain (00–12) + `AGENTS.md` + `TECHNICAL_UPDATE_NOTES.md` trước khi làm.
21. Tóm tắt yêu cầu bằng tiếng Việt và xin xác nhận trước khi làm một bản mới.
22. Sau mỗi đợt cập nhật ghi `TECHNICAL_UPDATE_NOTES.md` (hạng mục, lỗi, tệp/dòng sửa, công cụ, kết quả kiểm thử, ngày) — không xoá lịch sử thất bại.
23. Báo cáo chủ dự án bằng tiếng Việt, ngắn; nói rõ việc chủ dự án phải tự làm (bấm runner, cắm điện thoại, xác nhận phát hành…).
24. Cuối mỗi phiên: thêm mục vào nhật ký (12), cập nhật mục D của 11, tắt tác vụ nền (runner, điều khiển điện thoại `quit`, lịch hẹn, Antigravity).
