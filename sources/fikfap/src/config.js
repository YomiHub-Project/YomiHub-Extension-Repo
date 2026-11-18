var BASE_URL = "https://fikfap.com";
try { if (DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, ""); } catch (e) {}
var API_URL = "https://api.fikfap.com";

var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var ANON_UUID = "b433e210-9092-494b-972d-8b06c88863aa";

var API_HEADERS = {
  "User-Agent": UA,
  "Origin": "https://fikfap.com",
  "Referer": "https://fikfap.com/",
  "Authorization-Anonymous": ANON_UUID,
  "isLoggedIn": "false",
  "isPWA": "false"
};

var WEB_HEADERS = {
  "User-Agent": UA,
  "Referer": "https://fikfap.com/"
};
