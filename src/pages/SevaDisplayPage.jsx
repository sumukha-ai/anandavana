import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Loader2,
  Phone,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/useI18n";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./SevaDisplayPage.module.css";
import { formatAmount, formatSevaDate, sevaContactPhone, sevaImageUrl, telHref } from "./sevaHelpers";

export default function SevaDisplayPage() {
  const { token, isAuthenticated } = useAuth();
  const { sevaId } = useParams();
  const { t, lang } = useI18n("sevaDetail");
  const [attempt, setAttempt] = useState(0);
  const [sevas, setSevas] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [sevaDate, setSevaDate] = useState("");
  const [status, setStatus] = useState("loading");
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
  const selectedProfile = visibleProfiles.find((profile) => String(profile.id) === String(selectedProfileId));

  useEffect(() => {
    let active = true;
    async function loadSeva() {
      setStatus("loading");
      try {
        const data = await apiRequest("/seva", { lang });
        if (active) {
          setSevas(data.sevas || []);
          setStatus("idle");
        }
      } catch {
        if (active) setStatus("error");
      }
    }
    loadSeva();
    return () => {
      active = false;
    };
  }, [lang, attempt]);

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
    setBookingStatus({ type: "loading", message: t("submitting") });
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
      setBookingStatus({ type: "idle", message: "" });
    } catch {
      setBookingStatus({ type: "error", message: t("bookError") });
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.page} lang={lang}>
        <div className={styles.centerState} role="status">
          <Loader2 size={22} aria-hidden="true" className={styles.spin} />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (status === "error" || !seva) {
    const isError = status === "error";
    return (
      <div className={styles.page} lang={lang}>
        <div className={styles.centerState} role={isError ? "alert" : undefined}>
          <strong>{isError ? t("loadErrorTitle") : t("notFoundTitle")}</strong>
          <span>{isError ? t("loadErrorBody") : t("notFoundBody")}</span>
          <div className={styles.centerActions}>
            {isError ? (
              <button type="button" className={styles.backButton} onClick={() => setAttempt((n) => n + 1)}>
                <RotateCcw size={17} aria-hidden="true" />
                {t("retry")}
              </button>
            ) : null}
            <Link to={`/${lang}/seva-booking`} className={styles.backButton}>
              <ArrowLeft size={17} aria-hidden="true" />
              {t("backToSevas")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page} lang={lang}>
      <section className={styles.sevaShell}>
        <div className={styles.sevaMain}>
          <Link to={`/${lang}/seva-booking`} className={styles.backLink}>
            <ArrowLeft size={17} aria-hidden="true" />
            {t("allSevas")}
          </Link>

          <div className={styles.mediaPanel}>
            <img src={sevaImageUrl(seva, bgImg)} alt={seva.name} />
          </div>

          <div className={styles.detailsPanel}>
            <h1>{seva.name}</h1>
            <p>{seva.description}</p>
          </div>
        </div>

        <aside className={styles.bookingPanel}>
          <h2>{isBookable ? t("bookTitle") : t("contactTitle")}</h2>

          {isBookable ? (
            <form onSubmit={handleBook} className={styles.bookingForm}>
              <label>
                <span>{t("forLabel")}</span>
                <select
                  value={profileSelectValue}
                  onChange={(event) => setSelectedProfileId(event.target.value)}
                  required
                  disabled={!isAuthenticated}
                >
                  <option value="">{isAuthenticated ? t("selectProfile") : t("signInForProfiles")}</option>
                  {visibleProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.is_self ? `${profile.name} (${t("self")})` : profile.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>{t("dateLabel")}</span>
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
                  {selectedProfile?.name || t("selectProfile")}
                </div>
                <div>
                  <CalendarDays size={17} aria-hidden="true" />
                  {sevaDate ? formatSevaDate(sevaDate, lang) : t("chooseDate")}
                </div>
                <div>
                  <CreditCard size={17} aria-hidden="true" />
                  {amount || t("amountOnRequest")}
                </div>
              </div>

              {bookingStatus.message ? (
                <p
                  className={`${styles.status} ${styles[bookingStatus.type]}`}
                  role={bookingStatus.type === "error" ? "alert" : "status"}
                >
                  {bookingStatus.type === "loading" ? (
                    <Loader2 size={16} aria-hidden="true" className={styles.spin} />
                  ) : null}
                  {bookingStatus.message}
                </p>
              ) : null}

              {isAuthenticated ? (
                <button type="submit" disabled={bookingStatus.type === "loading"}>
                  <CreditCard size={18} aria-hidden="true" />
                  <span>{t("submit")}</span>
                </button>
              ) : (
                <Link to={`/${lang}/login`} className={styles.signInButton}>
                  {t("signInPrompt")}
                </Link>
              )}
            </form>
          ) : (
            <div className={styles.contactBox}>
              <p>{t("contactBody")}</p>
              <a className={styles.contactButton} href={telHref(contactPhone)}>
                <Phone size={18} aria-hidden="true" />
                {t("call")} {contactPhone}
              </a>
            </div>
          )}

          {booking ? (
            <div className={styles.paymentBox} role="status">
              <CheckCircle2 size={22} aria-hidden="true" />
              <strong>{t("bookedTitle")}</strong>
              {booking.payment?.order_id ? (
                <small>
                  {t("bookingReference")}: <span className={styles.reference}>{booking.payment.order_id}</span>
                </small>
              ) : null}
              <p>{t("testModeNote")}</p>
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
