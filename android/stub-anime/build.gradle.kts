plugins { id("com.android.library"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "eu.kanade.tachiyomi.stub.anime"
    compileSdk = (project.findProperty("compileSdkOverride") as String?)?.toInt() ?: 35
    buildToolsVersion = (project.findProperty("buildToolsOverride") as String?) ?: "36.0.0"
    defaultConfig { minSdk = 21 }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_1_8; targetCompatibility = JavaVersion.VERSION_1_8 }
    
}
dependencies {
    compileOnly("com.squareup.okhttp3:okhttp:4.12.0")
    compileOnly("org.jsoup:jsoup:1.21.2")
    compileOnly("io.reactivex:rxjava:1.3.8")
    compileOnly("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    compileOnly("androidx.preference:preference-ktx:1.2.1")
    compileOnly("org.jetbrains.kotlin:kotlin-stdlib:2.2.20")
}

kotlin { compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_1_8) } }
