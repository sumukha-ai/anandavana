import logoImg from "../../../assets/logo.png";
import kshetraPortrait from "../../../assets/auth/kshetra-portrait.webp";
import kshetraBand from "../../../assets/auth/kshetra-band.webp";
import { useI18n } from "../../i18n/useI18n";
import styles from "./Auth.module.css";

// Shared frame for sign-in and registration: the kshetra on one side, the form on the other
export default function AuthShell({ title, lead, notice, wide = false, children }) {
  const { t, lang } = useI18n("auth");

  return (
    <section className={styles.page} lang={lang}>
      <div className={`${styles.frame} ${wide ? styles.frameWide : ""}`}>
        <aside className={styles.visual}>
          <picture>
            <source media="(max-width: 959px)" srcSet={kshetraBand} />
            <img className={styles.visualImg} src={kshetraPortrait} alt="" width="920" height="1150" decoding="async" fetchPriority="high" />
          </picture>
          <div className={styles.visualScrim} aria-hidden="true" />
          <div className={styles.visualCopy}>
            <span className={styles.seal}>
              <img src={logoImg} alt="" width="44" height="44" />
            </span>
            <p className={styles.kshetra} lang="kn">{t("kshetra")}</p>
            <p className={styles.samsthana}>{t("samsthana")}</p>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.panelLine}>{t("panelLine")}</p>
          </div>
        </aside>

        <div className={styles.formSide}>
          <div className={styles.formInner}>
            {notice}
            <header className={styles.heading}>
              <h1>{title}</h1>
              {lead ? <p>{lead}</p> : null}
            </header>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
