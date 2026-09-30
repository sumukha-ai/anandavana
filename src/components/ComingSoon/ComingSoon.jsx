import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import styles from "./ComingSoon.module.css";
import { useI18n } from "../../i18n/useI18n";
import { DeepaIcon, LotusRule } from "../ornaments/Ornaments";

export default function ComingSoon({ title, body }) {
  const { t, lang } = useI18n("pages");

  return (
    <section className={styles.notice} lang={lang}>
      <DeepaIcon size={30} strokeWidth={1.3} className={styles.deepa} />
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <LotusRule className={styles.rule} />
      <div className={styles.actions}>
        <a href="tel:+919741585030" className={styles.secondary}>
          <Phone size={17} aria-hidden="true" />
          <span>{t("callOffice")}</span>
        </a>
        <Link to={`/${lang}/seva-booking`} className={styles.primary}>
          <span>{t("bookSeva")}</span>
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
