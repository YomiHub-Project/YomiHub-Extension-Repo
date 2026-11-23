// 0.0.9: Filter Extension (10 filters), Adblock/DevTools/Sniff, Direct Video Playback (depth 3, no webview)
// Run: node test/filter-extension.test.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { VBookEngine, buildFilterSchema, normalizeFilters } from '../runtime/engine.js';
import { parseHtml } from '../runtime/dom.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadModule(pkg) {
  for (const c of [path.join(ROOT, 'node_modules'), path.join(ROOT, '_work/deps/node_modules'), path.join(ROOT, '../_work/deps/node_modules')]) {
    if (fs.existsSync(path.join(c, pkg))) return createRequire(path.join(c, 'x.js'))(pkg);
  }
  throw new Error(pkg + ' not found');
}

const REQUIRED_FILTER_IDS = [
  'sort', 'status', 'category', 'content_rating', 'country',
  'year', 'search_by', 'rating', 'translation', 'genres',
];

let passed = 0;
async function test(name, fn) {
  await fn();
  passed++;
  console.log('ok  ', name);
}

function makeMockEnv(fetchMap = {}) {
  return {
    Response: {
      success: (data, data2) => ({ code: 0, data: data === undefined ? null : data, data2: data2 === undefined ? null : data2 }),
      error: (m) => ({ code: 1, data: String(m || 'error') }),
    },
    Html: { parse: (s, b) => parseHtml(s, b) },
    UserAgent: { chrome: () => 'MockUA/1.0' },
    fetch: async (url) => {
      const text = typeof fetchMap[url] === 'function' ? fetchMap[url](url) : (fetchMap[url] || '');
      const ok = Boolean(text);
      return { ok, status: ok ? 200 : 404, url, text: () => text, html: () => parseHtml(text, url), json: () => JSON.parse(text) };
    },
  };
}

function makeTestEngine(extra = {}) {
  const meta = Object.assign({
    id: 'demo', name: 'Demo Source', source: 'https://demo.example.com', type: 'novel', locale: 'vi', nsfw: false,
  }, extra.meta || {});
  const tabs = [
    { title: 'Phổ biến', input: '/popular', script: 'gen.js' },
    { title: 'Mới cập nhật', input: '/latest', script: 'gen.js' },
  ];
  const genres = [
    { title: 'Tiên Hiệp', input: '/the-loai/tien-hiep', script: 'search.js' },
    { title: 'Kiếm Hiệp', input: '/the-loai/kiem-hiep', script: 'search.js' },
  ];
  const calls = [];
  const defaultItems = [
    { name: 'Zeta Novel', link: '/zeta', description: 'Nhật Bản, 2025, 9.2 sao, Vietsub, Đang tiến hành', host: meta.source },
    { name: 'Alpha Novel', link: '/alpha', description: 'Trung Quốc, 2023, 7.5 sao, Convert, Hoàn thành', host: meta.source },
    { name: 'Beta Novel', link: '/beta', description: 'Việt Nam, 2018, 8.5 sao, Raw, Đang tiến hành', host: meta.source },
  ];
  const env = extra.env || makeMockEnv(extra.fetchMap);
  const scripts = Object.assign({
    home: async () => async () => env.Response.success(tabs),
    genre: async () => async () => env.Response.success(genres),
    gen: async () => async (input, tok) => {
      calls.push({ script: 'gen', input, tok });
      return env.Response.success(defaultItems, '');
    },
    search: async () => async (q, tok, f) => {
      calls.push({ script: 'search', q, tok, f });
      if (q === '/the-loai/tien-hiep') {
        return env.Response.success([{ name: 'Tiên Nghịch', link: '/tien-nghich', description: 'Tiên Hiệp', host: meta.source }], '');
      }
      return env.Response.success(defaultItems, '');
    },
  }, extra.scripts || {});
  const eng = new VBookEngine({ meta, scripts, env, host: { config: () => null, log: () => {} } });
  return { eng, calls, env, meta };
}

// 1. VBookEngine 10 filters & routing
await test('VBookEngine.getFilters() returns all 10 standard filters with dynamic tabs & genres', async () => {
  const { eng } = makeTestEngine();
  const list = await eng.getFilters();
  assert.equal(list.length, 10);
  assert.deepEqual(list.map(f => f.id), REQUIRED_FILTER_IDS);
  const cat = list.find(f => f.id === 'category');
  assert.ok(cat.options.some(o => o.label === 'Phổ biến' && o.value === 'tab:0'));
  assert.ok(cat.options.some(o => o.label === 'Mới cập nhật' && o.value === 'tab:1'));
  const gen = list.find(f => f.id === 'genres');
  assert.ok(gen.options.some(o => o.label === 'Tiên Hiệp' && o.value === '/the-loai/tien-hiep'));
});

await test('VBookEngine.search() preserves legacy behavior for default filters', async () => {
  const { eng, calls } = makeTestEngine();
  const r = await eng.search('naruto', 1);
  assert.equal(r.items.length, 3);
  assert.equal(calls[0].script, 'search');
  assert.equal(calls[0].q, 'naruto');
  assert.equal(calls[0].f, undefined);
});

await test('VBookEngine.search() routes category tab, genre URL, search_by, and client filters/sort', async () => {
  const { eng, calls } = makeTestEngine();
  const rGenre = await eng.search('', 1, { genres: ['Tiên Hiệp'] });
  assert.equal(rGenre.items[0].name, 'Tiên Nghịch');
  assert.equal(calls.at(-1).q, '/the-loai/tien-hiep');

  const rCat = await eng.search('', 1, { category: 'tab:1', sort: 'az' });
  assert.equal(calls.at(-1).script, 'gen');
  assert.equal(calls.at(-1).input, '/latest');
  assert.deepEqual(rCat.items.map(i => i.name), ['Alpha Novel', 'Beta Novel', 'Zeta Novel']);

  const rComplex = await eng.search('', 1, { search_by: 'Kiếm', status: 'ongoing', year: '2025', rating: '9', country: 'jp', translation: 'sub' });
  assert.equal(calls.at(-1).q, 'Kiếm');
  assert.deepEqual(rComplex.items.map(i => i.name), ['Zeta Novel']);

  const rOld = await eng.search('', 1, { year: 'before_2020' });
  assert.deepEqual(rOld.items.map(i => i.name), ['Beta Novel']);
});

// 2. VBookEngine.videos() depth-3 iframe unwrapping & NO webview
await test('VBookEngine.videos() resolves 3-level iframe from webview track and never returns webview', async () => {
  const fetchMap = {
    'https://demo.example.com/embed/0': '<iframe src="https://adnetwork.doubleclick.net/ad"></iframe><iframe src="https://player1.example.com/e/1"></iframe>',
    'https://player1.example.com/e/1': '<iframe data-src="https://player2.example.com/e/2"></iframe>',
    'https://player2.example.com/e/2': '<iframe src="https://player3.example.com/e/3?url=https%3A%2F%2Fcdn.example.com%2Fvideo%2Fmaster.m3u8"></iframe>',
    'https://dead.example.com/embed': '<html><body>No video here</body></html>',
  };
  const { eng } = makeTestEngine({
    meta: { type: 'video' },
    fetchMap,
    scripts: {
      track: async () => async (url) => ({
        code: 0,
        data: [
          { type: 'webview', data: url },
          { type: 'webview', data: 'https://dead.example.com/embed' },
        ],
      }),
    },
  });
  const vids = await eng.videos('https://demo.example.com/embed/0');
  assert.equal(vids.length, 1);
  assert.equal(vids[0].url, 'https://cdn.example.com/video/master.m3u8');
  assert.ok(vids[0].headers.Referer);
  assert.ok(vids[0].headers.Origin);
  assert.ok(vids[0].headers['User-Agent']);
});

// 3. Rhino prelude + ES5 transpiled engine
await test('Rhino prelude (__call filters & search with filtersJson) works in ES5 VM', async () => {
  const ts = loadModule('typescript');
  let engCode = fs.readFileSync(path.join(ROOT, 'runtime/engine.js'), 'utf8');
  engCode = engCode.replace(/^import .*$/gm, '').replace(/^export /gm, '').replace(/\basync\s+(?=[\w(])/g, '').replace(/\bawait\s+/g, '');
  const es5Eng = ts.transpileModule(engCode, { compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.None, removeComments: true } }).outputText;
  const prelude = fs.readFileSync(path.join(ROOT, 'runtime/rhino-prelude.js'), 'utf8');

  const ctx = vm.createContext({
    __host: {
      config: () => null,
      log: () => {},
      resolve: (b, u) => new URL(u, b).toString(),
      storageGet: () => null,
      storageSet: () => {},
      sleep: () => {},
      parse: (h, b) => parseHtml(h, b),
      request: () => ({ status: 200, url: 'https://demo.example.com', headers: '{}', text: () => '', base64: () => '', size: () => 0 }),
    },
  });
  vm.runInContext(prelude + '\n' + es5Eng, ctx);
  vm.runInContext(`
    __register({
      META: { id: 'r1', name: 'RhinoTest', source: 'https://demo.example.com', type: 'comic', locale: 'vi', nsfw: false, config: {}, configDefaults: {} },
      SCRIPTS: {
        home: function(env){ return function(){ return env.Response.success([{ title: 'Hot', input: '/hot', script: 'gen.js' }]); }; },
        genre: function(env){ return function(){ return env.Response.success([{ title: 'Action', input: '/the-loai/action', script: 'search.js' }]); }; },
        search: function(env){ return function(q){ return env.Response.success([{ name: 'Z Comic', link: '/z', description: '2025', host: 'https://demo.example.com' }, { name: 'A Comic', link: '/a', description: '2024', host: 'https://demo.example.com' }], ''); }; }
      }
    });
  `, ctx);
  const fRes = JSON.parse(vm.runInContext("__call('filters')", ctx));
  assert.equal(fRes.ok, true);
  assert.deepEqual(fRes.result.map(x => x.id), REQUIRED_FILTER_IDS);

  const sRes = JSON.parse(vm.runInContext("__call('search', 'comic', 1, '{\"sort\":\"az\",\"year\":\"2025\"}')", ctx));
  assert.equal(sRes.ok, true);
  assert.deepEqual(sRes.result.items.map(i => i.name), ['Z Comic']);
});

// 4. Mangayomi tail
await test('Mangayomi tail getFilterList() & search() handle all 10 filters + short video feed', async () => {
  const { eng, meta } = makeTestEngine({ meta: { type: 'video', itemType: 1, short: true, shorts: true } });
  const tail = fs.readFileSync(path.join(ROOT, 'hosts/mangayomi.tail.js'), 'utf8');
  class MProvider {}
  class Client { async get() { return { statusCode: 200, headers: {}, body: '' }; } }
  class SharedPreferences { get() { return ''; } getString() { return ''; } setString() {} }
  const ctx = vm.createContext({
    MProvider, Client, SharedPreferences, console,
    __VB: { META: meta, UA: 'MockUA', create: () => eng },
  });
  vm.runInContext(tail + '\nthis.__ext = new DefaultExtension();', ctx);
  const filters = ctx.__ext.getFilterList();
  assert.equal(filters.length, 11);
  assert.equal(filters[0].type, 'feed');
  assert.deepEqual(Array.from(filters.slice(1), f => f.type), REQUIRED_FILTER_IDS);
  // Modify sort to index 5 (az) & year to 2025
  const sortF = filters.find(f => f.type === 'sort');
  sortF.state = { type_name: 'SortState', index: 5, ascending: true };
  const yearF = filters.find(f => f.type === 'year');
  yearF.state = yearF.values.findIndex(v => v.value === '2025');
  const res = await ctx.__ext.search('', 1, filters);
  assert.deepEqual(Array.from(res.list, i => i.name), ['Zeta Novel']);
});

// 5. LNReader adapter
await test('LNReader plugin assigns 10 filters (Picker/Text/Checkbox) & filters popularNovels()', async () => {
  const esbuild = loadModule('esbuild');
  const stubScriptsPlugin = {
    name: 'stub-scripts',
    setup(b) {
      b.onResolve({ filter: /^__generated__\/scripts\.js$/ }, () => ({ path: 'stub-scripts', namespace: 'stub' }));
      b.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({
        contents: `
          export const META = { id: 'ln1', name: 'LN', source: 'https://ln.example.com', type: 'novel', locale: 'vi', nsfw: false, version: 1, config: {}, configDefaults: {}, itemType: 2, lnId: 'kiritokmn.ln1', lnIcon: '', lnVersion: '1.4.1' };
          export const SCRIPTS = {
            home: async (env) => async () => env.Response.success([{ title: 'Mới', input: '/moi', script: 'gen.js' }]),
            gen: async (env) => async () => env.Response.success([
              { name: 'Truyện B', link: '/b', description: 'Hoàn thành, 2025', host: 'https://ln.example.com' },
              { name: 'Truyện A', link: '/a', description: 'Đang tiến hành, 2024', host: 'https://ln.example.com' },
            ], ''),
            search: async (env) => async () => env.Response.success([
              { name: 'Truyện B', link: '/b', description: 'Hoàn thành, 2025', host: 'https://ln.example.com' },
              { name: 'Truyện A', link: '/a', description: 'Đang tiến hành, 2024', host: 'https://ln.example.com' },
            ], ''),
          };
        `,
        loader: 'js',
      }));
      b.onResolve({ filter: /^@libs\// }, args => ({ path: args.path, external: true }));
    },
  };
  const built = await esbuild.build({
    entryPoints: [path.join(ROOT, 'hosts/lnreader.js')],
    bundle: true, write: false, format: 'cjs', platform: 'node',
    plugins: [stubScriptsPlugin], logLevel: 'silent',
  });
  const mod = { exports: {} };
  const fakeRequire = id => {
    if (id === '@libs/fetch') return { fetchApi: async () => ({ status: 200, url: '', headers: new Map(), text: async () => '' }) };
    if (id === '@libs/storage') return { storage: { get: () => null, set: () => {}, delete: () => {} } };
    throw new Error('unexpected require ' + id);
  };
  new Function('exports', 'require', 'module', built.outputFiles[0].text)(mod.exports, fakeRequire, mod);
  const plugin = mod.exports.default;
  assert.deepEqual(Object.keys(plugin.filters), REQUIRED_FILTER_IDS);
  assert.equal(plugin.filters.sort.type, 'Picker');
  assert.equal(plugin.filters.search_by.type, 'Text');
  assert.equal(plugin.filters.genres.type, 'Checkbox');
  const filtered = await plugin.popularNovels(1, { filters: { status: { type: 'Picker', value: 'completed' }, sort: { type: 'Picker', value: 'az' } } });
  assert.deepEqual(filtered.map(n => n.name), ['Truyện B']);
});

// 6. Aidoku tail & Rust/build artifacts
await test('Aidoku tail handles filters op & FilterValue list search; BRIDGE_REV = 5', async () => {
  const { eng, meta } = makeTestEngine({ meta: { type: 'comic' } });
  const tail = fs.readFileSync(path.join(ROOT, 'hosts/aidoku.tail.js'), 'utf8');
  const ctx = vm.createContext({
    __VB: { META: meta, UA: 'MockUA', create: () => eng },
  });
  vm.runInContext(tail, ctx);
  ctx.__A.init('{}');
  const runAidoku = async (op, args) => {
    const id = ctx.__A.start(op, JSON.stringify(args || {}), '{}');
    for (let i = 0; i < 20; i++) {
      await Promise.resolve();
      const st = JSON.parse(ctx.__A.poll(id));
      if (st.s === 'd') return st.v;
      if (st.s === 'e') throw new Error(st.m);
    }
    throw new Error('Aidoku task did not finish');
  };
  const fDef = await runAidoku('filters');
  assert.deepEqual(Array.from(fDef, f => f.id), REQUIRED_FILTER_IDS);
  const listRes = await runAidoku('list', {
    q: '', page: 1,
    filters: [
      { Sort: { id: 'sort', index: 5, ascending: true } },
      { Select: { id: 'year', value: '2025' } },
      { Text: { id: 'search_by', value: '' } },
      { MultiSelect: { id: 'genres', included: [], excluded: [] } },
    ],
  });
  assert.deepEqual(Array.from(listRes.e, x => x.t), ['Zeta Novel']);

  const buildSrc = fs.readFileSync(path.join(ROOT, 'tools/build/aidoku-build.mjs'), 'utf8');
  assert.match(buildSrc, /const BRIDGE_REV = 5;/);
  assert.match(buildSrc, /Payload\/filters\.json/);
  const rustSrc = fs.readFileSync(path.join(ROOT, 'aidoku/bridge/src/lib.rs'), 'utf8');
  assert.match(rustSrc, /filters: Vec<FilterValue>/);
});

// 7. lib_common.js & lib_generic.js: cleanAds, cleanDevTools, sniff, pages ad-filter, track depth 3 & no webview
await test('lib_common & lib_generic: cleanAds, cleanDevTools, sniff, pages() ad filter, track() depth 3 & no webview', async () => {
  const commonCode = fs.readFileSync(path.join(ROOT, 'lib/lib_common.js'), 'utf8');
  const genericCode = fs.readFileSync(path.join(ROOT, 'lib/lib_generic.js'), 'utf8');

  const pagesMap = {
    'https://vid.example.com/ep1': '<iframe src="https://popads.net/pop.html"></iframe><iframe src="https://vid.example.com/ifr1"></iframe>',
    'https://vid.example.com/ifr1': '<iframe data-src="https://vid.example.com/ifr2"></iframe>',
    'https://vid.example.com/ifr2': '<iframe src="https://vid.example.com/ifr3"></iframe>',
    'https://vid.example.com/ifr3': `<script>debugger;setInterval(function(){debugger;},1000);</script><script>eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\\\b'+e(c)+'\\\\b','g'),k[c])}}return p}('0 1="2://3.4.5/6/7.8";',9,9,'var|urlStream|https|cdn|vid|example|hls|stream|m3u8'.split('|'),0,{}))</script>`,
    'https://vid.example.com/noway': '<html><body>no playable url</body></html>',
    'https://comic.example.com/chap1': `
      <div class="page-chapter">
        <img src="https://cdn.comic.example.com/p1.jpg">
        <img src="https://cdn.comic.example.com/banner-quang-cao.jpg">
        <img src="https://pagead2.googlesyndication.com/pagead/imgad.png">
        <div class="ads"><img src="https://cdn.comic.example.com/hidden-ad.jpg"></div>
        <img src="https://cdn.comic.example.com/p2.jpg">
      </div>`,
  };

  const sandbox = {
    BASE_URL: 'https://vid.example.com',
    G: { pages: '.page-chapter img' },
    Response: {
      success: (d, d2) => ({ code: 0, data: d, data2: d2 }),
      error: (m) => ({ code: 1, data: m }),
    },
    Html: { parse: (s, b) => parseHtml(s, b) },
    UserAgent: { chrome: () => 'MockChrome/130' },
    sleep: () => {},
    fetch: (url) => {
      const txt = pagesMap[url] || '';
      return { ok: !!txt, status: txt ? 200 : 404, url, text: () => txt, html: () => parseHtml(txt, url) };
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(commonCode + '\n' + genericCode, sandbox);

  // cleanAds on HTML string & DOM element
  const dirtyHtml = '<p>Nội dung chương 1</p><div class="ads">Quảng cáo</div><div id="adblock-detector-modal">Tắt adblock</div><ins class="adsbygoogle"></ins><iframe src="https://ads.example.com"></iframe><script>debugger;devtools-detector</script>';
  const cleaned = sandbox.C.cleanAds(dirtyHtml);
  assert.ok(cleaned.includes('Nội dung chương 1'));
  assert.ok(!cleaned.includes('Quảng cáo'));
  assert.ok(!cleaned.includes('adblock-detector-modal'));
  assert.ok(!cleaned.includes('adsbygoogle'));
  assert.ok(!cleaned.includes('<iframe'));
  assert.ok(!cleaned.includes('debugger'));

  const docEl = parseHtml('<div id="c"><p>Văn bản thật</p><div class="popup-ad">Popup</div><img src="https://cdn.example.com/1x1.gif"><script>Function("debugger")()</script></div>', '').select('#c').first();
  const cleanDomHtml = sandbox.C.cleanContent(docEl);
  assert.ok(cleanDomHtml.includes('Văn bản thật'));
  assert.ok(!cleanDomHtml.includes('Popup'));
  assert.ok(!cleanDomHtml.includes('1x1.gif'));
  assert.ok(!cleanDomHtml.includes('debugger'));

  // cleanDevTools & sniff (b64, ?url=, packed)
  assert.equal(sandbox.C.cleanDevTools('var x=1; debugger; console.clear(); Function("debugger")();'), 'var x=1;   ');
  const b64Url = Buffer.from('https://cdn.example.com/live/index.m3u8?t=1').toString('base64');
  assert.equal(sandbox.C.sniff(`var x="${b64Url}";`), 'https://cdn.example.com/live/index.m3u8?t=1');
  assert.equal(sandbox.C.sniff('src="https://player.site/embed?url=https%3A%2F%2Fcdn.site%2Fvid.mp4"'), 'https://cdn.site/vid.mp4');

  // pages() ad banner filtering
  const pgRes = sandbox.X.pages('https://comic.example.com/chap1');
  assert.deepEqual(Array.from(pgRes.data), ['https://cdn.comic.example.com/p1.jpg', 'https://cdn.comic.example.com/p2.jpg']);

  // track() 3-depth iframe + packed unpack + headers + NO webview
  const trOk = sandbox.X.track('https://vid.example.com/ep1');
  assert.equal(trOk.code, 0);
  assert.equal(trOk.data.type, 'native');
  assert.equal(trOk.data.data, 'https://cdn.vid.example/hls/stream.m3u8');
  assert.equal(trOk.data.headers.Referer, 'https://vid.example.com/ifr3');
  assert.equal(trOk.data.headers.Origin, 'https://vid.example.com');
  assert.equal(trOk.data.headers['User-Agent'], 'MockChrome/130');

  const trFail = sandbox.X.track('https://vid.example.com/noway');
  assert.equal(trFail.code, 1);
  assert.notEqual(trFail.data && trFail.data.type, 'webview');
});

console.log(`ALL ${passed} TESTS PASSED`);
