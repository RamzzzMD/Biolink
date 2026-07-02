import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) {
        console.error("Proxy Error: No URL provided");
        return res.status(400).json({ error: "URL tidak ditemukan" });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        console.log("Proxying request to:", decodedUrl); // Cek di logs Vercel apa URL-nya

        const response = await axios({
            method: 'GET',
            url: decodedUrl,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
            },
            timeout: 15000 // Timeout 15 detik biar server nggak gantung
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Accept-Ranges', 'bytes');
        
        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length']);
        }
        
        response.data.pipe(res);
    } catch (error) {
        // Ini bakal ngeprint detail error di Vercel Logs
        console.error("Proxy Fatal Error:", error.message);
        if (error.response) {
            console.error("Response Status:", error.response.status);
        }
        res.status(500).json({ 
            error: "Gagal mengambil data", 
            details: error.message 
        });
    }
}
