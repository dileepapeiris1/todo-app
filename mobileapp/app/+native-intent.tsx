export function redirectSystemPath({ path }: { path: string }) {
  if (path.includes('expo-auth-session')) {
    return path.replace('expo-auth-session', 'sign-in');
  }
  return path;
}
