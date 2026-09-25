import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Clock3,
  Eye,
  EyeOff,
  Info,
  Loader2,
  LockKeyhole,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { getPostLoginPath } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/useI18n";
import AuthShell from "./auth/AuthShell";
import styles from "./auth/Auth.module.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ICON = { size: 18, strokeWidth: 1.75, "aria-hidden": true };

function validate({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "errorEmail";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "errorEmailFormat";
  if (!password) errors.password = "errorPassword";
  return errors;
}

function describeError(err, lang, t) {
  if (err.code === "network") return t("errorNetwork");
  if (err.status === 400 || err.status === 401) return t("errorCredentials");
  // Server messages are English only, so Kannada readers get our reviewed copy instead
  return lang === "en" && err.message ? err.message : t("errorGeneric");
}

export default function Login() {
  const { login, isAuthenticated, user, endReason, clearEndReason } = useAuth();
  const location = useLocation();
  const { t, lang } = useI18n("auth");

  const from = location.state?.from;
  // Hold on to why the last session ended; the context flag is cleared once shown
  const [ended] = useState(endReason);
  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (endReason) clearEndReason();
  }, [endReason, clearEndReason]);

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  if (isAuthenticated) {
    return <Navigate to={getPostLoginPath(user?.role, lang, from)} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleKey = (event) => {
    if (typeof event.getModifierState === "function") {
      setCapsLock(event.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");

    const nextErrors = validate(form);
    setFieldErrors(nextErrors);
    if (nextErrors.email) {
      emailRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      // On success the session updates and the <Navigate> above takes over
      await login({ email: form.email.trim(), password: form.password });
    } catch (err) {
      setIsSubmitting(false);
      setError(describeError(err, lang, t));
    }
  };

  let notice = null;
  if (ended === "signed-out") {
    notice = (
      <div className={styles.notice} role="status">
        <Info {...ICON} />
        <div>
          <strong>{t("signedOutTitle")}</strong>
          <p>{t("signedOutBody")}</p>
          <Link to={`/${lang}`}>{t("backHome")}</Link>
        </div>
      </div>
    );
  } else if (ended === "expired") {
    notice = (
      <div className={`${styles.notice} ${styles.noticeExpired}`} role="status">
        <Clock3 {...ICON} />
        <div>
          <strong>{t("expiredTitle")}</strong>
          <p>{t("expiredBody")}</p>
        </div>
      </div>
    );
  }

  const lead = from && !ended ? `${t("lead")} ${t("continueNote")}` : t("lead");

  return (
    <AuthShell title={t("title")} lead={lead} notice={notice}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
        <div className={styles.field}>
          <label className={styles.labelRow} htmlFor="login-email">
            {t("email")}
          </label>
          <div className={`${styles.inputWrap} ${fieldErrors.email ? styles.invalid : ""}`}>
            <Mail {...ICON} />
            <input
              ref={emailRef}
              id="login-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="username"
              inputMode="email"
              autoCapitalize="none"
              spellCheck="false"
              aria-invalid={fieldErrors.email ? true : undefined}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              required
            />
          </div>
          {fieldErrors.email ? (
            <p className={styles.fieldError} id="login-email-error">
              <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
              {t(fieldErrors.email)}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className={styles.labelRow} htmlFor="login-password">
            {t("password")}
          </label>
          <div className={`${styles.inputWrap} ${fieldErrors.password ? styles.invalid : ""}`}>
            <LockKeyhole {...ICON} />
            <input
              ref={passwordRef}
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKey}
              onKeyUp={handleKey}
              onBlur={() => setCapsLock(false)}
              autoComplete="current-password"
              aria-invalid={fieldErrors.password ? true : undefined}
              aria-describedby={
                [fieldErrors.password && "login-password-error", capsLock && "login-caps"].filter(Boolean).join(" ") || undefined
              }
              required
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              aria-pressed={showPassword}
              aria-controls="login-password"
            >
              {showPassword ? <EyeOff {...ICON} /> : <Eye {...ICON} />}
              <span aria-hidden="true">{showPassword ? t("hide") : t("show")}</span>
            </button>
          </div>
          {fieldErrors.password ? (
            <p className={styles.fieldError} id="login-password-error">
              <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
              {t(fieldErrors.password)}
            </p>
          ) : null}
          {capsLock ? (
            <p className={styles.hint} id="login-caps" role="status">
              <Info size={15} strokeWidth={2} aria-hidden="true" />
              {t("capsLock")}
            </p>
          ) : null}
        </div>

        {error ? (
          <p className={styles.error} role="alert" tabIndex={-1} ref={errorRef}>
            <AlertCircle {...ICON} />
            <span>{error}</span>
          </p>
        ) : null}

        <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
          <span>{isSubmitting ? t("submitting") : t("submit")}</span>
          <span className={styles.submitIcon} aria-hidden="true">
            {isSubmitting ? <Loader2 size={18} strokeWidth={2} className={styles.spin} /> : <ArrowRight size={18} strokeWidth={2} />}
          </span>
        </button>
      </form>

      <p className={styles.divider}>{t("newHere")}</p>
      <Link to={`/${lang}/register`} state={from ? { from } : undefined} className={styles.secondaryButton}>
        <UserPlus {...ICON} />
        <span>{t("register")}</span>
      </Link>

      <div className={styles.aside}>
        <p>{t("staffNote")}</p>
        <p>
          {t("help")}{" "}
          <a href="tel:+919741585030">
            <Phone size={14} strokeWidth={2} aria-hidden="true" />
            +91 97415 85030
          </a>
        </p>
      </div>
    </AuthShell>
  );
}
