"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileModal from "../../components/ProfileModal";

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

// Helper for dynamic avatars without images
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarBg = (name) => {
  const colors = [
    "bg-[#ccc1f0] text-[#4c3b9b]",
    "bg-[#b4e5bc] text-[#1e5c27]",
    "bg-[#f4ce9b] text-[#784e1b]",
    "bg-[#f3aba7] text-[#8c2621]",
    "bg-[#b8dff2] text-[#1b6285]",
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export default function ConsultPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Load user session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const email = localStorage.getItem("userEmail") || "";
        setUserEmail(email);

        // Fetch userId and details by email
        fetch(`/api/user-info?email=${encodeURIComponent(email)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.userId) {
              setUserId(data.userId);
              setUserName(data.name);
              localStorage.setItem("userId", data.userId);
              localStorage.setItem("userName", data.name);
            }
          })
          .catch((err) => console.error("Error fetching user info:", err));
      } else {
        setShowLoginModal(true);
      }
    }
  }, []);

  // Redirect countdown if not logged in
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

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserEmail("");
    setUserId(null);
    setUserName("");
  };

  const isConsultant = isLoggedIn && userEmail && userEmail.endsWith("@interlect.com");

  // Students View States
  const [view, setView] = useState("dashboard"); // dashboard, chat
  const [consultantList, setConsultantList] = useState([]);
  const [selectedPro, setSelectedPro] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Consultants Dashboard States
  const [conversations, setConversations] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Shared Chat/Call States
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [callState, setCallState] = useState(null); // null, voice, video
  const [callTimer, setCallTimer] = useState(0);

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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, view, selectedStudent]);

  // Student View: Fetch consultant list from database
  useEffect(() => {
    if (isLoggedIn && !isConsultant) {
      fetch("/api/consultants")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setConsultantList(data);
          }
        })
        .catch((err) => console.error("Error fetching consultants list:", err));
    }
  }, [isLoggedIn, isConsultant]);

  // Student View: Poll chat history
  useEffect(() => {
    if (isLoggedIn && !isConsultant && selectedPro && view === "chat" && userId) {
      const loadMessages = () => {
        fetch(`/api/consult/messages?userId=${userId}&consultantId=${selectedPro.id}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setChatMessages(data);
            }
          })
          .catch((err) => console.error("Error loading student messages:", err));
      };

      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, isConsultant, selectedPro, view, userId]);

  // Consultant View: Poll active conversations list
  useEffect(() => {
    if (isLoggedIn && isConsultant) {
      const loadConversations = () => {
        fetch(`/api/consult/conversations?email=${encodeURIComponent(userEmail)}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setConversations(data);
            }
          })
          .catch((err) => console.error("Error loading conversations list:", err));
      };

      loadConversations();
      const interval = setInterval(loadConversations, 4000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, isConsultant, userEmail]);

  // Consultant View: Poll active student chat history
  useEffect(() => {
    if (isLoggedIn && isConsultant && selectedStudent) {
      const loadMessages = () => {
        fetch(`/api/consult/messages?userId=${selectedStudent.userId}&consultantEmail=${encodeURIComponent(userEmail)}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) {
              setChatMessages(data);
            }
          })
          .catch((err) => console.error("Error loading consultant messages:", err));
      };

      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, isConsultant, selectedStudent, userEmail]);

  // Message sending handlers
  const handleStudentSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedPro || !userId) return;

    const msgText = inputText;
    setInputText("");

    fetch("/api/consult/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        consultantId: selectedPro.id,
        message: msgText,
        sender: "user",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: data.chatId,
              userId,
              consultantId: selectedPro.id,
              message: msgText,
              sender: "user",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((err) => console.error("Error sending student message:", err));
  };

  const handleConsultantSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedStudent || !userEmail) return;

    const msgText = inputText;
    setInputText("");

    fetch("/api/consult/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: selectedStudent.userId,
        consultantEmail: userEmail,
        message: msgText,
        sender: "consultant",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: data.chatId,
              userId: selectedStudent.userId,
              consultantId: data.consultantId,
              message: msgText,
              sender: "consultant",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      })
      .catch((err) => console.error("Error sending consultant message:", err));
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOpenModal = (pro) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setSelectedPro(pro);
    setShowModal(true);
  };

  const handleStartChat = () => {
    setShowModal(false);
    setView("chat");
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
            <Link href="/search" className="relative flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600">
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
              className="relative flex items-center gap-2 text-blue-600 transition-colors"
            >
              <ConsultIcon className="w-[18px] h-[18px]" />
              Consult
              <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-blue-600" />
            </Link>
            <Link href="/compare" className="relative flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600">
              <CompareIcon className="w-[18px] h-[18px]" />
              Compare
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-sm font-semibold text-gray-700 hover:text-[#0066FF] transition-colors cursor-pointer"
                >
                  {userName || userEmail}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 text-sm font-bold text-red-600 rounded-full border-[1.5px] border-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-blue-600 rounded-full border-[1.5px] border-blue-600 hover:bg-blue-50 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-6 py-2.5 text-sm font-bold text-white bg-[#0066FF] rounded-full hover:bg-blue-700 transition-colors shadow-md inline-block text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* 1. Consultant User Dashboard (Chat List Page) */}
      {/* ---------------------------------------------------- */}
      {isConsultant ? (
        <main className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
          {/* Left panel: student conversations */}
          <div className="w-full md:w-[350px] bg-slate-50 border-r border-gray-200 flex flex-col h-full shrink-0">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Student Chats</h2>
              <p className="text-xs text-gray-400 mt-1">Select a student inquiry to begin</p>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400">
                  <svg className="w-12 h-12 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm">No active conversations found.</p>
                </div>
              ) : (
                conversations.map((chat) => {
                  const initials = getInitials(chat.userName);
                  const isSelected = selectedStudent && selectedStudent.userId === chat.userId;
                  const isLastMsgFromUser = chat.sender === "user";
                  return (
                    <button
                      key={chat.userId}
                      onClick={() => {
                        setSelectedStudent(chat);
                        setChatMessages([]);
                      }}
                      className={`w-full text-left p-4 rounded-2xl flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10" 
                          : "bg-white hover:bg-slate-100 border border-gray-100 text-gray-800"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 shadow-inner ${
                        isSelected ? "bg-white/25 text-white" : getAvatarBg(chat.userName)
                      }`}>
                        {initials}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm truncate">{chat.userName}</span>
                          <span className={`text-[10px] shrink-0 font-mono ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-1 ${
                          isSelected 
                            ? "text-white/80" 
                            : isLastMsgFromUser ? "text-blue-600 font-semibold" : "text-gray-500"
                        }`}>
                          {chat.message}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right panel: Active chat window */}
          <div className="flex-grow flex flex-col bg-white h-full relative">
            {selectedStudent ? (
              <>
                {/* Chat Top bar */}
                <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-[16px]">{selectedStudent.userName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedStudent.userEmail}</p>
                  </div>
                  <div className="bg-green-50 text-green-600 border border-green-100 rounded-full px-4 py-1 text-xs font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Student Inquiry
                  </div>
                </div>

                {/* Messages scrollarea */}
                <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-slate-50/40">
                  {chatMessages.map((msg) => {
                    const isConsultantMsg = msg.sender === "consultant";
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${isConsultantMsg ? "justify-end" : "justify-start"}`}
                      >
                        {!isConsultantMsg && (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${getAvatarBg(selectedStudent.userName)}`}>
                            {getInitials(selectedStudent.userName)}
                          </div>
                        )}
                        <div className="max-w-lg">
                          <div className={`p-4 rounded-[20px] shadow-sm text-sm leading-relaxed ${
                            isConsultantMsg 
                              ? "bg-[#0066FF] text-white rounded-tr-none" 
                              : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"
                          }`}>
                            {msg.message}
                          </div>
                          <span className={`text-[10px] text-gray-400 mt-1 block ${isConsultantMsg ? "text-right mr-2" : "ml-2"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input bar */}
                <div className="p-6 border-t border-gray-100">
                  <form onSubmit={handleConsultantSendMessage} className="flex items-center gap-3 w-full max-w-4xl mx-auto">
                    <div className="flex-grow relative flex items-center">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Reply to ${selectedStudent.userName}...`}
                        className="w-full bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-[#1b2559] placeholder-gray-400 font-semibold text-[14px] py-4 pl-6 pr-14 rounded-full transition-all"
                      />
                      <button
                        type="submit"
                        className="absolute right-4 text-[#0066FF] hover:text-blue-700 p-1"
                        title="Send message"
                      >
                        <SendIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <ConsultIcon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Student Consultation Dashboard</h3>
                <p className="text-sm text-gray-400 max-w-sm">
                  Select a student conversation from the sidebar list to view message history and respond.
                </p>
              </div>
            )}
          </div>
        </main>
      ) : (
        /* ---------------------------------------------------- */
        /* 2. Regular Student User Page */
        /* ---------------------------------------------------- */
        <>
          {/* Dashboard View */}
          {view === "dashboard" && (
            <main className="flex-grow flex flex-col items-center px-4 md:px-12 py-16 max-w-7xl w-full mx-auto">
              <h1 className="text-[32px] md:text-[36px] font-bold text-gray-900 tracking-tight mb-16 text-center mt-4">
                Consult with Professionals
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12 w-full mt-4">
                {consultantList.map((pro) => {
                  const initials = getInitials(pro.name);
                  return (
                    <div
                      key={pro.id}
                      className="bg-[#e2edfc] rounded-[24px] p-8 flex flex-col items-center shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 transform hover:-translate-y-1 group"
                    >
                      {/* CSS-based dynamic avatar instead of image file */}
                      <div className={`w-[197px] h-[197px] rounded-full flex items-center justify-center font-bold text-[3rem] shadow-inner mb-6 transition-transform duration-300 group-hover:scale-105 ${getAvatarBg(pro.name)}`}>
                        {initials}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight text-center mb-1">
                        {pro.name}
                      </h3>
                      
                      <p className="text-sm text-blue-600 font-semibold mb-3">{pro.expertise}</p>
                      
                      <div className="flex items-center gap-1 mb-6">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold text-gray-700">{pro.rating.toFixed(1)}</span>
                      </div>

                      <button
                        onClick={() => handleOpenModal(pro)}
                        className="text-xs font-semibold text-black hover:text-[#0066FF] underline underline-offset-4 cursor-pointer tracking-wider uppercase transition-colors"
                      >
                        Consult Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </main>
          )}

          {/* Student Chat Interface */}
          {view === "chat" && selectedPro && (
            <main className="flex-grow flex flex-col md:flex-row relative">
              {/* Left sidebar profile summary */}
              <div className="w-full md:w-[350px] bg-slate-50 border-r border-gray-150 p-8 flex flex-col items-center justify-start gap-6">
                <button
                  onClick={() => setView("dashboard")}
                  className="self-start flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to List
                </button>

                <div className="mt-8 flex flex-col items-center text-center">
                  <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full flex items-center justify-center font-bold text-[2.5rem] shadow-inner mb-4 ${getAvatarBg(selectedPro.name)}`}>
                    {getInitials(selectedPro.name)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {selectedPro.name}
                  </h2>
                  <p className="text-sm text-blue-600 font-semibold mt-1">Certified Consultant</p>
                  <p className="text-xs text-gray-400 mt-2 max-w-[200px] leading-relaxed">
                    Specialized in {selectedPro.expertise} and global educational counselling.
                  </p>
                </div>

                <div className="mt-auto w-full pt-6 border-t border-gray-200/60 hidden md:block">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                    <span className="text-xs font-semibold text-gray-600">Active Consultation Session</span>
                  </div>
                </div>
              </div>

              {/* Chat window panel */}
              <div className="flex-grow flex flex-col bg-white h-[calc(100vh-180px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
                {/* Mobile Top Bar */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100">
                  <button onClick={() => setView("dashboard")} className="text-gray-500 p-1">
                    <ArrowLeftIcon className="w-6 h-6" />
                  </button>
                  <span className="font-bold text-gray-900">{selectedPro.name}</span>
                  <div className="w-8" />
                </div>

                {/* Conversation area */}
                <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-6 bg-slate-50/50">
                  {/* Greeting Bubble */}
                  <div className="flex items-start gap-4 max-w-2xl">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${getAvatarBg(selectedPro.name)}`}>
                      {getInitials(selectedPro.name)}
                    </div>
                    
                    <div className="relative">
                      <div className="bg-white text-black p-5 rounded-[24px] shadow-lg shadow-gray-200/50 border border-gray-100/60">
                        <p className="font-semibold text-lg md:text-[18.7px] leading-snug tracking-tight text-gray-900">
                          Hello! I am {selectedPro.name}, specializing in {selectedPro.expertise}. How can I assist you with your admissions search today?
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block ml-3">Consultant</span>
                    </div>
                  </div>

                  {/* Message History */}
                  {chatMessages.map((msg) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-4 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shrink-0 ${getAvatarBg(selectedPro.name)}`}>
                            {getInitials(selectedPro.name)}
                          </div>
                        )}
                        <div className="relative max-w-lg">
                          <div className={`p-4 rounded-[20px] shadow-sm text-sm md:text-base leading-relaxed ${
                            isUser 
                              ? "bg-[#0066FF] text-white rounded-tr-none" 
                              : "bg-white text-gray-900 border border-gray-100 rounded-tl-none"
                          }`}>
                            {msg.message}
                          </div>
                          <span className={`text-[10px] text-gray-400 mt-1 block ${isUser ? "text-right mr-2" : "ml-2"}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Actions + Input bar */}
                <div className="bg-white p-6 border-t border-gray-100 flex flex-col items-center gap-4 z-10">
                  <div className="flex items-center gap-4 w-full justify-center max-w-2xl">
                    <button
                      onClick={() => setCallState("video")}
                      className="bg-[#0066FF] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-3 px-6 rounded-full w-1/2 text-white font-semibold text-[14px] cursor-pointer shadow-md shadow-blue-500/20"
                    >
                      <CameraIcon className="w-4 h-4" />
                      <span>Consult via Video Call</span>
                    </button>

                    <button
                      onClick={() => setCallState("voice")}
                      className="bg-white border-2 border-[#0066FF] text-[#0066FF] hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-3 px-6 rounded-full w-1/2 font-semibold text-[14px] cursor-pointer"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      <span>Consult via Voice Call</span>
                    </button>
                  </div>

                  <form onSubmit={handleStudentSendMessage} className="flex items-center gap-3 w-full max-w-2xl mt-1">
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
                  </form>
                </div>
              </div>
            </main>
          )}

          {/* Modal Overlay for Student selection */}
          {showModal && selectedPro && (
            <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#e2edfc] rounded-[34px] p-10 max-w-[980px] w-full flex flex-col items-center relative shadow-2xl shadow-blue-900/10 border border-white/40">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 p-2 cursor-pointer transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-6">
                  <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center font-bold text-[5rem] shadow-inner ${getAvatarBg(selectedPro.name)}`}>
                    {getInitials(selectedPro.name)}
                  </div>
                </div>

                <h2 className="text-3xl md:text-[41px] font-bold text-gray-900 tracking-tight text-center mb-2">
                  {selectedPro.name}
                </h2>
                
                <p className="text-md text-blue-600 font-semibold mb-8">{selectedPro.expertise}</p>

                <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setCallState("voice");
                    }}
                    className="bg-[#0066FF] hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 py-4 px-8 rounded-full text-white font-semibold text-lg md:text-[20px] cursor-pointer shadow-lg shadow-blue-500/20 w-full sm:w-auto min-w-[280px]"
                  >
                    <PhoneIcon className="w-6 h-6" />
                    <span>Consult via Call</span>
                  </button>

                  <button
                    onClick={handleStartChat}
                    className="bg-white border-[3px] border-[#0066FF] text-[#0066FF] hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold text-lg md:text-[20px] cursor-pointer w-full sm:w-auto min-w-[280px]"
                  >
                    <ConsultIcon className="w-6 h-6" />
                    <span>Consult via Chat</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Call Screens (Voice / Video Overlay Mocks) */}
          {callState && selectedPro && (
            <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white animate-fade-in">
              {callState === "video" ? (
                /* Video Call layout */
                <div className="absolute inset-0 size-full overflow-hidden flex flex-col justify-between p-8">
                  <div className="absolute inset-0 bg-[#1e293b] flex items-center justify-center">
                    <div className="text-[10rem] font-bold text-slate-800 opacity-60">
                      {getInitials(selectedPro.name)}
                    </div>
                  </div>

                  {/* Self Video overlay */}
                  <div className="absolute top-8 right-8 w-32 h-48 md:w-44 md:h-60 rounded-2xl border-2 border-white/20 bg-slate-800/80 backdrop-blur-md overflow-hidden shadow-2xl z-10 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-inner">
                      {getInitials(userName || "Student")}
                    </div>
                    <span className="text-[10px] text-white/60 mt-2">{userName || "You"}</span>
                  </div>

                  {/* Top call details */}
                  <div className="relative z-10 flex flex-col items-start bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 self-start">
                    <h3 className="font-bold text-lg md:text-xl text-white">{selectedPro.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs text-white/80 font-mono">{formatTimer(callTimer)}</span>
                    </div>
                  </div>

                  {/* Controls */}
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
                /* Voice Call layout */
                <div className="flex flex-col items-center justify-between h-full py-16 max-w-md w-full relative z-10">
                  <div className="flex flex-col items-center mt-12">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 scale-125 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-blue-500/10 scale-150 animate-pulse" />
                      <div className={`w-40 h-40 md:w-48 md:h-48 border-4 border-slate-800 rounded-full flex items-center justify-center font-bold text-[4rem] shadow-inner ${getAvatarBg(selectedPro.name)}`}>
                        {getInitials(selectedPro.name)}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold">{selectedPro.name}</h3>
                    <p className="text-gray-400 text-sm mt-2">Consulting via Voice Call</p>
                    <span className="text-blue-500 text-lg font-mono mt-4 block">{formatTimer(callTimer)}</span>
                  </div>

                  <div className="flex items-center gap-8 bg-slate-800/50 backdrop-blur-md px-8 py-5 border border-white/5 rounded-full shadow-xl">
                    <button className="p-4 bg-slate-700 hover:bg-slate-600 rounded-full" title="Mute">
                      <MicIcon className="w-5 h-5" />
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
        </>
      )}

      {/* CSS Animations Injector */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border-2 border-gray-100 rounded-[32px] shadow-[0px_20px_50px_rgba(0,0,0,0.15)] max-w-md w-full p-8 relative flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Login Required
            </h3>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              You must log in to consult with our professionals. Redirecting you to the login page in{" "}
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
      {/* Profile Edit Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userId={userId}
        initialName={userName}
        initialEmail={userEmail}
        onUpdateSuccess={(updatedName, updatedEmail) => {
          setUserName(updatedName);
          setUserEmail(updatedEmail);
          localStorage.setItem("userEmail", updatedEmail);
          localStorage.setItem("userName", updatedName);
        }}
      />
    </div>
  );
}
