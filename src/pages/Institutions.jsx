import React, { useEffect } from "react";
import PageHero from "../components/PageHero/PageHero";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Institutions.module.css";
import bgImg from "../../assets/bg1.jpeg";

import pata1 from "../../assets/pata1.jpg";
import pata2 from "../../assets/bg2.jpg";
import pata3 from "../../assets/bg2.jpg";
import hiriya1 from "../../assets/hiriya1.jpg";
import hiriya2 from "../../assets/bg2.jpg";

const institutionsData = [
  {
    id: "paatashaale",
    title: "Sri Sheshachala Veda Paatashaale",
    subtitle: "Preserving the sacred sounds and Vedic traditions",
    description: [
      "The Paatashaale at Anandavana is dedicated to the preservation, chanting, and deeper understanding of ancient Vedic scriptures. Here, young minds are shaped with rigorous discipline and spiritual grounding.",
      "Students are taught not just to memorize the sacred hymns, but to absorb the profound spiritual discipline required to live a life guided by Dharma. It is a space where the vibrations of the Vedas resonate daily, continuing a timeless lineage of teaching.",
    ],
    images: [pata1, pata2, pata3],
  },
  {
    id: "hiriya-prathamika-shaale",
    title: "Sri Sheshachala Prouda Shaale",
    subtitle: "Nurturing young minds with values and modern education",
    description: [
      "The Prouda Shaale provides holistic education that balances academic learning with deep-rooted cultural and moral values.",
      "Education here goes beyond classroom teaching. The school helps children grow with discipline, compassion, ethical understanding, and a sense of service, shaping them into capable and grounded individuals.",
    ],
    images: [hiriya1, hiriya2],
  },
];

export default function Institutions() {
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
      <PageHero title="Our Institutions" bgImage={bgImg} />

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
                    <div className={styles.textInner}>
                      {/* <span className={styles.label}></span> */}
                      <h2 className={styles.instTitle}>{inst.title}</h2>
                      <p className={styles.instSubtitle}>{inst.subtitle}</p>

                      <div className={styles.instDescription}>
                        {inst.description.map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
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
                        inst.images.length === 2 ? styles.gridTwo : styles.gridThree
                      }`}
                    >
                      {inst.images.map((img, i) => (
                        <div key={i} className={styles.imgWrapper}>
                          <img
                            src={img}
                            alt={`${inst.title} view ${i + 1}`}
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