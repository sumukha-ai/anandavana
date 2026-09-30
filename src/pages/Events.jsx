import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock3, Images, Phone } from "lucide-react";
import { useI18n } from "../i18n/useI18n";
import { LotusRule } from "../components/ornaments/Ornaments";
import shop from "./shop/Shop.module.css";
import styles from "./Events.module.css";
import { Breadcrumbs, ErrorState } from "./shop/ShopParts";
import { OFFICE_PHONE, OFFICE_TEL, interpolate } from "./shop/shopUtils";
import { dateBadge, daysUntil, eventCover, eventDayCount, formatEventRange, isHappeningNow, useEventList } from "./events/eventUtils";

export function WhenChip({ event, today, t }) {
  if (isHappeningNow(event, today)) {
    return (
      <span className={`${styles.chip} ${styles.chipLive}`}>
        <span className={styles.liveDot} aria-hidden="true" />
        {t("happeningNow")}
      </span>
    );
  }
  const days = daysUntil(event, today);
  if (days === null || days < 0) return <span className={styles.chip}>{t("tookPlace")}</span>;
  const label = days === 0 ? t("startsToday") : days === 1 ? t("tomorrow") : interpolate(t("inDays"), { n: days });
  return <span className={`${styles.chip} ${styles.chipSoon}`}>{label}</span>;
}

function DateBadge({ event, lang, className = "" }) {
  const { day, month, weekday } = dateBadge(event, lang);
  return (
    <span className={`${styles.dateBadge} ${className}`} aria-hidden="true">
      <span className={styles.dateMonth}>{month}</span>
      <strong className={styles.dateDay}>{day}</strong>
      {weekday ? <span className={styles.dateWeekday}>{weekday}</span> : null}
    </span>
  );
}

function EventCard({ event, lang, t, today, past }) {
  const path = `/${lang}/events/${event.slug}`;
  const days = eventDayCount(event);
  return (
    <article className={styles.card}>
      <DateBadge event={event} lang={lang} />
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.category}>{t(`category.${event.category}`, t("category.other"))}</span>
          {!past ? <WhenChip event={event} today={today} t={t} /> : null}
        </div>
        <h3 className={styles.cardTitle}>
          <Link to={path}>{event.title}</Link>
        </h3>
        <p className={styles.cardDate}>
          <CalendarDays size={15} aria-hidden="true" />
          {formatEventRange(event, lang)}
          {days > 1 ? <span className={styles.muted}> · {interpolate(t("days"), { n: days })}</span> : null}
          {past && event.image_count ? (
            <span className={styles.photoCount}>
              <Images size={14} aria-hidden="true" />
              {event.image_count === 1 ? t("onePhoto") : interpolate(t("photos"), { n: event.image_count })}
            </span>
          ) : null}
        </p>
        {event.summary ? <p className={styles.cardText}>{event.summary}</p> : null}
      </div>
      <div className={styles.cardMedia}>
        <img src={eventCover(event)} alt="" loading="lazy" width="1200" height="900" />
      </div>
    </article>
  );
}

function FeaturedEvent({ event, lang, t, today }) {
  const path = `/${lang}/events/${event.slug}`;
  return (
    <article className={styles.featured}>
      <Link to={path} className={styles.featuredMedia} tabIndex={-1} aria-hidden="true">
        <img src={eventCover(event)} alt="" width="1600" height="1000" />
      </Link>
      <div className={styles.featuredBody}>
        <div className={styles.featuredHead}>
          <DateBadge event={event} lang={lang} className={styles.dateBadgeLarge} />
          <div className={styles.featuredMeta}>
            <p className={styles.featuredStatus}>{isHappeningNow(event, today) ? t("happeningNow") : t("nextUp")}</p>
            <div className={styles.cardMeta}>
              <span className={styles.category}>{t(`category.${event.category}`, t("category.other"))}</span>
              <WhenChip event={event} today={today} t={t} />
            </div>
          </div>
        </div>
        <h2 className={styles.featuredTitle}>
          <Link to={path}>{event.title}</Link>
        </h2>
        <p className={styles.featuredDate}>
          <CalendarDays size={18} aria-hidden="true" />
          {formatEventRange(event, lang)}
        </p>
        {event.timings ? (
          <p className={styles.featuredTimings}>
            <Clock3 size={17} aria-hidden="true" />
            <span>{event.timings.split("\n")[0]}</span>
          </p>
        ) : null}
        {event.summary ? <p className={styles.featuredSummary}>{event.summary}</p> : null}
        <Link to={path} className={`${shop.btnPrimary} ${styles.featuredAction}`}>
          {t("viewDetails")}
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function GridSkeleton({ count = 3 }) {
  return (
    <div className={styles.list} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.skeletonRow} aria-hidden="true">
          <div className={`${shop.skeleton} ${styles.skeletonLeaf}`} />
          <div className={styles.skeletonLines}>
            <div className={`${shop.skeleton} ${styles.skeletonLine}`} style={{ width: "30%" }} />
            <div className={`${shop.skeleton} ${styles.skeletonLine}`} style={{ width: "65%" }} />
            <div className={`${shop.skeleton} ${styles.skeletonLine}`} style={{ width: "85%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function groupByYear(events) {
  return events.reduce((groups, event) => {
    const year = String(event.start_date || "").slice(0, 4) || "—";
    const group = groups.find((item) => item.year === year);
    if (group) group.events.push(event);
    else groups.push({ year, events: [event] });
    return groups;
  }, []);
}

export default function Events() {
  const { t, lang } = useI18n("events");
  const upcoming = useEventList(lang, "upcoming");
  const past = useEventList(lang, "past");
  const [featured, ...rest] = upcoming.events;
  const pastGroups = groupByYear(past.events);

  return (
    <div className={`${shop.shop} ${styles.page}`} lang={lang}>
      <div className={shop.container}>
        <Breadcrumbs items={[{ label: t("home"), to: `/${lang}` }, { label: t("events") }]} />
        <header className={`${shop.pageHeader} ${styles.pageHeader}`}>
          <h1 className={`${shop.pageTitle} ${styles.pageTitle}`}>{t("title")}</h1>
          <p className={`${shop.pageIntro} ${styles.pageIntro}`}>{t("intro")}</p>
          <LotusRule align="start" className={styles.headerRule} />
        </header>

        {upcoming.status === "loading" ? (
          <div className={`${shop.skeleton} ${styles.featuredSkeleton}`} aria-hidden="true" />
        ) : upcoming.status === "error" ? (
          <ErrorState title={t("loadErrorTitle")} body={t("loadErrorBody")} onRetry={upcoming.retry} t={t} />
        ) : featured ? (
          <FeaturedEvent event={featured} lang={lang} t={t} today={upcoming.today} />
        ) : (
          <div className={styles.emptyUpcoming}>
            <span className={styles.emptyIcon}>
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <div>
              <p className={styles.emptyTitle}>{t("noUpcomingTitle")}</p>
              <p className={styles.emptyBody}>{t("noUpcomingBody")}</p>
            </div>
            <a href={OFFICE_TEL} className={shop.btnSecondary}>
              <Phone size={17} aria-hidden="true" />
              {OFFICE_PHONE}
            </a>
          </div>
        )}

        {rest.length ? (
          <section className={styles.section}>
            <h2 className={`${shop.sectionTitle} ${styles.sectionTitle}`}>{t("comingUp")}</h2>
            <div className={styles.list}>
              {rest.map((event) => (
                <EventCard key={event.id} event={event} lang={lang} t={t} today={upcoming.today} />
              ))}
            </div>
          </section>
        ) : null}

        {past.status === "loading" ? (
          <section className={styles.section}>
            <h2 className={`${shop.sectionTitle} ${styles.sectionTitle}`}>{t("pastTitle")}</h2>
            <GridSkeleton />
          </section>
        ) : past.status === "ready" && pastGroups.length ? (
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2 className={`${shop.sectionTitle} ${styles.sectionTitle}`}>{t("pastTitle")}</h2>
              <p className={styles.sectionIntro}>{t("pastIntro")}</p>
            </div>
            {pastGroups.map((group) => (
              <div key={group.year} className={styles.yearGroup}>
                <h3 className={styles.yearLabel}>{group.year}</h3>
                <div className={styles.list}>
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} lang={lang} t={t} today={past.today} past />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </div>
  );
}
