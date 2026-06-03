import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
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
            <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              Search
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              Consult
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
              Compare
            </a>
          </nav>

          {/* Buttons */}
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

      {/* Hero Section */}
      <section className="relative w-full h-[650px] bg-gray-900 overflow-hidden">
        <Image
          src="/hero_bg.png"
          alt="University Campus"
          fill
          className="object-cover object-bottom"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        <div className="absolute bottom-20 left-8 md:left-[10%] z-10 w-full">
          <h1 className="text-[5rem] md:text-[6rem] leading-[1.05] font-extrabold tracking-tight text-white drop-shadow-md font-sans">
            SETTLE YOUR <br />
            EDUCATION
          </h1>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-8 md:px-[10%] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-12">

          {/* Stat 1 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              200+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Partner Universities</span>
              <span>Worldwide</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              1000+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>International</span>
              <span>Clients</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              30+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Countries</span>
              <span>Available</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="flex items-center gap-6">
            <div className="text-[5.5rem] font-light text-black tracking-tight leading-none">
              50+
            </div>
            <div className="flex flex-col text-[1.1rem] text-gray-800 leading-[1.3] font-medium">
              <span>Professional</span>
              <span>Consultants</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
