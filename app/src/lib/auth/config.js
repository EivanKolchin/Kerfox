const asBool = (value) => String(value || '').toLowerCase() === 'true';

export const AUTH_ENV = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  googleEnabled: asBool(import.meta.env.VITE_AUTH_GOOGLE_ENABLED),
  githubEnabled: asBool(import.meta.env.VITE_AUTH_GITHUB_ENABLED),
  microsoftEnabled: asBool(import.meta.env.VITE_AUTH_MICROSOFT_ENABLED),
};

export const AUTH_PROVIDERS = [
  { id: 'google', label: 'Google', readyFlag: 'googleEnabled' },
  { id: 'github', label: 'GitHub', readyFlag: 'githubEnabled' },
  { id: 'microsoft', label: 'Microsoft', readyFlag: 'microsoftEnabled' },
];

export function getAuthReadiness() {
  return {
    supabaseConfigured: !!AUTH_ENV.supabaseUrl && !!AUTH_ENV.supabaseAnonKey,
    googleEnabled: AUTH_ENV.googleEnabled,
    githubEnabled: AUTH_ENV.githubEnabled,
    microsoftEnabled: AUTH_ENV.microsoftEnabled,
  };
}
