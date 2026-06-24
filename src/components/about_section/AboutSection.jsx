import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./AboutSection.module.css";
import aboutImg from "../../../assets/bg5.JPG";
import AOS from "aos";
import "aos/dist/aos.css";
import { Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";

const EN_CONTENT = {
  kicker: "About Section",
  title: "The spirit of Anandavana",
  subtitle:
    "A holy space where compassion, guidance, peace, and divine nearness are deeply felt.",
  imageAlt: "Anandavana sacred spiritual atmosphere",
  contentLabel: "Divine Abode",
  mainText:
    "Anandavana, the sacred abode of Sri Sheshachala Sadguru, is a unique and holy place. It is known for offering Annadana and spiritual wisdom to all. It is a place where spiritual seekers find guidance and progress, and where thousands of devotees are inspired to move closer to God and Divinity. The Gurus of this land provide comfort and protection to those in distress, helping weak and troubled people become strong and confident. Loved and respected by the public, Anandavana is a place where people burdened by the struggles and sorrows of life find peace, hope, and the comforting guidance of the Sadguru.",
  points: [
    {
      title: "Spiritual Guidance",
      text: "Seekers find direction, progress, and a deeper path toward divine awareness.",
    },
    {
      title: "Annadana & Compassion",
      text: "Service, nourishment, and care are offered with humility and devotion to all.",
    },
    {
      title: "Hope & Protection",
      text: "Those carrying sorrow and struggle find reassurance, strength, and peace in the Sadguru’s presence.",
    },
  ],
};

const KN_CONTENT = {
  kicker: "ಸಂಸ್ಥಾನದ ಬಗ್ಗೆ",
  title: "ಆನಂದವನದ ಆತ್ಮಸ್ಪರ್ಶಿ ಮಹಿಮೆ",
  subtitle:
    "ಕರುಣೆ, ಮಾರ್ಗದರ್ಶನ, ಶಾಂತಿ ಮತ್ತು ದೈವಿಕ ಸಾನ್ನಿಧ್ಯವು ಆಳವಾಗಿ ಅನುಭವವಾಗುವ ಪವಿತ್ರ ತಾಣ.",
  imageAlt: "ಆನಂದವನದ ಪವಿತ್ರ ಆಧ್ಯಾತ್ಮಿಕ ವಾತಾವರಣ",
  contentLabel: "ದಿವ್ಯ ನಿವಾಸ",
  mainText:
    "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುಗಳ ಪವಿತ್ರ ನಿವಾಸವಾದ ಆನಂದವನವು ವಿಶಿಷ್ಟವಾದ ದೈವಿಕ ಕ್ಷೇತ್ರವಾಗಿದೆ. ಇಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಅನ್ನದಾನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನವನ್ನು ದಾನ ಮಾಡಲಾಗುತ್ತದೆ. ಇದು ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧಕರು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಆತ್ಮೋನ್ನತಿಯನ್ನು ಪಡೆಯುವ ಸ್ಥಳವಾಗಿದ್ದು, ಸಾವಿರಾರು ಭಕ್ತರು ದೇವತ್ವದತ್ತ ಮತ್ತು ಪರಮಾತ್ಮನತ್ತ ಇನ್ನಷ್ಟು ಸಮೀಪಗೊಳ್ಳಲು ಪ್ರೇರಣೆಯನ್ನು ಪಡೆಯುವ ಪವಿತ್ರ ನೆಲೆಯಾಗಿದೆ. ಈ ಪವಿತ್ರ ಭೂಮಿಯ ಗುರುಗಳು ಸಂಕಟದಲ್ಲಿರುವವರಿಗೆ ಧೈರ್ಯ, ರಕ್ಷಣೆ ಮತ್ತು ಆಧಾರವನ್ನು ನೀಡುತ್ತಾ, ದುರ್ಬಲರು ಮತ್ತು ದುಃಖಿತರು ಶಕ್ತಿಶಾಲಿಗಳಾಗಲು ಹಾಗೂ ಆತ್ಮವಿಶ್ವಾಸಿಗಳಾಗಲು ಮಾರ್ಗದರ್ಶನ ಮಾಡುತ್ತಾರೆ. ಜನರ ಅಪಾರ ಪ್ರೀತಿ ಮತ್ತು ಗೌರವಕ್ಕೆ ಪಾತ್ರವಾದ ಆನಂದವನವು ಜೀವನದ ಕಷ್ಟಗಳು ಮತ್ತು ದುಃಖಗಳಿಂದ ನಲುಗಿದವರಿಗೆ ಶಾಂತಿ, ಆಶಾಭರವಸೆ ಮತ್ತು ಸದ್ಗುರುವಿನ ಸಾಂತ್ವನಮಯ ಮಾರ್ಗದರ್ಶನವನ್ನು ನೀಡುವ ಪವಿತ್ರ ತಾಣವಾಗಿದೆ.",
  points: [
    {
      title: "ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ",
      text: "ಸಾಧಕರು ದೈವಿಕ ಚೇತನದತ್ತ ಸಾಗಲು ದಿಕ್ಕು, ಬೆಳವಣಿಗೆ ಮತ್ತು ಗಂಭೀರವಾದ ಮಾರ್ಗವನ್ನು ಇಲ್ಲಿ ಕಂಡುಕೊಳ್ಳುತ್ತಾರೆ.",
    },
    {
      title: "ಅನ್ನದಾನ ಮತ್ತು ಕರುಣೆ",
      text: "ಸೇವೆ, ಆಹಾರ ಮತ್ತು ಕಾಳಜಿಯನ್ನು ವಿನಯಭಾವದಿಂದ ಹಾಗೂ ಭಕ್ತಿಯಿಂದ ಎಲ್ಲರಿಗೂ ಅರ್ಪಿಸಲಾಗುತ್ತದೆ.",
    },
    {
      title: "ಆಶೆ ಮತ್ತು ರಕ್ಷಣೆ",
      text: "ದುಃಖ ಮತ್ತು ಹೋರಾಟವನ್ನು ಹೊತ್ತುಕೊಂಡವರು ಸದ್ಗುರುವಿನ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಧೈರ್ಯ, ಶಕ್ತಿ ಮತ್ತು ಶಾಂತಿಯನ್ನು ಪಡೆಯುತ್ತಾರೆ.",
    },
  ],
};

export default function AboutSection() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = language === "kn" ? KN_CONTENT : EN_CONTENT;

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
        <div
          className={styles.sectionHeader}
          data-aos="fade-up"
          lang={language}
        >
          <span className={styles.kicker}>{content.kicker}</span>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </div>

        <div className={styles.splitLayout}>
          <div className={styles.imageColumn} data-aos="fade-right">
            <div className={styles.imageFrame}>
              <img
                src={aboutImg}
                alt={content.imageAlt}
                className={styles.aboutImage}
              />
              <div className={styles.imageOverlay}></div>
            </div>
          </div>

          <div className={styles.contentColumn} data-aos="fade-left">
            <div className={styles.textCard} lang={language}>
              <div className={styles.contentIntro}>
                <span className={styles.contentLabel}>{content.contentLabel}</span>
                <p className={styles.mainText}>{content.mainText}</p>
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
                    <h3 className={styles.pointTitle}>{content.points[0].title}</h3>
                    <p className={styles.pointText}>{content.points[0].text}</p>
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
                    <h3 className={styles.pointTitle}>{content.points[1].title}</h3>
                    <p className={styles.pointText}>{content.points[1].text}</p>
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
                    <h3 className={styles.pointTitle}>{content.points[2].title}</h3>
                    <p className={styles.pointText}>{content.points[2].text}</p>
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