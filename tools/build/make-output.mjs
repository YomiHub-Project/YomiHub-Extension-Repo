// Collects release files into Output/: zipped plugin packs for each app family
// (0.0.9: 7 zips incl. nekoyomi-novel-apks + 4 root index JSONs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeZip } from './zip.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const V = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version;
const OUT = path.join(ROOT, 'Output');
fs.mkdirSync(OUT, { recursive: true });

// 0.0.3: drop release files of older versions so Output/ only holds what this release ships
for (const f of fs.readdirSync(OUT)) {
  if (/^(YomiHub|Kiritokmn)-Extension-\d/.test(f) && (!f.startsWith(`YomiHub-Extension-${V}-`) || f.endsWith('.apk'))) {
    fs.rmSync(path.join(OUT, f));
  }
}
fs.rmSync(path.join(OUT, 'apk-build'), { recursive: true, force: true }); // pre-0.0.5 staging folder

const walk = (d, rel = '') => fs.readdirSync(d).flatMap(f => {
  const p = path.join(d, f), r = rel ? rel + '/' + f : f;
  return fs.statSync(p).isDirectory() ? walk(p, r) : [r];
});
const pack = (dir, name, filter = () => true) => {
  const d = path.join(ROOT, 'repo', dir);
  if (!fs.existsSync(d)) return;
  const files = walk(d).filter(filter).map(f => ({ name: dir + '/' + f, data: fs.readFileSync(path.join(d, f)) }));
  fs.writeFileSync(path.join(OUT, name), makeZip(files));
  console.log(name, files.length);
};

pack('vbook', `YomiHub-Extension-${V}-vbook-leechtext.zip`);
pack('mangayomi', `YomiHub-Extension-${V}-mangayomi-yomihub.zip`);
pack('lnreader', `YomiHub-Extension-${V}-lnreader-ireader.zip`);

// individual extension APKs (already compressed -> the zip just bundles them)
for (const [name, mod, re] of [
  ['aniyomi-apks', 'anime', /\.animeextension\./],
  ['tachiyomi-apks', 'manga', /\.tachiyomi\.extension\./],
  ['nekoyomi-novel-apks', 'novel', /\.novelextension\./],
]) {
  const modDir = path.join(ROOT, 'repo', mod, 'apk');
  const rootDir = path.join(ROOT, 'repo', 'apk');
  const srcDir = fs.existsSync(modDir) ? modDir : rootDir;
  const apks = fs.existsSync(srcDir)
    ? fs.readdirSync(srcDir).filter(f => f.endsWith('.apk') && (srcDir === modDir || re.test(f))).sort()
    : [];
  const files = apks.map(f => ({ name: f, data: fs.readFileSync(path.join(srcDir, f)) }));
  if (files.length) {
    fs.writeFileSync(path.join(OUT, `YomiHub-Extension-${V}-${name}.zip`), makeZip(files));
    console.log(name, files.length);
  }
}

pack('aidoku', `YomiHub-Extension-${V}-aidoku.zip`); // index.min.json + sources/*.aix + icons/
for (const f of ['index.json', 'plugins.min.json', 'plugin.json', 'index.min.json']) {
  if (fs.existsSync(path.join(ROOT, 'repo', f))) {
    fs.copyFileSync(path.join(ROOT, 'repo', f), path.join(OUT, f));
  }
}
