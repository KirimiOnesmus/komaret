import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = 'info', durationMs = 4000 } = {}) => {
      const id = ++toastId;

      setToasts((prev) => [...prev, { id, message, type }]);
      if (durationMs > 0) {
        setTimeout(() => removeToast(id), durationMs);
      }
      return id;
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      globalLoading,
      setGlobalLoading,
    }),
    [toasts, showToast, removeToast, globalLoading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return ctx;
}

export default AppContext;
