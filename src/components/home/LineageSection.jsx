import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import styles from "./LineageSection.module.css";
import { ArchFrame, LotusMark, LotusRule, Toran } from "../ornaments/Ornaments";
import { useI18n } from "../../i18n/useI18n";
import sheshachalaImg from "../../../assets/lineage/sheshachala.webp";
import narayanaImg from "../../../assets/lineage/narayana.webp";
import shankaraImg from "../../../assets/lineage/shankara.webp";
import lingoImg from "../../../assets/lineage/lingo.webp";

// Names, roles and lines are taken from the Guru Parampare page
const CONTENT = {
  en: {
    title: "The lineage of guiding light",
    intro:
      "The Guru Parampare reflects a living stream of wisdom, devotion, and grace carried across generations.",
    founder: {
      role: "Founding Sadguru",
      name: "Shri Sheshachala Sadguru",
      years: "1848–1918",
      text: "Born in Agadi in 1848, he established Anandavana in 1904 as a peaceful centre for prayer, Vedic study, japa and discipleship.",
      quote: "Truth, devotion, and detachment lead the seeker home.",
    },
    pathsTitle: "Jnana, Karma, Bhakti",
    disciples: [
      { name: "Narayana Bhagawan", role: "Symbol of Wisdom (Jnana)", image: narayanaImg },
      { name: "Shankara Bhagawan", role: "Symbol of Selfless Action (Karma)", image: shankaraImg },
      { name: "Lingo Bhagawan", role: "Symbol of Devotion (Bhakti)", image: lingoImg },
    ],
    readMore: "Read the Guru Parampare",
  },
  kn: {
    title: "ಮಾರ್ಗದರ್ಶಕ ಬೆಳಕಿನ ಪರಂಪರೆ",
    intro:
      "ಗುರು ಪರಂಪರೆ ಅನೇಕ ತಲೆಮಾರುಗಳ ಮೂಲಕ ಹರಿದು ಬಂದ ಜ್ಞಾನ, ಭಕ್ತಿ ಮತ್ತು ಕೃಪೆಯ ಜೀವಂತ ಧಾರೆಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ.",
    founder: {
      role: "ಸ್ಥಾಪಕ ಸದ್ಗುರು",
      name: "ಶ್ರೀ ಶೇಷಾಚಲ ಸ್ವಾಮಿ",
      years: "1848–1918",
      text: "1848ರಲ್ಲಿ ಅಗಡಿಯಲ್ಲಿ ಜನಿಸಿದ ಅವರು 1904ರಲ್ಲಿ ಆನಂದವನವನ್ನು ಸ್ಥಾಪಿಸಿ ಪ್ರಾರ್ಥನೆ, ವೇದಪಾಠ, ಜಪ ಮತ್ತು ಶಿಷ್ಯಸಮೂಹದ ಪವಿತ್ರ ಕೇಂದ್ರವನ್ನಾಗಿ ರೂಪಿಸಿದರು.",
      quote: "ಸತ್ಯ, ಭಕ್ತಿ ಮತ್ತು ವೈರಾಗ್ಯವೇ ಸಾಧಕನ ಗಮ್ಯಸ್ಥಾನ.",
    },
    pathsTitle: "ಜ್ಞಾನ, ಕರ್ಮ, ಭಕ್ತಿ",
    disciples: [
      { name: "ನಾರಾಯಣ ಭಗವಾನರು", role: "ಜ್ಞಾನದ ಪ್ರತೀಕ", image: narayanaImg },
      { name: "ಶ್ರೀ ಶಂಕರ ಭಗವಾನರು", role: "ಕರ್ಮದ ಪ್ರತೀಕ", image: shankaraImg },
      { name: "ಶ್ರೀ ಲಿಂಗೋ ಭಗವಾನರು", role: "ಭಕ್ತಿಯ ಪ್ರತೀಕ", image: lingoImg },
    ],
    readMore: "ಗುರು ಪರಂಪರೆಯನ್ನು ಓದಿ",
  },
};

export default function LineageSection() {
  const { lang, t } = useI18n("navbar");
  const content = CONTENT[lang] || CONTENT.en;
  const { founder } = content;

  return (
    <section className={styles.lineage} aria-labelledby="lineage-title" lang={lang}>
      <Toran tone="gold" className={styles.toran} />

      <div className={styles.container}>
        <header className={styles.header}>
          <LotusRule tone="gold" />
          <h2 id="lineage-title" className={styles.title}>{content.title}</h2>
          <p className={styles.intro}>{content.intro}</p>
        </header>

        <article className={styles.founder}>
          <ArchFrame
            src={sheshachalaImg}
            alt={`${founder.name} (${founder.years})`}
            className={styles.founderArch}
            position="center 8%"
          />
          <div className={styles.founderText}>
            <h3 className={styles.founderName}>{founder.name}</h3>
            <p className={styles.founderRole}>
              {founder.role}
              <span className={styles.founderYears}>{founder.years}</span>
            </p>
            <p className={styles.founderBody}>{founder.text}</p>
            <blockquote className={styles.quote}>
              <LotusMark className={styles.quoteMark} width={36} />
              <p>{founder.quote}</p>
            </blockquote>
          </div>
        </article>

        <div className={styles.paths}>
          <h3 className={styles.pathsTitle}>{content.pathsTitle}</h3>
          <ul className={styles.disciples}>
            {content.disciples.map((disciple) => (
              <li key={disciple.name} className={styles.disciple}>
                <ArchFrame src={disciple.image} alt={disciple.name} className={styles.discipleArch} position="center 12%" />
                <p className={styles.discipleName}>{disciple.name}</p>
                <p className={styles.discipleRole}>{disciple.role}</p>
              </li>
            ))}
          </ul>
        </div>

        <nav className={styles.links} aria-label={t("guruParampare")}>
          <Link to={`/${lang}/guru-parampare`} className={styles.primaryLink}>
            <span>{content.readMore}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to={`/${lang}/sadguru-vamsha-vruksha`} className={styles.textLink}>
            {t("sadguruVamshaVruksha")}
          </Link>
        </nav>
      </div>
    </section>
  );
}
