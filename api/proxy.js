import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) return res.status(400).json({ error: "URL tidak ditemukan" });

    try {
        const decodedUrl = decodeURIComponent(url);
        
        // Menambahkan header yang lebih "manusiawi" untuk bypass 403
        const response = await axios({
            method: 'GET',
            url: decodedUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                'Accept': 'audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5',
                'Accept-Encoding': 'identity', // Penting: Jangan minta kompresi agar stream stabil
                'Range': 'bytes=0-', // Seringkali dibutuhkan oleh hoster file untuk streaming
                'Connection': 'keep-alive'
            },
            timeout: 10000
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Accept-Ranges', 'bytes');
        
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Fatal Error:", error.message);
        res.status(500).json({ 
            error: "Gagal mengambil data", 
            details: error.message 
        });
    }
}
