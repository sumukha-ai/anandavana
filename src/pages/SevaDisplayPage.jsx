import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Loader2, Phone, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/useI18n";
import shop from "./shop/Shop.module.css";
import styles from "./SevaDisplayPage.module.css";
import { AssuranceStrip, AvailabilityBadge, Breadcrumbs, ErrorState, Price, SevaCard } from "./shop/ShopParts";
import { OFFICE_PHONE, isBookableOnline, sevaImage, useSevas } from "./shop/shopUtils";
import { sevaContactPhone, telHref } from "./sevaHelpers";

export default function SevaDisplayPage() {
  const { sevaId } = useParams();
  const { t, lang } = useI18n("shop");
  const { isAuthenticated } = useAuth();
  const { sevas, status, retry } = useSevas(lang);

  const seva = useMemo(() => sevas.find((item) => String(item.id) === String(sevaId)), [sevas, sevaId]);
  const related = useMemo(
    () => sevas.filter((item) => String(item.id) !== String(sevaId)).sort((a, b) => Number(isBookableOnline(b)) - Number(isBookableOnline(a))).slice(0, 3),
    [sevas, sevaId]
  );

  const crumbs = [
    { label: t("home"), to: `/${lang}` },
    { label: t("sevas"), to: `/${lang}/seva-booking` },
  ];

  if (status === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.container}>
          <Breadcrumbs items={[...crumbs, { label: "…" }]} />
          <div className={styles.product} aria-busy="true">
            <div className={`${shop.skeleton} ${styles.mediaSkeleton}`} />
            <div className={styles.loadingInfo} role="status">
              <Loader2 size={20} aria-hidden="true" className={shop.spin} />
              <span>{t("loadingSeva")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !seva) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          {status === "error" ? (
            <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={retry} t={t}>
              <Link to={`/${lang}/seva-booking`} className={shop.btnSecondary}>
                {t("backToSevas")}
              </Link>
            </ErrorState>
          ) : (
            <ErrorState title={t("notFoundTitle")} body={t("notFoundBody")} t={t}>
              <Link to={`/${lang}/seva-booking`} className={shop.btnPrimary}>
                <ArrowLeft size={17} aria-hidden="true" />
                {t("backToSevas")}
              </Link>
            </ErrorState>
          )}
        </div>
      </div>
    );
  }

  const online = isBookableOnline(seva);
  const phone = sevaContactPhone(seva) || OFFICE_PHONE;
  const checkoutPath = `/${lang}/checkout/${seva.id}`;

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={[...crumbs, { label: seva.name }]} />

        <section className={styles.product}>
          <div className={styles.media}>
            <img src={sevaImage(seva)} alt="" width="1200" height="900" />
          </div>

          <div className={styles.info}>
            <AvailabilityBadge seva={seva} t={t} />
            <h1 className={styles.title}>{seva.name}</h1>

            <div className={styles.priceRow}>
              <Price amount={seva.amount} t={t} className={styles.bigPrice} />
              {Number(seva.amount) > 0 ? <span className={styles.per}>{t("perSeva")}</span> : null}
            </div>

            {seva.description ? <p className={styles.lede}>{seva.description}</p> : null}

            <div className={styles.buyBox}>
              {online ? (
                <>
                  <Link to={checkoutPath} className={`${shop.btnPrimary} ${shop.btnBlock} ${shop.btnLarge}`}>
                    {isAuthenticated ? t("bookThisSeva") : t("signInToBook")}
                  </Link>
                  {!isAuthenticated ? (
                    <p className={styles.buyHint}>
                      {t("signInHint")}{" "}
                      <Link to={`/${lang}/register`} className={shop.textLink}>
                        {t("register")}
                      </Link>
                    </p>
                  ) : null}
                  <a href={telHref(phone)} className={`${shop.btnSecondary} ${shop.btnBlock}`}>
                    <Phone size={17} aria-hidden="true" />
                    {t("call")} {phone}
                  </a>
                </>
              ) : (
                <div className={styles.officeBox}>
                  <p className={styles.officeTitle}>{t("officeOnlyTitle")}</p>
                  <p className={styles.officeBody}>{t("officeOnlyBody")}</p>
                  <a href={telHref(phone)} className={`${shop.btnPrimary} ${shop.btnBlock} ${shop.btnLarge}`}>
                    <Phone size={18} aria-hidden="true" />
                    {t("call")} {phone}
                  </a>
                </div>
              )}
            </div>

            <AssuranceStrip t={t} stacked />
          </div>
        </section>

        <section className={styles.details}>
          {seva.description ? (
            <div className={styles.about}>
              <h2 className={shop.sectionTitle}>{t("aboutSeva")}</h2>
              <p>{seva.description}</p>
            </div>
          ) : null}

          {online ? (
            <div className={styles.how}>
              <h2 className={shop.sectionTitle}>{t("howItWorks")}</h2>
              <ol className={styles.steps}>
                <li>
                  <span className={styles.stepIcon}>
                    <UserRound size={18} aria-hidden="true" />
                  </span>
                  {t("howStep1")}
                </li>
                <li>
                  <span className={styles.stepIcon}>
                    <CalendarDays size={18} aria-hidden="true" />
                  </span>
                  {t("howStep2")}
                </li>
                <li>
                  <span className={styles.stepIcon}>
                    <WalletCards size={18} aria-hidden="true" />
                  </span>
                  {t("howStep3")}
                </li>
              </ol>
              <p className={styles.secureLine}>
                <ShieldCheck size={16} aria-hidden="true" />
                {t("payNote")}
              </p>
            </div>
          ) : null}
        </section>

        {related.length ? (
          <section className={styles.related}>
            <div className={styles.relatedHead}>
              <h2 className={shop.sectionTitle}>{t("moreSevas")}</h2>
              <Link to={`/${lang}/seva-booking`} className={shop.textLink}>
                {t("backToSevas")}
              </Link>
            </div>
            <div className={shop.grid}>
              {related.map((item) => (
                <SevaCard key={item.id} seva={item} lang={lang} t={t} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {online ? (
        <div className={styles.mobileBar}>
          <Price amount={seva.amount} t={t} />
          <Link to={checkoutPath} className={shop.btnPrimary}>
            {isAuthenticated ? t("bookNow") : t("signInToBook")}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
