import { useEffect, useState } from 'react';
import { AUTH_ENV, AUTH_PROVIDERS, getAuthReadiness } from '../lib/auth/config.js';
import { supabase } from '../lib/auth/supabase.js';

function StatusChip({ ok, label }) {
  return <span className={`auth-status-chip${ok ? ' ready' : ''}`}>{label}</span>;
}

export default function LoginPage({ onBack }) {
  const readiness = getAuthReadiness();
  const [connectionStatus, setConnectionStatus] = useState('checking');

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
    }

    checkConnection();
    return () => {
      active = false;
    };
  }, []);

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
              <button key={provider.id} className="login-provider-btn" disabled>
                Continue with {provider.label}
                <span>{readiness[provider.readyFlag] ? 'Configured' : 'Coming soon'}</span>
              </button>
            ))}
          </div>

          <div className="login-env-note">
            <strong>Environment check</strong>
            <div>VITE_SUPABASE_URL: {AUTH_ENV.supabaseUrl ? 'set' : 'not set'}</div>
            <div>VITE_SUPABASE_ANON_KEY: {AUTH_ENV.supabaseAnonKey ? 'set' : 'not set'}</div>
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
