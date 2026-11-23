package eu.kanade.tachiyomi.source

import eu.kanade.tachiyomi.source.model.Page

/**
 * Marker interface for manga [Source]s that provide **novel (text)** content.
 * Matches Seguaz/Nekoyomi ABI (`tachiyomi.novelextension`).
 */
interface NovelSource {

    val isNovelSource: Boolean
        get() = true

    suspend fun fetchPageText(page: Page): String
}
