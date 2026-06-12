"use client";

import { useState, useEffect, FormEvent } from "react";

interface ConsultantReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  consultantId: number | null;
  consultantName: string;
  onSubmitSuccess: () => void;
}

export default function ConsultantReviewModal({
  isOpen,
  onClose,
  userId,
  consultantId,
  consultantName,
  onSubmitSuccess,
}: ConsultantReviewModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (!consultantId) {
      setError("No consultant selected.");
      return;
    }
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      setError("Please write a review comment.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/consultants/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          consultantId,
          rating,
          comment: comment.trim(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        onSubmitSuccess();
        onClose();
      } else {
        setError(result.message || "Failed to submit review.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while submitting your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl max-w-md w-full p-8 relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-650 p-2 cursor-pointer transition-colors text-lg"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
          Rate & Review
        </h3>
        <p className="text-gray-500 text-sm mb-6">
          Share your feedback on your consultation with <span className="font-bold text-[#0066FF]">{consultantName}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Selector */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
              Your Rating
            </span>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110 text-3xl outline-none"
                >
                  <span
                    className={`transition-colors duration-150 ${
                      star <= (hoverRating || rating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comment Box */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
              Review Comments
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full p-4 border border-[#c1cfee] rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-semibold placeholder-gray-400 resize-none transition-all"
              placeholder="What went well? How was the help with your application?"
              required
            />
            <div className="text-right text-[10px] text-gray-400 mt-1 font-mono">
              {comment.length}/500 characters
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 rounded-xl px-4 py-3 text-xs font-semibold text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || rating === 0 || !comment.trim()}
            className={`w-full h-12 rounded-full font-bold text-sm transition shadow-md cursor-pointer ${
              submitting || rating === 0 || !comment.trim()
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-blue-700 text-white active:scale-[0.98]"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
