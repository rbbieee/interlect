"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Login successful!");
      } else {
        setError(result.message || "Login failed!");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="flex w-full h-screen p-6 bg-white text-black">
      
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex flex-col">
        
        {/* LOGO */}
        <div className="pt-8 pl-12">
          <Link href="/">
            <img src="/img/Logo.png" className="h-10 hover:opacity-80 transition cursor-pointer" alt="Logo" />
          </Link>
        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto px-6 w-full">
          
          <h1 className="text-[2.5rem] font-bold text-black mb-2 leading-tight">
            Hello!
          </h1>

          <h1 className="text-[2.5rem] font-bold text-black mb-6 leading-tight">
            Welcome Back!
          </h1>

          {/* NOTIFICATION MESSAGES */}
          {error && (
            <div className="mb-6 text-[14px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all duration-300">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 text-[14px] font-semibold text-green-600 bg-green-50 border border-green-200 rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all duration-300">
              <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {/* EMAIL */}
          <label className="text-[13px] font-bold text-black mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-5 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
          />

          {/* PASSWORD */}
          <label className="text-[13px] font-bold text-black mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-6 focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
          />

          {/* OTHER ACCOUNT */}
          <button className="w-full h-12 rounded-full border border-blue-600 text-black font-bold mb-4 hover:bg-blue-50 transition">
            Other Account
          </button>

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            className="w-full h-12 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-sm"
          >
            Login
          </button>

          <div className="mt-10 text-[14px] font-bold text-black">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-600 hover:underline transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block w-1/2 h-full rounded-[2rem] overflow-hidden bg-[#eff6ff] border border-blue-50">
        <img
          src="/img/LoginPicture.png"
          className="w-full h-full object-cover"
          alt="Login Graphic"
        />
      </div>
    </div>
  );
}