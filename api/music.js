import axios from 'axios';

// Fungsi untuk merapikan format lirik
function shapeLyrics(d) {
    if (!d || (!d.syncedLyrics && !d.plainLyrics)) return null;
    return {
        hasSynced: !!d.syncedLyrics,
        synced: d.syncedLyrics || null,
        plain: d.plainLyrics || null,
    };
}

export default async function handler(req, res) {
    // Tangkap query pencarian (misal: "BABYMONSTER CHOOM")
    const query = req.query.q || "Choom"; 
    
    try {
        // 1. Ambil Audio & Data Lagu dari Nexray
        const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
        const nexrayRes = await axios.get(apiUrl);
        const data = nexrayRes.data;

        if (!data.status || !data.result?.download_url) {
            return res.status(404).json({ success: false, message: "Audio tidak ditemukan" });
        }

        const track = data.result;

        // 2. Cari Lirik langsung ke LRCLib (Tanpa ribet scrape Spotify lagi!)
        let lyrics = null;
        try {
            // KUNCI ANTI-429: Gunakan User-Agent kustom agar dianggap sebagai aplikasi resmi, bukan bot!
            const { data: lrcResults } = await axios.get("https://lrclib.net/api/search", {
                headers: { "User-Agent": "RanzzBiolink/1.0 (https://github.com/ranzz)" },
                params: { q: query } // Langsung cari pakai keyword user
            });

            if (Array.isArray(lrcResults) && lrcResults.length > 0) {
                // Cari lirik yang ada timing-nya (synced), kalau nggak ada ambil yang biasa
                const best = lrcResults.find(r => r.syncedLyrics) || lrcResults[0];
                lyrics = shapeLyrics(best);
            }
        } catch (err) {
            console.log("LRCLib Error (Abaikan jika lagu tetap jalan):", err.message);
        }
        
        // 3. Gabungkan Data Nexray + Lirik, lalu kirim ke Frontend
        res.status(200).json({
            success: true,
            title: track.title,
            artist: track.artist,
            audioUrl: track.download_url,
            coverImage: track.thumbnail,
            lyrics: lyrics // Data LRC langsung dikirim
        });

    } catch (e) {
        console.error("API Error:", e.message);
        res.status(500).json({ success: false, error: e.message });
    }
}
