import { Link, useParams } from "react-router-dom";
import { normalizeLang } from "../i18n/config";
import styles from "./RolePages.module.css";

export default function Unauthorized() {
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);

  return (
    <section className={styles.pageShell}>
      <div className={styles.panel}>
        <h1>You do not have access to this page.</h1>
        <p className={styles.lead}>This area is only for Samsthana staff with the right role. If you think you should have access, please ask the office admin.</p>
        <div className={styles.actions}>
          <Link to={`/${lang}/dashboard`} className={styles.actionLink}>Go to dashboard</Link>
        </div>
      </div>
    </section>
  );
}
