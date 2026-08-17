import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <h2 id="modal-title" className="text-base font-bold text-[#071525]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
