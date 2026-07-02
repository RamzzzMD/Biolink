// api/music.js
import { Spotify } from './spotify.js';
import { drawCardSpotify } from './spotifycard.js';
import { spotifyDownload } from './downloader.js'; // Pastikan sesuai nama export di downloader.js

const spotify = new Spotify();

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        // 1. Cari Lagu
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        
        if (!track) {
            return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });
        }

        // 2. Download menggunakan downloader.js (Fungsi spotifyDownload)
        const dl = await spotifyDownload(track.url); 

        if (!dl.Status) {
            return res.status(500).json({ success: false, message: "Gagal mendownload lagu" });
        }

        // 3. Generate Card Image
        const cardBuffer = await drawCardSpotify({
            cover: track.album.images[0].url,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', ')
        });
        
        // 4. Kirim respons
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            // Kirim link URL langsung (jauh lebih ringan & aman daripada base64)
            audioUrl: dl.Result_url,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
