package kiritokmn.vbook.manga

import android.content.SharedPreferences
import androidx.preference.EditTextPreference
import androidx.preference.ListPreference
import androidx.preference.PreferenceScreen
import eu.kanade.tachiyomi.source.ConfigurableSource
import eu.kanade.tachiyomi.source.Source
import eu.kanade.tachiyomi.source.SourceFactory
import eu.kanade.tachiyomi.source.model.Filter
import eu.kanade.tachiyomi.source.model.FilterList
import eu.kanade.tachiyomi.source.model.MangasPage
import eu.kanade.tachiyomi.source.model.Page
import eu.kanade.tachiyomi.source.model.SChapter
import eu.kanade.tachiyomi.source.model.SManga
import eu.kanade.tachiyomi.source.online.HttpSource
import kiritokmn.vbook.SourceDef
import kiritokmn.vbook.VBookRuntime
import kiritokmn.vbook.loadSourceDefs
import okhttp3.Headers
import okhttp3.Request
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import rx.Observable

private object Assets {
    fun read(path: String): String =
        VBookMangaFactory::class.java.classLoader!!.getResourceAsStream("assets/$path")!!.bufferedReader().use { it.readText() }
}

class VBookMangaFactory : SourceFactory {
    override fun createSources(): List<Source> =
        loadSourceDefs(Assets.read("vb/sources.json")).filter { it.type == "comic" }.map { VBookMangaSource(it) }
}

open class MangaSortFilter(name: String, values: Array<String>, val rawValues: Array<String>) :
    Filter.Sort(name, values)
open class MangaSelectFilter(val id: String, name: String, values: Array<String>, val rawValues: Array<String>, state: Int = 0) :
    Filter.Select<String>(name, values, state)
open class MangaTextFilter(val id: String, name: String) : Filter.Text(name)
open class MangaGenreCheckBox(name: String, val value: String) : Filter.CheckBox(name, false)
open class MangaGenreGroup(name: String, genres: List<MangaGenreCheckBox>) : Filter.Group<MangaGenreCheckBox>(name, genres)

class VBookMangaSource(private val def: SourceDef) : HttpSource(), ConfigurableSource {
    override val name = def.name
    override val lang = def.lang
    override val supportsLatest = true
    override val id: Long = def.sourceId

    private val preferences: SharedPreferences by lazy {
        kiritokmn.vbook.appContext().getSharedPreferences("source_$id", 0x0000)
    }
    // 0.0.6: custom domain (free text) > domain picked from the list > default
    override val baseUrl: String get() = listOf("DOMAIN_CUSTOM", "DOMAIN").firstNotNullOfOrNull { k -> preferences.getString(k, null)?.trim()?.takeIf { it.startsWith("http://") || it.startsWith("https://") } }?.trimEnd('/') ?: def.baseUrl

    private val rt by lazy { VBookRuntime(Assets::read, def, client, preferences) }
    private var filterDefs: List<JSONObject>? = null

    override fun headersBuilder(): Headers.Builder = super.headersBuilder().add("Referer", "$baseUrl/")

    private fun page(o: JSONObject): MangasPage {
        val r = o.getJSONObject("result")
        val items = r.getJSONArray("items")
        val list = (0 until items.length()).map { i ->
            val it = items.getJSONObject(i)
            SManga.create().apply { url = it.getString("link"); title = it.getString("name"); thumbnail_url = it.optString("cover").ifBlank { null } }
        }
        return MangasPage(list, r.optBoolean("hasNext"))
    }

    override fun fetchPopularManga(page: Int): Observable<MangasPage> = Observable.fromCallable { page(rt.callObject("popular", page)) }
    override fun fetchLatestUpdates(page: Int): Observable<MangasPage> = Observable.fromCallable { page(rt.callObject("latest", page)) }
    override fun fetchSearchManga(page: Int, query: String, filters: FilterList): Observable<MangasPage> =
        Observable.fromCallable { page(rt.callObject("search", query, page, serializeFilters(filters))) }

    private fun loadFilterDefs(): List<JSONObject> {
        filterDefs?.let { return it }
        return try {
            val res = rt.callObject("filters").getJSONArray("result")
            (0 until res.length()).map { res.getJSONObject(it) }.also { filterDefs = it }
        } catch (e: Exception) {
            emptyList()
        }
    }

    override fun getFilterList(): FilterList {
        val defs = loadFilterDefs()
        if (defs.isEmpty()) return FilterList(emptyList())
        val list = mutableListOf<Filter<*>>()
        for (d in defs) {
            val id = d.getString("id")
            val title = d.getString("title")
            val type = d.getString("type")
            when {
                id == "sort" || type == "sort" -> {
                    val opts = d.getJSONArray("options")
                    val labels = Array(opts.length()) { opts.getJSONObject(it).getString("label") }
                    val values = Array(opts.length()) { opts.getJSONObject(it).getString("value") }
                    list.add(MangaSortFilter(title, labels, values))
                }
                type == "select" -> {
                    val opts = d.getJSONArray("options")
                    val labels = Array(opts.length()) { opts.getJSONObject(it).getString("label") }
                    val values = Array(opts.length()) { opts.getJSONObject(it).getString("value") }
                    list.add(MangaSelectFilter(id, title, labels, values))
                }
                type == "text" -> {
                    list.add(MangaTextFilter(id, title))
                }
                type == "multi-select" || id == "genres" -> {
                    val opts = d.getJSONArray("options")
                    val cbs = (0 until opts.length()).map {
                        val o = opts.getJSONObject(it)
                        MangaGenreCheckBox(o.getString("label"), o.getString("value"))
                    }
                    list.add(MangaGenreGroup(title, cbs))
                }
            }
        }
        return FilterList(list)
    }

    private fun serializeFilters(filters: FilterList): String {
        if (filters.isEmpty()) return ""
        val json = JSONObject()
        val genresArr = JSONArray()
        for (f in filters) {
            when (f) {
                is MangaSortFilter -> {
                    f.state?.let { sel ->
                        json.put("sort", f.rawValues.getOrNull(sel.index) ?: "")
                        json.put("sortAscending", sel.ascending)
                    }
                }
                is MangaSelectFilter -> {
                    val v = f.rawValues.getOrNull(f.state) ?: ""
                    json.put(f.id, v)
                }
                is MangaTextFilter -> {
                    if (f.state.isNotBlank()) {
                        json.put(f.id, f.state.trim())
                    }
                }
                is MangaGenreGroup -> {
                    for (cb in f.state) {
                        if (cb.state) genresArr.put(cb.value)
                    }
                }
                else -> {}
            }
        }
        if (genresArr.length() > 0) {
            json.put("genres", genresArr)
        }
        return json.toString()
    }

    override fun fetchMangaDetails(manga: SManga): Observable<SManga> = Observable.fromCallable {
        val d = rt.callObject("detail", manga.url).getJSONObject("result")
        SManga.create().apply {
            url = manga.url
            title = d.optString("name").ifBlank { manga.title }
            thumbnail_url = d.optString("cover").ifBlank { manga.thumbnail_url }
            author = d.optString("author").ifBlank { null }
            description = listOf(d.optString("description"), d.optString("detail")).filter { it.isNotBlank() }.joinToString("\n\n")
            val g = d.optJSONArray("genres")
            genre = if (g == null) null else (0 until g.length()).joinToString(", ") { g.getString(it) }
            status = if (d.optBoolean("ongoing", true)) SManga.ONGOING else SManga.COMPLETED
            initialized = true
        }
    }

    override fun fetchChapterList(manga: SManga): Observable<List<SChapter>> = Observable.fromCallable {
        val arr = rt.callObject("chapters", manga.url).getJSONArray("result")
        (0 until arr.length()).map { i ->
            val c = arr.getJSONObject(i)
            SChapter.create().apply { url = c.getString("url"); name = c.getString("name"); chapter_number = (i + 1).toFloat() }
        }.reversed()
    }

    override fun fetchPageList(chapter: SChapter): Observable<List<Page>> = Observable.fromCallable {
        val arr = rt.callObject("pages", chapter.url).getJSONArray("result")
        (0 until arr.length()).map { i -> Page(i, "", arr.getString(i)) }
    }

    override fun getMangaUrl(manga: SManga): String = manga.url
    override fun getChapterUrl(chapter: SChapter): String = chapter.url

    override fun setupPreferenceScreen(screen: PreferenceScreen) {
        // 0.0.6: flexible domain switching — pick a known domain (incl. the ones in the owner's Excel sheet) or type a new one
        val doms = (listOf(def.baseUrl) + def.domains).map { it.trim().trimEnd('/') }.filter { it.isNotEmpty() }.distinct().toTypedArray()
        ListPreference(screen.context).apply {
            key = "DOMAIN"
            title = "Tên miền / Domain"
            entries = doms; entryValues = doms
            summary = "%s"
            setDefaultValue(doms.first())
        }.also(screen::addPreference)
        EditTextPreference(screen.context).apply {
            key = "DOMAIN_CUSTOM"
            title = "Tên miền tuỳ chỉnh / Custom domain"
            summary = "Để trống = dùng tên miền đã chọn ở trên. Hiện tại: $baseUrl"
            dialogTitle = "Tên miền tuỳ chỉnh"
            dialogMessage = "Nhập tên miền mới khi trang đổi địa chỉ (VD: https://example.com). Để trống để dùng danh sách."
            setDefaultValue("")
        }.also(screen::addPreference)
        def.prefs.forEach { p ->
            EditTextPreference(screen.context).apply {
                key = p[0]; title = p[1]; summary = p[2].ifBlank { null }; dialogTitle = p[1]; dialogMessage = p[2]; setDefaultValue(p[3])
            }.also(screen::addPreference)
        }
    }

    override fun popularMangaRequest(page: Int): Request = throw UnsupportedOperationException()
    override fun popularMangaParse(response: Response): MangasPage = throw UnsupportedOperationException()
    override fun latestUpdatesRequest(page: Int): Request = throw UnsupportedOperationException()
    override fun latestUpdatesParse(response: Response): MangasPage = throw UnsupportedOperationException()
    override fun searchMangaRequest(page: Int, query: String, filters: FilterList): Request = throw UnsupportedOperationException()
    override fun searchMangaParse(response: Response): MangasPage = throw UnsupportedOperationException()
    override fun mangaDetailsParse(response: Response): SManga = throw UnsupportedOperationException()
    override fun chapterListParse(response: Response): List<SChapter> = throw UnsupportedOperationException()
    override fun pageListParse(response: Response): List<Page> = throw UnsupportedOperationException()
    override fun imageUrlParse(response: Response): String = throw UnsupportedOperationException()
}
