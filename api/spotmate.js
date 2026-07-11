export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter diperlukan." });
  }

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) {
      return res.status(404).json({ status: false, message: "Data tidak ditemukan." });
    }

    const resData = nexray.result;

    return res.status(200).json({
      status: true,
      result: {
        ...resData,
        cover: resData.thumbnail,
        image: resData.thumbnail,
        download: resData.download_url,
        mp3: resData.download_url,
        link: resData.url
      },
      data: resData
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
