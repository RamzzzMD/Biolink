import axios from 'axios';

export default async function handler(req, res) {
    const { url } = req.query;
    
    if (!url) return res.status(400).json({ error: "URL tidak ditemukan" });

    try {
        // Kita tambahkan Referer dan Origin agar dianggap request sah dari Spotify
        const response = await axios({
            method: 'GET',
            url: decodeURIComponent(url),
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
                'Referer': 'https://open.spotify.com/', 
                'Origin': 'https://open.spotify.com',
                'Accept': '*/*',
                'Connection': 'keep-alive'
            }
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'audio/mpeg');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        response.data.pipe(res);
    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ error: "Gagal memutar lagu: Akses ditolak oleh server Spotify." });
    }
}
