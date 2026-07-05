import { useState } from "react";
import { LockKeyhole, LogIn, Mail } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { getRoleHomePath } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import styles from "./Login.module.css";

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || getRoleHomePath(user?.role, lang);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const nextAuth = await login(form);
      const fallbackPath = getRoleHomePath(nextAuth.user?.role, lang);
      navigate(location.state?.from?.pathname || fallbackPath, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <div className={styles.copyBlock}>
          <span className={styles.kicker}>Secure access</span>
          <h1>Sign in</h1>
          <p>Use your assigned account to access role based pages for the Samsthana team.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <div className={styles.inputWrap}>
              <Mail size={18} aria-hidden="true" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <div className={styles.inputWrap}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            <LogIn size={18} aria-hidden="true" />
            <span>{isSubmitting ? "Signing in" : "Sign in"}</span>
          </button>

          <p className={styles.switchText}>
            Need an account? <Link to={`/${lang}/register`}>Register</Link>
          </p>
        </form>
      </div>
    </section>
  );
}