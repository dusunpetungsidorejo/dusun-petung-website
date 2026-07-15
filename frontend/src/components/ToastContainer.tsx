import React from "react";
import { Check, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

interface ToastContainerProps {
  toast: ToastProps;
  setToast: (t: null) => void;
}

export function ToastContainer({ toast, setToast }: ToastContainerProps) {
  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
        <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border shadow-xl transition-all duration-300 ${
          toast.type === "success" 
            ? "bg-[#E6F4EA] border-[#3A6520]/20 text-[#2D5016]" 
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {toast.type === "success" ? (
            <span className="w-5 h-5 rounded-full bg-[#3A6520] flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
          ) : (
            <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
              <X className="w-3.5 h-3.5" strokeWidth={3} />
            </span>
          )}
          <span className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {toast.message}
          </span>
          <button onClick={() => setToast(null)} className="text-black/30 hover:text-black/60 transition-colors ml-2 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}
