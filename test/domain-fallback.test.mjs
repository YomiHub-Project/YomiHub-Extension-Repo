// 0.1.0 — automatic mirror fallback (runtime/engine.js): dead selected domain -> next live mirror, remembered.
import assert from 'assert';
import { VBookEngine } from '../runtime/engine.js';
function mkHost(cfg = {}) {
  const store = {}; const calls = [];
  return { calls, store, name: 'test',
    config: k => cfg[k] == null ? null : cfg[k],
    storageGet: k => store[k] == null ? null : store[k], storageSet: (k, v) => { if (v == null) delete store[k]; else store[k] = v; },
    log: () => {},
    request: async req => { calls.push(req.url); if (/dead1|dead2/.test(req.url)) return { status: 0, url: req.url, headers: {}, text: '' };
      if (/cf52x/.test(req.url)) return { status: 521, url: req.url, headers: {}, text: '' };
      return { status: 200, url: req.url, headers: {}, text: 'ok ' + req.url }; } };
}
const meta = { source: 'https://dead1.example', config: { DOMAIN: { default: 'https://dead1.example', values: ['https://dead1.example', 'https://cf52x.example', 'https://dead2.example', 'https://live.example'] } }, configDefaults: { DOMAIN: 'https://dead1.example' } };
let pass = 0;
{ // 1. falls through dead + 52x mirrors to the live one, keeps the path
  const h = mkHost(); const e = new VBookEngine({ meta, scripts: {}, host: h });
  const r = await e.env.fetch('https://dead1.example/the-loai/a?page=2');
  assert.equal(r.status, 200); assert.equal(r.url, 'https://live.example/the-loai/a?page=2');
  assert.equal(e.base, 'https://live.example'); pass++;
  // 2. next request goes straight to the remembered mirror
  h.calls.length = 0; await e.env.fetch('https://dead1.example/x'); assert.deepEqual(h.calls, ['https://live.example/x']); pass++;
  // 3. remembered across engine instances (app restart)
  const e2 = new VBookEngine({ meta, scripts: {}, host: h }); assert.equal(e2.base, 'https://live.example'); pass++;
  // 4. canonical URLs (Resume A Video identity) still use the default domain
  assert.equal(e.canon('https://live.example/phim/1'), 'https://dead1.example/phim/1'); pass++;
}
{ // 5. DOMAIN_CUSTOM is never overridden
  const h = mkHost({ DOMAIN_CUSTOM: 'https://dead2.example' }); const e = new VBookEngine({ meta, scripts: {}, host: h });
  await e.env.fetch('https://dead2.example/a'); assert.equal(e.base, 'https://dead2.example'); pass++;
}
{ // 6. user picking another domain resets the automatic choice
  const h = mkHost(); h.store.__autoBase__ = JSON.stringify({ from: 'https://other.example', to: 'https://live.example' });
  const e = new VBookEngine({ meta, scripts: {}, host: h }); assert.equal(e.base, 'https://dead1.example'); pass++;
}
{ // 7. unrelated hosts (CDN, API) are never rewritten
  const h = mkHost(); const e = new VBookEngine({ meta, scripts: {}, host: h });
  const r = await e.env.fetch('https://dead2.cdn-other.net/img.jpg'); assert.equal(r.status, 0); assert.equal(h.calls.length, 1); pass++;
}
console.log(`domain-fallback: ${pass}/7 PASS`);
