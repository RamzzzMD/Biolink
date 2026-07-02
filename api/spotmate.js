import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";

class SpotMate {
  constructor() {
    const ip = [
      10,
      crypto.randomInt(256),
      crypto.randomInt(256),
      crypto.randomInt(256)
    ].join(".");
    
    this.client = axios.create({
      baseURL: "https://spotmate.online",
      headers: {
        authority: "spotmate.online",
        origin: "https://spotmate.online",
        referer: "https://spotmate.online/en",
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36",
        "x-forwarded-for": ip,
        "x-originating-ip": ip,
        "x-remote-ip": ip,
        "x-remote-addr": ip,
        "x-forwarded-host": ip,
        "x-connecting-ip": ip,
        "client-ip": ip,
        "x-client-ip": ip,
        "x-real-ip": ip,
        "x-forwarded-for-original": ip,
        "x-forwarded": ip,
        "x-cluster-client-ip": ip,
        "x-original-forwarded-for": ip
      }
    });
    
    this.client.interceptors.response.use((res) => {
      const cookies = res.headers["set-cookie"];
      if (cookies?.length) {
        this.client.defaults.headers.common["cookie"] = cookies
          .map((v) => v.split(";")[0])
          .join("; ");
      }
      return res;
    });
  }

  async csrf() {
    const { data } = await this.client.get("/");
    const $ = cheerio.load(data);
    const csrf = $('meta[name="csrf-token"]').attr("content");
    if (!csrf) {
      throw new Error("Failed to get csrf token");
    }
    this.client.defaults.headers.common["x-csrf-token"] = csrf;
    return csrf;
  }

  async dl(url) {
    try {
      if (!url.includes("open.spotify.com")) {
        throw new Error("Invalid Spotify URL");
      }
      await this.csrf();
      const [{ data: meta }, { data: audio }] = await Promise.all([
        this.client.post("/getTrackData", {
          spotify_url: url
        }),
        this.client.post("/convert", {
          urls: url
        })
      ]);
      
      return {
        success: true,
        result: {
          metadata: {
            id: meta?.id || null,
            title: meta?.name || null,
            type: meta?.type || null,
            duration: meta?.duration_ms || null,
            explicit: meta?.explicit || false,
            artists: meta?.artists?.map((v) => v.name) || [],
            cover: meta?.album?.images?.[0]?.url || null,
            spotify: meta?.external_urls?.spotify || url
          },
          download: {
            type: "mp3",
            url: audio?.url || null
          }
        }
      };
    } catch (e) {
      return {
        status: false,
        message: e.response?.data?.message || e.message || "Gtw",
        response: e.response?.data || null
      };
    }
  }
}

export default SpotMate;
