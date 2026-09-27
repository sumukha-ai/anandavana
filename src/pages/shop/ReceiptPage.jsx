import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Orders.module.css";
import SevaReceipt from "./SevaReceipt";
import { ErrorState } from "./ShopParts";
import { useBookings } from "./shopUtils";

export default function ReceiptPage() {
  const { bookingId } = useParams();
  const { t, lang } = useI18n("shop");
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

        <SevaReceipt booking={booking} />
      </div>
    </div>
  );
}
