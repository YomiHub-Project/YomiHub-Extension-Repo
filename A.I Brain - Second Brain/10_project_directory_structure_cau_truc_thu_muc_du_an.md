# 10 – Cấu trúc thư mục dự án

## Gốc: `D:\A.I Project\A.I Project - Extension Repo\Kiritokmn - Extension Repo` (Git: `kiritokmn1403/Kiritokmn---Extension-Repo`, nhánh `main`)
| Đường dẫn | Nội dung |
|---|---|
| `A.I Brain - Second Brain/` | Kiến thức bắt buộc đọc (00–12) |
| `AGENTS.md` | Quy định cho người/tác nhân (trỏ tới Second Brain) |
| `TECHNICAL_UPDATE_NOTES.md` | Trạng thái hiện tại, kiến trúc, nhật ký chi tiết mọi phiên bản (bắt buộc đọc) |
| `CHANGELOG.md` | Thay đổi theo phiên bản, viết cho người dùng |
| `README.md` | Tự sinh bởi `tools/docs/gen-readme.mjs`: cách thêm kho, link Release, bảng trạng thái nguồn |
| `package.json` | Phiên bản dự án (hiện 0.0.7), `npm run build`, `npm test` |
| `sources/<id>/` | **196 nguồn** dạng gói vBook: `plugin.json` + `src/*.js` (`config.js`, `home.js`, `browse.js`, `search.js`, `detail.js`, `toc.js`, `chap.js`, `track.js`…) |
| `sources-yomihub/` | Tiện ích tích hợp sẵn của YomiHub (`meta.json` + `<asset>.js` + `_common.js`, chép từ overlay YomiHub), dựng bằng `tools/build/yomihub-sources.mjs` |
| `lib/` | Thư viện dùng chung: `lib_generic.js`, `lib_madara.js`, `lib_common.js`, `lib_shortvideo.js`, `extra/` |
| `runtime/` | `engine.js`, `vbook.js`, `dom.js`, `url.js`, `rhino-prelude.js`, `gbk-table.txt` |
| `hosts/` | Lớp ghép từng app: `mangayomi.tail.js`, `lnreader.js`, `aidoku.tail.js`, `entry.js`, `node.js`, `node-runtime.js` |
| `android/` | Gradle: `anime/`, `manga/` (flavor từng nguồn; `gen/` + `flavors.json` là đầu ra, git-ignore), `anime-core/`, `manga-core/`, `shared/` (Kotlin chung, `Http2Bridge.kt`), `stub-anime/`, `stub-manga/`, `build_apks.ps1`. Khoá ký `kiritokmn.jks`, `keystore.properties`, `kiritokmn.cer`, `local.properties` — **không commit, không in ra** |
| `aidoku/` | `bridge/` (Rust/WASM), `icons/`, `test-runner-jsc-microtasks.patch` |
| `tools/build/` | `build-all`, `asyncify`, `aniyomi-index`, `aidoku-build`, `yomihub-sources`, `make-output`, `zip` (.mjs) |
| `tools/test/` | `run-tests`, `one`, `aidoku-sim`, `host-sim`, `offline`, `streamcheck`, `streamprobe`, `auto-improve`, `search-improve`, `spec-wizard`, `Http2BridgeTest.kt` |
| `tools/gen/`, `tools/analyze/` | Sinh nguồn/logo (`gen_sources.py`, `make_icons.py`, `aidoku_icons.py`); phân tích trang (`analyze.py`, `autospec.py`, `chapters.py`) |
| `tools/win/` | `build_all.ps1`, `publish.ps1`, `snap.mjs` (chạy trên Windows) |
| `tools/docs/` | `gen-readme.mjs` |
| `data/` | `sources.json` (từ Excel), `specs.json`, `specs.manual.json`, `status.json` (trạng thái nguồn), `test-results.json`, `aidoku-test-results.json`, `icons.json`, `cloudflare.json`, `plugin_catalog.json`, `reference_vbook.json`… |
| `docs/` | `SOURCE_SPEC.md`, `AIDOKU.md`, `YOMIHUB_SHORTS_GUIDE.md` |
| `test/` | `domain-switch.test.mjs`, `fixtures/` |
| `repo/` | **Đầu ra build, app đọc trực tiếp**: `index.min.json`, `repo.json`, `apk/` (Aniyomi/Nekoyomi), `index.json` + `mangayomi/` (Mangayomi/YomiHub), `plugins.min.json` + `lnreader/`, `plugin.json` + `vbook/`, `aidoku/`, `yomihub/`, `aniyomi/`, `icon/`, `icons/` |
| `Output/` | Gói tải lên Release (6 zip + 4 json) + `build_all.log`, `publish.log` |
| `.build/` | Tạm khi dựng; `.build/test/<id>.mjs` kiểm nhanh từng nguồn (git-ignore) |
| `test-results.json` | Kết quả `run-tests` lần gần nhất (git-ignore) |
| `.vscode/`, `_work/` | Trên máy chủ dự án, git-ignore |

## `_work/` (công cụ & bằng chứng, không lên GitHub)
- Runner: `!RUNNER.bat`, `win_runner.ps1`, `!KILL.bat`, `run/q/` (hàng đợi job), `run/o/` (log + `.done`), `run/heartbeat.txt`.
- Thiết bị: `phone4.ps1` (máy ảo), `phone5.ps1` (Note9), `emu_start.ps1`, `phone_cmd.txt`, `apks/` (APK các app), `shots/` (ảnh/video; `v003`…`v007` theo phiên bản).
- Phụ thuộc & trao đổi: `deps/` (node_modules), `x/` (tệp từ máy đám mây: `apply_sync.ps1`, `logofetch.mjs`…), `purge.bat` (xoá cache jsDelivr).
- Ghi chép: `NOTES_*.md` (`NOTES_003.md`, `NOTES_VPN*.md`, `NOTES_swarm_0.5.9.md`), `CHANGELOG_003.md`, `agents/` (đầu ra tác nhân `wb`, `wc`).
- `_old/`: lưu trữ; `_old/second-brain-truoc-2026-11-18/` là bản Second Brain trước khi sắp xếp lại.
- Các `.bat` đánh số `0_probe` … `50_probe`, `*.tgz`, `*.log`: cách làm cũ 0.0.1–0.0.3, chỉ để tham khảo.

## Thư mục liên quan trong `D:\A.I Project\`
- `A.I Project - Extension Repo\_work\` (`shots/`, `x/`): `_work` kiểu cũ (trước 0.0.4) nằm cạnh repo; `build_all.ps1` chỉ dùng khi `_work\deps` trong repo không có.
- `A.I Project - YomiHub Project\YomiHub-Project\`: app YomiHub (repo riêng, Second Brain riêng) — không sửa từ dự án này.
- `yh\` (= `D:\yh`): máy dựng YomiHub; các thư mục `aa00x*` trong đó thuộc Extension Repo/vBook cũ — không đụng khi làm YomiHub.
- `GitHub\`: mã tham khảo các dự án GitHub (theo `Project GitHub.xlsx`).
- `Claude outputs\`: ảnh/tệp bàn giao cũ của Claude.
