"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ----------------------------------------------------
// Icons
// ----------------------------------------------------
function SearchIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ConsultIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function CompareIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

function PhoneIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function CameraIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function MicIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function ArrowLeftIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function SendIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

// ----------------------------------------------------
// Consultant Avatar Fallback Component
// ----------------------------------------------------
const ConsultantAvatar = ({ src, name, initials, avatarBg, sizeClass = "w-[197px] h-[197px]" }) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative rounded-full overflow-hidden ${sizeClass} flex-shrink-0 ${avatarBg} shadow-inner transition-transform duration-300 hover:rotate-1`}>
      {error || !src ? (
        <div className="w-full h-full flex items-center justify-center text-gray-800 font-extrabold text-[2.5rem] tracking-tight">
          {initials}
        </div>
      ) : (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-full select-none"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// Mock Database
// ----------------------------------------------------
const consultants = [
  {
    id: "kiyotaka",
    name: "Kiyotaka Ayanokoji",
    initials: "KA",
    avatarBg: "bg-[#ccc1f0]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/612546e3d982984c16a054bdbd03b3ff03383a13.png",
    greeting: "Hey Rakha! How can I help you today?",
  },
  {
    id: "kei",
    name: "Karuizawa Kei",
    initials: "KK",
    avatarBg: "bg-[#b4e5bc]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/7403f420667ef9a82ebc757070c7dcc9d60b9271.png",
    greeting: "Hi there! I'm Karuizawa Kei. Ready to find your ideal school?",
  },
  {
    id: "itadori",
    name: "Itadori Yuji",
    initials: "IY",
    avatarBg: "bg-[#f4ce9b]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/4b5f4ef1982ec6672e2503261eebd452dea5062f.png",
    greeting: "Ossu! Itadori here. Let me know what you need help with!",
  },
  {
    id: "gojo",
    name: "Gojo Satoru",
    initials: "GS",
    avatarBg: "bg-[#f3aba7]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/d74ddae4c52a715626fc67925c011a400bc1c19e.png",
    greeting: "Yo! Satoru Gojo in the house. What are we planning today?",
  },
  {
    id: "sakura",
    name: "Sakura Haruno",
    initials: "SH",
    avatarBg: "bg-[#f4ce9b]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/2337ccd88ba0c6ef8ecd3a92bff94d078aeb52b5.png",
    greeting: "Hello! Sakura here. How can I assist you with your academic path?",
  },
  {
    id: "atsumu",
    name: "Miya Atsumu",
    initials: "MA",
    avatarBg: "bg-[#b8dff2]",
    cardBg: "bg-[#e2edfc]",
    image: "http://localhost:3845/assets/ea33aa8af0fa153fce2d83ae11d595369dc64fee.png",
    greeting: "Hey! Atsumu here. Let's get your studies sorted out, yeah?",
  }
];

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export default function ConsultPage() {
  const [view, setView] = useState("dashboard"); // dashboard, chat
  const [selectedPro, setSelectedPro] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [callState, setCallState] = useState(null); // null, voice, video
  const [callTimer, setCallTimer] = useState(0);

  // Chat conversation state
  const [chatHistories, setChatHistories] = useState({});
  const [inputText, setInputText] = useState("Please find me a scholarship browww");
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef(null);

  // Timer effect for active call
  useEffect(() => {
    let interval;
    if (callState) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Scroll to bottom on new chat messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistories, isTyping, view]);

  // Get chat history for current selected consultant
  const getActiveHistory = () => {
    if (!selectedPro) return [];
    if (!chatHistories[selectedPro.id]) {
      // Initialize chat history with the initial greeting
      return [
        {
          id: 1,
          sender: "consultant",
          text: selectedPro.greeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    }
    return chatHistories[selectedPro.id];
  };

  const handleOpenModal = (pro) => {
    setSelectedPro(pro);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleStartChat = () => {
    setShowModal(false);
    setView("chat");
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedPro) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...getActiveHistory(), userMsg];
    setChatHistories({
      ...chatHistories,
      [selectedPro.id]: updatedHistory
    });

    const userQuery = inputText;
    setInputText("");
    setIsTyping(true);

    // Simulate AI Professional Response
    setTimeout(() => {
      let replyText = `Hey Rakha! That's a great goal. I'd love to help you find scholarships. What countries or fields of study are you thinking about?`;
      const queryLower = userQuery.toLowerCase();
      
      if (queryLower.includes("scholarship")) {
        replyText = `Absolutely, Rakha! There are excellent options like the MEXT Scholarship in Japan, AAS in Australia, or Fulbright in the US. What is your current grade/CGPA and field of interest?`;
      } else if (queryLower.includes("japan") || queryLower.includes("mext")) {
        replyText = `Japan is a fantastic choice! The MEXT Scholarship covers full tuition, airfare, and a monthly stipend. Let's prepare your research plan. Have you taken the JLPT exam?`;
      } else if (queryLower.includes("us") || queryLower.includes("america") || queryLower.includes("fulbright")) {
        replyText = `The US offers amazing graduate and undergraduate funding. We can target Ivy Leagues or top state colleges. Let's look at preparing your TOEFL/IELTS and SAT/GRE scores!`;
      } else if (queryLower.includes("grade") || queryLower.includes("cgpa") || queryLower.includes("gpa")) {
        replyText = `Excellent! Having solid grades makes you highly competitive. I will compile a list of fully-funded scholarships that match your academic background. Let's organize the essays!`;
      } else if (queryLower.includes("thank") || queryLower.includes("thanks")) {
        replyText = `You're very welcome, Rakha! Feel free to drop a call anytime using the buttons above if you want to walk through the documents.`;
      }

      const consultantReply = {
        id: Date.now() + 1,
        sender: "consultant",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories((prevHistories) => ({
        ...prevHistories,
        [selectedPro.id]: [...(prevHistories[selectedPro.id] || updatedHistory), consultantReply]
      }));
      setIsTyping(false);
    }, 1500);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col selection:bg-blue-100 selection:text-blue-800">
      
      {/* ---------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------- */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm z-40 relative border-b border-gray-100">
        <div className="flex items-center">
          <Link href="/">
            <img src="/img/Logo.png" alt="Logo" className="h-10 w-auto hover:opacity-90 transition-opacity" />
          </Link>
        </div>

        <div className="flex items-center gap-10">
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-bold text-gray-900">
            <Link href="/search" className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 border-b-2 border-transparent pb-1 -mb-[22px]">
              <SearchIcon className="w-[18px] h-[18px]" />
              Search
            </Link>
            <Link 
              href="/consult"
              onClick={(e) => {
                if (view !== "dashboard") {
                  e.preventDefault();
                  setView("dashboard");
                }
              }}
              className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1 -mb-[22px] transition-colors"
            >
              <ConsultIcon className="w-[18px] h-[18px]" />
              Consult
            </Link>
            <Link href="/compare" className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 border-b-2 border-transparent pb-1 -mb-[22px]">
              <CompareIcon className="w-[18px] h-[18px]" />
              Compare
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-blue-600 rounded-full border-[1.5px] border-blue-600 hover:bg-blue-50 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 text-sm font-bold text-white bg-[#0066FF] rounded-full hover:bg-blue-700 transition-colors shadow-md inline-block text-center">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* Dashboard View (Design 1: Consult with Pro 1) */}
      {/* ---------------------------------------------------- */}
      {view === "dashboard" && (
        <main className="flex-grow flex flex-col items-center px-4 md:px-12 py-16 max-w-7xl w-full mx-auto">
          
          <h1 className="text-[32px] md:text-[36px] font-light text-black tracking-tight mb-16 font-sans text-center mt-4">
            Consult with Professionals
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 w-full mt-4">
            {consultants.map((pro) => (
              <div
                key={pro.id}
                className="bg-[#e2edfc] rounded-[24px] p-8 flex flex-col items-center shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="mb-6 flex justify-center w-full">
                  <ConsultantAvatar
                    src={pro.image}
                    name={pro.name}
                    initials={pro.initials}
                    avatarBg={pro.avatarBg}
                    sizeClass="w-[197px] h-[197px]"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-black tracking-tight text-center mb-6">
                  {pro.name}
                </h3>
                <button
                  onClick={() => handleOpenModal(pro)}
                  className="text-xs font-semibold text-black hover:text-blue-600 underline underline-offset-4 cursor-pointer tracking-wider uppercase transition-colors"
                >
                  Consult Now
                </button>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ---------------------------------------------------- */}
      {/* Chat Interface (Design 3: Consult with Pro 2) */}
      {/* ---------------------------------------------------- */}
      {view === "chat" && selectedPro && (
        <main className="flex-grow flex flex-col md:flex-row relative">
          
          {/* Left profile summary section (visible on large screen) */}
          <div className="w-full md:w-[350px] bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center justify-start gap-6">
            <button
              onClick={() => setView("dashboard")}
              className="self-start flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to List
            </button>

            <div className="mt-8 flex flex-col items-center text-center">
              <ConsultantAvatar
                src={selectedPro.image}
                name={selectedPro.name}
                initials={selectedPro.initials}
                avatarBg={selectedPro.avatarBg}
                sizeClass="w-32 h-32 md:w-[160px] md:h-[160px]"
              />
              <h2 className="text-xl font-bold text-gray-900 mt-4 leading-tight">
                {selectedPro.name}
              </h2>
              <p className="text-sm text-blue-600 font-semibold mt-1">Certified Consultant</p>
              <p className="text-xs text-gray-400 mt-2 max-w-[200px] leading-relaxed">
                Specialized in higher education admissions and global scholarship programs.
              </p>
            </div>

            <div className="mt-auto w-full pt-6 border-t border-gray-200/60 hidden md:block">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                <span className="text-xs font-semibold text-gray-600">Active Consultation Session</span>
              </div>
            </div>
          </div>

          {/* Main chat window container */}
          <div className="flex-grow flex flex-col bg-white h-[calc(100vh-180px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
            
            {/* Top Bar for small screen / Call toggle */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
              <button
                onClick={() => setView("dashboard")}
                className="text-gray-500 p-1"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <span className="font-bold text-gray-900">{selectedPro.name}</span>
              <div className="w-8" />
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50">
              
              {/* Profile card aligned on top of messages in figma */}
              <div className="flex items-start gap-4 max-w-2xl">
                <ConsultantAvatar
                  src={selectedPro.image}
                  name={selectedPro.name}
                  initials={selectedPro.initials}
                  avatarBg={selectedPro.avatarBg}
                  sizeClass="w-12 h-12 md:w-16 md:h-16"
                />
                
                {/* Consultant greeting bubble (matches design 3 bubble style) */}
                <div className="relative">
                  <div className="bg-white text-black p-5 rounded-[24px] shadow-lg shadow-gray-200/50 border border-gray-100/60">
                    <p className="font-semibold text-lg md:text-[18.7px] leading-snug tracking-tight text-gray-900">
                      {selectedPro.greeting}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block ml-3">Consultant</span>
                </div>
              </div>

              {/* Chat history messages */}
              {getActiveHistory().slice(1).map((msg) => {
                const isUser = msg.sender === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <ConsultantAvatar
                        src={selectedPro.image}
                        name={selectedPro.name}
                        initials={selectedPro.initials}
                        avatarBg={selectedPro.avatarBg}
                        sizeClass="w-12 h-12"
                      />
                    )}
                    <div className="relative max-w-lg">
                      <div className={`p-4 rounded-[20px] shadow-sm text-sm md:text-base leading-relaxed ${isUser ? "bg-[#0066FF] text-white rounded-tr-none" : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"}`}>
                        {msg.text}
                      </div>
                      <span className={`text-[10px] text-gray-400 mt-1 block ${isUser ? "text-right mr-2" : "ml-2"}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Consultant Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-4">
                  <ConsultantAvatar
                    src={selectedPro.image}
                    name={selectedPro.name}
                    initials={selectedPro.initials}
                    avatarBg={selectedPro.avatarBg}
                    sizeClass="w-12 h-12"
                  />
                  <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 rounded-tl-none flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Bottom Actions + Input container */}
            <div className="bg-white p-6 border-t border-gray-100 flex flex-col items-center gap-4 z-10">
              
              {/* Call Buttons Row (Design 3: Video / Voice Call Pills) */}
              <div className="flex items-center gap-4 w-full justify-center max-w-2xl">
                
                {/* Consult via Video Call Button */}
                <button
                  onClick={() => setCallState("video")}
                  className="bg-[#106ee9] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-3 px-6 rounded-full w-1/2 text-white font-semibold text-[14px] cursor-pointer shadow-md shadow-blue-500/20"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Consult via Video Call</span>
                </button>

                {/* Consult via Voice Call Button */}
                <button
                  onClick={() => setCallState("voice")}
                  className="bg-white border-2 border-[#106ee9] text-[#106ee9] hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-3 px-6 rounded-full w-1/2 font-semibold text-[14px] cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Consult via Voice Call</span>
                </button>

              </div>

              {/* Chat Input Field Container */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-3 w-full max-w-2xl mt-1">
                <div className="flex-grow relative flex items-center">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-[#1b2559] placeholder-gray-400 font-semibold text-[14px] py-4 pl-6 pr-14 rounded-full transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 text-blue-500 hover:text-blue-700 p-1"
                    title="Send message"
                  >
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Voice Message Microphone Button */}
                <button
                  type="button"
                  onClick={() => {
                    setInputText("Please find me a scholarship browww");
                  }}
                  className="bg-[#106ee9] hover:bg-blue-700 text-white rounded-full p-4 flex-shrink-0 cursor-pointer shadow-md transition-transform hover:scale-105 active:scale-95"
                  title="Preset text input"
                >
                  <MicIcon className="w-5 h-5" />
                </button>
              </form>

            </div>
          </div>
        </main>
      )}

      {/* ---------------------------------------------------- */}
      {/* Modal Overlay (Design 2: Consult with Pro 1 Overlay) */}
      {/* ---------------------------------------------------- */}
      {showModal && selectedPro && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          
          <div className="bg-[#e2edfc] rounded-[34px] p-10 max-w-[980px] w-full flex flex-col items-center relative shadow-2xl shadow-blue-900/10 border border-white/40">
            
            {/* Close modal button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 p-2 cursor-pointer transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Large consultant avatar */}
            <div className="mb-6">
              <ConsultantAvatar
                src={selectedPro.image}
                name={selectedPro.name}
                initials={selectedPro.initials}
                avatarBg={selectedPro.avatarBg}
                sizeClass="w-[260px] h-[260px] md:w-[337px] md:h-[338px]"
              />
            </div>

            {/* Consultant name */}
            <h2 className="text-3xl md:text-[41px] font-semibold text-black tracking-tight text-center mb-8">
              {selectedPro.name}
            </h2>

            {/* Call / Chat Action Buttons (Design 2 Overlay Action layout) */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
              
              {/* Consult via Call button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  setCallState("voice");
                }}
                className="bg-[#106ee9] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 py-4 px-8 rounded-full text-white font-semibold text-lg md:text-[20px] cursor-pointer shadow-lg shadow-blue-500/20 w-full sm:w-auto min-w-[280px]"
              >
                <PhoneIcon className="w-6 h-6" />
                <span>Consult via Call</span>
              </button>

              {/* Consult via Chat button */}
              <button
                onClick={handleStartChat}
                className="bg-white border-[3px] border-[#106ee9] text-[#106ee9] hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold text-lg md:text-[20px] cursor-pointer w-full sm:w-auto min-w-[280px]"
              >
                <ConsultIcon className="w-6 h-6" />
                <span>Consult via Chat</span>
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Interactive Call Screens (Voice / Video Overlay Mocks) */}
      {/* ---------------------------------------------------- */}
      {callState && selectedPro && (
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
          
          {callState === "video" ? (
            // Video Call layout (Simulates active feed using full background)
            <div className="absolute inset-0 size-full overflow-hidden flex flex-col justify-between p-8">
              
              {/* Consultant Video Feed Mock */}
              <div className="absolute inset-0 bg-[#1e293b] flex items-center justify-center">
                {selectedPro.image ? (
                  <img
                    src={selectedPro.image}
                    alt={selectedPro.name}
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="text-[10rem] font-bold text-slate-800">{selectedPro.initials}</div>
                )}
              </div>

              {/* Self Video overlay (top right) */}
              <div className="absolute top-8 right-8 w-32 h-48 md:w-44 md:h-60 rounded-2xl border-2 border-white/20 bg-slate-800/80 backdrop-blur-md overflow-hidden shadow-2xl z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                  R
                </div>
                <span className="text-[10px] text-white/60 mt-2">Rakha (You)</span>
              </div>

              {/* Top call details */}
              <div className="relative z-10 flex flex-col items-start bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-start">
                <h3 className="font-bold text-lg md:text-xl text-white">{selectedPro.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-white/80 font-mono">{formatTimer(callTimer)}</span>
                </div>
              </div>

              {/* Controls (bottom) */}
              <div className="relative z-10 flex items-center justify-center gap-6 self-center bg-slate-950/70 backdrop-blur-lg border border-white/10 px-8 py-5 rounded-full shadow-2xl mb-8">
                <button className="p-4 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-full" title="Mute Microphone">
                  <MicIcon className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setCallState(null)}
                  className="p-5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-full shadow-lg shadow-red-600/30"
                  title="Hang Up"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 3.5C21 3.5 19.5 2 17 2C14 2 12 4 12 7V8.5C9 8.5 6 9.5 4 11.5C2 13.5 2 17.5 2 17.5L5 20.5L8.5 17L7.5 14C7.5 14 9.5 12 12 12V13.5C12 16.5 14 18.5 17 18.5C19.5 18.5 21 17 21 17L21 3.5Z" className="origin-center rotate-[135deg]" />
                  </svg>
                </button>
                <button className="p-4 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-full" title="Turn Camera Off">
                  <CameraIcon className="w-5 h-5 text-white" />
                </button>
              </div>

            </div>
          ) : (
            // Voice Call layout
            <div className="flex flex-col items-center justify-between h-full py-16 max-w-md w-full relative z-10">
              
              <div className="flex flex-col items-center mt-12">
                {/* Pulsating avatar background */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 scale-125 animate-ping" />
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 scale-150 animate-pulse" />
                  <ConsultantAvatar
                    src={selectedPro.image}
                    name={selectedPro.name}
                    initials={selectedPro.initials}
                    avatarBg={selectedPro.avatarBg}
                    sizeClass="w-40 h-40 md:w-48 md:h-48 border-4 border-slate-800"
                  />
                </div>
                
                <h3 className="text-2xl font-bold">{selectedPro.name}</h3>
                <p className="text-gray-400 text-sm mt-2">Consulting via Voice Call</p>
                <span className="text-blue-500 text-lg font-mono mt-4 block">{formatTimer(callTimer)}</span>
              </div>

              {/* Voice controls */}
              <div className="flex items-center gap-8 bg-slate-800/50 backdrop-blur-md px-8 py-5 border border-white/5 rounded-full shadow-xl">
                <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full" title="Mute">
                  <MicIcon className="w-5 h-5" />
                </button>
                
                {/* Red hangup button */}
                <button
                  onClick={() => setCallState(null)}
                  className="p-5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all rounded-full shadow-lg shadow-red-600/30"
                  title="Hang Up"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 3.5C21 3.5 19.5 2 17 2C14 2 12 4 12 7V8.5C9 8.5 6 9.5 4 11.5C2 13.5 2 17.5 2 17.5L5 20.5L8.5 17L7.5 14C7.5 14 9.5 12 12 12V13.5C12 16.5 14 18.5 17 18.5C19.5 18.5 21 17 21 17L21 3.5Z" className="origin-center rotate-[135deg]" />
                  </svg>
                </button>

                <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full" title="Speaker">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
                  </svg>
                </button>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* CSS Animations Injector */}
      {/* ---------------------------------------------------- */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
