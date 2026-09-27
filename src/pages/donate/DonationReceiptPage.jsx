import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Clock3, Loader2, Printer, RotateCw } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useI18n } from "../../i18n/useI18n";
import shop from "../shop/Shop.module.css";
import orders from "../shop/Orders.module.css";
import { ErrorState } from "../shop/ShopParts";
import { OFFICE_PHONE } from "../shop/shopUtils";
import DonationReceipt from "./DonationReceipt";
import styles from "./Donate.module.css";
import { useTrust } from "./taxExemption";

// Right after checkout the gateway can take a few seconds to confirm; look again once before settling
const RECHECK_DELAY_MS = 4000;

function StatusHeader({ icon: Icon, tone, title, body, children }) {
  const toneClass = tone === "warn" ? styles.statusIconWarn : tone === "danger" ? styles.statusIconDanger : "";
  return (
    <section className={styles.statusBox}>
      <span className={`${styles.statusIcon} ${toneClass}`}>
        <Icon size={30} aria-hidden="true" />
      </span>
      <h1 className={shop.pageTitle}>{title}</h1>
      <p className={styles.statusBody}>{body}</p>
      {children ? <div className={styles.statusActions}>{children}</div> : null}
    </section>
  );
}

export default function DonationReceiptPage() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const { t, lang } = useI18n("donate");
  const [donation, setDonation] = useState(null);
  const [livePayments, setLivePayments] = useState(true);
  const [status, setStatus] = useState("loading");
  const [checking, setChecking] = useState(false);
  const outcome = state?.outcome;
  const trust = useTrust(lang);

  const fetchDonation = useCallback(() => apiRequest(`/donations/order/${encodeURIComponent(orderId)}`, { lang }), [orderId, lang]);

  const show = (data) => {
    setDonation(data.donation);
    setLivePayments(Boolean(data.live_payments));
    setStatus("ready");
  };

  useEffect(() => {
    let active = true;
    let timer;
    async function load() {
      try {
        const data = await fetchDonation();
        if (!active) return;
        setDonation(data.donation);
        setLivePayments(Boolean(data.live_payments));
        setStatus("ready");
        if (data.donation?.payment_status === "pending" && outcome === "paid") {
          timer = window.setTimeout(async () => {
            try {
              const again = await fetchDonation();
              if (active) setDonation(again.donation);
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
  }, [fetchDonation, outcome]);

  const checkAgain = async () => {
    setChecking(true);
    try {
      show(await fetchDonation());
    } catch (err) {
      if (!donation) setStatus(err?.status === 404 ? "missing" : "error");
    } finally {
      setChecking(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("receiptLoading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "ready" || !donation) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <ErrorState
            title={status === "missing" ? t("receiptNotFound") : t("loadErrorTitle")}
            body={status === "missing" ? t("receiptNotFoundBody") : t("loadErrorBody")}
            onRetry={status === "missing" ? undefined : checkAgain}
            t={t}
          >
            <Link to={`/${lang}/donate`} className={shop.btnSecondary}>
              {t("giveAgain")}
            </Link>
          </ErrorState>
        </div>
      </div>
    );
  }

  const paid = donation.payment_status === "paid";
  const retryPath = `/${lang}/donate${donation.fund?.id ? `?fund=${donation.fund.id}` : ""}`;
  const tryAgain = (
    <Link to={retryPath} className={shop.btnPrimary}>
      {t("tryAgain")}
    </Link>
  );

  let header;
  if (paid) {
    header = <StatusHeader icon={CheckCircle2} title={t("thankTitle")} body={t("thankBody")} />;
  } else if (donation.payment_status === "cancelled") {
    header = <StatusHeader icon={AlertTriangle} tone="danger" title={t("voidTitle")} body={`${t("voidBody")} ${OFFICE_PHONE}`} />;
  } else if (donation.payment_status === "failed") {
    header = (
      <StatusHeader icon={AlertTriangle} tone="danger" title={t("failedTitle")} body={t("failedBody")}>
        {tryAgain}
      </StatusHeader>
    );
  } else if (outcome === "cancelled") {
    header = (
      <StatusHeader icon={AlertTriangle} tone="warn" title={t("cancelledTitle")} body={t("cancelledBody")}>
        {tryAgain}
      </StatusHeader>
    );
  } else {
    header = (
      <StatusHeader icon={Clock3} tone="warn" title={t("pendingTitle")} body={livePayments ? t("pendingBody") : t("pendingTestBody")}>
        {livePayments ? (
          <button type="button" className={shop.btnSecondary} onClick={checkAgain} disabled={checking}>
            {checking ? <Loader2 size={16} aria-hidden="true" className={shop.spin} /> : <RotateCw size={16} aria-hidden="true" />}
            {checking ? t("checking") : t("checkAgain")}
          </button>
        ) : null}
      </StatusHeader>
    );
  }

  return (
    <div className={`${shop.shop} ${orders.receiptPage}`} lang={lang}>
      <div className={shop.narrow}>
        <div className={styles.noPrint}>{header}</div>

        <DonationReceipt donation={donation} trust={trust} livePayments={livePayments} />

        <div className={`${orders.confirmActions} ${styles.noPrint}`}>
          {paid ? (
            <button type="button" className={shop.btnPrimary} onClick={() => window.print()}>
              <Printer size={17} aria-hidden="true" />
              {t("print")}
            </button>
          ) : null}
          <Link to={`/${lang}/donate`} className={shop.btnSecondary}>
            {t("giveAgain")}
          </Link>
        </div>
      </div>
    </div>
  );
}
