import React, { useEffect } from "react";
import styles from "./AboutSection.module.css";
import aboutImg from "../../../assets/bg5.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import { Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  useEffect(() => {
    AOS.init({
      duration: 950,
      once: true,
      offset: 90,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <section className={styles.aboutSection}>
      <div className={styles.bgGlow}></div>
      <div className={styles.pattern}></div>

      <div className={styles.container}>
        <div className={styles.sectionHeader} data-aos="fade-up">
          <span className={styles.kicker}>About Section</span>
          <h2 className={styles.title}>The spirit of Anandavana</h2>
          <p className={styles.subtitle}>
            A holy space where compassion, guidance, peace, and divine nearness
            are deeply felt.
          </p>
        </div>

        <div className={styles.splitLayout}>
          <div className={styles.imageColumn} data-aos="fade-right">
            <div className={styles.imageFrame}>
              <img
                src={aboutImg}
                alt="Anandavana sacred spiritual atmosphere"
                className={styles.aboutImage}
              />
              <div className={styles.imageOverlay}></div>

              {/* <div className={styles.imageBadge}>
                <span className={styles.badgeDot}></span>
                Sacred Presence
              </div> */}
            </div>
          </div>

          <div className={styles.contentColumn} data-aos="fade-left">
            <div className={styles.textCard}>
              <div className={styles.contentIntro}>
                <span className={styles.contentLabel}>Divine Abode</span>
                <p className={styles.mainText}>
                  Anandavana, the sacred abode of Sri Sheshachala Sadguru, is a
                  unique and holy place. It is known for offering Annadana and
                  spiritual wisdom to all. It is a place where spiritual seekers
                  find guidance and progress, and where thousands of devotees are
                  inspired to move closer to God and Divinity. The Gurus of this
                  land provide comfort and protection to those in distress,
                  helping weak and troubled people become strong and confident.
                  Loved and respected by the public, Anandavana is a place where
                  people burdened by the struggles and sorrows of life find peace,
                  hope, and the comforting guidance of the Sadguru.
                </p>
              </div>

              <div className={styles.pointsGrid}>
                <div
                  className={styles.pointCard}
                  data-aos="fade-up"
                  data-aos-delay="80"
                >
                  <div className={styles.iconWrap}>
                    <Sparkles size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={styles.pointTitle}>Spiritual Guidance</h3>
                    <p className={styles.pointText}>
                      Seekers find direction, progress, and a deeper path toward
                      divine awareness.
                    </p>
                  </div>
                </div>

                <div
                  className={styles.pointCard}
                  data-aos="fade-up"
                  data-aos-delay="160"
                >
                  <div className={styles.iconWrap}>
                    <HeartHandshake size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={styles.pointTitle}>Annadana & Compassion</h3>
                    <p className={styles.pointText}>
                      Service, nourishment, and care are offered with humility and
                      devotion to all.
                    </p>
                  </div>
                </div>

                <div
                  className={styles.pointCard}
                  data-aos="fade-up"
                  data-aos-delay="240"
                >
                  <div className={styles.iconWrap}>
                    <ShieldCheck size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className={styles.pointTitle}>Hope & Protection</h3>
                    <p className={styles.pointText}>
                      Those carrying sorrow and struggle find reassurance,
                      strength, and peace in the Sadguru’s presence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}