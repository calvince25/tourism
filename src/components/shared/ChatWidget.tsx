"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Send,
  Bot,
  Sparkles,
  ChevronDown,
  Calendar,
  Clock,
  Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TourCard {
  id: string;
  name: string;
  slug: string;
  durationDays: number;
  priceKes?: number;
  priceUsd?: number;
  coverImageUrl?: string;
  destinations?: string;
  travelStyle?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  tourCards?: TourCard[];
  isStreaming?: boolean;
}

const QUICK_REPLIES = [
  { label: "🦁 Suggest a safari for me", text: "Can you suggest a safari that would suit me?" },
  { label: "🗓️ Best time to visit Kenya", text: "When is the best time to visit Kenya for a safari?" },
  { label: "💰 Budget-friendly tours", text: "What are your most affordable safari tours?" },
  { label: "🌍 Compare your top tours", text: "Can you compare your most popular safari tours?" },
];

// ─── Tour Card Component ───────────────────────────────────────────────────────

function TourCardItem({
  tour,
  onBook,
}: {
  tour: TourCard;
  onBook: (tour: TourCard) => void;
}) {
  return (
    <div className="bg-navy border border-white/10 rounded-2xl overflow-hidden flex-shrink-0 w-64 snap-start">
      {tour.coverImageUrl ? (
        <div className="relative h-32 bg-navy-dark overflow-hidden">
          <img
            src={tour.coverImageUrl}
            alt={tour.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          {tour.travelStyle && (
            <span className="absolute top-2 left-2 bg-accent/90 text-navy text-[10px] font-bold px-2 py-0.5 rounded-full">
              {tour.travelStyle}
            </span>
          )}
        </div>
      ) : (
        <div className="h-32 bg-gradient-to-br from-accent/20 to-navy-dark flex items-center justify-center">
          <Sparkles className="text-accent/40" size={32} />
        </div>
      )}
      <div className="p-3">
        <h4 className="font-bold text-white text-sm leading-tight line-clamp-2 mb-2">
          {tour.name}
        </h4>
        <div className="flex items-center gap-3 text-white/50 text-[11px] mb-3">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {tour.durationDays}d
          </span>
          {tour.destinations && (
            <span className="flex items-center gap-1 truncate">
              <span>📍</span>
              <span className="truncate">{tour.destinations.split(",")[0]}</span>
            </span>
          )}
        </div>
        {(tour.priceKes || tour.priceUsd) && (
          <p className="text-accent font-bold text-sm mb-3">
            {tour.priceUsd ? `From $${tour.priceUsd.toLocaleString()}` : `From KES ${tour.priceKes?.toLocaleString()}`}
          </p>
        )}
        <div className="flex gap-2">
          <Link
            href={`/tours/${tour.slug}`}
            className="flex-1 text-center text-[11px] font-bold py-1.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
            target="_blank"
          >
            View Tour
          </Link>
          <button
            onClick={() => onBook(tour)}
            className="flex-1 text-center text-[11px] font-bold py-1.5 rounded-xl bg-accent text-navy hover:bg-accent/90 transition-colors"
          >
            Enquire
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onBook,
}: {
  message: Message;
  onBook: (tour: TourCard) => void;
}) {
  const isUser = message.role === "user";

  // Simple markdown renderer for bold and bullet points
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      // Bold **text**
      const boldified = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      // Bullet points
      const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
      if (isBullet) {
        const content = boldified.replace(/^[\s*-]+/, "");
        return (
          <li
            key={i}
            className="ml-3 list-disc"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }
      return line ? (
        <p key={i} dangerouslySetInnerHTML={{ __html: boldified }} />
      ) : (
        <br key={i} />
      );
    });
  };

  return (
    <div className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot size={14} className="text-accent" />
        </div>
      )}
      <div className={`max-w-[85%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed space-y-1 ${
            isUser
              ? "bg-accent text-navy font-medium rounded-br-sm"
              : "bg-white/[0.06] border border-white/[0.08] text-white/90 rounded-bl-sm"
          }`}
        >
          {renderContent(message.content)}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-accent/60 animate-pulse ml-0.5 rounded-sm" />
          )}
        </div>

        {/* Tour Cards Carousel */}
        {message.tourCards && message.tourCards.length > 0 && (
          <div className="w-full overflow-x-auto flex gap-3 pb-2 snap-x snap-mandatory scrollbar-hide">
            {message.tourCards.map((tour) => (
              <TourCardItem key={tour.id} tour={tour} onBook={onBook} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Chat Widget ─────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm **Wema** 🌍, your WildpathAfrica travel guide.\n\nI can help you discover safari tours, explore destinations, answer questions, and guide you through booking. What kind of adventure are you dreaming of?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages, scrollToBottom]);

  const handleBookTour = (tour: TourCard) => {
    // Dispatch a custom event that the booking modal can listen to
    window.dispatchEvent(
      new CustomEvent("openBookingModal", {
        detail: { tourId: tour.id, itemName: tour.name },
      })
    );
    setIsOpen(false);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      setShowQuickReplies(false);
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      // Placeholder streaming message
      const assistantId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        isStreaming: true,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error("Chat request failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let tourCards: TourCard[] | undefined;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: accumulatedText, isStreaming: true }
                      : m
                  )
                );
              }
              if (parsed.tourCards) {
                tourCards = parsed.tourCards;
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }

        // Finalize the message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: accumulatedText, isStreaming: false, tourCards }
              : m
          )
        );
      } catch (error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Sorry, I had trouble connecting. Please try again, or contact us directly via WhatsApp.",
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-white/10 border border-white/20 backdrop-blur-md rotate-0"
            : "bg-gradient-to-br from-accent to-accent/70 hover:scale-110"
        }`}
        aria-label={isOpen ? "Close AI assistant" : "Open AI travel guide"}
      >
        {isOpen ? (
          <ChevronDown size={22} className="text-white" />
        ) : (
          <div className="relative">
            <Bot size={24} className="text-navy" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-navy animate-pulse" />
          </div>
        )}
      </button>

      {/* Tooltip (when closed) */}
      {!isOpen && (
        <div className="fixed bottom-[5.5rem] left-6 z-50 pointer-events-none">
          <div className="bg-navy border border-white/10 rounded-2xl px-3 py-2 text-xs text-white/70 shadow-xl whitespace-nowrap">
            💬 Ask Wema anything about safaris
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto z-50 w-auto sm:w-96 flex flex-col bg-navy-dark border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          style={{ maxHeight: "calc(100vh - 8rem)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/10 to-transparent border-b border-white/[0.06] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Wema — AI Safari Guide</p>
              <p className="text-[11px] text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                Online · WildpathAfrica only
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[280px]">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onBook={handleBookTour}
              />
            ))}

            {/* Quick Replies */}
            {showQuickReplies && messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.text}
                    onClick={() => sendMessage(qr.text)}
                    className="text-[11px] font-medium px-3 py-1.5 rounded-full border border-accent/30 text-accent/80 hover:bg-accent/10 hover:border-accent hover:text-accent transition-all"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && messages[messages.length - 1]?.isStreaming && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-2 items-center">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-accent" />
                </div>
                <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/[0.06] px-3 py-3 flex gap-2 items-center bg-navy/40"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tours, destinations, pricing…"
              disabled={isLoading}
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-accent text-navy flex items-center justify-center hover:bg-accent/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>

          {/* Disclaimer */}
          <p className="text-center text-[10px] text-white/20 pb-2 px-4">
            Wema answers questions about WildpathAfrica only.
          </p>
        </div>
      )}
    </>
  );
}
