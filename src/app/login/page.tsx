"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      alert("Login successful!");
    } else {
      alert("Login failed!");
    }
  };

  return (
    <div className="flex w-full h-screen p-6 bg-white text-black">
      
      {/* LEFT */}
      <div className="w-full lg:w-1/2 flex flex-col">
        
        {/* LOGO */}
        <div className="pt-8 pl-12">
          <img src="/img/Logo.png" className="h-10" />
        </div>

        {/* FORM */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto px-6">
          
          <h1 className="text-[2.5rem] font-bold text-black mb-2">
            Hello!
          </h1>

          <h1 className="text-[2.5rem] font-bold text-black mb-10">
            Welcome Back!
          </h1>

          {/* EMAIL */}
          <label className="text-[13px] font-bold text-black mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-5 focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <label className="text-[13px] font-bold text-black mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full h-12 rounded-xl border border-[#c1cfee] px-4 mb-6 focus:outline-none focus:border-blue-500"
            onChange={(e) => setPassword(e.target.value)}
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
            <span className="text-blue-600 cursor-pointer">
              Sign Up
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:block w-1/2 h-full rounded-[2rem] overflow-hidden bg-[#eff6ff] border border-blue-50">
        <img
          src="/img/LoginPicture.png"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}