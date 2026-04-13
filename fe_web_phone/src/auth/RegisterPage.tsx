import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterPayload {
  full_name: string; // field name backend dùng
  email: string;
  password: string;
  otp: string;       // backend verify OTP trong cùng request register
}

// ─── Auth functions ───────────────────────────────────────────────────────────

export async function sendOtp(email: string): Promise<void> {
  const res = await fetch("http://localhost:5000/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Không thể gửi OTP");
  }
}

// Không có endpoint /verify-otp riêng — backend gộp vào /register
// Hàm này chỉ gọi /register với đầy đủ payload kể cả OTP
export async function registerUser(payload: RegisterPayload): Promise<void> {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? "Đăng ký thất bại");
  }
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const PhoneIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const TruckIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const ShieldIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const TagIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const EyeIcon: React.FC<{ open: boolean }> = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

const CheckIcon: React.FC = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

// ─── Feature item ─────────────────────────────────────────────────────────────

const Feature: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
  <div style={s.feature}>
    <div style={s.featureIcon}>{icon}</div>
    <div>
      <p style={s.featureTitle}>{title}</p>
      <p style={s.featureSub}>{sub}</p>
    </div>
  </div>
);

// ─── Step indicator ───────────────────────────────────────────────────────────

const steps = ["Email", "Xác thực OTP", "Mật khẩu", "Hoàn tất"];

const StepIndicator: React.FC<{ current: number }> = ({ current }) => (
  <div style={s.stepWrap}>
    {steps.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div style={s.stepItem}>
            <div style={{
              ...s.stepCircle,
              background: done ? "#22c55e" : active ? "#f07828" : "#e5e7eb",
              color: done || active ? "#fff" : "#9ca3af",
              border: active ? "2px solid #f07828" : done ? "2px solid #22c55e" : "2px solid #e5e7eb",
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              ...s.stepLabel,
              color: active ? "#f07828" : done ? "#22c55e" : "#9ca3af",
              fontWeight: active ? 700 : 400,
            }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{
              ...s.stepLine,
              background: done ? "#22c55e" : "#e5e7eb",
            }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── OTP Input ────────────────────────────────────────────────────────────────

const OtpInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (idx: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const arr = digits.map((d, i) => (i === idx ? char : d));
    onChange(arr.join(""));
    if (char && idx < 5) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted.padEnd(6, "").slice(0, 6));
      refs[Math.min(pasted.length, 5)].current?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={s.otpWrap}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            ...s.otpBox,
            borderColor: d ? "#f07828" : "#e5e7eb",
            background: d ? "#fff7f0" : "#fff",
          }}
        />
      ))}
    </div>
  );
};

// ─── Success Step ─────────────────────────────────────────────────────────────

const SuccessStep: React.FC<{ email: string }> = ({ email }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={s.successStep}>
      <CheckIcon />
      <h2 style={s.successTitle}>Đăng ký thành công!</h2>
      <p style={s.successSub}>
        Tài khoản cho <strong>{email}</strong> đã được tạo.
      </p>
      <p style={s.successRedirect}>Đang chuyển về trang đăng nhập…</p>
      <div style={s.redirectBarWrap}>
        <div style={s.redirectBar} />
      </div>
      <a href="/login" style={s.primaryBtn}>Đăng nhập ngay</a>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

type Step = 0 | 1 | 2 | 3;

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState<Step>(0);

  // Step 0 – email
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 1 – OTP
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step 2 – password
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepSuccess, setStepSuccess] = useState<string | null>(null);

  // ─── Timer helpers ────────────────────────────────────────────────────────

  const startTimer = () => {
    setResendTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ─── Step 0 → 1: Send OTP ─────────────────────────────────────────────────

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) { setError("Vui lòng nhập email"); return; }
    setLoading(true);
    try {
      await sendOtp(email);
      setStepSuccess(`OTP đã được gửi tới ${email}`);
      startTimer();
      setTimeout(() => { setStepSuccess(null); setStep(1); }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 1 → 2: Chỉ lưu OTP, không gọi API ─────────────────────────────
  // Backend verify OTP trong cùng request /register ở bước cuối

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (otp.length < 6) { setError("Vui lòng nhập đủ 6 chữ số OTP"); return; }
    setStepSuccess("OTP hợp lệ, tiếp tục tạo mật khẩu!");
    setTimeout(() => { setStepSuccess(null); setStep(2); }, 1000);
  };

  // ─── Step 2 → 3: Register ─────────────────────────────────────────────────

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (password.length < 8) { setError("Mật khẩu phải có ít nhất 8 ký tự"); return; }
    setLoading(true);
    try {
      await registerUser({ full_name: fullName, email, password, otp });
      setStepSuccess("Tạo tài khoản thành công!");
      setTimeout(() => { setStepSuccess(null); setStep(3); }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  // ─── Password strength ────────────────────────────────────────────────────

  const strength = Math.min(4, Math.floor(password.length / 3));
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const strengthLabels = ["", "Yếu", "Trung bình", "Khá", "Mạnh"];

  // ─── Render step content ──────────────────────────────────────────────────

  const renderStep = () => {
    if (step === 3) return <SuccessStep email={email} />;

    return (
      <>
        {error && <div role="alert" style={s.errorBox}>{error}</div>}
        {stepSuccess && <div role="status" style={s.successBox}>✓ {stepSuccess}</div>}

        {/* ── Step 0: Email + Info ── */}
        {step === 0 && (
          <form onSubmit={handleSendOtp} noValidate style={s.form}>
            <div style={s.field}>
              <label htmlFor="fullName" style={s.label}>Họ và tên</label>
              <input id="fullName" type="text" autoComplete="name" placeholder="Nguyễn Văn A"
                value={fullName} onChange={e => setFullName(e.target.value)} required
                disabled={loading} style={s.input} />
            </div>
            <div style={s.field}>
              <label htmlFor="email" style={s.label}>Email</label>
              <input id="email" type="email" autoComplete="email" placeholder="example@mail.com"
                value={email} onChange={e => setEmail(e.target.value)} required
                disabled={loading} style={s.input} />
            </div>
            <div style={s.field}>
              <label htmlFor="phone" style={s.label}>Số điện thoại</label>
              <input id="phone" type="tel" autoComplete="tel" placeholder="0xxx xxx xxx"
                value={phone} onChange={e => setPhone(e.target.value)}
                disabled={loading} style={s.input} />
            </div>
            <button type="submit" disabled={loading}
              style={{ ...s.primaryBtn, opacity: loading ? 0.75 : 1 }}>
              {loading ? "Đang gửi OTP…" : "Gửi mã OTP →"}
            </button>
          </form>
        )}

        {/* ── Step 1: OTP ── */}
        {step === 1 && (
          <form onSubmit={handleVerifyOtp} noValidate style={s.form}>
            <p style={s.otpHint}>
              Nhập mã 6 chữ số được gửi đến <strong>{email}</strong>
            </p>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            <div style={s.resendRow}>
              {resendTimer > 0 ? (
                <span style={s.timerText}>Gửi lại sau {resendTimer}s</span>
              ) : (
                <button type="button" style={s.resendBtn}
                  onClick={async () => {
                    setError(null);
                    setLoading(true);
                    try { await sendOtp(email); startTimer(); setStepSuccess("OTP đã được gửi lại!"); setTimeout(() => setStepSuccess(null), 2000); }
                    catch (err) { setError(err instanceof Error ? err.message : "Lỗi"); }
                    finally { setLoading(false); }
                  }}>
                  Gửi lại OTP
                </button>
              )}
              <button type="button" style={s.backBtn} onClick={() => { setError(null); setStep(0); }}>
                ← Đổi email
              </button>
            </div>
            <button type="submit" disabled={loading || otp.length < 6}
              style={{ ...s.primaryBtn, opacity: (loading || otp.length < 6) ? 0.65 : 1 }}>
              {loading ? "Đang xác thực…" : "Xác thực OTP →"}
            </button>
          </form>
        )}

        {/* ── Step 2: Password ── */}
        {step === 2 && (
          <form onSubmit={handleRegister} noValidate style={s.form}>
            <div style={s.field}>
              <label htmlFor="password" style={s.label}>Mật khẩu</label>
              <div style={s.pwWrap}>
                <input id="password" type={showPw ? "text" : "password"} autoComplete="new-password"
                  placeholder="Tối thiểu 8 ký tự" value={password}
                  onChange={e => setPassword(e.target.value)} required
                  disabled={loading} style={{ ...s.input, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(v => !v)} style={s.eyeBtn} aria-label="Toggle password">
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {password.length > 0 && (
                <div style={s.strengthWrap}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      ...s.strengthBar,
                      background: i <= strength ? strengthColors[strength - 1] : "#e5e7eb",
                    }} />
                  ))}
                  <span style={s.strengthLabel}>{strengthLabels[strength]}</span>
                </div>
              )}
            </div>

            <div style={s.field}>
              <label htmlFor="confirm" style={s.label}>Xác nhận mật khẩu</label>
              <div style={s.pwWrap}>
                <input id="confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu" value={confirm}
                  onChange={e => setConfirm(e.target.value)} required
                  disabled={loading} style={{
                    ...s.input, paddingRight: 40,
                    borderColor: confirm && confirm !== password ? "#ef4444" : undefined,
                  }} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={s.eyeBtn} aria-label="Toggle confirm">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
              {confirm && confirm !== password && (
                <p style={s.fieldError}>Mật khẩu không khớp</p>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ ...s.primaryBtn, opacity: loading ? 0.75 : 1 }}>
              {loading ? "Đang tạo tài khoản…" : "Tạo tài khoản →"}
            </button>
          </form>
        )}

        <p style={s.signinText}>
          Đã có tài khoản?{" "}
          <a href="/login" style={s.signinLink}>Đăng nhập</a>
        </p>
      </>
    );
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={s.root}>
      {/* LEFT */}
      <div style={s.left}>
        <div style={s.blob1} />
        <div style={s.blob2} />
        <div style={s.blob3} />
        <div style={s.leftInner}>
          <div style={s.phoneIcon}><PhoneIcon /></div>
          <h2 style={s.leftTitle}>Tham gia cùng chúng tôi</h2>
          <p style={s.leftSub}>Tạo tài khoản để truy cập ưu đãi độc quyền trên điện thoại và phụ kiện mới nhất.</p>
          <div style={s.features}>
            <Feature icon={<TruckIcon />} title="Miễn phí vận chuyển" sub="Đơn hàng từ 500.000đ" />
            <Feature icon={<ShieldIcon />} title="Mua sắm an toàn" sub="Thanh toán 100% bảo mật" />
            <Feature icon={<TagIcon />} title="Ưu đãi độc quyền" sub="Giảm giá dành riêng cho thành viên" />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div style={s.right}>
        <div style={s.card}>
          {step < 3 && (
            <>
              <h1 style={s.heading}>Tạo tài khoản</h1>
              <p style={s.subheading}>Chỉ vài bước để bắt đầu mua sắm</p>
              <StepIndicator current={step} />
            </>
          )}
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  root: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },

  left: {
    flex: "0 0 46%", background: "linear-gradient(150deg, #f07828 0%, #d05f18 100%)",
    position: "relative", display: "flex", alignItems: "center", overflow: "hidden",
  },
  blob1: { position: "absolute", top: -120, right: -120, width: 340, height: 340, borderRadius: "50%", background: "rgba(255,255,255,0.10)", pointerEvents: "none" },
  blob2: { position: "absolute", bottom: -80, left: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(0,0,0,0.08)", pointerEvents: "none" },
  blob3: { position: "absolute", top: "40%", right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" },
  leftInner: { position: "relative", zIndex: 1, padding: "48px 44px" },
  phoneIcon: { marginBottom: 20 },
  leftTitle: { color: "#fff", fontSize: 30, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" },
  leftSub: { color: "rgba(255,255,255,0.82)", fontSize: 15, lineHeight: 1.65, margin: "0 0 36px" },
  features: { display: "flex", flexDirection: "column", gap: 20 },
  feature: { display: "flex", alignItems: "flex-start", gap: 14 },
  featureIcon: { width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  featureTitle: { color: "#fff", fontWeight: 700, fontSize: 15, margin: "0 0 2px" },
  featureSub: { color: "rgba(255,255,255,0.72)", fontSize: 13, margin: 0 },

  right: { flex: 1, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
  card: { width: "100%", maxWidth: 420 },

  heading: { fontSize: 26, fontWeight: 800, color: "#111", margin: "0 0 4px", letterSpacing: "-0.4px" },
  subheading: { color: "#888", fontSize: 14, margin: "0 0 20px" },

  // Step indicator
  stepWrap: { display: "flex", alignItems: "center", marginBottom: 28 },
  stepItem: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  stepCircle: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all 0.3s" },
  stepLabel: { fontSize: 10, whiteSpace: "nowrap" as const, transition: "color 0.3s" },
  stepLine: { flex: 1, height: 2, margin: "0 4px", marginBottom: 18, transition: "background 0.3s" },

  // Alerts
  errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 9, padding: "10px 14px", fontSize: 13, marginBottom: 14 },
  successBox: { background: "#f0fdf4", border: "1px solid #86efac", color: "#15803d", borderRadius: 9, padding: "10px 14px", fontSize: 13, marginBottom: 14 },

  form: { display: "flex", flexDirection: "column" },
  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 7 },
  input: { width: "100%", padding: "10px 13px", border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 14, color: "#111", background: "#fff", outline: "none", boxSizing: "border-box" as const, transition: "border-color 0.15s" },
  pwWrap: { position: "relative" },
  eyeBtn: { position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: 4, display: "flex", alignItems: "center", lineHeight: 0 },
  strengthWrap: { display: "flex", alignItems: "center", gap: 4, marginTop: 8 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, transition: "background 0.3s" },
  strengthLabel: { fontSize: 11, color: "#888", marginLeft: 4, whiteSpace: "nowrap" as const },
  fieldError: { fontSize: 12, color: "#ef4444", margin: "5px 0 0" },
  primaryBtn: { width: "100%", padding: "12px", background: "#f07828", color: "#fff", border: "none", borderRadius: 9, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, letterSpacing: "0.1px", transition: "background 0.15s, opacity 0.15s", textAlign: "center" as const, textDecoration: "none", display: "block" },
  signinText: { textAlign: "center" as const, marginTop: 24, fontSize: 13, color: "#888" },
  signinLink: { color: "#f07828", fontWeight: 700, textDecoration: "none" },

  // OTP
  otpHint: { fontSize: 14, color: "#555", margin: "0 0 18px", lineHeight: 1.5 },
  otpWrap: { display: "flex", gap: 8, marginBottom: 16, justifyContent: "center" },
  otpBox: { width: 44, height: 52, textAlign: "center" as const, fontSize: 22, fontWeight: 700, border: "2px solid #e5e7eb", borderRadius: 9, outline: "none", transition: "border-color 0.2s, background 0.2s", boxSizing: "border-box" as const },
  resendRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  timerText: { fontSize: 12, color: "#888" },
  resendBtn: { background: "none", border: "none", color: "#f07828", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0 },
  backBtn: { background: "none", border: "none", color: "#9ca3af", fontSize: 12, cursor: "pointer", padding: 0 },

  // Success step
  successStep: { display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 0", textAlign: "center" as const },
  successTitle: { fontSize: 24, fontWeight: 800, color: "#111", margin: "16px 0 8px" },
  successSub: { color: "#555", fontSize: 14, margin: "0 0 8px" },
  successRedirect: { color: "#9ca3af", fontSize: 13, margin: "0 0 12px" },
  redirectBarWrap: { width: "100%", height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden", marginBottom: 24 },
  redirectBar: {
    height: "100%", background: "#f07828", borderRadius: 2,
    animation: "countdown 3s linear forwards",
    width: "100%",
  },
};

export default RegisterPage;