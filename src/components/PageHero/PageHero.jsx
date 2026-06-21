import React from "react";
import styles from "./PageHero.module.css";

export default function PageHero({ title, bgImage }) {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className={styles.overlay}></div>

      <div className={styles.content}>
        <div className={styles.inner}>
          <span className={styles.kicker}>|| Sri Sheshachala Sadguru Samsthana ||</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </section>
  );
}