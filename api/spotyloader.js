import axios from "axios";

export default async function handler(req, res) {
  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter diperlukan." });
  }

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) throw new Error("Gagal mengambil data audio.");

    const resData = nexray.result;

    return res.status(200).json({
      status: true,
      title: resData.title,
      artist: resData.artist,
      // Prioritaskan link download langsung untuk loader
      download_url: resData.download_url,
      download: resData.download_url,
      url: resData.download_url,
      mp3: resData.download_url,
      link: resData.url,
      thumbnail: resData.thumbnail,
      cover: resData.thumbnail,
      duration: resData.duration,
      data: resData
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
  } catch (error) {
    return { error: error.response ? error.response.data : error.message, url: trackUrl };
  }
}
