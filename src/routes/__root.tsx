import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "jiya"; text: string };

export default function Index() {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "jiya", text: "Jai Shree Ram 🌷 Welcome Jashbeer Sir! Mai JIYA V7 MULTIVERSE hu, 1 Mic ON hai - bolo kya kholna hai? 💖" }]);
  const [input, setInput] = useState("");
  const [isOn, setIsOn] = useState(false);
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic OFF - Neeche Pink Button Dabao 🎀");
  const [shop, setShop] = useState(false);
  const [god, setGod] = useState(false);
  const recRef = useRef<any>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    localStorage.setItem("owner_name", "Jashbeer");
    localStorage.setItem("owner_mummy", "Anty");
    localStorage.setItem("jiya_orders", localStorage.getItem("jiya_orders") || "[]");
    localStorage.setItem("jiya_memory", localStorage.getItem("jiya_memory") || "[]");
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // REAL GIRL VOICE ONLY FREE
  const speak = (text: string) => {
    const clean = text.slice(0, 200);
    setStatus(clean.slice(0, 35) + "...");
    try { speechSynthesis.cancel(); } catch {}
    const audio = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`);
    audio.onended = () => setStatus(isOn? "Mic ON 🎀 Sun rahi hu..." : "Mic OFF");
    audio.onerror = () => {
      const u = new SpeechSynthesisUtterance(clean);
      const vs = speechSynthesis.getVoices();
      let girl = vs.find(v => v.lang === "hi-IN") || vs.find(v => v.name.includes("Google हिन्दी")) || vs.find(v => v.name.includes("Zira") || v.name.includes("Samantha")) || vs[0];
      if (girl) u.voice = girl;
      u.pitch = 1.2; u.rate = 0.92; u.volume = 1; u.lang = "hi-IN";
      u.onend = () => setStatus(isOn? "Mic ON 🎀 Sun rahi hu..." : "Mic OFF");
      speechSynthesis.speak(u);
    };
    audio.play().catch(() => audio.onerror(new Event("e")));
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank");
  };

  // DIRECT OPEN + MEMORY + BRAIN
  const doAction = async (raw: string) => {
    const t = raw.toLowerCase();
    const say = (s: string) => { setMsgs(m => [...m, { role: "jiya", text: s }]); speak(s); };
    const has = (...a: string[]) => a.some(w => t.includes(w));

    if (has("mic band", "माइक बंद")) { setIsOn(false); try { recRef.current?.stop(); } catch {} say("Mic band kar diya sir 🔇"); return true; }

    if (has("तुम्हारा नाम", "tumhara naam", "tera naam", "your name")) { say("Mera naam JIYA hai Jashbeer sir, aapki JIYA 💖 Jo hamesha yaad rakhti hai!"); return true; }
    if (has("मेरा नाम", "mera naam")) { say(`Aapka naam ${localStorage.getItem("owner_name")} hai Jashbeer sir, mai kaise bhul sakti hu 💖 Mummy Anty ji hai!`); return true; }

    if (has("यूट", "युट", "ट्यूब", "टूब", "youtube", "yt")) { openUrl("https://m.youtube.com"); say("YouTube khol diya Jashbeer sir 🚀"); return true; }
    if (has("गूगल", "google")) { openUrl("https://google.com"); say("Google khol diya sir"); return true; }
    if (has("इंस्टा", "instagram", "insta")) { openUrl("https://instagram.com"); say("Instagram khol diya sir 💖"); return true; }
    if (has("व्हाट्स", "whatsapp", "whats app")) { openUrl("https://wa.me"); say("WhatsApp khol diya sir"); return true; }
    if (has("साड़ी", "saree", "sari", "sharee")) { setShop(true); say("Namaste Anty ji 🙏 Saree collection khol diya! Red Banarasi 1999, Blue Georgette 1499 - Konsi chahiye? Add to cart bolo 💖"); return true; }
    if (has("कैमरा", "camera")) { try { const s = await navigator.mediaDevices.getUserMedia({ video: true }); if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.style.display = "block"; } say("Camera khol diya sir 📸"); } catch { say("Camera permission do sir"); } return true; }
    if (has("गैलरी", "gallery", "photo dikhao")) { (document.getElementById("pick") as any)?.click(); say("Gallery khol diya sir"); return true; }
    if (has("टॉर्च", "torch", "लाइट जला", "flash")) { say("Torch jala diya sir 🔦"); try { const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } as any }); const tr = st.getVideoTracks()[0]; await (tr as any).applyConstraints({ advanced: [{ torch: true }] }); } catch {} return true; }
    if (has("बैटरी", "battery")) { try { const b: any = await (navigator as any).getBattery(); say(`Battery ${Math.round(b.level * 100)}% hai sir 🔋`); } catch { say("Battery 80% hai sir 💖"); } return true; }
    if (has("वाइब्रेट", "vibrate")) { navigator.vibrate(500); say("Vibrate kar diya sir"); return true; }
    if (has("लोकेशन", "location", "कहाँ")) { navigator.geolocation.getCurrentPosition(() => say("Aap yahi ho sir mere paas 💖"), () => say("Location on karo sir")); return true; }
    if (has("पोस्टर", "poster bana")) { const c = canvasRef.current!; const ctx = c.getContext("2d")!; c.width = 1080; c.height = 1350; ctx.fillStyle = "#ff69b4"; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = "white"; ctx.font = "bold 70px sans-serif"; ctx.fillText("JIYA SAREE", 40, 120); ctx.font = "40px sans-serif"; ctx.fillText("Owner Jashbeer - 50% OFF", 40, 200); ctx.fillText("COD Available", 40, 260); const url = c.toDataURL(); const a = document.createElement("a"); a.href = url; a.download = "jiya-poster.png"; a.click(); say("Poster bana diya sir, download ho gaya 💖"); return true; }
    if (has("डैशबोर्ड", "dashboard", "god mode", "सब कुछ कर")) { setGod(true); const ord = JSON.parse(localStorage.getItem("jiya_orders") || "[]").length; say(`God Dashboard khola sir! Aaj ${ord} orders hai, mai hamesha yaad rakhti hu aapko, battery mast hai 💖`); return true; }
    if (has("समय", "time", "टाइम", "बज रहा")) { say(`Time ${new Date().toLocaleTimeString("hi-IN")} hai sir ⏰`); return true; }
    if (has("मौसम", "weather", "mausam")) { try { const r = await fetch("https://wttr.in/Kendrapara?format=j1"); const d = await r.json(); const temp = d.current_condition[0].temp_C; say(`Mausam ${temp} degree hai sir, kal Red Banarasi 80% bikegi 💖`); } catch { say("Mausam acha hai sir, Georgette trend me hai"); } return true; }
    if (has("बैक", "back", "पीछे", "piche")) { history.back(); say("Piche aa gayi sir"); return true; }

    if (has("play", "बजाओ", "चलाओ", "गाना")) { let q = t.replace(/play|बजाओ|चलाओ|गाना/g, "").trim() || "arijit singh"; openUrl(`https://m.youtube.com/results?search_query=${encodeURIComponent(q)}`); say(`${q} chala rahi hu sir 🎵`); return true; }
    if (has("search", "सर्च", "ढूंढो")) { let q = t.replace(/search|सर्च|ढूंढो|करो/g, "").trim() || t; openUrl(`https://www.google.com/search?q=${encodeURIComponent(q)}`); say(`${q} search kar diya sir`); return true; }

    return false;
  };

  const handle = async (txt: string) => {
    if (!txt.trim()) return;
    setMsgs(m => [...m, { role: "user", text: txt }]);
    const mem = JSON.parse(localStorage.getItem("jiya_memory") || "[]"); mem.push({ text: txt, time: Date.now() }); localStorage.setItem("jiya_memory", JSON.stringify(mem.slice(-80)));
    setInput(""); setHearing("");
    const done = await doAction(txt);
    if (!done) { const r = `Haan sir bolo na Jashbeer sir, mai yahi hu sun rahi hu 💖 Bolo YouTube kholo, Saree dikhao, Camera kholo?`; setMsgs(m => [...m, { role: "jiya", text: r }]); speak(r); }
  };

  const startMic = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Chrome me kholo sir"); return; }
    const rec = new SR(); rec.lang = "hi-IN"; rec.continuous = true; rec.interimResults = true;
    rec.onstart = () => { setIsOn(true); setStatus("Mic ON 🎀 - Bolo YouTube Kholo"); };
    rec.onresult = (e: any) => { let f = ""; let inter = ""; for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) f += e.results[i][0].transcript + " "; else inter += e.results[i][0].transcript; } if (inter) setHearing(inter); if (f.trim()) handle(f.trim()); };
    rec.onend = () => { if (isOn) try { rec.start(); } catch {} };
    rec.onerror = () => { if (isOn) setTimeout(() => { try { rec.start(); } catch {} }, 800); };
    recRef.current = rec; try { rec.start(); } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#07070b", color: "white", display: "flex", flexDirection: "column", fontFamily: "system-ui" }}>
      <div style={{ padding: "10px", background: "#11111a", textAlign: "center", fontSize: "12px", position: "sticky", top: 0, zIndex: 20, borderBottom: "1px solid #222" }}>
        <b>Jai Shree Ram 🌷 JIYA V7 MULTIVERSE - Jashbeer Sir - {isOn? "MIC ON 🔴" : "MIC OFF"}</b>
        <div style={{ color: "#ff69b4", fontWeight: 800, marginTop: "4px" }}>{status}</div>
        {hearing && <div style={{ color: "#a78bfa", marginTop: "4px" }}>You said: {hearing}</div>}
      </div>

      {shop && (
        <div style={{ padding: "10px", background: "#1a1a22", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ background: "#222", borderRadius: "12px", padding: "8px" }}>
            <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
            <div style={{ fontSize: "12px", marginTop: "6px" }}>Red Banarasi ₹1999</div>
            <button onClick={() => { const o = JSON.parse(localStorage.getItem("jiya_orders") || "[]"); o.push({ name: "Red Banarasi" }); localStorage.setItem("jiya_orders", JSON.stringify(o)); alert("Order COD Done 💖"); }} style={{ marginTop: "6px", width: "100%", background: "#ff69b4", border: "none", borderRadius: "8px", padding: "6px", color: "white" }}>Order COD</button>
          </div>
          <div style={{ background: "#222", borderRadius: "12px", padding: "8px" }}>
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "8px" }} />
            <div style={{ fontSize: "12px", marginTop: "6px" }}>Blue Georgette ₹1499</div>
            <button onClick={() => { const o = JSON.parse(localStorage.getItem("jiya_orders") || "[]"); o.push({ name: "Blue" }); localStorage.setItem("jiya_orders", JSON.stringify(o)); alert("Order COD Done 💖"); }} style={{ marginTop: "6px", width: "100%", background: "#ff69b4", border: "none", borderRadius: "8px", padding: "6px", color: "white" }}>Order COD</button>
          </div>
          <button onClick={() => setShop(false)} style={{ gridColumn: "1/-1", background: "#333", border: "none", borderRadius: "8px", padding: "8px", color: "white" }}>Close Shop</button>
        </div>
      )}

      {god && (
        <div style={{ padding: "12px", background: "#1a1a22", fontSize: "13px" }}>
          <b>GOD MODE - Owner Jashbeer Only</b><br />
          Orders: {JSON.parse(localStorage.getItem("jiya_orders") || "[]").length} | Memory: {JSON.parse(localStorage.getItem("jiya_memory") || "[]").length}<br />
          Owner: Jashbeer | Mummy: Anty | Battery: 80% | Weather: wttr.in Free<br />
          <button onClick={() => setGod(false)} style={{ marginTop: "8px", background: "#333", border: "none", borderRadius: "8px", padding: "6px", color: "white" }}>Close God Mode</button>
        </div>
      )}

      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxHeight: "220px", display: "none" as any, background: "#000" }} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <input id="pick" type="file" accept="image/*" hidden />

      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1e1e28", padding: "10px 14px", borderRadius: "16px", maxWidth: "80%", fontSize: "14px" }}>{m.text}</div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "10px", display: "flex", gap: "8px", borderTop: "1px solid #222", position: "sticky", bottom: "80px", background: "#07070b" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handle(input)} placeholder="Bolo: YouTube kholo / Tumhara naam kya hai" style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: "20px", padding: "12px 14px", color: "white", outline: "none" }} />
        <button onClick={() => handle(input)} style={{ background: "#ff69b4", border: "none", borderRadius: "20px", padding: "0 18px", color: "white", fontWeight: 800 }}>Send</button>
      </div>

      {/* FLOATING MIC BUTTON - Pink Bottom Right */}
      <button
        onClick={() => { if (isOn) { setIsOn(false); try { recRef.current?.stop(); } catch {} setStatus("Mic OFF - Dabao ON karne ke liye"); } else { startMic(); } }}
        style={{
          position: "fixed", bottom: "20px", right: "20px", width: "62px", height: "62px",
          borderRadius: "50%", border: "none", background: isOn? "#ef4444" : "#ff69b4",
          color: "white", fontSize: "26px", boxShadow: "0 4px 15px rgba(255,105,180,0.6)",
          animation: isOn? "pulse 1s infinite" : "none", zIndex: 9999
        }}
      >
        {isOn? "🔴" : "🎀"}
      </button>
      <style>{`@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.12)}100%{transform:scale(1)}}`}</style>
    </div>
  );
      }
