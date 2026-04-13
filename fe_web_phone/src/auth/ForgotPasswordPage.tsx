import React, { useState, useRef, useEffect } from "react";


const apiUrl = process.env.REACT_APP_API_URL;


async function apiForgotSendOtp(email: string): Promise<void> {
  const res = await fetch(`${apiUrl}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Không thể gửi OTP");
  }
}

async function apiForgotVerifyOtp(email: string, otp: string): Promise<void> {
  const res = await fetch(`${apiUrl}/auth/forgot-password/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "OTP không hợp lệ");
  }
}

async function apiResetPassword(email: string, otp: string, password: string): Promise<void> {
  const res = await fetch(`${apiUrl}/auth/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword: password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Đặt lại mật khẩu thất bại");
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const LockIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);

const CheckCircleIcon: React.FC = () => (
  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ArrowLeftIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

// ─── OTP Input ────────────────────────────────────────────────────────────────

const OtpInput: React.FC<{ value: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
  const refs = useRef<Array<React.RefObject<HTMLInputElement>>>(
    Array.from({ length: 6 }, () => React.createRef<HTMLInputElement>())
  );
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (idx: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d, i) => (i === idx ? char : d));
    onChange(arr.join(""));
    if (char && idx < 5) refs.current[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) refs.current[idx - 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) { onChange(pasted.padEnd(6, "").slice(0, 6)); refs.current[Math.min(pasted.length, 5)].current?.focus(); }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "4px 0 20px" }}>
      {digits.map((d, i) => (
        <input key={i} ref={refs.current[i]} type="text" inputMode="numeric" maxLength={1}
          value={d} disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: 46, height: 54, textAlign: "center", fontSize: 22, fontWeight: 700,
            border: `2px solid ${d ? "#f07828" : "#e5e7eb"}`,
            borderRadius: 10, outline: "none", background: d ? "#fff7f0" : "#fafafa",
            color: "#111", transition: "border-color 0.2s, background 0.2s",
            fontFamily: "'DM Mono', monospace",
          }}
        />
      ))}
    </div>
  );
};

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS = ["Email", "OTP", "Mật khẩu mới"];

const StepBar: React.FC<{ current: number }> = ({ current }) => (
  <div style={{ display: "flex", alignItems: "center", marginBottom: 32 }}>
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700,
              background: done ? "#22c55e" : active ? "#f07828" : "#f3f4f6",
              color: done || active ? "#fff" : "#9ca3af",
              border: `2px solid ${done ? "#22c55e" : active ? "#f07828" : "#e5e7eb"}`,
              transition: "all 0.3s",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 11, fontWeight: active ? 700 : 400,
              color: active ? "#f07828" : done ? "#22c55e" : "#9ca3af",
              transition: "color 0.3s", whiteSpace: "nowrap",
            }}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{
              flex: 1, height: 2, margin: "0 6px", marginBottom: 18,
              background: done ? "#22c55e" : "#e5e7eb", transition: "background 0.4s",
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3;

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    setTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0; } return t - 1; });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ─── Step 0: Send OTP ────────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) { setError("Vui lòng nhập email"); return; }
    setLoading(true);
    try {
      await apiForgotSendOtp(email);
      setSuccess(`Đã gửi OTP đến ${email}`);
      startTimer();
      setTimeout(() => { setSuccess(null); setStep(1); }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 1: Verify OTP ──────────────────────────────────────────────────

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) { setError("Vui lòng nhập đủ 6 chữ số"); return; }
    setLoading(true);
    try {
      await apiForgotVerifyOtp(email, otp);
      setSuccess("Xác thực OTP thành công!");
      setTimeout(() => { setSuccess(null); setStep(2); }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Reset Password ──────────────────────────────────────────────

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) { setError("Mật khẩu phải có ít nhất 8 ký tự"); return; }
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    try {
      await apiResetPassword(email, otp, password);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };



  const strength = Math.min(4, Math.floor(password.length / 3));
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Yếu", "Trung bình", "Khá", "Mạnh"];


  return (
    <div style={s.root}>

      <div style={s.left}>
        <div style={s.leftBlob1} />
        <div style={s.leftBlob2} />
        <div style={s.leftContent}>
          <div style={s.lockWrap}>
            <div style={s.lockRing1} />
            <div style={s.lockRing2} />
            <div style={s.lockIcon}><LockIcon /></div>
          </div>
          <h2 style={s.leftTitle}>Khôi phục mật khẩu</h2>
          <p style={s.leftSub}>
            Đặt lại mật khẩu an toàn với quy trình xác thực nhiều bước.
            Bảo mật tài khoản là ưu tiên hàng đầu của chúng tôi.
          </p>
          <div style={s.stepPills}>
            {["Nhập email", "Xác thực OTP", "Mật khẩu mới"].map((t, i) => (
              <div key={i} style={{ ...s.pill, background: i < step ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)" }}>
                <span style={s.pillNum}>{i + 1}</span>
                <span style={s.pillText}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.card}>

          <div style={s.logo}>
            <span style={s.logoIcon}>📱</span>
            <span style={s.logoText}>PhoneHub</span>
          </div>

         
          {step < 3 && <StepBar current={step} />}

          {step === 0 && (
            <>
              <h1 style={s.heading}>Quên mật khẩu?</h1>
              <p style={s.sub}>Nhập email để nhận mã OTP đặt lại mật khẩu.</p>
              {error && <div style={s.errorBox}>{error}</div>}
              {success && <div style={s.successBox}>✓ {success}</div>}
              <form onSubmit={handleSendOtp} noValidate>
                <label style={s.label}>Địa chỉ Email</label>
                <div style={s.inputWrap}>
                  <span style={s.inputIcon}><MailIcon /></span>
                  <input type="email" autoComplete="email" placeholder="example@mail.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    required disabled={loading}
                    style={s.inputWithIcon} />
                </div>
                <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}>
                  {loading ? "Đang gửi…" : "Gửi mã OTP"}
                </button>
              </form>
              <div style={s.backRow}>
                <a href="/login" style={s.backLink}><ArrowLeftIcon /> Quay lại đăng nhập</a>
              </div>
            </>
          )}

    
          {step === 1 && (
            <>
              <h1 style={s.heading}>Nhập mã OTP</h1>
              <p style={s.sub}>Mã 6 chữ số đã được gửi đến<br /><strong style={{ color: "#f07828" }}>{email}</strong></p>
              {error && <div style={s.errorBox}>{error}</div>}
              {success && <div style={s.successBox}>✓ {success}</div>}
              <form onSubmit={handleVerifyOtp} noValidate>
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
                <div style={s.resendRow}>
                  {timer > 0 ? (
                    <span style={s.timerText}>Gửi lại sau <strong>{timer}s</strong></span>
                  ) : (
                    <button type="button" style={s.resendBtn} onClick={async () => {
                      setError(null); setLoading(true);
                      try { await apiForgotSendOtp(email); startTimer(); setSuccess("OTP đã gửi lại!"); setTimeout(() => setSuccess(null), 2000); }
                      catch (err) { setError(err instanceof Error ? err.message : "Lỗi"); }
                      finally { setLoading(false); }
                    }}>Gửi lại OTP</button>
                  )}
                  <button type="button" style={s.changeEmailBtn} onClick={() => { setError(null); setOtp(""); setStep(0); }}>
                    ← Đổi email
                  </button>
                </div>
                <button type="submit" disabled={loading || otp.length < 6}
                  style={{ ...s.btn, opacity: (loading || otp.length < 6) ? 0.6 : 1 }}>
                  {loading ? "Đang xác thực…" : "Xác nhận OTP"}
                </button>
              </form>
            </>
          )}


          {step === 2 && (
            <>
              <h1 style={s.heading}>Mật khẩu mới</h1>
              <p style={s.sub}>Tạo mật khẩu mạnh cho tài khoản của bạn.</p>
              {error && <div style={s.errorBox}>{error}</div>}
              <form onSubmit={handleReset} noValidate>
                <div style={{ marginBottom: 16 }}>
                  <label style={s.label}>Mật khẩu mới</label>
                  <div style={s.pwWrap}>
                    <input type={showPw ? "text" : "password"} autoComplete="new-password"
                      placeholder="Tối thiểu 8 ký tự" value={password}
                      onChange={e => setPassword(e.target.value)} required disabled={loading}
                      style={{ ...s.input, paddingRight: 42 }} />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={s.eyeBtn}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8 }}>
                      {[1,2,3,4].map(i => (
                        <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColors[strength - 1] : "#e5e7eb", transition: "background 0.3s" }} />
                      ))}
                      <span style={{ fontSize: 11, color: "#888", marginLeft: 4 }}>{strengthLabels[strength]}</span>
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={s.label}>Xác nhận mật khẩu</label>
                  <div style={s.pwWrap}>
                    <input type={showConfirm ? "text" : "password"} autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu" value={confirm}
                      onChange={e => setConfirm(e.target.value)} required disabled={loading}
                      style={{ ...s.input, paddingRight: 42, borderColor: confirm && confirm !== password ? "#ef4444" : undefined }} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} style={s.eyeBtn}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                  {confirm && confirm !== password && (
                    <p style={{ fontSize: 12, color: "#ef4444", margin: "5px 0 0" }}>Mật khẩu không khớp</p>
                  )}
                </div>
                <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}>
                  {loading ? "Đang lưu…" : "Đặt lại mật khẩu"}
                </button>
              </form>
            </>
          )}

          {step === 3 && <SuccessView />}
        </div>
      </div>
    </div>
  );
};


const SuccessView: React.FC = () => {
  useEffect(() => {
    const t = setTimeout(() => { window.location.href = "/login"; }, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <CheckCircleIcon />
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", margin: "16px 0 8px" }}>
        Đặt lại thành công!
      </h2>
      <p style={{ color: "#555", fontSize: 14, margin: "0 0 6px" }}>
        Mật khẩu của bạn đã được cập nhật.
      </p>
      <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 20px" }}>
        Đang chuyển về trang đăng nhập…
      </p>
      <div style={{ width: "100%", height: 4, background: "#f3f4f6", borderRadius: 2, overflow: "hidden", marginBottom: 20 }}>
        <div style={{
          height: "100%", background: "#f07828", borderRadius: 2,
          animation: "shrink 3s linear forwards",
          width: "100%",
        }} />
      </div>
      <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
      <a href="/" style={{
        display: "block", width: "100%", padding: "12px", boxSizing: "border-box",
        background: "#f07828", color: "#fff", borderRadius: 10, fontWeight: 700,
        fontSize: 15, textDecoration: "none", textAlign: "center",
      }}>Đăng nhập ngay</a>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },

  // Left
  left: {
    flex: "0 0 44%", background: "linear-gradient(145deg, #f07828 0%, #c8511b 100%)",
    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  leftBlob1: { position: "absolute", top: -100, right: -100, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.10)", pointerEvents: "none" },
  leftBlob2: { position: "absolute", bottom: -80, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none" },
  leftContent: { position: "relative", zIndex: 1, padding: "48px 44px", textAlign: "center" },

  lockWrap: { position: "relative", width: 100, height: 100, margin: "0 auto 28px" },
  lockRing1: { position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.25)" },
  lockRing2: { position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.15)" },
  lockIcon: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.18)", borderRadius: "50%" },

  leftTitle: { color: "#fff", fontSize: 26, fontWeight: 800, margin: "0 0 14px", lineHeight: 1.25 },
  leftSub: { color: "rgba(255,255,255,0.82)", fontSize: 14, lineHeight: 1.7, margin: "0 0 32px" },

  stepPills: { display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" },
  pill: { display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", borderRadius: 20, width: "100%" },
  pillNum: { width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.3)", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  pillText: { color: "#fff", fontSize: 13, fontWeight: 500 },

  // Right
  right: { flex: 1, background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
  card: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 16, padding: "36px 36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" },

  logo: { display: "flex", alignItems: "center", gap: 8, marginBottom: 28 },
  logoIcon: { fontSize: 20 },
  logoText: { fontSize: 17, fontWeight: 800, color: "#111" },

  heading: { fontSize: 24, fontWeight: 800, color: "#111", margin: "0 0 6px", letterSpacing: "-0.3px" },
  sub: { color: "#888", fontSize: 14, margin: "0 0 22px", lineHeight: 1.6 },

  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 9, padding: "10px 14px", fontSize: 13, marginBottom: 16 },
  successBox: { background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d", borderRadius: 9, padding: "10px 14px", fontSize: 13, marginBottom: 16 },

  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 },

  inputWrap: { position: "relative", marginBottom: 18 },
  inputIcon: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#aaa", display: "flex", alignItems: "center" },
  inputWithIcon: { width: "100%", padding: "11px 13px 11px 40px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, color: "#111", background: "#fafafa", outline: "none", boxSizing: "border-box" as const },

  input: { width: "100%", padding: "11px 13px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, color: "#111", background: "#fafafa", outline: "none", boxSizing: "border-box" as const },
  pwWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 4, display: "flex", alignItems: "center" },

  btn: { width: "100%", padding: "12px", background: "#f07828", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s" },

  resendRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  timerText: { fontSize: 13, color: "#888" },
  resendBtn: { background: "none", border: "none", color: "#f07828", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 },
  changeEmailBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: 12, cursor: "pointer", padding: 0 },

  backRow: { textAlign: "center" as const, marginTop: 20 },
  backLink: { color: "#f07828", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 },
};

export default ForgotPasswordPage;