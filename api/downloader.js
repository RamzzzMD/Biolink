// api/downloader.js
import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://spowload.cc";

export async function spowload(url) {
  // 1. Ambil halaman home untuk dapat CSRF
  const home = await axios.get(`${BASE}/en2`, { 
    headers: { "User-Agent": "Mozilla/5.0" } 
  });
  const token = cheerio.load(home.data)('meta[name="csrf-token"]').attr("content");
  if (!token) throw new Error("Gagal mendapatkan CSRF Token.");

  // 2. Analyze URL
  const form = new URLSearchParams({ _token: token, trackUrl: url });
  const analyzed = await axios.post(`${BASE}/analyze`, form.toString(), {
    headers: { 
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": home.headers['set-cookie']?.join('; ') || ''
    }
  });

  const match = analyzed.data.match(/let\s+urldata\s*=\s*"((?:\\.|[^"\\])*)"/);
  if (!match) throw new Error("Data track tidak ditemukan.");
  
  const trackData = JSON.parse(JSON.parse(`"${match[1]}"`));

  // 3. Convert
  const converted = await axios.post(`${BASE}/convert`, 
    { urls: trackData.external_urls?.spotify || url, cover: trackData.album?.images?.[0]?.url },
    { headers: { "X-CSRF-TOKEN": token, "Cookie": home.headers['set-cookie']?.join('; ') || '' } }
  );

  const taskId = converted.data.task_id || converted.data.taskId;
  if (!taskId) throw new Error("Gagal memulai task download.");

  // 4. Poll Task (Manual loop dengan axios murni)
  for (let i = 0; i < 15; i++) {
    const res = await axios.get(`${BASE}/tasks/${taskId}`);
    const result = res.data?.data?.result?.download_url || res.data?.data?.download_url;
    if (result) {
        return {
            Status: true,
            Result_url: result,
            Metadata: { Title: trackData.name, Artist: trackData.artists?.[0]?.name, Cover: trackData.album?.images?.[0]?.url }
        };
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Download timeout.");
}
