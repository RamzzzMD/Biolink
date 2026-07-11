import axios from 'axios';

// Fungsi untuk merapikan data lirik dari LRCLib
function shapeLyrics(d) {
    if (!d || (!d.syncedLyrics && !d.plainLyrics)) return null;
    return {
        hasSynced: !!d.syncedLyrics,
        synced: d.syncedLyrics || null,
        plain: d.plainLyrics || null,
    };
}

export default async function handler(req, res) {
    const query = req.query.q || "Choom"; 
    
    try {
        // 1. Ambil data lagu & audio resmi dari Nexray
        const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
        const nexrayRes = await axios.get(apiUrl);
        const data = nexrayRes.data;

        if (!data.status || !data.result?.download_url) {
            return res.status(404).json({ success: false, message: "Audio tidak ditemukan" });
        }

        const track = data.result;
        const artistName = track.artist;
        let trackName = track.title;

        // FIX AKURASI: Nexray sering mengembalikan judul berformat "Nama Artis - Judul Lagu"
        // Kita bersihkan nama artis di depan judul agar pencarian lirik di LRCLib tidak bingung
        if (trackName.toLowerCase().startsWith(artistName.toLowerCase() + " - ")) {
            trackName = trackName.slice(artistName.length + 3).trim();
        }

        // 2. Cari lirik dengan tingkat akurasi tinggi
        let lyrics = null;
        const headers = { "User-Agent": "RanzzBiolink/1.0 (https://github.com/ranzz)" };

        try {
            // Metode A: Tembak endpoint /api/get (Mencari lagu yang MATCH PERSIS berdasarkan Judul & Artis)
            const exactRes = await axios.get("https://lrclib.net/api/get", {
                headers,
                params: {
                    track_name: trackName,
                    artist_name: artistName
                }
            });
            lyrics = shapeLyrics(exactRes.data);
        } catch (err) {
            // Metode B: Jika exact match gagal, baru gunakan pencarian umum yang lebih ketat
            try {
                const searchRes = await axios.get("https://lrclib.net/api/search", {
                    headers,
                    params: { q: `${trackName} ${artistName}` }
                });

                if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
                    // Utamakan yang memiliki teks lirik tersinkronisasi (synced)
                    const best = searchRes.data.find(r => r.syncedLyrics) || searchRes.data[0];
                    lyrics = shapeLyrics(best);
                }
            } catch (searchErr) {
                console.log("LRCLib Search Fallback Error:", searchErr.message);
            }
        }
        
        // 3. Kirim data yang sudah fix ke Frontend
        res.status(200).json({
            success: true,
            title: trackName, // Judul bersih tanpa prefix artis
            artist: artistName,
            audioUrl: track.download_url,
            coverImage: track.thumbnail,
            lyrics: lyrics
        });

    } catch (e) {
        console.error("API Error:", e.message);
        res.status(500).json({ success: false, error: e.message });
    }
}
