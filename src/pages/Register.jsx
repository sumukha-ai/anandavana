import { useState } from "react";
import { LockKeyhole, Mail, User, UserPlus } from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { getRoleHomePath } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import styles from "./Login.module.css";

export default function Register() {
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const nextAuth = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      navigate(getRoleHomePath(nextAuth.user?.role, lang), { replace: true });
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.loginPage}>
      <div className={styles.loginPanel}>
        <div className={styles.copyBlock}>
          <span className={styles.kicker}>Create access</span>
          <h1>Register</h1>
          <p>Create an account for public access. New accounts start with the User role.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Username</span>
            <div className={styles.inputWrap}>
              <User size={18} aria-hidden="true" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                minLength={3}
                maxLength={80}
                required
              />
            </div>
          </label>

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
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </label>

          <label className={styles.field}>
            <span>Confirm password</span>
            <div className={styles.inputWrap}>
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            <UserPlus size={18} aria-hidden="true" />
            <span>{isSubmitting ? "Creating account" : "Register"}</span>
          </button>

          <p className={styles.switchText}>
            Already have an account? <Link to={`/${lang}/login`}>Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}