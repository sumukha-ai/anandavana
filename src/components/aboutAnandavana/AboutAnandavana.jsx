import { useParams } from "react-router-dom";
import { Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import styles from "./AboutAnandavana.module.css";

const CONTENT = {
  en: {
    kicker: "About Anandavana",
    title: "The spirit of Anandavana",
    subtitle:
      "A holy space where compassion, guidance, peace, and divine nearness are deeply felt.",
    mainTextParagraphs: [
      {
        text: "Anandavana, the sacred abode of Sri Sheshachala Sadguru, is a unique and holy place. It is known for offering Annadana and spiritual wisdom to all. It is a place where spiritual seekers find guidance and progress, and where thousands of devotees are inspired to move closer to God and Divinity.",
      },
      {
        text: "The Gurus of this land provide comfort and protection to those in distress, helping weak and troubled people become strong and confident.",
      },
    ],
    points: [
      {
        title: "Spiritual Guidance",
        text: "Seekers find direction, progress, and a deeper path toward divine awareness.",
        icon: Sparkles,
      },
      {
        title: "Annadana & Compassion",
        text: "Service, nourishment, and care are offered with humility and devotion to all.",
        icon: HeartHandshake,
      },
      {
        title: "Hope & Protection",
        text: "Those carrying sorrow and struggle find reassurance, strength, and peace in the Sadguru’s presence.",
        icon: ShieldCheck,
      },
    ],
  },
  kn: {
    kicker: "ಆನಂದವನದ ಬಗ್ಗೆ",
    title: "ಆನಂದವನದ ಆತ್ಮಸ್ಪರ್ಶಿ ಮಹಿಮೆ",
    subtitle:
      "ಕರುಣೆ, ಮಾರ್ಗದರ್ಶನ, ಶಾಂತಿ ಮತ್ತು ದೈವಿಕ ಸಾನ್ನಿಧ್ಯವು ಆಳವಾಗಿ ಅನುಭವವಾಗುವ ಪವಿತ್ರ ತಾಣ.",
    mainTextParagraphs: [
      {
        text: "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುಗಳ ಪವಿತ್ರ ನಿವಾಸವಾದ ಆನಂದವನವು ವಿಶಿಷ್ಟವಾದ ದೈವಿಕ ಕ್ಷೇತ್ರವಾಗಿದೆ. ಇಲ್ಲಿ ಎಲ್ಲರಿಗೂ ಅನ್ನದಾನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಜ್ಞಾನವನ್ನು ದಾನ ಮಾಡಲಾಗುತ್ತದೆ. ಇದು ಆಧ್ಯಾತ್ಮಿಕ ಸಾಧಕರು ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಆತ್ಮೋನ್ನತಿಯನ್ನು ಪಡೆಯುವ ಸ್ಥಳವಾಗಿದ್ದು, ಸಾವಿರಾರು ಭಕ್ತರು ದೇವತ್ವದತ್ತ ಇನ್ನಷ್ಟು ಸಮೀಪಗೊಳ್ಳಲು ಪ್ರೇರಣೆಯನ್ನು ಪಡೆಯುವ ಪವಿತ್ರ ನೆಲೆಯಾಗಿದೆ.",
      },
      {
        text: "ಈ ಭೂಮಿಯ ಗುರುಗಳು ಸಂಕಷ್ಟದಲ್ಲಿರುವವರಿಗೆ ಧೈರ್ಯ ಮತ್ತು ರಕ್ಷಣೆಯನ್ನು ನೀಡುತ್ತಾರೆ.",
      },
    ],
    points: [
      {
        title: "ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗದರ್ಶನ",
        text: "ಸಾಧಕರು ದೈವಿಕ ಚೇತನದತ್ತ ಸಾಗಲು ದಿಕ್ಕು, ಬೆಳವಣಿಗೆ ಮತ್ತು ಗಂಭೀರವಾದ ಮಾರ್ಗವನ್ನು ಇಲ್ಲಿ ಕಂಡುಕೊಳ್ಳುತ್ತಾರೆ.",
        icon: Sparkles,
      },
      {
        title: "ಅನ್ನದಾನ ಮತ್ತು ಕರುಣೆ",
        text: "ಸೇವೆ, ಆಹಾರ ಮತ್ತು ಕಾಳಜಿಯನ್ನು ವಿನಯಭಾವದಿಂದ ಹಾಗೂ ಭಕ್ತಿಯಿಂದ ಎಲ್ಲರಿಗೂ ಅರ್ಪಿಸಲಾಗುತ್ತದೆ.",
        icon: HeartHandshake,
      },
      {
        title: "ಆಶೆ ಮತ್ತು ರಕ್ಷಣೆ",
        text: "ದುಃಖ ಮತ್ತು ಹೋರಾಟವನ್ನು ಹೊತ್ತುಕೊಂಡವರು ಸದ್ಗುರುವಿನ ಸಾನ್ನಿಧ್ಯದಲ್ಲಿ ಧೈರ್ಯ, ಶಕ್ತಿ ಮತ್ತು ಶಾಂತಿಯನ್ನು ಪಡೆಯುತ್ತಾರೆ.",
        icon: ShieldCheck,
      },
    ],
  },
};

export default function AboutAnandavana() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = CONTENT[language];

  return (
    <section className={styles.aboutSection} lang={language}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.kicker}>{content.kicker}</span>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </header>

        <div className={styles.bodyWrap}>
          <div className={styles.copyBlock}>
            {content.mainTextParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 ? styles.mainTextWithDropcap : styles.mainTextParagraph}
              >
                {paragraph.text}
              </p>
            ))}
          </div>

          <div className={styles.pointsGrid}>
            {content.points.map((point, index) => {
              const Icon = point.icon;
              return (
                <article className={styles.pointCard} key={index}>
                  <div className={styles.iconWrap}>
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className={styles.pointBody}>
                    <h3 className={styles.pointTitle}>{point.title}</h3>
                    <p className={styles.pointText}>{point.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}