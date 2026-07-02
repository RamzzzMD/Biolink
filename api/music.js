import { Spotify } from './spotify.js';
import { downloadTrack } from './spotyloader.js';

const spotify = new Spotify();

process.removeAllListeners('warning');

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        
        if (!track) {
            return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });
        }

        const cleanUrl = `https://open.spotify.com/track/${track.id}`;
        
        // Panggil downloader baru
        const dl = await downloadTrack(cleanUrl); 

        if (!dl.success || !dl.download_url) {
            return res.status(500).json({ success: false, message: "Gagal mendapatkan link download: " + (dl.error || "Unknown") });
        }
        
        res.status(200).json({
            success: true,
            title: dl.metadata?.title || track.name,
            artist: dl.metadata?.artist || track.artists.map(a => a.name).join(', '),
            audioUrl: dl.download_url,
            coverImage: dl.metadata?.image || track.album.images[0].url
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
