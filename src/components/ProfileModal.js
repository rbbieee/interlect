"use client";

import { useState, useEffect } from "react";

export default function ProfileModal({ isOpen, onClose, userId, initialName, initialEmail, onUpdateSuccess }) {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [expertise, setExpertise] = useState("");
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isConsultant = initialEmail && initialEmail.endsWith("@interlect.com");

  useEffect(() => {
    setName(initialName || "");
    setEmail(initialEmail || "");
    setPassword("");
    setCurrentPassword("");
    setError(null);
    setExpertise("");

    if (isOpen && initialEmail && initialEmail.endsWith("@interlect.com")) {
      fetch(`/api/user-info?email=${encodeURIComponent(initialEmail)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.expertise) {
            setExpertise(data.expertise);
          }
        })
        .catch((err) => console.error("Error fetching consultant expertise:", err));
    }
  }, [isOpen, initialName, initialEmail]);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name,
          email,
          password: password || undefined,
          currentPassword,
          expertise: isConsultant ? expertise : undefined
        })
      });

      const result = await response.json();
      if (result.success) {
        onUpdateSuccess(result.user.name, result.user.email);
        onClose();
      } else {
        setError(result.message || "Failed to update profile");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
      setShowErrorModal(true);
    }
  };

  const isSaveEnabled = currentPassword.trim().length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-black">
        <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl max-w-md w-full p-8 relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 cursor-pointer transition-colors"
          >
            ✕
          </button>
          
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
            Edit Profile
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Username (Name)
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-11 px-4 border border-[#c1cfee] rounded-xl focus:outline-none focus:border-blue-500 text-sm font-semibold"
                placeholder="Enter new username"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-11 px-4 border border-[#c1cfee] rounded-xl focus:outline-none focus:border-blue-500 text-sm font-semibold"
                placeholder="Enter new email"
              />
            </div>

            {isConsultant && (
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Expertise
                </label>
                <input
                  type="text"
                  value={expertise}
                  onChange={e => setExpertise(e.target.value)}
                  className="w-full h-11 px-4 border border-[#c1cfee] rounded-xl focus:outline-none focus:border-blue-500 text-sm font-semibold"
                  placeholder="Enter expertise (e.g. Admissions, Financial Aid)"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-11 px-4 border border-[#c1cfee] rounded-xl focus:outline-none focus:border-blue-500 text-sm font-semibold"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="border-t border-gray-150 pt-4">
              <label className="text-xs font-bold text-red-500 uppercase tracking-wider block mb-1.5">
                Current Password * (Required to save)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full h-11 px-4 border border-red-200 focus:border-red-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 text-sm font-semibold"
                placeholder="Verify current password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isSaveEnabled}
              className={`w-full h-12 rounded-full font-bold text-sm transition shadow-sm mt-6 cursor-pointer ${
                isSaveEnabled 
                  ? "bg-[#0066FF] hover:bg-blue-700 text-white" 
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              }`}
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Error alert modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in text-black">
          <div className="bg-white border border-gray-150 rounded-[24px] shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Error Updating Profile</h4>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}
