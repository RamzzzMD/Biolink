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

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="46" height="46" fill="none" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f5ff" />
        <stop offset="100%" stopColor="#bf00ff" />
      </linearGradient>
    </defs>
    <path stroke="url(#userGrad)" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

/* ─── Link data ──────────────────────────────────────────────── */
const LINKS: Link[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    sublabel: "Chat with me directly",
    href: "https://wa.me/6281214300828",
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
    href: "https://whatsapp.com/channel/",
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
function LinkButton({ link, delay, dark }: { link: Link; delay: number; dark: boolean }) {
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const btnRef = useRef<HTMLAnchorElement>(null);
  const counter = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = btnRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = counter.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  }, []);

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
function SpotifyWidget({ dark }: { dark: boolean }) {
  const [data, setData] = useState<any>(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasStarted = useRef(false); // Penanda biar musik cuma auto-play sekali

  const loadMusic = async (query: string) => {
    const res = await fetch(`/api/music?q=${encodeURIComponent(query)}`);
    const json = await res.json();
    if (json.success) setData(json);
  };

  // Fungsi untuk trigger play
  const triggerPlay = () => {
    if (!hasStarted.current && audioRef.current) {
      audioRef.current.play().then(() => {
        setPlaying(true);
        hasStarted.current = true;
      }).catch(err => console.log("Menunggu interaksi user:", err));
    }
  };

  useEffect(() => {
    // 1. Load data saat web dibuka
    loadMusic("BABYMONSTER CHOOM");

    // 2. Pasang pendengar klik di seluruh dokumen
    // Musik akan otomatis bunyi saat user pertama kali klik di mana saja di web
    document.addEventListener('click', triggerPlay);
    
    return () => {
      document.removeEventListener('click', triggerPlay);
    };
  }, []);

  return (
    <div className={`mt-6 p-6 rounded-3xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} backdrop-blur-md w-full max-w-sm mx-auto flex flex-col items-center gap-4`}>
      {data ? (
        <>
          <img src={data.cardImage} className="rounded-xl w-40 shadow-2xl" alt="Cover" />
          <div className="text-center">
            <h4 className={`font-bold ${dark ? 'text-white' : 'text-black'}`}>{data.title}</h4>
            <p className="text-xs opacity-60">{data.artist}</p>
          </div>
          <audio ref={audioRef} src={data.audioUrl} />
          <button 
            onClick={() => { playing ? audioRef.current?.pause() : audioRef.current?.play(); setPlaying(!playing); }}
            className="text-cyan-400 font-bold text-sm bg-cyan-500/10 px-4 py-2 rounded-full"
          >
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
        </>
      ) : (
        <p className="text-sm opacity-50">Memuat CHOOM...</p>
      )}

      <div className="flex w-full gap-2 pt-2 border-t border-white/10">
        <input 
          className="flex-1 bg-black/20 rounded-full px-4 py-2 text-sm text-white"
          placeholder="Cari lagu lain..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={() => loadMusic(input)} className="bg-cyan-500/20 text-cyan-400 px-4 rounded-full text-sm">Cari</button>
      </div>
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  const [toggleHovered, setToggleHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ranzz-theme");
    if (saved) setDark(saved === "dark");
  }, []);
  
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("ranzz-theme", next ? "dark" : "light");
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
                }}>
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: dark ? "linear-gradient(135deg,#0f0f2a,#1a0a2a)" : "linear-gradient(135deg,#dde8ff,#eedeff)",
                    border: `2px solid ${dark ? "rgba(0,245,255,0.1)" : "rgba(191,0,255,0.15)"}`,
                  }}>
                    <UserIcon />
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
            
            <SpotifyWidget dark={dark} />
            
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
                <LinkButton key={link.id} link={link} delay={400 + i * 80} dark={dark} />
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
      </div>
    </>
  );
}
