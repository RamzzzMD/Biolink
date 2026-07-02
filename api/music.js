// api/music.js
import { Spotify } from './spotify.js';
import { SpotifyDl } from './spotifydown-1.js';
import { drawCardSpotify } from './spotifycard.js';

const spotify = new Spotify();

export default async function handler(req, res) {
    const query = req.query.q || "BABYMONSTER CHOOM"; 
    try {
        const searchRes = await spotify.search(query);
        const track = searchRes.tracks[0];
        if (!track) return res.status(404).json({ success: false });

        const dlInfo = await SpotifyDl(track.url);
        const cardBuffer = await drawCardSpotify({
            cover: track.album.images[0].url,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', ')
        });
        
        res.status(200).json({
            success: true,
            title: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            audioUrl: dlInfo.dl,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
}
