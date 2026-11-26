var BASE_URL = "https://mangadex.org";
var API_URL = "https://api.mangadex.org";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}

var MD_HEADERS = {
  "User-Agent": "YomiHub/0.1.0 (https://github.com/YomiHub-Project/YomiHub-Extension-Repo)",
  "Accept": "application/json"
};

function mdFetch(path) {
  var u = path.indexOf("http") === 0 ? path : (API_URL + path);
  var r = fetch(u, { headers: MD_HEADERS });
  if (!r || !r.ok) throw new Error("HTTP " + (r ? r.status : 0) + " " + u);
  return r.json();
}

function mdTitle(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (obj.vi) return obj.vi;
  if (obj.en) return obj.en;
  if (obj["ja-ro"]) return obj["ja-ro"];
  if (obj["ko-ro"]) return obj["ko-ro"];
  for (var k in obj) if (obj[k]) return obj[k];
  return "";
}

function mdCover(m) {
  var rels = m && m.relationships ? m.relationships : [];
  for (var i = 0; i < rels.length; i++) {
    if (rels[i].type === "cover_art" && rels[i].attributes && rels[i].attributes.fileName) {
      return "https://uploads.mangadex.org/covers/" + m.id + "/" + rels[i].attributes.fileName + ".256.jpg";
    }
  }
  return "";
}

function mdAuthor(m) {
  var rels = m && m.relationships ? m.relationships : [];
  var out = [];
  for (var i = 0; i < rels.length; i++) {
    if ((rels[i].type === "author" || rels[i].type === "artist") && rels[i].attributes && rels[i].attributes.name) {
      if (out.indexOf(rels[i].attributes.name) < 0) out.push(rels[i].attributes.name);
    }
  }
  return out.join(", ");
}

function mdToItem(m) {
  var attr = m.attributes || {};
  var name = mdTitle(attr.title);
  if (!name && Array.isArray(attr.altTitles)) {
    for (var i = 0; i < attr.altTitles.length && !name; i++) name = mdTitle(attr.altTitles[i]);
  }
  var descParts = [];
  if (attr.originalLanguage) descParts.push(attr.originalLanguage.toUpperCase());
  if (attr.year) descParts.push(String(attr.year));
  if (attr.status) descParts.push(attr.status);
  if (attr.contentRating && attr.contentRating !== "safe") descParts.push(attr.contentRating);
  return {
    name: name || m.id,
    link: BASE_URL + "/title/" + m.id,
    cover: mdCover(m),
    description: descParts.join(" · "),
    host: BASE_URL
  };
}

function mdIdFromUrl(u) {
  var m = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i.exec(String(u || ""));
  return m ? m[1] : "";
}
