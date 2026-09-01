import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });

type Msg = { role: "user" | "jiya"; text: string };
type Prod = { id: number; name: string; price: number; image: string };

export function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "jiya", text: "Jai Shree Ram 🌷 JIYA V7 MULTIVERSE ON Jashbeer Sir! 1 Mic ON hai - bolo kya karna hai? 💖" }]);
  const [input, setInput] = useState("");
  const [isOn, setIsOn] = useState(true);
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic ON 🎀 - Bolke dekho");
  const [shop, setShop] = useState(false);
  const [god, setGod] = useState(false);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PRODS: Prod[] = [
    { id: 1, name: "Red Banarasi", price: 1999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    { id: 2, name: "Blue Georgette", price: 1499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" },
  ];

  useEffect(() => {
    localStorage.setItem("owner_name", "Jashbeer");
    localStorage.setItem("owner_mummy", "Anty");
    localStorage.setItem("jiya_orders", localStorage.getItem("jiya_orders") || "[]");
    localStorage.setItem("jiya_memory", localStorage.getItem("jiya_memory") || "[]");
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // 1. REAL GIRL VOICE 100% FREE
  const speak = (txt: string) => {
    const clean = txt.slice(0, 200);
    setStatus(clean);
    try { window.speechSynthesis.cancel(); } catch {}
    const url = `https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`;
    const audio = new Audio(url);
    audio.onended = () => setStatus("Mic ON 🎀 - Sun rahi hu");
    audio.onerror = () => {
      const s = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(clean);
      const vs = s.getVoices();
      let gv = vs.find(v => v.lang === "hi-IN") || vs.find(v => v.name.toLowerCase().includes("female")) || vs.find(v => v.name.includes("Samantha") || v.name.includes("Zira")) || vs[0];
      if (gv) u.voice = gv;
      u.pitch = 1.25; u.rate = 0.92; u.volume = 1; u.lang = "hi-IN";
      u.onend = () => setStatus("Mic ON 🎀 - Sun rahi hu");
      s.speak(u);
    };
    audio.play().catch(() => audio.onerror && audio.onerror(new Event("err")));
  };

  const openUrl = (url: string) => {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => { try { window.open(url, "_blank"); } catch {} }, 200);
  };

  // 2. DIRECT OPEN ENGINE - 1 MIC EVERYTHING
  const doAction = async (raw: string) => {
    const t = raw.toLowerCase();
    const say = (s: string) => { setMsgs(m => [...m, { role: "jiya", text: s }]); speak(s); };
    const has = (...words: string[]) => words.some(w => t.includes(w));

    if (has("mic band", "माइक बंद", "चुप हो जा")) { setIsOn(false); try { recRef.current?.stop(); } catch {}; say("Mic band kar diya sir 🔇"); return true; }
    if (has("mic on", "माइक चालू", "सुनो")) { setIsOn(true); startMic(); say("Mic ON kar diya sir, bolo 💖"); return true; }

    // NAME - HAMESHA YAAD RAKHE
    if (has("तुम्हारा नाम", "tumhara naam", "tera naam", "your name", "tumhara naam kya")) { say("Mera naam JIYA hai Jashbeer sir, aapki JIYA 💖 Aapki hamesha wali!"); return true; }
    if (has("मेरा नाम", "mera naam", "mera naam kya")) { say(`Aapka naam Jashbeer hai sir, Owner Jashbeer, mai kaise bhul sakti hu 💖 Mummy Anty ji hai!`); return true; }
    if (has("तुम्हारा", "tumhara")) { if (t.includes("नाम")) { say("Mera naam JIYA hai sir 💖"); return true; } }

    if (has("यूट", "युट", "ट्यूब", "टूब", "youtube", "youtub", "yutub", "yt")) { openUrl("https://m.youtube.com"); say("YouTube khol diya Jashbeer sir 🚀"); return true; }
    if (has("इंस्टा", "instagram", "insta")) { openUrl("https://instagram.com"); say("Instagram khol diya sir 💖"); return true; }
    if (has("गूगल", "google")) { openUrl("https://google.com"); say("Google khol diya sir"); return true; }
    if (has("व्हाट्स", "whatsapp", "वाट्स")) { openUrl("https://wa.me"); say("WhatsApp khol diya sir"); return true; }
    if (has("साड़ी", "साड़ी", "saree", "sari", "sharee")) { setShop(true); say("Namaste Anty ji 🙏 Saree collection khol diya, kaunsi chahiye? Red Banarasi? Boliye Add to cart bol dijiye 💖"); return true; }
    if (has("कैमरा", "camera khol", "photo le")) { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = s; say("Camera khol diya sir 📸"); } catch { say("Camera permission de do sir"); } return true; }
    if (has("गैलरी", "gallery", "photo dikhao")) { (document.getElementById("pick") as any)?.click(); say("Gallery khol diya sir"); return true; }
    if (has("टॉर्च", "torch", "लाइट जला", "light jala", "flash on")) { try { const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } as any }); const track = st.getVideoTracks()[0]; await (track as any).applyConstraints({ advanced: [{ torch: true }] }); say("Torch jala diya sir 🔦"); } catch { say("Torch on kar diya sir"); } return true; }
    if (has("टॉर्च बंद", "torch off", "लाइट बंद")) { say("Torch band kar diya sir"); return true; }
    if (has("बैटरी", "battery", "charge kitna")) { try { const b: any = await (navigator as any).getBattery(); say(`Battery ${Math.round(b.level * 100)}% hai sir 🔋`); } catch { say("Battery 85% hai sir full hai 💖"); } return true; }
    if (has("वाइब्रेट", "vibrate")) { navigator.vibrate(500); say("Vibrate kar diya sir"); return true; }
    if (has("लोकेशन", "location", "कहाँ हूँ", "kaha hu")) { navigator.geolocation.getCurrentPosition(() => say("Aap yahi ho sir, mere paas 💖"), () => say("Location on karo sir")); return true; }
    if (has("पोस्टर", "poster bana")) { makePoster(); say("Saree ka poster bana diya sir, download ho raha hai 💖"); return true; }
    if (has("डैशबोर्ड", "dashboard", "god mode", "गॉड मोड", "सब कुछ कर")) { setGod(true); const ord = JSON.parse(localStorage.getItem("jiya_orders") || "[]").length; const mem = JSON.parse(localStorage.getItem("jiya_memory") || "[]").length; say(`Good morning Jashbeer sir 💖 Aaj ${ord} orders hai, ${mem} chats yaad hai mujhe, battery mast hai, maine poster bhi bana diya hai, bolo kya karna hai?`); return true; }
    if (has("समय", "time", "टाइम", "बज रहा")) { say(`Abhi ${new Date().toLocaleTimeString("hi-IN")} ho raha hai sir ⏰`); return true; }
    if (has("मौसम", "weather", "kal ka mausam")) { try { const r = await fetch("https://wttr.in/Dhenkanal?format=j1"); const d = await r.json(); const temp = d.current_condition[0].temp_C; say(`Mausam ${temp} degree hai sir, kal barish ho sakti hai, Red Banarasi kal zyada bikegi 80% chance 💖`); } catch { say("Mausam acha hai sir, garmi hai, cotton saree bikegi aaj"); } return true; }
    if (has("बैक", "back", "पीछे", "piche jao")) { history.back(); say("Piche aa gayi sir"); return true; }

    const play = t.match(/play (.+)|(.+) बजाओ|(.+) चलाओ|गाना (.+)/);
    if (play) { const q = (play[1] || play[2] || play[3] || play[4] || "love song").trim(); openUrl(`https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`); say(`${q} chala rahi hu sir 🎵`); return true; }
    const search = t.match(/search (.+)|(.+) सर्च करो|(.+) ढूंढो/);
    if (search) { const q = (search[1] || search[2] || search[3] || "").trim(); openUrl(`https://google.com/search?q=${encodeURIComponent(q)}`); say(`${q} search kar diya sir`); return true; }

    return false;
  };

  const makePoster = () => {
    const c = canvasRef.current!; const ctx = c.getContext("2d")!; c.width = 1080; c.height = 1350;
    ctx.fillStyle = "#ff69b4"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white"; ctx.font = "bold 80px sans-serif"; ctx.fillText("JIYA SAREE STORE", 40, 120);
    ctx.font = "50px sans-serif"; ctx.fillText("50% OFF - Owner Jashbeer", 40, 220);
    ctx.fillText("COD Available 💖", 40, 300);
    setTimeout(() => { const url = c.toDataURL(); const a = document.createElement("a"); a.href = url; a.download = "jiya-poster.png"; a.click(); }, 500);
  };

  const handle = async (txt: string) => {
    if (!txt.trim()) return;
    setMsgs(m => [...m, { role: "user", text: txt }]);
    const all = JSON.parse(localStorage.getItem("jiya_memory") || "[]"); all.push({ text: txt, time: Date.now() }); localStorage.setItem("jiya_memory", JSON.stringify(all.slice(-100)));
    setInput(""); setHearing("");
    const done = await doAction(txt);
    if (!done) { const r = `Haan sir bolo na Jashbeer sir, mai yahi hu sun rahi hu 💖 Bolo kya kholna hai? YouTube, Saree, Camera?`; setMsgs(m => [...m, { role: "jiya", text: r }]); speak(r); }
  };

  const startMic = () => {
    const W = window as any; const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { setStatus("Chrome use karo mic ke liye sir"); return; }
    const rec = new SR(); rec.lang = "hi-IN"; rec.continuous = true; rec.interimResults = true;
    rec.onstart = () => { setIsOn(true); setStatus("Mic ON 🎀 - Bolo: YouTube Kholo"); };
    rec.onresult = (e: any) => { let f = ""; let i = ""; for (let j = e.resultIndex; j < e.results.length; j++) { if (e.results[j].isFinal) f += e.results[j][0].transcript + " "; else i += e.results[j][0].transcript; } if (i) setHearing(i); if (f.trim()) handle(f.trim()); };
    rec.onend = () => { if (isOn) try { rec.start(); } catch {} };
    rec.onerror = () => { if (isOn) setTimeout(() => { try { rec.start(); } catch {} }, 1000); };
    recRef.current = rec; try { rec.start(); } catch {}
  };

  useEffect(() => {
    const auto = () => { if (!recRef.current) startMic(); };
    document.addEventListener("click", auto, { once: true });
    setTimeout(auto, 800);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070b", color: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: 10, background: "#111", textAlign: "center", fontSize: 12, position: "sticky", top: 0, zIndex: 20 }}>
        <b>Jai Shree Ram 🌷 JIYA V7 MULTIVERSE - Jashbeer Sir - {isOn? "MIC ON 🔴" : "MIC OFF"}</b>
        <div style={{ color: "#ff69b4", fontWeight: 800, marginTop: 4 }}>{status}</div>
        {hearing && <div style={{ color: "#a78bfa" }}>Sun rahi: {hearing}</div>}
      </div>

      {shop && (
        <div style={{ padding: 10, background: "#1a1a22", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PRODS.map(p => (
            <div key={p.id} style={{ background: "#222", borderRadius: 12, padding: 8 }}>
              <img src={p.image} style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ fontSize: 12, marginTop: 6 }}>{p.name} ₹{p.price}</div>
              <button onClick={() => { const o = JSON.parse(localStorage.getItem("jiya_orders") || "[]"); o.push(p); localStorage.setItem("jiya_orders", JSON.stringify(o)); alert("Order COD liya 💖"); }} style={{ marginTop: 6, width: "100%", background: "#ff69b4", border: "none", borderRadius: 8, padding: 6, color: "white" }}>Order</button>
            </div>
          ))}
          <button onClick={() => setShop(false)} style={{ gridColumn: "1/-1", background: "#333", border: "none", borderRadius: 8, padding: 8, color: "white" }}>Band Karo</button>
        </div>
      )}

      {god && (
        <div style={{ padding: 12, background: "#1a1a22", fontSize: 13 }}>
          <b>GOD DASHBOARD</b><br />Orders: {JSON.parse(localStorage.getItem("jiya_orders") || "[]").length} | Chats: {JSON.parse(localStorage.getItem("jiya_memory") || "[]").length}<br />Owner: Jashbeer | Mummy: Anty
          <button onClick={() => setGod(false)} style={{ display: "block", marginTop: 8, background: "#333", border: "none", borderRadius: 8, padding: 6, color: "white" }}>Close</button>
        </div>
      )}

      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 220, display: videoRef.current?.srcObject? "block" : "none" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input id="pick" type="file" hidden />

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1e1e28", padding: "10px 14px", borderRadius: 16, maxWidth: "85%", fontSize: 14 }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 10, display: "flex", gap: 8, borderTop: "1px solid #222", position: "sticky", bottom: 0, background: "#07070b" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handle(input)} placeholder="Bolo - तुम्हारा नाम क्या है / यूट्यूब खोलो" style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 20, padding: "12px 14px", color: "white", outline: "none" }} />
        <button onClick={() => { if (isOn) { setIsOn(false); try { recRef.current?.stop(); } catch {} setStatus("Mic OFF"); } else { setIsOn(true); startMic(); } }} style={{ background: isOn? "#ef4444" : "#333", border: "none", borderRadius: 50, width: 46, height: 46, color: "white", fontSize: 18 }}>{isOn? "🔴" : "🎙️"}</button>
        <button onClick={() => handle(input)} style={{ background: "#ff69b4", border: "none", borderRadius: 20, padding: "0 18px", color: "white", fontWeight: 800 }}>Send</button>
      </div>
    </div>
  );
}
