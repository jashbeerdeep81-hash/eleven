import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  component: JIYA_OS_V7,
});

type Message = { role: "user" | "jiya"; text: string };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: { length: number; [index: number]: { isFinal: boolean; [i: number]: { transcript: string } } } }) => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => Recognition;

function JIYA_OS_V7() {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: "jiya",
      text: "Jai Shree Ram 🌷 Welcome to JIYA OS V7",
    },
  ]);
  const [input, setInput] = useState("");
  const [alwaysOn, setAlwaysOn] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<Recognition | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  useEffect(() => {
    const W = window as any;
    const SR = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!SR) return;
    const r: Recognition = new SR();
    r.lang = "en-IN";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e: any) => {
      const t = e.results[e.results.length - 1][0].transcript;
      if (e.results[e.results.length - 1].isFinal) {
        handleSend(t);
      }
    };
    r.onend = () => {
      if (alwaysOn) {
        try { r.start(); } catch {}
      } else {
        setListening(false);
      }
    };
    recRef.current = r;
  }, [alwaysOn]);

  const toggleListen = () => {
    if (!recRef.current) return alert("Voice not supported in this browser");
    if (listening) {
      recRef.current.stop();
      setListening(false);
    } else {
      try {
        recRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const handleSend = (txt = input) => {
    if (!txt.trim()) return;
    const userMsg: Message = { role: "user", text: txt };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    // Simple JIYA reply - you can connect your AI here
    setTimeout(() => {
      const reply: Message = {
        role: "jiya",
        text: `You said: "${txt}" - JIYA V7 is listening! 🚀`,
      };
      setMsgs((m) => [...m, reply]);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b>JIYA_OS_V7</b>
        <label style={{ fontSize: 12, display: "flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={alwaysOn} onChange={(e) => setAlwaysOn(e.target.checked)} />
          Always On
        </label>
      </header>

      <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user"? "flex-end" : "flex-start", background: m.role === "user"? "#7c3aed" : "#1f1f25", padding: "10px 14px", borderRadius: 16, maxWidth: "80%" }}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ padding: 12, borderTop: "1px solid #222", display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type to JIYA..."
          style={{ flex: 1, background: "#1a1a22", border: "1px solid #333", borderRadius: 20, padding: "10px 14px", color: "white", outline: "none" }}
        />
        <button onClick={toggleListen} style={{ background: listening? "#ef4444" : "#222", border: "none", borderRadius: 20, padding: "10px 16px", color: "white" }}>
          {listening? "● Stop" : "🎤"}
        </button>
        <button onClick={() => handleSend()} style={{ background: "#7c3aed", border: "none", borderRadius: 20, padding: "10px 18px", color: "white", fontWeight: 700 }}>
          Send
        </button>
      </div>
    </div>
  );
  }
