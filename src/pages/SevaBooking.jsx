import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CreditCard, IndianRupee, Loader2, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import PageHero from "../components/PageHero/PageHero";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./SevaBooking.module.css";

const FRONT_PAGE_CONTACT_PHONE = "+91 97415 85030";

function sevaContactPhone(seva) {
  return seva?.contact_phone || FRONT_PAGE_CONTACT_PHONE;
}

function telHref(phone) {
  return `tel:${String(phone).replace(/[^\d+]/g, "")}`;
}

export default function SevaBooking() {
  const { token, isAuthenticated } = useAuth();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const [sevas, setSevas] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedSevaId, setSelectedSevaId] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [sevaDate, setSevaDate] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [booking, setBooking] = useState(null);

  const selectedSeva = useMemo(
    () => sevas.find((seva) => String(seva.id) === String(selectedSevaId)),
    [sevas, selectedSevaId]
  );

  useEffect(() => {
    let active = true;
    async function loadSevas() {
      setStatus({ type: "loading", message: "Loading sevas" });
      try {
        const data = await apiRequest("/seva", { lang });
        if (active) {
          setSevas(data.sevas || []);
          setSelectedSevaId(data.sevas?.find((seva) => seva.is_bookable)?.id || data.sevas?.[0]?.id || "");
          setStatus({ type: "idle", message: "" });
        }
      } catch (error) {
        if (active) setStatus({ type: "error", message: error.message });
      }
    }
    loadSevas();
    return () => {
      active = false;
    };
  }, [lang]);

  useEffect(() => {
    if (!token) return;
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
        if (active) setProfiles([]);
      }
    }
    loadProfiles();
    return () => {
      active = false;
    };
  }, [lang, token]);

  const handleBook = async (event) => {
    event.preventDefault();
    setStatus({ type: "loading", message: "Creating Cashfree test order" });
    setBooking(null);

    try {
      const data = await apiRequest("/book/seva", {
        method: "POST",
        token,
        lang,
        body: {
          seva_id: Number(selectedSevaId),
          bhakta_profile_id: Number(selectedProfileId),
          seva_date: sevaDate,
        },
      });
      setBooking(data);
      setStatus({ type: "success", message: "Booking created. Complete payment with the sandbox session." });
    } catch (error) {
      setStatus({ type: "error", message: error.message });
    }
  };

  return (
    <>
      <PageHero title="Online Seva Booking" bgImage={bgImg} />
      <div className={styles.container}>
        <div className={styles.shell}>
          <section className={styles.catalog}>
            <div className={styles.sectionHeader}>
              <span>Enabled sevas</span>
              <h2>Choose a seva</h2>
            </div>

            <div className={styles.sevaGrid}>
              {sevas.map((seva) => {
                const isContactOnly = !seva.is_bookable;
                return (
                  <button
                    key={seva.id}
                    type="button"
                    className={`${styles.sevaCard} ${String(selectedSevaId) === String(seva.id) ? styles.activeCard : ""}`}
                    onClick={() => setSelectedSevaId(seva.id)}
                  >
                    <span className={styles.cardIcon}><IndianRupee size={18} aria-hidden="true" /></span>
                    <strong>{seva.name}</strong>
                    <span>{seva.description}</span>
                    <em>{seva.amount ? `INR ${seva.amount}` : `Contact ${sevaContactPhone(seva)}`}</em>
                    {isContactOnly ? <small className={styles.contactHint}>Contact for booking</small> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className={styles.bookingPanel}>
            <div className={styles.sectionHeader}>
              <span>{selectedSeva?.is_bookable ? "Cashfree sandbox" : "Contact booking"}</span>
              <h2>{selectedSeva?.is_bookable ? "Book seva" : "Contact for booking"}</h2>
            </div>

            <form onSubmit={handleBook} className={styles.bookingForm}>
              <label>
                <span>Selected seva</span>
                <select value={selectedSevaId} onChange={(event) => setSelectedSevaId(event.target.value)} required>
                  <option value="">Select seva</option>
                  {sevas.map((seva) => (
                    <option key={seva.id} value={seva.id}>
                      {seva.name} {seva.amount ? `- INR ${seva.amount}` : "- contact"}
                    </option>
                  ))}
                </select>
              </label>

              {selectedSeva?.is_bookable ? (
                <>
                  <label>
                    <span>For</span>
                    <select value={selectedProfileId} onChange={(event) => setSelectedProfileId(event.target.value)} required disabled={!isAuthenticated}>
                      <option value="">{isAuthenticated ? "Select profile" : "Sign in to load profiles"}</option>
                      {profiles.map((profile) => (
                        <option key={profile.id} value={profile.id}>
                          {profile.name} {profile.is_self ? "(Self)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    <span>Date</span>
                    <input type="date" value={sevaDate} onChange={(event) => setSevaDate(event.target.value)} required />
                  </label>
                </>
              ) : null}

              <div className={styles.summary}>
                <div><Users size={17} aria-hidden="true" /> {profiles.length || 0} profile options</div>
                {selectedSeva?.is_bookable ? (
                  <div><CalendarDays size={17} aria-hidden="true" /> {sevaDate || "Choose date"}</div>
                ) : null}
                <div><CreditCard size={17} aria-hidden="true" /> {selectedSeva?.amount ? `INR ${selectedSeva.amount}` : "Contact for booking"}</div>
                {!selectedSeva?.is_bookable ? <div>{sevaContactPhone(selectedSeva)}</div> : null}
              </div>

              {status.message ? (
                <p className={`${styles.status} ${styles[status.type]}`}>
                  {status.type === "loading" ? <Loader2 size={16} aria-hidden="true" /> : null}
                  {status.message}
                </p>
              ) : null}

              {selectedSeva?.is_bookable ? (
                <button type="submit" disabled={!isAuthenticated || status.type === "loading"}>
                  <CreditCard size={18} aria-hidden="true" />
                  <span>{isAuthenticated ? "Create test payment" : "Sign in to book"}</span>
                </button>
              ) : (
                <a className={styles.contactButton} href={telHref(sevaContactPhone(selectedSeva))}>
                  Contact {sevaContactPhone(selectedSeva)}
                </a>
              )}
            </form>

            {booking ? (
              <div className={styles.paymentBox}>
                <span>Payment session</span>
                <strong>{booking.payment.payment_session_id}</strong>
                <small>Order {booking.payment.order_id}</small>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
