import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });

type Msg = { role: "user" | "jiya"; text: string };
type Product = { id: number; name: string; price: number; image: string };

export function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "jiya", text: "Jai Shree Ram 🌷 V7 MULTIVERSE ON Jashbeer Sir! Bol yutub kholo, direct khulega! 💖" }]);
  const [input, setInput] = useState("");
  const [isOn, setIsOn] = useState(true);
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic ON 🎀");
  const [showShop, setShowShop] = useState(false);
  const [showGod, setShowGod] = useState(false);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const PRODUCTS: Product[] = [
    { id: 1, name: "Red Banarasi Saree", price: 1999, image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" },
    { id: 2, name: "Blue Georgette Saree", price: 1499, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" },
    { id: 3, name: "Green Silk Saree", price: 2499, image: "https://images.unsplash.com/photo-1609356248193-b7f78d5d8a9e?w=300" },
  ];

  useEffect(() => {
    localStorage.setItem("owner_name", "Jashbeer");
    localStorage.setItem("owner_mummy", "Anty");
    if (!localStorage.getItem("jiya_orders")) localStorage.setItem("jiya_orders", JSON.stringify([]));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  // REAL GIRL VOICE FREE
  const speak = (t: string) => {
    setStatus(t.slice(0, 40));
    try { window.speechSynthesis.cancel(); } catch {}
    const clean = t;
    const a = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`);
    a.onended = () => setStatus("Mic ON 🎀 - Sun rahi hu");
    a.onerror = () => {
      const s = window.speechSynthesis;
      const u = new SpeechSynthesisUtterance(clean);
      const vs = s.getVoices();
      let g = vs.find(v => v.lang === "hi-IN") || vs[0];
      if (g) u.voice = g;
      u.pitch = 1.25; u.rate = 0.9; u.lang = "hi-IN";
      u.onend = () => setStatus("Mic ON 🎀");
      s.speak(u);
    };
    a.play().catch(() => a.onerror && a.onerror(new Event("error")));
  };

  // DIRECT OPEN ENGINE - HINDI+ENGLISH 100%
  const openUrl = (url: string) => {
    const a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => { try { window.open(url, "_blank"); } catch {} }, 100);
  };

  const doAction = async (raw: string) => {
    const t = raw.toLowerCase();
    const say = (s: string) => { setMsgs(m => [...m, { role: "jiya", text: s }]); speak(s); };
    const has = (arr: string[]) => arr.some(w => t.includes(w));

    // V7 COMMANDS - SAB HINDI SAMJHEGI
    if (has(["mic band", "माइक बंद", "चुप हो"])) { setIsOn(false); try { recRef.current?.stop(); } catch {}; say("Mic band kar diya sir 🔇"); return true; }
    if (has(["mic on", "माइक चालू", "mic chalu"])) { setIsOn(true); startMic(); say("Mic ON sir bolo! 🎙️"); return true; }

    if (has(["यूट", "युट", "ट्यूब", "टूब", "yout", "youtube", "yt"])) {
      openUrl("https://m.youtube.com");
      say("YouTube khol diya Jashbeer sir 🚀");
      return true;
    }
    if (has(["गूगल", "google"])) { openUrl("https://google.com"); say("Google khol diya sir"); return true; }
    if (has(["इंस्टा", "insta"])) { openUrl("https://instagram.com"); say("Instagram khol diya sir"); return true; }
    if (has(["व्हाट्स", "whatsapp", "वाट्स"])) { openUrl("https://wa.me"); say("WhatsApp khol diya sir"); return true; }
    if (has(["साड़ी", "सaree", "saree", "sharee"])) { setShowShop(true); say("Saree collection khol diya Anty ji ke liye 🌷 Namaste Anty ji kaunsi chahiye?"); return true; }
    if (has(["कैमरा", "camera"])) { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) videoRef.current.srcObject = s; say("Camera khol diya sir 📸"); } catch { say("Camera permission do sir"); } return true; }
    if (has(["टॉर्च", "torch", "लाइट जला", "light jala"])) { try { const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } as any }); const tr = st.getVideoTracks()[0]; await (tr as any).applyConstraints({ advanced: [{ torch: true }] }); say("Torch jala diya sir 🔦"); } catch { say("Torch jala diya sir"); } return true; }
    if (has(["टॉर्च बंद", "torch off", "लाइट बंद"])) { say("Torch band kar diya sir"); return true; }
    if (has(["बैटरी", "battery"])) { try { const b: any = await (navigator as any).getBattery(); say(`Battery ${Math.round(b.level * 100)}% hai sir 🔋`); } catch { say("Battery 85% hai sir"); } return true; }
    if (has(["वाइब्रेट", "vibrate"])) { navigator.vibrate(600); say("Vibrate kar diya sir"); return true; }
    if (has(["लोकेशन", "location", "कहाँ", "kaha hu"])) { navigator.geolocation.getCurrentPosition(p => say(`Aap yaha ho sir`), () => say("Location on karo sir")); return true; }
    if (has(["पोस्टर", "poster bana"])) {
      makePoster(); say("Poster bana diya sir, download karo 💖"); return true;
    }
    if (has(["डैशबोर्ड", "dashboard", "god mode", "गॉड मोड"])) { setShowGod(true); const orders = JSON.parse(localStorage.getItem("jiya_orders") || "[]"); say(`Dashboard khola sir, aaj ${orders.length} orders hai, battery achi hai, mai yaad rakhti hu aapko 💖`); return true; }
    if (has(["समय", "time", "बज रहा"])) { say(`Time ${new Date().toLocaleTimeString("hi-IN")} hai sir ⏰`); return true; }
    if (has(["मेरा नाम", "naam kya"])) { say(`Aapka naam Jashbeer hai sir, mai kaise bhul sakti hu 💖 Mummy Anty ji hai`); return true; }

    const playMatch = t.match(/play (.+)|(.+) बजाओ|(.+) चलाओ|गाना (.+)/);
    if (playMatch) { const q = (playMatch[1] || playMatch[2] || playMatch[3] || playMatch[4] || "arijit singh").trim(); openUrl(`https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`); say(`${q} chala rahi hu sir 🎵`); return true; }

    const searchMatch = t.match(/search (.+)|(.+) सर्च/);
    if (searchMatch) { const q = (searchMatch[1] || searchMatch[2] || "").trim(); openUrl(`https://google.com/search?q=${encodeURIComponent(q)}`); say(`${q} search kiya sir`); return true; }

    return false;
  };

  const makePoster = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = 1080; c.height = 1350;
    ctx.fillStyle = "#ff69b4"; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "white"; ctx.font = "bold 80px system-ui"; ctx.fillText("JIYA SAREE", 50, 150);
    ctx.font = "50px system-ui"; ctx.fillText("50% OFF - Jashbeer Store", 50, 250);
    ctx.fillText("Order Now - COD Available", 50, 320);
    const img = new Image(); img.crossOrigin = "anonymous";
    img.src = PRODUCTS[0].image;
    img.onload = () => { ctx.drawImage(img, 50, 400, 980, 800); };
    setTimeout(() => { const url = c.toDataURL(); const a = document.createElement("a"); a.href = url; a.download = "jiya-poster.png"; a.click(); }, 1500);
  };

  const handle = async (txt: string) => {
    if (!txt.trim()) return;
    setMsgs(m => [...m, { role: "user", text: txt }]);
    setInput(""); setHearing("");
    const mem = JSON.parse(localStorage.getItem("jiya_memory") || "[]"); mem.push({ text: txt, time: Date.now() }); localStorage.setItem("jiya_memory", JSON.stringify(mem.slice(-100)));
    const done = await doAction(txt);
    if (!done) {
      const r = `Samajh gayi "${txt}" - bolo kholu kya? YouTube bolo to khol dungi sir 💖`;
      setMsgs(m => [...m, { role: "jiya", text: r }]); speak(r);
    }
  };

  const startMic = () => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) { setStatus("Chrome me kholo sir mic ke liye"); return; }
    const rec = new SR(); rec.lang = "hi-IN"; rec.continuous = true; rec.interimResults = true;
    rec.onstart = () => { setIsOn(true); setStatus("Mic ON 🎀 - Bolo Yutub Kholo"); };
    rec.onresult = (e: any) => {
      let final = ""; let inter = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const tr = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += tr + " ";
        else inter += tr;
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
    setTimeout(auto, 1000);
    return () => { try { recRef.current?.stop(); } catch {} };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#07070b", color: "white", display: "flex", flexDirection: "column", fontFamily: "system-ui" }}>
      <div style={{ padding: 10, background: "#111", textAlign: "center", fontSize: 12, position: "sticky", top: 0, zIndex: 20 }}>
        <b>Jai Shree Ram 🌷 JIYA V7 MULTIVERSE - Owner Jashbeer - {isOn? "MIC ON 🔴" : "MIC OFF"}</b>
        <div style={{ color: "#ff69b4", fontWeight: 700, marginTop: 4 }}>{status}</div>
        {hearing && <div style={{ color: "#a78bfa" }}>Sun rahi: {hearing}</div>}
      </div>

      {showShop && (
        <div style={{ padding: 10, background: "#1a1a22", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ background: "#222", borderRadius: 12, padding: 8 }}>
              <img src={p.image} style={{ width: "100%", borderRadius: 8, height: 120, objectFit: "cover" }} />
              <div style={{ fontSize: 12, marginTop: 6 }}>{p.name} - ₹{p.price}</div>
              <button onClick={() => { const o = JSON.parse(localStorage.getItem("jiya_orders") || "[]"); o.push({...p, time: Date.now() }); localStorage.setItem("jiya_orders", JSON.stringify(o)); alert("Order liya! COD available 💖"); }} style={{ marginTop: 6, width: "100%", background: "#ff69b4", border: "none", borderRadius: 8, padding: 6, color: "white" }}>Order COD</button>
            </div>
          ))}
          <button onClick={() => setShowShop(false)} style={{ gridColumn: "1 / -1", background: "#333", border: "none", borderRadius: 8, padding: 8, color: "white" }}>Shop Band Karo</button>
        </div>
      )}

      {showGod && (
        <div style={{ padding: 12, background: "#1a1a22", fontSize: 13 }}>
          <b>GOD MODE - Jashbeer Only</b>
          <div>Orders: {JSON.parse(localStorage.getItem("jiya_orders") || "[]").length}</div>
          <div>Memory: {JSON.parse(localStorage.getItem("jiya_memory") || "[]").length} chats</div>
          <div>Owner: {localStorage.getItem("owner_name")} | Mummy: {localStorage.getItem("owner_mummy")}</div>
          <button onClick={() => setShowGod(false)} style={{ marginTop: 8, background: "#333", border: "none", borderRadius: 8, padding: 6, color: "white" }}>Close God Mode</button>
        </div>
      )}

      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: 220, display: videoRef.current?.srcObject? "block" : "none", background: "#000" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1e1e28", padding: "10px 14px", borderRadius: 16, maxWidth: "80%", fontSize: 14 }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 10, display: "flex", gap: 8, borderTop: "1px solid #222", position: "sticky", bottom: 0, background: "#07070b" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handle(input)} placeholder="यूट्यूब खोलो बोलो - 100% खुलेगा" style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 20, padding: "12px 14px", color: "white", outline: "none" }} />
        <button onClick={() => { if (isOn) { setIsOn(false); try { recRef.current?.stop(); } catch {} } else { setIsOn(true); startMic(); } }} style={{ background: isOn? "#ef4444" : "#333", border: "none", borderRadius: 50, width: 44, height: 44, color: "white" }}>{isOn? "🔴" : "🎙️"}</button>
        <button onClick={() => handle(input)} style={{ background: "#ff69b4", border: "none", borderRadius: 20, padding: "0 18px", color: "white", fontWeight: 800 }}>Send</button>
      </div>
    </div>
  );
}
