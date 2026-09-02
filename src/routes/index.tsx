import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Battery,
  Camera,
  Check,
  ChevronRight,
  CloudSun,
  ExternalLink,
  Heart,
  LoaderCircle,
  Mic,
  MicOff,
  Moon,
  Newspaper,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/jiya-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIYA OS V7 — Free Voice Assistant" },
      {
        name: "description",
        content: "JIYA OS V7 is Jashbeer's free Hindi and Hinglish voice command console with memory, weather and direct browser actions.",
      },
      { property: "og:title", content: "JIYA OS V7 — Free Voice Assistant" },
      {
        property: "og:description",
        content: "A free-first Hindi voice command console for Jashbeer with memory, weather and safe browser actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JIYA_OS_V7,
});

type Message = { id: string; role: "user" | "jiya"; text: string };
type MemoryItem = { id?: string; key?: string; value?: string; text?: string; time?: number };
type Product = { id: string; name: string; price: number; detail: string; tone: string };
type WeatherData = {
  city: string;
  temperature: string;
  feelsLike: string;
  humidity: string;
  description: string;
  tomorrowDescription?: string;
  tomorrowRainChance?: string;
};
type ResearchData = {
  heading: string;
  abstract: string;
  url: string;
  related: Array<{ text: string; url: string }>;
};

const OWNER = "Jashbeer";
const INITIAL_MESSAGE: Message = {
  id: "welcome",
  role: "jiya",
  text: "Namaste Jashbeer sir. JIYA V7 ready hai — mic dabaiye aur boliye, main Hindi aur Hinglish samajhungi.",
};

const PRODUCTS: Product[] = [
  { id: "red-banarasi", name: "Red Banarasi", price: 1999, detail: "Festive silk · statement zari", tone: "bg-rose/20" },
  { id: "blue-georgette", name: "Blue Georgette", price: 1499, detail: "Light drape · everyday edit", tone: "bg-primary/15" },
  { id: "green-silk", name: "Green Silk", price: 2499, detail: "Rich weave · evening wear", tone: "bg-accent" },
];

function readLocalMemory(): MemoryItem[] {
  try {
    const value = localStorage.getItem("jiya_memory");
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readOrders(): Array<Product & { time?: number }> {
  try {
    const value = localStorage.getItem("jiya_orders");
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function messageFromMemory(item: MemoryItem): Message | null {
  if (item.key !== "conversation" || !item.value) return null;
  try {
    const parsed = JSON.parse(item.value) as { role?: Message["role"]; text?: string };
    if (parsed.role && parsed.text) return { id: item.id ?? `${item.time ?? Date.now()}-${parsed.role}`, ...parsed };
  } catch {
    return null;
  }
  return null;
}

function JIYA_OS_V7() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [dreamMode, setDreamMode] = useState(false);
  const [hearing, setHearing] = useState("");
  const [status, setStatus] = useState("Mic ready · tap and speak");
  const [shopOpen, setShopOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const [highlightedId, setHighlightedId] = useState(PRODUCTS[0].id);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [research, setResearch] = useState<ResearchData | null>(null);
  const [cloudMemoryCount, setCloudMemoryCount] = useState(0);
  const [memoryCount, setMemoryCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [lastAction, setLastAction] = useState("Ready for a command");
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dreamAnnouncedRef = useRef(false);

  const localStats = useMemo(() => ({ memory: readLocalMemory(), orders: readOrders() }), [messages, ordersCount]);

  useEffect(() => {
    localStorage.setItem("owner_name", OWNER);
    localStorage.setItem("owner_mummy", "Anty");
    if (!localStorage.getItem("jiya_memory")) localStorage.setItem("jiya_memory", "[]");
    if (!localStorage.getItem("jiya_orders")) localStorage.setItem("jiya_orders", "[]");
    setMemoryCount(readLocalMemory().length);
    setOrdersCount(readOrders().length);

    let cancelled = false;
    const loadCloudMemory = async () => {
      try {
        const { data, error } = await supabase
          .from("jaan_memory")
          .select("id, key, value")
          .eq("owner", OWNER)
          .order("created_at", { ascending: false })
          .limit(30);
        if (error || cancelled) return;
        setCloudMemoryCount(data?.length ?? 0);
        const cloudMessages = (data ?? []).map(messageFromMemory).filter((item): item is Message => item !== null).reverse();
        if (cloudMessages.length) setMessages([INITIAL_MESSAGE, ...cloudMessages.slice(-12)]);
      } catch {
        setStatus("Cloud memory unavailable · local memory active");
      }
    };
    void loadCloudMemory();

    const hour = new Date().getHours();
    if (hour === 2) {
      setDreamMode(true);
      setStatus("Dream mode · soft voice active");
    }
    return () => {
      cancelled = true;
      listeningRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch {
        // Recognition may already be stopped.
      }
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, hearing]);

  useEffect(() => {
    if (!videoRef.current || !cameraOpen) return;
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraOpen]);

  const persistMemory = async (key: string, value: string) => {
    const current = readLocalMemory();
    current.push({ key, value, time: Date.now() });
    localStorage.setItem("jiya_memory", JSON.stringify(current.slice(-200)));
    setMemoryCount(Math.min(current.length, 200));
    try {
      const { error } = await supabase.from("jaan_memory").insert({ owner: OWNER, key, value });
      if (!error) setCloudMemoryCount((count) => count + 1);
    } catch {
      setStatus("Local memory saved · Cloud will retry next time");
    }
  };

  const addMessage = (role: Message["role"], text: string) => {
    const message: Message = { id: `${Date.now()}-${Math.random()}`, role, text };
    setMessages((current) => [...current, message]);
    void persistMemory("conversation", JSON.stringify({ role, text }));
  };

  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synthesis = window.speechSynthesis;
    synthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthesis.getVoices();
    const hindiVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("hi"));
    const femaleVoice = voices.find((voice) => /female|samantha|zira|swara|heera/i.test(voice.name));
    utterance.voice = hindiVoice ?? femaleVoice ?? voices[0] ?? null;
    utterance.lang = hindiVoice?.lang ?? "hi-IN";
    utterance.pitch = dreamMode ? 1.05 : 1.16;
    utterance.rate = dreamMode ? 0.72 : 0.9;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setStatus(dreamMode ? "Dream mode · soft voice active" : isListening ? "Listening · bolo" : "Mic ready · tap and speak");
    };
    utterance.onerror = () => setIsSpeaking(false);
    setStatus(dreamMode ? "Speaking softly…" : "Speaking…");
    synthesis.speak(utterance);
  };

  const say = (text: string) => {
    addMessage("jiya", text);
    speak(text);
  };

  const openExternal = (url: string, label: string) => {
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) {
      setStatus("Browser ne new tab block kiya · link neeche available hai");
      say(`${label} open karne ke liye browser ne popup block kiya. Neeche link par tap kijiye.`);
      return false;
    }
    setLastAction(`${label} opened`);
    return true;
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch("/api/free-data?type=weather&q=Dhenkanal");
      const data = (await response.json()) as WeatherData & { error?: string };
      if (!response.ok || data.error) return null;
      setWeather(data);
      return data;
    } catch {
      return null;
    }
  };

  const fetchSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/free-data?type=search&q=${encodeURIComponent(query)}`);
      const data = (await response.json()) as ResearchData & { error?: string };
      if (!response.ok || data.error) return null;
      setResearch(data);
      return data;
    } catch {
      return null;
    }
  };

  const getBestSeller = () => {
    const scores = new Map(PRODUCTS.map((product) => [product.id, 0]));
    for (const order of readOrders()) scores.set(order.id, (scores.get(order.id) ?? 0) + 4);
    for (const memory of readLocalMemory()) {
      const text = `${memory.value ?? ""} ${memory.text ?? ""}`.toLowerCase();
      for (const product of PRODUCTS) if (text.includes(product.name.toLowerCase())) scores.set(product.id, (scores.get(product.id) ?? 0) + 1);
    }
    return PRODUCTS.reduce((best, product) => (scores.get(product.id)! > scores.get(best.id)! ? product : best), PRODUCTS[0]);
  };

  const getBattery = async () => {
    try {
      const battery = await (navigator as Navigator & { getBattery?: () => Promise<{ level: number }> }).getBattery?.();
      return battery ? `${Math.round(battery.level * 100)}%` : "browser ne battery nahi batayi";
    } catch {
      return "browser ne battery nahi batayi";
    }
  };

  const enableCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("Is browser mein camera API available nahi hai");
      return false;
    }
    setCameraBusy(true);
    setStatus("Camera permission maang rahi hoon…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOpen(true);
      setLastAction("Camera preview ready · photo is not captured automatically");
      return true;
    } catch {
      setStatus("Camera permission nahi mili · baaki report ready hai");
      return false;
    } finally {
      setCameraBusy(false);
    }
  };

  const runEverything = async () => {
    setShopOpen(true);
    setDashboardOpen(true);
    const best = getBestSeller();
    setHighlightedId(best.id);
    const cameraReady = await enableCamera();
    const [weatherData, battery] = await Promise.all([fetchWeather(), getBattery()]);
    const orders = readOrders();
    const forecast = weatherData?.tomorrowDescription
      ? `Kal ${weatherData.tomorrowDescription}${weatherData.tomorrowRainChance ? `, rain chance ${weatherData.tomorrowRainChance}%` : ""}`
      : "Kal ka weather free service se abhi nahi mila";
    const cameraLine = cameraReady ? "Camera preview ready hai, photo aapke tap ke bina nahi li gayi" : "Camera permission nahi mili, isliye photo nahi li";
    const report = `Good morning ${OWNER} sir. Aaj ${orders.length} orders hain, battery ${battery}, ${forecast}. Activity heuristic ke hisaab se ${best.name} leading pick hai — 80% confidence nahi, sirf local data based estimate. ${cameraLine}.`;
    setLastAction("Ultimate report complete");
    say(report);
    void persistMemory("v7_report", JSON.stringify({ product: best.name, weather: weatherData?.description ?? null, orders: orders.length }));
  };

  const stopMic = () => {
    listeningRef.current = false;
    setIsListening(false);
    setHearing("");
    setStatus("Mic paused · tap to listen");
    try {
      recognitionRef.current?.stop();
    } catch {
      // Recognition may already be stopped.
    }
    recognitionRef.current = null;
  };

  const startMic = () => {
    const Recognition = (window as Window & { SpeechRecognition?: new () => any; webkitSpeechRecognition?: new () => any }).SpeechRecognition
      ?? (window as Window & { webkitSpeechRecognition?: new () => any }).webkitSpeechRecognition;
    if (!Recognition) {
      setStatus("Chrome/Edge browser mein mic use kijiye");
      setIsListening(false);
      return;
    }
    if (recognitionRef.current) return;
    listeningRef.current = true;
    setIsListening(true);
    const recognition = new Recognition();
    recognition.lang = "hi-IN";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => setStatus(dreamMode ? "Dream mode · softly sun rahi hoon" : "Listening · bolo");
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";
        if (event.results[index].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      setHearing(interimText);
      if (finalText.trim()) {
        setHearing("");
        void handle(finalText.trim());
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      if (listeningRef.current) window.setTimeout(startMic, 250);
    };
    recognition.onerror = (event: { error?: string }) => {
      recognitionRef.current = null;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        listeningRef.current = false;
        setIsListening(false);
        setStatus("Mic permission allow kijiye, phir dobara tap karein");
      } else if (listeningRef.current) {
        setStatus("Mic reconnect ho raha hai…");
      }
    };
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setStatus("Mic start nahi hua · dobara tap karein");
    }
  };

  const toggleMic = () => {
    if (isListening) stopMic();
    else startMic();
  };

  const doAction = async (raw: string) => {
    const text = raw.trim();
    const normalized = text.toLowerCase();
    const has = (...words: string[]) => words.some((word) => normalized.includes(word));
    setLastAction(`Command received · ${text}`);

    if (has("sab kuch kar", "sabkuch kar", "ultimate final", "everything kar", "सब कुछ कर")) {
      await runEverything();
      return true;
    }
    if (has("kal ka mausam", "kaunsa bikega", "prediction", "predict", "forecast")) {
      const data = await fetchWeather();
      const best = getBestSeller();
      const forecast = data?.tomorrowDescription ? `Kal ${data.tomorrowDescription}${data.tomorrowRainChance ? `, rain chance ${data.tomorrowRainChance}%` : ""}` : "Kal ka weather unavailable hai";
      say(`${forecast}. Local orders aur conversation activity ke heuristic se ${best.name} leading pick hai. Ye estimate hai, guaranteed prediction nahi. Rain ho toh customers rain-proof drape puch sakte hain.`);
      return true;
    }
    if (has("mic band", "माइक बंद", "chup ho")) {
      stopMic();
      say("Mic pause kar diya sir. Jab chahein pink mic dabaiye.");
      return true;
    }
    if (has("mic on", "माइक चालू", "sun rahi", "suno")) {
      startMic();
      say("Mic ON sir, boliye.");
      return true;
    }
    if (has("mera naam", "मेरा नाम", "naam kya")) {
      say(`Aapka naam ${OWNER} hai sir. JIYA ko yaad hai.`);
      return true;
    }
    if (has("tumhara naam", "तुम्हारा नाम", "your name")) {
      say("Mera naam JIYA hai sir — aapki free-first voice assistant.");
      return true;
    }
    const playMatch = normalized.match(/(?:play|bajao|बजाओ|chalao|चलाओ|gana|गाना)\s+(.+)/);
    if (playMatch?.[1]) {
      const query = playMatch[1].trim();
      openExternal(`https://m.youtube.com/results?search_query=${encodeURIComponent(query)}`, `${query} song`);
      say(`${query} ka YouTube search khol diya sir.`);
      return true;
    }
    if (has("youtube", "यूट्यूब", "युट्यूब", "yutub", "youtub", "yt")) {
      openExternal("https://m.youtube.com", "YouTube");
      say("YouTube khol diya sir.");
      return true;
    }
    if (has("instagram", "insta", "इंस्टा")) {
      openExternal("https://instagram.com", "Instagram");
      say("Instagram khol diya sir.");
      return true;
    }
    if (has("whatsapp", "व्हाट्स", "वाट्स")) {
      openExternal("https://wa.me", "WhatsApp");
      say("WhatsApp khol diya sir.");
      return true;
    }
    if (has("google", "गूगल")) {
      openExternal("https://google.com", "Google");
      say("Google khol diya sir.");
      return true;
    }
    if (has("saree", "sari", "sharee", "साड़ी", "साडी")) {
      setShopOpen(true);
      const best = getBestSeller();
      setHighlightedId(best.id);
      say(`Saree collection khol diya sir. Local activity mein ${best.name} leading pick hai.`);
      return true;
    }
    if (has("camera", "कैमरा", "photo le")) {
      const ready = await enableCamera();
      say(ready ? "Camera preview ready hai sir. Photo aapke tap ke bina nahi li jayegi." : "Camera permission nahi mili sir.");
      return true;
    }
    if (has("battery", "बैटरी", "charge kitna")) {
      say(`Battery ${await getBattery()} hai sir.`);
      return true;
    }
    if (has("weather", "मौसम", "बारिश", "barish")) {
      const data = await fetchWeather();
      say(data ? `${data.city} mein abhi ${data.temperature}°C aur ${data.description}. ${data.tomorrowDescription ? `Kal ${data.tomorrowDescription}.` : ""}` : "Free weather service abhi response nahi de rahi sir.");
      return true;
    }
    if (has("news", "खबर", "समाचार")) {
      try {
        const response = await fetch("/api/free-data?type=news");
        const data = (await response.json()) as { items?: Array<{ title: string }> };
        const titles = data.items?.slice(0, 3).map((item) => item.title).filter(Boolean) ?? [];
        say(titles.length ? `Aaj ki top khabrein: ${titles.join(". ")}` : "News feed abhi empty hai sir.");
      } catch {
        say("Free news feed abhi available nahi hai sir.");
      }
      return true;
    }
    const translateMatch = text.match(/(?:translate|अनुवाद)\s+(.+)/i);
    if (translateMatch?.[1]) {
      try {
        const response = await fetch(`/api/free-data?type=translate&q=${encodeURIComponent(translateMatch[1])}`);
        const data = (await response.json()) as { translated?: string };
        say(data.translated ? `English translation: ${data.translated}` : "Translation nahi mili sir.");
      } catch {
        say("Free translation service abhi available nahi hai sir.");
      }
      return true;
    }
    const searchMatch = text.match(/(?:search|सर्च|ढूंढो)\s+(.+)/i);
    if (searchMatch?.[1]) {
      const query = searchMatch[1].trim();
      const data = await fetchSearch(query);
      if (data?.abstract) say(`${data.heading}: ${data.abstract.slice(0, 300)}`);
      else say(`DuckDuckGo se ${query} ka direct answer nahi mila. Research panel mein related links dekhiye.`);
      void persistMemory("search", query);
      return true;
    }
    if (has("time", "समय", "टाइम", "baj raha")) {
      say(`Abhi ${new Date().toLocaleTimeString("hi-IN")} ho raha hai sir.`);
      return true;
    }
    if (has("poster", "पोस्टर")) {
      say("Poster command abhi browser canvas mein ready nahi hai. Saree collection aur report flow fully active hain.");
      return true;
    }
    if (has("back", "पीछे", "piche jao")) {
      window.history.back();
      return true;
    }
    return false;
  };

  const handle = async (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setHearing("");
    addMessage("user", text.trim());
    const completed = await doAction(text);
    if (!completed) say(`Samajh gayi sir. Main YouTube, Google, saree, weather, news, search aur camera commands chala sakti hoon. “Sab kuch kar de” bhi bol sakte hain.`);
  };

  const addOrder = (product: Product) => {
    const orders = readOrders();
    orders.push({ ...product, time: Date.now() });
    localStorage.setItem("jiya_orders", JSON.stringify(orders));
    setOrdersCount(orders.length);
    void persistMemory("order", JSON.stringify({ product: product.name, price: product.price }));
    say(`${product.name} order list mein save kar diya sir. COD available hai.`);
  };

  const toggleDreamMode = () => {
    const next = !dreamMode;
    setDreamMode(next);
    setStatus(next ? "Dream mode · soft voice active" : "Mic ready · tap and speak");
    if (next && !dreamAnnouncedRef.current) {
      dreamAnnouncedRef.current = true;
      say("Dream mode on sir. Aap aaram kijiye, main yahin hoon — page khula rahega tabhi kaam karungi.");
    }
  };

  const bestSeller = getBestSeller();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logo} alt="JIYA OS" className="size-10 shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tracking-tight">JIYA OS <span className="text-rose">V7</span></p>
              <p className="truncate text-xs text-muted-foreground">Owner {OWNER} · free-first command console</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`hidden items-center gap-1.5 text-xs font-medium sm:flex ${isListening ? "text-rose" : "text-muted-foreground"}`}>
              <span className={`size-2 rounded-full ${isListening ? "bg-rose animate-pulse" : "bg-muted-foreground/50"}`} />
              {isListening ? "Listening" : "Standby"}
            </span>
            <Button variant="ghost" size="icon" aria-label={voiceEnabled ? "Mute JIYA voice" : "Enable JIYA voice"} onClick={() => setVoiceEnabled((value) => !value)}>
              {voiceEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle dream mode" onClick={toggleDreamMode}>
              <Moon className={dreamMode ? "text-rose" : ""} />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 pb-28 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:py-12">
        <section className="flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="size-4" /> Personal AI OS
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">Boliye, JIYA action legi.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Hindi, Hinglish ya English mein command dijiye. Browser ke supported actions direct khulenge, aur har conversation local memory plus Cloud memory mein save hogi.</p>
          </div>

          <div className="border-y border-border py-7">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
              <Button
                className={`size-28 shrink-0 rounded-full border-8 border-background bg-rose text-rose-foreground shadow-xl shadow-rose/20 hover:bg-rose/90 sm:size-36 ${isListening ? "animate-pulse" : ""}`}
                aria-label={isListening ? "Stop listening" : "Start listening"}
                onClick={toggleMic}
              >
                {isListening ? <MicOff className="size-9 sm:size-11" /> : <Mic className="size-9 sm:size-11" />}
              </Button>
              <div className="text-center sm:text-left">
                <p className="text-lg font-semibold">{isListening ? "Sun rahi hoon…" : "Mic dabaiye"}</p>
                <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">{status}</p>
                {hearing && <p className="mt-3 rounded-md bg-secondary px-3 py-2 text-sm text-secondary-foreground">“{hearing}”</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-border pb-7 sm:grid-cols-4">
            <Stat icon={<Heart />} label="Owner memory" value={`${memoryCount}`} detail="local records" />
            <Stat icon={<ShieldCheck />} label="Cloud memory" value={`${cloudMemoryCount}`} detail="saved records" />
            <Stat icon={<ShoppingBag />} label="Orders" value={`${ordersCount}`} detail="COD list" />
            <Stat icon={<Activity />} label="Voice" value={voiceEnabled ? "ON" : "OFF"} detail="Web Speech" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button className="bg-rose text-rose-foreground hover:bg-rose/90" onClick={() => void runEverything()}>
              <Zap /> Sab kuch kar de
            </Button>
            <Button variant="outline" onClick={() => { setShopOpen(true); setHighlightedId(bestSeller.id); }}>
              <ShoppingBag /> Saree shop <ChevronRight />
            </Button>
            <Button variant="outline" onClick={() => void fetchWeather()}>
              <CloudSun /> Weather
            </Button>
          </div>

          {weather && (
            <div className="flex items-start gap-4 border-l-2 border-primary pl-4">
              <CloudSun className="mt-1 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold">{weather.city} · {weather.temperature}°C</p>
                <p className="mt-1 text-sm text-muted-foreground">{weather.description} · feels like {weather.feelsLike}°C · humidity {weather.humidity}%</p>
                {weather.tomorrowDescription && <p className="mt-2 text-sm">Kal: {weather.tomorrowDescription}{weather.tomorrowRainChance ? ` · rain chance ${weather.tomorrowRainChance}%` : ""}</p>}
              </div>
            </div>
          )}
        </section>

        <section className="flex min-h-[620px] flex-col border border-border bg-card/40 shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <div>
              <p className="font-semibold">Command console</p>
              <p className="mt-1 text-xs text-muted-foreground">{lastAction}</p>
            </div>
            {isSpeaking ? <LoaderCircle className="size-5 animate-spin text-rose" /> : <Activity className="size-5 text-primary" />}
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border px-4 py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {[
                "YouTube kholo",
                "Kal ka mausam batao",
                "Saree collection dikhao",
                "Mera naam kya hai?",
              ].map((command) => <Button key={command} variant="outline" size="sm" onClick={() => void handle(command)}>{command}</Button>)}
            </div>
            <form className="flex items-center gap-2" onSubmit={(event) => { event.preventDefault(); void handle(input); }}>
              <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Command type karein…" className="h-10 min-w-0 flex-1 border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" aria-label="Type a command" />
              <Button type="submit" size="icon" aria-label="Send command" disabled={!input.trim()}><Send /></Button>
            </form>
          </div>
        </section>
      </main>

      {(shopOpen || dashboardOpen || cameraOpen || research) && (
        <section className="border-t border-border bg-secondary/30">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-8 lg:grid-cols-2">
            {shopOpen && <div>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">JIYA style desk</p><h2 className="mt-2 text-2xl font-semibold">Saree collection</h2></div>
                <Button variant="ghost" size="icon" aria-label="Close saree collection" onClick={() => setShopOpen(false)}><X /></Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {PRODUCTS.map((product) => <article key={product.id} className={`border bg-card p-3 transition-shadow ${highlightedId === product.id ? "border-rose shadow-md shadow-rose/10" : "border-border"}`}>
                  <div className={`flex aspect-[4/3] items-end justify-between p-4 ${product.tone}`}><span className="text-3xl" aria-hidden="true">✦</span>{highlightedId === product.id && <span className="flex items-center gap-1 text-xs font-semibold text-rose"><Check className="size-3" /> leading pick</span>}</div>
                  <h3 className="mt-3 font-semibold">{product.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{product.detail}</p>
                  <div className="mt-3 flex items-center justify-between gap-2"><span className="font-semibold">₹{product.price}</span><Button size="sm" onClick={() => addOrder(product)}>Order COD</Button></div>
                </article>)}
              </div>
            </div>}

            {dashboardOpen && <div>
              <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Owner report</p><h2 className="mt-2 text-2xl font-semibold">V7 activity desk</h2></div><Button variant="ghost" size="icon" aria-label="Close owner report" onClick={() => setDashboardOpen(false)}><X /></Button></div>
              <div className="grid gap-3 sm:grid-cols-3">
                <ReportItem icon={<ShoppingBag />} label="Orders" value={`${ordersCount}`} />
                <ReportItem icon={<Heart />} label="Local memory" value={`${memoryCount}`} />
                <ReportItem icon={<ShieldCheck />} label="Privacy" value="Permission first" />
              </div>
              <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">Prediction activity sirf saved local orders aur conversation keywords ka transparent heuristic hai. JIYA guaranteed future, silent camera capture, ya page band hone ke baad background work claim nahi karti.</p>
            </div>}

            {(cameraOpen || cameraBusy) && <div>
              <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Permission-first camera</p><h2 className="mt-2 text-2xl font-semibold">Preview only</h2></div><Button variant="ghost" size="icon" aria-label="Close camera preview" onClick={() => setCameraOpen(false)}><X /></Button></div>
              {cameraBusy ? <div className="flex min-h-48 items-center justify-center border border-border bg-card"><LoaderCircle className="size-7 animate-spin text-primary" /></div> : <video ref={videoRef} autoPlay playsInline className="aspect-video w-full border border-border bg-foreground object-cover" aria-label="Camera preview" />}
              <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Camera className="size-4" /> Permission milne par live preview dikhta hai; photo automatically capture nahi hoti.</p>
            </div>}

            {research && <div>
              <div className="mb-5 flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">Free web brain</p><h2 className="mt-2 text-2xl font-semibold">DuckDuckGo research</h2></div><Button variant="ghost" size="icon" aria-label="Close research" onClick={() => setResearch(null)}><X /></Button></div>
              <h3 className="font-semibold">{research.heading}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{research.abstract || "Direct abstract nahi mila."}</p>
              {research.url && <a href={research.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Open source <ExternalLink className="size-4" /></a>}
              <div className="mt-5 space-y-2">{research.related.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className="flex items-start gap-2 border-b border-border py-2 text-sm hover:text-primary"><ArrowUpRight className="mt-0.5 size-4 shrink-0" />{item.text}</a>)}</div>
            </div>}
          </div>
        </section>
      )}

      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <Button className={`size-16 rounded-full bg-rose text-rose-foreground shadow-xl shadow-rose/20 hover:bg-rose/90 ${isListening ? "animate-pulse" : ""}`} aria-label={isListening ? "Stop listening" : "Start listening"} onClick={toggleMic}>
          {isListening ? <MicOff /> : <Mic />}
        </Button>
      </div>
      <Link to="/sarees" className="sr-only">Open saree collection route</Link>
    </div>
  );
}

function Stat({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div><div className="flex items-center gap-2 text-muted-foreground">{icon}<span className="text-xs">{label}</span></div><p className="mt-2 text-xl font-semibold">{value}</p><p className="text-xs text-muted-foreground">{detail}</p></div>;
}

function ReportItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="border border-border bg-card p-4"><div className="flex items-center gap-2 text-primary">{icon}<span className="text-xs font-semibold uppercase tracking-wider">{label}</span></div><p className="mt-3 text-lg font-semibold">{value}</p></div>;
}