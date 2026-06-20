import React, { useState, useEffect } from "react";
import styles from "./Hero.module.css";
import bg1 from "../../../assets/bg1.jpeg";
import bg2 from "../../../assets/bg2.jpg";
import bg3 from "../../../assets/bg1.jpeg";
import guruImg from "../../../assets/guruu.jpg";

const BACKGROUND_IMAGES = [bg1, bg2, bg3];

export default function Hero() {
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
            index === (currentIndex - 1 + BACKGROUND_IMAGES.length) % BACKGROUND_IMAGES.length
          ) {
            stateClass = styles.leavingBg;
          }

          return (
            <div key={index} className={`${styles.bgImageWrapper} ${stateClass}`}>
              <img
                src={img}
                alt={`Agadi Anandavana banner ${index + 1}`}
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
            alt="Guru of Sri Kshetra Anandavana"
            className={styles.guruImage}
          />
        </div>
      </div>

      <div className={styles.contentShell}>
        <div className={styles.textBlock}>
          <h2 className={styles.topLine}>SRI KSHETRA</h2>
          <h1 className={styles.bottomLine}>ANANDAVANA</h1>
        </div>
      </div>
    </section>
  );
}