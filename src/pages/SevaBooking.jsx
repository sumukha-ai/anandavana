import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, IndianRupee, Loader2, Phone } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import PageHero from "../components/PageHero/PageHero";
import { normalizeLang } from "../i18n/config";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./SevaBooking.module.css";
import { formatAmount, sevaContactPhone, sevaImageUrl } from "./sevaHelpers";

export default function SevaBooking() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const [sevas, setSevas] = useState([]);
  const [status, setStatus] = useState({ type: "loading", message: "Loading sevas" });

  useEffect(() => {
    let active = true;
    async function loadSevas() {
      setStatus({ type: "loading", message: "Loading sevas" });
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
    loadSevas();
    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <>
      <PageHero title="Seva Offerings" bgImage={bgImg} />
      <div className={styles.container}>
        <section className={styles.catalogShell}>
          <div className={styles.catalogIntro}>
            <span>Temple sevas</span>
            <h2>Choose a seva to view details and book</h2>
            <p>
              Review the seva details, image, amount, and booking availability before
              continuing to the dedicated seva page.
            </p>
          </div>

          {status.message ? (
            <p className={`${styles.status} ${styles[status.type]}`}>
              {status.type === "loading" ? <Loader2 size={16} aria-hidden="true" /> : null}
              {status.message}
            </p>
          ) : null}

          {!status.message && sevas.length === 0 ? (
            <div className={styles.emptyState}>No sevas are available right now.</div>
          ) : null}

          <div className={styles.sevaGrid}>
            {sevas.map((seva) => {
              const amount = formatAmount(seva.amount);
              const isBookable = Boolean(seva.is_bookable);

              return (
                <article key={seva.id} className={styles.sevaCard}>
                  <Link to={`/${lang}/seva/${seva.id}`} className={styles.imageLink} aria-label={`View ${seva.name}`}>
                    <img src={sevaImageUrl(seva, bgImg)} alt={seva.name} />
                  </Link>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTopline}>
                      <span className={isBookable ? styles.bookablePill : styles.contactPill}>
                        {isBookable ? "Book online" : "Contact booking"}
                      </span>
                      <span className={styles.amountPill}>
                        <IndianRupee size={15} aria-hidden="true" />
                        {amount || "Contact"}
                      </span>
                    </div>
                    <h3>{seva.name}</h3>
                    <p>{seva.description}</p>
                    <div className={styles.cardMeta}>
                      <span>
                        <CalendarCheck size={16} aria-hidden="true" />
                        {isBookable ? "Select date on detail page" : "Confirm date by phone"}
                      </span>
                      {!isBookable ? (
                        <span>
                          <Phone size={16} aria-hidden="true" />
                          {sevaContactPhone(seva)}
                        </span>
                      ) : null}
                    </div>
                    <Link to={`/${lang}/seva/${seva.id}`} className={styles.viewButton}>
                      <span>View seva</span>
                      <ArrowRight size={17} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
