import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HandHeart, Loader2, Receipt } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "../shop/Shop.module.css";
import orders from "../shop/Orders.module.css";
import AccountLayout from "../shop/AccountLayout";
import { ErrorState, PaymentBadge } from "../shop/ShopParts";
import { formatDate, formatPrice } from "../shop/shopUtils";
import styles from "./Donate.module.css";

export default function MyDonationsPage() {
  const { t, lang } = useI18n("donate");
  const { token } = useAuth();
  const [donations, setDonations] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/my/donations", { token, lang })
      .then((data) => {
        if (!active) return;
        setDonations(data.donations || []);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [token, lang, attempt]);

  const received = donations.filter((item) => item.payment_status === "paid").reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const donateLink = (
    <Link to={`/${lang}/donate`} className={shop.btnPrimary}>
      {t("donateNow")}
    </Link>
  );

  return (
    <AccountLayout crumb={t("myTitle")}>
      <div>
        <header className={orders.ordersHeader}>
          <div>
            <h1 className={shop.pageTitle}>{t("myTitle")}</h1>
            <p className={shop.pageIntro}>{t("myIntro")}</p>
          </div>
          {donateLink}
        </header>

        {status === "loading" ? (
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("loadingMine")}</p>
          </div>
        ) : null}

        {status === "error" ? <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }} t={t} /> : null}

        {status === "ready" && !donations.length ? (
          <div className={shop.stateBox}>
            <span className={shop.stateIcon}>
              <HandHeart size={22} aria-hidden="true" />
            </span>
            <p className={shop.stateTitle}>{t("myEmptyTitle")}</p>
            <p className={shop.stateBody}>{t("myEmptyBody")}</p>
            <div className={shop.stateActions}>{donateLink}</div>
          </div>
        ) : null}

        {status === "ready" && donations.length ? (
          <>
            {received > 0 ? (
              <div className={`${shop.panel} ${styles.totalStrip}`}>
                <span>{t("myTotal")}</span>
                <strong>{formatPrice(received)}</strong>
              </div>
            ) : null}
            <ul className={styles.list}>
              {donations.map((donation) => (
                <li key={donation.id} className={`${shop.panel} ${styles.item}`}>
                  <div className={styles.itemMain}>
                    <div className={styles.itemTop}>
                      <span className={styles.itemName}>{donation.fund?.name || t("title")}</span>
                      <PaymentBadge status={donation.payment_status} t={t} />
                    </div>
                    <div className={styles.itemMeta}>
                      <span>{formatDate(donation.donated_on || donation.created_at, lang, { day: "numeric", month: "short", year: "numeric" })}</span>
                      {donation.receipt_number ? <span className={orders.mono}>{donation.receipt_number}</span> : null}
                      {donation.dedication ? <span>{donation.dedication}</span> : null}
                    </div>
                  </div>
                  <div className={styles.itemSide}>
                    <span className={styles.itemAmount}>{formatPrice(donation.amount)}</span>
                    {donation.payment_order_id ? (
                      <Link to={`/${lang}/donate/receipt/${donation.payment_order_id}`} className={shop.btnSecondary}>
                        <Receipt size={16} aria-hidden="true" />
                        {t("viewReceipt")}
                      </Link>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </AccountLayout>
  );
}
