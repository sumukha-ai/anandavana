import { useEffect, useState } from "react";
import { ArrowRight, Loader2, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";
import PageHero from "../components/PageHero/PageHero";
import { useI18n } from "../i18n/useI18n";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./SevaBooking.module.css";
import { sevaImageUrl } from "./sevaHelpers";

export default function SevaBooking() {
  const { t, lang } = useI18n("seva");
  const { t: tPages } = useI18n("pages");
  const [sevas, setSevas] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadSevas() {
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
    loadSevas();
    return () => {
      active = false;
    };
  }, [lang, attempt]);

  return (
    <>
      <PageHero title={tPages("sevaTitle")} bgImage={bgImg} />
      <div className={styles.container}>
        <section className={styles.catalogShell}>
          <div className={styles.catalogIntro} lang={lang}>
            <h2>{t("heading")}</h2>
            <p>{t("intro")}</p>
          </div>

          <div aria-live="polite" lang={lang}>
            {status === "loading" ? (
              <p className={`${styles.status} ${styles.loading}`}>
                <Loader2 size={16} aria-hidden="true" className={styles.spin} />
                {t("loading")}
              </p>
            ) : null}

            {status === "error" ? (
              <div className={`${styles.status} ${styles.error}`} role="alert">
                <p>{t("loadError")}</p>
                <button type="button" className={styles.retryButton} onClick={() => setAttempt((n) => n + 1)}>
                  <RotateCcw size={16} aria-hidden="true" />
                  {t("retry")}
                </button>
              </div>
            ) : null}

            {status === "idle" && sevas.length === 0 ? (
              <div className={styles.emptyState}>{t("empty")}</div>
            ) : null}
          </div>

          <div className={styles.sevaGrid}>
            {sevas.map((seva) => {
              return (
                <article key={seva.id} className={styles.sevaCard}>
                  <Link to={`/${lang}/seva/${seva.id}`} className={styles.imageLink} aria-label={`${t("viewSeva")}: ${seva.name}`}>
                    <img src={sevaImageUrl(seva, bgImg)} alt={seva.name} />
                  </Link>
                  <div className={styles.cardBody}>
                    {/* <div className={styles.cardTopline}>
                      <span className={isBookable ? styles.bookablePill : styles.contactPill}>
                        {isBookable ? "Book online" : "Contact booking"}
                      </span>
                      <span className={styles.amountPill}>
                        <IndianRupee size={15} aria-hidden="true" />
                        {amount || "Contact"}
                      </span>
                    </div> */}
                    <h3>{seva.name}</h3>
                    <p>{seva.description}</p>
                    {/* <div className={styles.cardMeta}>
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
                    </div> */}
                    <Link to={`/${lang}/seva/${seva.id}`} className={styles.viewButton}>
                      <span>{t("viewSeva")}</span>
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
