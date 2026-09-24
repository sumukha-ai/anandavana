import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Orders.module.css";
import { PaymentBadge, Price } from "./ShopParts";
import { formatDate, sevaImage } from "./shopUtils";
import { isOnlinePaymentEnabled } from "./cashfree";

export default function OrderConfirmedPage() {
  const { t, lang } = useI18n("shop");
  const { state } = useLocation();

  if (!state?.sevaName) {
    return <Navigate to={`/${lang}/dashboard/bookings`} replace />;
  }

  const paid = state.outcome === "paid";
  const cancelled = state.outcome === "cancelled";

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.narrow}>
        <section className={styles.confirm}>
          <span className={`${styles.confirmIcon} ${cancelled ? styles.confirmIconWarn : ""}`}>
            {cancelled ? <AlertTriangle size={30} aria-hidden="true" /> : <CheckCircle2 size={32} aria-hidden="true" />}
          </span>
          <h1 className={shop.pageTitle}>{paid ? t("confirmedTitle") : t("receivedTitle")}</h1>
          <p className={styles.confirmBody}>{t("confirmedBody")}</p>

          {state.reference ? (
            <div className={styles.referenceBox}>
              <span>{t("bookingReference")}</span>
              <strong>{state.reference}</strong>
            </div>
          ) : null}
        </section>

        <section className={`${shop.panel} ${styles.confirmCard}`}>
          <div className={styles.confirmItem}>
            <img src={sevaImage({ id: state.sevaId })} alt="" width="120" height="90" />
            <div>
              <p className={styles.orderName}>{state.sevaName}</p>
              <PaymentBadge status={paid ? "paid" : "pending"} t={t} />
            </div>
            <Price amount={state.amount} t={t} />
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>{t("bookedFor")}</dt>
              <dd>{state.devotee}</dd>
            </div>
            <div>
              <dt>{t("sevaDate")}</dt>
              <dd>{formatDate(state.sevaDate, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>
          {cancelled ? <p className={styles.noteWarn}>{t("paymentCancelled")}</p> : null}
          {!paid && !cancelled && !isOnlinePaymentEnabled() ? <p className={styles.noteWarn}>{t("testModeNote")}</p> : null}
        </section>

        <div className={styles.confirmActions}>
          <Link to={`/${lang}/dashboard/bookings`} className={`${shop.btnPrimary} ${shop.btnLarge}`}>
            {t("viewBookings")}
          </Link>
          <Link to={`/${lang}/seva-booking`} className={`${shop.btnSecondary} ${shop.btnLarge}`}>
            {t("bookAnother")}
          </Link>
        </div>
      </div>
    </div>
  );
}
