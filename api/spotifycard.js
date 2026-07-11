delete process.env.FONTCONFIG_PATH;
delete process.env.FONTCONFIG_FILE;

import sharp from 'sharp';
import axios from 'axios';

export default async function handler(req, res) {
  const query = req.query.q || req.query.url || req.query.link || req.query.search;

  if (!query) {
    return res.status(400).json({ status: false, message: "Parameter diperlukan." });
  }

  try {
    const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const nexray = await response.json();

    if (!nexray.status || !nexray.result) throw new Error("Gagal memuat kartu Spotify.");

    const resData = nexray.result;

    return res.status(200).json({
      status: true,
      type: "spotify_card",
      // Mapping lengkap untuk kebutuhan UI Card
      title: resData.title,
      name: resData.title,
      artist: resData.artist,
      artists: resData.artist,
      album: resData.album,
      duration: resData.duration,
      // Semua variabel gambar disamakan ke thumbnail Nexray
      thumbnail: resData.thumbnail,
      cover: resData.thumbnail,
      image: resData.thumbnail,
      cover_image: resData.thumbnail,
      // Semua variabel link audio
      audio: resData.download_url,
      audio_url: resData.download_url,
      download: resData.download_url,
      url: resData.url,
      spotify_url: resData.url
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
}
