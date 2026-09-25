import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, FileQuestion, Images, LoaderCircle, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import { apiRequest } from "../../api/client";
import { EVENT_IMAGE_LIMIT, eventImageUrl, formatEventRange } from "../events/eventUtils";
import { PhotoMeter } from "./GalleryPage";
import { sectionPath } from "./rolePortalConfig";
import { Badge, EmptyState, Page, PageHeader, Panel, Skeleton } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./EventsConsole.module.css";

const DESCRIPTION_MAX = 500;

let stagedCounter = 0;

function StagedPhoto({ item, index, onChange, onRemove, disabled }) {
  const preview = useMemo(() => URL.createObjectURL(item.file), [item.file]);
  useEffect(() => () => URL.revokeObjectURL(preview), [preview]);

  return (
    <li className={own.photoCard}>
      <div className={own.photoMedia}>
        <img src={preview} alt="" />
        <span className={own.photoIndex}>New</span>
        <button type="button" className={own.galleryRemove} onClick={onRemove} disabled={disabled} aria-label={`Do not upload ${item.file.name}`}>
          <X size={14} aria-hidden="true" />
        </button>
      </div>
      <div className={own.photoFields}>
        <textarea
          className={styles.textarea}
          rows={2}
          maxLength={DESCRIPTION_MAX}
          value={item.description}
          onChange={(event) => onChange({ description: event.target.value })}
          placeholder="Description (optional)"
          aria-label={`Description for new photo ${index + 1}`}
          disabled={disabled}
        />
        <textarea
          className={styles.textarea}
          rows={2}
          maxLength={DESCRIPTION_MAX}
          value={item.description_kn}
          onChange={(event) => onChange({ description_kn: event.target.value })}
          placeholder="ವಿವರಣೆ (ಐಚ್ಛಿಕ)"
          lang="kn"
          aria-label={`Kannada description for new photo ${index + 1}`}
          disabled={disabled}
        />
      </div>
    </li>
  );
}

function SavedPhoto({ image, index, total, onMove, onSave, onDelete, busy }) {
  const [draft, setDraft] = useState({ description: image.description_en || "", description_kn: image.description_kn || "" });
  const [saving, setSaving] = useState(false);
  const dirty = draft.description !== (image.description_en || "") || draft.description_kn !== (image.description_kn || "");

  const save = async () => {
    setSaving(true);
    await onSave(image, draft);
    setSaving(false);
  };

  return (
    <li className={own.photoCard}>
      <div className={own.photoMedia}>
        <img src={eventImageUrl(image.url)} alt="" loading="lazy" />
        <span className={own.photoIndex}>{index + 1}</span>
        <button type="button" className={own.galleryRemove} onClick={() => onDelete(image)} disabled={busy} aria-label={`Delete photo ${index + 1}`}>
          <Trash2 size={13} aria-hidden="true" />
        </button>
      </div>
      <div className={own.photoFields}>
        <textarea
          className={styles.textarea}
          rows={2}
          maxLength={DESCRIPTION_MAX}
          value={draft.description}
          onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
          placeholder="Description (optional)"
          aria-label={`Description for photo ${index + 1}`}
        />
        <textarea
          className={styles.textarea}
          rows={2}
          maxLength={DESCRIPTION_MAX}
          value={draft.description_kn}
          onChange={(event) => setDraft((current) => ({ ...current, description_kn: event.target.value }))}
          placeholder="ವಿವರಣೆ (ಐಚ್ಛಿಕ)"
          lang="kn"
          aria-label={`Kannada description for photo ${index + 1}`}
        />
      </div>
      <div className={own.photoActions}>
        <div className={own.photoOrder}>
          <button type="button" className={styles.iconButton} onClick={() => onMove(index, -1)} disabled={busy || index === 0} aria-label={`Move photo ${index + 1} earlier`} title="Move earlier">
            <ArrowLeft size={14} aria-hidden="true" />
          </button>
          <button type="button" className={styles.iconButton} onClick={() => onMove(index, 1)} disabled={busy || index === total - 1} aria-label={`Move photo ${index + 1} later`} title="Move later">
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
        {dirty ? (
          <button type="button" className={cx(styles.btn, styles.btnPrimary, styles.btnSm)} onClick={save} disabled={saving}>
            {saving ? <LoaderCircle size={13} className={styles.spin} aria-hidden="true" /> : <Save size={13} aria-hidden="true" />}
            Save
          </button>
        ) : null}
      </div>
    </li>
  );
}

export default function GalleryEventPage({ lang, role, token, eventId, notify, onTitle }) {
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [state, setState] = useState("loading");
  const [staged, setStaged] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const listPath = sectionPath(lang, role, "gallery");
  const back = { to: listPath, label: "Gallery" };

  useEffect(() => {
    let active = true;
    apiRequest(`/events/${eventId}`, { token })
      .then((data) => {
        if (!active) return;
        setEvent(data.event);
        setImages(data.event.images || []);
        setState("ready");
      })
      .catch((err) => {
        if (!active) return;
        setState(err.status === 404 ? "missing" : "error");
        if (err.status !== 404) notify("error", "Could not load the event", err.message);
      });
    return () => {
      active = false;
    };
  }, [eventId, notify, token]);

  useEffect(() => {
    onTitle?.(event ? event.title_en || event.title : "");
  }, [event, onTitle]);

  useEffect(() => {
    if (!staged.length) return undefined;
    const warn = (unloadEvent) => {
      unloadEvent.preventDefault();
      unloadEvent.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [staged.length]);

  const remaining = EVENT_IMAGE_LIMIT - images.length - staged.length;

  const stage = (fileList) => {
    const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
    if (inputRef.current) inputRef.current.value = "";
    if (!files.length) return;
    const accepted = files.slice(0, Math.max(0, remaining));
    if (accepted.length < files.length) {
      notify(
        "error",
        `Only ${EVENT_IMAGE_LIMIT} photos per event`,
        accepted.length ? `Added the first ${accepted.length}. ${files.length - accepted.length} were left out.` : "Remove a photo to make room for another."
      );
    }
    setStaged((current) => [...current, ...accepted.map((file) => ({ key: `staged-${(stagedCounter += 1)}`, file, description: "", description_kn: "" }))]);
  };

  const upload = async () => {
    if (!staged.length) return;
    setUploading(true);
    const payload = new FormData();
    staged.forEach((item) => {
      payload.append("images", item.file);
      payload.append("description", item.description.trim());
      payload.append("description_kn", item.description_kn.trim());
    });
    try {
      const data = await apiRequest(`/events/${eventId}/images`, { method: "POST", token, body: payload });
      setImages((current) => [...current, ...(data.images || [])]);
      setStaged([]);
      notify("success", staged.length === 1 ? "Photo added" : `${staged.length} photos added`, event.status === "published" ? "They are live in the gallery." : "They will show once the event is published.");
    } catch (err) {
      notify("error", "Could not upload the photos", err.message);
    } finally {
      setUploading(false);
    }
  };

  const saveDescription = async (image, draft) => {
    try {
      const data = await apiRequest(`/events/${eventId}/images/${image.id}`, {
        method: "PATCH",
        token,
        body: { description: draft.description.trim(), description_kn: draft.description_kn.trim() },
      });
      setImages((current) => current.map((item) => (item.id === image.id ? data.image : item)));
      notify("success", "Description saved", "");
    } catch (err) {
      notify("error", "Could not save the description", err.message);
    }
  };

  const move = async (index, step) => {
    const target = index + step;
    if (target < 0 || target >= images.length) return;
    const previous = images;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    setBusy(true);
    try {
      await apiRequest(`/events/${eventId}/images/order`, { method: "PUT", token, body: { image_ids: next.map((image) => image.id) } });
    } catch (err) {
      setImages(previous);
      notify("error", "Could not change the order", err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (image) => {
    if (!window.confirm("Delete this photo? It is removed from the website straight away.")) return;
    setBusy(true);
    try {
      await apiRequest(`/events/${eventId}/images/${image.id}`, { method: "DELETE", token });
      setImages((current) => current.filter((item) => item.id !== image.id));
      notify("success", "Photo deleted", "");
    } catch (err) {
      notify("error", "Could not delete the photo", err.message);
    } finally {
      setBusy(false);
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
                Back to gallery
              </NavLink>
            }
          />
        </Panel>
      </Page>
    );
  }

  if (state !== "ready") {
    return (
      <Page>
        <PageHeader back={back} title="Photos" />
        <Panel>
          <div className={cx(styles.panelBody, own.photoGrid)}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} height={180} />
            ))}
          </div>
        </Panel>
      </Page>
    );
  }

  const isFull = images.length >= EVENT_IMAGE_LIMIT;

  return (
    <Page>
      <PageHeader
        back={back}
        title={event.title_en || event.title}
        description={`${formatEventRange(event, "en")} · Up to ${EVENT_IMAGE_LIMIT} photos, each with an optional description. They show on the Gallery page and on the event page in this order.`}
        actions={
          <>
            <NavLink to={`/${lang}/${role}/events/${event.id}`} className={cx(styles.btn, styles.btnSecondary)}>
              <Pencil size={15} aria-hidden="true" />
              Edit event
            </NavLink>
            {event.status === "published" ? (
              <a href={`/${lang}/events/${event.slug}`} target="_blank" rel="noreferrer" className={cx(styles.btn, styles.btnSecondary)}>
                <ExternalLink size={15} aria-hidden="true" />
                View on website
              </a>
            ) : null}
          </>
        }
      />

      <div className={own.capacity}>
        <PhotoMeter count={images.length} />
        <span>
          <strong>
            {images.length} of {EVENT_IMAGE_LIMIT} photos
          </strong>
          {" · "}
          {isFull ? "Full. Delete a photo to add another." : `${EVENT_IMAGE_LIMIT - images.length} more can be added`}
        </span>
        {event.status === "draft" ? <Badge tone="neutral">Event is a draft · photos are not public yet</Badge> : null}
      </div>

      <Panel title="Photos" meta={images.length || undefined}>
        <div className={styles.panelBody}>
          {images.length ? (
            <ul className={own.photoGrid}>
              {images.map((image, index) => (
                <SavedPhoto key={image.id} image={image} index={index} total={images.length} onMove={move} onSave={saveDescription} onDelete={remove} busy={busy || uploading} />
              ))}
            </ul>
          ) : (
            <EmptyState compact icon={Images} title="No photos yet" text={`Add up to ${EVENT_IMAGE_LIMIT} photos below. The first photo leads the album.`} />
          )}
        </div>
      </Panel>

      <Panel title="Add photos" meta={isFull ? "Full" : `${Math.max(0, remaining)} left`}>
        <div className={cx(styles.panelBody, styles.stack)}>
          {isFull ? (
            <p className={own.fullNote}>This event already has {EVENT_IMAGE_LIMIT} photos. Delete one above to make room.</p>
          ) : remaining > 0 ? (
            <div
              className={cx(styles.dropzone, dragging && styles.dropzoneActive)}
              onDragEnter={() => setDragging(true)}
              onDragLeave={() => setDragging(false)}
              onDrop={() => setDragging(false)}
            >
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={(changeEvent) => stage(changeEvent.target.files)} disabled={uploading} aria-label="Choose photos to add" />
              <span className={styles.dropzoneIcon}>
                <Images size={17} aria-hidden="true" />
              </span>
              <strong>Drop photos here or browse</strong>
              <span>
                You can choose {remaining} more. Add a description to each before uploading, or later.
              </span>
            </div>
          ) : null}

          {staged.length ? (
            <>
              <ul className={own.photoGrid}>
                {staged.map((item, index) => (
                  <StagedPhoto
                    key={item.key}
                    item={item}
                    index={index}
                    disabled={uploading}
                    onChange={(patch) => setStaged((current) => current.map((row) => (row.key === item.key ? { ...row, ...patch } : row)))}
                    onRemove={() => setStaged((current) => current.filter((row) => row.key !== item.key))}
                  />
                ))}
              </ul>
              <div className={own.uploadBar}>
                <span>
                  {staged.length} photo{staged.length === 1 ? "" : "s"} ready · {images.length + staged.length} of {EVENT_IMAGE_LIMIT} after upload
                </span>
                <div className={styles.pageActions}>
                  <button type="button" className={cx(styles.btn, styles.btnGhost)} onClick={() => setStaged([])} disabled={uploading}>
                    Clear
                  </button>
                  <button type="button" className={cx(styles.btn, styles.btnPrimary)} onClick={upload} disabled={uploading}>
                    {uploading ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <Upload size={15} aria-hidden="true" />}
                    {uploading ? "Uploading…" : `Upload ${staged.length} photo${staged.length === 1 ? "" : "s"}`}
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </Panel>
    </Page>
  );
}
