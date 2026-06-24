import React from "react";
import { useParams } from "react-router-dom";
import styles from "./ContactSection.module.css";
import { MapPin, Phone, Mail } from "lucide-react";

const EN_CONTENT = {
  kicker: "Contact",
  title: "Visit Anandavana",
  subtitle: "Reach the sacred abode of Sri Sheshachala Sadguru with ease.",
  mapTitle: "Anandavana Agadi location map",
  addressLabel: "Address",
  addressValue: "SH 2, Agadi, Haveri - 581128, Karnataka, India",
  phoneLabel: "Phone",
  phoneValue: "+91 97415 85030",
  emailLabel: "Email",
  emailValue: "info@anandavanaagadi.org",
  mapButton: "Open in Google Maps",
};

const KN_CONTENT = {
  kicker: "ಸಂಪರ್ಕ",
  title: "ಆನಂದವನಕ್ಕೆ ಭೇಟಿ ನೀಡಿ",
  subtitle: "ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರುವಿನ ಪವಿತ್ರ ನಿವಾಸವನ್ನು ಸುಲಭವಾಗಿ ತಲುಪಿ.",
  mapTitle: "ಆನಂದವನ ಅಗಡಿ ಸ್ಥಳ ನಕ್ಷೆ",
  addressLabel: "ವಿಳಾಸ",
  addressValue: "SH 2, ಅಗಡಿ, ಹಾವೇರಿ - 581128, ಕರ್ನಾಟಕ, ಭಾರತ",
  phoneLabel: "ದೂರವಾಣಿ",
  phoneValue: "+91 97415 85030",
  emailLabel: "ಇ-ಮೇಲ್",
  emailValue: "info@anandavanaagadi.org",
  mapButton: "Google Maps ನಲ್ಲಿ ತೆರೆಯಿರಿ",
};

export default function ContactSection() {
  const { lang } = useParams();
  const language = lang === "kn" ? "kn" : "en";
  const content = language === "kn" ? KN_CONTENT : EN_CONTENT;

  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader} lang={language}>
          <span className={styles.kicker}>{content.kicker}</span>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.subtitle}>{content.subtitle}</p>
        </div>

        <div className={styles.contactGrid}>
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

          <div className={styles.infoCard} lang={language}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <MapPin size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>{content.addressLabel}</h3>
                <p className={styles.infoText}>{content.addressValue}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <Phone size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>{content.phoneLabel}</h3>
                <a href="tel:+919741585030" className={styles.infoLink}>
                  {content.phoneValue}
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <Mail size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>{content.emailLabel}</h3>
                <a
                  href="mailto:info@anandavanaagadi.org"
                  className={styles.infoLink}
                >
                  {content.emailValue}
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Anandavana+Agadi+Haveri+Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              {content.mapButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}