"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProfileModal from "../../components/ProfileModal";
import AIChatWidget from "../../components/AIChatWidget";

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

// ----------------------------------------------------
// Flag Data & Fallback Component
// ----------------------------------------------------
const flagRows = [
  [
    { name: "Malaysia", emoji: "🇲🇾", rotate: "rotate-[-26.92deg]", size: "w-[43px] h-[45px] md:w-[48px] md:h-[50px]", src: "https://flagcdn.com/w80/my.png" },
    { name: "Philippines", emoji: "🇵🇭", rotate: "rotate-[14.59deg]", size: "w-[46px] h-[51px] md:w-[50px] md:h-[55px]", src: "https://flagcdn.com/w80/ph.png" },
    { name: "Monaco", emoji: "🇲🇨", rotate: "rotate-[-13.92deg]", size: "w-[47px] h-[47px] md:w-[52px] md:h-[52px]", src: "https://flagcdn.com/w80/mc.png" },
    { name: "New Zealand", emoji: "🇳🇿", rotate: "rotate-[8.75deg]", size: "w-[52px] h-[52px] md:w-[56px] md:h-[56px]", src: "https://flagcdn.com/w80/nz.png" },
    { name: "Mali", emoji: "🇲🇱", rotate: "rotate-[-8.82deg]", size: "w-[51px] h-[51px]", src: "https://flagcdn.com/w80/ml.png" },
    { name: "Morocco", emoji: "🇲🇦", rotate: "rotate-[6.7deg]", size: "w-[50px] h-[50px]", src: "https://flagcdn.com/w80/ma.png" },
    { name: "Czechia", emoji: "🇨🇿", rotate: "rotate-[-17.02deg]", size: "w-[43px] h-[43px]", src: "https://flagcdn.com/w80/cz.png" },
    { name: "Bahrain", emoji: "🇧🇭", rotate: "rotate-[4.19deg]", size: "w-[44px] h-[44px]", src: "https://flagcdn.com/w80/bh.png" },
    { name: "Germany", emoji: "🇩🇪", rotate: "rotate-[16.59deg]", size: "w-[44px] h-[51px]", src: "https://flagcdn.com/w80/de.png" },
    { name: "Brazil", emoji: "🇧🇷", rotate: "rotate-[-11.13deg]", size: "w-[47px] h-[47px]", src: "https://flagcdn.com/w80/br.png" }
  ],
  [
    { name: "England", emoji: "🇬🇧", rotate: "rotate-[16.32deg]", size: "w-[47px] h-[47px]", src: "https://flagcdn.com/w80/gb.png" },
    { name: "Clipperton Island", emoji: "🇨🇵", rotate: "rotate-[-20.25deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/fr.png" },
    { name: "Portugal", emoji: "🇵🇹", rotate: "rotate-[13.38deg]", size: "w-[49px] h-[49px]", src: "https://flagcdn.com/w80/pt.png" },
    { name: "Venezuela", emoji: "🇻🇪", rotate: "rotate-[18.86deg]", size: "w-[49px] h-[49px]", src: "https://flagcdn.com/w80/ve.png" },
    { name: "Poland", emoji: "🇵🇱", rotate: "rotate-[-17.03deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/pl.png" },
    { name: "Russia", emoji: "🇷🇺", rotate: "rotate-[14.16deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/ru.png" },
    { name: "Singapore", emoji: "🇸🇬", rotate: "rotate-[-8.74deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/sg.png" },
    { name: "Timor-Leste", emoji: "🇹🇱", rotate: "rotate-[17.53deg]", size: "w-[49px] h-[49px]", src: "https://flagcdn.com/w80/tl.png" },
    { name: "Serbia", emoji: "🇷🇸", rotate: "rotate-[-10.85deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/rs.png" },
    { name: "India", emoji: "🇮🇳", rotate: "rotate-[25.19deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/in.png" }
  ],
  [
    { name: "Canada", emoji: "🇨🇦", rotate: "rotate-[-14.28deg]", size: "w-[47px] h-[47px]", src: "https://flagcdn.com/w80/ca.png" },
    { name: "Argentina", emoji: "🇦🇷", rotate: "rotate-[19.89deg]", size: "w-[46px] h-[46px]", src: "https://flagcdn.com/w80/ar.png" },
    { name: "Brunei", emoji: "🇧🇳", rotate: "rotate-[-16.66deg]", size: "w-[47px] h-[47.5px]", src: "https://flagcdn.com/w80/bn.png" },
    { name: "Ceuta Melilla", emoji: "🇪🇸", rotate: "rotate-[23.48deg]", size: "w-[48px] h-[48px]", src: "https://flagcdn.com/w80/es.png" },
    { name: "Japan", emoji: "🇯🇵", rotate: "rotate-[-15.74deg]", size: "w-[53px] h-[53px]", src: "https://flagcdn.com/w80/jp.png" },
    { name: "Croatia", emoji: "🇭🇷", rotate: "rotate-[14.95deg]", size: "w-[50px] h-[50.6px]", src: "https://flagcdn.com/w80/hr.png" },
    { name: "USA", emoji: "🇺🇸", rotate: "rotate-[-22.36deg]", size: "w-[49px] h-[49px]", src: "https://flagcdn.com/w80/us.png" },
    { name: "Bangladesh", emoji: "🇧🇩", rotate: "rotate-[19.13deg]", size: "w-[52px] h-[52.9px]", src: "https://flagcdn.com/w80/bd.png" },
    { name: "Chile", emoji: "🇨🇱", rotate: "rotate-[-11.78deg]", size: "w-[52px] h-[52.8px]", src: "https://flagcdn.com/w80/cl.png" },
    { name: "South Korea", emoji: "🇰🇷", rotate: "rotate-[11.84deg]", size: "w-[52px] h-[52px]", src: "https://flagcdn.com/w80/kr.png" }
  ]
];

const FlagImage = ({ src, emoji, name, size = "w-12 h-12" }) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center ${size} select-none`}>
      {error || !src ? (
        <span className="text-4xl md:text-5xl drop-shadow-sm filter saturate-125 transform hover:scale-110 active:scale-95 transition-transform">{emoji}</span>
      ) : (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-contain filter drop-shadow-sm hover:scale-110 active:scale-95 transition-transform"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// Mock Scholarship Directory Database
// ----------------------------------------------------
const universities = [
  {
    id: "tokyo",
    name: "The University of Tokyo",
    location: "Tokyo, Japan",
    country: "Japan",
    logo: "/tokyo.png",
    scholarship: "MEXT Scholarship (Monbukagakusho)",
    coverage: "Fully Funded (100% Tuition, Monthly Allowance, Airfare)",
    details: {
      degree: "Undergraduate / Graduate / Ph.D.",
      allowance: "¥143,000 - ¥145,000 / month",
      requirements: "GPA 3.2+ out of 4.0, English Proficiency (IELTS 6.5+ / TOEFL 80+) or Japanese Proficiency.",
      deadline: "Mid-June 2026",
      description: "The Ministry of Education, Culture, Sports, Science and Technology (MEXT) of Japan offers scholarships for international students who wish to study in Japanese universities."
    }
  },
  {
    id: "harvard",
    name: "Harvard University",
    location: "Cambridge, Massachusetts, USA",
    country: "USA",
    logo: "/harvard.png",
    scholarship: "Fulbright Foreign Student Program",
    coverage: "Full Funding (Tuition, Airfare, Living Stipend, Health Insurance)",
    details: {
      degree: "Graduate (Master's / Ph.D.)",
      allowance: "$2,000 - $3,500 / month (varies by region)",
      requirements: "Bachelor's degree, strong academic record, TOEFL 100+ or IELTS 7.5+, Statement of Purpose.",
      deadline: "October 15, 2026",
      description: "The Fulbright Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States."
    }
  },
  {
    id: "yale",
    name: "Yale University",
    location: "New Haven, Connecticut, USA",
    country: "USA",
    logo: "/yale.png",
    scholarship: "Yale Need-Based Financial Aid",
    coverage: "Tuition and Fees, Room & Board (100% Demonstrated Need)",
    details: {
      degree: "Undergraduate",
      allowance: "Covered within financial aid package based on family income",
      requirements: "Demonstrated financial need, admission to Yale University, academic excellence.",
      deadline: "January 2, 2026",
      description: "Yale is committed to a need-blind admission policy for all applicants, including international students, meeting 100% of demonstrated financial need."
    }
  },
  {
    id: "ucla",
    name: "University of California, Los Angeles",
    location: "Los Angeles, California, USA",
    country: "USA",
    logo: "/ucla.png",
    scholarship: "UCLA Regents Scholarship",
    coverage: "Partial to Full Tuition + Priority Class Enrollment",
    details: {
      degree: "Undergraduate",
      allowance: "$2,000 merit-based award per year, plus need-based aid up to full cost",
      requirements: "Outstanding academic achievement, leadership, and community service.",
      deadline: "November 30, 2026",
      description: "The Regents Scholarship is one of the most prestigious awards at UCLA, granted to students demonstrating exceptional academic and personal accomplishments."
    }
  },
  {
    id: "princeton",
    name: "Princeton University",
    location: "Princeton, New Jersey, USA",
    country: "USA",
    logo: "/princeton.png",
    scholarship: "Princeton Full Grant Aid",
    coverage: "No-Loan Financial Aid (100% Tuition, Room, and Board Covered)",
    details: {
      degree: "Undergraduate",
      allowance: "Personal expenses and books stipend included",
      requirements: "Need-blind admission, financial application (CSS Profile) submission.",
      deadline: "January 1, 2026",
      description: "Princeton is widely recognized for having one of the best financial aid programs in the country, meeting 100% of demonstrated need with grants, not loans."
    }
  },
  {
    id: "kyoto",
    name: "Kyoto University",
    location: "Kyoto, Japan",
    country: "Japan",
    logo: "/kyoto.png",
    scholarship: "Kyoto iUP Scholarship",
    coverage: "Full Tuition Waiver + Admission Fee Waiver + Monthly Stipend",
    details: {
      degree: "Bilingual Undergraduate Program",
      allowance: "¥120,000 / month for up to 4.5 years",
      requirements: "High school diploma, strong interest in Japanese language and culture, solid STEM/Humanities grades.",
      deadline: "Early December 2026",
      description: "Kyoto iUP is a 4.5-year program (6-month preparatory course + 4-year undergraduate course) where Japanese language skills are developed in parallel with major studies."
    }
  },
  {
    id: "malaya",
    name: "University of Malaya",
    location: "Kuala Lumpur, Malaysia",
    country: "Malaysia",
    logo: "/malaya.png",
    scholarship: "Malaysia International Scholarship (MIS)",
    coverage: "Full Tuition + Monthly Living Allowance + Travel Grants",
    details: {
      degree: "Master's / Ph.D.",
      allowance: "RM 1,500 / month",
      requirements: "CGPA 3.5/4.0+, IELTS 6.0 / TOEFL 92, strong research proposal.",
      deadline: "April 30, 2026",
      description: "MIS is an initiative by the Malaysian Government to attract the best brains from around the world to pursue advanced academic studies in Malaysia."
    }
  },
  {
    id: "nara",
    name: "Nara Women's University",
    location: "Nara, Japan",
    country: "Japan",
    logo: "/nara.png",
    scholarship: "NWU Exchange Student Scholarship",
    coverage: "Tuition Waiver + Monthly JASSO Stipend",
    details: {
      degree: "Exchange Program / Graduate",
      allowance: "¥80,000 / month",
      requirements: "Enrolled at a partner university, Japanese proficiency equivalent to N3 or higher.",
      deadline: "Late February 2026",
      description: "JASSO scholarships are offered to qualified short-term exchange students studying at Nara Women's University under academic exchange agreements."
    }
  }
];

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------
export default function SearchPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

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

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredUnis, setFilteredUnis] = useState(universities);
  const [activeUni, setActiveUni] = useState(null);

  // Filter effect
  useEffect(() => {
    let results = universities;
    
    if (selectedCountry) {
      results = results.filter(uni => uni.country.toLowerCase() === selectedCountry.toLowerCase());
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        uni =>
          uni.name.toLowerCase().includes(query) ||
          uni.scholarship.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query)
      );
    }

    setFilteredUnis(results);
  }, [searchQuery, selectedCountry]);

  const handleFlagClick = (countryName) => {
    // Map flag names to database countries
    let target = countryName;
    if (countryName === "USA" || countryName === "Us Outlying Islands") target = "USA";
    if (countryName === "England") target = "UK"; // or UK/England
    
    if (selectedCountry && selectedCountry.toLowerCase() === target.toLowerCase()) {
      setSelectedCountry(null); // Toggle off
    } else {
      setSelectedCountry(target);
    }
  };

  const handleClearFilters = () => {
    setSelectedCountry(null);
    setSearchQuery("");
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
            <Link href="/search" className="relative flex items-center gap-2 text-blue-600 transition-colors">
              <SearchIcon className="w-[18px] h-[18px]" />
              Search
              <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-blue-600" />
            </Link>
            <Link href="/consult" className="relative flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600">
              <ConsultIcon className="w-[18px] h-[18px]" />
              Consult
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
                  className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:text-[#0066FF] hover:border-gray-300 transition-colors cursor-pointer"
                >
                  <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{userName || userEmail}</span>
                  <svg className="w-[12px] h-[12px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
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

      <main className="flex-grow flex flex-col items-center py-16 px-4 max-w-7xl w-full mx-auto relative">
        
        {/* ---------------------------------------------------- */}
        {/* Staggered Flag Cloud Component */}
        {/* ---------------------------------------------------- */}
        <div className="w-full flex flex-col items-center gap-4 md:gap-6 max-w-[900px] mb-12 select-none overflow-x-auto py-2">
          {flagRows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex items-center gap-6 md:gap-8 min-w-[700px] justify-center">
              {row.map((flag) => {
                const isFiltered = selectedCountry && (
                  flag.name.toLowerCase() === selectedCountry.toLowerCase() ||
                  (flag.name === "Us Outlying Islands" && selectedCountry.toLowerCase() === "usa") ||
                  (flag.name === "USA" && selectedCountry.toLowerCase() === "usa")
                );
                
                return (
                  <button
                    key={flag.name}
                    onClick={() => handleFlagClick(flag.name)}
                    className={`transform ${flag.rotate} transition-all duration-300 hover:scale-125 focus:outline-none cursor-pointer ${
                      selectedCountry && !isFiltered ? "opacity-30 scale-95 saturate-50" : "opacity-100 scale-100"
                    }`}
                    title={`Filter by ${flag.name}`}
                  >
                    <FlagImage
                      src={flag.src}
                      emoji={flag.emoji}
                      name={flag.name}
                      size="w-[45px] h-[45px] md:w-[50px] md:h-[50px]"
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* ---------------------------------------------------- */}
        {/* Title and Search Bar */}
        {/* ---------------------------------------------------- */}
        <h1 className="text-3xl md:text-[32px] font-normal text-black text-center tracking-tight mb-8">
          Where will your next journey begin?
        </h1>

        <div className="w-full max-w-[820px] px-2 mb-16">
          <div className="relative flex items-center bg-white border border-[#305687]/40 shadow-md shadow-blue-900/5 hover:shadow-lg focus-within:shadow-lg focus-within:border-[#305687] rounded-full overflow-hidden transition-all">
            <div className="pl-6 text-gray-500">
              <SearchIcon className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Scholarships Availability"
              className="w-full py-4 pl-4 pr-6 bg-transparent outline-none text-[18px] text-gray-800 placeholder-gray-500 font-bold tracking-tight"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-6 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Active Filter Indicators */}
          {(selectedCountry || searchQuery) && (
            <div className="flex items-center justify-between mt-4 px-4 text-sm">
              <div className="text-gray-600 flex items-center gap-2">
                <span>Active filters:</span>
                {selectedCountry && (
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                    📍 {selectedCountry}
                    <button onClick={() => setSelectedCountry(null)} className="hover:text-red-500 font-bold">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full border border-blue-100 flex items-center gap-1.5">
                    🔍 "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-red-500 font-bold">×</button>
                  </span>
                )}
              </div>
              <button
                onClick={handleClearFilters}
                className="text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* Mock Scholarship Directory Grid */}
        {/* ---------------------------------------------------- */}
        <section className="w-full flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-gray-100 pb-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Available University Scholarships
            </h2>
            <span className="text-sm font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
              {filteredUnis.length} {filteredUnis.length === 1 ? "Program" : "Programs"} found
            </span>
          </div>

          {filteredUnis.length === 0 ? (
            <div className="w-full bg-slate-50 border border-dashed border-gray-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No scholarships found</h3>
              <p className="text-gray-500 text-sm max-w-sm leading-relaxed mb-6">
                We couldn't find any scholarship options matching your search filters. Try clearing some filters or searching for something else.
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[14px] px-6 py-3 rounded-full shadow-md"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {filteredUnis.map((uni) => (
                <div
                  key={uni.id}
                  className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-gray-200/80 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-6 group"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl flex-shrink-0 border border-gray-100 p-2 flex items-center justify-center shadow-inner group-hover:scale-102 transition-transform">
                    <img src={uni.logo} alt={uni.name} className="max-h-full max-w-full object-contain" />
                  </div>

                  <div className="flex-grow flex flex-col justify-between h-full">
                    <div>
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {uni.location}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {uni.name}
                      </h3>
                      <p className="text-sm font-bold text-gray-800 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 inline-block mb-3 leading-snug">
                        🎓 {uni.scholarship}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-1 mb-4">
                        💸 {uni.coverage}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveUni(uni)}
                      className="self-start text-xs font-bold text-blue-600 group-hover:text-blue-800 underline underline-offset-4 tracking-wider uppercase cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ---------------------------------------------------- */}
        {/* Scholarship Details Modal Popup */}
        {/* ---------------------------------------------------- */}
        {activeUni && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 md:p-10 relative shadow-2xl border border-gray-100 animate-slide-up flex flex-col max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setActiveUni(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 p-2 cursor-pointer transition-colors"
                title="Close Modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-5 border-b border-gray-100 pb-6 mb-6 mt-2">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-gray-100 p-2 flex items-center justify-center">
                  <img src={activeUni.logo} alt={activeUni.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{activeUni.location}</span>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{activeUni.name}</h3>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scholarship Name</h4>
                  <p className="text-lg font-bold text-gray-900 bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3">
                    🏆 {activeUni.scholarship}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Scholarship Coverage</h4>
                  <p className="text-sm font-semibold text-gray-800 leading-relaxed pl-1">
                    💰 {activeUni.coverage}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-5 border border-gray-100/50">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Target Degree</h4>
                    <p className="text-sm font-bold text-gray-800">{activeUni.details.degree}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Application Deadline</h4>
                    <p className="text-sm font-bold text-red-600">{activeUni.details.deadline}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Estimated Stipend</h4>
                    <p className="text-sm font-bold text-gray-800">{activeUni.details.allowance}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Program Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed pl-1">
                    {activeUni.details.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Academic & Admission Requirements</h4>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium bg-amber-50/40 border border-amber-100/60 rounded-xl p-4">
                    📝 {activeUni.details.requirements}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 border-t border-gray-100 pt-6 mt-8">
                <Link
                  href="/consult"
                  className="w-1/2 bg-[#0066FF] text-white py-3.5 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors text-center inline-block shadow-md cursor-pointer"
                >
                  Consult to Apply
                </Link>
                <button
                  onClick={() => setActiveUni(null)}
                  className="w-1/2 bg-gray-50 border border-gray-200 text-gray-700 py-3.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close Details
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ---------------------------------------------------- */}
      {/* CSS Animations Injector */}
      {/* ---------------------------------------------------- */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

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
      <AIChatWidget isLoggedIn={isLoggedIn} />
    </div>
  );
}
