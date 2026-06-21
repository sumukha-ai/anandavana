import React from "react";
import styles from "./ContactSection.module.css";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactSection() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.kicker}>Contact</span>
          <h2 className={styles.title}>Visit Anandavana</h2>
          <p className={styles.subtitle}>
            Reach the sacred abode of Sri Sheshachala Sadguru with ease.
          </p>
        </div>

        <div className={styles.contactGrid}>
          <div className={styles.mapWrap}>
            <iframe
              title="Anandavana Agadi location map"
              src="https://www.google.com/maps?q=Anandavana%20Agadi%20Haveri%20Karnataka&z=15&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.mapFrame}
            ></iframe>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <MapPin size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>Address</h3>
                <p className={styles.infoText}>
                  SH 2, Agadi, Haveri - 581128, Karnataka, India
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <Phone size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>Phone</h3>
                <a href="tel:+919741585030" className={styles.infoLink}>
                  +91 97415 85030
                </a>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.iconWrap}>
                <Mail size={20} strokeWidth={1.8} />
              </div>
              <div>
                <h3 className={styles.infoTitle}>Email</h3>
                <a href="mailto:info@anandavanaagadi.org" className={styles.infoLink}>
                  info@anandavanaagadi.org
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Anandavana+Agadi+Haveri+Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapButton}
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}