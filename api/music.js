// api/music.js
import { Spotify } from './spotify.js';
import { SpotifyDl } from './spotifydown-1.js';
import { drawCardSpotify } from './spotifycard.js';

const spotify = new Spotify();

export default async function handler(req, res) {
    try {
        let trackId = req.query.id;
        let query = req.query.search;

        // Jika ada query pencarian, cari dulu ID-nya
        if (query) {
            const searchRes = await spotify.search(query);
            if (searchRes.tracks.length > 0) {
                trackId = searchRes.tracks[0].id;
            }
        }

        // Default ID: BABYMONSTER - CHOOM (Sesuaikan jika ID berbeda)
        trackId = trackId || '40c5f59047c64264'; 
        
        const trackInfo = await spotify.track(trackId);
        const dlInfo = await SpotifyDl(`https://open.spotify.com/track/${trackId}`);

        const cardBuffer = await drawCardSpotify({
            cover: trackInfo.album.images[0].url,
            title: trackInfo.name,
            artist: trackInfo.artists.map(a => a.name).join(', ')
        });
        
        res.status(200).json({
            success: true,
            id: trackId,
            title: trackInfo.name,
            artist: trackInfo.artists.map(a => a.name).join(', '),
            audioUrl: dlInfo.dl,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}
