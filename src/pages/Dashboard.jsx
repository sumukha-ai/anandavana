import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Loader2, Pencil, Plus, UserRound, X, AlertCircle } from "lucide-react";
import { apiRequest } from "../api/client";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { useI18n } from "../i18n/useI18n";
import shop from "./shop/Shop.module.css";
import styles from "./shop/Account.module.css";
import AccountLayout from "./shop/AccountLayout";
import { ErrorState, PaymentBadge, SevaCard } from "./shop/ShopParts";
import { formatDate, gotraName, interpolate, isBookableOnline, lookupName, sevaImage, toISODate } from "./shop/shopUtils";

const emptyProfile = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  rashi_id: "",
  nakshatra_id: "",
  gotra: "",
  charana: "",
};

function toProfileForm(profile, user) {
  return {
    ...emptyProfile,
    name: profile?.name || user?.username || "",
    email: profile?.email || user?.email || "",
    phone_number: profile?.phone_number || "",
    address: profile?.address || "",
    rashi_id: profile?.rashi_id || profile?.rashi?.id || "",
    nakshatra_id: profile?.nakshatra_id || profile?.nakshatra?.id || "",
    gotra: profile?.gotra || "",
    charana: profile?.charana || "",
  };
}

function toPayload(form) {
  return {
    ...form,
    rashi_id: Number(form.rashi_id),
    nakshatra_id: Number(form.nakshatra_id),
    gotra: form.gotra.trim(),
  };
}

function initialsOf(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function profileLine(profile, lang, t) {
  return [
    gotraName(profile, lang) ? `${t("gotra")}: ${gotraName(profile, lang)}` : "",
    lookupName(profile?.rashi, lang),
    lookupName(profile?.nakshatra, lang),
  ]
    .filter(Boolean)
    .join(" · ");
}

function Toast({ notice, onClose }) {
  if (!notice.message) return null;
  const success = notice.type === "success";
  return (
    <div className={`${styles.toast} ${success ? styles.toastSuccess : styles.toastError}`} role={success ? "status" : "alert"}>
      {success ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
      <span>{notice.message}</span>
      <button type="button" onClick={onClose} aria-label="Close">
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function ProfileFields({ form, onChange, lookups, lang, t, idPrefix }) {
  const field = (name, label, props = {}) => (
    <label className={styles.field} htmlFor={`${idPrefix}-${name}`}>
      <span>{label}</span>
      <input id={`${idPrefix}-${name}`} name={name} value={form[name]} onChange={onChange} required {...props} />
    </label>
  );
  const select = (name, label, items) => (
    <label className={styles.field} htmlFor={`${idPrefix}-${name}`}>
      <span>{label}</span>
      <select id={`${idPrefix}-${name}`} name={name} value={form[name]} onChange={onChange} required>
        <option value="">{t("select")}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {lookupName(item, lang)}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <>
      {field("name", t("name"), { autoComplete: "name" })}
      {field("email", t("email"), { type: "email", autoComplete: "email" })}
      {field("phone_number", t("phone"), { type: "tel", autoComplete: "tel" })}
      {field("gotra", t("gotra"))}
      {select("rashi_id", t("rashi"), lookups.rashis || [])}
      {select("nakshatra_id", t("nakshatra"), lookups.nakshatras || [])}
      {field("charana", t("charana"), { inputMode: "numeric" })}
      <label className={`${styles.field} ${styles.fieldWide}`} htmlFor={`${idPrefix}-address`}>
        <span>{t("address")}</span>
        <textarea id={`${idPrefix}-address`} name="address" value={form.address} onChange={onChange} required rows={3} autoComplete="street-address" />
      </label>
    </>
  );
}

export default function Dashboard({ section = "overview" }) {
  const { token, user } = useAuth();
  const { t, lang } = useI18n("account");
  const { t: tShop } = useI18n("shop");
  const role = normalizeRole(user?.role);

  const [status, setStatus] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const [lookups, setLookups] = useState({ rashis: [], nakshatras: [] });
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(() => toProfileForm(null, user));
  const [familyForm, setFamilyForm] = useState(() => ({ ...emptyProfile, email: user?.email || "" }));
  const [isFamilyFormOpen, setIsFamilyFormOpen] = useState(false);
  const [editingFamilyMemberId, setEditingFamilyMemberId] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sevas, setSevas] = useState([]);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState("");

  useEffect(() => {
    if (!token || role !== "bhakta") return undefined;
    let active = true;

    async function loadBhaktaData() {
      try {
        const [lookupData, profileData, familyData, bookingData, sevaData] = await Promise.all([
          apiRequest("/lookups", { lang }),
          apiRequest("/bhakta/profile", { token, lang }),
          apiRequest("/family_member", { token, lang }),
          apiRequest("/booked_sevas", { token, lang }),
          apiRequest("/seva", { lang }),
        ]);
        if (!active) return;
        const nextProfile = profileData.profile || null;
        setLookups(lookupData);
        setProfile(nextProfile);
        setProfileForm(toProfileForm(nextProfile, user));
        setFamilyMembers(familyData.family_members || []);
        setBookings(bookingData.booked_sevas || []);
        setSevas(sevaData.sevas || []);
        setStatus("ready");
      } catch {
        if (active) setStatus("error");
      }
    }

    loadBhaktaData();
    return () => {
      active = false;
    };
  }, [lang, attempt, role, token, user]);

  const today = toISODate(new Date());
  const upcoming = useMemo(
    () =>
      bookings
        .filter((booking) => String(booking.seva_date) >= today)
        .sort((a, b) => String(a.seva_date).localeCompare(String(b.seva_date))),
    [bookings, today]
  );
  const recent = useMemo(
    () => [...bookings].sort((a, b) => String(b.created_at || b.seva_date).localeCompare(String(a.created_at || a.seva_date))).slice(0, 4),
    [bookings]
  );

  if (role !== "bhakta") {
    return <Navigate to={getRoleHomePath(role, lang)} replace />;
  }

  const refresh = () => setAttempt((n) => n + 1);
  const closeNotice = () => setNotice({ type: "", message: "" });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleFamilyChange = (event) => {
    const { name, value } = event.target;
    setFamilyForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    closeNotice();
    setSaving("profile");
    try {
      await apiRequest("/bhakta/profile", { method: "POST", token, lang, body: toPayload(profileForm) });
      setNotice({ type: "success", message: t("profileSaved") });
      refresh();
    } catch {
      setNotice({ type: "error", message: t("saveError") });
    } finally {
      setSaving("");
    }
  };

  const openAddFamilyForm = () => {
    setFamilyForm({ ...emptyProfile, email: user?.email || "" });
    setEditingFamilyMemberId(null);
    setIsFamilyFormOpen(true);
  };

  const openEditFamilyForm = (member) => {
    setFamilyForm(toProfileForm(member, user));
    setEditingFamilyMemberId(member.id);
    setIsFamilyFormOpen(true);
  };

  const closeFamilyForm = () => {
    setFamilyForm({ ...emptyProfile, email: user?.email || "" });
    setEditingFamilyMemberId(null);
    setIsFamilyFormOpen(false);
  };

  const saveFamily = async (event) => {
    event.preventDefault();
    closeNotice();
    setSaving("family");
    try {
      const path = editingFamilyMemberId ? `/family_member/${editingFamilyMemberId}` : "/family_member";
      await apiRequest(path, {
        method: editingFamilyMemberId ? "PUT" : "POST",
        token,
        lang,
        body: toPayload(familyForm),
      });
      setNotice({ type: "success", message: editingFamilyMemberId ? t("memberSaved") : t("memberAdded") });
      closeFamilyForm();
      refresh();
    } catch {
      setNotice({ type: "error", message: t("saveError") });
    } finally {
      setSaving("");
    }
  };

  const isProfile = section === "profile";
  const crumb = isProfile ? t("navProfile") : undefined;

  if (status === "loading") {
    return (
      <AccountLayout crumb={crumb}>
        <div className={shop.stateBox} role="status">
          <Loader2 size={22} aria-hidden="true" className={shop.spin} />
          <p className={shop.stateBody}>{t("loading")}</p>
        </div>
      </AccountLayout>
    );
  }

  if (status === "error") {
    return (
      <AccountLayout crumb={crumb}>
        <ErrorState title={tShop("loadErrorTitle")} body={t("loadError")} onRetry={refresh} t={t} />
      </AccountLayout>
    );
  }

  const devotees = [profile, ...familyMembers].filter(Boolean);
  const next = upcoming[0];
  const suggested = sevas.filter(isBookableOnline).slice(0, 3);

  if (isProfile) {
    return (
      <AccountLayout crumb={crumb}>
        <header className={styles.pageHead}>
          <h1 className={shop.pageTitle}>{t("profileTitle")}</h1>
          <p className={shop.pageIntro}>{t("profileIntro")}</p>
        </header>

        <Toast notice={notice} onClose={closeNotice} />

        <section className={styles.card} aria-labelledby="your-details">
          <div className={styles.cardHead}>
            <h2 id="your-details" className={styles.cardTitle}>
              {t("yourDetails")}
            </h2>
          </div>
          <form className={styles.form} onSubmit={saveProfile}>
            <ProfileFields form={profileForm} onChange={handleProfileChange} lookups={lookups} lang={lang} t={t} idPrefix="self" />
            <div className={styles.formActions}>
              <button type="submit" className={shop.btnPrimary} disabled={saving === "profile"}>
                {saving === "profile" ? <Loader2 size={17} aria-hidden="true" className={shop.spin} /> : null}
                {saving === "profile" ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        </section>

        <section className={styles.card} aria-labelledby="family-members">
          <div className={styles.cardHead}>
            <div>
              <h2 id="family-members" className={styles.cardTitle}>
                {t("familyMembers")}
              </h2>
              <p className={styles.cardSub}>{t("familyIntro")}</p>
            </div>
            {!isFamilyFormOpen ? (
              <button type="button" className={shop.btnSecondary} onClick={openAddFamilyForm}>
                <Plus size={17} aria-hidden="true" />
                {t("addMember")}
              </button>
            ) : null}
          </div>

          {isFamilyFormOpen ? (
            <div className={styles.memberForm}>
              <p className={styles.memberFormTitle}>{editingFamilyMemberId ? t("editMember") : t("newMember")}</p>
              <form className={styles.form} onSubmit={saveFamily}>
                <ProfileFields form={familyForm} onChange={handleFamilyChange} lookups={lookups} lang={lang} t={t} idPrefix="family" />
                <div className={styles.formActions}>
                  <button type="button" className={shop.btnSecondary} onClick={closeFamilyForm}>
                    {t("cancel")}
                  </button>
                  <button type="submit" className={shop.btnPrimary} disabled={saving === "family"}>
                    {saving === "family" ? <Loader2 size={17} aria-hidden="true" className={shop.spin} /> : null}
                    {saving === "family" ? t("saving") : editingFamilyMemberId ? t("saveMember") : t("addMemberSubmit")}
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {familyMembers.length ? (
            <div className={styles.memberGrid}>
              {familyMembers.map((member) => (
                <article key={member.id} className={styles.member}>
                  <div className={styles.memberTop}>
                    <span className={styles.personAvatar} aria-hidden="true">
                      {initialsOf(member.name)}
                    </span>
                    <div>
                      <p className={styles.memberName}>{member.name}</p>
                      <p className={styles.memberContact}>{member.phone_number || member.email}</p>
                    </div>
                    <button type="button" className={shop.btnGhost} onClick={() => openEditFamilyForm(member)}>
                      <Pencil size={15} aria-hidden="true" />
                      {t("edit")}
                    </button>
                  </div>
                  <div className={styles.chips}>
                    {gotraName(member, lang) ? <span className={styles.chip}>{t("gotra")}: {gotraName(member, lang)}</span> : null}
                    {lookupName(member.rashi, lang) ? <span className={styles.chip}>{lookupName(member.rashi, lang)}</span> : null}
                    {lookupName(member.nakshatra, lang) ? <span className={styles.chip}>{lookupName(member.nakshatra, lang)}</span> : null}
                    {member.charana ? (
                      <span className={styles.chip}>
                        {t("charana")} {member.charana}
                      </span>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : !isFamilyFormOpen ? (
            <p className={styles.muted}>{t("noFamily")}</p>
          ) : null}
        </section>
      </AccountLayout>
    );
  }

  const firstName = (profile?.name || user?.username || "").split(/\s+/)[0];

  return (
    <AccountLayout>
      <header className={styles.pageHead}>
        <h1 className={shop.pageTitle}>{interpolate(t("greeting"), { name: firstName })}</h1>
        <p className={shop.pageIntro}>{t("overviewIntro")}</p>
      </header>

      <Toast notice={notice} onClose={closeNotice} />

      {!profile ? (
        <div className={styles.banner}>
          <div>
            <strong>{t("completeTitle")}</strong>
            <p>{t("completeBody")}</p>
          </div>
          <Link to={`/${lang}/dashboard/profile`} className={shop.btnPrimary}>
            {t("completeAction")}
          </Link>
        </div>
      ) : null}

      {next ? (
        <section className={`${styles.card} ${styles.nextSeva}`} aria-labelledby="next-seva">
          <img src={sevaImage({ id: next.seva?.id || next.seva_id, ...next.seva })} alt="" width="440" height="330" />
          <div className={styles.nextBody}>
            <p id="next-seva" className={styles.nextLabel}>
              {t("nextSeva")}
            </p>
            <p className={styles.nextName}>{next.seva?.name}</p>
            <div className={styles.nextMeta}>
              <span>
                <CalendarDays size={16} aria-hidden="true" />
                {formatDate(next.seva_date, lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span>
                <UserRound size={16} aria-hidden="true" />
                {next.bhakta_profile?.name}
              </span>
              <PaymentBadge status={next.payment_status} t={tShop} />
            </div>
            <div className={styles.nextActions}>
              <Link to={`/${lang}/dashboard/bookings/${next.id}`} className={shop.btnPrimary}>
                {tShop("viewReceipt")}
              </Link>
              <Link to={`/${lang}/dashboard/bookings`} className={shop.btnSecondary}>
                {t("navBookings")}
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className={`${styles.card} ${styles.emptyNext}`}>
          <div>
            <p className={styles.cardTitle}>{t("noUpcomingTitle")}</p>
            <p>{t("noUpcomingBody")}</p>
          </div>
          <Link to={`/${lang}/dashboard/book-seva`} className={shop.btnPrimary}>
            {t("bookFor")}
          </Link>
        </section>
      )}

      <div className={styles.split}>
        <section className={styles.card} aria-labelledby="recent-bookings">
          <div className={styles.cardHead}>
            <h2 id="recent-bookings" className={styles.cardTitle}>
              {t("recentBookings")}
            </h2>
            {recent.length ? (
              <Link to={`/${lang}/dashboard/bookings`} className={shop.textLink}>
                {t("viewAll")}
              </Link>
            ) : null}
          </div>
          {recent.length ? (
            <div className={styles.rowList}>
              {recent.map((booking) => (
                <div key={booking.id} className={styles.row}>
                  <img src={sevaImage({ id: booking.seva?.id || booking.seva_id, ...booking.seva })} alt="" width="56" height="42" loading="lazy" />
                  <div className={styles.rowMain}>
                    <p className={styles.rowTitle}>
                      <Link to={`/${lang}/dashboard/bookings/${booking.id}`}>{booking.seva?.name}</Link>
                    </p>
                    <p className={styles.rowSub}>
                      {formatDate(booking.seva_date, lang, { day: "numeric", month: "short", year: "numeric" })} · {booking.bhakta_profile?.name}
                    </p>
                  </div>
                  <PaymentBadge status={booking.payment_status} t={tShop} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.muted}>{t("noBookings")}</p>
          )}
        </section>

        <section className={styles.card} aria-labelledby="your-family">
          <div className={styles.cardHead}>
            <h2 id="your-family" className={styles.cardTitle}>
              {t("yourFamily")}
            </h2>
            <Link to={`/${lang}/dashboard/profile`} className={shop.textLink}>
              {t("manage")}
            </Link>
          </div>
          {devotees.length ? (
            <div>
              {devotees.map((person) => (
                <div key={person.id} className={styles.person}>
                  <span className={styles.personAvatar} aria-hidden="true">
                    {initialsOf(person.name)}
                  </span>
                  <div className={styles.rowMain}>
                    <p className={styles.rowTitle}>{person.name}</p>
                    <p className={styles.rowSub}>{profileLine(person, lang, t)}</p>
                  </div>
                  {person.is_self ? <span className={styles.tag}>{t("you")}</span> : null}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.muted}>{t("noFamily")}</p>
          )}
        </section>
      </div>

      {suggested.length ? (
        <section aria-labelledby="suggested">
          <div className={styles.cardHead}>
            <h2 id="suggested" className={styles.cardTitle}>
              {t("suggested")}
            </h2>
            <Link to={`/${lang}/dashboard/book-seva`} className={shop.textLink}>
              {t("viewAll")}
            </Link>
          </div>
          <div className={styles.suggestGrid}>
            {suggested.map((seva) => (
              <SevaCard key={seva.id} seva={seva} lang={lang} t={tShop} />
            ))}
          </div>
        </section>
      ) : null}
    </AccountLayout>
  );
}
