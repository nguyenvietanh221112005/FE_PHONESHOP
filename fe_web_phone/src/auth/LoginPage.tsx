import React, { useState } from "react";


const apiUrl = process.env.REACT_APP_API_URL;


interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthResponse {
  success: boolean;
  user: { id: string; email: string; full_name: string };
  message?: string;
}


export async function loginWithCredentials(
  credentials: LoginCredentials
): Promise<AuthResponse> {

  const res = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    credentials: "include",      
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data: AuthResponse = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message ?? "Đăng nhập thất bại");
  }


  return data;
}


export function loginWithGoogle(): void {
  window.location.href = `${apiUrl}/auth/google`;
}


export function loginWithFacebook(): void {
  window.location.href = `${apiUrl}/auth/facebook`;
}

export async function logout(): Promise<void> {

  await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}


const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
  </svg>
);

const FacebookIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState<"creds" | "google" | "facebook" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading("creds");
    try {
      const result = await loginWithCredentials({ email, password, rememberMe });
      console.log("Logged in:", result.user);
      window.location.href = "/dashboard"; // hoặc dùng React Router navigate()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(null);
    }
  };

  const handleGoogle = () => {
    setError(null);
    setLoading("google");
    loginWithGoogle(); // redirect — loading state sẽ không reset (trang chuyển hướng)
  };

  const handleFacebook = () => {
    setError(null);
    setLoading("facebook");
    loginWithFacebook();
  };

  const busy = loading !== null;

  return (
    <div style={s.root}>
      {/* ─── LEFT ─── */}
      <div style={s.left}>
        <div style={s.blob1} />
        <div style={s.blob2} />

        <div style={s.illustration}>
          <div style={{ ...s.item, width: 88, height: 152, borderRadius: 14, background: "rgba(255,255,255,0.92)", top: "22%", left: "28%", transform: "rotate(-14deg)" }} />
          <div style={{ ...s.item, width: 58, height: 58, borderRadius: "50%", background: "rgba(0,0,0,0.55)", top: "17%", left: "54%", transform: "rotate(0deg)" }} />
          <div style={{ ...s.item, width: 72, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.7)", top: "37%", left: "16%", transform: "rotate(28deg)" }} />
          <div style={{ ...s.item, width: 52, height: 52, borderRadius: 10, background: "rgba(80,80,80,0.75)", top: "50%", left: "57%", transform: "rotate(18deg)" }} />
          <div style={{ ...s.item, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.5)", top: "28%", left: "62%", transform: "rotate(0deg)" }} />
          <div style={{ ...s.item, width: 38, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.6)", top: "62%", left: "22%", transform: "rotate(-10deg)" }} />
        </div>

        <div style={s.leftContent}>
          <h2 style={s.leftTitle}>Your Tech Journey Starts Here</h2>
          <p style={s.leftSub}>
            Discover the latest phones and accessories with unbeatable prices and premium quality.
          </p>
        </div>
      </div>

      {/* ─── RIGHT ─── */}
      <div style={s.right}>
        <div style={s.card}>

          {/* Logo */}
          <div style={s.logoRow}>
            <div style={s.logoBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <rect x="5" y="2" width="14" height="20" rx="3" />
                <rect x="9" y="18" width="6" height="2" rx="1" fill="#e07020" />
              </svg>
            </div>
            <span style={s.logoLabel}>TechStore</span>
          </div>

          <h1 style={s.heading}>Welcome back</h1>
          <p style={s.subheading}>Sign in to your account to continue</p>

          {error && (
            <div role="alert" style={s.errorBox}>{error}</div>
          )}

          {/* ─── Form ─── */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={s.field}>
              <label htmlFor="email" style={s.label}>Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={busy}
                style={s.input}
              />
            </div>

            <div style={s.field}>
              <label htmlFor="password" style={s.label}>Password</label>
              <div style={s.pwWrap}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  disabled={busy}
                  style={{ ...s.input, paddingRight: 38 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  style={s.eyeBtn}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            <div style={s.rememberRow}>
              <label style={s.checkLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ accentColor: "#e07020", width: 14, height: 14 }}
                />
                <span style={{ marginLeft: 7, fontSize: 13, color: "#555" }}>Remember me</span>
              </label>
              <a href="/forgot-password" style={s.forgotLink}>Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={busy}
              style={{ ...s.primaryBtn, opacity: loading === "creds" ? 0.75 : 1 }}
            >
              {loading === "creds" ? "Signing in…" : "Sign in"}
            </button>
          </form>

          {/* ─── Divider ─── */}
          <div style={s.divider}>
            <span style={s.dividerLine} />
            <span style={s.dividerText}>or</span>
            <span style={s.dividerLine} />
          </div>

          {/* ─── Social buttons ─── */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            style={{ ...s.socialBtn, marginBottom: 12, opacity: loading === "google" ? 0.75 : 1 }}
          >
            <GoogleIcon />
            <span style={{ marginLeft: 10 }}>
              {loading === "google" ? "Connecting…" : "Continue with Google"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleFacebook}
            disabled={busy}
            style={{ ...s.socialBtn, opacity: loading === "facebook" ? 0.75 : 1 }}
          >
            <FacebookIcon />
            <span style={{ marginLeft: 10 }}>
              {loading === "facebook" ? "Connecting…" : "Continue with Facebook"}
            </span>
          </button>

          <p style={s.signupText}>
            Don't have an account?{" "}
            <a href="/register" style={s.signupLink}>Sign up now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  left: { flex: "0 0 46%", background: "linear-gradient(150deg, #e07020 0%, #c85a18 100%)", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "48px 44px", overflow: "hidden" },
  blob1: { position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none" },
  blob2: { position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none" },
  illustration: { position: "absolute", inset: 0, pointerEvents: "none" },
  item: { position: "absolute", boxShadow: "0 12px 32px rgba(0,0,0,0.28)" },
  leftContent: { position: "relative", zIndex: 1 },
  leftTitle: { color: "#fff", fontSize: 26, fontWeight: 700, margin: "0 0 14px", lineHeight: 1.3 },
  leftSub: { color: "rgba(255,255,255,0.80)", fontSize: 14, lineHeight: 1.65, margin: 0 },
  right: { flex: 1, background: "#f8f9fb", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
  card: { width: "100%", maxWidth: 390 },
  logoRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 },
  logoBox: { width: 36, height: 36, borderRadius: 9, background: "#e07020", display: "flex", alignItems: "center", justifyContent: "center" },
  logoLabel: { fontWeight: 700, fontSize: 18, color: "#111", letterSpacing: "-0.3px" },
  heading: { textAlign: "center", fontSize: 24, fontWeight: 700, color: "#111", margin: "0 0 6px", letterSpacing: "-0.3px" },
  subheading: { textAlign: "center", color: "#888", fontSize: 14, margin: "0 0 24px" },
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 18 },
  field: { marginBottom: 18 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 },
  input: { width: "100%", padding: "10px 13px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, color: "#111", background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" },
  pwWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4, display: "flex", alignItems: "center", lineHeight: 0 },
  rememberRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  checkLabel: { display: "flex", alignItems: "center", cursor: "pointer", userSelect: "none" },
  forgotLink: { color: "#e07020", fontSize: 13, fontWeight: 500, textDecoration: "none" },
  primaryBtn: { width: "100%", padding: "11px", background: "#e07020", color: "#fff", border: "none", borderRadius: 9, fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: "0.1px", transition: "background 0.15s, opacity 0.15s" },
  divider: { display: "flex", alignItems: "center", gap: 14, margin: "22px 0" },
  dividerLine: { flex: 1, height: 1, background: "#e5e7eb" },
  dividerText: { color: "#bbb", fontSize: 13 },
  socialBtn: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 16px", border: "1.5px solid #e5e7eb", borderRadius: 9, background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#222", transition: "background 0.15s, opacity 0.15s" },
  signupText: { textAlign: "center", marginTop: 26, fontSize: 13, color: "#888" },
  signupLink: { color: "#e07020", fontWeight: 600, textDecoration: "none" },
};

export default LoginPage;