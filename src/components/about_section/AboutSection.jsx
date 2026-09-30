import { useParams } from "react-router-dom";
import styles from "./AboutSection.module.css";
import aboutImg from "../../../assets/lineage/kshetra.webp";
import { AnnadanaIcon, ArchFrame, ChatraIcon, DeepaIcon, LotusRule } from "../ornaments/Ornaments";

const POINT_ICONS = [DeepaIcon, AnnadanaIcon, ChatraIcon];

const EN_CONTENT = {
  title: "The spirit of Anandavana",
  subtitle:
    "A holy space where compassion, guidance, peace, and divine nearness are deeply felt.",
  imageAlt: "Anandavana sacred spiritual atmosphere",
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
  title: "ಆನಂದವನದ ಆತ್ಮಸ್ಪರ್ಶಿ ಮಹಿಮೆ",
  subtitle:
    "ಕರುಣೆ, ಮಾರ್ಗದರ್ಶನ, ಶಾಂತಿ ಮತ್ತು ದೈವಿಕ ಸಾನ್ನಿಧ್ಯವು ಆಳವಾಗಿ ಅನುಭವವಾಗುವ ಪವಿತ್ರ ತಾಣ.",
  imageAlt: "ಆನಂದವನದ ಪವಿತ್ರ ಆಧ್ಯಾತ್ಮಿಕ ವಾತಾವರಣ",
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

  return (
    <section className={styles.aboutSection} aria-labelledby="about-title">
      <div className={styles.container}>
        <div className={styles.split}>
          <ArchFrame src={aboutImg} alt={content.imageAlt} className={styles.arch} position="center 30%" />

          <div className={styles.textColumn} lang={language}>
            <h2 id="about-title" className={styles.title}>{content.title}</h2>
            <p className={styles.subtitle}>{content.subtitle}</p>
            <LotusRule align="start" className={styles.rule} />
            <p className={styles.mainText}>{content.mainText}</p>
          </div>
        </div>

        <ul className={styles.offerings} lang={language}>
          {content.points.map((point, index) => {
            const Icon = POINT_ICONS[index];
            return (
              <li key={point.title} className={styles.offering}>
                <Icon size={30} strokeWidth={1.3} className={styles.offeringIcon} />
                <h3 className={styles.offeringTitle}>{point.title}</h3>
                <p className={styles.offeringText}>{point.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
