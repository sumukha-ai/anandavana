import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  IndianRupee,
  Loader2,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./SevaDisplayPage.module.css";
import { formatAmount, sevaContactPhone, sevaImageUrl, telHref } from "./sevaHelpers";

export default function SevaDisplayPage() {
  const { token, isAuthenticated } = useAuth();
  const { lang: rawLang, sevaId } = useParams();
  const lang = normalizeLang(rawLang);
  const [sevas, setSevas] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [sevaDate, setSevaDate] = useState("");
  const [status, setStatus] = useState({ type: "loading", message: "Loading seva details" });
  const [bookingStatus, setBookingStatus] = useState({ type: "idle", message: "" });
  const [booking, setBooking] = useState(null);

  const seva = useMemo(
    () => sevas.find((item) => String(item.id) === String(sevaId)),
    [sevaId, sevas]
  );

  const amount = formatAmount(seva?.amount);
  const isBookable = Boolean(seva?.is_bookable);
  const contactPhone = sevaContactPhone(seva);
  const today = new Date().toISOString().slice(0, 10);
  const visibleProfiles = isAuthenticated ? profiles : [];
  const profileSelectValue = isAuthenticated ? selectedProfileId : "";

  useEffect(() => {
    let active = true;
    async function loadSeva() {
      setStatus({ type: "loading", message: "Loading seva details" });
      try {
        const data = await apiRequest("/seva", { lang });
        if (active) {
          setSevas(data.sevas || []);
          setStatus({ type: "idle", message: "" });
        }
      } catch (error) {
        if (active) setStatus({ type: "error", message: error.message });
      }
    }
    loadSeva();
    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;
    async function loadProfiles() {
      try {
        const [profilePayload, familyPayload] = await Promise.all([
          apiRequest("/bhakta/profile", { token, lang }),
          apiRequest("/family_member", { token, lang }),
        ]);
        const nextProfiles = [
          profilePayload.profile,
          ...(familyPayload.family_members || []),
        ].filter(Boolean);
        if (active) {
          setProfiles(nextProfiles);
          setSelectedProfileId(nextProfiles[0]?.id || "");
        }
      } catch {
        if (active) {
          setProfiles([]);
          setSelectedProfileId("");
        }
      }
    }
    loadProfiles();
    return () => {
      active = false;
    };
  }, [lang, token]);

  const handleBook = async (event) => {
    event.preventDefault();
    setBookingStatus({ type: "loading", message: "Creating Cashfree test order" });
    setBooking(null);

    try {
      const data = await apiRequest("/book/seva", {
        method: "POST",
        token,
        lang,
        body: {
          seva_id: Number(sevaId),
          bhakta_profile_id: Number(selectedProfileId),
          seva_date: sevaDate,
        },
      });
      setBooking(data);
      setBookingStatus({ type: "success", message: "Booking created. Complete payment with the sandbox session." });
    } catch (error) {
      setBookingStatus({ type: "error", message: error.message });
    }
  };

  if (status.type === "loading") {
    return (
      <main className={styles.page}>
        <div className={styles.centerState}>
          <Loader2 size={22} aria-hidden="true" />
          <span>{status.message}</span>
        </div>
      </main>
    );
  }

  if (status.type === "error" || !seva) {
    return (
      <main className={styles.page}>
        <div className={styles.centerState}>
          <strong>{status.type === "error" ? "Unable to load seva" : "Seva not found"}</strong>
          <span>{status.type === "error" ? status.message : "The requested seva is not available."}</span>
          <Link to={`/${lang}/seva-booking`} className={styles.backButton}>
            <ArrowLeft size={17} aria-hidden="true" />
            Back to sevas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.sevaShell}>
        <div className={styles.sevaMain}>
          <Link to={`/${lang}/seva-booking`} className={styles.backLink}>
            <ArrowLeft size={17} aria-hidden="true" />
            All sevas
          </Link>

          <div className={styles.mediaPanel}>
            <img src={sevaImageUrl(seva, bgImg)} alt={seva.name} />
          </div>

          <div className={styles.detailsPanel}>
            <span className={styles.eyebrow}>Seva details</span>
            <h1>{seva.name}</h1>
            <div className={styles.heroMeta}>
              <span>
                <IndianRupee size={18} aria-hidden="true" />
                {amount || "Contact for amount"}
              </span>
              <span>
                <ShieldCheck size={18} aria-hidden="true" />
                {isBookable ? "Online booking enabled" : "Assisted booking"}
              </span>
              {!isBookable ? (
                <span>
                  <Phone size={18} aria-hidden="true" />
                  {contactPhone}
                </span>
              ) : null}
            </div>
          <p>{seva.description}</p>
          </div>
        </div>

        <aside className={styles.bookingPanel}>
          <span className={styles.sectionLabel}>{isBookable ? "Book seva" : "Contact booking"}</span>
          <h2>{isBookable ? "Complete your booking" : "Speak with the office"}</h2>

          {isBookable ? (
            <form onSubmit={handleBook} className={styles.bookingForm}>
              <label>
                <span>For</span>
                <select
                  value={profileSelectValue}
                  onChange={(event) => setSelectedProfileId(event.target.value)}
                  required
                  disabled={!isAuthenticated}
                >
                  <option value="">{isAuthenticated ? "Select profile" : "Sign in to load profiles"}</option>
                  {visibleProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name} {profile.is_self ? "(Self)" : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>Date</span>
                <input
                  type="date"
                  min={today}
                  value={sevaDate}
                  onChange={(event) => setSevaDate(event.target.value)}
                  required
                />
              </label>

              <div className={styles.summary}>
                <div>
                  <UserRound size={17} aria-hidden="true" />
                  {visibleProfiles.length || 0} profile options
                </div>
                <div>
                  <CalendarDays size={17} aria-hidden="true" />
                  {sevaDate || "Choose date"}
                </div>
                <div>
                  <CreditCard size={17} aria-hidden="true" />
                  {amount || "Contact for amount"}
                </div>
              </div>

              {bookingStatus.message ? (
                <p className={`${styles.status} ${styles[bookingStatus.type]}`}>
                  {bookingStatus.type === "loading" ? <Loader2 size={16} aria-hidden="true" /> : null}
                  {bookingStatus.message}
                </p>
              ) : null}

              <button type="submit" disabled={!isAuthenticated || bookingStatus.type === "loading"}>
                <CreditCard size={18} aria-hidden="true" />
                <span>{isAuthenticated ? "Create test payment" : "Sign in to book"}</span>
              </button>

              {!isAuthenticated ? (
                <Link to={`/${lang}/login`} className={styles.loginLink}>
                  Login to continue booking
                </Link>
              ) : null}
            </form>
          ) : (
            <div className={styles.contactBox}>
              <p>This seva is handled by the temple office. Call to confirm the date, amount, and availability.</p>
              <a className={styles.contactButton} href={telHref(contactPhone)}>
                <Phone size={18} aria-hidden="true" />
                Contact {contactPhone}
              </a>
            </div>
          )}

          {booking ? (
            <div className={styles.paymentBox}>
              <span>Payment session</span>
              <strong>{booking.payment.payment_session_id}</strong>
              <small>Order {booking.payment.order_id}</small>
            </div>
          ) : null}
        </aside>
      </section>
    </main>
  );
}
