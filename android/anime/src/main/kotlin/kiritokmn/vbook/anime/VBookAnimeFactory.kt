package kiritokmn.vbook.anime

import android.content.SharedPreferences
import androidx.preference.EditTextPreference
import androidx.preference.ListPreference
import androidx.preference.PreferenceScreen
import eu.kanade.tachiyomi.animesource.AnimeSource
import eu.kanade.tachiyomi.animesource.AnimeSourceFactory
import eu.kanade.tachiyomi.animesource.ConfigurableAnimeSource
import eu.kanade.tachiyomi.animesource.model.AnimeFilter
import eu.kanade.tachiyomi.animesource.model.AnimeFilterList
import eu.kanade.tachiyomi.animesource.model.AnimesPage
import eu.kanade.tachiyomi.animesource.model.SAnime
import eu.kanade.tachiyomi.animesource.model.SEpisode
import eu.kanade.tachiyomi.animesource.model.Track
import eu.kanade.tachiyomi.animesource.model.Video
import eu.kanade.tachiyomi.animesource.online.AnimeHttpSource
import kiritokmn.vbook.Http2Bridge
import kiritokmn.vbook.SourceDef
import kiritokmn.vbook.VBookRuntime
import kiritokmn.vbook.loadSourceDefs
import okhttp3.Headers
import okhttp3.Headers.Companion.toHeaders
import okhttp3.Request
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import rx.Observable

private object Assets {
    fun read(path: String): String =
        VBookAnimeFactory::class.java.classLoader!!.getResourceAsStream("assets/$path")!!.bufferedReader().use { it.readText() }
}

class VBookAnimeFactory : AnimeSourceFactory {
    override fun createSources(): List<AnimeSource> =
        loadSourceDefs(Assets.read("vb/sources.json")).filter { it.type == "video" }.map { VBookAnimeSource(it) }
}

open class AnimeSortFilter(name: String, values: Array<String>, val rawValues: Array<String>) :
    AnimeFilter.Sort(name, values)
open class AnimeSelectFilter(val id: String, name: String, values: Array<String>, val rawValues: Array<String>, state: Int = 0) :
    AnimeFilter.Select<String>(name, values, state)
open class AnimeTextFilter(val id: String, name: String) : AnimeFilter.Text(name)
open class AnimeGenreCheckBox(name: String, val value: String) : AnimeFilter.CheckBox(name, false)
open class AnimeGenreGroup(name: String, genres: List<AnimeGenreCheckBox>) : AnimeFilter.Group<AnimeGenreCheckBox>(name, genres)

class VBookAnimeSource(private val def: SourceDef) : AnimeHttpSource(), ConfigurableAnimeSource {
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

    private fun page(o: JSONObject): AnimesPage {
        val items = o.getJSONObject("result").getJSONArray("items")
        val list = (0 until items.length()).map { i ->
            val it = items.getJSONObject(i)
            SAnime.create().apply { url = it.getString("link"); title = it.getString("name"); thumbnail_url = it.optString("cover").ifBlank { null } }
        }
        return AnimesPage(list, o.getJSONObject("result").optBoolean("hasNext"))
    }

    override fun fetchPopularAnime(page: Int): Observable<AnimesPage> = Observable.fromCallable { page(rt.callObject("popular", page)) }
    override fun fetchLatestUpdates(page: Int): Observable<AnimesPage> = Observable.fromCallable { page(rt.callObject("latest", page)) }
    override fun fetchSearchAnime(page: Int, query: String, filters: AnimeFilterList): Observable<AnimesPage> =
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

    override fun getFilterList(): AnimeFilterList {
        val defs = loadFilterDefs()
        if (defs.isEmpty()) return AnimeFilterList(emptyList())
        val list = mutableListOf<AnimeFilter<*>>()
        for (d in defs) {
            val id = d.getString("id")
            val title = d.getString("title")
            val type = d.getString("type")
            when {
                id == "sort" || type == "sort" -> {
                    val opts = d.getJSONArray("options")
                    val labels = Array(opts.length()) { opts.getJSONObject(it).getString("label") }
                    val values = Array(opts.length()) { opts.getJSONObject(it).getString("value") }
                    list.add(AnimeSortFilter(title, labels, values))
                }
                type == "select" -> {
                    val opts = d.getJSONArray("options")
                    val labels = Array(opts.length()) { opts.getJSONObject(it).getString("label") }
                    val values = Array(opts.length()) { opts.getJSONObject(it).getString("value") }
                    list.add(AnimeSelectFilter(id, title, labels, values))
                }
                type == "text" -> {
                    list.add(AnimeTextFilter(id, title))
                }
                type == "multi-select" || id == "genres" -> {
                    val opts = d.getJSONArray("options")
                    val cbs = (0 until opts.length()).map {
                        val o = opts.getJSONObject(it)
                        AnimeGenreCheckBox(o.getString("label"), o.getString("value"))
                    }
                    list.add(AnimeGenreGroup(title, cbs))
                }
            }
        }
        return AnimeFilterList(list)
    }

    private fun serializeFilters(filters: AnimeFilterList): String {
        if (filters.isEmpty()) return ""
        val json = JSONObject()
        val genresArr = JSONArray()
        for (f in filters) {
            when (f) {
                is AnimeSortFilter -> {
                    f.state?.let { sel ->
                        json.put("sort", f.rawValues.getOrNull(sel.index) ?: "")
                        json.put("sortAscending", sel.ascending)
                    }
                }
                is AnimeSelectFilter -> {
                    val v = f.rawValues.getOrNull(f.state) ?: ""
                    json.put(f.id, v)
                }
                is AnimeTextFilter -> {
                    if (f.state.isNotBlank()) {
                        json.put(f.id, f.state.trim())
                    }
                }
                is AnimeGenreGroup -> {
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

    override fun fetchAnimeDetails(anime: SAnime): Observable<SAnime> = Observable.fromCallable {
        val d = rt.callObject("detail", anime.url).getJSONObject("result")
        SAnime.create().apply {
            url = anime.url
            title = d.optString("name").ifBlank { anime.title }
            thumbnail_url = d.optString("cover").ifBlank { anime.thumbnail_url }
            author = d.optString("author").ifBlank { null }
            description = listOf(d.optString("description"), d.optString("detail")).filter { it.isNotBlank() }.joinToString("\n\n")
            val g = d.optJSONArray("genres")
            genre = if (g == null) null else (0 until g.length()).joinToString(", ") { g.getString(it) }
            status = if (d.optBoolean("ongoing", true)) SAnime.ONGOING else SAnime.COMPLETED
            initialized = true
        }
    }

    override fun fetchEpisodeList(anime: SAnime): Observable<List<SEpisode>> = Observable.fromCallable {
        val arr = rt.callObject("chapters", anime.url).getJSONArray("result")
        (0 until arr.length()).map { i ->
            val c = arr.getJSONObject(i)
            SEpisode.create().apply { url = c.getString("url"); name = c.getString("name"); episode_number = (i + 1).toFloat() }
        }.reversed()
    }

    override fun fetchVideoList(episode: SEpisode): Observable<List<Video>> = Observable.fromCallable {
        val arr = rt.callObject("videos", episode.url).getJSONArray("result")
        (0 until arr.length()).map { i ->
            val v = arr.getJSONObject(i)
            val hj = v.optJSONObject("headers")
            val headers = if (hj == null) headers else hj.keys().asSequence().associateWith { hj.getString(it) }.toHeaders()
            val subs = v.optJSONArray("subtitles")
            val tracks = if (subs == null) emptyList() else (0 until subs.length()).map { s -> subs.getJSONObject(s).let { Track(it.getString("file"), it.optString("label", "Sub")) } }
            // 0.0.5: streams whose CDN refuses HTTP/1.1 (flag `http2`, e.g. NguonC) are played through the loopback
            // HTTP/2 bridge, because the mpv/ffmpeg player of Aniyomi cannot speak HTTP/2.
            val url = if (v.optBoolean("http2")) bridged(v.getString("url"), headers) else v.getString("url")
            val auds = v.optJSONArray("audios")
            val audioTracks = if (auds == null) emptyList() else (0 until auds.length()).map { a -> auds.getJSONObject(a).let { Track(it.getString("file"), it.optString("label", "Audio")) } }
            Video(url, v.optString("quality", "Default"), url, headers, tracks, audioTracks)
        }
    }

    private fun bridged(url: String, h: Headers): String = try {
        Http2Bridge.register(url, h.names().associateWith { h[it] ?: "" }) { u, hs ->
            val r = client.newCall(Request.Builder().url(u).headers(hs.toHeaders()).build()).execute()
            Http2Bridge.Upstream(r.code, r.headers.names().associateWith { r.header(it) ?: "" }, r.body?.byteStream()) { r.close() }
        }
    } catch (e: Exception) { url }

    override fun getAnimeUrl(anime: SAnime): String = anime.url
    override fun getEpisodeUrl(episode: SEpisode): String = episode.url

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

    // The request/parse pairs are unused: every fetch* above is overridden and delegates to the vBook runtime.
    override fun popularAnimeRequest(page: Int): Request = throw UnsupportedOperationException()
    override fun popularAnimeParse(response: Response): AnimesPage = throw UnsupportedOperationException()
    override fun latestUpdatesRequest(page: Int): Request = throw UnsupportedOperationException()
    override fun latestUpdatesParse(response: Response): AnimesPage = throw UnsupportedOperationException()
    override fun searchAnimeRequest(page: Int, query: String, filters: AnimeFilterList): Request = throw UnsupportedOperationException()
    override fun searchAnimeParse(response: Response): AnimesPage = throw UnsupportedOperationException()
    override fun animeDetailsParse(response: Response): SAnime = throw UnsupportedOperationException()
    override fun episodeListParse(response: Response): List<SEpisode> = throw UnsupportedOperationException()
}
