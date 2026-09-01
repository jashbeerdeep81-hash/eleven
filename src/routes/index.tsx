import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "jiya"; text: string; image?: string };
type Order = { id: string; product: string; address: string; createdAt: string; payment: "COD" };
type Contacts = Record<string, string>;

const OWNER = "Jashbeer";
const PRODUCTS = [
  { name: "Red Banarasi Saree", price: 2500 },
  { name: "Pink Silk Saree", price: 1800 },
  { name: "Blue Georgette Saree", price: 1400 },
];

const storage = {
  get<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage can be unavailable */
    }
  },
};

function JIYA() {
  const [msgs, setMsgs] = useState<Message[]>([
    {
      role: "jiya",
      text: "JIYA ON 💖 Jai Shree Ram! Main JIYA OS V7 hoon, Jashbeer sir. Bolo, kya karna hai?",
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [dream, setDream] = useState(false);
  const [weather, setWeather] = useState("Weather loading…");
  const [battery, setBattery] = useState("Unknown");
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contacts>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [clones, setClones] = useState<string[]>([]);
  const [godMode, setGodMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (entry: string) => {
    setLogs((current) => {
      const next = [`${new Date().toLocaleTimeString()}: ${entry}`, ...current].slice(0, 30);
      storage.set("jiya_logs", next);
      return next;
    });
  };

  const addJiyaMessage = (text: string, image?: string) =>
    setMsgs((current) => [...current, { role: "jiya", text, image }]);

  const speak = async (text: string) => {
    addJiyaMessage(text);
    const clean = text.replace(/[*#]/g, "").slice(0, 500);
    try {
      const url = `https://api.streamelements.com/kappa/v2/speech?voice=hi-IN-SwaraNeural&text=${encodeURIComponent(clean)}`;
      const audio = new Audio(url);
      audio.playbackRate = dream ? 0.8 : 1;
      await audio.play();
      return;
    } catch {
      /* browser autoplay/network fallback below */
    }
    try {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = "hi-IN";
      utterance.pitch = 1.2;
      utterance.rate = dream ? 0.8 : 0.92;
      window.speechSynthesis.speak(utterance);
    } catch {
      /* text interface remains fully usable */
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    setDream(hour >= 1 && hour < 5);
    try {
      window.localStorage.setItem("owner_name", OWNER);
      window.localStorage.setItem("owner_mummy", "Anty");
      setOrders(storage.get<Order[]>("jiya_orders", []));
      setContacts(storage.get<Contacts>("contacts_memory", {}));
      setLogs(storage.get<string[]>("jiya_logs", []));
      setClones(storage.get<string[]>("jiya_clones", []));
    } catch {
      /* private-mode storage is optional */
    }
    fetch("https://wttr.in/Dhenkanal?format=%C+%t")
      .then((response) => (response.ok ? response.text() : Promise.reject()))
      .then((value) => setWeather(value.trim() || "Weather unavailable"))
      .catch(() => setWeather("Weather unavailable"));
    const nav = navigator as Navigator & {
      getBattery?: () => Promise<{
        level: number;
        addEventListener?: (event: string, callback: () => void) => void;
      }>;
    };
    nav
      .getBattery?.()
      .then((level) => setBattery(`${Math.round(level.level * 100)}%`))
      .catch(() => undefined);
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs]);

  const saveMemory = (key: string, value: string) => {
    storage.set(`jiya_memory_${key}`, value);
    const env = import.meta.env;
    if (env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY) {
      fetch(`${env.VITE_SUPABASE_URL}/rest/v1/jaan_memory`, {
        method: "POST",
        headers: {
          apikey: env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ owner: OWNER, key, value }),
      }).catch(() => undefined);
    }
  };

  const openUrl = (url: string, response: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    return speak(response);
  };

  const camera = async (torch = false) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      if (torch && track)
        await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      await speak(torch ? "Torch on kar diya sir 🔦" : "Camera khol diya sir 📷");
    } catch {
      await speak(
        torch ? "Torch ke liye camera permission dena hoga." : "Camera permission dena hoga.",
      );
    }
  };

  const createPoster = () => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1080;
    const context = canvas.getContext("2d");
    if (!context) return speak("Poster canvas available nahi hai.");
    const gradient = context.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#ec4899");
    gradient.addColorStop(1, "#7c3aed");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1080);
    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "bold 96px Arial";
    context.fillText("JIYA SAREES", 540, 370);
    context.font = "bold 62px Arial";
    context.fillText("Beautiful sarees • COD available", 540, 510);
    context.font = "bold 74px Arial";
    context.fillText("Starting ₹1,400", 540, 710);
    context.font = "42px Arial";
    context.fillText(`Owner ${OWNER}`, 540, 910);
    addJiyaMessage(
      "1080×1080 poster ready — image ko long-press karke save kar lo 💖",
      canvas.toDataURL("image/png"),
    );
    void speak("Poster bana diya sir.");
  };

  const saveOrder = (address: string) => {
    const order: Order = {
      id: String(Date.now()),
      product: PRODUCTS[0].name,
      address,
      createdAt: new Date().toLocaleString(),
      payment: "COD",
    };
    setOrders((current) => {
      const next = [order, ...current];
      storage.set("jiya_orders", next);
      return next;
    });
    addLog(`COD order: ${order.product}`);
    return speak("COD order le liya ji. Delivery 3 se 5 din mein hogi 🙏");
  };

  const handleCommand = async (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const command = text.toLowerCase();
    setMsgs((current) => [...current, { role: "user", text }]);
    setInput("");
    saveMemory("last_request", text);
    if (command.includes("god mode") && command.includes("jashbeer123")) {
      setGodMode(true);
      return speak("God Mode unlocked sir 🔓");
    }
    if (command.includes("sab kuch kar de"))
      return speak(
        `Full report: ${weather}; battery ${battery}; ${orders.length} COD orders; ${Object.keys(contacts).length} saved contacts; ${clones.length} clones. Sab safe hai, ${OWNER} sir 💖`,
      );
    if (command.includes("mera naam"))
      return speak(`Aapka naam ${OWNER} hai sir. Main kabhi nahi bhoolungi ❤️`);
    if (command.includes("poster")) return createPoster();
    if (command.includes("youtube")) return openUrl("https://m.youtube.com", "YouTube khol diya.");
    if (command.includes("google")) return openUrl("https://www.google.com", "Google khol diya.");
    if (command.includes("insta") || command.includes("instagram"))
      return openUrl("https://www.instagram.com", "Instagram khol diya.");
    if (command.includes("gallery"))
      return openUrl("https://photos.google.com", "Gallery khol diya.");
    if (command.includes("back")) {
      window.history.back();
      return speak("Peeche ja rahi hoon.");
    }
    if (command.includes("search")) {
      const query = text.replace(/search/i, "").trim();
      return openUrl(
        `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        `${query || "Search"} search kar diya.`,
      );
    }
    if (command.includes("play song") || command.startsWith("play ")) {
      const query = text.replace(/^play( song)?/i, "").trim();
      return openUrl(
        `https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        `${query || "Song"} play karne ke liye khol diya.`,
      );
    }
    if (command.includes("torch off")) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      return speak("Torch off kar diya.");
    }
    if (command.includes("torch") || command.includes("flash")) return camera(true);
    if (command.includes("camera") || command.includes("photo")) return camera();
    if (command.includes("battery")) return speak(`Battery ${battery} hai sir.`);
    if (command.includes("vibrate")) {
      navigator.vibrate?.(500);
      return speak("Vibrate kar diya.");
    }
    if (command.includes("location")) {
      navigator.geolocation?.getCurrentPosition(
        (point) =>
          void speak(
            `Aap ${point.coords.latitude.toFixed(3)}, ${point.coords.longitude.toFixed(3)} par ho.`,
          ),
        () => void speak("Location permission dena hoga."),
      );
      return;
    }
    if (command.includes("call")) {
      const number = contacts.mummy || contacts.anty || contacts.default;
      if (number) {
        window.location.href = `tel:${number}`;
        return speak("Call laga rahi hoon.");
      }
      return speak("Pehle contact number save karo: “number 9876543210”.");
    }
    const number = text.match(/\b\d{10}\b/)?.[0];
    if (number) {
      const next = { ...contacts, mummy: number, anty: number, default: number };
      setContacts(next);
      storage.set("contacts_memory", next);
      return speak("Number save kar diya.");
    }
    if (command.includes("saree") || command.includes("sari"))
      return speak(
        `${PRODUCTS.map((product) => `${product.name} ₹${product.price}`).join(", ")}. COD available hai — “order lena hai” bolo.`,
      );
    if (command.includes("order") || command.includes("lena hai")) return saveOrder(text);
    if (
      command.includes("kal kya") ||
      command.includes("bhavishya") ||
      command.includes("prediction")
    )
      return speak(
        `Free forecast: ${weather}. Sales data ke hisaab se ${PRODUCTS[0].name} sabse zyada bikne ka chance hai.`,
      );
    if (command.includes("clone")) {
      const name = `JIYA clone ${clones.length + 1}`;
      setClones((current) => {
        const next = [...current, name];
        storage.set("jiya_clones", next);
        return next;
      });
      return speak(`${name} ready hai.`);
    }
    if (command.includes("code") || command.includes("feature")) {
      const code = `// JIYA generated request\n// ${text}\nexport const owner = '${OWNER}'\n`;
      storage.set(`jiya_code_${Date.now()}`, code);
      addLog(`Code saved: ${text}`);
      return speak(
        "Code local memory mein save kar diya. GitHub push ke liye user-provided token zaroori hota hai.",
      );
    }
    if (command.includes("dream") || command.includes("so jao")) {
      setDream(true);
      return speak("Dream mode on 🌙 Lullaby: so jao sir, JIYA yahin pehredari kar rahi hai.");
    }
    return speak(`Samajh gayi sir: “${text}”. Main ise memory mein save kar chuki hoon 💖`);
  };

  const startListening = () => {
    const recognition =
      (
        window as Window & {
          SpeechRecognition?: new () => SpeechRecognition;
          webkitSpeechRecognition?: new () => SpeechRecognition;
        }
      ).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition })
        .webkitSpeechRecognition;
    if (!recognition) {
      void speak("Voice recognition is browser mein available nahi hai. Aap type kar sakte ho.");
      return;
    }
    const session = new recognition();
    session.lang = "hi-IN";
    session.continuous = false;
    session.onstart = () => setListening(true);
    session.onend = () => setListening(false);
    session.onerror = () => setListening(false);
    session.onresult = (event) => void handleCommand(event.results[0][0].transcript);
    session.start();
  };

  if (godMode)
    return (
      <main className="min-h-screen bg-zinc-950 p-5 text-white">
        <h1 className="text-3xl font-black text-pink-500">JIYA GOD MODE 🔓</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Owner {OWNER} • orders, contacts, logs and clones
        </p>
        <button
          className="mt-4 rounded-full bg-pink-600 px-4 py-2 text-sm font-bold"
          onClick={() => setGodMode(false)}
        >
          Back to JIYA
        </button>
        <section className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["📦 Orders", orders.map((item) => `${item.product} — ${item.payment}`)],
            ["📞 Contacts", Object.entries(contacts).map(([name, number]) => `${name}: ${number}`)],
            ["🧠 Logs", logs],
            ["👯 Clones", clones],
          ].map(([title, values]) => (
            <article key={String(title)} className="rounded-2xl bg-zinc-900 p-4">
              <h2 className="font-bold">{String(title)}</h2>
              {(values as string[]).length ? (
                (values as string[]).map((value, index) => (
                  <p className="mt-2 text-sm text-zinc-300" key={`${value}-${index}`}>
                    {value}
                  </p>
                ))
              ) : (
                <p className="mt-2 text-sm text-zinc-500">No data yet</p>
              )}
            </article>
          ))}
        </section>
      </main>
    );

  return (
    <main
      className={`min-h-screen bg-zinc-950 pb-52 text-white ${dream ? "bg-gradient-to-b from-indigo-950 to-zinc-950" : ""}`}
    >
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />
      <header className="sticky top-0 z-10 border-b border-pink-400/30 bg-zinc-950/90 px-4 py-3 text-center backdrop-blur">
        <h1 className="text-xl font-black tracking-tight text-pink-400">
          JIYA OS V7 MULTIVERSE ✨
        </h1>
        <p className="text-xs text-zinc-400">
          Owner {OWNER} • {weather} • Battery {battery} • {dream ? "🌙 Dream mode" : "🟢 Active"}
        </p>
      </header>
      <section className="mx-auto max-w-lg space-y-3 p-4">
        {msgs.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm shadow ${message.role === "user" ? "ml-auto bg-zinc-800" : "bg-gradient-to-br from-pink-600 to-purple-700"}`}
          >
            {message.image && (
              <img
                className="mb-3 w-full rounded-xl"
                src={message.image}
                alt="JIYA generated poster"
              />
            )}
            {message.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </section>
      <div className="fixed bottom-16 left-0 right-0 mx-auto max-w-lg px-3">
        <button
          onClick={() => void handleCommand("sab kuch kar de")}
          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-sm font-black shadow-lg shadow-pink-500/30"
        >
          🌟 JIYA, SAB KUCH KAR DE 🌟
        </button>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {["Saree dikhao", "Poster bana", "Torch on", "Camera kholo", "Kal kya hoga"].map(
            (quick) => (
              <button
                className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs"
                key={quick}
                onClick={() => void handleCommand(quick)}
              >
                {quick}
              </button>
            ),
          )}
        </div>
      </div>
      <form
        className="fixed bottom-0 left-0 right-0 flex gap-2 border-t border-zinc-800 bg-zinc-950 p-3"
        onSubmit={(event) => {
          event.preventDefault();
          void handleCommand(input);
        }}
      >
        <button
          type="button"
          aria-label="Start voice command"
          onClick={startListening}
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-xl shadow-lg ${listening ? "animate-pulse bg-red-500" : "bg-pink-500 shadow-pink-500/40"}`}
        >
          🎤
        </button>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 text-sm outline-none focus:border-pink-400"
          placeholder="Bolo ya type karo…"
        />
        <button className="rounded-full bg-pink-500 px-5 text-sm font-bold" type="submit">
          Send
        </button>
      </form>
    </main>
  );
}

export const Route = createFileRoute("/")({ component: JIYA });
