import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { UIMessage } from "ai";
import {
  ArrowLeft,
  Camera,
  CalendarDays,
  CloudSun,
  ExternalLink,
  FileImage,
  Globe,
  History,
  Mic,
  MicOff,
  Newspaper,
  Pause,
  Play,
  Search,
  Share2,
  Smartphone,
  Timer,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import jiyaLogo from "@/assets/jiya-logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JIYA — Indian AI Voice Assistant" },
      {
        name: "description",
        content:
          "Chat or talk with JIYA, a friendly Indian AI assistant fluent in Hindi, Hinglish and English.",
      },
      { property: "og:title", content: "JIYA — Indian AI Voice Assistant" },
      {
        property: "og:description",
        content:
          "Chat or talk with JIYA, a friendly Indian AI assistant fluent in Hindi, Hinglish and English.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JiyaPage,
});

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult:
    | ((event: {
        resultIndex: number;
        results: ArrayLike<
          ArrayLike<{ transcript: string; confidence?: number }> & { isFinal?: boolean }
        >;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] ?? w["webkitSpeechRecognition"] ?? null) as
    (new () => SpeechRecognitionLike) | null;
}

const OWNER_NAME = "Jashbeer";
const OWNER_MUMMY = "Anty";
const QUICK_PROMPTS = [
  "JIYA, YouTube kholo",
  "Aaj ka mausam kaisa hai?",
  "Google pe biryani search karo",
  "Aaj ki news sunao",
];

type FreeResult = { reply: string; status: string; url?: string };

const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[?!.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function makeMessage(role: UIMessage["role"], text: string): UIMessage {
  return { id: crypto.randomUUID(), role, parts: [{ type: "text", text }] };
}

function getLocalMemories(): Array<{ key: string; value: string }> {
  try {
    return JSON.parse(localStorage.getItem("jiya_memories") ?? "[]") as Array<{
      key: string;
      value: string;
    }>;
  } catch {
    return [];
  }
}

function saveLocalMemory(key: string, value: string) {
  const next = [{ key, value }, ...getLocalMemories()].slice(0, 20);
  localStorage.setItem("jiya_memories", JSON.stringify(next));
}

function getNumberExpression(text: string) {
  const match = text.match(/(?:calculate|calc|hisab|kitna hota hai)\s+([0-9+*/().%\s-]+)/i);
  return match?.[1]?.trim() ?? (/^[0-9+*/().%\s-]+$/.test(text) ? text : "");
}

function calculateExpression(expression: string): number | null {
  const tokens = expression.match(/\d+(?:\.\d+)?|[()+\-*/%]/g);
  if (!tokens || tokens.join("") !== expression.replace(/\s/g, "")) return null;
  let index = 0;
  const parsePrimary = (): number => {
    const token = tokens[index++];
    if (token === "(") {
      const value = parseAdditive();
      if (tokens[index++] !== ")") throw new Error("parenthesis");
      return value;
    }
    if (token === "-") return -parsePrimary();
    if (!token || Number.isNaN(Number(token))) throw new Error("number");
    return Number(token);
  };
  const parseMultiplicative = (): number => {
    let value = parsePrimary();
    while (["*", "/", "%"].includes(tokens[index] ?? "")) {
      const operator = tokens[index++];
      const right = parsePrimary();
      if (operator === "*") value *= right;
      if (operator === "/") value /= right;
      if (operator === "%") value %= right;
    }
    return value;
  };
  const parseAdditive = (): number => {
    let value = parseMultiplicative();
    while (["+", "-"].includes(tokens[index] ?? "")) {
      const operator = tokens[index++];
      const right = parseMultiplicative();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  };
  try {
    const result = parseAdditive();
    return index === tokens.length && Number.isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function extractAfter(text: string, patterns: string[]) {
  const lower = normalize(text);
  for (const pattern of patterns) {
    const index = lower.indexOf(pattern);
    if (index >= 0) return text.slice(index + pattern.length).trim();
  }
  return "";
}

async function freeLookup(type: string, query = "") {
  const response = await fetch(
    `/api/free-data?type=${encodeURIComponent(type)}&q=${encodeURIComponent(query)}`,
  );
  const data = (await response.json()) as Record<string, unknown>;
  if (!response.ok)
    throw new Error(typeof data.error === "string" ? data.error : "Free service unavailable.");
  return data;
}

function JiyaPage() {
  const [input, setInput] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const lastSpokenRef = useRef<string | null>(null);

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isBusy = status === "submitted" || status === "streaming";

  // Speak assistant replies when voice output is enabled
  useEffect(() => {
    if (!voiceEnabled || status !== "ready") return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || lastSpokenRef.current === last.id) return;
    const text = last.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");
    if (!text.trim()) return;
    lastSpokenRef.current = last.id;
    const action = parseAction(text);
    speak(action ? (action.spoken_response ?? "Theek hai.") : extractChatText(text));
  }, [messages, status, voiceEnabled]);

  const toggleMic = useCallback(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      toast.error("Is browser mein voice input supported nahi hai. Chrome try karein.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Sorry, awaaz samajh nahi aayi. Dobara try karein.");
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [listening]);

  const handleSubmit = (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <img
          src={jiyaLogo}
          alt="JIYA logo"
          width={1024}
          height={1024}
          className="h-10 w-10 rounded-full object-contain"
        />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold tracking-tight text-foreground">JIYA</h1>
          <p className="truncate text-xs text-muted-foreground">
            Hindi • Hinglish • English — aapki Indian AI assistant
          </p>
        </div>
        <Button
          variant={voiceEnabled ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setVoiceEnabled((v) => {
              if (v) window.speechSynthesis?.cancel();
              return !v;
            });
          }}
          className="gap-1.5"
        >
          {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          <span className="hidden sm:inline">{voiceEnabled ? "Awaaz on" : "Awaaz off"}</span>
        </Button>
      </header>

      <main className="mx-auto flex w-full max-w-3xl min-h-0 flex-1 flex-col px-4">
        <Conversation className="min-h-0 flex-1">
          <ConversationContent className="gap-6 py-6">
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={
                  <img
                    src={jiyaLogo}
                    alt="JIYA"
                    width={1024}
                    height={1024}
                    className="h-20 w-20 object-contain"
                  />
                }
                title="Namaste! Main JIYA hoon."
                description="Hindi, Hinglish ya English — jis style mein comfortable ho, baat karein. Mic button se bol bhi sakte hain."
              >
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessage({ text: prompt })}
                      className="rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-foreground shadow-sm transition-colors hover:bg-accent"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </ConversationEmptyState>
            ) : (
              messages.map((message) => {
                const text = message.parts
                  .filter((p) => p.type === "text")
                  .map((p) => p.text)
                  .join("");
                const action = message.role === "assistant" ? parseAction(text) : null;

                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      {action ? (
                        <ActionCard action={action} />
                      ) : message.role === "assistant" ? (
                        text.trim() ? (
                          <MessageResponse>{extractChatText(text)}</MessageResponse>
                        ) : null
                      ) : (
                        <p className="whitespace-pre-wrap">{text}</p>
                      )}
                    </MessageContent>
                  </Message>
                );
              })
            )}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <Shimmer className="text-sm">JIYA soch rahi hai...</Shimmer>
                </MessageContent>
              </Message>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                Sorry, kuch gadbad ho gayi. Dobara try karein.
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="pb-4 pt-2">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                listening
                  ? "Sun rahi hoon... boliye"
                  : "Likhein ya mic se bolein — jaise 'JIYA, YouTube kholo'"
              }
            />
            <PromptInputFooter className="justify-between">
              <Button
                type="button"
                variant={listening ? "default" : "ghost"}
                size="icon-sm"
                aria-label={listening ? "Stop listening" : "Speak to JIYA"}
                onClick={toggleMic}
                className={cn(listening && "animate-pulse")}
              >
                {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </Button>
              <PromptInputSubmit
                status={status}
                onStop={stop}
                disabled={!input.trim() && !isBusy}
              />
            </PromptInputFooter>
          </PromptInput>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            JIYA AI hai, asli insaan nahi — kabhi-kabhi galat bhi ho sakti hai.
          </p>
        </div>
      </main>
    </div>
  );
}

function ActionCard({ action }: { action: JiyaAction }) {
  const meta = ACTION_META[action.action] ?? {
    label: action.action,
    icon: AlertTriangle,
    runnable: false,
  };
  const Icon = meta.icon;
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-3">
      {action.spoken_response && <p className="text-foreground">{action.spoken_response}</p>}
      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-card-foreground">
          <Icon className="size-4 text-primary" />
          {meta.label}
        </div>
        {Object.keys(action.parameters ?? {}).length > 0 && (
          <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
            {Object.entries(action.parameters ?? {}).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <dt className="font-medium">{key}:</dt>
                <dd className="break-all">{String(value)}</dd>
              </div>
            ))}
          </dl>
        )}
        {meta.runnable ? (
          <Button
            size="sm"
            className="mt-3"
            disabled={done}
            onClick={() => {
              const ok = runAction(action);
              if (ok) {
                setDone(true);
                toast.success("Action execute ho gaya.");
              } else {
                toast.error("Sorry, ye action complete nahi ho paya.");
              }
            }}
          >
            {done ? "Ho gaya" : "Run karein"}
          </Button>
        ) : (
          <p className="mt-3 text-xs text-muted-foreground">
            Ye action abhi JIYA ke web version mein supported nahi hai — Android app mein available
            hoga.
          </p>
        )}
      </div>
    </div>
  );
}
