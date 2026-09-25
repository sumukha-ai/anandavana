import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Loader2, Lock, Plus, ShieldCheck, UserRound } from "lucide-react";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useI18n } from "../../i18n/useI18n";
import shop from "./Shop.module.css";
import styles from "./Checkout.module.css";
import { AvailabilityBadge, Breadcrumbs, ErrorState, Price } from "./ShopParts";
import {
  OFFICE_TEL,
  formatDate,
  formatPrice,
  gotraName,
  hasPrice,
  interpolate,
  isBookableOnline,
  lookupName,
  sevaImage,
  toISODate,
  useDevoteeProfiles,
  useSevas,
} from "./shopUtils";
import { collectPayment, useLivePayments } from "./cashfree";

const QUICK_DAYS = 14;

function upcomingDays() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: QUICK_DAYS }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

function ProfileMeta({ profile, lang, t }) {
  const parts = [
    gotraName(profile, lang) ? `${t("gotra")}: ${gotraName(profile, lang)}` : "",
    lookupName(profile.rashi, lang),
    lookupName(profile.nakshatra, lang),
  ].filter(Boolean);
  return parts.length ? <span className={styles.profileMeta}>{parts.join(" · ")}</span> : null;
}

function StepHeader({ index, title, done, active, summary, onEdit, t }) {
  return (
    <div className={styles.stepHeader}>
      <span className={`${styles.stepNumber} ${done ? styles.stepNumberDone : ""} ${active ? styles.stepNumberActive : ""}`}>
        {done ? <Check size={15} aria-hidden="true" /> : index}
      </span>
      <div className={styles.stepHeading}>
        <h2 className={styles.stepTitle}>{title}</h2>
        {done && !active && summary ? <p className={styles.stepSummary}>{summary}</p> : null}
      </div>
      {done && !active ? (
        <button type="button" className={shop.btnGhost} onClick={onEdit}>
          {t("change")}
        </button>
      ) : null}
    </div>
  );
}

export default function CheckoutPage() {
  const { sevaId } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useI18n("shop");
  const { token } = useAuth();
  const { sevas, status: sevaStatus, retry } = useSevas(lang);
  const { profiles, status: profileStatus } = useDevoteeProfiles(token, lang);

  const [step, setStep] = useState(0);
  const [profileId, setProfileId] = useState("");
  const [sevaDate, setSevaDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => upcomingDays(), []);
  const today = toISODate(days[0]);
  const seva = sevas.find((item) => String(item.id) === String(sevaId));
  const selectedProfileId = profileId || (profiles[0] ? String(profiles[0].id) : "");
  const profile = profiles.find((item) => String(item.id) === selectedProfileId);
  const livePayments = useLivePayments();

  const crumbs = [
    { label: t("sevas"), to: `/${lang}/seva-booking` },
    ...(seva ? [{ label: seva.name, to: `/${lang}/seva/${seva.id}` }] : []),
    { label: t("checkoutTitle") },
  ];

  if (sevaStatus === "loading" || profileStatus === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <div className={shop.stateBox} role="status">
            <Loader2 size={22} aria-hidden="true" className={shop.spin} />
            <p className={shop.stateBody}>{t("loadingSeva")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (sevaStatus === "error") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={retry} t={t} />
        </div>
      </div>
    );
  }

  if (!seva || !isBookableOnline(seva)) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          <ErrorState title={seva ? t("notBookableOnline") : t("notFoundTitle")} body={seva ? t("officeOnlyBody") : t("notFoundBody")} t={t}>
            {seva ? (
              <a href={OFFICE_TEL} className={shop.btnPrimary}>
                {t("call")} +91 97415 85030
              </a>
            ) : null}
            <Link to={`/${lang}/seva-booking`} className={shop.btnSecondary}>
              {t("backToSevas")}
            </Link>
          </ErrorState>
        </div>
      </div>
    );
  }

  const devoteeDone = Boolean(profile);
  const dateDone = Boolean(sevaDate);
  const payLabel = hasPrice(seva.amount) ? interpolate(t("pay"), { amount: formatPrice(seva.amount) }) : t("continue");

  const handlePay = async () => {
    if (!profile) {
      setStep(0);
      setError(t("selectDevoteeFirst"));
      return;
    }
    if (!sevaDate) {
      setStep(1);
      setError(t("selectDateFirst"));
      return;
    }
    setError("");
    setSubmitting(true);
    let data;
    try {
      data = await apiRequest("/book/seva", {
        method: "POST",
        token,
        lang,
        body: { seva_id: Number(seva.id), bhakta_profile_id: Number(profile.id), seva_date: sevaDate },
      });
    } catch {
      setSubmitting(false);
      setError(t("checkoutError"));
      return;
    }

    let outcome;
    try {
      outcome = await collectPayment(data?.payment);
    } catch {
      outcome = "cancelled";
    }
    // Cashfree is sending the browser to the return URL, which lands on the confirmation page
    if (outcome === "redirect") return;

    const orderId = data?.payment?.order_id || "";
    navigate(`/${lang}/checkout/confirmed${orderId ? `?order_id=${encodeURIComponent(orderId)}` : ""}`, {
      replace: true,
      state: {
        outcome,
        reference: orderId,
        sevaId: seva.id,
        sevaName: seva.name,
        amount: seva.amount,
        sevaDate,
        devotee: profile.name,
      },
    });
  };

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={crumbs} />

        <header className={styles.header}>
          <h1 className={shop.pageTitle}>{t("checkoutTitle")}</h1>
          <span className={styles.secure}>
            <Lock size={15} aria-hidden="true" />
            {t("secureCheckout")}
          </span>
        </header>

        <ol className={styles.progress} aria-label={t("checkoutTitle")}>
          {[t("stepDevotee"), t("stepDate"), t("stepReview")].map((label, index) => (
            <li
              key={label}
              className={`${styles.progressItem} ${index < step ? styles.progressDone : ""} ${index === step ? styles.progressActive : ""}`}
              aria-current={index === step ? "step" : undefined}
            >
              <span className={styles.progressDot}>{index < step ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
              <span className={styles.progressLabel}>{label}</span>
            </li>
          ))}
        </ol>

        <div className={styles.layout}>
          <div className={styles.steps}>
            {/* Step 1: devotee */}
            <section className={`${shop.panel} ${styles.step} ${step === 0 ? styles.stepOpen : ""}`}>
              <StepHeader
                index={1}
                title={t("devoteeHeading")}
                done={devoteeDone && step > 0}
                active={step === 0}
                summary={profile?.name}
                onEdit={() => setStep(0)}
                t={t}
              />
              {step === 0 ? (
                <div className={styles.stepBody}>
                  <p className={styles.help}>{t("devoteeHelp")}</p>
                  {profiles.length ? (
                    <div className={styles.profileGrid} role="radiogroup" aria-label={t("devoteeHeading")}>
                      {profiles.map((item) => {
                        const checked = String(item.id) === selectedProfileId;
                        return (
                          <label key={item.id} className={`${styles.profileCard} ${checked ? styles.profileCardChecked : ""}`}>
                            <input
                              type="radio"
                              name="devotee"
                              value={item.id}
                              checked={checked}
                              onChange={() => setProfileId(String(item.id))}
                            />
                            <span className={styles.profileAvatar} aria-hidden="true">
                              <UserRound size={18} />
                            </span>
                            <span className={styles.profileText}>
                              <span className={styles.profileName}>
                                {item.name}
                                <span className={styles.profileTag}>{item.is_self ? t("you") : t("familyMember")}</span>
                              </span>
                              <ProfileMeta profile={item} lang={lang} t={t} />
                            </span>
                            <span className={styles.radioMark} aria-hidden="true" />
                          </label>
                        );
                      })}
                      <Link to={`/${lang}/dashboard/profile`} className={styles.addProfile}>
                        <Plus size={18} aria-hidden="true" />
                        {t("addFamily")}
                      </Link>
                    </div>
                  ) : (
                    <div className={styles.inlineNotice}>
                      <strong>{t("noProfilesTitle")}</strong>
                      <p>{t("noProfilesBody")}</p>
                      <Link to={`/${lang}/dashboard/profile`} className={shop.btnPrimary}>
                        {t("completeProfile")}
                      </Link>
                    </div>
                  )}
                  {profiles.length ? (
                    <div className={styles.stepActions}>
                      <button type="button" className={shop.btnPrimary} disabled={!profile} onClick={() => setStep(1)}>
                        {t("continue")}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>

            {/* Step 2: date */}
            <section className={`${shop.panel} ${styles.step} ${step === 1 ? styles.stepOpen : ""}`}>
              <StepHeader
                index={2}
                title={t("dateHeading")}
                done={dateDone && step > 1}
                active={step === 1}
                summary={formatDate(sevaDate, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                onEdit={() => setStep(1)}
                t={t}
              />
              {step === 1 ? (
                <div className={styles.stepBody}>
                  <p className={styles.help}>{t("dateHelp")}</p>
                  <div className={styles.dayStrip} role="radiogroup" aria-label={t("dateHeading")}>
                    {days.map((date, index) => {
                      const iso = toISODate(date);
                      const checked = iso === sevaDate;
                      const locale = lang === "kn" ? "kn-IN" : "en-IN";
                      return (
                        <label key={iso} className={`${styles.day} ${checked ? styles.dayChecked : ""}`}>
                          <input type="radio" name="seva-date" value={iso} checked={checked} onChange={() => setSevaDate(iso)} />
                          <span className={styles.dayWeek}>
                            {index === 0 ? t("today") : index === 1 ? t("tomorrow") : new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date)}
                          </span>
                          <span className={styles.dayNumber}>{date.getDate()}</span>
                          <span className={styles.dayMonth}>{new Intl.DateTimeFormat(locale, { month: "short" }).format(date)}</span>
                        </label>
                      );
                    })}
                  </div>
                  <label className={styles.otherDate}>
                    <span>{t("otherDate")}</span>
                    <input type="date" min={today} value={sevaDate} onChange={(event) => setSevaDate(event.target.value)} />
                  </label>
                  <div className={styles.stepActions}>
                    <button type="button" className={shop.btnPrimary} disabled={!sevaDate} onClick={() => setStep(2)}>
                      {t("continue")}
                    </button>
                  </div>
                </div>
              ) : null}
            </section>

            {/* Step 3: review & pay */}
            <section className={`${shop.panel} ${styles.step} ${step === 2 ? styles.stepOpen : ""}`}>
              <StepHeader index={3} title={t("reviewHeading")} done={false} active={step === 2} t={t} />
              {step === 2 ? (
                <div className={styles.stepBody}>
                  <p className={styles.help}>{t("reviewHelp")}</p>
                  <dl className={styles.review}>
                    <div>
                      <dt>{t("item")}</dt>
                      <dd>{seva.name}</dd>
                    </div>
                    <div>
                      <dt>{t("devotee")}</dt>
                      <dd>
                        {profile?.name}
                        {profile ? <ProfileMeta profile={profile} lang={lang} t={t} /> : null}
                      </dd>
                      <button type="button" className={shop.btnGhost} onClick={() => setStep(0)}>
                        {t("change")}
                      </button>
                    </div>
                    <div>
                      <dt>{t("sevaDate")}</dt>
                      <dd>{formatDate(sevaDate, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</dd>
                      <button type="button" className={shop.btnGhost} onClick={() => setStep(1)}>
                        {t("change")}
                      </button>
                    </div>
                  </dl>

                  {error ? (
                    <p className={styles.error} role="alert">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    className={`${shop.btnPrimary} ${shop.btnBlock} ${shop.btnLarge}`}
                    onClick={handlePay}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 size={18} aria-hidden="true" className={shop.spin} /> : <Lock size={17} aria-hidden="true" />}
                    {submitting ? t("processing") : payLabel}
                  </button>
                  <p className={styles.payNote}>
                    <ShieldCheck size={15} aria-hidden="true" />
                    {t("payNote")}
                  </p>
                  {!livePayments ? <p className={styles.testNote}>{t("testModeNote")}</p> : null}
                </div>
              ) : null}
            </section>
          </div>

          <aside className={`${shop.panel} ${styles.summary}`} aria-label={t("summaryTitle")}>
            <h2 className={styles.summaryTitle}>{t("summaryTitle")}</h2>
            <div className={styles.summaryItem}>
              <img src={sevaImage(seva)} alt="" width="96" height="72" />
              <div>
                <p className={styles.summaryName}>{seva.name}</p>
                <AvailabilityBadge seva={seva} t={t} />
              </div>
            </div>
            <dl className={styles.summaryRows}>
              <div>
                <dt>{t("devotee")}</dt>
                <dd>{profile?.name || "—"}</dd>
              </div>
              <div>
                <dt>{t("sevaDate")}</dt>
                <dd>{sevaDate ? formatDate(sevaDate, lang) : "—"}</dd>
              </div>
              <div>
                <dt>{t("offering")}</dt>
                <dd>
                  <Price amount={seva.amount} t={t} />
                </dd>
              </div>
            </dl>
            <div className={styles.summaryTotal}>
              <span>{t("total")}</span>
              <Price amount={seva.amount} t={t} className={styles.totalPrice} />
            </div>
            <p className={styles.summaryNote}>
              <ShieldCheck size={15} aria-hidden="true" />
              {t("payNote")}
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
