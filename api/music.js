import { Spotify } from './spotify.js';
import SpotMate from './spotmate.js';

const spotify = new Spotify();
const spotmate = new SpotMate();

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        // 1. Cari lagunya dulu buat dapet URL Spotify ori-nya
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        
        if (!track) {
            return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });
        }

        const cleanUrl = `https://open.spotify.com/track/${track.id}`;
        
        // 2. Lempar URL tersebut ke SpotMate
        const dl = await spotmate.dl(cleanUrl); 

        // 3. Pastikan scrape berhasil dan link audionya ada
        if (!dl.success || !dl.result?.download?.url) {
            return res.status(500).json({ success: false, message: "Gagal mendapatkan link download full" });
        }
        
        // 4. Kirim datanya ke UI kamu!
        res.status(200).json({
            success: true,
            title: dl.result.metadata.title || track.name,
            artist: (dl.result.metadata.artists && dl.result.metadata.artists.join(', ')) || track.artists.map(a => a.name).join(', '),
            audioUrl: dl.result.download.url,
            coverImage: dl.result.metadata.cover || track.album.images[0].url
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
