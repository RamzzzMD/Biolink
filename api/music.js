process.removeAllListeners('warning');

import { Spotify } from './spotify.js';
import { drawCardSpotify } from './spotifycard.js';
import { downr } from './downloader.js';

const spotify = new Spotify();

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        if (!track) return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });

        const cleanUrl = `https://open.spotify.com/track/${track.id}`;
        const dl = await downr(cleanUrl); 
        const audioUrl = dl.downloadUrl || dl.url || dl.link; 

        if (!audioUrl) return res.status(500).json({ success: false, message: "Gagal mendapatkan link download" });

        // PROSES CARD DIBUAT AMAN (Tidak mematikan API jika error)
        let cardImage = null;
        try {
            const cardBuffer = await drawCardSpotify({
                cover: track.album.images[0].url,
                title: track.name,
                artist: track.artists.map(a => a.name).join(', ')
            });
            cardImage = `data:image/png;base64,${cardBuffer.toString('base64')}`;
        } catch (e) {
            console.error("Gagal buat card, lanjut kirim lagu saja:", e.message);
        }
        
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            audioUrl: audioUrl,
            cardImage: cardImage // Bisa null jika gagal
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
