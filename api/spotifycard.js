// File: api/spotifycard.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.query.q || req.query.url || req.query.link || req.query.search;
  if (!query) return res.status(400).json({ status: false, message: "Parameter diperlukan." });

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) {
      return res.status(404).json({ status: false, message: "Kartu tidak dapat dimuat." });
    }

    const resData = nexray.result;

    // Pemetaan khusus Card UI
    return res.status(200).json({
      status: true,
      type: "spotify_card",
      title: resData.title || "",
      name: resData.title || "",
      artist: resData.artist || "",
      artists: resData.artist || "",
      album: resData.album || "",
      duration: resData.duration || "",
      thumbnail: resData.thumbnail || "",
      cover: resData.thumbnail || "",
      image: resData.thumbnail || "",
      cover_image: resData.thumbnail || "",
      audio: resData.download_url || "",
      audio_url: resData.download_url || "",
      download: resData.download_url || "",
      url: resData.url || "",
      spotify_url: resData.url || ""
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
