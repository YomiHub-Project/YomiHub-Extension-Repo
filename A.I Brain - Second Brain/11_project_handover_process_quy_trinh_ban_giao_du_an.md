# 11 – Quy trình bàn giao dự án

Áp dụng khi: kết thúc một phiên bản, kết thúc phiên làm việc (hết hạn mức, máy ngủ, mất kết nối máy, chuyển sang tác nhân/phiên khác), hoặc bàn giao cho chủ dự án.

## A. Bàn giao cuối phiên (giữa chừng một phiên bản)
1. **Dừng an toàn**: không để job dựng/cài APK chạy dở mà không ghi lại; tắt điều khiển điện thoại bằng `quit`; trả lại cài đặt Note9 theo `phone_settings_before.txt`.
2. **Ghi trạng thái** vào `TECHNICAL_UPDATE_NOTES.md` (mục bản đang làm): đã xong (tệp sửa, kết quả kiểm thử, bằng chứng), đang dở (dừng ở bước nào, job nào trong `_work/run/q/`), chưa làm; tác nhân/Antigravity đang chạy và tệp NOTES của chúng.
3. **Thêm một mục vào `12_session log_nhat_ky_phien_lam_viec.md`** và cập nhật mục D bên dưới.
4. **Lưu mã**: commit cục bộ (hoặc patch `git diff --binary` nếu không commit được). Nếu kết nối máy có thể rớt, lưu bản bàn giao/patch vào Claude Project (như `claude/0.0.5-patch.diff`, `claude/0.0.5-fix1.diff` ở 0.0.5).
5. **Tắt tác vụ nền**: lịch hẹn kiểm tra, Antigravity theo dõi; ghi lại nếu cố ý để runner chạy tiếp.
6. **Báo chủ dự án** (tiếng Việt): đang ở đâu, phiên sau bắt đầu từ đâu, việc chủ dự án cần làm (bật runner, cắm điện thoại, xác nhận phát hành…).

## B. Bàn giao một phiên bản (sau phát hành)
- [ ] `package.json`, `version` nguồn đã tăng; `repo/` dựng lại; 81 APK; Aidoku 152 gói (nếu engine đổi).
- [ ] `run-tests` toàn bộ trên mạng thật, số đạt ghi vào notes + README.
- [ ] Kiểm thiết bị có ảnh/video trong `_work/shots/v<ver>/`; cài đặt điện thoại đã trả lại.
- [ ] GitHub: `main` local = remote; Release `v<ver>` đủ tệp (6 zip + 4 json); link trong README trả 200/302; cache jsDelivr đã xoá nếu cần.
- [ ] `TECHNICAL_UPDATE_NOTES.md` (dòng "Trạng thái hiện tại" + bảng chi tiết + "Việc cần làm ở bản sau"), `CHANGELOG.md`, README.
- [ ] Second Brain: bài học (04), kiểm thử (05), công cụ (06), quy tắc (07), điều phối (09), nhật ký (12), mục D dưới đây.
- [ ] Báo cáo cuối: đã phát hành gì, kết quả kiểm, việc còn mở, việc chủ dự án cần tự làm.

## C. Nhận bàn giao (phiên/tác nhân mới)
1. Đọc Second Brain 00 → 12, `AGENTS.md`, mục "Trạng thái hiện tại" + mục bản mới nhất của `TECHNICAL_UPDATE_NOTES.md`.
2. Đọc mục mới nhất của 12 và mục D dưới đây.
3. Kiểm thực tế: `git status -sb`, `git log -5`; `_work/run/heartbeat.txt` (runner còn sống?), job mới nhất trong `_work/run/o/`; `_work/NOTES_*.md` mới nhất; `Output/publish.log` (UTF-16).
4. Tóm tắt trạng thái cho chủ dự án rồi tiếp tục từ việc dở dang đầu tiên.

## D. Trạng thái bàn giao hiện tại (18/11/2026 tối, sau 0.0.7)
- **0.0.7 đã phát hành** 18/11 06:33: commit `eee75b4`, Release `v0.0.7` 10/10 tệp, local = remote. Mạng thật 77/196 đạt. 81 APK `…1005`. Note9: 6 app cài và mở được (19 ảnh + 6 video ở `_work/shots/v007/`).
- **Sau 0.0.7, đã push lên `main`, chưa có Release/APK mới:**
  - `441e6a7` (Antigravity `/swarm`, ghi nhầm "v0.5.9"): sửa 7 nguồn Anime47, Phimmoi, AVSub, AnimeVN, FikFap, SexVietTop (gỡ `dead`), Pornhub; `lib/lib_generic.js` thêm UA; dựng lại `repo/`. Nhật ký `_work/NOTES_swarm_0.5.9.md`.
  - `c919f87`: bật `nsfw` cho hentaivn, mimimoe, nettruyen18, vinahentai; **đổi `locale` ehentai vi → global**.
  - Hai commit này đã có tóm tắt ở đầu `CHANGELOG.md` (18/11 tối) nhưng **chưa ghi vào `TECHNICAL_UPDATE_NOTES.md`** → ghi ở đầu bản 0.0.8.
- **Đã quyết định (18/11 22:04, chủ dự án): giữ ehentai `locale: global`.** Lần dựng APK 0.0.8 sẽ sinh gói `extension.all.kiriehentai` thay cho `extension.vi.kiriehentai`; hướng dẫn gỡ gói cũ đã ghi ở đầu `CHANGELOG.md` (mục bản kế tiếp) — nhớ đưa vào thân Release 0.0.8 và kiểm trên Note9 (gỡ gói `vi`, cài gói `all`). Cờ `nsfw` mới của 4 nguồn làm đổi nhãn 18+ của APK, không đổi tên gói.
- **Runner nền** bật lại 18/11 22:03 (job `m039_brain_push`), tự tắt sau 12 giờ: phiên sau xem `_work/run/heartbeat.txt`, cũ thì bấm đúp `_work/!RUNNER.bat`.
- **Việc còn mở cho 0.0.8:**
  - iQIYI, MGTV, FreeReels (DRM/chống bot di động) — cần reverse proxy hoặc máy chủ ký riêng của người dùng, không đưa thuật toán ký vào tiện ích.
  - Nguồn WordPress đổi permalink (Truyện CV `truyencvio`); TruyenH; Cloudflare Turnstile tương tác chậm.
  - Nguồn tác tử 0.0.6 chưa tới (Truyện Việt: cbhentai, sayhentai, truyentranhdammyy, minotruyen, quykiep, truyennet, webtruyendich, lnkuro, lohi, taonovel, novelnext, syosetur18, mattreadingtranslations, lnhakovnhako; Truyện Trung: 69shuba, douban, gongzicp, idejian, jjwxc×2, moyuemacduyet, piaotianapp, po18sm, qmbook, quanben, 75zwcom, snapd, sweetastes, wodeshucheng5, xianqihaotiamiapp, ypshuobinhluansach, weibo) — đo lại trước vì 0.0.7 có thể đã sửa một phần.
  - Kiểm lại các nguồn `dead` (36).
  - Quay video phát Twitch trên Mangayomi/YomiHub (0.0.7 ghi đạt nhưng `v007` chỉ có ảnh danh sách); kiểm tab Shorts YomiHub 0.5.7 trên giao diện.
  - vBook 1.1.57 (cài tiện ích), LeechText 2.0.0 crash, IReader bị Play Protect chặn — lỗi phía app, chỉ ghi nhận.
  - Mangayomi/YomiHub chưa có cầu nối HTTP/2 (NguonC có thể vẫn 403 trên hai app này).
- Tài liệu Claude Project `claude/ban-giao-0.0.5-dang-do.md` đã cũ (0.0.5 đã hoàn tất); dùng tệp này thay thế.
