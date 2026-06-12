import { useState, useRef, useEffect } from "react";

interface UserMenuProps {
  userName: string;
  userEmail: string;
  onLogout: () => void;
  onOpenProfile: () => void;
  onOpenPayments: () => void;
}

export default function UserMenu({
  userName,
  userEmail,
  onLogout,
  onOpenProfile,
  onOpenPayments
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isConsultant = userEmail && userEmail.endsWith("@interlect.com");

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:text-[#0066FF] hover:border-gray-300 transition-all cursor-pointer select-none"
      >
        <svg className="w-[18px] h-[18px] text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{userName || userEmail}</span>
        <svg className={`w-[12px] h-[12px] text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 py-2 animate-fade-in text-left">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
            <p className="text-sm font-bold text-gray-900 truncate">{userName || "User"}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{userEmail}</p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              onOpenProfile();
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-slate-50 hover:text-[#0066FF] transition-colors flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Change User Information
          </button>
          
          {!isConsultant && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenPayments();
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-slate-50 hover:text-[#0066FF] transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment History
            </button>
          )}
          
          <div className="border-t border-gray-100 my-1" />
          
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4.5 h-4.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
