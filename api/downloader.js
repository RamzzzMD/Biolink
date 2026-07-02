// api/downloader.js
import axios from "axios";
import * as cheerio from "cheerio";

const BASE = "https://spowload.cc";

export async function spowload(url) {
  // 1. Ambil halaman home dan simpan cookie
  const home = await axios.get(`${BASE}/en2`, { headers: { "User-Agent": "Mozilla/5.0" } });
  const cookies = home.headers['set-cookie']?.join('; ') || '';
  const token = cheerio.load(home.data)('meta[name="csrf-token"]').attr("content");
  
  if (!token) throw new Error("Gagal mendapatkan CSRF Token.");

  // 2. Analyze URL dengan mengirim cookie yang sama
  const form = new URLSearchParams({ _token: token, trackUrl: url });
  const analyzed = await axios.post(`${BASE}/analyze`, form.toString(), {
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cookie": cookies }
  });

  const match = analyzed.data.match(/let\s+urldata\s*=\s*"((?:\\.|[^"\\])*)"/);
  if (!match) throw new Error("Data track tidak ditemukan.");
  
  const trackData = JSON.parse(JSON.parse(`"${match[1]}"`));

  // 3. Convert dengan header CSRF dan Cookie yang persisten
  // Penting: Kita ambil token baru dari hasil analyze jika ada (seringkali token berubah)
  const newCsrf = cheerio.load(analyzed.data)('meta[name="csrf-token"]').attr("content") || token;

  const converted = await axios.post(`${BASE}/convert`, 
    { urls: trackData.external_urls?.spotify || url, cover: trackData.album?.images?.[0]?.url },
    { headers: { "X-CSRF-TOKEN": newCsrf, "Cookie": cookies } }
  );

  // Cek apakah server memberikan task_id
  const taskId = converted.data.task_id || converted.data.taskId;
  if (!taskId) {
      console.log("Respon convert:", JSON.stringify(converted.data));
      throw new Error("Gagal memulai task download.");
  }

  // 4. Poll Task dengan Cookie yang sama
  for (let i = 0; i < 15; i++) {
    const res = await axios.get(`${BASE}/tasks/${taskId}`, { headers: { "Cookie": cookies } });
    const result = res.data?.data?.result?.download_url || res.data?.data?.download_url;
    if (result) {
        return {
            Status: true,
            Result_url: result,
            Metadata: { Title: trackData.name, Artist: trackData.artists?.[0]?.name, Cover: trackData.album?.images?.[0]?.url }
        };
    }
    if (res.data?.data?.status === "failed") throw new Error("Conversion failed");
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Download timeout.");
}
