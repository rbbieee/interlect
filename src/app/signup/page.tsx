"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Sign up successful! You can now log in.");
        // Optional: you can redirect to login page programmatically here if you add useRouter
      } else {
        alert("Sign up failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      alert("An error occurred during sign up.");
    }
  };

  return (
    <div className="flex w-full h-screen p-6 bg-white text-black">
      
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex flex-col relative pt-8">
        
        {/* LOGO */}
        <div className="absolute top-0 pl-12 pt-8">
          <Link href="/">
             <img src="/img/Logo.png" className="h-10 hover:opacity-80 transition cursor-pointer" alt="Logo" />
          </Link>
        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] mx-auto px-6 w-full">
          
          <h1 className="text-[2.2rem] font-extrabold tracking-tight text-black mb-8">
            Let's Get Started!
          </h1>

          {/* EMAIL */}
          <label className="text-[13px] font-bold text-black mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-5 focus:outline-none focus:border-blue-500 text-[15px]"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="text-[13px] font-bold text-black mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-5 focus:outline-none focus:border-blue-500 text-[15px]"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* CONFIRM PASSWORD */}
          <label className="text-[13px] font-bold text-black mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-8 focus:outline-none focus:border-blue-500 text-[15px]"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* OTHER ACCOUNT */}
          <button className="w-full h-12 rounded-full border border-[#c1cfee] text-black font-bold mb-4 hover:bg-gray-50 transition-colors text-[14px]">
            Other Account
          </button>

          {/* SIGN UP */}
          <button
            onClick={handleSignup}
            className="w-full h-12 rounded-full bg-[#0066FF] text-white font-bold hover:bg-blue-700 transition-colors shadow-sm text-[14px]"
          >
            Sign Up
          </button>

          <div className="mt-16 text-[14px] font-bold text-black pb-10">
            Already have an account?{" "}
            <Link href="/login" className="text-[#0066FF] hover:underlinetransition-colors">
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block w-1/2 h-full rounded-[2rem] overflow-hidden bg-[#eff6ff]">
        <img
          src="/img/SignupPicture.png"
          className="w-full h-full object-cover object-top"
          alt="Signup Graphic"
        />
      </div>
    </div>
  );
}
