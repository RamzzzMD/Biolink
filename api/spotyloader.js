import axios from "axios";

export async function downloadTrack(trackUrl) {
  try {
    const res = await axios.post('https://spotyloader.com/api/spotify/track', { url: trackUrl }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const trackId = res.data.jobId;
    if (!trackId) {
      return { error: "Failed to get job ID from server.", url: trackUrl };
    }

    // Polling selama maksimal 60 detik (20 kali x 3 detik)
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusRes = await axios.get(`https://spotyloader.com/api/spotify/track/status/${trackId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      const data = statusRes.data;
      
      if (data.status === 'ready' || data.status === 'success') {
        const downloadUrl = data.downloadLink || data.downloadUrl || (data.post && data.post.download_url);
        if (downloadUrl) {
          return {
            success: true,
            download_url: downloadUrl,
            metadata: data.post ? {
              title: data.post.name,
              artist: data.post.artist,
              album: data.post.album,
              image: data.post.image
            } : null
          };
        }
      } else if (data.status === 'error' || data.status === 'failed') {
          return { error: "Conversion failed on server.", url: trackUrl };
      }
    }
    return { error: "Timeout waiting for conversion.", url: trackUrl };
  } catch (error) {
    return { error: error.response ? error.response.data : error.message, url: trackUrl };
  }
}
