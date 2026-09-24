import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Loader2, Receipt, RotateCw, ShoppingBag, UserRound } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Orders.module.css";
import { ErrorState, PaymentBadge, Price } from "./ShopParts";
import AccountLayout from "./AccountLayout";
import { formatDate, sevaImage, toISODate, useBookings } from "./shopUtils";

const TABS = ["all", "upcoming", "past"];

export default function OrdersPage() {
  const { t, lang } = useI18n("shop");
  const { token } = useAuth();
  const { bookings, status, retry } = useBookings(token, lang);
  const [tab, setTab] = useState("all");
  const today = toISODate(new Date());

  const groups = useMemo(() => {
    const byDateDesc = [...bookings].sort((a, b) => String(b.seva_date).localeCompare(String(a.seva_date)));
    return {
      all: byDateDesc,
      upcoming: byDateDesc.filter((booking) => String(booking.seva_date) >= today).reverse(),
      past: byDateDesc.filter((booking) => String(booking.seva_date) < today),
    };
  }, [bookings, today]);

  const tabLabel = { all: t("tabAll"), upcoming: t("tabUpcoming"), past: t("tabPast") };
  const list = groups[tab];

  return (
    <AccountLayout crumb={t("ordersTitle")}>
      <div>
        <header className={styles.ordersHeader}>
          <div>
            <h1 className={shop.pageTitle}>{t("ordersTitle")}</h1>
            <p className={shop.pageIntro}>{t("ordersIntro")}</p>
          </div>
          <Link to={`/${lang}/seva-booking`} className={shop.btnPrimary}>
            {t("bookAnother")}
          </Link>
        </header>

        <div className={styles.tabs} role="tablist" aria-label={t("ordersTitle")}>
          {TABS.map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              className={`${styles.tab} ${tab === key ? styles.tabActive : ""}`}
              onClick={() => setTab(key)}
            >
              {tabLabel[key]}
              {status === "ready" ? <span className={styles.tabCount}>{groups[key].length}</span> : null}
            </button>
          ))}
        </div>

        {status === "loading" ? (
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("loadingOrders")}</p>
          </div>
        ) : null}

        {status === "error" ? <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={retry} t={t} /> : null}

        {status === "ready" && list.length === 0 ? (
          <div className={shop.stateBox}>
            <span className={shop.stateIcon}>
              <ShoppingBag size={22} aria-hidden="true" />
            </span>
            <p className={shop.stateTitle}>{bookings.length ? t("ordersEmptyFiltered") : t("ordersEmptyTitle")}</p>
            {!bookings.length ? <p className={shop.stateBody}>{t("ordersEmptyBody")}</p> : null}
            <div className={shop.stateActions}>
              <Link to={`/${lang}/seva-booking`} className={shop.btnPrimary}>
                {t("browseSevas")}
              </Link>
            </div>
          </div>
        ) : null}

        {status === "ready" && list.length > 0 ? (
          <ul className={styles.orderList}>
            {list.map((booking) => {
              const sevaId = booking.seva?.id || booking.seva_id;
              return (
                <li key={booking.id} className={`${shop.panel} ${styles.order}`}>
                  <img className={styles.orderThumb} src={sevaImage({ id: sevaId, ...booking.seva })} alt="" width="120" height="90" loading="lazy" />
                  <div className={styles.orderMain}>
                    <div className={styles.orderTop}>
                      <p className={styles.orderName}>{booking.seva?.name || t("item")}</p>
                      <PaymentBadge status={booking.payment_status} t={t} />
                    </div>
                    <dl className={styles.orderMeta}>
                      <div>
                        <dt>
                          <UserRound size={15} aria-hidden="true" />
                          <span className={styles.srOnly}>{t("bookedFor")}</span>
                        </dt>
                        <dd>{booking.bhakta_profile?.name || "—"}</dd>
                      </div>
                      <div>
                        <dt>
                          <CalendarDays size={15} aria-hidden="true" />
                          <span className={styles.srOnly}>{t("sevaDate")}</span>
                        </dt>
                        <dd>{formatDate(booking.seva_date, lang, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) || "—"}</dd>
                      </div>
                      {booking.payment_order_id ? (
                        <div>
                          <dt>{t("reference")}</dt>
                          <dd className={styles.mono}>{booking.payment_order_id}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>
                  <div className={styles.orderSide}>
                    <Price amount={booking.seva?.amount} t={t} />
                    <div className={styles.orderActions}>
                      <Link to={`/${lang}/dashboard/bookings/${booking.id}`} className={shop.btnSecondary}>
                        <Receipt size={16} aria-hidden="true" />
                        {t("viewReceipt")}
                      </Link>
                      {sevaId ? (
                        <Link to={`/${lang}/seva/${sevaId}`} className={shop.btnGhost}>
                          <RotateCw size={15} aria-hidden="true" />
                          {t("bookAgain")}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </AccountLayout>
  );
}
