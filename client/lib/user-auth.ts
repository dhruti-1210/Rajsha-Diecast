const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
).replace(/\/+$/, '');

export const userAuthUrl = (action: string) =>
  `${apiBaseUrl}/users/auth/${action}`;
