// Mirrors the backend's RBAC roles for client-side UI gating (nav
// visibility, disabled buttons, etc.) ONLY. The server is the actual
// authorization boundary and re-checks every request independently —
// see admin/AdminRoutes.jsx and the "Security notes" throughout
// features/admin for the recurring reminder.
export const ROLES = Object.freeze({
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
});

export default ROLES;
