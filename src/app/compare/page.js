"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// ----------------------------------------------------
// Icons (SVG Components)
// ----------------------------------------------------
function SearchIcon({ className = "w-[18px] h-[18px]" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ConsultIcon({ className = "w-[18px] h-[18px]" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function CompareIcon({ className = "w-[18px] h-[18px]" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  );
}

// Card details icons
function GlobeIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2m-4-3.5a2.5 2.5 0 014-2.882M14 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function StudentIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function WomanStudentIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg className="w-[20px] h-[20px] text-[#0066FF] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

// ----------------------------------------------------
// Presets
// ----------------------------------------------------
const PRESETS = [
  {
    name: "Ivy League",
    unis: ["Harvard University", "Princeton University", "Yale University"]
  },
  {
    name: "Tech & Science",
    unis: ["Massachusetts Institute of Technology", "Stanford University", "California Institute of Technology"]
  },
  {
    name: "UK Prestige",
    unis: ["University of Oxford", "University of Cambridge", "Imperial College London"]
  },
  {
    name: "Asian Leaders",
    unis: ["National University of Singapore", "Kyoto University", "Tsinghua University"]
  }
];

export default function ComparePage() {
  const [unis, setUnis] = useState(["Harvard University", "Princeton University", "Yale University"]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch helper
  const fetchComparison = async (namesArray) => {
    setLoading(true);
    setError(null);
    try {
      const query = namesArray.map(n => encodeURIComponent(n)).join(",");
      const response = await fetch(`/api/compare?names=${query}`);
      if (!response.ok) {
        throw new Error("Failed to load comparison data.");
      }
      const json = await response.json();
      setData(json.universities || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch university details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchComparison(unis);
  }, []);

  const handleCompare = () => {
    // Filter empty inputs out
    const activeNames = unis.map(n => n.trim()).filter(n => n.length > 0);
    if (activeNames.length === 0) {
      setError("Please fill in at least one university name.");
      return;
    }
    fetchComparison(activeNames);
  };

  const handlePreset = (presetUnis) => {
    setUnis(presetUnis);
    fetchComparison(presetUnis);
  };

  const handleInputChange = (idx, value) => {
    const nextUnis = [...unis];
    nextUnis[idx] = value;
    setUnis(nextUnis);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col selection:bg-blue-100 selection:text-blue-800">
      
      {/* Header */}
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
            <Link href="/consult" className="flex items-center gap-2 transition-colors text-gray-500 hover:text-blue-600 border-b-2 border-transparent pb-1 -mb-[22px]">
              <ConsultIcon className="w-[18px] h-[18px]" />
              Consult
            </Link>
            <Link href="/compare" className="flex items-center gap-2 text-blue-600 border-b-2 border-blue-600 pb-1 -mb-[22px] transition-colors">
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

      {/* Main Container */}
      <main className="flex-grow py-12 px-4 max-w-7xl w-full mx-auto flex flex-col items-center">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-[#0066FF] font-bold uppercase tracking-wider text-xs px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            Decision Companion
          </span>
          <h1 className="text-3xl md:text-4xl font-normal text-black mt-3 tracking-tight">
            Compare University
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Dynamically compare rankings, statistics, and campus photos of universities worldwide.
          </p>
        </div>

        {/* Dynamic Selectors */}
        <div className="w-full bg-[#e2edfc]/40 border border-blue-100/60 rounded-3xl p-6 md:p-8 mb-12 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Select Universities to Compare
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {unis.map((value, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  University {idx + 1}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder="Enter university name..."
                    className="w-full px-5 py-3 bg-white border border-[#305687]/20 rounded-2xl shadow-sm focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF] outline-none text-[15px] font-bold text-gray-800 placeholder-gray-400 transition-all"
                  />
                  {value && (
                    <button
                      onClick={() => handleInputChange(idx, "")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Presets & Compare Trigger */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-blue-100/60 pt-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500">Quick Presets:</span>
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => handlePreset(p.unis)}
                  className="bg-white border border-gray-200 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF] rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleCompare}
              disabled={loading}
              className="w-full lg:w-auto bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-full transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                "Compare Now"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ---------------------------------------------------- */}
        {/* SKELETON LOADING STATE */}
        {/* ---------------------------------------------------- */}
        {loading ? (
          <div className="w-full flex flex-col items-center">
            {/* Top Cards Shimmer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#e2edfc]/60 border border-blue-100/50 rounded-3xl p-6 flex flex-col gap-6 w-full animate-pulse">
                  <div className="aspect-[379/212] bg-gray-200/80 rounded-2xl w-full"></div>
                  <div className="h-6 bg-gray-200/80 rounded w-3/4 mx-auto"></div>
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3, 4, 5, 6, 7].map((l) => (
                      <div key={l} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-200/80"></div>
                        <div className="h-4 bg-gray-200/80 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Details Shimmer */}
            <div className="w-full flex flex-col gap-8">
              {[1, 2].map((s) => (
                <div key={s} className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 animate-pulse">
                  <div className="h-10 bg-blue-100/50 rounded-xl w-full"></div>
                  {[1, 2, 3, 4].map((r) => (
                    <div key={r} className="grid grid-cols-3 gap-6 py-4 border-b border-gray-100">
                      {[1, 2, 3].map((c) => (
                        <div key={c} className="flex flex-col items-center gap-2">
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ---------------------------------------------------- */
          /* RENDER COMPARISON DATA */
          /* ---------------------------------------------------- */
          <div className="w-full flex flex-col items-center">
            
            {/* Top Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mb-12">
              {data.map((uni, idx) => (
                <div
                  key={idx}
                  className="bg-[#e2edfc] border border-blue-200 rounded-3xl p-6 flex flex-col gap-6 w-full shadow-lg shadow-blue-900/5 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Campus Image */}
                  <div className="aspect-[379/212] w-full relative rounded-2xl overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center">
                    <img
                      src={uni.image}
                      alt={uni.name}
                      className="w-full h-full object-cover select-none"
                      onError={(e) => {
                        e.target.src = "/img/university-placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* University Name */}
                  <h3 className="text-xl md:text-[22px] font-bold text-black text-center tracking-tight min-h-[50px] flex items-center justify-center">
                    {uni.name}
                  </h3>

                  {/* Primary Metrics List */}
                  <div className="flex flex-col gap-3.5 border-t border-blue-200/50 pt-4">
                    <div className="flex items-center gap-3">
                      <GlobeIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Country: <span className="font-bold">{uni.country}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <SchoolIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Type: <span className="font-bold">{uni.type}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <CalendarIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Established: <span className="font-bold">{uni.established}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <RulerIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Campus Size: <span className="font-bold">{uni.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StudentIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Total Students: <span className="font-bold">{uni.students}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <WomanStudentIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        International: <span className="font-bold">{uni.internationalStudents}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <MedalIcon />
                      <p className="text-sm font-semibold text-gray-800">
                        Ranking: <span className="font-bold text-[#0066FF]">{uni.rank}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider line matching Figma rounded divider */}
            <div className="h-[2px] w-full bg-[#3c3c43]/10 rounded-[100px] mb-12" />

            {/* Detailed Categories Tables */}
            <div className="w-full flex flex-col gap-10">
              
              {/* Category 1: Academic Information */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg shadow-gray-200/40">
                <div className="bg-[#e2edfc] px-8 py-3.5 rounded-xl text-lg font-bold text-gray-900 mb-6 tracking-wide">
                  Academic Information
                </div>

                <div className="flex flex-col gap-4">
                  {/* Majors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Popular Majors
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.majors}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Research */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Research Opportunities
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.researchOpportunities}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* System */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Academic System
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.system}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Graduation Rate */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Graduation Rate
                        </span>
                        <p className="text-[15px] font-bold text-[#0066FF] leading-snug">
                          {uni.graduationRate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category 2: Admission Requirements */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-lg shadow-gray-200/40">
                <div className="bg-[#e2edfc] px-8 py-3.5 rounded-xl text-lg font-bold text-gray-900 mb-6 tracking-wide">
                  Admission Requirements
                </div>

                <div className="flex flex-col gap-4">
                  {/* Acceptance Rate */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Acceptance Rate
                        </span>
                        <p className="text-[15px] font-bold text-red-500 leading-snug">
                          {uni.acceptanceRate}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* GPA */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Average GPA
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.avgGpa}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Recommendation Letters
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.recommendationLetters}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Essay */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-gray-100">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Personal Essay
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.personalEssay}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Application Fee */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                    {data.map((uni, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Application Fee
                        </span>
                        <p className="text-[15px] font-semibold text-gray-800 leading-snug">
                          {uni.applicationFee}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer / Copyright */}
      <footer className="py-8 bg-gray-50 border-t border-gray-100 text-center text-xs font-bold text-gray-400">
        © 2026 Interlect. All rights reserved.
      </footer>
    </div>
  );
}
