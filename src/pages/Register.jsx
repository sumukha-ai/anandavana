import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Fingerprint,
  Home,
  LockKeyhole,
  Mail,
  Phone,
  Sparkles,
  Star,
  User,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
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
    name: "",
    email: "",
    phone_number: "",
    address: "",
    rashi_id: "",
    nakshatra_id: "",
    gotra: "",
    charana: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [lookups, setLookups] = useState({ rashis: [], nakshatras: [] });
  const [mockEmail, setMockEmail] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New states for password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const redirectTo = location.state?.from?.pathname || getRoleHomePath(user?.role, lang);

  useEffect(() => {
    let active = true;
    apiRequest("/lookups", { lang })
      .then((data) => {
        if (active) setLookups(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load profile lookups");
      });
    return () => {
      active = false;
    };
  }, [lang]);

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

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        username: form.name.trim(),
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
        rashi_id: Number(form.rashi_id),
        nakshatra_id: Number(form.nakshatra_id),
        gotra: form.gotra.trim(),
        charana: form.charana,
        password: form.password,
      };
      if (form.otp) {
        payload.otp = form.otp;
      }

      const nextAuth = await register(payload);
      if (nextAuth.requires_otp) {
        setMockEmail(nextAuth.mock_email);
        return;
      }

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
          <span className={styles.kicker}>Bhakta onboarding</span>
          <h1>Register</h1>
          <p>Create your bhakta account, verify your email, and save the profile details needed for seva bookings.</p>
          {/* <div className={styles.promiseList} aria-label="Registration highlights">
            <span><BadgeCheck size={16} aria-hidden="true" /> Email OTP verification</span>
            <span><Sparkles size={16} aria-hidden="true" /> Self profile created instantly</span>
            <span><Fingerprint size={16} aria-hidden="true" /> JWT includes role and user id</span>
          </div> */}
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span>Full name</span>
              <div className={styles.inputWrap}>
                <User size={18} aria-hidden="true" />
                <input type="text" name="name" value={form.name} onChange={handleChange} autoComplete="name" required />
              </div>
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <div className={styles.inputWrap}>
                <Mail size={18} aria-hidden="true" />
                <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" required />
              </div>
            </label>

            <label className={styles.field}>
              <span>Phone</span>
              <div className={styles.inputWrap}>
                <Phone size={18} aria-hidden="true" />
                <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange} autoComplete="tel" required />
              </div>
            </label>

            <label className={`${styles.field} ${styles.fieldWide}`}>
              <span>Address</span>
              <div className={`${styles.inputWrap} ${styles.textAreaWrap}`}>
                <Home size={18} aria-hidden="true" />
                <textarea name="address" value={form.address} onChange={handleChange} autoComplete="street-address" rows={3} required />
              </div>
            </label>

            <label className={styles.field}>
              <span>Rashi</span>
              <div className={styles.inputWrap}>
                <Star size={18} aria-hidden="true" />
                <select name="rashi_id" value={form.rashi_id} onChange={handleChange} required>
                  <option value="">Select rashi</option>
                  {lookups.rashis.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lang === "kn" ? item.name_kn : item.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.field}>
              <span>Nakshatra</span>
              <div className={styles.inputWrap}>
                <Star size={18} aria-hidden="true" />
                <select name="nakshatra_id" value={form.nakshatra_id} onChange={handleChange} required>
                  <option value="">Select nakshatra</option>
                  {lookups.nakshatras.map((item) => (
                    <option key={item.id} value={item.id}>
                      {lang === "kn" ? item.name_kn : item.name}
                    </option>
                  ))}
                </select>
              </div>
            </label>

            <label className={styles.field}>
              <span>Gotra</span>
              <div className={styles.inputWrap}>
                <Sparkles size={18} aria-hidden="true" />
                <input type="text" name="gotra" value={form.gotra} onChange={handleChange} autoComplete="off" required />
              </div>
            </label>

            <label className={styles.field}>
              <span>Charana</span>
              <div className={styles.inputWrap}>
                <Sparkles size={18} aria-hidden="true" />
                <input type="text" name="charana" value={form.charana} onChange={handleChange} required />
              </div>
            </label>

            <label className={styles.field}>
              <span>Password</span>
              <div className={styles.inputWrap}>
                <LockKeyhole size={18} aria-hidden="true" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  autoComplete="new-password" 
                  minLength={8} 
                  required 
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </label>

            <label className={styles.field}>
              <span>Confirm password</span>
              <div className={styles.inputWrap}>
                <LockKeyhole size={18} aria-hidden="true" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword" 
                  value={form.confirmPassword} 
                  onChange={handleChange} 
                  autoComplete="new-password" 
                  minLength={8} 
                  required 
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
            </label>
          </div>

          {mockEmail ? (
            <div className={styles.otpPanel}>
              <div>
                <strong>Mock email sent</strong>
                <span>{mockEmail.to}</span>
              </div>
              <code>{mockEmail.otp}</code>
            </div>
          ) : null}

          <label className={styles.field}>
            <span>Email OTP</span>
            <div className={styles.inputWrap}>
              <Mail size={18} aria-hidden="true" />
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                inputMode="numeric"
                placeholder={mockEmail ? "Enter the mocked OTP" : "Submit once to receive OTP"}
              />
            </div>
          </label>

          {error ? <p className={styles.error}>{error}</p> : null}

          <button className={styles.submitButton} type="submit" disabled={isSubmitting}>
            <UserPlus size={18} aria-hidden="true" />
            <span>{isSubmitting ? "Working" : mockEmail ? "Verify and create account" : "Send verification OTP"}</span>
          </button>

          <p className={styles.switchText}>
            Already have an account? <Link to={`/${lang}/login`}>Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}