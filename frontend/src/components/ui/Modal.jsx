import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ebony/50"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm bg-paper rounded-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="font-display text-lg font-semibold text-bayou mb-2">
            {title}
          </h2>
        )}
        <p className="text-sm text-ebony/75 leading-relaxed">{children}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-sun text-ebony font-medium text-sm py-2.5 rounded-full hover:brightness-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}