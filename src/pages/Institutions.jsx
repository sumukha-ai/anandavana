import { useEffect } from "react";
import PageHero from "../components/PageHero/PageHero";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Institutions.module.css";
import bgImg from "../../assets/bg1.jpeg";
import { useI18n } from "../i18n/useI18n";

import pata1 from "../../assets/pata1.jpg";
import templeView from "../../assets/bg2.jpg";
import hiriya1 from "../../assets/hiriya1.JPG";

const INSTITUTIONS = {
  en: [
    {
      id: "paatashaale",
      title: "Sri Sheshachala Veda Paatashaale",
      subtitle: "Preserving the sacred sounds and Vedic traditions",
      description: [
        "The Paatashaale at Anandavana is dedicated to the preservation, chanting, and deeper understanding of ancient Vedic scriptures. Here, young minds are shaped with rigorous discipline and spiritual grounding.",
        "Students are taught not just to memorize the sacred hymns, but to absorb the profound spiritual discipline required to live a life guided by Dharma. It is a space where the vibrations of the Vedas resonate daily, continuing a timeless lineage of teaching.",
      ],
      images: [
        { src: pata1, alt: "Students of the Veda Paatashaale chanting together" },
        { src: templeView, alt: "The temple courtyard at Sri Kshetra Anandavana" },
      ],
    },
    {
      id: "hiriya-prathamika-shaale",
      title: "Sri Sheshachala Prouda Shaale",
      subtitle: "Nurturing young minds with values and modern education",
      description: [
        "The Prouda Shaale provides holistic education that balances academic learning with deep-rooted cultural and moral values.",
        "Education here goes beyond classroom teaching. The school helps children grow with discipline, compassion, ethical understanding, and a sense of service, shaping them into capable and grounded individuals.",
      ],
      images: [{ src: hiriya1, alt: "Sri Sheshachala Prouda Shaale" }],
    },
  ],
  kn: [
    {
      id: "paatashaale",
      title: "ಶ್ರೀ ಶೇಷಾಚಲ ವೇದ ಪಾಠಶಾಲೆ",
      subtitle: "ಪವಿತ್ರ ವೇದನಾದ ಮತ್ತು ವೈದಿಕ ಪರಂಪರೆಯ ಸಂರಕ್ಷಣೆ",
      description: [
        "ಆನಂದವನದ ಪಾಠಶಾಲೆಯು ಪ್ರಾಚೀನ ವೇದಗ್ರಂಥಗಳ ಸಂರಕ್ಷಣೆ, ಪಠಣ ಮತ್ತು ಆಳವಾದ ಅಧ್ಯಯನಕ್ಕೆ ಮೀಸಲಾಗಿದೆ. ಇಲ್ಲಿ ಎಳೆಯ ಮನಸ್ಸುಗಳು ಕಟ್ಟುನಿಟ್ಟಿನ ಶಿಸ್ತು ಮತ್ತು ಆಧ್ಯಾತ್ಮಿಕ ಅಡಿಪಾಯದೊಂದಿಗೆ ರೂಪುಗೊಳ್ಳುತ್ತವೆ.",
        "ವಿದ್ಯಾರ್ಥಿಗಳು ಪವಿತ್ರ ಮಂತ್ರಗಳನ್ನು ಕಂಠಪಾಠ ಮಾಡುವುದಷ್ಟೇ ಅಲ್ಲ, ಧರ್ಮಮಾರ್ಗದ ಜೀವನಕ್ಕೆ ಬೇಕಾದ ಆಧ್ಯಾತ್ಮಿಕ ಶಿಸ್ತನ್ನೂ ಮೈಗೂಡಿಸಿಕೊಳ್ಳುತ್ತಾರೆ. ವೇದಗಳ ನಾದ ಪ್ರತಿದಿನ ಮೊಳಗುವ ಈ ತಾಣ ಕಾಲಾತೀತ ಗುರು-ಶಿಷ್ಯ ಪರಂಪರೆಯನ್ನು ಮುಂದುವರಿಸುತ್ತಿದೆ.",
      ],
      images: [
        { src: pata1, alt: "ವೇದ ಪಾಠಶಾಲೆಯ ವಿದ್ಯಾರ್ಥಿಗಳು ಒಟ್ಟಾಗಿ ಪಠಿಸುತ್ತಿರುವುದು" },
        { src: templeView, alt: "ಶ್ರೀ ಕ್ಷೇತ್ರ ಆನಂದವನದ ದೇವಾಲಯದ ಪ್ರಾಂಗಣ" },
      ],
    },
    {
      id: "hiriya-prathamika-shaale",
      title: "ಶ್ರೀ ಶೇಷಾಚಲ ಪ್ರೌಢಶಾಲೆ",
      subtitle: "ಮೌಲ್ಯಗಳು ಮತ್ತು ಆಧುನಿಕ ಶಿಕ್ಷಣದೊಂದಿಗೆ ಎಳೆಯ ಮನಸ್ಸುಗಳ ಪೋಷಣೆ",
      description: [
        "ಪ್ರೌಢಶಾಲೆಯು ಶೈಕ್ಷಣಿಕ ಕಲಿಕೆಯನ್ನು ಆಳವಾಗಿ ಬೇರೂರಿದ ಸಾಂಸ್ಕೃತಿಕ ಮತ್ತು ನೈತಿಕ ಮೌಲ್ಯಗಳೊಂದಿಗೆ ಸಮತೋಲನಗೊಳಿಸುವ ಸಮಗ್ರ ಶಿಕ್ಷಣವನ್ನು ನೀಡುತ್ತದೆ.",
        "ಇಲ್ಲಿನ ಶಿಕ್ಷಣ ತರಗತಿಯ ಪಾಠಕ್ಕೆ ಸೀಮಿತವಲ್ಲ. ಶಿಸ್ತು, ಕರುಣೆ, ನೈತಿಕ ತಿಳುವಳಿಕೆ ಮತ್ತು ಸೇವಾಭಾವದೊಂದಿಗೆ ಮಕ್ಕಳು ಬೆಳೆದು, ಸಮರ್ಥ ಹಾಗೂ ನೆಲೆಗೊಂಡ ವ್ಯಕ್ತಿಗಳಾಗಲು ಶಾಲೆ ನೆರವಾಗುತ್ತದೆ.",
      ],
      images: [{ src: hiriya1, alt: "ಶ್ರೀ ಶೇಷಾಚಲ ಪ್ರೌಢಶಾಲೆ" }],
    },
  ],
};

export default function Institutions() {
  const { t, lang } = useI18n("pages");
  const institutionsData = INSTITUTIONS[lang] || INSTITUTIONS.en;
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 100,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <PageHero title={t("institutionsTitle")} bgImage={bgImg} />

      <section className={styles.pageSection}>
        <div className={styles.container}>
          <div className={styles.institutionsWrapper}>
            {institutionsData.map((inst, index) => {
              const isEven = index % 2 === 0;

              return (
                <article
                  key={inst.id}
                  className={`${styles.institutionRow} ${
                    !isEven ? styles.reverseRow : ""
                  }`}
                >
                  <div
                    className={styles.textContent}
                    data-aos={isEven ? "fade-right" : "fade-left"}
                  >
                    <div className={styles.textInner} lang={lang}>
                      <h2 className={styles.instTitle}>{inst.title}</h2>
                      <p className={styles.instSubtitle}>{inst.subtitle}</p>

                      <div className={styles.instDescription}>
                        {inst.description.map((paragraph) => (
                          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    className={styles.imageContent}
                    data-aos={isEven ? "fade-left" : "fade-right"}
                  >
                    <div
                      className={`${styles.imageGrid} ${
                        inst.images.length === 1
                          ? styles.gridOne
                          : inst.images.length === 2
                            ? styles.gridTwo
                            : styles.gridThree
                      }`}
                    >
                      {inst.images.map((img) => (
                        <div key={img.alt} className={styles.imgWrapper}>
                          <img
                            src={img.src}
                            alt={img.alt}
                            loading="lazy"
                            className={styles.instImage}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}