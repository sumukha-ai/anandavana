import React from "react";
import PageHero from "../components/PageHero/PageHero";
import bgImg from "../../assets/pancyatana.jpg.jpeg";
import styles from "./GuruParampare.module.css";

import guru1 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru2 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru3 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru4 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru5 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru6 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru7 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru8 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru9 from "../../assets/sheshachalaru_lingu.jpg.jpeg";
import guru10 from "../../assets/sheshachalaru_lingu.jpg.jpeg";


const gurus = [
  {
    id: "01",
    name: "Sri Sheshachala Sadguru (1900 - 2000)",
    role: "Foundational Saint",
    image: guru1,
    description:
      "A revered spiritual guide whose life laid the sacred foundation for the lineage and inspired generations of seekers.",
    quote: "A life of truth becomes a lamp for many.",
  },
  {
    id: "02",
    name: "Sri Guru Name Two (1900 - 2000)",
    role: "Bearer of Wisdom",
    image: guru2,
    description:
      "He carried forward the spiritual current of the parampare with discipline, compassion, and unwavering devotion.",
    quote: "Where there is surrender, grace begins.",
  },
  {
    id: "03",
    name: "Sri Guru Name Three (1900 - 2000)",
    role: "Guardian of Dharma",
    image: guru3,
    description:
      "Known for preserving dharma and uplifting devotees through teachings rooted in inner strength and humility.",
    quote: "The quiet mind hears the divine.",
  },
  {
    id: "04",
    name: "Sri Guru Name Four (1900 - 2000)",
    role: "Teacher of Devotion",
    image: guru4,
    description:
      "His path of devotion and service touched the lives of countless followers and deepened the spirit of the samsthana.",
    quote: "Devotion turns effort into blessing.",
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

export default function GuruParampare() {
  return (
    <>
      <PageHero title="Guru Parampare" bgImage={bgImg} />

      <section className={styles.pageSection}>
        <div className={styles.introWrap}>
          <span className={styles.kicker}>Sacred Lineage</span>
          <h2 className={styles.pageTitle}>The lineage of guiding light</h2>
          <p className={styles.pageIntro}>
            The Guru Parampare reflects a living stream of wisdom, devotion, and
            grace carried across generations. Each revered guru has strengthened
            the spiritual path and inspired seekers through divine presence,
            compassion, and inner guidance.
          </p>
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
                <div className={styles.contentCard}>
                  <span className={styles.role}>{guru.role}</span>
                  <h3 className={styles.guruName}>{guru.name}</h3>
                  <p className={styles.description}>{guru.description}</p>
                  <blockquote className={styles.quote}>
                    “{guru.quote}”
                  </blockquote>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}