import React from "react";
import styles from "./AboutSection.module.css";
import aboutImg from "../../../assets/bg2.jpg";

export default function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.pattern}></div>

      <div className={styles.container}>
        <div className={styles.headerBlock}>
          <span className={styles.kicker}>About Agadi</span>
          <h2 className={styles.title}>
            A radiant spiritual space rooted in devotion, silence, and grace.
          </h2>
          <p className={styles.lead}>
            Sri Kshetra Agadi Anandavana is a sacred spiritual destination that
            carries the warmth of devotion and the stillness of inner prayer. It
            is a place where tradition is felt gently, where the atmosphere itself
            invites reverence, and where every visitor is received by a sense of
            calm sacred presence.
          </p>
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.leftPanel}>
            <div className={styles.imageFrame}>
              <img
                src={aboutImg}
                alt="Agadi Anandavana spiritual atmosphere"
                className={styles.aboutImage}
              />
            </div>

            <div className={styles.highlightCard}>
              <span className={styles.highlightLabel}>Sacred Essence</span>
              <p className={styles.highlightText}>
                A place where devotional feeling, peaceful surroundings, and
                spiritual stillness come together in harmony.
              </p>
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.storyCard}>
              <span className={styles.cardIndex}>01</span>
              <h3 className={styles.cardTitle}>A Space of Inner Quiet</h3>
              <p className={styles.cardText}>
                Agadi Anandavana offers more than physical beauty — it offers an
                atmosphere of stillness. The experience of the place is gentle,
                reflective, and inward, allowing the mind to slow down and the
                heart to feel anchored.
              </p>
            </div>

            <div className={styles.storyCard}>
              <span className={styles.cardIndex}>02</span>
              <h3 className={styles.cardTitle}>Rooted in Devotion</h3>
              <p className={styles.cardText}>
                Every sacred space carries its own spiritual vibration, and here
                that feeling is expressed through reverence, prayer, tradition,
                and simplicity. The environment naturally invites humility and
                devotion without excess.
              </p>
            </div>

            <div className={styles.storyCard}>
              <span className={styles.cardIndex}>03</span>
              <h3 className={styles.cardTitle}>A Place to Feel, Not Rush</h3>
              <p className={styles.cardText}>
                Anandavana is best experienced with presence. It is a place to
                pause, absorb, and quietly connect — where spiritual depth is not
                announced loudly, but revealed through atmosphere and feeling.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.quoteStrip}>
          <p className={styles.quote}>
            “In Agadi Anandavana, devotion is not only practiced — it is quietly
            present in the very air.”
          </p>
        </div>
      </div>
    </section>
  );
}