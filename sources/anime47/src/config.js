var BASE_URL = "https://anime47.best";
try {
  if (typeof DOMAIN_CUSTOM !== 'undefined' && DOMAIN_CUSTOM && DOMAIN_CUSTOM.trim()) {
    BASE_URL = String(DOMAIN_CUSTOM).trim().replace(/\/+$/, "");
  } else if (typeof DOMAIN !== 'undefined' && DOMAIN) {
    BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  }
} catch (e) {}
var API_URL = "https://animevui.com/api";

try {
  if (typeof DOMAIN !== 'undefined' && DOMAIN) BASE_URL = String(DOMAIN).replace(/\/+$/, "");
  if (typeof API_URL_CFG !== 'undefined' && API_URL_CFG) API_URL = String(API_URL_CFG).replace(/\/+$/, "");
} catch (e) {}

function requestApiJson(endpoint, opt) {
  opt = opt || {};
  var url = (/^https?:\/\//i.test(endpoint)) ? endpoint : (API_URL + endpoint);
  var res = fetch(url, {
    method: opt.method || 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': BASE_URL + '/'
    }
  });

  if (!res) {
    throw new Error('Không nhận được phản hồi từ máy chủ Anime47.');
  }

  var text = res.text() || '';
  if (/<!DOCTYPE|<html|<head|<body/i.test(text)) {
    throw new Error('Máy chủ Anime47 trả về HTML (' + res.status + ') thay vì dữ liệu JSON. Vui lòng kiểm tra lại URL API trong Cài đặt hoặc mở WebView để đăng nhập.');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error('Lỗi phân tích JSON từ Anime47: ' + e.message);
  }
}
