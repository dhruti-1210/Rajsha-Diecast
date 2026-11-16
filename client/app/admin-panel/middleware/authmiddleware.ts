export const DEMO_ADMIN_EMAIL = 'admin@rajsha.com';
export const DEMO_ADMIN_PASSWORD = 'Admin@123';

const ADMIN_SESSION_KEY = 'rajsha_admin_session';

export function hasAdminSession() {
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === 'active';
}

export function signInAdmin(email: string, password: string) {
  if (email.trim().toLowerCase() !== DEMO_ADMIN_EMAIL || password !== DEMO_ADMIN_PASSWORD) {
    return false;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, 'active');
  return true;
}

export function signOutAdmin() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
