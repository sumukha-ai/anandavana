import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, ExternalLink, ImageOff, ListFilter, PartyPopper, Pencil, Plus, Trash2 } from "lucide-react";
import { apiRequest } from "../../api/client";
import { EVENT_CATEGORY_LABELS as CATEGORY_LABELS, eventImageUrl, formatEventRange } from "../events/eventUtils";
import { dateKey, sectionMeta } from "./rolePortalConfig";
import { Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./EventsConsole.module.css";

function Thumb({ event }) {
  const src = event.cover_image_url ? eventImageUrl(event.cover_image_url) : null;
  return src ? (
    <img className={styles.thumb} src={src} alt="" loading="lazy" />
  ) : (
    <span className={cx(styles.thumb, styles.thumbEmpty)} aria-hidden="true">
      <ImageOff size={15} />
    </span>
  );
}

function timing(event, today) {
  const last = event.end_date || event.start_date;
  if (last < today) return "past";
  if (event.start_date <= today) return "live";
  return "upcoming";
}

export default function EventsPage({ lang, role, token, notify }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [today, setToday] = useState(dateKey());
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("upcoming");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    apiRequest("/events?include_drafts=1", { token })
      .then((data) => {
        if (!active) return;
        setEvents(data.events || []);
        if (data.today) setToday(data.today);
      })
      .catch((err) => active && notify("error", "Could not load events", err.message))
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [notify, token, reload]);

  const editPath = useCallback((id) => `/${lang}/${role}/events/${id}`, [lang, role]);

  const buckets = useMemo(() => {
    const upcoming = events.filter((event) => event.status === "published" && timing(event, today) !== "past").sort((a, b) => a.start_date.localeCompare(b.start_date));
    const past = events.filter((event) => event.status === "published" && timing(event, today) === "past");
    const drafts = events.filter((event) => event.status === "draft").sort((a, b) => a.start_date.localeCompare(b.start_date));
    return { upcoming, past, drafts, all: events };
  }, [events, today]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return buckets[view].filter((event) => !needle || `${event.title_en || event.title} ${event.title_kn || ""}`.toLowerCase().includes(needle));
  }, [buckets, query, view]);

  const addEvent = () => navigate(`/${lang}/${role}/events/new`);

  const duplicate = async (event) => {
    setBusyId(event.id);
    try {
      const data = await apiRequest(`/events/${event.id}/duplicate`, { method: "POST", token });
      notify("success", "Draft copy created", `Set the ${data.event.start_date.slice(0, 4)} date and photos, then publish it.`);
      navigate(editPath(data.event.id));
    } catch (err) {
      notify("error", "Could not duplicate the event", err.message);
      setBusyId(null);
    }
  };

  const remove = async (event) => {
    const photoNote = event.image_count ? ` and its ${event.image_count} photo${event.image_count === 1 ? "" : "s"}` : "";
    if (!window.confirm(`Delete “${event.title_en || event.title}”${photoNote}? This cannot be undone.`)) return;
    setBusyId(event.id);
    try {
      await apiRequest(`/events/${event.id}`, { method: "DELETE", token });
      notify("success", "Event deleted", event.title_en || event.title);
      setReload((n) => n + 1);
    } catch (err) {
      notify("error", "Could not delete the event", err.message);
    } finally {
      setBusyId(null);
    }
  };

  const addButton = (
    <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={addEvent}>
      <Plus size={15} aria-hidden="true" />
      Add event
    </button>
  );

  return (
    <Page>
      <PageHeader title={sectionMeta.events.label} description={sectionMeta.events.text} actions={addButton} />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search in English or Kannada" />
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Filter events"
              value={view}
              onChange={setView}
              options={[
                { value: "upcoming", label: "Upcoming", count: buckets.upcoming.length },
                { value: "drafts", label: "Drafts", count: buckets.drafts.length },
                { value: "past", label: "Past", count: buckets.past.length },
                { value: "all", label: "All", count: buckets.all.length },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={5} columns={[40, 18, 12, 10]} />
        ) : visible.length ? (
          <div className={styles.tableWrap}>
            <table className={cx(styles.table, styles.tableStack)}>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th className={styles.num}>Photos</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.map((event) => {
                  const when = timing(event, today);
                  return (
                    <tr key={event.id} className={styles.rowClickable} onClick={() => navigate(editPath(event.id))}>
                      <td>
                        <div className={styles.cellRow}>
                          <Thumb event={event} />
                          <div className={styles.cellStack}>
                            <strong className={styles.cellMain}>{event.title_en || event.title}</strong>
                            <span>
                              {CATEGORY_LABELS[event.category] || "Other"}
                              {event.title_kn ? (
                                <>
                                  {" · "}
                                  <span lang="kn">{event.title_kn}</span>
                                </>
                              ) : null}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Dates">
                        {formatEventRange(event, "en")}
                      </td>
                      <td data-label="Status">
                        <div className={styles.cellRow}>
                          {event.status === "draft" ? <Badge tone="neutral">Draft</Badge> : when === "live" ? <Badge tone="success">Happening now</Badge> : when === "past" ? <Badge plain>Past</Badge> : <Badge tone="accent">Published</Badge>}
                          {!event.title_kn ? <Badge tone="warning">No Kannada</Badge> : null}
                        </div>
                      </td>
                      <td className={styles.num} data-label="Photos">
                        {event.image_count || "—"}
                      </td>
                      <td className={styles.num}>
                        <div className={own.rowActions} onClick={(clickEvent) => clickEvent.stopPropagation()}>
                          <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm, styles.rowAction)} onClick={() => navigate(editPath(event.id))} aria-label={`Edit ${event.title}`}>
                            <Pencil size={13} aria-hidden="true" />
                            Edit
                          </button>
                          <button
                            type="button"
                            className={cx(styles.btn, styles.btnGhost, styles.btnSm, styles.rowAction)}
                            onClick={() => duplicate(event)}
                            disabled={busyId === event.id}
                            title="Copy as a draft for next year"
                          >
                            <Copy size={13} aria-hidden="true" />
                            Duplicate
                          </button>
                          {event.status === "published" ? (
                            <a
                              href={`/${lang}/events/${event.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className={cx(styles.iconButton, styles.rowAction)}
                              aria-label={`Open ${event.title} on the website`}
                              title="Open on the website"
                            >
                              <ExternalLink size={14} aria-hidden="true" />
                            </a>
                          ) : null}
                          <button
                            type="button"
                            className={cx(styles.iconButton, styles.rowAction, own.dangerIcon)}
                            onClick={() => remove(event)}
                            disabled={busyId === event.id}
                            aria-label={`Delete ${event.title}`}
                            title="Delete"
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : events.length ? (
          <EmptyState
            icon={ListFilter}
            title={query ? "No events match" : view === "upcoming" ? "Nothing upcoming is published" : view === "drafts" ? "No drafts" : "Nothing here yet"}
            text={
              query
                ? "Try another spelling, or search in Kannada."
                : view === "upcoming"
                  ? "Publish a draft, or duplicate last year's festival from the Past tab."
                  : "Events you save without publishing wait here."
            }
            action={
              query ? (
                <button type="button" className={cx(styles.btn, styles.btnSecondary)} onClick={() => setQuery("")}>
                  Clear search
                </button>
              ) : (
                addButton
              )
            }
          />
        ) : (
          <EmptyState
            icon={PartyPopper}
            title="No events yet"
            text="Add a festival or utsava with its dates, description and photos. Devotees see it on the Events page once it is published."
            action={addButton}
          />
        )}
        {loaded && visible.length ? (
          <div className={styles.tableFoot}>
            <span>
              {visible.length} of {events.length} {events.length === 1 ? "event" : "events"}
            </span>
            <span className={styles.tableFootHint}>Duplicate copies an event as a draft for next year</span>
          </div>
        ) : null}
      </Panel>
    </Page>
  );
}
