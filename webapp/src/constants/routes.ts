// All client-side route paths in one place. 
export const ROUTES = {
  APP:    '/',
  HOME:   '/home',
  SIGNIN: '/signin',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
