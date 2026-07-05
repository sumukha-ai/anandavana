import { Link, useParams } from "react-router-dom";
import { normalizeLang } from "../i18n/config";
import styles from "./RolePages.module.css";

export default function Unauthorized() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);

  return (
    <section className={styles.pageShell}>
      <div className={styles.panel}>
        <span className={styles.kicker}>Access denied</span>
        <h1>You do not have access to this page.</h1>
        <p className={styles.lead}>Your account role is not allowed to open this area.</p>
        <div className={styles.actions}>
          <Link to={`/${lang}/dashboard`} className={styles.actionLink}>Go to dashboard</Link>
        </div>
      </div>
    </section>
  );
}
