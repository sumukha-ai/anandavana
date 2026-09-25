import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, CalendarPlus, Clock3, ExternalLink, Loader2, Phone, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/useI18n";
import shop from "./shop/Shop.module.css";
import styles from "./Events.module.css";
import { WhenChip } from "./Events";
import { Breadcrumbs, ErrorState } from "./shop/ShopParts";
import { OFFICE_PHONE, OFFICE_TEL, interpolate, parseISODate, toISODate } from "./shop/shopUtils";
import { eventCover, formatEventRange, isLink, useEvent } from "./events/eventUtils";
import PhotoGrid from "./events/PhotoGrid";

function googleCalendarUrl(event) {
  const start = parseISODate(event.start_date);
  const end = parseISODate(event.end_date) || start;
  if (!start) return null;
  const dayAfter = new Date(end);
  dayAfter.setDate(dayAfter.getDate() + 1);
  const compact = (date) => toISODate(date).replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${compact(start)}/${compact(dayAfter)}`,
    details: [event.summary, event.timings].filter(Boolean).join("\n\n"),
    location: "Sri Kshetra Anandavana, Agadi",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default function EventDetailPage() {
  const { eventSlug } = useParams();
  const { t, lang } = useI18n("events");
  const { event, today, status, retry } = useEvent(eventSlug, lang);
  const images = event?.images || [];

  const crumbs = [
    { label: t("home"), to: `/${lang}` },
    { label: t("events"), to: `/${lang}/events` },
  ];

  if (status === "loading") {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.container}>
          <Breadcrumbs items={[...crumbs, { label: "…" }]} />
          <div className={styles.detailHero} aria-busy="true">
            <div className={`${shop.skeleton} ${styles.detailMedia}`} />
            <div className={styles.detailInfo} role="status">
              <Loader2 size={20} aria-hidden="true" className={shop.spin} />
              <span>{t("loading")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status !== "ready" || !event) {
    return (
      <div className={shop.shop} lang={lang}>
        <div className={shop.narrow}>
          {status === "error" ? (
            <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={retry} t={t}>
              <Link to={`/${lang}/events`} className={shop.btnSecondary}>
                {t("backToEvents")}
              </Link>
            </ErrorState>
          ) : (
            <ErrorState title={t("notFoundTitle")} body={t("notFoundBody")} t={t}>
              <Link to={`/${lang}/events`} className={shop.btnPrimary}>
                <ArrowLeft size={17} aria-hidden="true" />
                {t("backToEvents")}
              </Link>
            </ErrorState>
          )}
        </div>
      </div>
    );
  }

  const parsedToday = parseISODate(today);
  const lastDay = parseISODate(event.end_date || event.start_date);
  const isPast = Boolean(parsedToday && lastDay && lastDay < parsedToday);
  const calendarUrl = !isPast ? googleCalendarUrl(event) : null;
  const paragraphs = String(event.description || "")
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className={shop.shop} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={[...crumbs, { label: event.title }]} />

        <section className={styles.detailHero}>
          <div className={styles.detailMedia}>
            <img src={eventCover(event)} alt="" width="1200" height="900" />
          </div>

          <div className={styles.detailInfo}>
            <div className={styles.cardMeta}>
              <span className={styles.category}>{t(`category.${event.category}`, t("category.other"))}</span>
              <WhenChip event={event} today={today} t={t} />
            </div>
            <h1 className={styles.detailTitle}>{event.title}</h1>
            {event.summary ? <p className={styles.detailLede}>{event.summary}</p> : null}

            <div className={styles.factList}>
              <div className={styles.fact}>
                <span className={styles.factIcon}>
                  <CalendarDays size={18} aria-hidden="true" />
                </span>
                <div>
                  <p className={styles.factLabel}>{t("when")}</p>
                  <p className={styles.factValue}>{formatEventRange(event, lang)}</p>
                </div>
              </div>
              {event.timings ? (
                <div className={styles.fact}>
                  <span className={styles.factIcon}>
                    <Clock3 size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <p className={styles.factLabel}>{t("timings")}</p>
                    <p className={styles.factValue}>{event.timings}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className={styles.actions}>
              {event.linked_seva && !isPast ? (
                <Link to={`/${lang}/seva/${event.linked_seva.id}`} className={`${shop.btnPrimary} ${shop.btnBlock}`}>
                  {interpolate(t("offerSeva"), { seva: event.linked_seva.name })}
                </Link>
              ) : null}
              {calendarUrl ? (
                <a href={calendarUrl} target="_blank" rel="noreferrer" className={`${shop.btnSecondary} ${shop.btnBlock}`}>
                  <CalendarPlus size={17} aria-hidden="true" />
                  {t("addToCalendar")}
                </a>
              ) : null}
              <a href={OFFICE_TEL} className={`${shop.btnGhost} ${shop.btnBlock}`}>
                <Phone size={17} aria-hidden="true" />
                {interpolate(t("callOffice"), { phone: OFFICE_PHONE })}
              </a>
            </div>
          </div>
        </section>

        {paragraphs.length || event.highlights?.length || event.details?.length ? (
          <section className={styles.detailBody}>
            <div className={styles.prose}>
              {paragraphs.length ? (
                <>
                  <h2 className={shop.sectionTitle}>{t("about")}</h2>
                  {paragraphs.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </>
              ) : null}
            </div>

            <div className={styles.aside}>
              {event.highlights?.length ? (
                <div>
                  <h2 className={shop.sectionTitle}>{t("highlights")}</h2>
                  <ul className={styles.highlights}>
                    {event.highlights.map((item, index) => (
                      <li key={index}>
                        <Sparkles size={16} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {event.details?.length ? (
                <div>
                  <h2 className={shop.sectionTitle}>{t("details")}</h2>
                  <dl className={styles.details}>
                    {event.details.map((item, index) => (
                      <div key={index}>
                        <dt>{item.label}</dt>
                        <dd>
                          {isLink(item.value) ? (
                            <a href={item.value.trim()} target="_blank" rel="noreferrer">
                              {t("openLink")}
                              <ExternalLink size={14} aria-hidden="true" />
                            </a>
                          ) : (
                            item.value
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {images.length ? (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={shop.sectionTitle}>{t("gallery")}</h2>
              <p className={styles.sectionIntro}>{images.length === 1 ? t("onePhoto") : interpolate(t("photos"), { n: images.length })}</p>
            </div>
            <PhotoGrid images={images} t={t} label={event.title} />
          </section>
        ) : null}

        <p className={styles.section}>
          <Link to={`/${lang}/events`} className={shop.textLink}>
            <ArrowLeft size={16} aria-hidden="true" /> {t("backToEvents")}
          </Link>
        </p>
      </div>
    </div>
  );
}
