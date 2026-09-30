import { Link } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import styles from "./SevaInvitation.module.css";
import { DeepaIcon } from "../ornaments/Ornaments";
import { useI18n } from "../../i18n/useI18n";

const CONTENT = {
  en: {
    title: "Offer a seva",
    body: "A seva can be offered for yourself or for members of your family. Choose the seva, pick the date, and book it online in Kannada or English.",
    offline: "Some sevas cannot be booked online. For those, please call the Samsthana office.",
  },
  kn: {
    title: "ಸೇವೆಯನ್ನು ಸಮರ್ಪಿಸಿ",
    body: "ನಿಮಗಾಗಿ ಅಥವಾ ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗಾಗಿ ಸೇವೆಯನ್ನು ಸಮರ್ಪಿಸಬಹುದು. ಸೇವೆಯನ್ನು ಆರಿಸಿ, ದಿನಾಂಕವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಆನ್‌ಲೈನ್ ಮೂಲಕ ಬುಕ್ ಮಾಡಿ.",
    offline: "ಕೆಲವು ಸೇವೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಬುಕ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ. ಅವುಗಳಿಗಾಗಿ ಸಂಸ್ಥಾನದ ಕಚೇರಿಗೆ ಕರೆ ಮಾಡಿ.",
  },
};

export default function SevaInvitation() {
  const { lang, t } = useI18n("pages");
  const { t: tDonate } = useI18n("donate");
  const content = CONTENT[lang] || CONTENT.en;

  return (
    <section className={styles.section} aria-labelledby="seva-invite-title" lang={lang}>
      <div className={styles.frame}>
        <DeepaIcon size={44} strokeWidth={1.15} className={styles.deepa} />
        <h2 id="seva-invite-title" className={styles.title}>{content.title}</h2>
        <p className={styles.body}>{content.body}</p>

        <div className={styles.actions}>
          <Link to={`/${lang}/seva-booking`} className={styles.primary}>
            <span>{t("bookSeva")}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link to={`/${lang}/donate`} className={styles.secondary}>
            {tDonate("donateNow")}
          </Link>
        </div>

        <p className={styles.offline}>
          <span>{content.offline}</span>
          <a href="tel:+919741585030" className={styles.call}>
            <Phone size={15} aria-hidden="true" />
            <span>{t("callOffice")}</span>
          </a>
        </p>
      </div>
    </section>
  );
}
