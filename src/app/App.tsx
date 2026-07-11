import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────── */
interface Link {
  id: string;
  label: string;
  sublabel: string;
  href: string;
  icon: React.ReactNode;
  colorClass: string;
  glowColor: string;
  borderHover: string;
}

/* ─── SVG Icons ──────────────────────────────────────────────── */
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WebIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ChannelIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.53a16 16 0 0 0 6.56 6.56l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    <path d="M15 7h6m-3-3v6" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

/* ─── Link data ──────────────────────────────────────────────── */
const LINKS: Link[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "Chat with me directly",
    href: "https://wa.me/message/FOKEDL2PN6D4A1",
    icon: <WhatsAppIcon />,
    colorClass: "bg-gradient-to-br from-[#25d366] to-[#128c7e]",
    glowColor: "rgba(37,211,102,0.5)",
    borderHover: "rgba(37,211,102,0.55)",
  },
  {
    id: "instagram",
    label: "Instagram",
    sublabel: "Follow for updates",
    href: "https://instagram.com/rannzxyyy_",
    icon: <InstagramIcon />,
    colorClass: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]",
    glowColor: "rgba(228,64,95,0.5)",
    borderHover: "rgba(228,64,95,0.55)",
  },
  {
    id: "website",
    label: "Personal Website",
    sublabel: "Portfolio & projects",
    href: "#",
    icon: <WebIcon />,
    colorClass: "bg-gradient-to-br from-[#00f5ff] to-[#0080ff]",
    glowColor: "rgba(0,245,255,0.5)",
    borderHover: "rgba(0,245,255,0.55)",
  },
  {
    id: "wa-channel",
    label: "WhatsApp Channel",
    sublabel: "Join my broadcast",
    href: "https://whatsapp.com/channel/0029VadzGFGLSmbi4YKhDD3Q",
    icon: <ChannelIcon />,
    colorClass: "bg-gradient-to-br from-[#25d366] to-[#075e54]",
    glowColor: "rgba(37,211,102,0.5)",
    borderHover: "rgba(37,211,102,0.55)",
  },
  {
    id: "telegram",
    label: "Telegram",
    sublabel: "Message on Telegram",
    href: "https://t.me/cangcuthideung",
    icon: <TelegramIcon />,
    colorClass: "bg-gradient-to-br from-[#0088cc] to-[#00bcd4]",
    glowColor: "rgba(0,136,204,0.5)",
    borderHover: "rgba(0,136,204,0.55)",
  },
  {
    id: "youtube",
    label: "YouTube",
    sublabel: "Watch my content",
    href: "https://youtube.com/@Ranzzpointblank",
    icon: <YouTubeIcon />,
    colorClass: "bg-gradient-to-br from-[#ff0000] to-[#cc0000]",
    glowColor: "rgba(255,0,0,0.5)",
    borderHover: "rgba(255,0,0,0.55)",
  },
];

/* ─── LinkButton ─────────────────────────────────────────────── */
function LinkButton({ link, delay, dark, onCustomClick }: { link: Link; delay: number; dark: boolean; onCustomClick?: (id: string, e: React.MouseEvent) => void }) {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const counter = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Jalankan logika custom jika ada (misal: modal WhatsApp)
    if (onCustomClick) {
      onCustomClick(link.id, e);
    }
    
    // Logika animasi klik
    const rect = btnRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = counter.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, [link.id, onCustomClick]);

  return (
    <a
      ref={btnRef}
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      className="fade-up relative flex items-center gap-3.5 w-full px-[22px] py-[15px] rounded-[14px] no-underline overflow-hidden"
      style={{
        animationDelay: `${delay}ms`,
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${hovered ? link.borderHover : dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)"}`,
        boxShadow: hovered ? `0 0 22px 4px ${link.glowColor}` : dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-3px) scale(1.018)" : "translateY(0) scale(1)",
        transition: "transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease, border-color 0.22s ease, background 0.22s ease",
        color: dark ? "#e2e8f0" : "#1a1a2e",
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(0,245,255,0.06), rgba(191,0,255,0.06))",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.22s ease",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(0,245,255,0.18)",
            width: 200,
            height: 200,
            left: r.x - 100,
            top: r.y - 100,
            transform: "scale(0)",
            animation: "rippleAnim 0.55s linear forwards",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Icon */}
      <div
        className={`${link.colorClass} flex items-center justify-center flex-shrink-0 rounded-[10px]`}
        style={{
          width: 42,
          height: 42,
          transform: hovered ? "scale(1.12) rotate(-4deg)" : "scale(1) rotate(0deg)",
          transition: "transform 0.22s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        {link.icon}
      </div>

      {/* Text */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.01em" }}>
          {link.label}
        </div>
        <div style={{ fontSize: "0.72rem", opacity: 0.55, marginTop: 1 }}>{link.sublabel}</div>
      </div>

      {/* Arrow */}
      <div
        style={{
          marginLeft: "auto",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-6px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <ChevronRight />
      </div>
    </a>
  );
}

/* ─── App ────────────────────────────────────────────────────── */
/* ─── Loader ─────────────────────────────────────────────────── */
function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setPct(100);
        setTimeout(() => {
          setLeaving(true);
          setTimeout(onDone, 600);
        }, 300);
      }
      setPct(current);
    }, 35);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 999,
      background: "radial-gradient(ellipse at 20% 20%, #0a0a1f 0%, #060611 40%, #0a0518 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28,
      opacity: leaving ? 0 : 1,
      transform: leaving ? "scale(1.04)" : "scale(1)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      pointerEvents: leaving ? "none" : "all",
    }}>
      {/* blobs */}
      <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#00f5ff,transparent 70%)", filter:"blur(80px)", opacity:0.3, top:-80, left:-80, animation:"blob1 8s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,#bf00ff,transparent 70%)", filter:"blur(80px)", opacity:0.3, bottom:-60, right:-60, animation:"blob2 10s ease-in-out infinite" }} />

      {/* Welcome */}
      <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:"clamp(2rem,8vw,3.5rem)", letterSpacing:"-0.03em", background:"linear-gradient(90deg,#00f5ff 0%,#bf00ff 60%,#00f5ff 100%)", backgroundSize:"200% auto", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", animation:"shimmer 3s linear infinite" }}>
        Welcome
      </p>

      {/* Counter */}
      <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:600, fontSize:"clamp(1rem,4vw,1.4rem)", color:"rgba(226,232,240,0.55)", letterSpacing:"0.08em" }}>
        {pct}%
      </p>

      {/* Bar */}
      <div style={{ width:"min(280px,70vw)", height:3, borderRadius:99, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:"linear-gradient(90deg,#00f5ff,#bf00ff)", boxShadow:"0 0 10px 2px rgba(0,245,255,0.5)", transition:"width 0.05s linear" }} />
      </div>
    </div>
  );
}

/* ─── Spotify Widget ─────────────────────────────────────────── */
// Fungsi untuk memecah format LRC lirik menjadi Array Objek { time, text }
const parseLrc = (lrcString: string) => {
  if (!lrcString) return [];
  return lrcString.split('\n').map(line => {
    const match = line.match(/\[(\d+):(\d+(?:\.\d+)?)\](.*)/);
    if (match) {
      return {
        time: parseInt(match[1]) * 60 + parseFloat(match[2]),
        text: match[3].trim() || '🎵'
      };
    }
    return null;
  }).filter(Boolean) as { time: number, text: string }[];
};

function SpotifyWidget() {
  const [data, setData] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const [input, setInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [lyricsState, setLyricsState] = useState<'closed' | 'full' | 'mini'>('closed');
  const [currentTime, setCurrentTime] = useState(0);
  const [lyricOffset, setLyricOffset] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState<{time: number, text: string}[]>([]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const loadMusic = async (query: string) => {
    setData((prev: any) => prev ? { ...prev, loading: true } : { loading: true });
    try {
      const res = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      
      if (json.success) {
        setData({ ...json, loading: false });
        setLyricOffset(0); 
        
        if (json.lyrics) {
          if (json.lyrics.hasSynced) {
            setParsedLyrics(parseLrc(json.lyrics.synced));
          } else {
            setParsedLyrics([]);
          }
          setLyricsState('mini'); 
        } else {
          setParsedLyrics([]);
          setLyricsState('closed');
        }
        
      } else {
        setData((prev: any) => ({ ...prev, loading: false }));
      }
    } catch (err) {
      console.error("Gagal memuat:", err);
      setData((prev: any) => ({ ...prev, loading: false }));
    }
  };

  const triggerPlay = () => {
    if (!hasStarted.current && audioRef.current && audioRef.current.readyState >= 2) {
      audioRef.current.play().catch(e => console.log(e));
      hasStarted.current = true;
    }
  };

  useEffect(() => {
    loadMusic("BABYMONSTER CHOOM");
    document.addEventListener('click', triggerPlay, { once: true });
    return () => document.removeEventListener('click', triggerPlay);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      playing ? audioRef.current.pause() : audioRef.current.play();
    }
  };

  const handleSearch = () => {
    if (input.trim()) {
      loadMusic(input);
      setIsSearchOpen(false);
      setInput("");
    }
  };

  const getActiveLyricText = () => {
    if (data?.loading) return "Mencari lirik...";
    if (!parsedLyrics.length) {
      return data?.lyrics?.plain ? "Lirik standar tersedia (Buka mode Penuh)" : "Lirik tidak tersedia 🎵";
    }
    const adjTime = currentTime + lyricOffset;
    const active = [...parsedLyrics].reverse().find(lyric => adjTime >= lyric.time);
    return active ? active.text : "🎵";
  };

  useEffect(() => {
    if (lyricsState === 'full' && lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.querySelector('.active-lyric');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, lyricsState, lyricOffset]);

  if (!data || (!data.title && !data.loading)) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] flex flex-col gap-2 z-[60]">
        
        {/* MODE MINI LIRIK */}
        {lyricsState === 'mini' && (
          <div 
            onClick={() => setLyricsState('full')}
            className="w-full bg-black/70 backdrop-blur-xl border border-purple-500/40 px-4 py-2.5 rounded-xl flex items-center justify-between gap-2 shadow-[0_0_15px_rgba(168,85,247,0.2)] cursor-pointer hover:border-cyan-500/50 transition-all group animate-fade-in overflow-hidden"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 shrink-0">Live</span>
            <p className="flex-1 text-xs font-semibold text-white truncate text-center drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              {getActiveLyricText()}
            </p>
            <span className="text-xs text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">🗖</span>
          </div>
        )}

        {/* Player Card */}
        <div className="w-full bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-3 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col gap-3 transition-all hover:border-purple-500/50 overflow-hidden">
          <div className="flex items-center gap-4">
            <div className={`relative w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.5)] ${data.loading ? 'opacity-50' : 'opacity-100'}`}>
              <img src={data.coverImage || 'https://via.placeholder.com/150/000000/06B6D4'} alt="cover" className={`w-full h-full object-cover ${playing && !data.loading ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/80 rounded-full border border-gray-700"></div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="text-white font-bold text-sm truncate">{data.loading ? "Mencari lagu..." : data.title}</h3>
              <p className="text-cyan-400 text-xs truncate">{data.loading ? "Tunggu sebentar..." : data.artist}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setLyricsState(lyricsState === 'closed' ? 'full' : 'closed'); 
                }}
                disabled={data.loading || (!data.lyrics?.hasSynced && !data.lyrics?.plain)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${lyricsState !== 'closed' ? 'bg-purple-500/30 text-purple-400 border border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}
              >
                🎤
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsSearchOpen(!isSearchOpen); }} className="w-9 h-9 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white/70 rounded-full border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg>
              </button>
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} disabled={data.loading || !data.audioUrl} className="w-10 h-10 flex items-center justify-center bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 text-cyan-400 rounded-full transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {playing ? "⏸" : "▶"}
              </button>
            </div>
          </div>

          <div className={`overflow-hidden transition-all duration-500 ${isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="flex w-full gap-2 pt-3 border-t border-white/10">
              <input className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="Cari lagu..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
              <button onClick={(e) => { e.stopPropagation(); handleSearch(); }} className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-4 rounded-xl text-sm font-bold shrink-0">Cari</button>
            </div>
          </div>
        </div>

      </div>

      {data.audioUrl && (
        <audio
          ref={audioRef}
          src={`/api/proxy?url=${encodeURIComponent(data.audioUrl)}`}
          autoPlay 
          onPlay={() => setPlaying(true)}   
          onPause={() => setPlaying(false)} 
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        />
      )}

      {/* MODAL LIRIK MODE PENUH (TIDAK ADA SCROLL KANAN KIRI LAGI) */}
      {lyricsState === 'full' && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-end pb-32 bg-black/80 backdrop-blur-xl px-4 sm:px-6 overflow-hidden" onClick={() => setLyricsState('closed')}>
          <div 
            className="w-full max-w-[500px] h-[65vh] flex flex-col gap-4 overflow-hidden" 
            onClick={e => e.stopPropagation()}
          >
            {/* Header & Controls */}
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              {/* Tambahan min-w-0 dan truncate agar teks panjang terpotong rapi */}
              <div className="flex-1 min-w-0 pr-3">
                <h2 className="text-white text-xl font-bold leading-tight truncate">{data.title}</h2>
                <p className="text-cyan-400 text-sm mt-1 truncate">{data.artist}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setLyricsState('mini')} className="bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap">🗕 Mini</button>
                  <button onClick={() => setLyricsState('closed')} className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white/70 text-xs">✕</button>
                </div>
              </div>
            </div>

            {/* PANEL SYNC LIRIK */}
            {data.lyrics?.hasSynced && (
              /* Mengubah w-max menjadi w-fit max-w-full agar tidak menjebol layar kecil */
              <div className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-xl py-2 px-3 w-fit max-w-full mx-auto shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                <button 
                  onClick={() => setLyricOffset(p => p - 0.5)} 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold active:scale-95 transition-all shrink-0"
                  title="Perlambat lirik"
                >-</button>
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold mb-0.5">Sync</span>
                  <span className={`text-xs font-bold ${lyricOffset === 0 ? 'text-white' : 'text-cyan-400'}`}>
                    {lyricOffset > 0 ? `+${lyricOffset.toFixed(1)}s` : `${lyricOffset.toFixed(1)}s`}
                  </span>
                </div>
                <button 
                  onClick={() => setLyricOffset(p => p + 0.5)} 
                  className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold active:scale-95 transition-all shrink-0"
                  title="Percepat lirik"
                >+</button>
              </div>
            )}

            {/* Area Lirik Berjalan */}
            <div ref={lyricsContainerRef} className="flex-1 overflow-y-auto scrollbar-hide py-4 space-y-6 text-center mask-image-b w-full" style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}>
              {data.lyrics?.hasSynced && parsedLyrics.length > 0 ? (
                parsedLyrics.map((lyric, idx) => {
                  const adjTime = currentTime + lyricOffset;
                  const isCurrent = adjTime >= lyric.time && (!parsedLyrics[idx + 1] || adjTime < parsedLyrics[idx + 1].time);
                  
                  return (
                    <p 
                      key={idx} 
                      className={`transition-all duration-300 text-lg md:text-2xl font-bold px-2 ${isCurrent ? 'active-lyric text-cyan-400 scale-110 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'text-white/40 scale-100 blur-[0.5px]'}`}
                    >
                      {lyric.text}
                    </p>
                  );
                })
              ) : data.lyrics?.plain ? (
                <p className="text-white/70 whitespace-pre-wrap leading-loose text-lg font-medium px-2">
                  {data.lyrics.plain}
                </p>
              ) : (
                <p className="text-white/30 italic mt-20">Lirik tidak tersedia.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── App ────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [toggleHovered, setToggleHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // STATE BARU: Untuk kontrol modal WhatsApp
  const [waModalOpen, setWaModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ranzz-theme");
    if (saved) setDark(saved === "dark");
  }, []);
  
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("ranzz-theme", next ? "dark" : "light");
  };

  // FUNGSI SAKTI: Membuka WhatsApp spesifik via Intent Android
  const handleWaClick = (appType: 'personal' | 'business') => {
    const phone = "6281214300828"; // <--- GANTI DENGAN NOMOR WA KAMU (misal: 628123456789)
    const msg = "Halo Ranzz!";
    const encodedMsg = encodeURIComponent(msg);
    
    // Fallback default (URL wa.me lama kamu)
    let link = `https://wa.me/message/FOKEDL2PN6D4A1`; 

    if (/android/i.test(navigator.userAgent)) {
      if (appType === 'business') {
        link = `intent://send?phone=${phone}&text=${encodedMsg}#Intent;package=com.whatsapp.w4b;scheme=whatsapp;end`;
      } else {
        link = `intent://send?phone=${phone}&text=${encodedMsg}#Intent;package=com.whatsapp;scheme=whatsapp;end`;
      }
    }

    window.open(link, '_blank');
    setWaModalOpen(false); // Tutup modal setelah diklik
  };

  // FUNGSI CEGATAN KLIK: Membuka Modal kalau tombolnya adalah "WhatsApp"
  const handleLinkClick = (id: string, e: React.MouseEvent) => {
    if (id === "whatsapp") {
      e.preventDefault(); // Mencegah pindah halaman
      setWaModalOpen(true); // Tampilkan modal
    }
  };

  return (
    <>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');

        @keyframes blob1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-60px) scale(1.1); }
          66%      { transform: translate(-30px,30px) scale(0.9); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-50px,40px) scale(1.15); }
          66%      { transform: translate(60px,-20px) scale(0.95); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(-50%,-50%) scale(1); }
          33%      { transform: translate(-50%,-50%) translate(30px,50px) scale(0.9); }
          66%      { transform: translate(-50%,-50%) translate(-40px,-40px) scale(1.1); }
        }
        @keyframes ringRotate {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 14px 5px rgba(0,245,255,0.55), 0 0 36px 14px rgba(191,0,255,0.3); }
          50%      { box-shadow: 0 0 24px 10px rgba(0,245,255,0.85), 0 0 60px 24px rgba(191,0,255,0.55); }
        }
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rippleAnim {
          to { transform: scale(4); opacity: 0; }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 0.65s ease forwards;
        }
        .avatar-ring {
          padding: 3px;
          background: linear-gradient(135deg, #00f5ff, #bf00ff, #6600ff, #00f5ff);
          background-size: 300% 300%;
          animation: ringRotate 4s linear infinite, glowPulse 2s ease-in-out infinite;
          border-radius: 50%;
        }
        .name-gradient {
          background: linear-gradient(90deg, #00f5ff 0%, #bf00ff 60%, #00f5ff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .footer-gradient {
          background: linear-gradient(90deg, #00f5ff, #bf00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,245,255,0.3); border-radius: 99px; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: dark
            ? "radial-gradient(ellipse at 20% 20%, #0a0a1f 0%, #060611 40%, #0a0518 100%)"
            : "radial-gradient(ellipse at 20% 20%, #e8f0ff 0%, #f0f4ff 40%, #f5eeff 100%)",
          fontFamily: "'Inter', sans-serif",
          overflowX: "hidden",
          transition: "background 0.4s ease",
          position: "relative",
        }}
      >
        {/* ── Animated blobs ── */}
        <div aria-hidden style={{
          position: "fixed", width: 520, height: 520, borderRadius: "50%",
          background: "radial-gradient(circle, #00f5ff 0%, transparent 70%)",
          filter: "blur(90px)", opacity: dark ? 0.35 : 0.15, pointerEvents: "none",
          top: -120, left: -160, animation: "blob1 8s ease-in-out infinite", zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: "fixed", width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, #bf00ff 0%, transparent 70%)",
          filter: "blur(90px)", opacity: dark ? 0.35 : 0.15, pointerEvents: "none",
          bottom: -80, right: -140, animation: "blob2 10s ease-in-out infinite", zIndex: 0,
        }} />
        <div aria-hidden style={{
          position: "fixed", width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, #6600ff 0%, transparent 70%)",
          filter: "blur(90px)", opacity: dark ? 0.3 : 0.1, pointerEvents: "none",
          top: "45%", left: "50%", animation: "blob3 12s ease-in-out infinite", zIndex: 0,
        }} />

        {/* ── Theme toggle ── */}
        <button
          onClick={toggleTheme}
          onMouseEnter={() => setToggleHovered(true)}
          onMouseLeave={() => setToggleHovered(false)}
          aria-label="Toggle theme"
          style={{
            position: "fixed", top: 18, right: 18, zIndex: 50,
            width: 46, height: 46, borderRadius: 12,
            border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)"}`,
            background: dark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: toggleHovered
              ? "0 0 16px 4px rgba(0,245,255,0.3)"
              : dark ? "0 4px 16px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.1)",
            transform: toggleHovered ? "scale(1.08)" : "scale(1)",
            transition: "all 0.2s ease",
            color: dark ? "#00f5ff" : "#bf00ff",
          }}
        >
          {dark ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* ── Main content ── */}
        <main style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "64px 16px 40px" }}>
          <div style={{ width: "100%", maxWidth: 448, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>

            {/* Avatar */}
            <div className="fade-up" style={{ animationDelay: "0.1s" }}>
              <div className="avatar-ring">
                <div style={{
                  width: 96, height: 96, borderRadius: "50%", padding: 3,
                  background: dark ? "linear-gradient(135deg,#0f0f2a,#1a0a2a)" : "linear-gradient(135deg,#e8f0ff,#f5eeff)",
                  overflow: "hidden", 
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: dark ? "linear-gradient(135deg,#0f0f2a,#1a0a2a)" : "linear-gradient(135deg,#dde8ff,#eedeff)",
                    border: `2px solid ${dark ? "rgba(0,245,255,0.1)" : "rgba(191,0,255,0.15)"}`,
                  }}>
                    <img 
                      src="https://raw.githubusercontent.com/RamzzzMD/uploader-web/refs/heads/main/uploads/WhatsApp%20Image%202026-07-02%20at%2019.11.09.jpeg" 
                      alt="Ranzz" 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Name & Bio */}
            <div className="fade-up" style={{ animationDelay: "0.22s", textAlign: "center" }}>
              <h1 className="name-gradient" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: "1.875rem", letterSpacing: "-0.02em", margin: 0 }}>
                Ranzz
              </h1>
              <p style={{ color: dark ? "rgba(226,232,240,0.65)" : "rgba(26,26,46,0.6)", fontSize: "0.875rem", fontWeight: 500, letterSpacing: "0.03em", marginTop: 6 }}>
                Creator
              </p>

              {/* Language badges */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
                {[
                  { lang: "TypeScript", color: "#3178c6" },
                  { lang: "React", color: "#61dafb" },
                  { lang: "Node.js", color: "#68a063" },
                  { lang: "Python", color: "#f7d041" },
                ].map((l) => (
                  <span key={l.lang} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 6,
                    fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.03em",
                    fontFamily: "'Space Grotesk', sans-serif",
                    background: `${l.color}18`,
                    border: `1px solid ${l.color}55`,
                    color: l.color,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, display: "inline-block", flexShrink: 0 }} />
                    {l.lang}
                  </span>
                ))}
              </div>

              {/* Stat badges */}
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
                {[
                  { label: "Available", color: "#00f5ff", dot: true },
                  { label: "Open", color: "#bf00ff", dot: false },
                  { label: "🌏 Remote", color: dark ? "rgba(255,255,255,0.5)" : "rgba(26,26,46,0.55)", dot: false },
                ].map((b) => (
                  <span key={b.label} style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    padding: "5px 13px", borderRadius: 999,
                    fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
                    border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
                    background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                    color: b.color,
                  }}>
                    {b.dot && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#00f5ff", display: "inline-block" }} />}
                    {b.label}
                  </span>
                ))}
              </div>
            </div>
            
            <SpotifyWidget />
            
            {/* Glass card with links */}
            <div
              className="fade-up"
              style={{
                animationDelay: "0.34s",
                width: "100%",
                padding: 20,
                borderRadius: 20,
                background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.55)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: `1px solid ${dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)" : "0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.7)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {LINKS.map((link, i) => (
                <LinkButton 
                  key={link.id} 
                  link={link} 
                  delay={400 + i * 80} 
                  dark={dark} 
                  onCustomClick={handleLinkClick} // <-- Prop baru untuk mengontrol klik
                />
              ))}
            </div>

            {/* Footer */}
            <div className="fade-up" style={{ animationDelay: "1.06s", textAlign: "center", marginTop: 4 }}>
              <p className="footer-gradient" style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.06em" }}>
                Created by Ranzz
              </p>
            </div>
          </div>
        </main>

        {/* ── MODAL PILIHAN WHATSAPP (Glassmorphism) ── */}
        {waModalOpen && (
          <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md px-4" 
            onClick={() => setWaModalOpen(false)}
          >
            <div 
              className="bg-[#0a0a1f]/90 border border-green-500/30 p-6 rounded-3xl shadow-[0_0_30px_rgba(34,197,94,0.2)] w-full max-w-[320px] flex flex-col gap-4 transform transition-all fade-up" 
              onClick={e => e.stopPropagation()} 
              style={{ animationDelay: "0s" }}
            >
              <h3 className="text-white font-bold text-center text-lg mb-2" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                Buka WhatsApp via:
              </h3>

              {/* Tombol WA Biasa */}
              <button 
                onClick={() => handleWaClick('personal')} 
                className="flex items-center justify-center gap-3 w-full bg-green-500/10 hover:bg-green-500/30 border border-green-500/50 text-green-400 py-3 rounded-2xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
                WhatsApp Biasa
              </button>

              {/* Tombol WA Bisnis */}
              <button 
                onClick={() => handleWaClick('business')} 
                className="flex items-center justify-center gap-3 w-full bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-400 py-3 rounded-2xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m-1.282-4.148c-.286-.062-.513-.156-.682-.284l.215-.992c.185.127.42.227.702.302.283.076.541.114.774.114.288 0 .513-.053.673-.158.16-.106.241-.252.241-.439 0-.156-.057-.282-.17-.38-.112-.097-.286-.17-.52-.22l-.707-.152c-.378-.08-.667-.213-.865-.398-.199-.186-.299-.442-.299-.77 0-.36.143-.655.43-.884.286-.23.673-.346 1.16-.346.257 0 .51.034.757.102.247.067.466.155.656.262l-.208.97c-.16-.098-.352-.18-.574-.247-.222-.066-.451-.099-.686-.099-.25 0-.448.046-.593.138-.145.093-.218.225-.218.397 0 .144.053.256.16.336.107.08.271.144.492.193l.707.15c.394.086.696.223.905.413.21.19.314.453.314.789 0 .375-.15.685-.449.927-.298.243-.72.364-1.267.364-.294 0-.585-.038-.874-.114z"/>
                </svg>
                WhatsApp Bisnis
              </button>

              {/* Tombol Batal */}
              <button 
                onClick={() => setWaModalOpen(false)} 
                className="mt-2 text-white/50 text-sm hover:text-white transition-all underline decoration-white/30 underline-offset-4"
              >
                Kembali
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
