"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEventStore } from "@/lib/store/event-store";
import {
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Trash2,
  MessageSquare,
  Bot,
  User,
  Zap,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "💡 Rebalance: reduce catering by 10% and add to florals",
  "⏱️ What milestones are on the critical path?",
  "📋 Audit catering RFP for hidden delivery fees",
  "🎨 Suggest Rajasthani royal lighting ideas",
];

export function AiChatWindow() {
  const { event, budget, timeline, concept } = useEventStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content:
        "Namaste! I'm CelebrAI Copilot, powered by Gemini AI. I'm actively monitoring your event plan, dynamic budget vector, and timeline DAG. How can I assist you with your celebration?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = (userPrompt ?? input).trim();
    if (!textToSend || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Build event context summary for Gemini
    const eventContext = event
      ? `Event Name: ${event.name}
Event Type: ${event.type}
Event Date: ${event.date}
Location: ${event.location.venue ?? ""}, ${event.location.city}
Guest Count: ${event.guestCount}
Total Budget: ${budget ? `${budget.currency} ${budget.totalBudget.toLocaleString()}` : "N/A"}
Critical Path Nodes: ${timeline?.criticalPath ? timeline.criticalPath.join(", ") : "None"}
Aesthetic Style: ${concept ? concept.primaryStyle : "N/A"}`
      : undefined;

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantPlaceholderId,
        role: "assistant",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          eventContext,
        }),
      });

      if (!res.ok) throw new Error("Failed to stream response from Gemini");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          streamedText += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantPlaceholderId ? { ...m, content: streamedText } : m
            )
          );
        }
      }
    } catch (err) {
      console.error("[AiChatWindow] Chat stream error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantPlaceholderId
            ? {
                ...m,
                content:
                  "I am operating in offline resilient mode. Feel free to ask about budget rebalancing, critical path milestones, or vendor checklists!",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "fresh-welcome",
        role: "assistant",
        content: "Chat cleared. What aspect of your celebration should we work on next?",
        timestamp: "Just now",
      },
    ]);
  };

  return (
    <>
      {/* ─── Floating Trigger Button (When Closed) ─── */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-3.5 text-white shadow-2xl shadow-violet-500/40 ring-4 ring-white/80 transition-all hover:scale-105 hover:shadow-violet-500/60 active:scale-95 group"
          aria-label="Open AI Copilot Window"
        >
          <div className="relative flex h-6 w-6 items-center justify-center">
            <Sparkles className="h-5 w-5 animate-pulse text-gold-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="text-sm font-semibold tracking-wide">Ask CelebrAI</span>
        </button>
      )}

      {/* ─── Floating AI Window (When Open) ─── */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white transition-all duration-300 ease-in-out border border-slate-200/90 shadow-2xl rounded-2xl overflow-hidden ${
            isExpanded
              ? "bottom-4 right-4 w-[calc(100vw-2rem)] sm:w-[650px] h-[calc(100vh-2rem)] max-h-[850px]"
              : isMinimized
              ? "bottom-6 right-6 w-80 h-14"
              : "bottom-6 right-6 w-[calc(100vw-3rem)] sm:w-[440px] h-[580px] max-h-[82vh]"
          }`}
          style={{ backdropFilter: "blur(20px)" }}
        >
          {/* Window Header */}
          <div className="flex h-14 items-center justify-between border-b border-slate-100 bg-gradient-to-r from-slate-900 via-violet-950 to-slate-900 px-4 text-white select-none">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 shadow-sm text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight">CelebrAI Copilot</span>
                  <span className="rounded bg-violet-400/20 px-1 py-0.2 text-[9px] font-semibold text-violet-300 border border-violet-400/30">
                    Flash 3.8
                  </span>
                </div>
                {event && !isMinimized && (
                  <span className="text-[10px] text-slate-400 truncate max-w-[190px]">
                    Context: {event.name}
                  </span>
                )}
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-slate-400">
              {!isMinimized && (
                <>
                  <button
                    onClick={clearChat}
                    className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:inline-flex rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                    title={isExpanded ? "Restore Size" : "Expand Window"}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </>
              )}

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="rounded p-1 hover:bg-white/10 hover:text-white transition-colors"
                title={isMinimized ? "Expand Window" : "Minimize"}
              >
                {isMinimized ? (
                  <ChevronDown className="h-4 w-4 rotate-180" />
                ) : (
                  <Minus className="h-3.5 w-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded p-1 hover:bg-rose-500/80 hover:text-white transition-colors"
                title="Close Window"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Window Body (When Not Minimized) */}
          {!isMinimized && (
            <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 text-xs sm:text-sm ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700 mt-0.5">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-violet-600 text-white rounded-br-none"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <span
                        className={`mt-1 block text-[9px] ${
                          msg.role === "user" ? "text-violet-200 text-right" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.role === "user" && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Streaming Indicator */}
                {isStreaming && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 pl-9 italic">
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-violet-600" />
                    <span>Gemini is generating response...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              {messages.length <= 2 && (
                <div className="px-4 pb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Quick Suggestions
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-xs text-slate-600 bg-white hover:bg-violet-50 hover:text-violet-700 border border-slate-200 rounded-lg p-2 transition-colors flex items-center justify-between group shadow-2xs"
                      >
                        <span className="truncate">{prompt}</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 shrink-0 text-violet-600 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="border-t border-slate-200 bg-white p-3 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask CelebrAI to adjust budget, reschedule DAG..."
                  disabled={isStreaming}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm hover:bg-violet-700 active:bg-violet-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}

