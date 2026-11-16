// 0.0.6: flexible domain switching — node test/domain-switch.test.mjs
import { VBookEngine } from '../runtime/engine.js';
const meta = { id: 't', source: 'https://old.example.com', config: { DOMAIN: { default: 'https://old.example.com', values: ['https://old.example.com', 'https://mirror.example.net'] } }, configDefaults: { DOMAIN: 'https://old.example.com' } };
function mk(cfg) {
  const seen = [];
  const env = { fetch: (u) => { seen.push(u); return { ok: true }; } };
  const e = new VBookEngine({ meta, scripts: {}, env, host: { config: k => cfg[k] ?? null } });
  return { e, env, seen };
}
let fail = 0; const eq = (a, b, m) => { if (a !== b) { fail++; console.log('FAIL', m, a, '!=', b); } else console.log('ok  ', m); };
{ const { e, env, seen } = mk({}); env.fetch('https://old.example.com/a?x=1'); eq(seen[0], 'https://old.example.com/a?x=1', 'default domain untouched'); eq(e.base, 'https://old.example.com', 'base = default'); }
{ const { e, env, seen } = mk({ DOMAIN: 'https://mirror.example.net/' }); env.fetch('https://old.example.com/a'); env.fetch('https://www.old.example.com/b'); env.fetch('https://cdn.other.org/c.jpg');
  eq(seen[0], 'https://mirror.example.net/a', 'list choice redirects hard-coded URL'); eq(seen[1], 'https://mirror.example.net/b', 'www. variant redirected'); eq(seen[2], 'https://cdn.other.org/c.jpg', 'foreign host untouched');
  eq(e.canon('https://mirror.example.net/truyen/1'), 'https://old.example.com/truyen/1', 'canon keeps stable id'); }
{ const { e, env, seen } = mk({ DOMAIN: 'https://mirror.example.net', DOMAIN_CUSTOM: 'https://brand-new.site' }); env.fetch('https://mirror.example.net/x'); env.fetch('https://api.old.example.com/y');
  eq(e.base, 'https://brand-new.site', 'custom wins'); eq(seen[0], 'https://brand-new.site/x', 'mirror -> custom'); eq(seen[1], 'https://api.old.example.com/y', 'sub-domain api. untouched');
  eq(e.canon('https://brand-new.site/p/2'), 'https://old.example.com/p/2', 'custom domain canonicalised'); eq(e.decanon('https://old.example.com/p/2'), 'https://brand-new.site/p/2', 'decanon to custom'); }
{ const { e } = mk({ DOMAIN_CUSTOM: 'not a url' }); eq(e.base, 'https://old.example.com', 'invalid custom ignored'); }
process.exit(fail ? 1 : 0);
