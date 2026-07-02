// api/downloader.js
import axios from "axios";
import * as cheerio from "cheerio";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const BASE = "https://spowload.cc";
const jar = new CookieJar();
const api = wrapper(axios.create({
  jar,
  withCredentials: true,
  validateStatus: () => true,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
  }
}));

async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function pollTask(taskId) {
  for (let i = 0; i < 15; i++) {
    const res = await api.get(`${BASE}/tasks/${encodeURIComponent(taskId)}`, {
      headers: { Accept: "application/json", Referer: `${BASE}/en2` }
    });
    const data = res.data?.data;
    const result = data?.result?.download_url || data?.download_url || data?.url;
    if (result) return result;
    if (data?.status === "failed") throw new Error("Conversion failed");
    await sleep(2000);
  }
  throw new Error("Task timeout");
}

export async function spowload(url) {
  const home = await api.get(`${BASE}/en2`, { headers: { Accept: "text/html" } });
  const token = cheerio.load(home.data)('meta[name="csrf-token"]').attr("content");
  
  if (!token) throw new Error("CSRF token tidak ditemukan (mungkin kena proteksi).");

  const form = new URLSearchParams({ _token: token, trackUrl: url });
  const analyzed = await api.post(`${BASE}/analyze`, form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const match = analyzed.data.match(/let\s+urldata\s*=\s*"((?:\\.|[^"\\])*)"/);
  if (!match) throw new Error("Data track tidak ditemukan.");
  
  const trackData = JSON.parse(JSON.parse(`"${match[1]}"`));
  const converted = await api.post(`${BASE}/convert`, 
    { urls: trackData.external_urls?.spotify || url, cover: trackData.album?.images?.[0]?.url },
    { headers: { "X-CSRF-TOKEN": token } }
  );

  const download = converted.data.url || (await pollTask(converted.data.task_id || converted.data.taskId));
  if (!download) throw new Error("Gagal mendapatkan link download.");

  return {
    Status: true,
    Result_url: download,
    Metadata: {
      Title: trackData.name,
      Artist: trackData.artists?.map(v => v.name).join(", "),
      Cover: trackData.album?.images?.[0]?.url
    }
  };
}
