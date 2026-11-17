// 0.0.4 debug helper: run one source step by step and print what each step returns.
// Usage: node tools/test/one.mjs <id> [--replay dir|--record dir] [--step popular|search|detail|chapters|read] [--url u] [--q text] [--n 5]
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const a = process.argv.slice(2); const id = a[0]; const opt = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const REC = opt('--record'), REP = opt('--replay'), N = +(opt('--n') || 5);
const dnsOpt = opt('--dns');
const DNS = dnsOpt === 'none' || dnsOpt === 'system' || dnsOpt === '' ? '' : (dnsOpt || '1.1.1.1,8.8.8.8');
if (DNS) {
  const dns = await import('node:dns'); const R = new dns.Resolver(); R.setServers(DNS.split(','));
  const orig = dns.default.lookup;
  dns.default.lookup = function (host, o, cb) {
    if (typeof o === 'function') { cb = o; o = {}; } if (typeof o === 'number') o = { family: o }; o = o || {};
    if (host === 'localhost' || /^[\d.]+$|:/.test(host)) return orig.call(this, host, o, cb);
    R.resolve4(host, (e, a4) => {
      const done = (list) => o.all ? cb(null, list) : cb(null, list[0].address, list[0].family);
      if (!e && a4 && a4.length) return done(a4.map(addr => ({ address: addr, family: 4 })));
      R.resolve6(host, (e6, a6) => {
        if (!e6 && a6 && a6.length) return done(a6.map(addr => ({ address: addr, family: 6 })));
        orig.call(this, host, o, cb);
      });
    });
  };
}
if (REC || REP) {
  const { createHash } = await import('node:crypto'); const realFetch = globalThis.fetch; const D = path.resolve(REC || REP); fs.mkdirSync(D, { recursive: true });
  const key = (u, o) => createHash('sha1').update(((o && o.method) || 'GET') + ' ' + u + ' ' + ((o && typeof o.body === 'string') ? o.body : '')).digest('hex').slice(0, 24);
  const mk = (buf, d) => { const r = new Response(d.status === 204 || d.status === 304 ? null : buf, { status: d.status < 200 ? 200 : d.status, headers: d.headers }); Object.defineProperty(r, 'url', { value: d.final || d.url }); return r; };
  globalThis.fetch = async (u, o = {}) => {
    const f = path.join(D, key(String(u), o) + '.json');
    if (REP) { if (fs.existsSync(f)) { const d = JSON.parse(fs.readFileSync(f, 'utf8')); return mk(Buffer.from(d.b64, 'base64'), d); } console.log('  [miss] ' + u); throw new Error('replay miss ' + u); }
    const res = await realFetch(u, o); const buf = Buffer.from(await res.arrayBuffer()); const headers = {}; res.headers.forEach((v, k) => { if (k !== 'content-encoding' && k !== 'content-length') headers[k] = v; });
    const d = { url: String(u), final: res.url, status: res.status, headers, b64: buf.toString('base64') }; fs.writeFileSync(f, JSON.stringify(d)); return mk(buf, d);
  };
}
const { makeEngineFor } = await import(pathToFileURL(path.join(ROOT, '.build/_runtime.mjs')).href);
const mod = await import(pathToFileURL(path.join(ROOT, '.build/test', id + '.mjs')).href);
const eng = makeEngineFor(mod.META, mod.SCRIPTS, { log: m => console.log('  [log] ' + m) });
const show = (t, v) => console.log(t, JSON.stringify(v, null, 0).slice(0, 1500));
const run = async (t, f) => { try { const v = await f(); return v; } catch (e) { console.log(t + ' ERROR: ' + (e.message || e)); return null; } };
const step = opt('--step') || 'all';
let link = opt('--url'), ch = null;
if (step === 'all' || step === 'popular') { const p = await run('popular', () => eng.popular(1)); if (p) { show('popular n=' + p.items.length + ' next=' + p.hasNext, p.items.slice(0, N)); link = link || (p.items[0] || {}).link; } }
if (step === 'all' || step === 'search') { const s = await run('search', () => eng.search(opt('--q') || 'a', 1)); if (s) show('search n=' + s.items.length, s.items.slice(0, 3)); }
if (link && (step === 'all' || step === 'detail')) { const d = await run('detail', () => eng.detail(link)); if (d) show('detail', { ...d, description: String(d.description).slice(0, 120) }); }
if (link && (step === 'all' || step === 'chapters' || step === 'read')) { const c = await run('chapters', () => eng.chapters(link)); if (c) { show('chapters n=' + c.length, c.slice(0, 3)); ch = c[0]; } }
if (ch || (step === 'read' && opt('--url'))) {
  const u = ch ? ch.url : link, t = mod.META.type;
  if (t === 'novel') { const x = await run('content', () => eng.content(u)); if (x) console.log('content len=' + x.html.replace(/<[^>]+>/g, '').length, x.html.replace(/<[^>]+>/g, ' ').slice(0, 200)); }
  if (t === 'comic') { const x = await run('pages', () => eng.pages(u)); if (x) show('pages n=' + x.length, x.slice(0, 3)); }
  if (t === 'video') { const x = await run('videos', () => eng.videos(u)); if (x) show('videos n=' + x.length, x.slice(0, 3)); }
}
process.exit(0);
