"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";
import {
  Sparkles,
  X,
  Send,
  Building2,
  ArrowRight,
  Bot,
  User as UserIcon,
} from "lucide-react";

type Msg = {
  role: "user" | "bot";
  text: string;
  props?: { id: string; title: string }[];
};

export default function Chat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "Welcome to PropertyHub Premier. I am your AI Property Concierge. Ask me anything in English or Urdu—for example: “Find a 10 marla house in Lahore under 3.5 crore”.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [msgs, busy]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query || busy) return;
    setInput("");
    setBusy(true);

    const history = msgs
      .slice(1)
      .slice(-6)
      .map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text.slice(0, 1000),
      }));

    setMsgs((prev) => [...prev, { role: "user", text: query }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
      });
      const data = await res.json();
      setMsgs((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply ?? "I was unable to retrieve properties right now.",
          props: data.properties,
        },
      ]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Temporary network delay. Please try again in a few moments.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const promptSuggestions = [
    "10 Marla House in Lahore under 3.5 Crore",
    "Luxury Penthouse in Clifton Karachi",
    "1 Kanal Plot in DHA Islamabad",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div
          role="dialog"
          aria-label={t("ai")}
          className="w-[90vw] sm:w-96 h-[32rem] rounded-3xl bg-[#0D1412]/95 backdrop-blur-2xl border border-gold/30 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          {/* Widget Header */}
          <div className="px-5 py-4 bg-[#090D0B] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-emerald-light p-[1px]">
                <div className="w-full h-full bg-[#0E1412] rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-gold" />
                </div>
              </div>
              <div>
                <h3 className="font-serif text-sm text-sand-50 font-bold leading-none">
                  AI Property Concierge
                </h3>
                <span className="text-[10px] text-emerald-glow font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-glow animate-pulse" />
                  Online & Connected
                </span>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="p-1.5 rounded-full text-mute hover:text-white hover:bg-card transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs"
            aria-live="polite"
          >
            {msgs.map((m, idx) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-gold text-[#080B0A] font-medium rounded-tr-sm"
                        : "bg-[#131B18] text-sand-100 border border-white/[0.06] rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Linked Property Recommendations */}
                    {Boolean(m.props?.length) && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gold block">
                          Recommended Properties:
                        </span>
                        {m.props?.map((item) => (
                          <Link
                            key={item.id}
                            href={`/property/${item.id}`}
                            className="flex items-center justify-between gap-2 p-2 rounded-xl bg-black/40 hover:bg-black/70 border border-white/10 text-[11px] text-sand-50 transition group"
                          >
                            <span className="truncate">{item.title}</span>
                            <ArrowRight className="w-3 h-3 text-gold shrink-0 group-hover:translate-x-0.5 transition" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex items-center gap-1.5 text-mute text-xs bg-[#131B18] px-3 py-2 rounded-2xl w-24">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-2 bg-[#090D0B] border-t border-white/[0.04] flex gap-1.5 overflow-x-auto scrollbar-none">
            {promptSuggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(s)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-card hover:bg-cardMuted border border-line text-[10px] text-sand-200 hover:text-gold transition whitespace-nowrap"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#0A0E0C] border-t border-white/[0.06] flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={t("ask")}
              maxLength={500}
              className="flex-1 bg-[#131B18] border border-line rounded-xl px-3.5 py-2.5 text-xs text-sand-100 placeholder:text-mute outline-none focus:border-gold"
            />
            <button
              onClick={() => handleSend()}
              disabled={busy || !input.trim()}
              className="w-9 h-9 rounded-xl bg-gold hover:bg-gold-light text-[#080B0A] flex items-center justify-center transition disabled:opacity-40 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-[#080B0A]" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="group flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-gold via-gold/90 to-emerald-light text-[#080B0A] font-bold text-xs uppercase tracking-wider shadow-2xl shadow-gold/20 hover:scale-105 transition duration-300"
        >
          <Sparkles className="w-4 h-4 text-[#080B0A] animate-spin-slow" />
          <span>{t("ai")}</span>
        </button>
      )}
    </div>
  );
}
