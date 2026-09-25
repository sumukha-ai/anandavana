import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { HandHeart, Loader2, Lock, ShieldCheck } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "../shop/Shop.module.css";
import checkout from "../shop/Checkout.module.css";
import { Breadcrumbs, ErrorState } from "../shop/ShopParts";
import { OFFICE_PHONE, OFFICE_TEL, formatPrice, interpolate } from "../shop/shopUtils";
import { collectPayment, useLivePayments } from "../shop/cashfree";
import styles from "./Donate.module.css";

const MAX_AMOUNT = 10000000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const emptyDonor = { donor_name: "", donor_email: "", donor_phone: "", donor_address: "", pan: "", dedication: "", message: "", is_anonymous: false };

function phoneDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function validate(form, t) {
  const errors = {};
  if (!form.fundId) errors.fund = t("errorCause");
  const amount = Number(form.amount);
  if (!(amount >= 1)) errors.amount = t("errorAmount");
  else if (amount > MAX_AMOUNT) errors.amount = t("errorAmountMax");
  if (form.donor_name.trim().length < 2) errors.donor_name = t("errorName");
  if (!EMAIL_PATTERN.test(form.donor_email.trim())) errors.donor_email = t("errorEmail");
  if (phoneDigits(form.donor_phone).length < 10) errors.donor_phone = t("errorPhone");
  if (form.pan && !PAN_PATTERN.test(form.pan)) errors.pan = t("errorPan");
  return errors;
}

function Field({ id, label, optional, hint, error, wide, children }) {
  return (
    <div className={`${styles.field} ${wide ? styles.fieldWide : ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional ? <em>{optional}</em> : null}
      </label>
      {children}
      {error ? (
        <span id={`${id}-error`} className={styles.fieldError}>
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} className={styles.hint}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

export default function DonatePage() {
  const { t, lang } = useI18n("donate");
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [funds, setFunds] = useState([]);
  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [fundId, setFundId] = useState(searchParams.get("fund") || "");
  const [chip, setChip] = useState(null);
  const [customText, setCustomText] = useState("");
  const [customAmount, setCustomAmount] = useState(false);
  const [donor, setDonor] = useState(emptyDonor);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef(null);
  const livePayments = useLivePayments();

  useEffect(() => {
    let active = true;
    apiRequest("/donation-funds", { lang })
      .then((data) => {
        if (!active) return;
        setFunds(data.funds || []);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [lang, attempt]);

  // Fill in what we already know about a signed-in devotee, without overwriting what they typed
  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    const fill = (values) =>
      setDonor((current) => {
        const next = { ...current };
        Object.entries(values).forEach(([key, value]) => {
          if (value && !current[key]) next[key] = value;
        });
        return next;
      });
    fill({ donor_email: user?.email || "" });
    apiRequest("/bhakta/profile", { token })
      .then((data) => {
        const profile = data?.profile;
        if (!active || !profile) return;
        fill({ donor_name: profile.name, donor_email: profile.email, donor_phone: profile.phone_number, donor_address: profile.address });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [token, user?.email]);

  // The chosen cause, else the first one (also covers an unknown ?fund= id)
  const fund = funds.find((item) => String(item.id) === String(fundId)) || funds[0] || null;
  const suggested = useMemo(() => fund?.suggested_amounts || [], [fund]);
  const typing = customAmount || !suggested.length;
  // Until the devotee picks, offer the second suggested amount of the chosen cause
  const chipAmount = suggested.includes(chip) ? chip : suggested[Math.min(1, suggested.length - 1)];
  const amount = typing ? customText : String(chipAmount ?? "");

  const setField = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : name === "pan" ? value.toUpperCase().replace(/\s/g, "").slice(0, 10) : value;
    setDonor((current) => ({ ...current, [name]: nextValue }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const chooseAmount = (value, custom) => {
    if (custom) setCustomText(value);
    else setChip(value);
    setCustomAmount(custom);
    if (errors.amount) setErrors((current) => ({ ...current, amount: undefined }));
  };

  const numericAmount = Number(amount);
  const hasAmount = numericAmount >= 1;
  const giveLabel = hasAmount ? interpolate(t("give"), { amount: formatPrice(numericAmount) }) : t("giveNoAmount");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    const found = validate({ ...donor, fundId: fund?.id, amount }, t);
    setErrors(found);
    if (Object.keys(found).length) {
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setSubmitting(true);
    let data;
    try {
      data = await apiRequest("/donate", {
        method: "POST",
        token,
        lang,
        body: {
          fund_id: Number(fund.id),
          amount: Math.round(numericAmount * 100) / 100,
          donor_name: donor.donor_name.trim(),
          donor_email: donor.donor_email.trim(),
          donor_phone: donor.donor_phone.trim(),
          donor_address: donor.donor_address.trim() || null,
          pan: donor.pan || null,
          is_anonymous: donor.is_anonymous,
          dedication: donor.dedication.trim() || null,
          message: donor.message.trim() || null,
        },
      });
    } catch (err) {
      setSubmitting(false);
      setServerError(err?.message || t("errorGeneric"));
      window.requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    let outcome;
    try {
      outcome = await collectPayment(data?.payment);
    } catch {
      outcome = "cancelled";
    }
    // Cashfree is sending the browser to the return URL, which is this donation's receipt
    if (outcome === "redirect") return;
    navigate(`/${lang}/donate/receipt/${data.donation.payment_order_id}`, { replace: true, state: { outcome } });
  };

  const crumbs = [{ label: t("home"), to: `/${lang}` }, { label: t("title") }];
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={crumbs} />
        <header className={styles.header}>
          <h1 className={shop.pageTitle}>{t("title")}</h1>
          <p className={shop.pageIntro}>{t("intro")}</p>
        </header>

        {status === "loading" ? (
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("loadingFunds")}</p>
          </div>
        ) : null}

        {status === "error" ? <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={() => {
              setStatus("loading");
              setAttempt((n) => n + 1);
            }} t={t} /> : null}

        {status === "ready" && !funds.length ? (
          <div className={shop.stateBox}>
            <span className={shop.stateIcon}>
              <HandHeart size={22} aria-hidden="true" />
            </span>
            <p className={shop.stateTitle}>{t("noFundsTitle")}</p>
            <p className={shop.stateBody}>{t("noFundsBody")}</p>
            <div className={shop.stateActions}>
              <a href={OFFICE_TEL} className={shop.btnPrimary}>
                {t("call")} {OFFICE_PHONE}
              </a>
            </div>
          </div>
        ) : null}

        {status === "ready" && funds.length ? (
          <form className={checkout.layout} onSubmit={handleSubmit} noValidate>
            <div className={styles.sections}>
              {errorCount || serverError ? (
                <p className={checkout.error} role="alert" tabIndex={-1} ref={errorRef}>
                  {serverError || t("errorSummary")}
                </p>
              ) : null}

              <section className={`${shop.panel} ${styles.section}`}>
                <h2 id="donate-cause" className={styles.sectionTitle}>
                  {t("causeHeading")}
                </h2>
                <div className={styles.causeGrid} role="radiogroup" aria-labelledby="donate-cause">
                  {funds.map((item) => {
                    const checked = item.id === fund?.id;
                    const showProgress = item.target_amount > 0 && typeof item.raised === "number";
                    const percent = showProgress ? Math.min(100, (item.raised / item.target_amount) * 100) : 0;
                    return (
                      <label key={item.id} className={`${styles.cause} ${checked ? styles.causeChecked : ""}`}>
                        <input
                          type="radio"
                          name="fund"
                          value={item.id}
                          checked={checked}
                          onChange={() => {
                            setFundId(String(item.id));
                            setErrors((current) => ({ ...current, fund: undefined }));
                          }}
                        />
                        <span className={styles.causeName}>{item.name}</span>
                        {item.description ? <span className={styles.causeText}>{item.description}</span> : null}
                        {showProgress ? (
                          <span className={styles.progress}>
                            <span className={styles.progressTrack} aria-hidden="true">
                              <span style={{ width: `${percent}%` }} />
                            </span>
                            <span className={styles.progressLabel}>
                              {interpolate(t("raisedOf"), { raised: formatPrice(item.raised) || "₹0", target: formatPrice(item.target_amount) })}
                            </span>
                          </span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
                {errors.fund ? <span className={styles.fieldError}>{errors.fund}</span> : null}
              </section>

              <section className={`${shop.panel} ${styles.section}`} aria-labelledby="donate-amount">
                <h2 id="donate-amount" className={styles.sectionTitle}>
                  {t("amountHeading")}
                </h2>
                {suggested.length ? (
                  <div className={styles.chips} role="group" aria-label={t("amountHeading")}>
                    {suggested.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`${styles.chip} ${!typing && numericAmount === value ? styles.chipActive : ""}`}
                        aria-pressed={!typing && numericAmount === value}
                        onClick={() => chooseAmount(value, false)}
                      >
                        {formatPrice(value)}
                      </button>
                    ))}
                  </div>
                ) : null}
                <Field id="donate-custom" label={t("customAmount")} error={errors.amount}>
                  <div className={styles.customAmount}>
                    <span className={styles.rupee} aria-hidden="true">
                      ₹
                    </span>
                    <input
                      id="donate-custom"
                      className={styles.input}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max={MAX_AMOUNT}
                      step="1"
                      placeholder={t("customAmountPlaceholder")}
                      value={typing ? customText : ""}
                      onChange={(event) => chooseAmount(event.target.value, true)}
                      aria-invalid={Boolean(errors.amount)}
                      aria-describedby={errors.amount ? "donate-custom-error" : undefined}
                    />
                  </div>
                </Field>
              </section>

              <section className={`${shop.panel} ${styles.section}`} aria-labelledby="donate-details">
                <div>
                  <h2 id="donate-details" className={styles.sectionTitle}>
                    {t("detailsHeading")}
                  </h2>
                  <p className={checkout.help}>{t("detailsHelp")}</p>
                </div>
                <div className={styles.fieldGrid}>
                  <Field id="donor_name" label={t("name")} error={errors.donor_name} wide>
                    <input
                      id="donor_name"
                      name="donor_name"
                      className={styles.input}
                      autoComplete="name"
                      value={donor.donor_name}
                      onChange={setField}
                      maxLength={120}
                      aria-invalid={Boolean(errors.donor_name)}
                      aria-describedby={errors.donor_name ? "donor_name-error" : undefined}
                    />
                  </Field>
                  <Field id="donor_email" label={t("email")} error={errors.donor_email}>
                    <input
                      id="donor_email"
                      name="donor_email"
                      type="email"
                      className={styles.input}
                      autoComplete="email"
                      value={donor.donor_email}
                      onChange={setField}
                      maxLength={120}
                      aria-invalid={Boolean(errors.donor_email)}
                      aria-describedby={errors.donor_email ? "donor_email-error" : undefined}
                    />
                  </Field>
                  <Field id="donor_phone" label={t("phone")} error={errors.donor_phone}>
                    <input
                      id="donor_phone"
                      name="donor_phone"
                      type="tel"
                      inputMode="tel"
                      className={styles.input}
                      autoComplete="tel"
                      value={donor.donor_phone}
                      onChange={setField}
                      maxLength={20}
                      aria-invalid={Boolean(errors.donor_phone)}
                      aria-describedby={errors.donor_phone ? "donor_phone-error" : undefined}
                    />
                  </Field>
                  <Field id="donor_address" label={t("address")} optional={t("optional")} wide>
                    <textarea
                      id="donor_address"
                      name="donor_address"
                      className={styles.input}
                      autoComplete="street-address"
                      rows={2}
                      value={donor.donor_address}
                      onChange={setField}
                      maxLength={1000}
                    />
                  </Field>
                  <Field id="pan" label={t("pan")} optional={t("optional")} hint={t("panHint")} error={errors.pan}>
                    <input
                      id="pan"
                      name="pan"
                      className={`${styles.input} ${styles.pan}`}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="ABCDE1234F"
                      value={donor.pan}
                      onChange={setField}
                      aria-invalid={Boolean(errors.pan)}
                      aria-describedby={errors.pan ? "pan-error" : "pan-hint"}
                    />
                  </Field>
                </div>
                <label className={styles.check}>
                  <input type="checkbox" name="is_anonymous" checked={donor.is_anonymous} onChange={setField} />
                  <strong>{t("anonymous")}</strong>
                  <span>{t("anonymousHint")}</span>
                </label>
                <p className={styles.accountNote}>
                  {token ? (
                    t("signedInNote")
                  ) : (
                    <>
                      <span>{t("guestNote")}</span>
                      <Link to={`/${lang}/login`} state={{ from: location }}>
                        {t("signIn")}
                      </Link>
                    </>
                  )}
                </p>
              </section>

              <section className={`${shop.panel} ${styles.section}`} aria-labelledby="donate-dedication">
                <div className={styles.sectionHead}>
                  <h2 id="donate-dedication" className={styles.sectionTitle}>
                    {t("dedicationHeading")}
                  </h2>
                  <span className={styles.optionalTag}>{t("optional")}</span>
                </div>
                <div className={styles.fieldGrid}>
                  <Field id="dedication" label={t("dedicationLabel")} wide>
                    <input
                      id="dedication"
                      name="dedication"
                      className={styles.input}
                      placeholder={t("dedicationPlaceholder")}
                      value={donor.dedication}
                      onChange={setField}
                      maxLength={200}
                    />
                  </Field>
                  <Field id="message" label={t("message")} wide>
                    <textarea id="message" name="message" className={styles.input} rows={3} value={donor.message} onChange={setField} maxLength={500} />
                  </Field>
                </div>
              </section>
            </div>

            <aside className={`${shop.panel} ${checkout.summary}`} aria-label={t("summaryTitle")}>
              <h2 className={checkout.summaryTitle}>{t("summaryTitle")}</h2>
              <dl className={checkout.summaryRows}>
                <div>
                  <dt>{t("cause")}</dt>
                  <dd className={styles.summaryCause}>{fund?.name || "—"}</dd>
                </div>
                {donor.dedication.trim() ? (
                  <div>
                    <dt>{t("dedication")}</dt>
                    <dd className={styles.summaryDedication}>{donor.dedication.trim()}</dd>
                  </div>
                ) : null}
              </dl>
              <div className={checkout.summaryTotal}>
                <span>{t("total")}</span>
                <span className={`${shop.price} ${checkout.totalPrice}`}>{hasAmount ? formatPrice(numericAmount) : "—"}</span>
              </div>
              <button type="submit" className={`${shop.btnPrimary} ${shop.btnBlock} ${shop.btnLarge}`} disabled={submitting}>
                {submitting ? <Loader2 size={18} aria-hidden="true" className={shop.spin} /> : <Lock size={17} aria-hidden="true" />}
                {submitting ? t("processing") : giveLabel}
              </button>
              <p className={checkout.summaryNote}>
                <ShieldCheck size={15} aria-hidden="true" />
                {t("payNote")}
              </p>
              {!livePayments ? <p className={checkout.testNote}>{t("testModeNote")}</p> : null}
            </aside>
          </form>
        ) : null}
      </div>
    </div>
  );
}
