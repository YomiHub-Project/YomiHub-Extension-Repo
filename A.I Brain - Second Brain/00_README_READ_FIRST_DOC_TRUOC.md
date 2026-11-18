# A.I Brain – Second Brain (Kiritokmn Extension Repo) — ĐỌC TRƯỚC

**BẮT BUỘC:** mọi phiên làm việc (Claude, Antigravity/Gemini, Codex, người) phải đọc **TOÀN BỘ** thư mục này (00 → 12) **trước khi làm bất kỳ việc gì**: sửa nguồn, dựng, kiểm thử, phát hành hay trả lời về dự án. Sau đó đọc `AGENTS.md` và `TECHNICAL_UPDATE_NOTES.md` (ít nhất mục "Trạng thái hiện tại", mục của bản mới nhất và phần "Việc cần làm ở bản sau").
Cuối mỗi phiên phải bổ sung kinh nghiệm mới vào **đúng tệp** bên dưới, có ghi ngày.

## Thứ tự đọc
| Tệp | Nội dung | Khi nào cập nhật |
|---|---|---|
| `00_README_READ_FIRST_DOC_TRUOC.md` | Mục lục, quy định bắt buộc đọc, ghi nhớ nhanh | Khi thêm/đổi tệp |
| `01_architecture_kien_truc.md` | Kiến trúc: một định nghĩa nguồn → 9 ứng dụng; engine, host, APK, Aidoku, đổi tên miền | Khi đổi engine/host/định dạng đầu ra |
| `02_procedure_quy_trinh.md` | Quy trình chuẩn một bản cập nhật, từ Excel đến bàn giao | Khi đổi cách làm |
| `03_build_release_xay_dung_ban_phat_hanh.md` | Tăng phiên bản, dây chuyền dựng, đóng gói, phát hành GitHub, kiểm sau phát hành | Mỗi phiên bản |
| `04_technical_lesson_bai_hoc_ky_thuat.md` | Bài học sửa nguồn, bẫy hay gặp, video/stream, YouTube/TikTok/Douyin | Sau mỗi lỗi đáng nhớ |
| `05_testing_kiem_tra.md` | Kiểm thử tự động (record/replay/stream), máy ảo, Galaxy Note9, thiết lập từng app | Khi đổi cách kiểm |
| `06_tools_used_cong_cu_su_dung.md` | Máy Windows, trình chạy lệnh nền, máy đám mây, Node/Gradle/Rust/adb, script phân tích | Khi dùng công cụ mới |
| `07_performance_rules_cac_quy_tac_thuc_hien.md` | Quy tắc bắt buộc (mã nguồn, phiên bản, bảo mật, chính sách, phát hành, báo cáo) | Khi chủ dự án đặt quy tắc mới |
| `08_ai_session_tips_meo_su_dung_phien_lam_viec_voi_ai.md` | Mẹo làm việc với phiên Claude/AI: quyền, hạn mức, kết nối máy | Khi rút kinh nghiệm phiên |
| `09_A.I._agent orchestration_dieu_phoi_tac_nhan.md` | Chia việc cho tác nhân phụ, Antigravity `/swarm` | Sau mỗi đợt điều phối |
| `10_project_directory_structure_cau_truc_thu_muc_du_an.md` | Cây thư mục dự án, `_work/`, thư mục liên quan | Khi thêm/di chuyển thư mục |
| `11_project_handover_process_quy_trinh_ban_giao_du_an.md` | Quy trình bàn giao + **trạng thái bàn giao hiện tại** | Cuối mỗi phiên, mỗi phiên bản |
| `12_session log_nhat_ky_phien_lam_viec.md` | Nhật ký ngắn từng phiên | **Cuối mỗi phiên** (thêm mục mới ở cuối) |

## Ghi nhớ nhanh
- Nguồn chỉ sửa trong `sources/<id>/` (hoặc `data/specs.manual.json` + `tools/gen/gen_sources.py`). **Không sửa tay `repo/`**: đó là đầu ra của `npm run build`.
- Sửa nguồn nào thì tăng `version` trong `plugin.json` của nguồn đó. Sửa `lib/` hoặc `runtime/` thì tăng `version` của **mọi** nguồn dùng chung, không thì app không cập nhật.
- Nguồn chết **không xoá**: ghi vào `data/status.json` → `dead`.
- Không commit khoá ký APK (`android/*.jks`, `android/keystore.properties`).
- Không báo "đạt" khi chưa qua `run-tests.mjs` hoặc chưa có ảnh/video thật trên app.
- Phát hành công khai (push, GitHub Release) phải được chủ dự án xác nhận rõ trong chat.
- Trạng thái mới nhất: xem `11_…` mục D.

Lần tạo: 13/11/2026 (bản 0.0.4). Sắp xếp lại theo bộ 00–12: 18/11/2026 (sau bản 0.0.7).
