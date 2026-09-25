import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowRight, ExternalLink, FileQuestion, ImageOff, ImagePlus, Images, LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { apiRequest } from "../../api/client";
import { EVENT_CATEGORY_LABELS as CATEGORY_LABELS, EVENT_IMAGE_LIMIT, eventImageUrl, formatEventRange } from "../events/eventUtils";
import { PhotoMeter } from "./GalleryPage";
import { sectionPath } from "./rolePortalConfig";
import { Badge, EmptyState, Field, FormSection, Page, PageHeader, Panel, Segmented, Skeleton, Switch } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./EventsConsole.module.css";

const DETAIL_SUGGESTIONS = [
  { label: "Venue", label_kn: "ಸ್ಥಳ" },
  { label: "Contact", label_kn: "ಸಂಪರ್ಕ" },
  { label: "Live stream", label_kn: "ನೇರ ಪ್ರಸಾರ" },
  { label: "Prasada", label_kn: "ಪ್ರಸಾದ" },
  { label: "Dress code", label_kn: "ವಸ್ತ್ರ ಸಂಹಿತೆ" },
  { label: "Invitation", label_kn: "ಆಮಂತ್ರಣ" },
];

let rowCounter = 0;
const rowKey = () => `row-${(rowCounter += 1)}`;

const emptyEvent = {
  id: "",
  status: "draft",
  category: "festival",
  start_date: "",
  end_date: "",
  title: "",
  title_kn: "",
  summary: "",
  summary_kn: "",
  description: "",
  description_kn: "",
  timings: "",
  timings_kn: "",
  cover_image_url: "",
  cover: null,
  linked_seva_id: "",
  highlights: [],
  details: [],
};

function toForm(event) {
  if (!event) return emptyEvent;
  return {
    id: event.id,
    status: event.status || "draft",
    category: event.category || "festival",
    start_date: event.start_date || "",
    end_date: event.end_date || "",
    title: event.title_en || "",
    title_kn: event.title_kn || "",
    summary: event.summary_en || "",
    summary_kn: event.summary_kn || "",
    description: event.description_en || "",
    description_kn: event.description_kn || "",
    timings: event.timings_en || "",
    timings_kn: event.timings_kn || "",
    cover_image_url: event.cover_image_url || "",
    cover: null,
    linked_seva_id: event.linked_seva_id ? String(event.linked_seva_id) : "",
    highlights: (event.highlights_raw || []).map((item) => ({ key: rowKey(), text: item.text || "", text_kn: item.text_kn || "" })),
    details: (event.details_raw || []).map((item) => ({
      key: rowKey(),
      label: item.label || "",
      label_kn: item.label_kn || "",
      value: item.value || "",
      value_kn: item.value_kn || "",
    })),
  };
}

// Compare everything except the row keys and the pending file
function snapshot(form) {
  const strip = (rows) =>
    rows.map((row) => {
      const copy = { ...row };
      delete copy.key;
      return copy;
    });
  return JSON.stringify({ ...form, cover: null, highlights: strip(form.highlights), details: strip(form.details) });
}

function usePreviewUrl(file, savedUrl) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => objectUrl && URL.revokeObjectURL(objectUrl), [objectUrl]);
  return objectUrl || (savedUrl ? eventImageUrl(savedUrl) : null);
}

function toPayload(form) {
  const payload = new FormData();
  ["status", "category", "start_date", "end_date", "title", "title_kn", "summary", "summary_kn", "description", "description_kn", "timings", "timings_kn", "linked_seva_id"].forEach((field) => {
    payload.append(field, form[field] ?? "");
  });
  if (form.id) payload.append("id", String(form.id));
  if (form.cover_image_url && !form.cover) payload.append("cover_image_url", form.cover_image_url);
  if (form.cover) payload.append("cover", form.cover);
  payload.append("highlights", JSON.stringify(form.highlights.map(({ text, text_kn }) => ({ text: text.trim(), text_kn: text_kn.trim() }))));
  payload.append(
    "details",
    JSON.stringify(
      form.details.map(({ label, label_kn, value, value_kn }) => ({
        label: label.trim(),
        label_kn: label_kn.trim(),
        value: value.trim(),
        value_kn: value_kn.trim(),
      }))
    )
  );
  return payload;
}

export default function EventEditorPage({ lang, role, token, eventId, sevas, notify, onTitle }) {
  const navigate = useNavigate();
  const isEdit = Boolean(eventId);
  const [form, setForm] = useState(emptyEvent);
  const [baseline, setBaseline] = useState(() => snapshot(emptyEvent));
  const [images, setImages] = useState([]); // read-only here; managed on the Gallery page
  const [slug, setSlug] = useState("");
  const [state, setState] = useState(isEdit ? "loading" : "ready");
  const [saving, setSaving] = useState(false);
  const [previewLang, setPreviewLang] = useState("en");
  const [dragging, setDragging] = useState(false);
  const preview = usePreviewUrl(form.cover, form.cover_image_url);
  const listPath = sectionPath(lang, role, "events");
  const back = { to: listPath, label: "Events" };

  useEffect(() => {
    if (!eventId) return undefined;
    let active = true;
    apiRequest(`/events/${eventId}`, { token })
      .then((data) => {
        if (!active) return;
        const next = toForm(data.event);
        setForm(next);
        setBaseline(snapshot(next));
        setImages(data.event.images || []);
        setSlug(data.event.status === "published" ? data.event.slug : "");
        setState("ready");
      })
      .catch((err) => {
        if (!active) return;
        if (err.status === 404) setState("missing");
        else {
          setState("error");
          notify("error", "Could not load the event", err.message);
        }
      });
    return () => {
      active = false;
    };
  }, [eventId, notify, token]);

  useEffect(() => {
    onTitle?.(isEdit ? form.title || (state === "loading" ? "" : "Edit event") : "New event");
  }, [form.title, isEdit, onTitle, state]);

  const dirty = Boolean(form.cover) || snapshot(form) !== baseline;

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const onChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setForm((current) => {
      if (name === "status") return { ...current, status: checked ? "published" : "draft" };
      return { ...current, [name]: type === "file" ? files?.[0] || null : value };
    });
  };

  const setRow = (list, key, field, value) =>
    setForm((current) => ({ ...current, [list]: current[list].map((row) => (row.key === key ? { ...row, [field]: value } : row)) }));
  const addRow = (list, row) => setForm((current) => ({ ...current, [list]: [...current[list], { key: rowKey(), ...row }] }));
  const removeRow = (list, key) => setForm((current) => ({ ...current, [list]: current[list].filter((row) => row.key !== key) }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const data = await apiRequest("/events", { method: "POST", token, body: toPayload(form) });
      const next = toForm(data.event);
      setForm(next);
      setBaseline(snapshot(next));
      setSlug(data.event.status === "published" ? data.event.slug : "");
      if (!isEdit) {
        notify("success", "Event created", next.status === "published" ? "It is live on the Events page. You can add photos now." : "Saved as a draft. Add photos, then publish when ready.");
        navigate(`/${lang}/${role}/events/${data.event.id}`, { replace: true });
      } else {
        notify("success", "Event saved", next.status === "published" ? "Changes are live on the website." : "Saved as a draft. Devotees cannot see it yet.");
      }
    } catch (err) {
      notify("error", "Could not save the event", err.message || "Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (state === "missing") {
    return (
      <Page>
        <PageHeader back={back} title="Event not found" />
        <Panel>
          <EmptyState
            icon={FileQuestion}
            title="This event does not exist"
            text="It may have been deleted, or the link is out of date."
            action={
              <NavLink to={listPath} className={cx(styles.btn, styles.btnSecondary)}>
                Back to events
              </NavLink>
            }
          />
        </Panel>
      </Page>
    );
  }

  if (state === "loading" || state === "error") {
    return (
      <Page>
        <PageHeader back={back} title="Edit event" />
        <div className={styles.split}>
          <Panel>
            <div className={cx(styles.panelBody, styles.skeletonStack)}>
              <Skeleton width="30%" height={12} />
              <Skeleton height={34} />
              <Skeleton height={34} />
              <Skeleton height={96} />
            </div>
          </Panel>
          <Panel>
            <Skeleton height={220} radius={0} />
          </Panel>
        </div>
      </Page>
    );
  }

  const published = form.status === "published";
  const pick = (en, kn) => (previewLang === "kn" ? kn || en : en);
  const previewRange = form.start_date ? formatEventRange({ start_date: form.start_date, end_date: form.end_date }, previewLang) : "Date not set";
  const missingKannada = !form.title_kn || (form.description && !form.description_kn);

  return (
    <Page>
      <PageHeader
        back={back}
        title={isEdit ? form.title || "Edit event" : "New event"}
        description={
          isEdit
            ? published
              ? "This event is live. Saved changes appear on the website straight away."
              : "This event is a draft. Devotees cannot see it until you publish it."
            : "Fill in the template. Only the name and start date are required; everything else is optional."
        }
        actions={
          slug ? (
            <a href={`/${lang}/events/${slug}`} target="_blank" rel="noreferrer" className={cx(styles.btn, styles.btnSecondary)}>
              <ExternalLink size={15} aria-hidden="true" />
              View on website
            </a>
          ) : null
        }
      />

      <form onSubmit={save} className={styles.stack}>
        <div className={styles.split}>
          <div className={styles.stack}>
            <Panel>
              <FormSection title="Event" description="The name and dates devotees see first.">
                <Field label="Event name" aside="English">
                  <input className={styles.input} name="title" value={form.title} onChange={onChange} required minLength={2} maxLength={200} placeholder="e.g. Ganesha Chaturthi" />
                </Field>
                <Field label="Event name" aside="ಕನ್ನಡ">
                  <input className={styles.input} name="title_kn" value={form.title_kn} onChange={onChange} maxLength={200} lang="kn" placeholder="ಉದಾ. ಗಣೇಶ ಚತುರ್ಥಿ" />
                </Field>
                <Field label="Starts on">
                  <input className={styles.input} type="date" name="start_date" value={form.start_date} onChange={onChange} required />
                </Field>
                <Field label="Ends on" hint="Leave empty for a one-day event.">
                  <input className={styles.input} type="date" name="end_date" value={form.end_date} onChange={onChange} min={form.start_date || undefined} />
                </Field>
                <Field label="Type">
                  <select className={styles.select} name="category" value={form.category} onChange={onChange}>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Linked seva" hint="Shows an “Offer this seva” button on the event page.">
                  <select className={styles.select} name="linked_seva_id" value={form.linked_seva_id} onChange={onChange}>
                    <option value="">No seva</option>
                    {sevas.map((seva) => (
                      <option key={seva.id} value={String(seva.id)}>
                        {seva.name}
                        {seva.enabled ? "" : " (off)"}
                      </option>
                    ))}
                  </select>
                </Field>
              </FormSection>

              <FormSection title="Description" description="A one-line summary for the event card, and the full write-up for the event page. Leave a blank line between paragraphs.">
                <Field label="Summary" aside={`${form.summary.length}/400`}>
                  <textarea className={styles.textarea} name="summary" value={form.summary} onChange={onChange} rows={3} maxLength={400} placeholder="Three days of pooja, Rathotsava and annadana" />
                </Field>
                <Field label="Summary" aside="ಕನ್ನಡ">
                  <textarea className={styles.textarea} name="summary_kn" value={form.summary_kn} onChange={onChange} rows={3} maxLength={400} lang="kn" placeholder="ಸಾರಾಂಶ" />
                </Field>
                <Field label="Full description" aside="English" wide>
                  <textarea className={styles.textarea} name="description" value={form.description} onChange={onChange} rows={7} placeholder="The significance of the festival and how it is celebrated at the kshetra" />
                </Field>
                <Field label="Full description" aside="ಕನ್ನಡ" wide>
                  <textarea className={styles.textarea} name="description_kn" value={form.description_kn} onChange={onChange} rows={7} lang="kn" placeholder="ಹಬ್ಬದ ಮಹತ್ವ ಮತ್ತು ಆಚರಣೆಯ ವಿವರ" />
                </Field>
              </FormSection>

              <FormSection title="Timings" description="One line per programme, e.g. “6:00 AM · Abhisheka”.">
                <Field label="Timings" aside="English">
                  <textarea className={styles.textarea} name="timings" value={form.timings} onChange={onChange} rows={4} placeholder={"6:00 AM · Abhisheka\n7:00 PM · Rathotsava"} />
                </Field>
                <Field label="Timings" aside="ಕನ್ನಡ">
                  <textarea className={styles.textarea} name="timings_kn" value={form.timings_kn} onChange={onChange} rows={4} lang="kn" placeholder={"ಬೆಳಿಗ್ಗೆ 6:00 · ಅಭಿಷೇಕ"} />
                </Field>
              </FormSection>

              <FormSection title="Highlights" description="Short points shown as a list, e.g. Rathotsava, Annadana, cultural programme.">
                <div className={cx(styles.fieldWide, own.rows)}>
                  {form.highlights.map((row, index) => (
                    <div key={row.key} className={own.row}>
                      <span className={own.rowIndex}>{index + 1}</span>
                      <input className={styles.input} value={row.text} onChange={(event) => setRow("highlights", row.key, "text", event.target.value)} maxLength={200} placeholder="Highlight" aria-label={`Highlight ${index + 1} in English`} />
                      <input className={styles.input} value={row.text_kn} onChange={(event) => setRow("highlights", row.key, "text_kn", event.target.value)} maxLength={200} lang="kn" placeholder="ಮುಖ್ಯಾಂಶ" aria-label={`Highlight ${index + 1} in Kannada`} />
                      <button type="button" className={cx(styles.iconButton, own.dangerIcon)} onClick={() => removeRow("highlights", row.key)} aria-label={`Remove highlight ${index + 1}`}>
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {form.highlights.length < 20 ? (
                    <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm, own.addRow)} onClick={() => addRow("highlights", { text: "", text_kn: "" })}>
                      <Plus size={14} aria-hidden="true" />
                      Add highlight
                    </button>
                  ) : null}
                </div>
              </FormSection>

              <FormSection title="More details" description="Optional. Add any extra fields this event needs: venue, contact, live-stream link, prasada. Links become clickable on the website.">
                <div className={cx(styles.fieldWide, own.rows)}>
                  {form.details.map((row, index) => (
                    <div key={row.key} className={own.detailRow}>
                      <div className={own.detailGrid}>
                        <input className={styles.input} value={row.label} onChange={(event) => setRow("details", row.key, "label", event.target.value)} maxLength={80} placeholder="Field name, e.g. Venue" aria-label={`Detail ${index + 1} name`} />
                        <input className={styles.input} value={row.value} onChange={(event) => setRow("details", row.key, "value", event.target.value)} maxLength={500} placeholder="Value, e.g. Main mantapa" aria-label={`Detail ${index + 1} value`} />
                        <input className={styles.input} value={row.label_kn} onChange={(event) => setRow("details", row.key, "label_kn", event.target.value)} maxLength={80} lang="kn" placeholder="ಹೆಸರು" aria-label={`Detail ${index + 1} name in Kannada`} />
                        <input className={styles.input} value={row.value_kn} onChange={(event) => setRow("details", row.key, "value_kn", event.target.value)} maxLength={500} lang="kn" placeholder="ವಿವರ" aria-label={`Detail ${index + 1} value in Kannada`} />
                      </div>
                      <button type="button" className={cx(styles.iconButton, own.dangerIcon)} onClick={() => removeRow("details", row.key)} aria-label={`Remove detail ${index + 1}`}>
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {form.details.length < 20 ? (
                    <div className={own.suggestions}>
                      <button type="button" className={cx(styles.btn, styles.btnSecondary, styles.btnSm)} onClick={() => addRow("details", { label: "", label_kn: "", value: "", value_kn: "" })}>
                        <Plus size={14} aria-hidden="true" />
                        Add field
                      </button>
                      {DETAIL_SUGGESTIONS.filter((suggestion) => !form.details.some((row) => row.label.trim().toLowerCase() === suggestion.label.toLowerCase())).map((suggestion) => (
                        <button key={suggestion.label} type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={() => addRow("details", { ...suggestion, value: "", value_kn: "" })}>
                          + {suggestion.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </FormSection>

              <FormSection title="Cover image" description="The main photo on the event card and page. Wide photos work best.">
                <div
                  className={cx(styles.dropzone, styles.fieldWide, dragging && styles.dropzoneActive)}
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDrop={() => setDragging(false)}
                >
                  <input type="file" name="cover" accept="image/*" onChange={onChange} aria-label="Upload cover image" />
                  <span className={styles.dropzoneIcon}>
                    <ImagePlus size={17} aria-hidden="true" />
                  </span>
                  <strong>{form.cover ? form.cover.name : "Drop an image here or browse"}</strong>
                  <span>{form.cover ? `${Math.round(form.cover.size / 1024)} KB · will upload on save` : form.cover_image_url ? "Uploading a new image replaces the current one" : "JPG, PNG or WebP"}</span>
                </div>
                {form.cover || form.cover_image_url ? (
                  <div className={styles.fieldWide}>
                    <button type="button" className={cx(styles.btn, styles.btnGhost, styles.btnSm)} onClick={() => setForm((current) => ({ ...current, cover: null, cover_image_url: "" }))}>
                      <Trash2 size={14} aria-hidden="true" />
                      Remove cover image
                    </button>
                  </div>
                ) : null}
              </FormSection>

              <FormSection title="Visibility" description="Drafts are only visible here. Publish when the details are ready.">
                <div className={styles.fieldWide}>
                  <Switch
                    name="status"
                    checked={published}
                    onChange={onChange}
                    title="Published on the website"
                    description={published ? "Devotees can see this event on the Events page" : "Draft · hidden from devotees"}
                  />
                </div>
              </FormSection>
            </Panel>

            <Panel title="Photos">
              <div className={styles.panelBody}>
                {form.id ? (
                  <div className={own.photoLink}>
                    <PhotoMeter count={images.length} />
                    <span>
                      {images.length} of {EVENT_IMAGE_LIMIT} photos · added and described on the Gallery page
                    </span>
                    <NavLink to={`/${lang}/${role}/gallery/${form.id}`} className={cx(styles.btn, styles.btnSecondary, styles.btnSm)}>
                      Manage photos
                      <ArrowRight size={14} aria-hidden="true" />
                    </NavLink>
                  </div>
                ) : (
                  <EmptyState compact icon={Images} title="Save the event first" text={`Then add up to ${EVENT_IMAGE_LIMIT} photos, each with an optional description, from the Gallery page.`} />
                )}
              </div>
            </Panel>
          </div>

          <div className={styles.sticky}>
            <Panel title="Preview" action={<Segmented label="Preview language" value={previewLang} onChange={setPreviewLang} options={[{ value: "en", label: "English" }, { value: "kn", label: "ಕನ್ನಡ" }]} />}>
              <div className={styles.previewCard} lang={previewLang}>
                {preview ? (
                  <img className={styles.previewImage} src={preview} alt="" />
                ) : (
                  <div className={cx(styles.previewImage, styles.previewImageEmpty)}>
                    <ImageOff size={22} aria-hidden="true" />
                    <span>No cover yet · a kshetra photo is used</span>
                  </div>
                )}
                <div className={styles.previewBody}>
                  <div className={styles.cellRow}>
                    {published ? <Badge tone="success">Published</Badge> : <Badge tone="neutral">Draft</Badge>}
                    <Badge plain>{CATEGORY_LABELS[form.category]}</Badge>
                    {missingKannada ? <Badge tone="warning">Kannada incomplete</Badge> : null}
                  </div>
                  <h3>{pick(form.title, form.title_kn) || "Event name"}</h3>
                  <span className={own.previewDate}>{previewRange}</span>
                  <p>{pick(form.summary, form.summary_kn) || "The summary appears here."}</p>
                  {form.highlights.length || form.details.length || images.length ? (
                    <span className={own.previewMeta}>
                      {[
                        form.highlights.length ? `${form.highlights.length} highlight${form.highlights.length === 1 ? "" : "s"}` : null,
                        form.details.length ? `${form.details.length} extra field${form.details.length === 1 ? "" : "s"}` : null,
                        images.length ? `${images.length} photo${images.length === 1 ? "" : "s"}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  ) : null}
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {dirty || saving ? (
          <div className={styles.saveBar}>
            <span className={styles.saveBarText}>
              {isEdit ? "Unsaved changes" : "New event"} · {published ? "goes live when saved" : "saves as a draft"}
            </span>
            <div className={styles.pageActions}>
              <NavLink to={listPath} className={cx(styles.btn, styles.btnGhost)}>
                Cancel
              </NavLink>
              <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
                {saving ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                {saving ? "Saving…" : isEdit ? "Save changes" : published ? "Publish event" : "Save draft"}
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </Page>
  );
}
