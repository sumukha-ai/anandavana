import { useI18n } from "../../i18n/useI18n";
import logoImg from "../../../assets/logo.png";
import orders from "../shop/Orders.module.css";
import checkout from "../shop/Checkout.module.css";
import { PaymentBadge } from "../shop/ShopParts";
import { OFFICE_PHONE, formatDate, formatPrice, interpolate } from "../shop/shopUtils";
import styles from "./Donate.module.css";
import { CASH_LIMIT_80G, donationFinancialYear, eligibility80G } from "./taxExemption";

// The donation receipt a bhakta sees after giving; staff see the same sheet from Finance
export default function DonationReceipt({ donation, trust, livePayments = true }) {
  const { t, lang } = useI18n("donate");
  const { t: tNav } = useI18n("navbar");
  const { t: tFooter } = useI18n("footer");

  const paid = donation.payment_status === "paid";
  const receiptDate = donation.donated_on || donation.created_at;
  const channel = t(`channels.${donation.channel}`, donation.channel);
  const taxStatus = paid ? eligibility80G(donation, trust) : null;
  const tax = trust?.tax_80g;
  const financialYear = donationFinancialYear(receiptDate);
  const taxNote = {
    eligible: financialYear ? interpolate(t("tax80gEligible"), { year: financialYear.label, due: formatDate(financialYear.form10beDue, lang) }) : "",
    "no-pan": interpolate(t("tax80gNoPan"), { phone: OFFICE_PHONE, due: financialYear ? formatDate(financialYear.form10beDue, lang) : "" }),
    "cash-over-limit": interpolate(t("tax80gCashLimit"), { limit: formatPrice(CASH_LIMIT_80G) }),
    "outside-validity": t("tax80gOutsideValidity"),
  }[taxStatus];

  return (
    <article className={orders.receipt}>
      <header className={orders.receiptHead}>
        <div className={orders.receiptBrand}>
          <img src={logoImg} alt="" width="56" height="56" />
          <div>
            <p className={orders.receiptOrg}>{trust?.name || tNav("brandTitle")}</p>
            <p className={orders.receiptAddr}>{trust?.address || tFooter("address")}</p>
            <p className={orders.receiptAddr}>{[trust?.phone || OFFICE_PHONE, trust?.email || "shreekshethraanandavana@gmail.com"].filter(Boolean).join(" · ")}</p>
          </div>
        </div>
        <div className={orders.receiptTitleBlock}>
          <h2 className={orders.receiptTitle}>{paid ? t("receiptTitle") : t("acknowledgementTitle")}</h2>
          <PaymentBadge status={donation.payment_status} t={t} />
        </div>
      </header>

      <dl className={orders.receiptFacts}>
        <div>
          <dt>{paid ? t("receiptNo") : t("orderRef")}</dt>
          <dd className={orders.mono}>{donation.receipt_number || donation.payment_order_id}</dd>
        </div>
        {receiptDate ? (
          <div>
            <dt>{t("date")}</dt>
            <dd>{formatDate(receiptDate, lang)}</dd>
          </div>
        ) : null}
        <div>
          <dt>{t("paymentMode")}</dt>
          <dd>{channel}</dd>
        </div>
      </dl>

      <section className={orders.receiptBlock}>
        <h3 className={orders.receiptLabel}>{t("donor")}</h3>
        <p className={orders.receiptDevotee}>{donation.donor_name}</p>
        <p className={orders.receiptDevoteeMeta}>
          {[donation.pan ? `${t("pan")}: ${donation.pan}` : "", donation.is_anonymous ? t("nameHidden") : ""].filter(Boolean).join(" · ")}
        </p>
      </section>

      <table className={orders.lineItems}>
        <thead>
          <tr>
            <th scope="col">{t("cause")}</th>
            <th scope="col" className={orders.num}>
              {t("amount")}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={orders.lineName}>
              {donation.fund?.name || "—"}
              {donation.dedication ? <span className={styles.summaryDedication}> · {donation.dedication}</span> : null}
            </td>
            <td className={orders.num}>{formatPrice(donation.amount)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">{t("total")}</th>
            <td className={orders.num}>{formatPrice(donation.amount)}</td>
          </tr>
        </tfoot>
      </table>

      <dl className={orders.receiptFacts}>
        <div>
          <dt>{t("paymentStatus")}</dt>
          <dd>
            <PaymentBadge status={donation.payment_status} t={t} />
          </dd>
        </div>
        {donation.payment_reference ? (
          <div>
            <dt>{t("paymentRef")}</dt>
            <dd className={orders.mono}>{donation.payment_reference}</dd>
          </div>
        ) : null}
      </dl>

      {taxStatus ? (
        <section className={orders.receiptBlock}>
          <h3 className={orders.receiptLabel}>{t("tax80gTitle")}</h3>
          <dl className={orders.receiptFacts}>
            <div>
              <dt>{t("trustPan")}</dt>
              <dd className={orders.mono}>{trust.pan}</dd>
            </div>
            <div>
              <dt>{t("registration80g")}</dt>
              <dd className={orders.mono}>{tax.registration_number}</dd>
            </div>
            {tax.valid_from || tax.valid_until ? (
              <div>
                <dt>{t("validity80g")}</dt>
                <dd>{[tax.valid_from ? formatDate(tax.valid_from, lang) : "", tax.valid_until ? formatDate(tax.valid_until, lang) : ""].join(" – ")}</dd>
              </div>
            ) : null}
          </dl>
          {taxNote ? <p className={taxStatus === "eligible" ? styles.taxNote : `${checkout.testNote} ${styles.taxNoteWarn}`}>{taxNote}</p> : null}
        </section>
      ) : null}

      {!paid && !livePayments ? <p className={checkout.testNote}>{t("testModeNote")}</p> : null}
      {paid && trust?.receipt_signatory ? (
        <p className={styles.signatory}>
          {trust.receipt_signatory}
          {trust.receipt_signatory_title ? <span>{trust.receipt_signatory_title}</span> : null}
        </p>
      ) : null}
      <p className={orders.receiptFooter}>{trust?.receipt_footer || t("receiptFooter")}</p>
    </article>
  );
}
