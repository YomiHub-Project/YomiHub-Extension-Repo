
// ---- Mangayomi / YomiHub host adapter (appended after the bundled engine) ----
class DefaultExtension extends MProvider {
  constructor() { super(); this.client = new Client(); this.prefs = new SharedPreferences(); }
  get supportsLatest() { return true; }
  getHeaders(url) { return this.__imgHeaders(url); }
  __origin(u) { const m = /^https?:\/\/[^/?#]+/i.exec(String(u || '')); return m ? m[0] : ''; }
  __base() { const g = k => { let d = ''; try { d = this.prefs.get(k); } catch (e) { } d = typeof d === 'string' ? d.trim() : ''; return /^https?:\/\//i.test(d) ? d : ''; }; return (g('DOMAIN_CUSTOM') || g('DOMAIN') || __VB.META.source).replace(/\/+$/, ''); }
  // Image CDNs (truyenvua, hinhtruyen…) answer 403 unless Referer is the site itself: use the page's own origin.
  __imgHeaders(pageUrl) { return { Referer: (this.__origin(pageUrl) || this.__base()) + '/', 'User-Agent': __VB.UA, Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }; }
  __eng() {
    if (this.__e) return this.__e;
    const self = this;
    this.__e = __VB.create({
      name: 'Mangayomi',
      request: async (r) => {
        let res;
        if (r.method === 'POST') res = await self.client.post(r.url, r.headers, r.body == null ? '' : r.body);
        else res = await self.client.get(r.url, r.headers);
        return { status: res.statusCode, url: (res.request && res.request.url) || r.url, headers: res.headers || {}, text: res.body };
      },
      storageGet: k => { try { const v = self.prefs.getString('vb_' + k, ''); return v === '' || v == null ? null : v; } catch (e) { return null; } },
      storageSet: (k, v) => { try { self.prefs.setString('vb_' + k, v == null ? '' : String(v)); } catch (e) { } },
      config: k => { try { const v = self.prefs.get(k); return v == null || v === '' ? null : String(v); } catch (e) { return null; } },
      log: m => console.log(m),
    });
    return this.__e;
  }
  __list(r) { return { list: r.items.map(i => ({ name: i.name, imageUrl: i.cover, link: i.link })), hasNextPage: r.hasNext }; }
  async getPopular(page) { return this.__list(await this.__eng().popular(page)); }
  async getLatestUpdates(page) { return this.__list(await this.__eng().latest(page)); }
  async search(query, page, filters) {
    const parsed = this.__parseFilters(filters);
    return this.__list(await this.__eng().search(query, page, parsed));
  }
  __parseFilters(filters) {
    if (!filters) return {};
    if (typeof filters === 'string') { try { filters = JSON.parse(filters); } catch (e) { return {}; } }
    if (!Array.isArray(filters)) return filters;
    const out = { sort: '', sortAscending: false, status: '', category: '', content_rating: '', country: '', year: '', search_by: '', rating: '', translation: '', genres: [], feed: '' };
    const sortKeys = ['', 'latest', 'popular', 'views', 'rating', 'az'];
    for (const f of filters) {
      if (!f || typeof f !== 'object') continue;
      const key = f.type || '';
      if (f.type_name === 'SortFilter') {
        const idx = f.state && typeof f.state === 'object' ? (f.state.index | 0) : (f.state | 0);
        const opt = Array.isArray(f.values) ? f.values[idx] : null;
        out.sort = opt && opt.value != null ? String(opt.value) : (sortKeys[idx] || '');
        out.sortAscending = !!(f.state && f.state.ascending);
      } else if (f.type_name === 'SelectFilter') {
        const opt = Array.isArray(f.values) ? f.values[f.state | 0] : null;
        if (key in out) out[key] = opt && opt.value != null ? String(opt.value) : '';
      } else if (f.type_name === 'TextFilter') {
        if (key in out) out[key] = String(f.state || '').trim();
      } else if (f.type_name === 'GroupFilter' && Array.isArray(f.state)) {
        const sel = f.state.filter(c => c && c.state === true).map(c => String(c.value || c.name || '').trim()).filter(Boolean);
        if (key === 'genres') out.genres = sel;
      }
    }
    return out;
  }
  async getDetail(url) {
    const e = this.__eng();
    const d = await e.detail(url);
    const ch = (await e.chapters(url)).map(c => ({ name: c.name, url: c.url })).reverse();
    const out = { name: d.name, imageUrl: d.cover, description: d.description, author: d.author, status: d.ongoing ? 0 : 1, genre: d.genres, link: url };
    if (__VB.META.itemType === 1) out.episodes = ch; else out.chapters = ch;
    return out;
  }
  async getPageList(url) { const h = this.__imgHeaders(this.__eng().decanon(url)); return (await this.__eng().pages(url)).map(p => ({ url: p, headers: h })); }
  async getVideoList(url) {
    // Resume A Video: Mangayomi / YomiHub save the playback position per episode themselves and seek to it on
    // open ("Resume video position"). The engine keeps episode URLs stable (default domain), so it survives refreshes
    // and domain switches; nothing has to be added to the stream URL.
    const list = await this.__eng().videos(url);
    return list.map(v => ({ url: v.url, originalUrl: v.url, quality: v.quality, headers: v.headers, subtitles: v.subtitles, audios: v.audios || [] }));
  }
  async getHtmlContent(name, url) { const c = await this.__eng().content(url); return c.html; }
  async cleanHtmlContent(html) { return html; }
  getFilterList() {
    const m = __VB.META;
    const sel = (type, name, opts) => ({
      type_name: 'SelectFilter', type, name, state: 0,
      values: opts.map(o => ({ type_name: 'SelectOption', name: o[0], value: o[1] })),
    });
    const out = [];
    if (m.itemType === 1 && (m.short || m.shorts)) {
      out.push(sel('feed', 'Chế độ xem', [['Shorts (Video ngắn)', 'shorts'], ['Mặc định', '']]));
    }
    out.push({
      type_name: 'SortFilter',
      type: 'sort',
      name: 'Sắp Xếp',
      state: { type_name: 'SortState', index: 0, ascending: false },
      values: [
        ['Mặc định', ''], ['Mới cập nhật', 'latest'], ['Phổ biến nhất', 'popular'],
        ['Xem nhiều nhất', 'views'], ['Đánh giá cao', 'rating'], ['Tên A-Z', 'az'],
      ].map(o => ({ type_name: 'SelectOption', name: o[0], value: o[1] })),
    });
    out.push(sel('status', 'Tình Trạng', [['Tất Cả', ''], ['Đang Tiến Hành', 'ongoing'], ['Tạm Ngưng', 'hiatus'], ['Hoàn Thành', 'completed']]));
    const catOpts = [['Tất Cả', '']];
    if (Array.isArray(m.tabs) && m.tabs.length) {
      m.tabs.forEach((t, i) => catOpts.push([String(t.title || t.name || ('Danh mục ' + (i + 1))), 'tab:' + i]));
    } else {
      catOpts.push(['Phổ biến', 'popular'], ['Mới cập nhật', 'latest'], ['Hoàn thành', 'completed']);
    }
    out.push(sel('category', 'Danh Mục', catOpts));
    out.push(sel('content_rating', 'Phân Loại Nội Dung', [['Tất Cả', ''], ['An toàn (SFW)', 'sfw'], ['18+ (NSFW)', 'nsfw']]));
    out.push(sel('country', 'Quốc Gia Phát Hành', [['Tất Cả', ''], ['Việt Nam', 'vn'], ['Trung Quốc', 'cn'], ['Nhật Bản', 'jp'], ['Hàn Quốc', 'kr'], ['Âu Mỹ', 'us'], ['Khác', 'other']]));
    out.push(sel('year', 'Năm Phát Hành', [['Tất Cả', ''], ['2026', '2026'], ['2025', '2025'], ['2024', '2024'], ['2023', '2023'], ['2022', '2022'], ['2021', '2021'], ['2020', '2020'], ['Trước 2020', 'before_2020']]));
    out.push({ type_name: 'TextFilter', type: 'search_by', name: 'Tìm Theo (Tên / Tác giả / Từ khóa)', state: '' });
    out.push(sel('rating', 'Đánh Giá', [['Tất Cả', ''], ['Từ 9+ sao', '9'], ['Từ 8+ sao', '8'], ['Từ 7+ sao', '7'], ['Từ 5+ sao', '5']]));
    out.push(sel('translation', 'Bản Dịch', [['Tất Cả', ''], ['Vietsub / Dịch', 'sub'], ['Thuyết minh / Lồng tiếng', 'dub'], ['Convert', 'convert'], ['Raw / Gốc', 'raw']]));
    const gMap = {
      1: ['Hành động', 'Tình cảm', 'Hài hước', 'Cổ trang', 'Hoạt hình', 'Kinh dị', 'Viễn tưởng', 'Tâm lý', 'Võ thuật', 'Phiêu lưu', 'Anime', '18+'],
      0: ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Manhwa', 'Manhua', 'Manga', 'Romance', 'School Life', 'Shounen', 'Slice of Life', 'Tiên Hiệp', 'Xuyên Không'],
      2: ['Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn', 'Xuyên Không', 'Trọng Sinh', 'Hệ Thống', 'Đam Mỹ', 'Bách Hợp', 'Light Novel', 'Mạt Thế'],
    };
    const genres = Array.isArray(m.genres) && m.genres.length ? m.genres : (gMap[m.itemType] || gMap[2]);
    out.push({
      type_name: 'GroupFilter',
      type: 'genres',
      name: 'Thể Loại',
      state: genres.map(g => {
        const label = typeof g === 'string' ? g : String(g.title || g.name || g.label || '');
        const val = typeof g === 'string' ? g : String(g.input || g.value || label);
        return { type_name: 'CheckBox', type: 'genres', name: label, value: val, state: false };
      }).filter(c => c.name),
    });
    return out;
  }
  getSourcePreferences() {
    const m = __VB.META, c = (m.config || {}).DOMAIN;
    const prefs = [];
    if (c && Array.isArray(c.values) && c.values.length > 1) {
      prefs.push({ key: 'DOMAIN', listPreference: { title: 'Tên miền / Domain', summary: '%s', valueIndex: 0, entries: c.values, entryValues: c.values } });
    } else {
      prefs.push({ key: 'DOMAIN', editTextPreference: { title: 'Tên miền / Domain', summary: m.source, value: m.source, dialogTitle: 'Domain', dialogMessage: 'Đổi khi trang đổi tên miền (VD: https://example.com)' } });
    }
    // 0.0.6: any new domain the site moves to, without waiting for an extension update (empty = use the list above)
    prefs.push({ key: 'DOMAIN_CUSTOM', editTextPreference: { title: 'Tên miền tuỳ chỉnh / Custom domain', summary: 'Để trống = dùng tên miền đã chọn ở trên', value: '', dialogTitle: 'Custom domain', dialogMessage: 'Nhập tên miền mới khi trang đổi tên miền (VD: https://example.com). Để trống để dùng danh sách.' } });
    // 0.0.4: every other plugin.json config entry becomes an editable setting (e.g. TikTok/Douyin API server, region)
    Object.keys(m.config || {}).forEach(k => {
      if (k === 'DOMAIN') return; const o = m.config[k] || {};
      prefs.push({ key: k, editTextPreference: { title: o.title || k, summary: o.subtitle || '', value: String(o.default == null ? '' : o.default), dialogTitle: o.title || k, dialogMessage: o.subtitle || '' } });
    });
    return prefs;
  }
}
