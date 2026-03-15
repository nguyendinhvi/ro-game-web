import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { FormEvent, useEffect, useState } from "react";
import { SEO } from "@/components";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import { BrandLogo } from "@/components/UI";
import { IconEye, IconEyeOff } from "@/components/core/Icon";
import { useAuth } from "@/context/AuthProvider";
import type { IRegisterBody } from "@/interfaces";

const MIN_PASSWORD_LEN = 8;

function messageFromRegisterError(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string } | undefined;
    if (data?.error) {
      return data.error;
    }
  }
  return "Đăng ký thất bại. Vui lòng thử lại.";
}

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { register, loginWithGoogle, user, ready } = useAuth();

  const handleGoogleSuccess = async (idToken: string) => {
    setError("");
    setSubmitting(true);
    try {
      await loginWithGoogle(idToken);
      await router.push("/");
    } catch (err) {
      setError(messageFromRegisterError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD_LEN) {
      setError(`Mật khẩu cần ít nhất ${MIN_PASSWORD_LEN} ký tự.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSubmitting(true);
    try {
      const body: IRegisterBody = {
        email: email.trim(),
        password,
        ...(displayName.trim() !== ""
          ? { display_name: displayName.trim() }
          : {}),
      };
      await register(body);
      await router.push("/");
    } catch (err) {
      setError(messageFromRegisterError(err));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (ready && user != null) {
      void router.replace("/");
    }
  }, [ready, user, router]);

  return (
    <div className="login-page">
      <SEO
        title="Đăng ký"
        description="Tạo tài khoản RO Game miễn phí và khám phá thư viện game online."
        canonical="/register"
        noIndex
      />
      <div className="login-split">
        <section
          className="login-panel login-panel--form"
          aria-labelledby="register-heading"
        >
          <div className="login-form-inner">
            <BrandLogo
              className="login-brand"
              imageClassName="login-brand-img"
              textClassName="login-brand-text"
            />

            <h1 id="register-heading" className="login-heading">
              Tạo tài khoản
            </h1>
            <p className="login-lead">
              Tham gia cộng đồng — chọn cách đăng ký:
            </p>

            <div className="login-social-row">
              <GoogleSignInButton
                disabled={submitting}
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError("Đăng ký Google thất bại. Vui lòng thử lại.")
                }
              />
              <button
                type="button"
                className="login-social-btn"
                disabled
                title="Tính năng sắp ra mắt"
                aria-label="Đăng ký Facebook (sắp có)"
              >
                <span
                  className="login-social-icon login-social-icon--facebook"
                  aria-hidden
                />
                Facebook
              </button>
            </div>

            <div className="login-divider">
              <span className="login-divider-line" aria-hidden />
              <span className="login-divider-text">
                hoặc đăng ký bằng email
              </span>
              <span className="login-divider-line" aria-hidden />
            </div>

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label
                  className="login-field-label visually-hidden"
                  htmlFor="register-display-name"
                >
                  Tên hiển thị
                </label>
                <span
                  className="login-input-icon login-input-icon--user"
                  aria-hidden
                />
                <input
                  id="register-display-name"
                  className="login-input login-input--with-icons"
                  type="text"
                  name="displayName"
                  placeholder="Tên hiển thị (tuỳ chọn)"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={submitting}
                />
              </div>

              <div className="login-field">
                <label
                  className="login-field-label visually-hidden"
                  htmlFor="register-email"
                >
                  Email
                </label>
                <span
                  className="login-input-icon login-input-icon--mail"
                  aria-hidden
                />
                <input
                  id="register-email"
                  className="login-input login-input--with-icons"
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="login-field">
                <label
                  className="login-field-label visually-hidden"
                  htmlFor="register-password"
                >
                  Mật khẩu
                </label>
                <span
                  className="login-input-icon login-input-icon--lock"
                  aria-hidden
                />
                <input
                  id="register-password"
                  className="login-input login-input--with-icons login-input--password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu (tối thiểu 8 ký tự)"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  className="login-toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  disabled={submitting}
                >
                  {showPassword ? (
                    <IconEyeOff width={20} height={20} aria-hidden />
                  ) : (
                    <IconEye width={20} height={20} aria-hidden />
                  )}
                </button>
              </div>

              <div className="login-field">
                <label
                  className="login-field-label visually-hidden"
                  htmlFor="register-confirm-password"
                >
                  Xác nhận mật khẩu
                </label>
                <span
                  className="login-input-icon login-input-icon--lock"
                  aria-hidden
                />
                <input
                  id="register-confirm-password"
                  className="login-input login-input--with-icons login-input--password"
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>

              {error ? (
                <p className="login-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="login-submit"
                disabled={submitting}
              >
                {submitting ? "Đang xử lý…" : "Đăng ký"}
              </button>
            </form>

            <p className="login-signup">
              Đã có tài khoản?{" "}
              <Link href="/login" className="login-signup-link">
                Đăng nhập
              </Link>
            </p>
          </div>
        </section>

        <aside className="login-panel login-panel--hero" aria-hidden>
          <div className="login-hero-glow" />
          <div className="login-hero-art">
            <svg
              className="login-hero-svg"
              viewBox="0 0 400 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <circle
                cx="200"
                cy="120"
                r="88"
                fill="url(#registerHeroGrad)"
                opacity="0.35"
              />
              <rect
                x="148"
                y="72"
                width="104"
                height="96"
                rx="12"
                fill="rgba(255,255,255,0.95)"
              />
              <rect
                x="160"
                y="88"
                width="48"
                height="6"
                rx="2"
                fill="#cbd5e1"
              />
              <rect
                x="160"
                y="102"
                width="80"
                height="4"
                rx="2"
                fill="#e2e8f0"
              />
              <circle cx="168" cy="124" r="8" fill="#94a3b8" />
              <rect
                x="184"
                y="118"
                width="56"
                height="4"
                rx="1"
                fill="#cbd5e1"
              />
              <rect
                x="184"
                y="126"
                width="40"
                height="4"
                rx="1"
                fill="#e2e8f0"
              />
              <circle cx="168" cy="148" r="8" fill="#94a3b8" />
              <rect
                x="184"
                y="142"
                width="52"
                height="4"
                rx="1"
                fill="#cbd5e1"
              />
              <rect
                x="184"
                y="150"
                width="36"
                height="4"
                rx="1"
                fill="#e2e8f0"
              />
              <circle cx="72" cy="100" r="22" fill="white" fillOpacity="0.95" />
              <circle cx="328" cy="88" r="22" fill="white" fillOpacity="0.95" />
              <circle cx="88" cy="168" r="18" fill="white" fillOpacity="0.85" />
              <path
                d="M94 100 L148 108"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M306 88 L252 100"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M100 168 L160 140"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="registerHeroGrad"
                  x1="112"
                  y1="32"
                  x2="288"
                  y2="208"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#fff" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="login-hero-copy">
            <h2 className="login-hero-title">
              Bắt đầu hành trình game của bạn.
            </h2>
            <p className="login-hero-sub">
              Lưu tiến độ, khám phá nội dung mới và đồng bộ trên mọi thiết bị.
            </p>
            <div className="login-hero-dots" aria-hidden>
              <span className="login-hero-dot" />
              <span className="login-hero-dot login-hero-dot--active" />
              <span className="login-hero-dot" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
