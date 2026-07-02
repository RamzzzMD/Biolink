// api/downloader.js
// Fungsi-fungsi pembantu dari script kamu
const BASE_URL = "https://spotisaver.net";
const LANG = "en";
const ua = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36";

let cookieStore = {
  "_s-uid": `v_${Math.random().toString(16).slice(2, 16)}.${Math.floor(Math.random() * 100000000)}`,
  lang: LANG
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function cleanInput(input) {
  return String(input || "").trim().replace(/%0A/gi, "").replace(/%0D/gi, "").replace(/\r|\n/g, "");
}

function randomIp() {
  return [Math.floor(Math.random() * 223) + 1, Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)].join(".");
}

function cookieHeader() {
  return Object.entries(cookieStore).filter(([, v]) => v !== undefined && v !== null && String(v).length).map(([k, v]) => `${k}=${v}`).join("; ");
}

function saveCookies(headers) {
  const raw = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : (headers.get("set-cookie") || "").split(/,(?=\s*[^;,=\s]+=[^;,]+)/g);
  for (const item of raw) {
    const part = item.split(";")[0];
    const i = part.indexOf("=");
    if (i > -1) cookieStore[part.slice(0, i)] = part.slice(i + 1);
  }
}

function jsonBase64(data) { return Buffer.from(JSON.stringify(data)).toString("base64"); }

function parseSpotify(input) {
  const cleaned = cleanInput(input);
  const url = new URL(cleaned);
  const parts = url.pathname.split("/").filter(Boolean);
  return { raw: cleaned, type: parts[0] || "track", id: parts[1] || cleaned };
}

function parseMaybeJson(buffer, contentType) {
  const text = buffer.toString("utf8");
  let json = null;
  if (contentType.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try { json = JSON.parse(text); } catch {}
  }
  return { text, json };
}

async function warmup(parsed) {
  const urls = [`${BASE_URL}/en1`, `${BASE_URL}/en/${parsed.type}/${parsed.id}/`];
  for (const url of urls) {
    const res = await fetch(url, { headers: { "user-agent": ua, "cookie": cookieHeader() } }).catch(() => null);
    if (res) { saveCookies(res.headers); await res.arrayBuffer().catch(() => null); }
  }
}

async function requestJson(url, extraHeaders = {}, referer = `${BASE_URL}/en1`) {
  const res = await fetch(url, {
    headers: { "user-agent": ua, "accept": "application/json", "referer": referer, "cookie": cookieHeader(), ...extraHeaders }
  });
  saveCookies(res.headers);
  const data = await res.json().catch(() => null);
  return { code: res.status, ok: res.ok, data };
}

async function requestDownload(url, body, referer) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "user-agent": ua, "content-type": "application/json", "referer": referer, "cookie": cookieHeader() },
    body: JSON.stringify(body)
  });
  saveCookies(res.headers);
  const buffer = Buffer.from(await res.arrayBuffer());
  return { ok: res.ok, buffer, contentType: res.headers.get("content-type") || "" };
}

async function getSignature(action, ctxPayload, referer) {
  const ctx = jsonBase64(ctxPayload);
  const url = `${BASE_URL}/api/get_signature.php?action=${encodeURIComponent(action)}&ctx=${encodeURIComponent(ctx)}`;
  return await requestJson(url, {}, referer);
}

// FUNGSI UTAMA YANG AKAN DIPANGGIL OLEH api/music.js
export async function getTrack(inputUrl) {
  const parsed = parseSpotify(inputUrl);
  const referer = `${BASE_URL}/en/${parsed.type}/${parsed.id}/`;
  await warmup(parsed);

  const sig = await getSignature("get_playlist", { id: parsed.id, type: parsed.type, lang: LANG }, referer);
  const playlist = await requestJson(`${BASE_URL}/api/get_playlist.php?id=${encodeURIComponent(parsed.id)}&type=${encodeURIComponent(parsed.type)}&lang=${encodeURIComponent(LANG)}`, { "x-pe": String(sig.data.exp), "x-pt": String(sig.data.token) }, referer);

  const track = playlist.data.tracks[0];
  const dlSig = await getSignature("download_track", { lang: LANG, id: String(track.id), name: String(track.name), duration_ms: String(track.duration_ms) }, `${BASE_URL}/en/track/${track.id}/`);
  
  const dlUrl = `${BASE_URL}/api/download_track.php?sig=${encodeURIComponent(jsonBase64({ token: String(dlSig.data.token), exp: String(dlSig.data.exp) }))}`;
  
  const dl = await requestDownload(dlUrl, { track, user_ip: randomIp(), is_premium: false, lang: LANG }, `${BASE_URL}/en/track/${track.id}/`);

  if (!dl.ok || !dl.contentType.includes("audio")) throw new Error("Gagal download");

  return { buffer: dl.buffer, title: track.name };
}

export { SpotifyDl };
