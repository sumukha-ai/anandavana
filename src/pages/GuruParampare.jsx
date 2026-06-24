import React from "react";
import { useParams } from "react-router-dom";
import PageHero from "../components/PageHero/PageHero";
import bgImg from "../../assets/pancyatana.jpg.jpeg";
import styles from "./GuruParampare.module.css";

import guru1 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru2 from "../../assets/narayana_bhagawan.jpeg";
import guru3 from "../../assets/Shankara_bhagavanaru.jpg.jpeg";
import guru4 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru5 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru6 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru7 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru8 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru9 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru10 from "../../assets/sheshachalaru_lingu.jpg.jpeg";

const EN_PAGE_CONTENT = {
  heroTitle: "Guru Parampare",
  kicker: "Sacred Lineage",
  pageTitle: "The lineage of guiding light",
  pageIntro:
    "The Guru Parampare reflects a living stream of wisdom, devotion, and grace carried across generations. Each revered guru has strengthened the spiritual path and inspired seekers through divine presence, compassion, and inner guidance.",
};

const KN_PAGE_CONTENT = {
  heroTitle: "ಗುರು ಪರಂಪರೆ",
  kicker: "ಪವಿತ್ರ ಪರಂಪರೆ",
  pageTitle: "ಮಾರ್ಗದರ್ಶಕ ಬೆಳಕಿನ ಪರಂಪರೆ",
  pageIntro:
    "ಗುರು ಪರಂಪರೆ ಅನೇಕ ತಲೆಮಾರುಗಳ ಮೂಲಕ ಹರಿದು ಬಂದ ಜ್ಞಾನ, ಭಕ್ತಿ ಮತ್ತು ಕೃಪೆಯ ಜೀವಂತ ಧಾರೆಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ. ಪ್ರತಿಯೊಬ್ಬ ಪೂಜ್ಯ ಗುರುವೂ ಆಧ್ಯಾತ್ಮಿಕ ಮಾರ್ಗವನ್ನು ಬಲಪಡಿಸಿ, ದೈವಿಕ ಸಾನ್ನಿಧ್ಯ, ಕರುಣೆ ಮತ್ತು ಆಂತರಿಕ ಮಾರ್ಗದರ್ಶನದ ಮೂಲಕ ಸಾಧಕರಿಗೆ ಪ್ರೇರಣೆಯಾಗಿದ್ದಾರೆ.",
};

const EN_GURUS = [
  {
    id: "01",
    name: "Shri Sheshachala Sadguru (1848–1918)",
    role: "Founding Sadguru",
    image: guru1,
    description:
      "Revered as a sadguru and spiritual luminary, Shri Sheshachala Sadguru was born in 1848 in Agadi near Haveri and is remembered for his deep devotion, austere life, and spiritual leadership. He traveled widely across South India, practiced meditation and bhiksha, and established Anandavana in 1904 as a peaceful center for prayer, Vedic study, japa, and discipleship. He guided seekers with truth, devotion, and detachment until his mahasamadhi in 1918.",
    quote: "Truth, devotion, and detachment lead the seeker home.",
  },
  {
    id: "02",
    name: "Narayana Bhagawan (1856–1928)",
    role: "Symbol of Wisdom and Knowledge (Jnana)",
    image: guru2,
    description:
      "Narayana Bhagavan was born in Agadi village in Haveri Taluk and belonged to the Nagara family and Kaushika Gotra. He worked as a teacher but later left his job to dedicate his life to the worship, bhajans, and spiritual teachings of the Sadguru. Because of his deep devotion, he became one of the Sadguru’s most beloved disciples. He played a major role in introducing the Sadguru and his message to a wider audience. Through his sincere service, he earned the Guru’s special grace. After the Sadguru’s passing, Narayana Bhagavan took responsibility for Anandavana and led it with great care, dedication, and efficiency.",
    quote: "",
  },
  {
    id: "03",
    name: "Shakara Bhagawan",
    role: "Symbol of Selfless Action (Karma)",
    image: guru3,
    description:
      "Sri Shankara Bhagavan was from the Sankannavar family of Haveri and worked as a teacher. Guided by his family deity, he accepted Sri Sheshachala Sadguru as his spiritual teacher. He served the Guru with great devotion, humility, and dedication. He encouraged disciples to be disciplined, punctual, and respectful. He was also known for caring for guests and helping those in need. Later in life, he chose the path of renunciation and became a monk. He founded a Matha (spiritual center) at Tippapura near Hadagali, where he continued his spiritual work and service.",
    quote: "",
  },
  {
    id: "04",
    name: "Lingo Bhagawan",
    role: "Symbol of Devotion (Bhakti)",
    image: guru4,
    description:
      "Sri Lingo Bhagavan was born in Agadi and came from a traditional Vedic family. After completing his education, he worked as a headmaster. During a pilgrimage, he had a powerful spiritual experience at Nanjangud, where he felt the presence of the Sadguru in the Shiva Linga. Deeply moved by this experience, he resigned from his government job and dedicated his entire life to serving the Guru. He was known for his sincere devotion and selfless service. The Sadguru especially appreciated the way he narrated stories from the Puranas. He also had a sweet and pleasant voice that made his spiritual discourses and devotional singing enjoyable to listen to.",
    quote: "",
  },
  {
    id: "05",
    name: "Sri Guru Name Five (1900 - 2000)",
    role: "Spiritual Reformer",
    image: guru5,
    description:
      "A saintly presence who guided people toward spiritual steadiness, ethical living, and reverence for the Sadguru tradition.",
    quote: "Faith grows where ego becomes quiet.",
  },
  {
    id: "06",
    name: "Sri Guru Name Six (1900 - 2000)",
    role: "Path of Compassion",
    image: guru6,
    description:
      "He brought solace to the distressed and reminded devotees that divine love is expressed through care and service.",
    quote: "Compassion is worship in action.",
  },
  {
    id: "07",
    name: "Sri Guru Name Seven (1900 - 2000)",
    role: "Voice of Inner Peace",
    image: guru7,
    description:
      "His life reflected inward stillness, wisdom, and the power of spiritual discipline in transforming ordinary lives.",
    quote: "Peace is the first blessing of wisdom.",
  },
  {
    id: "08",
    name: "Sri Guru Name Eight (1900 - 2000)",
    role: "Guide of Seekers",
    image: guru8,
    description:
      "Through guidance and grace, he helped seekers move from confusion toward clarity, devotion, and strength.",
    quote: "Guidance is grace made visible.",
  },
  {
    id: "09",
    name: "Sri Guru Name Nine (1900 - 2000)",
    role: "Living Tradition",
    image: guru9,
    description:
      "He nurtured the lineage with humility and ensured that the sacred teachings remained alive in the hearts of devotees.",
    quote: "Tradition lives through lived truth.",
  },
  {
    id: "10",
    name: "Sri Sheshachala Sadguru (1900 - 2000)",
    role: "Sacred Presence of Anandavana",
    image: guru10,
    description:
      "A deeply revered spiritual presence whose grace, wisdom, and compassionate guidance continue to inspire devotees toward divine nearness.",
    quote: "In the Sadguru, many hearts find home.",
  },
];

const KN_GURUS = [
  {
    id: "01",
    name: "ಶ್ರೀ ಶೇಷಾಚಲ ಸ್ವಾಮಿ (1848–1918)",
    role: "ಸ್ಥಾಪಕ ಸದ್ಗುರು",
    image: guru1,
    description:
      "ಶ್ರೀ ಶೇಷಾಚಲ ಸ್ವಾಮಿಗಳು ಸದ್ಗುರು ಹಾಗೂ ಆಧ್ಯಾತ್ಮಿಕ ಪ್ರಕಾಶಸ್ವರೂಪರೆಂದು ಪೂಜಿಸಲ್ಪಡುತ್ತಾರೆ. 1848ರಲ್ಲಿ ಹಾವೇರಿ ಸಮೀಪದ ಅಗಡಿಯಲ್ಲಿ ಜನಿಸಿದ ಅವರು ಅಪಾರ ಭಕ್ತಿ, ತಪಸ್ಸು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ನಾಯಕತ್ವದಿಂದ ಗುರುತಿಸಿಕೊಂಡರು. ದಕ್ಷಿಣ ಭಾರತದ ಪವಿತ್ರ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಸಂಚರಿಸಿ ಧ್ಯಾನ, ಭಿಕ್ಷೆ ಮತ್ತು ಸಾಧನೆಗಳನ್ನು ಆಚರಿಸಿದ ಅವರು 1904ರಲ್ಲಿ ಆನಂದವನವನ್ನು ಸ್ಥಾಪಿಸಿ ಪ್ರಾರ್ಥನೆ, ವೇದಪಾಠ, ಜಪ ಮತ್ತು ಶಿಷ್ಯಸಮೂಹದ ಪವಿತ್ರ ಕೇಂದ್ರವನ್ನಾಗಿ ರೂಪಿಸಿದರು. ಸತ್ಯ, ಭಕ್ತಿ ಮತ್ತು ವೈರಾಗ್ಯದ ಮಾರ್ಗದಲ್ಲಿ ಅನೇಕ ಸಾಧಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಿ 1918ರಲ್ಲಿ ಮಹಾಸಮಾಧಿ ಪಡೆದರು.",
    quote: "ಸತ್ಯ, ಭಕ್ತಿ ಮತ್ತು ವೈರಾಗ್ಯವೇ ಸಾಧಕನ ಗಮ್ಯಸ್ಥಾನ.",
  },
  {
    id: "02",
    name: "ನಾರಾಯಣ ಭಗವಾನರು (1856–1928)",
    role: "ಜ್ಞಾನದ ಪ್ರತೀಕ",
    image: guru2,
    description:
      "ನಾರಾಯಣ ಭಗವಾನರು ಹಾವೇರಿ ತಾಲೂಕಿನ ಅಗಡಿ ಗ್ರಾಮದಲ್ಲಿ ನಗರ ಮನೆತನದವರಾದ ಇವರು ಕೌಶಿಕ ಗೋತ್ರಜರು. ಅಧ್ಯಾಪಕರಾಗಿದ್ದ ಇವರು ತಮ್ಮ ನವಕರಿಯನ್ನು ತ್ಯಜಿಸಿ ಶ್ರೀ ಸದ್ಗುರುವಿನ ಉಪಾಸನೆ, ಭಜನೆ, ಧರ್ಮ ಬೋಧನೆಗೆ ಮಾರುಹೋಗಿ ಅತ್ಯಂತ ಪ್ರೀತಿಯ ಶಿಷ್ಯರಾದರು. ಸದ್ಗುರುವನ್ನು ಜಗತ್ತಿಗೆ ಪರಿಚಯಿಸಿದ ಕೀರ್ತಿ ನಾರಾಯಣ ಭಗವಾನರಿಗೆ ಸಲ್ಲುತ್ತದೆ. ಗುರುವಿನ ತಕ್ಕ ಶಿಷ್ಯನಾಗಿ ಗುರುಕಾರುಣ್ಯಕ್ಕೆ ಪಾತ್ರರಾದ ಇವರು ಸದ್ಗುರುವಿನ ನಿರ್ಯಾಣದ ನಂತರ ಆನಂದವನದ ಚುಕ್ಕಾಣಿಯನ್ನು ಹಿಡಿದು ದಕ್ಷ ರೀತಿಯಿಂದ ನಡೆಸಿದರು.",
    quote: "",
  },
  {
    id: "03",
    name: "ಶ್ರೀ ಶಂಕರ ಭಗವಾನರು",
    role: "ಕರ್ಮದ ಪ್ರತೀಕ",
    image: guru3,
    description:
      "ಶ್ರೀ ಶಂಕರ ಭಗವಾನರು ಹಾವೇರಿಯ ಸಂಕಣ್ಣವರ ಮನೆತನದವರು. ಅಧ್ಯಾಪಕರಾಗಿದ್ದ ಇವರು ತಮ್ಮ ಕುಲದೇವಿಯ ಅಪ್ಪಣೆಯಂತೆ ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುಗಳನ್ನು ಸ್ವೀಕರಿಸಿದರು. ಗುರುವಿನ ಸೇವೆಯನ್ನು ನಿರಭಿಮಾನದಿಂದ ಮಾಡಿದರು. ಸಮಯಪಾಲನೆ, ಶಿಸ್ತು, ಶಿಷ್ಯ ಪರಿವಾರದಲ್ಲಿ ಕಂಡುಕೊಳ್ಳುವಂತೆ ಸೂಚಿಸುತ್ತಿದ್ದರು. ಅತಿಥಿ ಅಭಾಗ್ಯತರ ಸೇವೆಯನ್ನು ಅಚ್ಚುಕಟ್ಟಾಗಿ ನಿಭಾಯಿಸುತ್ತಿದ್ದರು. ಜೀವನದ ಕೊನೆಯಲ್ಲಿ ಸನ್ಯಾಸ ಧರ್ಮ ಸ್ವೀಕರಿಸಿ ಹಡಗಲಿ ಸಮೀಪ ತಿಪ್ಪಾಪುರದಲ್ಲಿ ಮಠ ನಿರ್ಮಿಸಿದರು.",
    quote: "",
  },
  {
    id: "04",
    name: "ಶ್ರೀ ಲಿಂಗೋ ಭಗವಾನರು",
    role: "ಭಕ್ತಿಯ ಪ್ರತೀಕ",
    image: guru4,
    description:
      "ಶ್ರೀ ಲಿಂಗೋ ಭಗವಾನರು ಅಗಡಿಯವರೇ, ವೈದಿಕ ಮನೆತನದವರು. ಉನ್ನತ ವ್ಯಾಸಂಗದಿಂದ ಮುಖ್ಯಾಧ್ಯಾಪಕನಾಗಿ ಸೇವೆಯನ್ನು ಆರಂಭಿಸಿ ಸದ್ಗುರುವಿನ ಯಾತ್ರೆಗೆ ಹೋಗಿ ನಂಜನಗೂಡಿನಲ್ಲಿ ಲಿಂಗದಲ್ಲಿಯೇ ಸದ್ಗುರುವನ್ನು ಕಂಡ ಅನುಭವದಿಂದ ತಮ್ಮ ಸರಕಾರಿ ನವಕರಿಗೆ ರಾಜೀನಾಮೆ ನೀಡಿ, ಲಿಂಗೋ ಭಗವಾನರಾಗಿ ಗುರುವಿನ ಸೇವೆಗೆ ಟೊಂಕಕಟ್ಟಿದರು. ತಮ್ಮನ್ನು ತಾವೇ ಸಂಪೂರ್ಣವಾಗಿ ಸೇವೆಗೆ ಅರ್ಪಿಸಿಕೊಂಡವರು ಇವರು. ಪುರಾಣ ಹೇಳುವ ಇವರ ಶೈಲಿ ಸದ್ಗುರುವಿಗೂ ಬಹಳ ಪ್ರಿಯವಾಗಿತ್ತು. ಕಂಠಶ್ರೀಯು ಸಹ ಬಹಳ ಮಧುರವಾಗಿತ್ತು.",
    quote: "",
  },
  {
    id: "05",
    name: "ಶ್ರೀ ಗುರು ಹೆಸರು ಐದು (1900 - 2000)",
    role: "ಆಧ್ಯಾತ್ಮಿಕ ಸುಧಾರಕ",
    image: guru5,
    description:
      "ಸದ್ಗುರು ಪರಂಪರೆಯ ಭಕ್ತಿ ಮತ್ತು ಗೌರವದ ಜೊತೆಗೆ ಜನರನ್ನು ಆತ್ಮಸ್ಥೈರ್ಯ ಮತ್ತು ಸತ್ಚರಿತ್ರೆಯತ್ತ ನಡೆಸಿದ ಸಂತಸ್ವರೂಪರು.",
    quote: "ಅಹಂಕಾರ ಮೌನವಾದಲ್ಲಿ ಭಕ್ತಿ ಬೆಳೆಯುತ್ತದೆ.",
  },
  {
    id: "06",
    name: "ಶ್ರೀ ಗುರು ಹೆಸರು ಆರು (1900 - 2000)",
    role: "ಕರುಣೆಯ ಮಾರ್ಗ",
    image: guru6,
    description:
      "ಅವರು ದುಃಖಿತರಿಗೆ ಸಾಂತ್ವನ ನೀಡಿದರು ಮತ್ತು ದೈವಿಕ ಪ್ರೀತಿ ಸೇವೆ ಹಾಗೂ ಕಾಳಜಿಯ ರೂಪದಲ್ಲಿ ವ್ಯಕ್ತವಾಗುತ್ತದೆ ಎಂದು ಭಕ್ತರಿಗೆ ನೆನಪಿಸಿದರು.",
    quote: "ಕರುಣೆ ಕ್ರಿಯೆಯಲ್ಲಿ ವ್ಯಕ್ತವಾಗುವ ಪೂಜೆಯಾಗಿದೆ.",
  },
  {
    id: "07",
    name: "ಶ್ರೀ ಗುರು ಹೆಸರು ಏಳು (1900 - 2000)",
    role: "ಆಂತರಿಕ ಶಾಂತಿಯ ಧ್ವನಿ",
    image: guru7,
    description:
      "ಅವರ ಜೀವನವು ಆಂತರಿಕ ನಿಶ್ಶಬ್ದತೆ, ಜ್ಞಾನ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಶಿಸ್ತಿನ ಪರಿವರ್ತನಾ ಶಕ್ತಿಯನ್ನು ಪ್ರತಿಬಿಂಬಿಸಿತು.",
    quote: "ಶಾಂತಿಯೇ ಜ್ಞಾನದ ಮೊದಲ ಆಶೀರ್ವಾದ.",
  },
  {
    id: "08",
    name: "ಶ್ರೀ ಗುರು ಹೆಸರು ಎಂಟು (1900 - 2000)",
    role: "ಸಾಧಕರ ಮಾರ್ಗದರ್ಶಕ",
    image: guru8,
    description:
      "ತಮ್ಮ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಕೃಪೆಯಿಂದ ಅವರು ಸಾಧಕರನ್ನು ಗೊಂದಲದಿಂದ ಸ್ಪಷ್ಟತೆ, ಭಕ್ತಿ ಮತ್ತು ಶಕ್ತಿಯತ್ತ ಕರೆದೊಯ್ದರು.",
    quote: "ಮಾರ್ಗದರ್ಶನವೆಂದರೆ ಗೋಚರವಾಗುವ ಕೃಪೆ.",
  },
  {
    id: "09",
    name: "ಶ್ರೀ ಗುರು ಹೆಸರು ಒಂಬತ್ತು (1900 - 2000)",
    role: "ಜೀವಂತ ಪರಂಪರೆ",
    image: guru9,
    description:
      "ಅವರು ವಿನಯದಿಂದ ಪರಂಪರೆಯನ್ನು ಪೋಷಿಸಿ, ಪವಿತ್ರ ಬೋಧನೆಗಳು ಭಕ್ತರ ಹೃದಯಗಳಲ್ಲಿ ಜೀವಂತವಾಗಿರಲು ಕಾರಣರಾದರು.",
    quote: "ಜೀವನದಲ್ಲಿ ಆಚಾರವಾದ ಸತ್ಯದಿಂದಲೇ ಪರಂಪರೆ ಜೀವಂತವಾಗಿರುತ್ತದೆ.",
  },
  {
    id: "10",
    name: "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರು (1900 - 2000)",
    role: "ಆನಂದವನದ ಪವಿತ್ರ ಸಾನ್ನಿಧ್ಯ",
    image: guru10,
    description:
      "ಅವರ ಕೃಪೆ, ಜ್ಞಾನ ಮತ್ತು ಕರುಣಾಮಯ ಮಾರ್ಗದರ್ಶನದಿಂದ ಭಕ್ತರು ದೈವಿಕ ಸಮೀಪತೆಯತ್ತ ಇಂದಿಗೂ ಪ್ರೇರಿತರಾಗುತ್ತಿದ್ದಾರೆ.",
    quote: "ಸದ್ಗುರುವಿನಲ್ಲಿ ಅನೇಕ ಹೃದಯಗಳು ತಮ್ಮ ಮನೆ ಕಂಡುಕೊಳ್ಳುತ್ತವೆ.",
  },
];

export default function GuruParampare() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const pageContent = language === "kn" ? KN_PAGE_CONTENT : EN_PAGE_CONTENT;
  const gurus = language === "kn" ? KN_GURUS : EN_GURUS;

  return (
    <>
      <PageHero title={pageContent.heroTitle} bgImage={bgImg} />

      <section className={styles.pageSection}>
        <div className={styles.introWrap} lang={language}>
          <span className={styles.kicker}>{pageContent.kicker}</span>
          <h2 className={styles.pageTitle}>{pageContent.pageTitle}</h2>
          <p className={styles.pageIntro}>{pageContent.pageIntro}</p>
        </div>

        <div className={styles.timeline}>
          {gurus.map((guru, index) => (
            <article
              key={guru.id}
              className={`${styles.guruRow} ${
                index % 2 !== 0 ? styles.reverse : ""
              }`}
            >
              <div className={styles.imageCol}>
                <div className={styles.imageFrame}>
                  <img
                    src={guru.image}
                    alt={guru.name}
                    className={styles.guruImage}
                  />
                  <span className={styles.guruId}>{guru.id}</span>
                </div>
              </div>

              <div className={styles.contentCol}>
                <div className={styles.contentCard} lang={language}>
                  <span className={styles.role}>{guru.role}</span>
                  <h3 className={styles.guruName}>{guru.name}</h3>
                  <p className={styles.description}>{guru.description}</p>
                  {guru.quote ? (
                    <blockquote className={styles.quote}>
                      “{guru.quote}”
                    </blockquote>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}