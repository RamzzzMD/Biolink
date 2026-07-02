import { Spotify } from './spotify.cjs';
import { SpotifyDl } from './spotifydown-1.cjs';
import { drawCardSpotify } from './spotifycard.cjs';

const spotify = new Spotify();

export default async function handler(req, res) {
    try {
        // ID lagu (Anda bisa ganti ID ini sesuai lagu yang diinginkan)
        const trackId = req.query.id || '23WxsmliKISYaCfam8iPPG'; 
        const trackInfo = await spotify.track(trackId);
        
        // Ambil data download
        const dlInfo = await SpotifyDl(`http://googleusercontent.com/spotify.com/track/${trackId}`);

        // Buat gambar card
        const cardBuffer = await drawCardSpotify({
            cover: trackInfo.album?.images[0]?.url,
            title: trackInfo.name,
            artist: trackInfo.artists?.map(a => a.name).join(', ')
        });
        
        res.status(200).json({
            success: true,
            title: trackInfo.name,
            artist: trackInfo.artists?.map(a => a.name).join(', '),
            audioUrl: dlInfo.dl,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}
