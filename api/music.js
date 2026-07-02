import { Spotify } from './spotify.js';
import { drawCardSpotify } from './spotifycard.js';
import { getTrack } from './downloader.js'; // Menggunakan scraper full-song

const spotify = new Spotify();

export default async function handler(req, res) {
    // Menangkap query pencarian atau menggunakan default
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    
    try {
        // 1. Cari Lagu
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        
        if (!track) {
            return res.status(404).json({ success: false, message: "Lagu tidak ditemukan" });
        }

        // 2. Download Full Track menggunakan downloader.js
        // getTrack mengembalikan objek { buffer, title }
        const dl = await getTrack(track.url); 

        // 3. Generate Card Image
        const cardBuffer = await drawCardSpotify({
            cover: track.album.images[0].url,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', ')
        });
        
        // 4. Kirim respons JSON ke Frontend
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            // Mengirim audio dalam format base64
            audioBase64: dl.buffer.toString('base64'),
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        console.error("Error API:", e);
        res.status(500).json({ success: false, error: e.message });
    }
}
