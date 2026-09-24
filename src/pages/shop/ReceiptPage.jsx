import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import logoImg from "../../../assets/logo.png";
import shop from "./Shop.module.css";
import styles from "./Orders.module.css";
import { ErrorState, PaymentBadge } from "./ShopParts";
import { formatDate, formatPrice, gotraName, hasPrice, lookupName, paymentState, useBookings } from "./shopUtils";

export default function ReceiptPage() {
  const { bookingId } = useParams();
  const { t, lang } = useI18n("shop");
  const { t: tNav } = useI18n("navbar");
  const { t: tFooter } = useI18n("footer");
  const { token } = useAuth();
  const { bookings, status, retry } = useBookings(token, lang);
  const booking = bookings.find((item) => String(item.id) === String(bookingId));
  const backLink = (
    <Link to={`/${lang}/dashboard/bookings`} className={shop.btnSecondary}>
      <ArrowLeft size={17} aria-hidden="true" />
      {t("backToBookings")}
    </Link>
  );

  if (status === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("loadingOrders")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "error" || !booking) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <ErrorState
            title={status === "error" ? t("loadErrorTitle") : t("receiptNotFound")}
            body={status === "error" ? t("loadErrorBody") : ""}
            onRetry={status === "error" ? retry : undefined}
            t={t}
          >
            {backLink}
          </ErrorState>
        </div>
      </div>
    );
  }

  const paid = paymentState(booking.payment_status) === "paid";
  const profile = booking.bhakta_profile || {};
  const amount = booking.seva?.amount;
  const priced = hasPrice(amount);

  return (
    <div className={`${shop.shop} ${styles.receiptPage}`} lang={lang}>
      <div className={shop.narrow}>
        <div className={styles.receiptToolbar}>
          {backLink}
          <button type="button" className={shop.btnPrimary} onClick={() => window.print()}>
            <Printer size={17} aria-hidden="true" />
            {t("print")}
          </button>
        </div>

        <article className={styles.receipt}>
          <header className={styles.receiptHead}>
            <div className={styles.receiptBrand}>
              <img src={logoImg} alt="" width="56" height="56" />
              <div>
                <p className={styles.receiptOrg}>{tNav("brandTitle")}</p>
                <p className={styles.receiptAddr}>{tFooter("address")}</p>
                <p className={styles.receiptAddr}>+91 97415 85030 · info@anandavanaagadi.org</p>
              </div>
            </div>
            <div className={styles.receiptTitleBlock}>
              <h1 className={styles.receiptTitle}>{paid ? t("receiptTitle") : t("bookingSummaryTitle")}</h1>
              <PaymentBadge status={booking.payment_status} t={t} />
            </div>
          </header>

          <dl className={styles.receiptFacts}>
            <div>
              <dt>{t("receiptNo")}</dt>
              <dd className={styles.mono}>{booking.payment_order_id || `#${booking.id}`}</dd>
            </div>
            {booking.created_at ? (
              <div>
                <dt>{t("bookedOn")}</dt>
                <dd>{formatDate(booking.created_at, lang)}</dd>
              </div>
            ) : null}
            <div>
              <dt>{t("sevaDate")}</dt>
              <dd>{formatDate(booking.seva_date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>

          <section className={styles.receiptBlock}>
            <h2 className={styles.receiptLabel}>{t("devotee")}</h2>
            <p className={styles.receiptDevotee}>{profile.name || "—"}</p>
            <p className={styles.receiptDevoteeMeta}>
              {[
                gotraName(profile, lang) ? `${t("gotra")}: ${gotraName(profile, lang)}` : "",
                lookupName(profile.rashi, lang) ? `${t("rashi")}: ${lookupName(profile.rashi, lang)}` : "",
                lookupName(profile.nakshatra, lang) ? `${t("nakshatra")}: ${lookupName(profile.nakshatra, lang)}` : "",
                profile.charana ? `${t("charana")}: ${profile.charana}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </section>

          <table className={styles.lineItems}>
            <thead>
              <tr>
                <th scope="col">{t("item")}</th>
                <th scope="col">{t("sevaDate")}</th>
                <th scope="col" className={styles.num}>
                  {t("qty")}
                </th>
                <th scope="col" className={styles.num}>
                  {t("amount")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.lineName}>{booking.seva?.name || t("item")}</td>
                <td>{formatDate(booking.seva_date, lang)}</td>
                <td className={styles.num}>1</td>
                <td className={styles.num}>{priced ? formatPrice(amount) : t("priceOnRequest")}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan={3}>
                  {t("total")}
                </th>
                <td className={styles.num}>{priced ? formatPrice(amount) : "—"}</td>
              </tr>
            </tfoot>
          </table>

          <dl className={styles.receiptFacts}>
            <div>
              <dt>{t("paymentStatus")}</dt>
              <dd>
                <PaymentBadge status={booking.payment_status} t={t} />
              </dd>
            </div>
            {booking.payment_reference ? (
              <div>
                <dt>{t("paymentRef")}</dt>
                <dd className={styles.mono}>{booking.payment_reference}</dd>
              </div>
            ) : null}
          </dl>

          <p className={styles.receiptFooter}>{t("receiptFooter")}</p>
        </article>
      </div>
    </div>
  );
}
