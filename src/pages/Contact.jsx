import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import appStyles from '../App.module.css';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <>
      <PageHero title="Contact Us" bgImage={bgImg} />
      <div className={`${appStyles.container} ${styles.contactContainer}`}>
        <p className={styles.contactSubtitle}>We would love to hear from you. Reach out to us for any queries or spiritual guidance.</p>
        
        <div className={styles.contentWrapper}>
        <div className={styles.infoCard}>
          <h3>Get in Touch</h3>
          <div className={styles.infoList}>
            <div>
              <strong>Address</strong><br />
              <span className={styles.infoText}>SriKshetra Anandavana Agadi<br />Agadi, Haveri District<br />Karnataka - 581128</span>
            </div>
            <div>
              <strong>Phone</strong><br />
              <span className={styles.infoText}>+91 (000) 000-0000</span>
            </div>
            <div>
              <strong>Email</strong><br />
              <span className={styles.infoText}>info@anandavanaagadi.org</span>
            </div>
          </div>
        </div>

        <div className={styles.mapWrapper}>
          <div className={styles.mapContainer}>
            {/* Map Embed based on the name Srikshetra Anandavana Agadi */}
            <iframe
              title="Map Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15410.8718918231!2d75.3853!3d14.9926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb92dbab7b61a4f%3A0xed4ab041fc45adbd!2sAgadi%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              className={styles.mapFrame}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}