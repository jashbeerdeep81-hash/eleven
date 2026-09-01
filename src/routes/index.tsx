import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });
type Msg = { role: "user" | "jiya"; text: string };

export function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "jiya", text: "Jai Shree Ram 🌷 JIYA V7.1 Ready Jashbeer Sir! Bolo YouTube kholo! 💖" }]);
  const [input, setInput] = useState("");
  const [isOn, setIsOn] = useState(true);
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic ON 🎀 - Bolo yutub kholo");
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    localStorage.setItem("owner_name", "Jashbeer");
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const speak = (text: string) => {
    setStatus(`Boli: ${text.slice(0,30)}`);
    try { window.speechSynthesis.cancel(); } catch {}
    const clean = text;
    try {
      const a = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`);
      a.onended = () => setStatus("Mic ON 🎀 - Sun rahi hu");
      a.play().catch(() => webSpeak(clean));
    } catch { webSpeak(clean); }
  };
  const webSpeak = (t: string) => {
    const s = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(t);
    const vs = s.getVoices();
    let g = vs.find(v => v.name.includes("Swara")) || vs.find(v => v.lang.startsWith("hi")) || vs[0];
    if (g) u.voice = g;
    u.pitch = 1.3; u.rate = 0.9; u.lang = "hi-IN";
    u.onend = () => setStatus("Mic ON 🎀 - Sun rahi hu");
    s.speak(u);
  };

  const doAction = async (raw: string) => {
    const t = raw.toLowerCase();
    const say = (s: string) => { setMsgs(m => [...m, { role: "jiya", text: s }]); speak(s); };

    // HINDI + ENGLISH BOTH MAP
    const isYoutube = t.includes("youtube") || t.includes("yutub") || t.includes("यूटूब") || t.includes("यूट्यूब") || t.includes("युटूब") || t.includes("यूटब");
    const isGoogle = t.includes("google") || t.includes("गूगल");
    const isInsta = t.includes("insta") || t.includes("इंस्टा");
    const isWhatsapp = t.includes("whatsapp") || t.includes("व्हाट्सएप") || t.includes("वॉट्सऐप");
    const isCamera = t.includes("camera") || t.includes("कैमरा");
    const isTorch = t.includes("torch") || t.includes("टॉर्च") || t.includes("लाइट");
    const isOpen = t.includes("kholo") || t.includes("khol") || t.includes("open") || t.includes("ओपन") || t.includes("खोलो") || t.includes("खोल");

    if (t.includes("mic band") || t.includes("माइक बंद")) { setIsOn(false); try{recRef.current?.stop()}catch{}; say("Mic band kar diya sir"); return true; }
    if (t.includes("mic on") || t.includes("माइक चालू")) { setIsOn(true); startMic(); say("Mic ON kar diya sir bolo!"); return true; }

    if (isYoutube && isOpen || isYoutube) {
      window.open("https://m.youtube.com", "_blank");
      say("YouTube khol diya Jashbeer sir 🚀");
      return true;
    }
    if (isGoogle) { window.open("https://google.com", "_blank"); say("Google khol diya sir"); return true; }
    if (isInsta) { window.open("https://instagram.com", "_blank"); say("Instagram khol diya sir"); return true; }
    if (isWhatsapp) { window.open("https://wa.me", "_blank"); say("WhatsApp khol diya sir"); return true; }
    if (isCamera) { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); if(videoRef.current) videoRef.current.srcObject = s; say("Camera khol diya sir 📸"); } catch { say("Camera permission do sir"); } return true; }
    if (t.includes("battery") || t.includes("बैटरी")) { try { const b:any = await (navigator as any).getBattery(); say(`Battery ${Math.round(b.level*100)}% hai sir`); } catch { say("Battery 90% hai sir"); } return true; }
    if (t.includes("time") || t.includes("टाइम") || t.includes("समय")) { say(`Time ${new Date().toLocaleTimeString("hi-IN")} hai sir`); return true; }
    if (t.includes("play") || t.includes("बजाओ") || t.includes("चलाओ")) {
      let q = t.replace(/play|बजाओ|चलाओ|गाना|song/g, "").trim();
      if (!q) q = "arijit singh";
      window.open(`https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank");
      say(`${q} chala rahi hu sir 🎵`);
      return true;
    }
    if (t.includes("search") || t.includes("सर्च")) {
      let q = t.replace(/search|सर्च|करो/g, "").trim();
      window.open(`https://google.com/search?q=${encodeURIComponent(q)}`, "_blank");
      say(`${q} search kar diya sir`);
      return true;
    }
    return false;
  };

  const handle = async (txt: string) => {
    if (!txt.trim()) return;
    setMsgs(m => [...m, { role: "user", text: txt }]);
    setInput(""); setHearing("");
    const done = await doAction(txt);
    if (!done) {
      // fallback direct open for any keyword + kholo
      if (txt.toLowerCase().includes("खोल") || txt.toLowerCase().includes("open")) {
        await doAction(txt);
      } else {
        const r = `Haan sir, bolo na kya kholna hai? YouTube, Google?`;
        setMsgs(m => [...m, { role: "jiya", text: r }]);
        speak(r);
      }
    }
  };

  const startMic = () => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { setStatus("Chrome use karo sir mic ke liye"); return; }
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => { setIsOn(true); setStatus("Mic ON 🎀 - Bolo Yutub kholo"); };
    rec.onresult = (e: any) => {
      let final = ""; let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else inter += e.results[i][0].transcript;
      }
      if (inter) setHearing(inter);
      if (final.trim()) handle(final.trim());
    };
    rec.onend = () => { if (isOn) try { rec.start(); } catch {} };
    rec.onerror = () => { if (isOn) setTimeout(() => { try { rec.start(); } catch {} }, 800); };
    recRef.current = rec;
    try { rec.start(); } catch {}
  };

  useEffect(() => {
    const auto = () => startMic();
    document.addEventListener("click", auto, { once: true });
    document.addEventListener("touchstart", auto, { once: true });
    setTimeout(auto, 800);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070b", color: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 10, background: "#11111a", borderBottom: "1px solid #222", textAlign: "center", fontSize: 12 }}>
        <b>Jai Shree Ram 🌷 JIYA V7.1 - {isOn? "MIC ON 🔴" : "MIC OFF"}</b>
        <div style={{ color: "#ff69b4", fontWeight: 700, marginTop: 4 }}>{status}</div>
        {hearing && <div style={{ color: "#a78bfa", marginTop: 4 }}>Sun rahi: {hearing}</div>}
      </div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 220, display: videoRef.current?.srcObject? "block" : "none", background: "#000" }} />
      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1e1e28", padding: "10px 14px", borderRadius: 16, maxWidth: "80%" }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 10, display: "flex", gap: 8, borderTop: "1px solid #222" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handle(input)} placeholder="Hindi me bolo - यूट्यूब खोलो" style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 20, padding: "12px 14px", color: "white", outline: "none" }} />
        <button onClick={() => setIsOn(!isOn)} style={{ background: isOn? "#ef4444" : "#333", border: "none", borderRadius: 50, width: 44, height: 44, color: "white" }}>{isOn? "🔴" : "🎙️"}</button>
        <button onClick={() => handle(input)} style={{ background: "#ff69b4", border: "none", borderRadius: 20, padding: "0 18px", color: "white", fontWeight: 800 }}>Send</button>
      </div>
    </div>
  );
    }
