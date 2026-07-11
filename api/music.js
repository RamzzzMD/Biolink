import axios from 'axios';

export default async function handler(req, res) {
    // Tangkap query pencarian dari frontend, default ke lagu pilihanmu
    const query = req.query.q || "Choom"; 
    
    try {
        // 1. Tembak langsung ke API Nexray
        const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        // 2. Cek apakah API merespon dengan sukses dan mengembalikan hasil
        if (!data.status || !data.result) {
            return res.status(404).json({ 
                success: false, 
                message: "Lagu tidak ditemukan oleh sistem" 
            });
        }

        const track = data.result;

        // 3. Pastikan link downloadnya benar-benar ada
        if (!track.download_url) {
            return res.status(500).json({ 
                success: false, 
                message: "Gagal mendapatkan link audio dari server" 
            });
        }
        
        // 4. Kirim data ke Frontend (App.tsx) dengan format yang sudah sesuai
        res.status(200).json({
            success: true,
            title: track.title,
            artist: track.artist,
            audioUrl: track.download_url, // Link MP3 langsung dari Nexray
            coverImage: track.thumbnail   // Link Cover Album
        });

    } catch (e) {
        console.error("Error API Music:", e.message);
        res.status(500).json({ 
            success: false, 
            error: "Terjadi kesalahan saat menghubungi API penyedia lagu" 
        });
    }
}
