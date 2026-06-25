import React from "react";
import { useParams } from "react-router-dom";
import PageHero from "../../components/PageHero/PageHero";
import bgImg from "../../../assets/pancyatana.jpg.jpeg";
import styles from "./SadguruVamshaVruksha.module.css";

import guru1 from "../../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru2 from "../../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru3 from "../../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru4 from "../../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru5 from "../../../assets/sheshachalaru_lingu.jpg.jpeg";

const EN_PAGE_CONTENT = {
  heroTitle: "Sadguru Vamsha Vruksha",
  kicker: "Sacred Lineage Tree",
  pageTitle: "The spiritual family lineage",
  pageIntro:
    "Sadguru Vamsha Vruksha presents the sacred generational lineage flowing from Sri Sheshachala Sadguru through successive generations, preserving the spiritual light, values, and tradition across time.",
};

const KN_PAGE_CONTENT = {
  heroTitle: "ಸದ್ಗುರು ವಂಶ ವೃಕ್ಷ",
  kicker: "ಪವಿತ್ರ ವಂಶ ಪರಂಪರೆ",
  pageTitle: "ಆಧ್ಯಾತ್ಮಿಕ ಕುಟುಂಬ ಪರಂಪರೆ",
  pageIntro:
    "ಸದ್ಗುರು ವಂಶ ವೃಕ್ಷವು ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುವರಿಂದ ಆರಂಭವಾಗಿ ತಲೆಮಾರುಗಳಿಂದ ಸಾಗುತ್ತಿರುವ ಪವಿತ್ರ ಕುಟುಂಬ ಪರಂಪರೆಯನ್ನು ಪರಿಚಯಿಸುತ್ತದೆ. ಈ ಪರಂಪರೆಯ ಮೂಲಕ ಆಧ್ಯಾತ್ಮಿಕ ಮೌಲ್ಯಗಳು, ಕೃಪೆ ಮತ್ತು ಸಂಪ್ರದಾಯದ ಬೆಳಕು ಮುಂದುವರಿದಿದೆ.",
};

const EN_LINEAGE = [
  {
    id: "01",
    name: "Sri Sheshachala Sadguru",
    role: "First Generation",
    image: guru1,
    description:
      "The revered founding spiritual presence whose life, grace, and teachings became the source of this sacred lineage.",
    quote: "",
  },
  {
    id: "02",
    name: "His Son",
    role: "Second Generation",
    image: guru2,
    description:
      "He carried forward the values, devotion, and spiritual dignity inherited from Sri Sheshachala Sadguru.",
    quote: "",
  },
  {
    id: "03",
    name: "His Son",
    role: "Third Generation",
    image: guru3,
    description:
      "He continued the family’s sacred tradition, preserving the lineage with reverence, discipline, and faith.",
    quote: "",
  },
  {
    id: "04",
    name: "Sri Chidambara Murthy Chakravarthi",
    role: "Fourth Generation",
    image: guru4,
    description:
      "A respected torchbearer in the lineage, remembered for upholding the spiritual heritage and values of the family tradition.",
    quote: "",
  },
  {
    id: "05",
    name: "Sri Guru Datta Murthy Chakravarthi",
    role: "Fifth Generation",
    image: guru5,
    description:
      "The present continuation of the sacred lineage, representing the living bond between heritage, devotion, and spiritual continuity.",
    quote: "",
  },
];

const KN_LINEAGE = [
  {
    id: "01",
    name: "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರು",
    role: "ಮೊದಲನೇ ತಲೆಮಾರು",
    image: guru1,
    description:
      "ಈ ಪವಿತ್ರ ವಂಶ ಪರಂಪರೆಯ ಮೂಲಸ್ವರೂಪರಾದ ಪೂಜ್ಯ ಸದ್ಗುರುವರ ಜೀವನ, ಕೃಪೆ ಮತ್ತು ಉಪದೇಶಗಳು ಈ ಪರಂಪರೆಯ ಆಧಾರವಾಗಿವೆ.",
    quote: "",
  },
  {
    id: "02",
    name: "ಅವರ ಪುತ್ರ",
    role: "ಎರಡನೇ ತಲೆಮಾರು",
    image: guru2,
    description:
      "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುವರಿಂದ ಬಂದ ಭಕ್ತಿ, ಮೌಲ್ಯಗಳು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಮರ್ಯಾದೆಯನ್ನು ಮುಂದುವರಿಸಿದವರು.",
    quote: "",
  },
  {
    id: "03",
    name: "ಅವರ ಪುತ್ರ",
    role: "ಮೂರನೇ ತಲೆಮಾರು",
    image: guru3,
    description:
      "ಕುಟುಂಬದ ಪವಿತ್ರ ಪರಂಪರೆಯನ್ನು ಭಕ್ತಿ, ಶಿಸ್ತು ಮತ್ತು ಗೌರವದೊಂದಿಗೆ ಉಳಿಸಿಕೊಂಡವರು.",
    quote: "",
  },
  {
    id: "04",
    name: "ಶ್ರೀ ಚಿದಂಬರ ಮೂರ್ತಿ ಚಕ್ರವರ್ತಿ",
    role: "ನಾಲ್ಕನೇ ತಲೆಮಾರು",
    image: guru4,
    description:
      "ವಂಶ ಪರಂಪರೆಯ ಆಧ್ಯಾತ್ಮಿಕ ಮೌಲ್ಯಗಳನ್ನು ಕಾಪಾಡಿ ಮುಂದುವರಿಸಿದ ಗೌರವಾನ್ವಿತ ಪರಂಪರೆಧಾರಕರು.",
    quote: "",
  },
  {
    id: "05",
    name: "ಶ್ರೀ ಗುರು ದತ್ತ ಮೂರ್ತಿ ಚಕ್ರವರ್ತಿ",
    role: "ಐದನೇ ತಲೆಮಾರು",
    image: guru5,
    description:
      "ಪವಿತ್ರ ವಂಶ ಪರಂಪರೆಯ ಇಂದಿನ ಮುಂದುವರಿಕೆಯ ಪ್ರತಿನಿಧಿಯಾಗಿದ್ದು, ಭಕ್ತಿ ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ನಿರಂತರತೆಯನ್ನು ಜೀವಂತವಾಗಿರಿಸುತ್ತಿದ್ದಾರೆ.",
    quote: "",
  },
];

export default function SadguruVamshaVruksha() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const pageContent = language === "kn" ? KN_PAGE_CONTENT : EN_PAGE_CONTENT;
  const lineage = language === "kn" ? KN_LINEAGE : EN_LINEAGE;

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
          {lineage.map((member, index) => (
            <article
              key={member.id}
              className={`${styles.guruRow} ${
                index % 2 !== 0 ? styles.reverse : ""
              }`}
            >
              <div className={styles.imageCol}>
                <div className={styles.imageFrame}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className={styles.guruImage}
                  />
                  <span className={styles.guruId}>{member.id}</span>
                </div>
              </div>

              <div className={styles.contentCol}>
                <div className={styles.contentCard} lang={language}>
                  <span className={styles.role}>{member.role}</span>
                  <h3 className={styles.guruName}>{member.name}</h3>
                  <p className={styles.description}>{member.description}</p>

                  {member.quote ? (
                    <blockquote className={styles.quote}>
                      “{member.quote}”
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