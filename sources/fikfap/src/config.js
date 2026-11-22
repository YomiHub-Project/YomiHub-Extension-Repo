var BASE_URL = "https://fikfap.com";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var API_BASE = "https://api.fikfap.com";

try {
  var dCfg = (typeof DOMAIN !== "undefined" && DOMAIN) ? String(DOMAIN).trim() : "";
  if (dCfg && /^https?:\/\//i.test(dCfg)) BASE_URL = dCfg.replace(/\/+$/, "");
  var aCfg = "";
  if (typeof API_URL !== "undefined" && API_URL) aCfg = String(API_URL).trim();
  else if (typeof localConfig !== "undefined" && localConfig && localConfig.getItem) aCfg = String(localConfig.getItem("API_URL") || "").trim();
  if (aCfg && /^https?:\/\//i.test(aCfg)) API_BASE = aCfg.replace(/\/+$/, "");
} catch (e) {}

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
var ANON_UUID = "b433e210-9092-494b-972d-8b06c88863aa";

var API_HEADERS = {
  "User-Agent": UA,
  "Origin": BASE_URL,
  "Referer": BASE_URL + "/",
  "Authorization-Anonymous": ANON_UUID,
  "isLoggedIn": "false",
  "isPWA": "false"
};

var WEB_HEADERS = {
  "User-Agent": UA,
  "Referer": BASE_URL + "/"
};

function ffPickCover(item) {
  if (!item) return "";
  return item.thumbnailStreamUrl || item.thumbnailUrl || (item.preview ? item.preview.url : "") || (item.author ? (item.author.thumbnailUrl || item.author.thumbnailLargeUrl || "") : "") || "";
}

function ffPickName(item, id) {
  var raw = (item && (item.label || item.description)) || ("FikFap #" + id);
  var clean = String(raw).replace(/#[a-zA-Z0-9_]+/g, "").replace(/\s+/g, " ").trim();
  return clean || ("FikFap #" + id);
}

function ffPickGenres(d) {
  var out = [];
  if (d && Array.isArray(d.hashtags)) {
    for (var i = 0; i < d.hashtags.length; i++) {
      var h = d.hashtags[i];
      var lbl = typeof h === "string" ? h : (h && (h.label || h.labelLower || h.name)) || "";
      lbl = String(lbl).replace(/^#/, "").trim();
      if (lbl) out.push({ title: "#" + lbl, input: lbl, script: "search.js" });
    }
  }
  return out;
}
