import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Images, ImageOff, ListFilter, PartyPopper } from "lucide-react";
import { apiRequest } from "../../api/client";
import { EVENT_IMAGE_LIMIT, eventImageUrl, formatEventRange } from "../events/eventUtils";
import { sectionMeta, sectionPath } from "./rolePortalConfig";
import { Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./EventsConsole.module.css";

export function PhotoMeter({ count, limit = EVENT_IMAGE_LIMIT }) {
  const full = count >= limit;
  return (
    <span className={own.meter} title={`${count} of ${limit} photos`}>
      <span className={own.meterTrack} aria-hidden="true">
        <span className={cx(own.meterFill, full && own.meterFull)} style={{ width: `${Math.min(100, (count / limit) * 100)}%` }} />
      </span>
      <span className={own.meterText}>
        {count}/{limit}
      </span>
    </span>
  );
}

export default function GalleryPage({ lang, role, token, notify }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("all");

  useEffect(() => {
    let active = true;
    apiRequest("/events?include_drafts=1", { token })
      .then((data) => active && setEvents(data.events || []))
      .catch((err) => active && notify("error", "Could not load events", err.message))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [notify, token]);

  const counts = {
    all: events.length,
    empty: events.filter((event) => !event.image_count).length,
    full: events.filter((event) => event.image_count >= EVENT_IMAGE_LIMIT).length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events
      .filter((event) => (view === "empty" ? !event.image_count : view === "full" ? event.image_count >= EVENT_IMAGE_LIMIT : true))
      .filter((event) => !needle || `${event.title_en || event.title} ${event.title_kn || ""}`.toLowerCase().includes(needle));
  }, [events, query, view]);

  const open = (event) => navigate(`/${lang}/${role}/gallery/${event.id}`);

  return (
    <Page>
      <PageHeader title={sectionMeta.gallery.label} description={sectionMeta.gallery.text} />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search events" />
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Filter events"
              value={view}
              onChange={setView}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "empty", label: "No photos", count: counts.empty },
                { value: "full", label: "Full", count: counts.full },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={5} columns={[40, 18, 12, 14]} />
        ) : visible.length ? (
          <div className={styles.tableWrap}>
            <table className={cx(styles.table, styles.tableStack)}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Dates</th>
                  <th>Photos</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.map((event) => (
                  <tr key={event.id} className={styles.rowClickable} onClick={() => open(event)}>
                    <td>
                      <div className={styles.cellRow}>
                        {event.cover_image_url ? (
                          <img className={styles.thumb} src={eventImageUrl(event.cover_image_url)} alt="" loading="lazy" />
                        ) : (
                          <span className={cx(styles.thumb, styles.thumbEmpty)} aria-hidden="true">
                            <ImageOff size={15} />
                          </span>
                        )}
                        <div className={styles.cellStack}>
                          <strong className={styles.cellMain}>{event.title_en || event.title}</strong>
                          <span>{event.status === "draft" ? <Badge tone="neutral">Draft · photos not public yet</Badge> : event.title_kn ? <span lang="kn">{event.title_kn}</span> : null}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.nowrap} data-label="Dates">
                      {formatEventRange(event, "en")}
                    </td>
                    <td data-label="Photos">
                      <PhotoMeter count={event.image_count || 0} />
                    </td>
                    <td className={styles.num}>
                      <button
                        type="button"
                        className={cx(styles.btn, styles.btnGhost, styles.btnSm, styles.rowAction)}
                        onClick={(clickEvent) => {
                          clickEvent.stopPropagation();
                          open(event);
                        }}
                      >
                        <Images size={13} aria-hidden="true" />
                        Manage photos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : events.length ? (
          <EmptyState
            icon={ListFilter}
            title="No events match"
            text="Try another search or filter."
            action={
              <button
                type="button"
                className={cx(styles.btn, styles.btnSecondary)}
                onClick={() => {
                  setQuery("");
                  setView("all");
                }}
              >
                Show all events
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={PartyPopper}
            title="No events yet"
            text="Photos belong to an event. Add the event first, then come back here to add up to 10 photos."
            action={
              <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={() => navigate(sectionPath(lang, role, "events"))}>
                Go to events
              </button>
            }
          />
        )}
        {loaded && visible.length ? (
          <div className={styles.tableFoot}>
            <span>
              {visible.length} of {events.length} {events.length === 1 ? "event" : "events"}
            </span>
            <span className={styles.tableFootHint}>Each event can have up to {EVENT_IMAGE_LIMIT} photos</span>
          </div>
        ) : null}
      </Panel>
    </Page>
  );
}
