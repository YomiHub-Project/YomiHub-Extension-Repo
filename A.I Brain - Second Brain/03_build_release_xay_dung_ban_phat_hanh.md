# 03 – Xây dựng bản phát hành

## 1. Tăng phiên bản
- `package.json` → `version` (mỗi lần phát hành).
- `version` trong `sources/<id>/plugin.json` của mọi nguồn đã sửa. Sửa `lib/*.js` hoặc `runtime/*` → tăng **cả 196** nguồn (0.0.5, 0.0.6 đều làm vậy).
- `android/build_apks.ps1` (`$code`, APK_REV) nếu đổi Kotlin/cầu nối APK.
- `BRIDGE_REV` trong `tools/build/aidoku-build.mjs` nếu engine, lib hoặc cầu nối Aidoku đổi (hiện 4).

## 2. Dây chuyền dựng (Windows)
`tools/win/build_all.ps1` chạy tuần tự, log ở `Output/build_all.log`:
1. Dùng lại phụ thuộc ở `_work/deps` (junction `node_modules`).
2. `node tools/build/build-all.mjs` → `repo/` (vBook, Mangayomi/YomiHub, LNReader/IReader, chỉ mục) + `android/<mod>/gen/` + `flavors.json` (196 nguồn).
3. `android/build_apks.ps1` → Gradle `:anime:assembleRelease :manga:assembleRelease :novel:assembleRelease` (196 APK, log `android/build_apks.log`). JBR tự nhận ở `D:\Programs\ads\jbr`, SDK 35 / build-tools 36.
4. `node tools/test/run-tests.mjs --conc 6` → `test-results.json` (chép sang `data/test-results.json`).
5. Aidoku: nếu có `cargo` thì dựng; **máy Windows không có Rust**, nên giữ `repo/aidoku` đã dựng trên máy đám mây (`BRIDGE_REV = 5`). Sau đó `aidoku-sim.mjs --all` → `data/aidoku-test-results.json`.
6. `node tools/build/make-output.mjs` (xoá tệp bản cũ trong `Output/`, gói 7 zip) → `node tools/docs/gen-readme.mjs` (README có bảng link Release đúng phiên bản + trạng thái nguồn theo chuẩn Standard.md).

Dựng Aidoku trên máy đám mây: xem 06 (cách lấy thư viện chuẩn Rust cho wasm32), rồi `AIDOKU_BUILD_STD=1 node tools/build/aidoku-build.mjs --jobs 8` (152 gói, cargo khoảng 35 giây), gửi `repo/aidoku` về máy chủ dự án.

## 3. Sản phẩm trong `Output/`
- 7 zip: `Kiritokmn-Extension-<ver>-{vbook-leechtext, mangayomi-yomihub, lnreader-ireader, aniyomi-apks, tachiyomi-apks, nekoyomi-novel-apks, aidoku}.zip`.
- 4 chỉ mục: `index.json`, `index.min.json`, `plugin.json`, `plugins.min.json`.
- Log (`build_all.log`, `publish.log`) không tải lên Release.

## 4. Phát hành (sau khi chủ dự án xác nhận rõ trong chat)
`tools/win/publish.ps1` (chạy qua runner):
1. `git add -A` → commit (lời nhắn lấy từ biến `PUB_MSG`) → `git push origin HEAD:main`.
2. Lấy token từ Git Credential Manager (`git credential fill`) — máy **không có `gh`**.
3. Tạo/tìm Release `v<version>` trên `YomiHub-Project/Kiritokmn---Extension-Repo` → tải **mọi tệp trong `Output/` trừ `.log`** (bỏ qua tệp đã có cùng kích thước + sha256).
4. Kiểm lại danh sách tệp trên Release + so `HEAD` local với remote. Log: `Output/publish.log` (UTF-16; đọc bằng `iconv -f utf-16`).
- Lời nhắn commit ghi đúng phiên bản Extension Repo (`Extension Repo v0.0.x - …`).

## 5. Kiểm sau phát hành
- Tải thử bằng HTTP (mong đợi 200/302): `repo/index.min.json`, `index.json`, `plugins.min.json`, `plugin.json`, `aidoku/index.min.json`, vài gói, mọi link Release trong README.
- YomiHub/Mangayomi dùng jsDelivr làm dự phòng: xoá cache bằng `_work/purge.bat` nếu app chưa thấy phiên bản mới.
- Ghi kết quả (commit, số tệp Release) vào `TECHNICAL_UPDATE_NOTES.md`.

## Lịch sử phát hành
| Bản | Ngày | Commit | Release |
|---|---|---|---|
| 0.0.4 | 13/11/2026 | `4935497` | 12/12 tệp |
| 0.0.5 | 13/11/2026 | `88360b5` | đủ |
| 0.0.6 | 16/11/2026 | `32e29cf` (+`95cd9cc` tài liệu) | 10/10 |
| 0.0.7 | 18/11/2026 | `eee75b4` | 10/10 (06:33) |
| 0.0.8 | 23/11/2026 | `f620f82` | 10/10 (02:12) |
| 0.0.9 | 23/11/2026 | *(hiện tại)* | 11/11 tệp |
