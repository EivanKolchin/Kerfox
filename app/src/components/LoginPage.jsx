import { useEffect, useState } from 'react';
import { AUTH_ENV, AUTH_PROVIDERS, getAuthReadiness } from '../lib/auth/config.js';
import { supabase } from '../lib/auth/supabase.js';

function StatusChip({ ok, label }) {
  return <span className={`auth-status-chip${ok ? ' ready' : ''}`}>{label}</span>;
}

export default function LoginPage({ onBack }) {
  const readiness = getAuthReadiness();
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [loadingProvider, setLoadingProvider] = useState(null);
  const [authError, setAuthError] = useState('');
  const [signedInEmail, setSignedInEmail] = useState('');

  useEffect(() => {
    let active = true;

    async function checkConnection() {
      if (!supabase) {
        if (active) setConnectionStatus('missing-env');
        return;
      }

      const { error } = await supabase.auth.getSession();
      if (!active) return;

      setConnectionStatus(error ? 'error' : 'connected');

      if (!error) {
        const { data } = await supabase.auth.getUser();
        if (active) {
          setSignedInEmail(data?.user?.email || '');
        }
      }
    }

    checkConnection();
    return () => {
      active = false;
    };
  }, []);

  async function handleProviderSignIn(provider) {
    setAuthError('');

    if (!supabase) {
      setAuthError('Supabase client is not configured.');
      return;
    }

    setLoadingProvider(provider.id);
    const redirectTo = AUTH_ENV.redirectUrl || `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider.id,
      options: { redirectTo },
    });

    if (error) {
      setAuthError(error.message || `Failed to start ${provider.label} sign in.`);
      setLoadingProvider(null);
    }
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSignedInEmail('');
  }

  return (
    <div className="landing-shell login-shell">
      <div className="landing-topbar">
        <div className="landing-brand">
          <div className="brand-mark">
            <img src="/kerfox.png" alt="Kerfox logo" />
          </div>
          <div>
            <div className="landing-brand-kicker">Kerfox</div>
            <div className="landing-brand-subtitle">Open learning platform</div>
          </div>
        </div>

        <button className="ghost-chip" onClick={onBack}>
          ← Back to learning hub
        </button>
      </div>

      <main className="landing-main">
        <section className="login-card">
          <span className="landing-hero-kicker">Authentication setup</span>
          <h1>Log in</h1>
          <p>
            This page is a placeholder while full authentication is being wired.
            Provider setup and environment templates are ready for implementation.
          </p>

          <div className="auth-status-row">
            <StatusChip ok={readiness.supabaseConfigured} label="Supabase" />
            <StatusChip ok={readiness.googleEnabled} label="Google OAuth" />
            <StatusChip ok={readiness.githubEnabled} label="GitHub OAuth" />
            <StatusChip ok={readiness.microsoftEnabled} label="Microsoft OAuth" />
          </div>

          <div className="login-provider-list">
            {AUTH_PROVIDERS.map(provider => (
              <button
                key={provider.id}
                className="login-provider-btn"
                disabled={!readiness[provider.readyFlag] || loadingProvider !== null}
                onClick={() => handleProviderSignIn(provider)}
              >
                Continue with {provider.label}
                <span>
                  {loadingProvider === provider.id
                    ? 'Redirecting...'
                    : readiness[provider.readyFlag]
                      ? 'Configured'
                      : 'Disabled in env'}
                </span>
              </button>
            ))}
          </div>

          {signedInEmail && (
            <div className="login-env-note">
              <strong>Signed in</strong>
              <div>{signedInEmail}</div>
              <button className="ghost-chip" onClick={handleSignOut}>Sign out</button>
            </div>
          )}

          {authError && (
            <div className="login-env-note">
              <strong>Auth error</strong>
              <div>{authError}</div>
            </div>
          )}

          <div className="login-env-note">
            <strong>Environment check</strong>
            <div>VITE_SUPABASE_URL: {AUTH_ENV.supabaseUrl ? 'set' : 'not set'}</div>
            <div>VITE_SUPABASE_ANON_KEY: {AUTH_ENV.supabaseAnonKey ? 'set' : 'not set'}</div>
            <div>VITE_AUTH_REDIRECT_URL: {AUTH_ENV.redirectUrl ? AUTH_ENV.redirectUrl : 'not set (using window origin)'}</div>
            <div>
              Supabase connection: {
                connectionStatus === 'connected'
                  ? 'connected'
                  : connectionStatus === 'checking'
                    ? 'checking...'
                    : connectionStatus === 'missing-env'
                      ? 'missing env vars'
                      : 'connection failed'
              }
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
