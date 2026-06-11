"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AIChatWidget({ isLoggedIn }) {
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: "greet",
      role: "assistant",
      content: "Hello! I'm your education consultant AI. How can I help you find your dream university today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatTyping, showChat]);

  useEffect(() => {
    if (showLoginModal) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push("/login");
      }
    }
  }, [showLoginModal, countdown, router]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (!chatInputText.trim()) return;

    const userText = chatInputText;
    setChatInputText("");
    
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatTyping(true);

    try {
      const conversationContext = [...chatHistory, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: conversationContext })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: data.response || "I didn't receive a response.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsChatTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4 text-black">
        {/* Chat Window Popup */}
        {showChat && (
          <div className="w-[420px] max-w-[92vw] h-[580px] max-h-[80vh] bg-white border-2 border-gray-100 rounded-[32px] shadow-[0px_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden transition-all duration-300 animate-fade-in mb-2">
            {/* Header */}
            <div className="bg-[#0066FF] px-6 py-5 flex items-center justify-between text-white shadow-md">
              <div>
                <h3 className="text-lg font-bold tracking-tight">AI Assistant</h3>
                <p className="text-xs text-white/80 mt-0.5 font-medium">Online | Responds instantly</p>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                title="Minimize Chat"
                type="button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-slate-50/50 flex flex-col gap-4">
              {chatHistory.map((msg) => {
                const isAI = msg.role === "assistant";
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isAI ? "self-start" : "self-end"}`}
                  >
                    <div 
                      className={`p-4 text-sm leading-relaxed shadow-sm transition-all ${
                        isAI 
                          ? "bg-white border border-gray-100 text-gray-800 rounded-[22px] rounded-tl-none" 
                          : "bg-[#0066FF] text-white rounded-[22px] rounded-tr-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1 px-1 ${isAI ? "self-start" : "self-end"}`}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* Typing Shimmer Indicator */}
              {isChatTyping && (
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="bg-white border border-gray-100 rounded-[22px] rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3">
              <input
                type="text"
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow px-5 py-3 bg-gray-50 border border-gray-100 rounded-full text-[14px] outline-none focus:border-[#0066FF] focus:bg-white text-gray-800 placeholder-gray-400 transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!chatInputText.trim() || isChatTyping}
                className="bg-[#0066FF] hover:bg-blue-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:scale-100"
              >
                <svg className="w-5 h-5 transform rotate-90 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        )}

        {/* Toggle FAB Button */}
        <button
          onClick={() => {
            if (!isLoggedIn) {
              setShowLoginModal(true);
            } else {
              setShowChat(!showChat);
            }
          }}
          className="w-16 h-16 bg-[#0066FF] hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-[0px_10px_30px_rgba(0,102,255,0.3)] transition-all cursor-pointer hover:scale-105 active:scale-95 border border-blue-400/20"
          title={showChat ? "Close Chat" : "Chat with AI Assistant"}
          type="button"
        >
          {showChat ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-gray-100 rounded-[32px] shadow-[0px_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full p-8 relative flex flex-col items-center text-center animate-slide-up">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Login Required
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              You must log in to use the AI Assistant. Redirecting you to the login page in{" "}
              <span className="font-extrabold text-[#0066FF] text-base">{countdown}</span> seconds...
            </p>
            
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-[#0066FF] text-white py-3.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors shadow-md active:scale-95 duration-150 cursor-pointer"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}
