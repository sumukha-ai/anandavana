import PageHero from "../components/PageHero/PageHero";
import bgImg from "../../assets/bg1.jpeg";
import styles from "./Publications.module.css";
import { useI18n } from "../i18n/useI18n";

export default function Publications() {
  const { t } = useI18n("publications");

  return (
    <>
      <PageHero title={'Publications'} bgImage={bgImg} />
      <div className={styles.container}>
        <div className={styles.content}>
          <p>{t("COMING SOON")}</p>
        </div>
      </div>
    </>
  );
}