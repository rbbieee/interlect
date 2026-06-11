"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfileModal from '../components/ProfileModal';


function FadeInSection({ children }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-[1000ms] ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
}

function AnimatedNumber({ value }) {
  const [current, setCurrent] = useState(0);
  const domRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    const duration = 2000; // 2 seconds

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out quartic (very slow deceleration near the end)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.floor(easeProgress * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, value]);

  return <span ref={domRef}>{current}</span>;
}

const row1Testimonials = [
  {
    name: "Frederick Octovian",
    university: "Universitas Tadulako",
    image: "/frederick.png",
    quote: "Very nice looking application!. As an UI/UX Designer i really like the flow of the whole website and how it's made easy for students"
  },
  {
    name: "Muhammad Gavin Satrio",
    university: "Kyoto University",
    image: "/gavin.png",
    quote: "This app is very useful for many things! especially finding myself an institution!"
  },
  {
    name: "Putu Argya Deriandra",
    university: "Udayana University",
    image: "/putu.jpg",
    quote: "Finding study abroad opportunities has never been this straightforward. The interface is intuitive, and the recommendations are spot on!"
  },
  {
    name: "Ignatius Raquel Aditama Sundjaya",
    university: "Bina Nusantara University",
    image: "/ignatius.jpg",
    quote: "The platform helped me compare different universities and course modules easily. Highly recommended for any student planning their future!"
  }
];

const row2Testimonials = [
  {
    name: "Htet Wai Yan",
    university: "Yangon University",
    image: "/htet.png",
    quote: "I love this application like i love Indonesia! i'm so amazed by the AI feature available in this application"
  },
  {
    name: "Rafi Athallah",
    university: "Universitas Tanjungpura",
    image: "/rafi.jpg",
    quote: "This application is very useful for finding my international college, the steps are very clear and easy to follow!"
  },
  {
    name: "Farrell Jeremiah Nusah",
    university: "Tsinghua University",
    image: "/farrell.jpg",
    quote: "Choosing the right university in China was a breeze with this app. The database is incredibly comprehensive and accurate!"
  },
  {
    name: "Muhammad Rayhan Zaky",
    university: "State University of Surabaya",
    image: "/rayhan.jpg",
    quote: "An absolute game changer for academic planning. The community and resources here helped me make the right decision for my degree."
  }
];

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      if (loggedIn) {
        const email = localStorage.getItem('userEmail') || "";
        setUserEmail(email);
        const storedName = localStorage.getItem('userName') || "";
        setUserName(storedName);
        
        fetch(`/api/user-info?email=${encodeURIComponent(email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.userId) {
              setUserId(data.userId);
              setUserName(data.name || "");
              localStorage.setItem("userId", data.userId);
              localStorage.setItem("userName", data.name || "");
            }
          })
          .catch(err => console.error("Error fetching user info:", err));
      }
    }
  }, []);

  useEffect(() => {
    if (showLoginModal) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        router.push('/login');
      }
    }
  }, [showLoginModal, countdown, router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserEmail("");
    setUserId(null);
    setUserName("");
  };

  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'greet',
      role: 'assistant',
      content: "Hello! I'm your education consultant AI. How can I help you find your dream university today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInputText, setChatInputText] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatTyping, showChat]);

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
      role: 'user',
      content: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsChatTyping(true);

    try {
      // Format messages history for the API
      const conversationContext = [...chatHistory, userMsg].map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationContext })
      });

      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();

      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response || "I didn't receive a response.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 bg-white shadow-sm z-50 relative">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/img/Logo.png" alt="Logo" className="h-10 w-auto" />
        </div>

        <div className="flex items-center gap-10">
          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-bold text-gray-900">
            <Link href="/search" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Search
            </Link>
            <Link href="/consult" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Consult
            </Link>
            <Link href="/compare" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Compare
            </Link>
          </nav>

          {/* Buttons */}
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

      {/* Hero Section */}
      <section className="relative w-full h-[calc(100vh-80px)] bg-gray-900 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-20 left-8 md:left-[10%] z-10 w-full">
          <FadeInSection>
            <h1 className="text-[5rem] md:text-[6rem] leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-md font-sans">
              SETTLE YOUR <br />
              EDUCATION
            </h1>
          </FadeInSection>
        </div>
      </section>

      {/* Stats Section */}
      <FadeInSection>
        <section className="py-24 px-8 md:px-[10%] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12">

          {/* Stat 1 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              <AnimatedNumber value={200} />+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Partner Universities</span>
              <span>Worldwide</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              <AnimatedNumber value={1000} />+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>International</span>
              <span>Clients</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              <AnimatedNumber value={30} />+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Countries</span>
              <span>Available</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              <AnimatedNumber value={50} />+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Professional</span>
              <span>Consultants</span>
            </div>
          </div>

        </div>
      </section>
      </FadeInSection>

      {/* Partner Universities Section */}
      <FadeInSection>
        <section className="bg-[#EBF3FC] py-20 px-8 md:px-[10%] w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-[2.5rem] text-center text-black mb-14 font-semibold tracking-tight font-sans">
            Our Partner Universities
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-12 items-center justify-items-center">
            {/* Row 1 */}
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/yale.png" alt="Yale University" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/harvard.png" alt="Harvard University" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/tokyo.png" alt="The University of Tokyo" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/princeton.png" alt="Princeton University" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/nara.png" alt="Nara Women's University" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/ucla.png" alt="UCLA" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/kyoto.png" alt="Kyoto University" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
            <div className="flex items-center justify-center h-20 w-full p-2">
              <img src="/malaya.png" alt="University of Malaya" className="max-h-12 md:max-h-14 max-w-full object-contain" />
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Testimonials Section */}
      <FadeInSection>
        <section className="py-24 bg-white overflow-hidden w-full border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-8 mb-16 text-center">
          <h2 className="text-3xl md:text-[2.5rem] font-bold text-gray-900 tracking-tight font-sans">
            Loved by Students Worldwide
          </h2>
          <p className="text-gray-500 mt-4 text-lg font-medium">
            Hear from students who found their dream university through Interlect
          </p>
        </div>

        {/* Sliding Rows */}
        <div className="flex flex-col gap-8 w-full">
          {/* Row 1 (Slides Left) */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Gradient masks for smooth fading edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee-left flex gap-6 hover:[animation-play-state:paused]">
              {/* Render original list */}
              {row1Testimonials.map((t, idx) => (
                <div key={`row1-${idx}`} className="flex items-start bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/40 p-6 w-[480px] shrink-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100" />
                  <div className="ml-5 flex flex-col justify-start">
                    <div className="text-[15px] font-bold text-gray-900 leading-tight">
                      {t.name} <span className="text-gray-400 font-normal"> - </span> <span className="text-blue-600 font-semibold">{t.university}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-2.5 leading-relaxed font-normal">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              ))}
              {/* Duplicate list for seamless loop */}
              {row1Testimonials.map((t, idx) => (
                <div key={`row1-dup-${idx}`} className="flex items-start bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/40 p-6 w-[480px] shrink-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100" />
                  <div className="ml-5 flex flex-col justify-start">
                    <div className="text-[15px] font-bold text-gray-900 leading-tight">
                      {t.name} <span className="text-gray-400 font-normal"> - </span> <span className="text-blue-600 font-semibold">{t.university}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-2.5 leading-relaxed font-normal">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (Slides Right) */}
          <div className="relative w-full overflow-hidden py-4">
            {/* Gradient masks for smooth fading edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee-right flex gap-6 hover:[animation-play-state:paused]">
              {/* Render original list */}
              {row2Testimonials.map((t, idx) => (
                <div key={`row2-${idx}`} className="flex items-start bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/40 p-6 w-[480px] shrink-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100" />
                  <div className="ml-5 flex flex-col justify-start">
                    <div className="text-[15px] font-bold text-gray-900 leading-tight">
                      {t.name} <span className="text-gray-400 font-normal"> - </span> <span className="text-blue-600 font-semibold">{t.university}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-2.5 leading-relaxed font-normal">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              ))}
              {/* Duplicate list for seamless loop */}
              {row2Testimonials.map((t, idx) => (
                <div key={`row2-dup-${idx}`} className="flex items-start bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/40 p-6 w-[480px] shrink-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shrink-0 border border-gray-100" />
                  <div className="ml-5 flex flex-col justify-start">
                    <div className="text-[15px] font-bold text-gray-900 leading-tight">
                      {t.name} <span className="text-gray-400 font-normal"> - </span> <span className="text-blue-600 font-semibold">{t.university}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 mt-2.5 leading-relaxed font-normal">
                      "{t.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Get Started Section */}
      <FadeInSection>
        <section className="bg-[#EBF3FC] py-24 px-8 md:px-[10%] w-full">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-[2.75rem] font-semibold text-gray-900 tracking-tight mb-16 text-center font-sans">
            Get Started with Interlect!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Consult Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-gray-100 overflow-hidden flex flex-col justify-between">
              <div>
                <img 
                  src="/consult_with_professionals.png" 
                  alt="Consult with Professionals" 
                  className="w-full h-64 object-cover" 
                />
                <div className="p-8 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Consult with Professionals
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    Consult with one of many of the best education consultants all around the world!.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2">
                <Link 
                  href="/consult" 
                  className="w-full bg-[#0066FF] text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-blue-700 transition-colors text-center inline-block shadow-md hover:shadow-lg"
                >
                  Consult Now
                </Link>
              </div>
            </div>

            {/* Search Card */}
            <div className="bg-white rounded-3xl shadow-lg shadow-blue-900/5 border border-gray-100 overflow-hidden flex flex-col justify-between">
              <div>
                <img 
                  src="/search_universities.png" 
                  alt="Search Universities" 
                  className="w-full h-64 object-cover" 
                />
                <div className="p-8 pb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Search Universities
                  </h3>
                  <p className="text-gray-500 text-[15px] leading-relaxed">
                    Find out about all universities around the world!. Also included with scholarships for each universities!
                  </p>
                </div>
              </div>
              <div className="px-8 pb-8 pt-2">
                <Link 
                  href="/search" 
                  className="w-full bg-[#0066FF] text-white py-4 rounded-2xl font-bold text-[15px] hover:bg-blue-700 transition-colors text-center inline-block shadow-md hover:shadow-lg"
                >
                  Search for Universities
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Footer Section */}
      <FadeInSection>
        <div className="border-t border-gray-200 w-full" />
        <footer className="bg-white py-16 px-8 md:px-[10%] w-full">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Col (Interlect. brand) */}
            <div className="md:col-span-2 flex flex-col gap-4">
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight font-sans">Interlect.</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                The service does not provide commercial services. All services provided by the service are purely informational in nature.
              </p>
            </div>
            
            {/* Contacts Column */}
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider font-sans">Contacts</h3>
              <ul className="flex flex-col gap-3 text-[15px] font-medium text-gray-800">
                <li><a href="mailto:interlect@gmail.com" className="hover:text-blue-600 transition-colors">interlect@gmail.com</a></li>
                <li className="text-gray-900 font-normal">14140 Cilincing, Jakarta Utara</li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-8 mt-16 text-sm text-gray-400">
            <div>© 2026 — Copyright</div>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <a href="#" aria-label="Facebook">
                <svg className="w-5 h-5 text-gray-900 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg className="w-5 h-5 text-gray-900 hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a href="#" aria-label="VK">
                <svg className="w-5 h-5 text-gray-900 hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.13 2H4.87C3.29 2 2 3.29 2 4.87v14.26C2 20.71 3.29 22 4.87 22h14.26c1.58 0 2.87-1.29 2.87-2.87V4.87C22 3.29 20.71 2 19.13 2zm-3.69 13.96h-1.04c-.38 0-.69-.17-.92-.51-.62-.91-1.24-1.82-1.85-2.73-.13-.2-.31-.29-.53-.26v3.5h-1.12V8.41h1.12v3.08c.2-.02.35-.11.47-.28.53-.78 1.05-1.57 1.57-2.36.19-.29.47-.44.83-.44h1.04c.1 0 .17.06.13.15-.36.78-.71 1.57-1.07 2.35-.11.23-.11.43.02.66.52.88 1.04 1.77 1.57 2.65.08.13.01.25-.13.25z"/>
                </svg>
              </a>
              <a href="#" aria-label="Telegram">
                <svg className="w-5 h-5 text-gray-900 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.35-.49.97-.74 3.79-1.65 6.32-2.74 7.57-3.27 3.61-1.53 4.36-1.8 4.85-1.8.11 0 .35.03.5.15.13.1.17.23.18.33.02.08.02.24 0 .33z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
      </FadeInSection>

      {/* Floating AI Chatbot Widget */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
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
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-6 bg-slate-50/50 flex flex-col gap-4">
              {chatHistory.map((msg) => {
                const isAI = msg.role === 'assistant';
                return (
                  <div 
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${isAI ? 'self-start' : 'self-end'}`}
                  >
                    <div 
                      className={`p-4 text-sm leading-relaxed shadow-sm transition-all ${
                        isAI 
                          ? 'bg-white border border-gray-100 text-gray-800 rounded-[22px] rounded-tl-none' 
                          : 'bg-[#0066FF] text-white rounded-[22px] rounded-tr-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className={`text-[10px] text-gray-400 mt-1 px-1 ${isAI ? 'self-start' : 'self-end'}`}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}

              {/* Typing Shimmer Indicator */}
              {isChatTyping && (
                <div className="flex flex-col max-w-[85%] self-start">
                  <div className="bg-white border border-gray-100 rounded-[22px] rounded-tl-none p-4 shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
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
              onClick={() => router.push('/login')}
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

