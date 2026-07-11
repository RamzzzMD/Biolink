import axios from 'axios';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Menangkap parameter dari frontend lama maupun baru
  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter 'q' atau 'url' diperlukan." });
  }

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) {
      throw new Error("Lagu tidak ditemukan dari provider.");
    }

    const resData = nexray.result;

    // Standarisasi output agar frontend lama tidak perlu diubah
    const formattedData = {
      title: resData.title,
      artist: resData.artist,
      duration: resData.duration,
      album: resData.album,
      release_at: resData.release_at,
      popularity: resData.popularity,
      // Mapping untuk gambar
      thumbnail: resData.thumbnail,
      cover: resData.thumbnail,
      image: resData.thumbnail,
      // Mapping untuk URL Spotify asli
      url: resData.url,
      link: resData.url,
      // Mapping PENTING untuk link audio/download agar pemutar musik di UI berfungsi
      download_url: resData.download_url,
      download: resData.download_url,
      audio: resData.download_url,
      mp3: resData.download_url
    };

    return res.status(200).json({
      status: true,
      author: "@nexray - ElrayyXml (Remapped)",
      data: formattedData,
      result: formattedData // Di-double agar kompatibel jika frontend memakai .result atau .data
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Terjadi kesalahan server." });
  }
}
