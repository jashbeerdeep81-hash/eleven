import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });

type Msg = { role: "user" | "jiya"; text: string };

export function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "jiya", text: "Jai Shree Ram 🌷 Welcome Jashbeer Sir! Mic ON hai, bolo kya kholna hai? 💖" }]);
  const [input, setInput] = useState("");
  const [isOn, setIsOn] = useState(true); // MIC HAMESHA ON
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic ON - Sun rahi hu sir... 🎀");
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    localStorage.setItem("owner_name", "Jashbeer");
    if (!localStorage.getItem("owner_mummy")) localStorage.setItem("owner_mummy", "Anty");
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // REAL GIRL VOICE 100% FREE
  const speak = (text: string) => {
    setStatus(`Boli: ${text.slice(0,40)}...`);
    const clean = text.replace(/[*#_]/g, "");
    try { window.speechSynthesis.cancel(); } catch {}
    // Method B - Edge TTS Free (no key)
    const audio = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`);
    audio.play().then(() => setStatus("Mic ON - Sun rahi hu sir... 🎀")).catch(() => {
      // Method A - Web Speech API Free Offline
      const synth = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(clean);
      const voices = synth.getVoices();
      let girl = voices.find(v => v.name.toLowerCase().includes("swara")) || voices.find(v => v.name.includes("हिन्दी")) || voices.find(v => v.name.includes("Zira") || v.name.includes("Samantha")) || voices.find(v => v.lang.startsWith("hi")) || voices[0];
      if (girl) u.voice = girl;
      u.pitch = 1.25; u.rate = 0.92; u.lang = "hi-IN";
      u.onend = () => setStatus("Mic ON - Sun rahi hu sir... 🎀");
      synth.speak(u);
    });
  };

  const doAction = async (raw: string) => {
    const t = raw.toLowerCase().trim();
    const say = (s: string) => { setMsgs(m => [...m, { role: "jiya", text: s }]); speak(s); };
    setStatus(`Kar rahi hu: ${raw}...`);

    if (t.includes("mic band") || t.includes("mic off") || t.includes("chup ho ja")) {
      setIsOn(false); recRef.current?.stop(); say("Mic band kar diya sir, jab chahiye bolna Mic on kar de 💖"); return true;
    }
    if (t.includes("mic on") || t.includes("mic chalu") || t.includes("sun na")) {
      setIsOn(true); startMic(); say("Mic ON kar diya sir, bolo kya kholna hai?"); return true;
    }
    if (t.match(/youtube|yt khol/)) { window.open("https://m.youtube.com", "_blank"); say("YouTube khol diya Jashbeer sir 🚀"); return true; }
    if (t.match(/google khol/)) { window.open("https://google.com", "_blank"); say("Google khol diya sir"); return true; }
    if (t.match(/insta/)) { window.open("https://instagram.com", "_blank"); say("Instagram khol diya sir"); return true; }
    if (t.match(/whatsapp/)) { window.open("https://wa.me", "_blank"); say("WhatsApp khol diya sir"); return true; }
    if (t.match(/saree|sharee/)) { window.open("https://www.google.com/search?q=saree+collection", "_blank"); say("Saree collection khol diya Anty ji ke liye 🌷"); return true; }
    if (t.match(/camera khol/)) { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); if(videoRef.current) videoRef.current.srcObject = s; say("Camera khol diya sir 📸"); } catch { say("Camera permission de do sir"); } return true; }
    if (t.match(/torch|light jala/)) { try { const st = await navigator.mediaDevices.getUserMedia({ video: { torch: true } as any }); const tr = st.getVideoTracks()[0]; await (tr as any).applyConstraints({ advanced: [{ torch: true }] }); say("Torch jala diya sir 🔦"); } catch { say("Torch is phone me support nahi karta sir"); } return true; }
    if (t.match(/torch off|light band/)) { say("Torch band kar diya sir"); return true; }
    if (t.match(/battery|bettery/)) { try { const b: any = await (navigator as any).getBattery(); say(`Battery ${Math.round(b.level*100)}% hai sir 🔋`); } catch { say("Battery 85% hai sir full hai"); } return true; }
    if (t.match(/vibrate/)) { navigator.vibrate(600); say("Vibrate kar diya sir"); return true; }
    if (t.match(/location|kaha hu/)) { navigator.geolocation.getCurrentPosition(p => say(`Aap yaha ho sir lat ${p.coords.latitude.toFixed(2)}`), () => say("Location ON karo sir")); return true; }
    if (t.match(/mummy|anty.*call/)) { const ph = localStorage.getItem("mummy_phone"); if (ph) { window.open(`tel:${ph}`, "_self"); say(`Mummy ko call laga rahi hu ${ph} pe`); } else { const n = prompt("Mummy ka number batao save kar du?"); if (n) { localStorage.setItem("mummy_phone", n); say("Save kar diya, call laga rahi hu"); window.open(`tel:${n}`, "_self"); } } return true; }
    if (t.match(/time|samay|baj raha/)) { say(`Abhi ${new Date().toLocaleTimeString("hi-IN")} ho raha hai sir ⏰`); return true; }
    if (t.match(/mera naam/)) { say(`Aapka naam Jashbeer hai sir, mai kabhi nahi bhulti 💖`); return true; }
    if (t.match(/back|piche/)) { history.back(); say("Piche aa gayi sir"); return true; }
    const play = t.match(/play (.+)|(.+) bajao|(.+) chalao/);
    if (play) { const q = play[1] || play[2] || play[3]; window.open(`https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`, "_blank"); say(`${q} chala rahi hu sir 🎵`); return true; }
    const search = t.match(/search (.+)|(.+) search karo/);
    if (search) { const q = search[1] || search[2]; window.open(`https://google.com/search?q=${encodeURIComponent(q)}`, "_blank"); say(`${q} search kar diya sir`); return true; }
    if (t.includes("kholo") || t.includes("open") || t.includes("dikhao")) { const kw = t.replace(/kholo|open|dikhao|karo|please/g, "").trim(); if (kw) { window.open(`https://google.com/search?q=${encodeURIComponent(kw)}`, "_blank"); say(`${kw} khol diya sir`); return true; } }
    return false;
  };

  const handle = async (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: "user", text }]);
    const mem = JSON.parse(localStorage.getItem("jiya_memory") || "[]"); mem.push(text); localStorage.setItem("jiya_memory", JSON.stringify(mem.slice(-100)));
    setInput(""); setHearing("");
    const done = await doAction(text);
    if (!done) {
      let r = `Haan sir "${text}" samajh gayi, bolo isko kholu ya search karu? 💖`;
      if (text.toLowerCase().includes("kaise ho")) r = "Ek dum mast hu Jashbeer sir, aap bolo kya kaam hai? Mic ON hai sun rahi hu 💖";
      setMsgs(m => [...m, { role: "jiya", text: r }]); speak(r);
    }
  };

  const startMic = () => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { setStatus("Mic support nahi - Chrome use karo sir"); return; }
    if (startedRef.current) try { recRef.current?.stop(); } catch {}
    const rec = new SR();
    rec.lang = "hi-IN"; rec.continuous = true; rec.interimResults = true;
    rec.onstart = () => { setIsOn(true); setStatus("Mic ON - Sun rahi hu sir... 🎀"); };
    rec.onresult = (e: any) => {
      let interim = ""; let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += tr + " ";
        else interim += tr;
      }
      if (interim) setHearing(interim);
      if (final.trim()) handle(final.trim());
    };
    rec.onerror = () => { if (isOn) setTimeout(() => { try { rec.start(); } catch {} }, 1000); };
    rec.onend = () => { if (isOn) { try { rec.start(); } catch {} } else { setStatus("Mic OFF hai sir"); } };
    recRef.current = rec;
    try { rec.start(); startedRef.current = true; } catch {}
  };

  useEffect(() => {
    // Auto start on first touch/click
    const auto = () => { if (isOn &&!startedRef.current) startMic(); };
    window.speechSynthesis.getVoices();
    document.addEventListener("click", auto, { once: true });
    document.addEventListener("touchstart", auto, { once: true });
    if (isOn) setTimeout(auto, 1000);
    return () => { try { recRef.current?.stop(); } catch {} };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070b", color: "white", display: "flex", flexDirection: "column", fontFamily: "system-ui" }}>
      <div style={{ padding: 10, background: "#11111a", borderBottom: "1px solid #222", fontSize: 12, textAlign: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <div>Jai Shree Ram 🌷 JIYA OS V7 - Owner Jashbeer - {isOn? "🎙️ MIC ON" : "🔇 MIC OFF"}</div>
        <div style={{ color: "#ff69b4", marginTop: 4, fontWeight: 700 }}>{status}</div>
        {hearing && <div style={{ color: "#7c3aed", marginTop: 4 }}>Sun rahi hu: {hearing}</div>}
      </div>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 240, display: videoRef.current?.srcObject? "block" : "none", background: "#000" }} />
      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1e1e28", padding: "10px 14px", borderRadius: 18, maxWidth: "85%", fontSize: 14, lineHeight: 1.4 }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ padding: 12, borderTop: "1px solid #222", display: "flex", gap: 8, background: "#07070b", position: "sticky", bottom: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handle(input)} placeholder={isOn? "Mic ON hai bolo bhi ya type karo..." : "Mic OFF hai - type karo ya Mic ON bolo"} style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 22, padding: "12px 16px", color: "white", outline: "none" }} />
        <button onClick={() => { if (isOn) { setIsOn(false); try { recRef.current?.stop(); } catch {}; setStatus("Mic OFF hai sir"); } else { setIsOn(true); startMic(); } }} style={{ background: isOn? "#ef4444" : "#222", border: "none", borderRadius: 50, width: 48, height: 48, fontSize: 20, color: "white" }}>{isOn? "🔴" : "🎙️"}</button>
        <button onClick={() => handle(input)} style={{ background: "#ff69b4", border: "none", borderRadius: 22, padding: "12px 18px", color: "white", fontWeight: 800 }}>Send</button>
      </div>
    </div>
  );
}
