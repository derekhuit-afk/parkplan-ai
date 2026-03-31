"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Send, Sparkles, ArrowLeft, Clock, DollarSign, Hotel, Map, RotateCcw } from "lucide-react";

const RESORT_NAMES: Record<string, string> = {
  wdw: "Walt Disney World",
  disneyland: "Disneyland Resort",
  paris: "Disneyland Paris",
  tokyo: "Tokyo Disney Resort",
  hongkong: "Hong Kong Disneyland",
  shanghai: "Shanghai Disney Resort",
  "universal-orlando": "Universal Orlando Resort",
};

const QUICK_PROMPTS = [
  { icon: Map, label: "Build my itinerary", prompt: "Build me a full day itinerary for my trip" },
  { icon: Clock, label: "Best ride order", prompt: "What order should I ride the attractions to minimize wait times?" },
  { icon: DollarSign, label: "Budget breakdown", prompt: "Give me a full budget breakdown for my trip including tickets, food, and hotel" },
  { icon: Hotel, label: "Hotel recommendations", prompt: "What are the best hotel options on and off-site for my budget?" },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

function PlanPageContent() {
  const searchParams = useSearchParams();
  const resortId = searchParams.get("resort") || "";
  const resortName = RESORT_NAMES[resortId] || "your park";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `🏰 Welcome to ParkPlan.ai! I'm your personal theme park AI.\n\nI see you're planning a trip to **${resortName === "your park" ? "a Disney or Universal resort" : resortName}**. I can help you build a complete itinerary, find the best ride order to minimize waits, break down your budget, and recommend hotels and dining.\n\nTo get started, tell me:\n- **Your travel dates** (or approximate timeframe)\n- **Group size & ages**\n- **Your top 3 must-do experiences**\n- **Your total budget** (optional)\n\nOr pick a quick start below! ✨`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setInput("");
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are ParkPlan.ai — a friendly, expert AI theme park trip planner. You specialize in Disney resorts (Walt Disney World, Disneyland, Disneyland Paris, Tokyo Disney Resort, Hong Kong Disneyland, Shanghai Disney Resort) and Universal Orlando Resort.

You help families and theme park enthusiasts plan incredible park days. You provide:
- Optimized itineraries based on crowd patterns and ride locations
- Budget breakdowns (tickets, food, hotels, extras)
- Hotel recommendations (on-site vs. off-site with pros/cons)
- Lightning Lane / Genie+ strategy advice
- Crowd level predictions and best visiting times
- Dining reservation tips and must-eat food recommendations
- Insider tips and hidden gems

${resortId ? `The user is planning a trip to ${RESORT_NAMES[resortId] || resortId}.` : ""}

Be warm, enthusiastic, and expert. Use emojis sparingly but effectively. Format responses with clear sections using **bold** for headers. Keep responses actionable and specific. You are NOT affiliated with Disney or Universal — you're an independent AI planning tool.`,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I hit a snag — please try again!";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, I ran into a connection issue. Please try again in a moment! 🎡",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      role: "assistant",
      content: `🏰 Fresh start! I'm ready to plan your perfect ${resortName === "your park" ? "theme park" : resortName} trip.\n\nWhat would you like to plan? ✨`,
    }]);
    setInput("");
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "#0D1B2A" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 sm:px-6 py-3 border-b flex-shrink-0"
        style={{
          borderColor: "rgba(245,200,66,0.12)",
          background: "rgba(13,27,42,0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <ArrowLeft size={16} className="text-park-mist group-hover:text-park-gold transition-colors" />
          <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
            <MapPin size={13} className="text-park-night" />
          </div>
          <span className="font-display font-700 text-lg text-park-cream">
            Park<span className="text-park-gold">Plan</span>
            <span className="text-park-mist text-xs font-body font-normal ml-1">.ai</span>
          </span>
        </Link>

        {resortName !== "your park" && (
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body font-500"
            style={{
              background: "rgba(245,200,66,0.1)",
              border: "1px solid rgba(245,200,66,0.2)",
              color: "#F5C842",
            }}
          >
            <Sparkles size={11} />
            {resortName}
          </div>
        )}

        <button
          onClick={resetChat}
          className="flex items-center gap-1.5 text-xs text-park-mist hover:text-park-gold transition-colors p-2 rounded-lg hover:bg-white/5"
        >
          <RotateCcw size={14} />
          <span className="hidden sm:block">New Plan</span>
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                  <Sparkles size={12} className="text-park-night" />
                </div>
              )}
              <div
                className="max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl font-body text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "rgba(245,200,66,0.15)",
                        border: "1px solid rgba(245,200,66,0.25)",
                        color: "#FFF8E7",
                        borderRadius: "18px 18px 4px 18px",
                      }
                    : {
                        background: "rgba(30,58,95,0.5)",
                        border: "1px solid rgba(30,58,95,0.8)",
                        color: "#B8C9D9",
                        borderRadius: "18px 18px 18px 4px",
                      }
                }
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                <Sparkles size={12} className="text-park-night" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-2"
                style={{
                  background: "rgba(30,58,95,0.5)",
                  border: "1px solid rgba(30,58,95,0.8)",
                  borderRadius: "18px 18px 18px 4px",
                }}
              >
                {[0, 150, 300].map((d) => (
                  <div
                    key={d}
                    className="w-2 h-2 rounded-full bg-park-gold animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts — show only on first message */}
      {messages.length === 1 && (
        <div className="px-4 sm:px-6 pb-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2">
            {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => sendMessage(prompt)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body font-500 text-park-mist hover:text-park-gold border transition-all hover:border-park-gold/40 hover:bg-white/5 text-left"
                style={{ borderColor: "rgba(30,58,95,0.8)" }}
              >
                <Icon size={13} className="text-park-gold flex-shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 border-t flex-shrink-0"
        style={{ borderColor: "rgba(245,200,66,0.1)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="flex items-end gap-3 rounded-2xl p-3 border"
            style={{
              background: "rgba(26,46,69,0.6)",
              borderColor: "rgba(245,200,66,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Tell me about your trip — dates, group size, must-dos..."
              className="flex-1 bg-transparent border-none outline-none text-park-cream text-sm font-body resize-none placeholder-park-mist/50 leading-relaxed"
              rows={1}
              style={{ maxHeight: "120px" }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-shrink-0 disabled:opacity-30"
              style={{
                background: loading || !input.trim()
                  ? "rgba(30,58,95,0.8)"
                  : "linear-gradient(135deg, #F5C842, #E8A020)",
              }}
            >
              <Send size={15} className={loading || !input.trim() ? "text-park-mist" : "text-park-night"} />
            </button>
          </div>
          <p className="text-[10px] text-park-mist/40 text-center mt-2 font-body">
            AI-powered · Free forever · Not affiliated with Disney or Universal
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-park-night">
        <div className="text-park-gold animate-pulse font-display text-xl">Loading...</div>
      </div>
    }>
      <PlanPageContent />
    </Suspense>
  );
}
