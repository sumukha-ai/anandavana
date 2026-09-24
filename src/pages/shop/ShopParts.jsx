import { Link } from "react-router-dom";
import { AlertCircle, ChevronRight, HeartHandshake, PhoneCall, RotateCcw, ShieldCheck } from "lucide-react";
import styles from "./Shop.module.css";
import { formatPrice, hasPrice, isBookableOnline, paymentState, sevaImage } from "./shopUtils";

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.breadcrumbs}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className={styles.breadcrumbs}>
              {isLast || !item.to ? (
                <span aria-current={isLast ? "page" : undefined}>{item.label}</span>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
              {!isLast ? <ChevronRight size={14} aria-hidden="true" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function AvailabilityBadge({ seva, t, className = "" }) {
  const online = isBookableOnline(seva);
  return (
    <span className={`${styles.badge} ${online ? styles.badgeOnline : styles.badgeOffice} ${className}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {online ? t("badgeOnline") : t("badgeOffice")}
    </span>
  );
}

export function PaymentBadge({ status, t }) {
  const state = paymentState(status);
  const className = { paid: styles.badgePaid, pending: styles.badgePending, failed: styles.badgeFailed }[state];
  const label = { paid: t("statusPaid"), pending: t("statusPending"), failed: t("statusFailed") }[state];
  return (
    <span className={`${styles.badge} ${className}`}>
      <span className={styles.badgeDot} aria-hidden="true" />
      {label}
    </span>
  );
}

export function Price({ amount, t, className = "" }) {
  return hasPrice(amount) ? (
    <span className={`${styles.price} ${className}`}>{formatPrice(amount)}</span>
  ) : (
    <span className={styles.priceMuted}>{t("priceOnRequest")}</span>
  );
}

export function SevaCard({ seva, lang, t }) {
  const online = isBookableOnline(seva);
  const detailPath = `/${lang}/seva/${seva.id}`;

  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        <img src={sevaImage(seva)} alt="" loading="lazy" width="1200" height="900" />
        <AvailabilityBadge seva={seva} t={t} className={styles.cardBadge} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>
          <Link to={detailPath}>{seva.name}</Link>
        </h3>
        {seva.description ? <p className={styles.cardText}>{seva.description}</p> : null}
        <div className={styles.cardFooter}>
          <Price amount={seva.amount} t={t} />
          {online ? (
            <Link to={`/${lang}/checkout/${seva.id}`} className={`${styles.btnPrimary} ${styles.cardAction}`}>
              {t("bookNow")}
            </Link>
          ) : (
            <Link to={detailPath} className={`${styles.btnSecondary} ${styles.cardAction}`}>
              {t("viewDetails")}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function SevaCardSkeleton() {
  return (
    <div className={styles.skeletonCard} aria-hidden="true">
      <div className={`${styles.skeleton} ${styles.skeletonMedia}`} />
      <div className={styles.skeletonLines}>
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{ width: "62%" }} />
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{ width: "80%" }} />
        <div className={`${styles.skeleton} ${styles.skeletonLine}`} style={{ width: "34%", height: "1.4rem", marginTop: "0.6rem" }} />
      </div>
    </div>
  );
}

export function AssuranceStrip({ t, stacked = false }) {
  return (
    <div className={`${styles.assurance} ${stacked ? styles.assuranceStack : ""}`}>
      <div className={styles.assuranceItem}>
        <ShieldCheck size={20} aria-hidden="true" />
        <div>
          <strong>{t("assurePaymentTitle")}</strong>
          <span>{t("assurePaymentBody")}</span>
        </div>
      </div>
      <div className={styles.assuranceItem}>
        <HeartHandshake size={20} aria-hidden="true" />
        <div>
          <strong>{t("assureFamilyTitle")}</strong>
          <span>{t("assureFamilyBody")}</span>
        </div>
      </div>
      <div className={styles.assuranceItem}>
        <PhoneCall size={20} aria-hidden="true" />
        <div>
          <strong>{t("assureHelpTitle")}</strong>
          <span>{t("assureHelpBody")}</span>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ title, body, onRetry, t, children }) {
  return (
    <div className={styles.stateBox} role="alert">
      <span className={styles.stateIcon}>
        <AlertCircle size={22} aria-hidden="true" />
      </span>
      <p className={styles.stateTitle}>{title}</p>
      <p className={styles.stateBody}>{body}</p>
      <div className={styles.stateActions}>
        {onRetry ? (
          <button type="button" className={styles.btnPrimary} onClick={onRetry}>
            <RotateCcw size={17} aria-hidden="true" />
            {t("retry")}
          </button>
        ) : null}
        {children}
      </div>
    </div>
  );
}
