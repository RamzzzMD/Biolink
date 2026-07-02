// api/music.js
import { Spotify } from './spotify.js';
import { drawCardSpotify } from './spotifycard.js';
import { spotifyDownload } from './downloader.js';

const spotify = new Spotify();

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        
        if (!track) {
            return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });
        }

        // ==========================================
        // PERBAIKAN DI SINI: Rakit ulang URL yang benar
        // ==========================================
        const cleanUrl = `https://open.spotify.com/track/${track.id}`;
        console.log("URL Bersih yang akan didownload:", cleanUrl);

        // Gunakan cleanUrl, bukan track.url
        const dl = await spotifyDownload(cleanUrl); 

        if (!dl.Status) {
            return res.status(500).json({ success: false, message: "Gagal mendownload lagu" });
        }

        const cardBuffer = await drawCardSpotify({
            cover: track.album.images[0].url,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', ')
        });
        
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            audioUrl: dl.Result_url,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
