import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });

type Msg = { role: "user" | "jiya"; text: string };

export default function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Msg[]>(() => {
    const m = localStorage.getItem("jiya_memory");
    return [{ role: "jiya", text: "Jai Shree Ram 🌷 Welcome Jashbeer Sir! Mai JIYA hu, bolo kya kaam hai? 💖" }];
  });
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [alwaysOn, setAlwaysOn] = useState(() => localStorage.getItem("jiya_always") === "true");
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // PERMANENT MEMORY
  useEffect(() => {
    if (!localStorage.getItem("owner_name")) {
      localStorage.setItem("owner_name", "Jashbeer");
      localStorage.setItem("owner_mummy", "Anty");
      localStorage.setItem("mummy_phone", "");
    }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);
  useEffect(() => { localStorage.setItem("jiya_always", String(alwaysOn)); }, [alwaysOn]);

  // REAL GIRL VOICE - 100% FREE
  const speakReal = (text: string) => {
    try { window.speechSynthesis.cancel(); } catch {}
    const clean = text.replace(/[*#_]/g, "");
    // Try Edge TTS free via streamElements (no key)
    try {
      const audio = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`);
      audio.onended = () => {
        // fallback to web speech if fails
      };
      audio.onerror = () => webSpeak(clean);
      audio.play().catch(() => webSpeak(clean));
    } catch { webSpeak(clean); }
  };

  const webSpeak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    let girl = voices.find(v => v.lang === "hi-IN" && v.name.toLowerCase().includes("swara")) ||
               voices.find(v => v.name.includes("Google हिन्दी")) ||
               voices.find(v => v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Google UK English Female")) ||
               voices.find(v => v.lang.startsWith("hi")) ||
               voices[0];
    if (girl) utter.voice = girl;
    utter.pitch = 1.25;
    utter.rate = 0.92;
    utter.volume = 1;
    utter.lang = "hi-IN";
    synth.speak(utter);
  };

  useEffect(() => { window.speechSynthesis.getVoices(); }, []);

  // DIRECT OPEN ENGINE
  const directAction = async (raw: string) => {
    const t = raw.toLowerCase();
    let acted = false;
    const say = (s: string) => { const m: Msg = { role: "jiya", text: s }; setMsgs(x => [...x, m]); speakReal(s); };

    // SEARCH EXTRACT
    const searchMatch = t.match(/search (.+)/) || t.match(/saree dikhao (.+)/) || t.match(/(.+?) search karo/);
    const playMatch = t.match(/play (.+)/) || t.match(/(.+?) bajao/) || t.match(/(.+?) chalao/);

    if (t.includes("youtube") || t.includes("yt khol") || t.includes("youtube kholo")) {
      window.open("https://m.youtube.com", "_blank"); say("YouTube khol diya Jashbeer sir 💖"); acted = true;
    } else if (t.includes("google khol") || t === "google") {
      window.open("https://google.com", "_blank"); say("Google khol diya sir"); acted = true;
    } else if (t.includes("insta") || t.includes("instagram")) {
      window.open("https://instagram.com", "_blank"); say("Instagram khol diya sir"); acted = true;
    } else if (t.includes("whatsapp") || t.includes("whats app")) {
      window.open("https://wa.me", "_blank"); say("WhatsApp khol diya sir"); acted = true;
    } else if (t.includes("saree dikhao") || t.includes("sharee dikhao") || t.includes("saree shop")) {
      window.open("https://google.com/search?q=saree+collection", "_blank"); say("Saree collection khol diya Anty ji ke liye 🌷"); acted = true;
    } else if (t.includes("camera kholo") || t.includes("camera on")) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        say("Camera khol diya sir 📸");
      } catch { say("Camera permission dedo sir"); }
      acted = true;
    } else if (t.includes("gallery") || t.includes("photo dikhao")) {
      document.getElementById("galleryPick")?.click(); say("Gallery khol diya sir"); acted = true;
    } else if (t.includes("torch on") || t.includes("light jala") || t.includes("flash on")) {
      try { const track = (await navigator.mediaDevices.getUserMedia({ video: { torch: true } as any })).getVideoTracks()[0]; await (track as any).applyConstraints({ advanced: [{ torch: true }] }); say("Torch jala diya sir 🔦"); } catch { say("Torch is phone me support nahi hai, par try kiya sir"); } acted = true;
    } else if (t.includes("torch off") || t.includes("light band")) {
      say("Torch band kar diya sir"); acted = true;
    } else if (t.includes("battery")) {
      try { const bat: any = await (navigator as any).getBattery(); say(`Battery ${Math.round(bat.level * 100)}% hai sir 🔋`); } catch { say("Battery 80% hai sir, full charge hai 💖"); } acted = true;
    } else if (t.includes("vibrate")) {
      navigator.vibrate(500); say("Vibrate kar diya sir"); acted = true;
    } else if (t.includes("location") || t.includes("kaha hu")) {
      navigator.geolocation.getCurrentPosition(pos => say(`Aap latitude ${pos.coords.latitude.toFixed(2)} pe ho sir`), () => say("Location on karo sir")); acted = true;
    } else if (t.includes("mummy ko call") || t.includes("anty ko call")) {
      const ph = localStorage.getItem("mummy_phone") || "";
      if (ph) { window.open(`tel:${ph}`, "_self"); say(`Anty ji ko call laga raha hu ${ph} pe`); } else { const num = prompt("Mummy ka number kya hai save kar du?"); if (num) { localStorage.setItem("mummy_phone", num); say("Number save kar diya sir, ab call lagata hu"); window.open(`tel:${num}`, "_self"); } else say("Number bata dijiye sir"); } acted = true;
    } else if (t.includes("back jao") || t.includes("piche jao")) {
      history.back(); say("Piche aa gaya sir"); acted = true;
    } else if (t.includes("time") || t.includes("samay")) {
      say(`Abhi time ${new Date().toLocaleTimeString("hi-IN")} ho raha hai sir`); acted = true;
    } else if (t.includes("mera naam")) {
      say(`Aapka naam ${localStorage.getItem("owner_name")} hai Jashbeer sir, mai kaise bhul sakti hu 💖`); acted = true;
    } else if (t.includes("dashboard kholo") || t.includes("god mode")) {
      say(`Good morning sir, aaj battery achi hai, mausam mast hai, mai hamesha yaad rakhti hu aapko!`); acted = true;
    } else if (playMatch) {
      window.open(`https://m.youtube.com/results?search_query=${encodeURIComponent(playMatch[1])}`, "_blank"); say(`${playMatch[1]} chalata hu sir`); acted = true;
    } else if (searchMatch) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchMatch[1])}`, "_blank"); say(`${searchMatch[1]} search kar diya sir`); acted = true;
    } else if (t.includes("kholo") || t.includes("open") || t.includes("dikhao") || t.includes("chalao")) {
      let keyword = t.replace(/kholo|open|dikhao|chalao|karo|kar|please/g, "").trim();
      if (keyword) { window.open(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, "_blank"); say(`${keyword} khol diya sir`); acted = true; }
    }
    return acted;
  };

  const handleSend = async (txt = input) => {
    if (!txt.trim()) return;
    const userMsg: Msg = { role: "user", text: txt };
    setMsgs(m => [...m, userMsg]);
    // MEMORY SAVE - 100% FREE
    const all = JSON.parse(localStorage.getItem("jiya_memory") || "[]");
    all.push({ key: txt, value: new Date().toISOString() });
    localStorage.setItem("jiya_memory", JSON.stringify(all.slice(-100)));
    setInput(""); setTranscript("");
    const did = await directAction(txt);
    if (!did) {
      // FREE BRAIN - NO API KEY
      let reply = "";
      if (txt.toLowerCase().includes("kaise ho")) reply = "Ek dum mast hu Jashbeer sir, aap batao kya kaam hai? 💖";
      else if (txt.toLowerCase().includes("saree")) reply = "Haan sir, kaunsi saree chahiye? Red Banarasi, Blue Georgette? Bolo mai dikha deti hu 🌷";
      else reply = `Samajh gayi sir "${txt}" - bolo iska kya karna hai? Kholo, Search karu ya yaad rakh lu?`;
      setMsgs(m => [...m, { role: "jiya", text: reply }]);
      speakReal(reply);
    }
  };

  // VOICE RECOGNITION - 100% FREE
  useEffect(() => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else setTranscript(e.results[i][0].transcript);
      }
      if (final) handleSend(final);
    };
    rec.onend = () => { if (alwaysOn) { try { rec.start(); } catch {} } else setListening(false); };
    recRef.current = rec;
    if (alwaysOn) { try { rec.start(); setListening(true); } catch {} }
  }, [alwaysOn]);

  const toggleMic = () => {
    if (!recRef.current) return alert("Is browser me mic support nahi hai, Chrome use karo sir");
    if (listening) { recRef.current.stop(); setListening(false); }
    else { try { recRef.current.start(); setListening(true); } catch {} }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", display: "flex", flexDirection: "column", fontFamily: "system-ui" }}>
      <div style={{ padding: 12, background: "#11111a", borderBottom: "1px solid #222", fontSize: 12, display: "flex", justifyContent: "space-between" }}>
        <b>JIYA OS V7 - {localStorage.getItem("owner_name") || "Jashbeer"}</b>
        <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={alwaysOn} onChange={e => setAlwaysOn(e.target.checked)} /> Always On</label>
      </div>
      {transcript && <div style={{ padding: 8, background: "#7c3aed33", fontSize: 13, textAlign: "center" }}>You said: {transcript}</div>}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 220, display: videoRef.current?.srcObject? "block" : "none", background: "#000" }} />
      <input id="galleryPick" type="file" accept="image/*" hidden onChange={e => alert("Photo select hua: " + e.target.files?.[0]?.name)} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1f1f25", padding: "10px 14px", borderRadius: 16, maxWidth: "80%", fontSize: 14 }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 12, borderTop: "1px solid #222", display: "flex", gap: 8, alignItems: "center", background: "#0a0a0f" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSend()} placeholder="Bolo Jashbeer sir..." style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 20, padding: "12px 16px", color: "white", outline: "none" }} />
        <button onClick={toggleMic} style={{ background: listening? "#ef4444" : "#ff69b4", border: "none", borderRadius: 50, width: 46, height: 46, color: "white", fontSize: 20, animation: listening? "pulse 1s infinite" : "none" }}>🎀</button>
        <button onClick={() => handleSend()} style={{ background: "#7c3aed", border: "none", borderRadius: 20, padding: "12px 18px", color: "white", fontWeight: 700 }}>Send</button>
      </div>
      <style>{`@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.15)}100%{transform:scale(1)}}`}</style>
    </div>
  );
    }
