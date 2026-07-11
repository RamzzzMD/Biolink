// File: api/spotify.js (dan juga untuk api/music.js)

export default async function handler(req, res) {
  // 1. Set CORS agar frontend di localhost atau domain lain bisa memutar audio
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 2. Tangkap parameter dari frontend (mendukung query 'q', 'url', 'link', atau 'search')
  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ 
      status: false, 
      message: "Parameter 'q' atau 'url' diperlukan." 
    });
  }

  try {
    // 3. Panggil API Nexray dengan menambahkan User-Agent agar tidak diblokir
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    const nexray = await response.json();

    // 4. Validasi respons dari Nexray
    if (!nexray.status || !nexray.result) {
      return res.status(404).json({ 
        status: false, 
        message: "Lagu atau musik tidak ditemukan." 
      });
    }

    const resData = nexray.result;

    // 5. Standarisasi format keluaran agar Frontend lama langsung bisa membacanya
    const formattedData = {
      title: resData.title || "",
      artist: resData.artist || "",
      duration: resData.duration || "",
      album: resData.album || "",
      release_at: resData.release_at || "",
      popularity: resData.popularity || 0,
      
      // Pemetaan gambar cover
      thumbnail: resData.thumbnail || "",
      cover: resData.thumbnail || "",
      image: resData.thumbnail || "",
      
      // Pemetaan link lagu asal
      url: resData.url || "",
      link: resData.url || "",
      
      // Pemetaan link MP3 agar bisa langsung diputar di frontend
      download_url: resData.download_url || "",
      download: resData.download_url || "",
      audio: resData.download_url || "",
      mp3: resData.download_url || ""
    };

    return res.status(200).json({
      status: true,
      author: "Ranzz",
      data: formattedData,
      result: formattedData
    });

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      status: false, 
      message: "Terjadi kesalahan pada server saat memuat audio.",
      error: error.message 
    });
  }
}
