import React from "react";
import styles from "./PageHero.module.css";
import { useI18n } from "../../i18n/useI18n";

export default function PageHero({ title, bgImage }) {
  const { t } = useI18n("pageHero");

  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <span className={styles.kicker}>{t("kicker")}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </section>
  );
}