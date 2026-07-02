import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: "URL lagu tidak ditemukan" });
    }

    try {
        // Nyamar jadi browser untuk download lagunya sebagai "stream"
        const response = await axios({
            method: 'GET',
            url: decodeURIComponent(url),
            responseType: 'stream', // Ini kunci utamanya biar audionya jalan!
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                'Accept': 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5'
            }
        });

        // Kasih tau frontend kalau ini adalah file audio yang aman
        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*'); 
        
        // Alirkan audionya ke frontend React kamu
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy error:", error.message);
        res.status(500).json({ error: "Gagal mengambil stream lagu" });
    }
}
