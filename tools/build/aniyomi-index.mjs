// After the Android APKs are built:
//   - Write 3 self-contained APK repos: repo/anime/, repo/manga/, repo/novel/
//     each with index.min.json, repo.json, apk/, icon/ (plus tachiyomix 1.6 index.json for manga & novel).
//   - Hardlink (0 extra disk/git space) into repo/apk/, repo/icon/ + repo/index.min.json + repo/repo.json
//     for backwards compatibility.
// Usage: node tools/build/aniyomi-index.mjs <signingKeyFingerprintSha256>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fingerprint = process.argv[2];
const BASE = 'https://raw.githubusercontent.com/YomiHub-Project/Kiritokmn---Extension-Repo/main';
const GH_REPO = 'https://github.com/YomiHub-Project/Kiritokmn---Extension-Repo';
const OUT = path.join(ROOT, 'repo');
const AND = path.join(ROOT, 'android');

const MODS = ['anime', 'manga', 'novel'];
fs.mkdirSync(path.join(OUT, 'apk'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'icon'), { recursive: true });

function linkOrCopy(src, dst) {
  fs.rmSync(dst, { force: true });
  try {
    fs.linkSync(src, dst);
  } catch {
    fs.copyFileSync(src, dst);
  }
}

function cleanStale(dir, keepSet) {
  let removed = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const f of fs.readdirSync(dir)) {
    if (!keepSet.has(f)) {
      fs.rmSync(path.join(dir, f), { force: true });
      removed++;
    }
  }
  return removed;
}

const index = [];
const byMod = { anime: [], manga: [], novel: [] };
const newByMod = { manga: [], novel: [] };
const keepRootApk = new Set();
const keepRootIcon = new Set();
const missing = [];
let bytes = 0;
let stale = 0;

for (const mod of MODS) {
  const modOut = path.join(OUT, mod);
  const modApkDir = path.join(modOut, 'apk');
  const modIconDir = path.join(modOut, 'icon');
  fs.mkdirSync(modApkDir, { recursive: true });
  fs.mkdirSync(modIconDir, { recursive: true });

  const keepModApk = new Set();
  const keepModIcon = new Set();

  const flavorsPath = path.join(AND, mod, 'flavors.json');
  if (!fs.existsSync(flavorsPath)) continue;
  const flavors = JSON.parse(fs.readFileSync(flavorsPath, 'utf8'));

  for (const f of flavors) {
    const dir = path.join(AND, mod, 'build/outputs/apk', f.flavor, 'release');
    const built = fs.existsSync(dir) ? fs.readdirSync(dir).find(x => x.endsWith('.apk')) : null;
    if (!built) {
      missing.push(f.pkg);
      continue;
    }

    const apkName = `${f.pkg}-v${f.versionName}.apk`;
    const iconName = `${f.pkg}.png`;
    const modApkPath = path.join(modApkDir, apkName);
    const modIconPath = path.join(modIconDir, iconName);

    fs.copyFileSync(path.join(dir, built), modApkPath);
    keepModApk.add(apkName);
    bytes += fs.statSync(modApkPath).size;

    fs.copyFileSync(path.join(AND, mod, 'gen', f.flavor, 'res/mipmap-xxxhdpi/ic_launcher.png'), modIconPath);
    keepModIcon.add(iconName);

    // Hardlink into root repo/{apk,icon} so combined repo/index.min.json resolves without 404 or extra disk bloat
    linkOrCopy(modApkPath, path.join(OUT, 'apk', apkName));
    keepRootApk.add(apkName);
    linkOrCopy(modIconPath, path.join(OUT, 'icon', iconName));
    keepRootIcon.add(iconName);

    const item = {
      name: f.label,
      pkg: f.pkg,
      apk: apkName,
      lang: f.lang,
      code: f.versionCode,
      version: f.versionName,
      nsfw: f.nsfw,
      sources: [{ name: f.name, lang: f.lang, id: f.sourceId, baseUrl: f.baseUrl }],
    };
    index.push(item);
    byMod[mod].push(item);

    if (mod === 'manga' || mod === 'novel') {
      newByMod[mod].push({
        name: f.label,
        packageName: f.pkg,
        resources: {
          apkUrl: `${BASE}/repo/${mod}/apk/${apkName}`,
          iconUrl: `${BASE}/repo/${mod}/icon/${iconName}`,
        },
        extensionLib: '1.4',
        versionCode: String(f.versionCode),
        versionName: f.versionName,
        contentWarning: f.nsfw ? 'CONTENT_WARNING_NSFW' : 'CONTENT_WARNING_SAFE',
        sources: [{ id: String(f.sourceId), name: f.name, language: f.lang, homeUrl: f.baseUrl }],
      });
    }
  }

  stale += cleanStale(modApkDir, keepModApk);
  stale += cleanStale(modIconDir, keepModIcon);
}

if (missing.length) console.error('MISSING apk for', missing.length, 'flavors:', missing.join(', '));
stale += cleanStale(path.join(OUT, 'apk'), keepRootApk);
stale += cleanStale(path.join(OUT, 'icon'), keepRootIcon);

const baseMeta = {
  name: 'Kiritokmn Extension Repo',
  shortName: 'Kiritokmn',
  website: GH_REPO,
  signingKeyFingerprint: String(fingerprint || '').toLowerCase().replace(/[^0-9a-f]/g, ''),
};

fs.writeFileSync(path.join(OUT, 'index.min.json'), JSON.stringify(index));
fs.writeFileSync(path.join(OUT, 'repo.json'), JSON.stringify({ meta: baseMeta }, null, 1));

const labels = { anime: 'Anime', manga: 'Manga', novel: 'Novel' };
for (const mod of MODS) {
  fs.writeFileSync(path.join(OUT, mod, 'index.min.json'), JSON.stringify(byMod[mod]));
  fs.writeFileSync(
    path.join(OUT, mod, 'repo.json'),
    JSON.stringify({ meta: { ...baseMeta, name: `Kiritokmn Extension Repo (${labels[mod]})`, shortName: `Kiritokmn ${labels[mod]}` } }, null, 1),
  );
  if (mod === 'manga' || mod === 'novel') {
    fs.writeFileSync(
      path.join(OUT, mod, 'index.json'),
      JSON.stringify({ extensionList: { extensions: newByMod[mod] } }),
    );
  }
}

console.log(
  `index.min.json: ${index.length} apks (anime: ${byMod.anime.length}, manga: ${byMod.manga.length}, novel: ${byMod.novel.length}), ${(bytes / 1048576).toFixed(1)} MB unique APKs, ${stale} stale files removed`,
);
if (missing.length) process.exit(1);
