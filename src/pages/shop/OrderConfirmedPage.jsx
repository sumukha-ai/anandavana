import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, RotateCw } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Orders.module.css";
import { ErrorState, PaymentBadge, Price } from "./ShopParts";
import { formatDate, sevaImage } from "./shopUtils";
import { collectPayment } from "./cashfree";

// Right after checkout the gateway can take a few seconds to confirm; look again once before settling
const RECHECK_DELAY_MS = 4000;

export default function OrderConfirmedPage() {
  const { t, lang } = useI18n("shop");
  const { token } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [params] = useSearchParams();
  // Cashfree's return URL carries order_id; checkout in the popup also passes it in router state
  const orderId = params.get("order_id") || state?.reference || "";
  const outcome = state?.outcome;

  const [booking, setBooking] = useState(null);
  const [livePayments, setLivePayments] = useState(true);
  const [status, setStatus] = useState("loading");
  const [checking, setChecking] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const fetchBooking = useCallback(
    () => apiRequest(`/booked_sevas/order/${encodeURIComponent(orderId)}`, { token, lang }),
    [orderId, token, lang],
  );

  const show = (data) => {
    setBooking(data.booking);
    setLivePayments(Boolean(data.live_payments));
    setStatus("ready");
  };

  useEffect(() => {
    if (!orderId) return undefined;
    let active = true;
    let timer;
    async function load() {
      try {
        const data = await fetchBooking();
        if (!active) return;
        setBooking(data.booking);
        setLivePayments(Boolean(data.live_payments));
        setStatus("ready");
        // Back from checkout (popup finished, or Cashfree's redirect with no router state): the webhook may lag
        const justPaid = outcome === "paid" || !outcome;
        if (data.live_payments && data.booking?.payment_status === "pending" && justPaid) {
          timer = window.setTimeout(async () => {
            try {
              const again = await fetchBooking();
              if (active) setBooking(again.booking);
            } catch {
              /* keep showing what we have */
            }
          }, RECHECK_DELAY_MS);
        }
      } catch (err) {
        if (active) setStatus(err?.status === 404 ? "missing" : "error");
      }
    }
    load();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [fetchBooking, orderId, outcome]);

  if (!orderId) {
    return <Navigate to={`/${lang}/dashboard/bookings`} replace />;
  }

  const checkAgain = async () => {
    setChecking(true);
    try {
      show(await fetchBooking());
    } catch {
      if (!booking) setStatus("error");
    } finally {
      setChecking(false);
    }
  };

  const payNow = async () => {
    setPayError("");
    setPaying(true);
    let data;
    try {
      data = await apiRequest(`/booked_sevas/${booking.id}/pay`, { method: "POST", token, lang });
    } catch (err) {
      setPaying(false);
      setPayError(err?.message || t("payStartError"));
      return;
    }

    let result;
    try {
      result = await collectPayment(data?.payment);
    } catch {
      result = "cancelled";
    }
    if (result === "redirect") return;
    setPaying(false);

    const nextOrderId = data?.payment?.order_id;
    if (nextOrderId && nextOrderId !== orderId) {
      // An expired order was replaced; follow the new one
      navigate(`/${lang}/checkout/confirmed?order_id=${encodeURIComponent(nextOrderId)}`, { replace: true, state: { outcome: result } });
      return;
    }
    await checkAgain();
  };

  if (status === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("checkingPayment")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "ready" || !booking) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <ErrorState
            title={status === "missing" ? t("bookingNotFound") : t("loadErrorTitle")}
            body={t("loadErrorBody")}
            onRetry={status === "missing" ? undefined : checkAgain}
            t={t}
          >
            <Link to={`/${lang}/dashboard/bookings`} className={shop.btnSecondary}>
              {t("viewBookings")}
            </Link>
          </ErrorState>
        </div>
      </div>
    );
  }

  const paid = booking.payment_status === "paid";
  const failed = booking.payment_status === "failed";
  const canPay = !paid && livePayments;
  const sevaId = booking.seva?.id || booking.seva_id;

  const title = paid ? t("confirmedTitle") : failed ? t("failedTitle") : livePayments ? t("awaitingTitle") : t("receivedTitle");
  const body = paid ? t("confirmedBody") : failed ? t("failedBody") : livePayments ? t("awaitingBody") : t("confirmedBody");
  const Icon = paid ? CheckCircle2 : failed ? AlertTriangle : Clock3;

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.narrow}>
        <section className={styles.confirm}>
          <span className={`${styles.confirmIcon} ${paid ? "" : styles.confirmIconWarn}`}>
            <Icon size={30} aria-hidden="true" />
          </span>
          <h1 className={shop.pageTitle}>{title}</h1>
          <p className={styles.confirmBody}>{body}</p>

          <div className={styles.referenceBox}>
            <span>{t("bookingReference")}</span>
            <strong>{booking.payment_order_id}</strong>
          </div>
        </section>

        <section className={`${shop.panel} ${styles.confirmCard}`}>
          <div className={styles.confirmItem}>
            <img src={sevaImage({ id: sevaId, ...booking.seva })} alt="" width="120" height="90" />
            <div>
              <p className={styles.orderName}>{booking.seva?.name || t("item")}</p>
              <PaymentBadge status={booking.payment_status} t={t} />
            </div>
            <Price amount={booking.amount ?? booking.seva?.amount} t={t} />
          </div>
          <dl className={styles.facts}>
            <div>
              <dt>{t("bookedFor")}</dt>
              <dd>{booking.bhakta_profile?.name || "—"}</dd>
            </div>
            <div>
              <dt>{t("sevaDate")}</dt>
              <dd>{formatDate(booking.seva_date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
            </div>
          </dl>
          {!paid && livePayments && outcome === "cancelled" ? <p className={styles.noteWarn}>{t("paymentCancelled")}</p> : null}
          {!paid && !failed && livePayments && outcome !== "cancelled" ? <p className={styles.noteWarn}>{t("confirmingNote")}</p> : null}
          {!paid && !livePayments ? <p className={styles.noteWarn}>{t("testModeNote")}</p> : null}
          {payError ? (
            <p className={styles.noteWarn} role="alert">
              {payError}
            </p>
          ) : null}
        </section>

        <div className={styles.confirmActions}>
          {canPay ? (
            <button type="button" className={`${shop.btnPrimary} ${shop.btnLarge}`} onClick={payNow} disabled={paying || checking}>
              {paying ? <Loader2 size={16} aria-hidden="true" className={shop.spin} /> : null}
              {t("payNow")}
            </button>
          ) : null}
          {canPay ? (
            <button type="button" className={`${shop.btnSecondary} ${shop.btnLarge}`} onClick={checkAgain} disabled={paying || checking}>
              <RotateCw size={16} aria-hidden="true" className={checking ? shop.spin : undefined} />
              {t("checkAgain")}
            </button>
          ) : null}
          <Link to={`/${lang}/dashboard/bookings`} className={`${canPay ? shop.btnGhost : shop.btnPrimary} ${shop.btnLarge}`}>
            {t("viewBookings")}
          </Link>
          {paid || !livePayments ? (
            <Link to={`/${lang}/seva-booking`} className={`${shop.btnSecondary} ${shop.btnLarge}`}>
              {t("bookAnother")}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
