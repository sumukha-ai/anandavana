import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Hero.module.css";
import bg1 from "../../../assets/anandavana_full_view.jpg.jpeg";
import bg2 from "../../../assets/bg4.JPG";
import bg3 from "../../../assets/bg3.JPG";
import guruImg from "../../../assets/sheshachalaru_lingu.jpg.jpeg";

const BACKGROUND_IMAGES = [bg1, bg2, bg3];

const HERO_TEXT = {
  en: {
    topLine: "SRI KSHETRA",
    bottomLine: "ANANDAVANA",
    guruAlt: "Guru of Sri Kshetra Anandavana",
    bannerAlt: "Agadi Anandavana banner",
  },
  kn: {
    topLine: "ಶ್ರೀ ಕ್ಷೇತ್ರ",
    bottomLine: "ಆನಂದವನ",
    guruAlt: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಆನಂದವನದ ಗುರು",
    bannerAlt: "ಅಗಡಿ ಆನಂದವನದ ಬ್ಯಾನರ್",
  },
};

export default function Hero() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = HERO_TEXT[language];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.heroSection}>
      <div className={styles.bgContainer}>
        {BACKGROUND_IMAGES.map((img, index) => {
          let stateClass = styles.inactiveBg;

          if (index === currentIndex) {
            stateClass = styles.activeBg;
          } else if (
            index ===
            (currentIndex - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length
          ) {
            stateClass = styles.leavingBg;
          }

          return (
            <div key={index} className={`${styles.bgImageWrapper} ${stateClass}`}>
              <img
                src={img}
                alt={`${content.bannerAlt} ${index + 1}`}
                className={styles.bgImage}
              />
            </div>
          );
        })}
      </div>

      <div className={styles.overlay}></div>
      <div className={styles.texture}></div>

      <div className={styles.guruBadge}>
        <div className={styles.guruCircle}>
          <img
            src={guruImg}
            alt={content.guruAlt}
            className={styles.guruImage}
          />
        </div>
      </div>

      <div className={styles.contentShell}>
        <div className={styles.textBlock} lang={language}>
          <h2 className={styles.topLine}>{content.topLine}</h2>
          <h1 className={styles.bottomLine}>{content.bottomLine}</h1>
        </div>
      </div>
    </section>
  );
}