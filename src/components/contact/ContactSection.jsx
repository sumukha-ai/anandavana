import { useParams } from "react-router-dom";
import styles from "./ContactSection.module.css";
import { ArrowUpRight, MapPin, Phone, Mail } from "lucide-react";
import { LotusRule } from "../ornaments/Ornaments";

const EN_CONTENT = {
  title: "Visit Anandavana",
  subtitle: "Reach the sacred abode of Sri Sheshachala Sadguru with ease.",
  mapTitle: "Anandavana Agadi location map",
  addressLabel: "Address",
  addressValue: "SH 2, Agadi, Haveri - 581128, Karnataka, India",
  phoneLabel: "Phone",
  phoneValue: "+91 97415 85030",
  emailLabel: "Email",
  emailValue: "shreekshethraanandavana@gmail.com",
  mapButton: "Open in Google Maps",
};

const KN_CONTENT = {
  title: "ಆನಂದವನಕ್ಕೆ ಭೇಟಿ ನೀಡಿ",
  subtitle: "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುವಿನ ಪವಿತ್ರ ನಿವಾಸವನ್ನು ಸುಲಭವಾಗಿ ತಲುಪಿ.",
  mapTitle: "ಆನಂದವನ ಅಗಡಿ ಸ್ಥಳ ನಕ್ಷೆ",
  addressLabel: "ವಿಳಾಸ",
  addressValue: "SH 2, ಅಗಡಿ, ಹಾವೇರಿ - 581128, ಕರ್ನಾಟಕ, ಭಾರತ",
  phoneLabel: "ದೂರವಾಣಿ",
  phoneValue: "+91 97415 85030",
  emailLabel: "ಇ-ಮೇಲ್",
  emailValue: "shreekshethraanandavana@gmail.com",
  mapButton: "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
};

export default function ContactSection() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = language === "kn" ? KN_CONTENT : EN_CONTENT;

  return (
    <section className={styles.contactSection} aria-labelledby="visit-title">
      <div className={styles.container}>
        <div className={styles.infoColumn} lang={language}>
          <h2 id="visit-title" className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
          <LotusRule align="start" className={styles.rule} />

          <dl className={styles.infoList}>
            <div className={styles.infoItem}>
              <dt className={styles.infoTitle}>
                <MapPin size={17} strokeWidth={1.7} aria-hidden="true" />
                {content.addressLabel}
              </dt>
              <dd className={styles.infoText}>{content.addressValue}</dd>
            </div>
            <div className={styles.infoItem}>
              <dt className={styles.infoTitle}>
                <Phone size={17} strokeWidth={1.7} aria-hidden="true" />
                {content.phoneLabel}
              </dt>
              <dd className={styles.infoText}>
                <a href="tel:+919741585030" className={styles.infoLink}>{content.phoneValue}</a>
              </dd>
            </div>
            <div className={styles.infoItem}>
              <dt className={styles.infoTitle}>
                <Mail size={17} strokeWidth={1.7} aria-hidden="true" />
                {content.emailLabel}
              </dt>
              <dd className={styles.infoText}>
                <a href="mailto:shreekshethraanandavana@gmail.com" className={styles.infoLink}>
                  {content.emailValue}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href="https://www.google.com/maps/search/?api=1&query=Anandavana+Agadi+Haveri+Karnataka"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapButton}
          >
            <span>{content.mapButton}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            title={content.mapTitle}
            src="https://www.google.com/maps?q=Anandavana%20Agadi%20Haveri%20Karnataka&z=15&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.mapFrame}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
