import { Spotify } from './spotify.js';
import { downr } from './downloader.js';

const spotify = new Spotify();

// Matikan warning yang ganggu log
process.removeAllListeners('warning');

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
        
        // Kita langsung kirim data mentahannya aja!
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            const audioUrl = dl.downloadUrl || dl.url || dl.link;
            coverImage: track.album.images[0].url // Ngirim link cover Spotify asli
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
