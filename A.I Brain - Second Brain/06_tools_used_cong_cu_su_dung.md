# 06 – Công cụ sử dụng

## Máy của chủ dự án (Windows, `kiritokmn-lap`)
- Thư mục: `D:\A.I Project\A.I Project - Extension Repo\Kiritokmn - Extension Repo\` (git, remote `YomiHub-Project/Kiritokmn---Extension-Repo`, nhánh `main`). `_work\` và `.vscode\` nằm trong dự án nhưng git-ignore (từ 0.0.4).
- Node 24 (+ esbuild, acorn, escodegen, htmlparser2, css-select, crypto-js, typescript trong `_work/deps`, `node_modules` là junction).
- Git, đăng nhập sẵn qua Git Credential Manager; **không có `gh`**. GitHub Desktop có sẵn.
- Android SDK + Android Studio (`D:\Programs\ads`), JBR (`D:\Programs\ads\jbr`), SDK 35 / build-tools 36, Gradle 9.3.1, Kotlin 2.2.20. Dựng 196 APK qua 3 module độc lập (`:anime`, `:manga`, `:novel`) và shared library (`NovelSource.kt`, `Http2Bridge.kt`).
- adb (máy ảo + Note9 SM-N960N). **Không có Rust/cargo** → gói Aidoku dựng trên máy đám mây hoặc mô phỏng `aidoku-sim.mjs`.
- VS Code (xem log/NOTES), File Explorer (bật runner), Google Antigravity (bản app, `/swarm`, xem 09).

## Trình chạy lệnh nền (từ 0.0.4) — quan trọng nhất
- `_work/!RUNNER.bat` → `_work/win_runner.ps1`: chạy nền 12 giờ, cứ 0,8 giây quét `_work/run/q/*.ps1`. Mỗi tệp chạy trong một tiến trình PowerShell ẩn riêng. Kết quả: `_work/run/o/<tên>.log` (UTF-8) + `<tên>.done` (mã thoát). `_work/run/heartbeat.txt` cho biết runner còn sống.
- Chỉ cần **bấm đúp `!RUNNER.bat` một lần** qua File Explorer (computer use chỉ được bấm, không gõ). Sau đó máy ảo Linux (`device_bash`) ghi tệp lệnh vào `run/q/`.
- Quy ước tên job: `jNNN_mo-ta.ps1` / `mNNN_…`, tăng dần (job cuối hiện có: `m038_relbody2`).
- Lệnh dài dùng `| Select-Object -Last N` thì log chỉ có nội dung khi xong; muốn xem tiến độ thì ghi log riêng.
- Runner tự tắt sau 12 giờ hoặc khi máy ngủ; heartbeat cuối hiện tại: 16/11/2026 17:43 → phiên sau phải bật lại.
- `_work/!KILL.bat` dừng runner; các `.bat` đánh số cũ (`1_snap.bat` … `50_probe.bat`) là cách làm của 0.0.1–0.0.3, không dùng nữa.

## Máy đám mây (cloud bash của Claude)
- Chỉ vào được GitHub và kho gói (npm, crates.io), **không vào được trang nguồn** → sửa nguồn bằng bản ghi `--replay`.
- Luồng tệp: đám mây → `/mnt/user-data/outputs/x/` → `device_commit_files` → `_work/x/`; Windows → `device_stage_files` → `/mnt/user-data/uploads/...`.
- Gửi mã: `sync.sh` (viết trong phiên) đóng gói tệp đổi so với commit gần nhất thành `sync.tgz` + `sync_deleted.txt`; trên Windows chạy `_work/x/apply_sync.ps1`. **Không** gửi `android/*/src/*/assets`, `android/*/gen/` (đầu ra build).
- Rust 1.97 có sẵn nhưng không tải được target wasm32 (static.rust-lang.org bị chặn). Cách làm: `git clone --sparse` thư mục `library` của rust-lang/rust đúng tag 1.97.0, `ln -s` vào `~/.rustup/toolchains/stable-*/lib/rustlib/src/rust/library`, rồi `AIDOKU_BUILD_STD=1 node tools/build/aidoku-build.mjs --jobs 8`.
- Kotlin biên dịch thử được trên đám mây (`-jvm-target 1.8 -Werror`), dùng cho `Http2BridgeTest.kt`.

## Script trong dự án
- Dựng: `tools/build/{build-all, asyncify, aniyomi-index, aidoku-build, yomihub-sources, make-output, zip}.mjs`, `android/build_apks.ps1` (196 APKs: 44 anime + 37 manga + 115 novel), `tools/win/build_all.ps1`.
- Phát hành: `tools/win/publish.ps1`, `tools/docs/gen-readme.mjs` (theo chuẩn Standard Compendium song ngữ VI/EN), `_work/purge.bat` (xoá cache jsDelivr).
- Kiểm thử: `tools/test/{run-tests, one, aidoku-sim, host-sim, offline, streamcheck, streamprobe}.mjs`, `test/domain-switch.test.mjs`, `test/filter-extension.test.mjs` (kiểm thử 10 bộ lọc), `tools/win/snap.mjs`.
- Sinh/tự động: `tools/gen/{gen_sources, make_icons, aidoku_icons}.py`, `tools/analyze/{analyze, autospec, chapters}.py`, `tools/test/{auto-improve, search-improve, spec-wizard}.mjs`.

## Script viết trong phiên (nằm ở `_work/x/` hoặc thư mục tạm của máy đám mây)
- `cards.py` (đoán thẻ truyện lặp lại), `an.py` (tiêu đề, khối chữ lớn nhất, nhóm liên kết), `getrec.py` (lấy trang đã ghi theo URL), `peek.py`, `patch.py` (sửa khối `var G` của config.js), `domprobe.mjs` (thử tên miền), `logofetch.mjs` (gom logo).
- Thiết bị: `_work/phone4.ps1`, `_work/phone5.ps1`, `_work/emu_start.ps1`; phía Linux `~/pc.sh`, `~/pc5.sh` (phải viết lại ở phiên mới nếu máy ảo Linux đã bị xoá).
