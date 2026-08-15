import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import authService from '../services/authService';


const AuthContext = createContext(null);

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'loading', error: null };
    case 'AUTHENTICATED':
      return { ...state, status: 'authenticated', user: action.user, error: null };
    case 'UNAUTHENTICATED':
      return { ...state, status: 'unauthenticated', user: null };
    case 'ERROR':
      return { ...state, status: 'error', user: null, error: action.error };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'LOADING' });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'AUTHENTICATED', user });
      return user;
    } catch (err) {
      dispatch({ type: 'ERROR', error: err.message || 'Login failed.' });
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch({ type: 'UNAUTHENTICATED' });
  }, []);

  const bootstrapSession = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      await authService.refresh();
      const user = await authService.getCurrentUser();
      dispatch({ type: 'AUTHENTICATED', user });
    } catch {
      dispatch({ type: 'UNAUTHENTICATED' });
    }
  }, []);

  const hasRole = useCallback(
    (role) => {
      const u = state.user;
      if (!u || !role) return false;
      const target = String(role).toUpperCase();
      if (Array.isArray(u.roles)) {
        return u.roles.some((r) => String(r).toUpperCase() === target);
      }
      return u.role ? String(u.role).toUpperCase() === target : false;
    },
    [state.user]
  );

  const value = useMemo(
    () => ({
      user: state.user,
      status: state.status,
      error: state.error,
      isAuthenticated: state.status === 'authenticated',
      login,
      logout,
      bootstrapSession,
      hasRole,
    }),
    [state, login, logout, bootstrapSession, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}

export default AuthContext;