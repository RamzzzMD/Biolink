// api/downloader.js
import axios from "axios";

export async function spotifyDownload(url) {
  try {
    const response = await axios.post(
      "https://musicfab.io/api/spotify",
      { url },
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36",
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "Origin": "https://musicfab.io",
          "Referer": "https://musicfab.io/",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
        },
        validateStatus: () => true
      }
    );

    const metadata = response.data?.data?.metadata || null;

    if (!metadata?.download) {
      // Tambahkan baris ini biar kita tahu apa pesan error dari servernya
      console.log("Respon asli MusicFab:", JSON.stringify(response.data)); 
      throw new Error("Gagal mendapatkan link download dari server.");
    }

    return {
      Status: true,
      Result_url: metadata.download, // Ini link MP3 langsung
      Metadata: {
        Name: metadata.name,
        Artist: metadata.artist,
        Image: metadata.image
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
