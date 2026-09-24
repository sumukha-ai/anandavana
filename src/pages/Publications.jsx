import PageHero from "../components/PageHero/PageHero";
import ComingSoon from "../components/ComingSoon/ComingSoon";
import bgImg from "../../assets/bg1.jpeg";
import appStyles from "../App.module.css";
import { useI18n } from "../i18n/useI18n";

export default function Publications() {
  const { t } = useI18n("pages");

  return (
    <>
      <PageHero title={t("publicationsTitle")} bgImage={bgImg} />
      <div className={`${appStyles.container} ${appStyles.pageBody}`}>
        <ComingSoon title={t("publicationsEmptyTitle")} body={t("publicationsEmptyBody")} />
      </div>
    </>
  );
}
