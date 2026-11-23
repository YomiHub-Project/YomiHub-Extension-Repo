import groovy.json.JsonSlurper
import java.util.Properties

// 0.0.9: one product flavor = one novel source = one extension APK (NovelSource ABI for Nekoyomi).
// flavors.json and gen/<flavor>/{assets,res} are written by tools/build/build-all.mjs.
// The Kotlin runtime is compiled once in :novel-core.
plugins { id("com.android.application") }

val keyProps = Properties().apply { rootProject.file("keystore.properties").takeIf { it.exists() }?.inputStream()?.use { load(it) } }
@Suppress("UNCHECKED_CAST")
val flavorDefs: List<Map<String, Any?>> = file("flavors.json").takeIf { it.exists() }?.let { JsonSlurper().parse(it, "UTF-8") as List<Map<String, Any?>> } ?: emptyList()
if (flavorDefs.isEmpty()) logger.warn(":novel has no flavors.json - run node tools/build/build-all.mjs first (no APK will be built)")

android {
    namespace = "eu.kanade.tachiyomi.novelextension.kiritokmn"
    compileSdk = (project.findProperty("compileSdkOverride") as String?)?.toInt() ?: 35
    buildToolsVersion = (project.findProperty("buildToolsOverride") as String?) ?: "36.0.0"
    defaultConfig {
        applicationId = "eu.kanade.tachiyomi.novelextension.kiritokmn"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.4.1"
        manifestPlaceholders += mapOf("appName" to "Kiritokmn", "nsfw" to "0")
    }
    if (flavorDefs.isNotEmpty()) {
        flavorDimensions += "source"
        productFlavors {
            flavorDefs.forEach { f ->
                val fname = f["flavor"] as String
                create(fname) {
                    dimension = "source"
                    applicationId = f["pkg"] as String
                    versionCode = (f["versionCode"] as Number).toInt()
                    versionName = f["versionName"] as String
                    manifestPlaceholders += mapOf("appName" to (f["label"] as String), "nsfw" to (f["nsfw"] as Number).toInt().toString())
                }
                sourceSets[fname].assets.srcDirs("gen/$fname/assets")
                sourceSets[fname].res.srcDirs("gen/$fname/res")
            }
        }
    }
    // the Kotlin sources under src/main/kotlin belong to :novel-core
    sourceSets["main"].java.setSrcDirs(emptyList<String>())
    sourceSets["main"].kotlin.setSrcDirs(emptyList<String>())
    signingConfigs {
        create("release") {
            if (keyProps.isNotEmpty()) {
                storeFile = rootProject.file(keyProps.getProperty("storeFile"))
                storePassword = keyProps.getProperty("storePassword")
                keyAlias = keyProps.getProperty("keyAlias")
                keyPassword = keyProps.getProperty("keyPassword")
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            isShrinkResources = false
            proguardFiles("../proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_1_8; targetCompatibility = JavaVersion.VERSION_1_8 }
    lint { checkReleaseBuilds = false; abortOnError = false }

    dependenciesInfo { includeInApk = false; includeInBundle = false }
    packaging { resources.excludes += setOf("META-INF/**", "kotlin/**") }
}

// only release APKs are shipped: skipping the debug variants halves configuration and build time
androidComponents { beforeVariants(selector().withBuildType("debug")) { it.enable = false } }

dependencies {
    implementation(project(":novel-core"))
}
