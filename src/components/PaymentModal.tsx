import { useState, useEffect } from "react";

interface Payment {
  paymentId: number;
  amount: number;
  paymentStatus: string;
  paymentDate: string | null;
  applicationStatus: string | null;
  programName: string | null;
  universityName: string | null;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
}

export default function PaymentModal({ isOpen, onClose, userId }: PaymentModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      setError(null);
      fetch(`/api/payments?userId=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load payment history");
          return res.json();
        })
        .then((data) => {
          setPayments(data.payments || []);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch payment history. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-black">
      <div className="bg-white border border-gray-100 rounded-[32px] shadow-2xl max-w-3xl w-full p-8 relative flex flex-col max-h-[85vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-2 cursor-pointer transition-colors"
          title="Close"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-[#0066FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payment History
        </h3>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto min-h-[300px] flex flex-col justify-start">
          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-12 gap-3">
              <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-12 text-red-500">
              <span className="text-3xl mb-2">⚠️</span>
              <p className="font-bold">{error}</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center py-12 text-gray-400">
              <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h4 className="font-bold text-gray-700 text-lg mb-1">No Transactions Yet</h4>
              <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                You haven't made any scholarship application or consultation payments yet.
              </p>
            </div>
          ) : (
            <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-white">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-150 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  {payments.map((p) => {
                    const isCompleted = p.paymentStatus.toLowerCase() === "completed";
                    const isPending = p.paymentStatus.toLowerCase() === "pending";
                    return (
                      <tr key={p.paymentId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4.5">
                          <div className="font-bold text-gray-900 leading-snug">
                            {p.programName || "Education Consultation"}
                          </div>
                          <div className="text-xs text-gray-400 font-medium mt-0.5">
                            {p.universityName || "Interlect Advisory Group"}
                          </div>
                        </td>
                        <td className="px-6 py-4.5 font-normal text-xs text-gray-500">
                          {p.paymentDate
                            ? new Date(p.paymentDate).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short"
                              })
                            : "-"}
                        </td>
                        <td className="px-6 py-4.5 text-gray-900 font-bold">
                          ${p.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              isCompleted
                                ? "bg-green-50 text-green-700 border border-green-150"
                                : isPending
                                ? "bg-amber-50 text-amber-700 border border-amber-150"
                                : "bg-red-50 text-red-700 border border-red-150"
                            }`}
                          >
                            {p.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
