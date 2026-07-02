// api/music.js
const { Spotify } = require('./spotify.js');
const { SpotifyDl } = require('./spotifydown-1.js');
const { drawCardSpotify } = require('./spotifycard.js');

const spotify = new Spotify();

module.exports = async function handler(req, res) {
    try {
        const trackId = req.query.id || '40c5f59047c64264'; 
        const trackInfo = await spotify.track(trackId);
        const dlInfo = await SpotifyDl(`http://googleusercontent.com/spotify.com/track/${trackId}`);

        const cardBuffer = await drawCardSpotify({
            cover: trackInfo.album.images[0].url,
            title: trackInfo.name,
            artist: trackInfo.artists.map(a => a.name).join(', ')
        });
        
        res.status(200).json({
            success: true,
            title: trackInfo.name,
            artist: trackInfo.artists.map(a => a.name).join(', '),
            audioUrl: dlInfo.dl,
            cardImage: `data:image/png;base64,${cardBuffer.toString('base64')}`
        });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};
