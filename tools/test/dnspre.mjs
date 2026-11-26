// preload (from 0.1.1, moved from _work/v010): resolve through 1.1.1.1/8.8.8.8 (ISP DNS blocks some sites) - same as run-tests --dns. Use: node --import ./tools/test/dnspre.mjs <script>
import dns from 'node:dns'; const R = new dns.Resolver(); R.setServers(['1.1.1.1', '8.8.8.8']);
const ol = dns.lookup;
dns.lookup = (h, o, cb) => { if (typeof o === 'function') { cb = o; o = {}; } R.resolve4(h, (e, a) => { if (e || !a || !a.length) return ol(h, o, cb); if (o && o.all) cb(null, a.map(x => ({ address: x, family: 4 }))); else cb(null, a[0], 4); }); };
