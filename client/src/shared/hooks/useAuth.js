import { useAuthContext } from '../context/AuthContext';

/**
 * Convenience re-export of the auth context. Kept as a hook (rather
 * than having components import useAuthContext directly) so call sites
 * read the same as before the Context migration and so the provider
 * detail stays an implementation detail of this hook.
 */
export default function useAuth() {
  return useAuthContext();
}
