import axios from 'axios';

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

function parseTrackId(input) {
    if (!input) throw new Error("URL / ID track kosong");
    const uri = input.match(/spotify:track:([A-Za-z0-9]+)/);
    if (uri) return uri[1];
    const url = input.match(/track\/([A-Za-z0-9]+)/);
    if (url) return url[1];
    if (/^[A-Za-z0-9]{22}$/.test(input.trim())) return input.trim();
    throw new Error("Tidak bisa mengenali track ID dari: " + input);
}

function msToClock(ms) {
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

async function getEmbedSession(trackId) {
    const { data: html } = await axios.get("https://open.spotify.com/embed/track/" + trackId, {
        headers: { "User-Agent": UA, "Accept-Language": "en" },
    });
    const token = (html.match(/"accessToken":"([^"]+)"/) || [])[1];
    if (!token) throw new Error("Gagal ambil access token anonim dari embed");
    return {
        token,
        tokenExpiry: Number((html.match(/"accessTokenExpirationTimestampMs":(\d+)/) || [])[1]) || null,
        previewUrl: (html.match(/"audioPreview":\{"url":"([^"]+)"/) || [])[1] || null,
    };
}

async function getMetadata(trackId, session) {
    const { data: t } = await axios.get("https://api.spotify.com/v1/tracks/" + trackId, {
        headers: { "User-Agent": UA, Authorization: "Bearer " + session.token },
    });
    const album = t.album || {};
    const cover = (album.images || []).slice().sort((a, b) => (b.width || 0) - (a.width || 0));

    return {
        id: t.id,
        title: t.name,
        artists: (t.artists || []).map((a) => a.name),
        durationMs: t.duration_ms,
        cover: cover[0]?.url || null,
    };
}

function shapeLyrics(d) {
    if (!d || (!d.syncedLyrics && !d.plainLyrics)) return null;
    return {
        hasSynced: !!d.syncedLyrics,
        synced: d.syncedLyrics || null,
        plain: d.plainLyrics || null,
    };
}

async function getLyrics(meta) {
    const artist = meta.artists[0] || "";
    const durationSec = Math.round(meta.durationMs / 1000);
    const headers = { "User-Agent": "spotify" };

    let exact = null;
    try {
        const { data } = await axios.get("https://lrclib.net/api/get", {
            headers, params: { track_name: meta.title, artist_name: artist, duration: durationSec },
        });
        exact = shapeLyrics(data);
        if (exact?.hasSynced) return exact;
    } catch (err) { }

    try {
        const { data: results } = await axios.get("https://lrclib.net/api/search", {
            headers, params: { q: `${meta.title} ${artist}`.trim() },
        });
        if (Array.isArray(results) && results.length) {
            const best = results
                .map((r) => ({ r, diff: Math.abs((r.duration || 0) - durationSec) }))
                .sort((a, b) => (!!b.r.syncedLyrics - !!a.r.syncedLyrics) || (a.diff - b.diff))[0].r;
            const searched = shapeLyrics(best);
            if (searched?.hasSynced) return searched;
            return searched || exact;
        }
    } catch(err) { }
    return exact;
}

export default async function handler(req, res) {
    const query = req.query.q || "Choom"; 
    
    try {
        // 1. Dapatkan Link MP3 & URL Spotify asli dari Nexray
        const apiUrl = `https://api.nexray.eu.cc/downloader/spotifyplay?q=${encodeURIComponent(query)}`;
        const nexrayRes = await axios.get(apiUrl);
        const data = nexrayRes.data;

        if (!data.status || !data.result?.download_url) {
            return res.status(404).json({ success: false, message: "Lagu atau audio tidak ditemukan" });
        }

        const trackUrl = data.result.url;

        // 2. Gunakan Script Lirik kamu untuk mencari Lirik & Meta
        let lyrics = null;
        let metadata = null;
        try {
            const trackId = parseTrackId(trackUrl);
            const session = await getEmbedSession(trackId);
            metadata = await getMetadata(trackId, session);
            lyrics = await getLyrics(metadata);
        } catch (scrapeErr) {
            console.log("Scrape Lyrics Error:", scrapeErr.message);
        }
        
        // 3. Kirim kombinasi Audio + Lirik ke Frontend
        res.status(200).json({
            success: true,
            title: metadata?.title || data.result.title,
            artist: metadata ? metadata.artists.join(', ') : data.result.artist,
            audioUrl: data.result.download_url,
            coverImage: metadata?.cover || data.result.thumbnail,
            lyrics: lyrics // Data LRC (Synced/Plain)
        });

    } catch (e) {
        console.error("API Error:", e.message);
        res.status(500).json({ success: false, error: e.message });
    }
}
