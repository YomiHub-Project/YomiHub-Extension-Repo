# Keep the factories/sources the host app instantiates by reflection
-keep class kiritokmn.vbook.** { *; }
# Rhino uses reflection for the Java bridge (__host methods)
# 0.1.0 size: Rhino runs interpreted (optimizationLevel = -1) -> the bytecode compiler (optimizer.**) and the
# shell/debugger (tools.**) are never used; Rhino looks Codegen up with Kit.classOrNull and falls back to the interpreter.
-keep class !org.mozilla.javascript.optimizer.**,!org.mozilla.javascript.tools.**,org.mozilla.javascript.** { *; }
-dontobfuscate
-dontoptimize
-dontwarn kotlin.**
-dontwarn kotlinx.**
-dontwarn org.jetbrains.annotations.**
-dontwarn javax.annotation.**
-dontwarn org.mozilla.javascript.**
-dontwarn javax.lang.model.**
-dontwarn java.beans.**
-dontwarn jdk.dynalink.**
# Host app classes are provided at runtime
-dontwarn eu.kanade.tachiyomi.**
-dontwarn okhttp3.**
-dontwarn org.jsoup.**
-dontwarn rx.**
-dontwarn uy.kohesive.**
-dontwarn androidx.**
-dontwarn kotlin.**
-dontobfuscate
