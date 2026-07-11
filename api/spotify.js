export default async function handler(req, res) {
  // Tambahkan CORS agar audio/data bisa dibaca browser tanpa diblokir
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter diperlukan." });
  }

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) {
      return res.status(404).json({ status: false, message: "Lagu tidak ditemukan." });
    }

    const resData = nexray.result;
    const formattedData = {
      title: resData.title || "",
      artist: resData.artist || "",
      duration: resData.duration || "",
      album: resData.album || "",
      release_at: resData.release_at || "",
      popularity: resData.popularity || 0,
      thumbnail: resData.thumbnail || "",
      cover: resData.thumbnail || "",
      image: resData.thumbnail || "",
      url: resData.url || "",
      link: resData.url || "",
      download_url: resData.download_url || "",
      download: resData.download_url || "",
      audio: resData.download_url || "",
      mp3: resData.download_url || ""
    };

    return res.status(200).json({
      status: true,
      data: formattedData,
      result: formattedData
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
