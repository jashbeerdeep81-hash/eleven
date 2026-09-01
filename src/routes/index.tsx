import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "jiya"; text: string };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult:
    | ((event: {
        results: {
          length: number;
          [index: number]: { isFinal: boolean; [index: number]: { transcript: string } };
        };
      }) => void)
    | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => Recognition;

function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: "jiya",
      text: "Jai Shree Ram 🌷 Welcome Jashbeer Sir! Main JIYA V7 Multiverse ready hu.",
    },
  ]);
  const [input, setInput] = useState("");
  const [alwaysOn, setAlwaysOn] = useState(false);
  const [battery, setBattery] = useState(19);
  const [weather, setWeather] = useState("Rourkela 26°C");
  const [showCam, setShowCam] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const alwaysRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);

  const speakReal = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const girl =
      voices.find((voice) => voice.name.includes("Google हिन्दी")) ||
      voices.find((voice) => voice.lang === "hi-IN") ||
      voices[0];
    if (girl) utter.voice = girl;
    utter.pitch = 1.25;
    utter.rate = 0.92;
    utter.lang = "hi-IN";
    window.speechSynthesis.speak(utter);
  };

  const addMsg = (role: Message["role"], text: string) =>
    setMsgs((current) => [...current, { role, text }]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);
  useEffect(() => {
    alwaysRef.current = alwaysOn;
  }, [alwaysOn]);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<{ level: number }> };
    nav
      .getBattery?.()
      .then((info) => setBattery(Math.round(info.level * 100)))
      .catch(() => undefined);
    fetch("https://wttr.in/Rourkela?format=%C+%t")
      .then((response) =>
        response.ok ? response.text() : Promise.reject(new Error("Weather unavailable")),
      )
      .then((text) => {
        const value = text.trim();
        if (value && value.length < 80 && !/[<>]|term-fg|doctyp[e]/i.test(value)) setWeather(value);
      })
      .catch(() => undefined);
    try {
      window.localStorage.setItem("owner_name", "Jashbeer");
    } catch {
      /* optional storage */
    }
    const timer = window.setTimeout(
      () => speakReal("Jai Shree Ram Jashbeer Sir, Jiya V7 ready hai, bolo kya kholna hai"),
      1200,
    );
    return () => {
      window.clearTimeout(timer);
      alwaysRef.current = false;
      recRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setShowCam(false);
  };

  const toggleTorch = async (on: boolean) => {
    try {
      if (!streamRef.current)
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
      const track = streamRef.current.getVideoTracks()[0];
      if (!track) throw new Error("No video track");
      await track.applyConstraints({ advanced: [{ torch: on } as MediaTrackConstraintSet] });
      setShowCam(true);
      window.setTimeout(() => {
        if (videoRef.current && streamRef.current) videoRef.current.srcObject = streamRef.current;
      }, 0);
      return true;
    } catch {
      alert("Torch support nahi hai is phone me");
      return false;
    }
  };

  const openCamera = async () => {
    try {
      closeCamera();
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      setShowCam(true);
      window.setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 0);
      return true;
    } catch {
      alert("Camera permission do");
      return false;
    }
  };

  const makePoster = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.fillStyle = "#ff5fcf";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.font = "bold 80px sans-serif";
    context.fillText("JIYA V7", 380, 900);
    const anchor = document.createElement("a");
    anchor.download = "poster.png";
    anchor.href = canvas.toDataURL();
    anchor.click();
  };

  const executeCommand = async (raw: string) => {
    const text = raw.toLowerCase();
    if (text.includes("youtube kholo") || text.includes("yt khol") || text.includes("youtube")) {
      window.open("https://m.youtube.com", "_blank", "noopener,noreferrer");
      addMsg("jiya", "YouTube khol diya Jashbeer");
      speakReal("YouTube khol diya");
      return true;
    }
    if (text.includes("google kholo")) {
      window.open("https://google.com", "_blank", "noopener,noreferrer");
      addMsg("jiya", "Google khol diya");
      speakReal("Google khol diya");
      return true;
    }
    if (text.includes("insta")) {
      window.open("https://instagram.com", "_blank", "noopener,noreferrer");
      addMsg("jiya", "Instagram khol diya");
      speakReal("Instagram khol diya");
      return true;
    }
    if (text.includes("saree dikhao")) {
      addMsg("jiya", "Saree collection 👗 Pink Red Banarasi ready hai, kaunsi dikhau?");
      speakReal("Saree collection khol diya");
      return true;
    }
    if (text.includes("camera khol") || text.includes("camera on")) {
      if (await openCamera()) {
        addMsg("jiya", "Camera khol diya 📸");
        speakReal("Camera khol diya");
      }
      return true;
    }
    if (text.includes("camera band")) {
      closeCamera();
      addMsg("jiya", "Camera band");
      return true;
    }
    if (text.includes("torch on") || text.includes("light jala")) {
      if (await toggleTorch(true)) {
        addMsg("jiya", "Torch jala diya 🔦");
        speakReal("Torch jala diya");
      }
      return true;
    }
    if (text.includes("torch off")) {
      await toggleTorch(false);
      addMsg("jiya", "Torch band");
      return true;
    }
    if (text.includes("poster bana")) {
      makePoster();
      addMsg("jiya", "Poster bana diya 🎨");
      speakReal("Poster bana diya");
      return true;
    }
    if (text.includes("battery kitni")) {
      addMsg("jiya", `Battery ${battery}% hai sir 🔋`);
      speakReal(`Battery ${battery} percent`);
      return true;
    }
    if (text.includes("mera naam")) {
      addMsg("jiya", "Aapka naam Jashbeer hai sir, mai kaise bhul sakti hu 💖");
      speakReal("Aapka naam Jashbeer hai");
      return true;
    }
    if (text.includes("kal kya")) {
      addMsg("jiya", `Kal ${weather} rahega, Red Banarasi sabse zyada bikegi 80% chance 💖`);
      speakReal("Kal ka bata diya");
      return true;
    }
    if (text.includes("search ")) {
      const query = raw.replace(/search/i, "").trim();
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer",
      );
      addMsg("jiya", `${query} search kar diya`);
      return true;
    }
    if (text.includes("play ")) {
      const query = raw.replace(/play/i, "").trim();
      window.open(
        `https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer",
      );
      addMsg("jiya", `${query} chala diya`);
      return true;
    }
    return false;
  };

  const startAlways = () => {
    const recognition =
      (
        window as Window & {
          SpeechRecognition?: RecognitionConstructor;
          webkitSpeechRecognition?: RecognitionConstructor;
        }
      ).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: RecognitionConstructor })
        .webkitSpeechRecognition;
    if (!recognition) {
      alert("Mic support nahi hai");
      return;
    }
    const rec = new recognition();
    rec.lang = "hi-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onend = () => {
      if (alwaysRef.current)
        window.setTimeout(() => {
          try {
            rec.start();
          } catch {
            /* recognition is restarting */
          }
        }, 250);
    };
    rec.onerror = () => {
      if (alwaysRef.current)
        window.setTimeout(() => {
          try {
            rec.start();
          } catch {
            /* recognition is restarting */
          }
        }, 500);
    };
    rec.onresult = async (event) => {
      const last = event.results[event.results.length - 1];
      if (!last?.isFinal) return;
      const text = last[0]?.transcript.trim();
      if (!text) return;
      addMsg("user", text);
      const handled = await executeCommand(text);
      if (!handled) {
        addMsg("jiya", `Samajh gayi: ${text} 💖`);
        speakReal(text);
      }
      setInput("");
    };
    recRef.current = rec;
    alwaysRef.current = true;
    setAlwaysOn(true);
    try {
      rec.start();
      addMsg("jiya", "ALWAYS ON active, bolo Jashbeer 🎤");
    } catch {
      setAlwaysOn(false);
      alwaysRef.current = false;
    }
  };

  const stopAlways = () => {
    alwaysRef.current = false;
    recRef.current?.stop();
    setAlwaysOn(false);
    addMsg("jiya", "Mic OFF kar diya");
  };
  const send = async () => {
    if (!input.trim()) return;
    const text = input;
    addMsg("user", text);
    setInput("");
    const handled = await executeCommand(text);
    if (!handled) {
      addMsg("jiya", `JIYA: ${text} Done ✨`);
      speakReal(text);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "system-ui",
        padding: 12,
      }}
    >
      <h1 style={{ textAlign: "center", color: "#ff5fcf", margin: "10px 0 0" }}>
        JIYA OS V7 MULTIVERSE ✨
      </h1>
      <p style={{ textAlign: "center", opacity: 0.6, fontSize: 12 }}>
        {weather} • Battery {battery}% • {alwaysOn ? "Active 🎀" : "Mic Off"}
      </p>
      {showCam && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            maxWidth: 600,
            margin: "12px auto",
            display: "block",
            borderRadius: 16,
            background: "#111",
          }}
        />
      )}
      <div
        style={{
          maxWidth: 600,
          margin: "16px auto",
          background: "#111",
          borderRadius: 16,
          padding: 12,
          height: "50vh",
          overflowY: "auto",
          border: "1px solid #222",
        }}
      >
        {msgs.map((message, index) => (
          <div
            key={index}
            style={{ textAlign: message.role === "user" ? "right" : "left", margin: "8px 0" }}
          >
            <span
              style={{
                background: message.role === "user" ? "#ff5fcf" : "#222",
                padding: "8px 14px",
                borderRadius: 14,
                display: "inline-block",
                maxWidth: "85%",
              }}
            >
              {message.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <button
          onClick={() => void executeCommand("saree dikhao")}
          style={{
            width: "100%",
            background: "#ff5fcf",
            color: "#fff",
            border: 0,
            borderRadius: 24,
            padding: 12,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          ⭐ JIYA, SAB KUCH KAR DE ⭐
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={alwaysOn ? stopAlways : startAlways}
            style={{
              background: alwaysOn ? "red" : "#ff5fcf",
              border: 0,
              borderRadius: 50,
              width: 48,
              height: 48,
              fontSize: 20,
            }}
          >
            {alwaysOn ? "🔴" : "🎤"}
          </button>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void send()}
            placeholder="Bolo ya type karo..."
            style={{
              flex: 1,
              borderRadius: 24,
              padding: "12px 16px",
              background: "#222",
              color: "#fff",
              border: 0,
              outline: "none",
            }}
          />
          <button
            onClick={() => void send()}
            style={{
              background: "#fff",
              color: "#000",
              border: 0,
              borderRadius: 24,
              padding: "12px 20px",
              fontWeight: 800,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({ component: JIYA_OS_V7 });
