import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) return res.status(400).json({ error: "URL tidak ditemukan" });

    try {
        const response = await axios({
            method: 'GET',
            url: decodeURIComponent(url),
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
            }
        });

        // Pastikan header hanya di-set jika nilainya ada
        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Accept-Ranges', 'bytes');
        
        // FIX: Cek dulu apakah ada content-length sebelum di-set
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: "Gagal mengambil data dari server download" });
    }
}
