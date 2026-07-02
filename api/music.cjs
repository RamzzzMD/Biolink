import { Spotify } from './spotify.cjs';
import { SpotifyDl } from './spotifydown-1.cjs';
import { drawCardSpotify } from './spotifycard.cjs';

const spotify = new Spotify();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    try {
        // ID lagu default: A Thousand Years (JVKE) kalau URL gak ngasih ID
        const trackId = req.query.id || '23WxsmliKISYaCfam8iPPG'; 
        
        // 1. Ambil info lagu
        const trackInfo = await spotify.track(trackId);
        if (!trackInfo) throw new Error("Track tidak ditemukan");

        // 2. Ambil link download MP3
        // Sesuaikan format URL Spotify-nya
        const trackUrl = `https://open.spotify.com/track/${trackId}`;
        const dlInfo = await SpotifyDl(trackUrl);

        // 3. Buat gambar Card khusus
        const cardBuffer = await drawCardSpotify({
            cover: trackInfo.album?.images[0]?.url,
            title: trackInfo.name,
            artist: trackInfo.artists?.map(a => a.name).join(', ')
        });
        
        // Ubah gambar menjadi format Base64 biar bisa langsung nampil di React
        const cardBase64 = `data:image/png;base64,${cardBuffer.toString('base64')}`;

        res.status(200).json({
            success: true,
            track: trackInfo,
            audioUrl: dlInfo.dl,
            cardImage: cardBase64
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
