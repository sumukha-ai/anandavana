import styles from "./PageHero.module.css";
import { useI18n } from "../../i18n/useI18n";
import { LotusRule, Toran } from "../ornaments/Ornaments";

export default function PageHero({ title, bgImage }) {
  const { lang } = useI18n();

  return (
    <>
      <section
        className={styles.hero}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className={styles.overlay}></div>

        <div className={styles.content}>
          <div className={styles.inner} lang={lang}>
            <LotusRule tone="gold" className={styles.rule} />
            <h1 className={styles.title}>{title}</h1>
          </div>
        </div>
      </section>
      {/* The hero's lower edge is the lintel; the toran hangs from it into the page */}
      <Toran tone="antique" className={styles.toran} />
    </>
  );
}
