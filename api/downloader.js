// api/downloader.js
import axios from "axios";

export async function downr(url) {
    try {
        if (!url.startsWith('https://')) throw new Error('Invalid url.');
        
        // 1. Dapatkan session/cookie dari endpoint analytics
        const { headers } = await axios.get('https://downr.org/.netlify/functions/analytics', {
            headers: {
                'referer': 'https://downr.org/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        // 2. Kirim request download ke fungsi 'nyt'
        const { data } = await axios.post('https://downr.org/.netlify/functions/nyt', {
            url: url
        }, {
            headers: {
                'accept': '*/*',
                'content-type': 'application/json',
                'cookie': headers['set-cookie']?.join('; ') || '',
                'origin': 'https://downr.org',
                'referer': 'https://downr.org/',
                'user-agent': 'Mozilla/5.0 (Linux; Android 15; SM-F958 Build/AP3A.240905.015) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.86 Mobile Safari/537.36'
            }
        });
        
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}
