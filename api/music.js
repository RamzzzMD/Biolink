// api/music.js
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
        
        // Memanggil fungsi downr
        const dl = await downr(cleanUrl); 
        
        // Catatan: Biasanya downr mengembalikan { success: true, downloadUrl: "..." }
        // Sesuaikan dengan respon asli dari downr.org
        const audioUrl = dl.downloadUrl || dl.url || dl.link; 

        if (!audioUrl) {
            return res.status(500).json({ success: false, message: "Gagal mendapatkan link download" });
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
            audioUrl: audioUrl,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        console.error("Downr Error:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
