import styles from "./Footer.module.css";
import { useI18n } from "../i18n/useI18n";

export default function Footer() {
  const { t } = useI18n("footer");

  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} {t("copyright")}</p>
    </footer>
  );
}