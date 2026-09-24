import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { FileQuestion, ImageOff, ImagePlus, LoaderCircle, Save } from "lucide-react";
import { sevaImageUrl } from "../sevaHelpers";
import { formatAmount, sectionPath } from "./rolePortalConfig";
import { Badge, EmptyState, Field, FormSection, Page, PageHeader, Panel, Segmented, Skeleton, Switch } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

function usePreviewUrl(file, savedUrl) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => objectUrl && URL.revokeObjectURL(objectUrl), [objectUrl]);
  return objectUrl || (savedUrl ? sevaImageUrl({ photo_url: savedUrl }, null) : null);
}

const TRACKED = ["name", "description", "name_kn", "description_kn", "amount", "enabled"];

function isDirty(form, baseline) {
  if (form.photo) return true;
  return TRACKED.some((field) => String(form[field] ?? "") !== String(baseline?.[field] ?? ""));
}

export default function SevaEditorPage({ lang, role, isEdit, notFound, loading, sevaForm, sevaBaseline, onSevaChange, onSaveSeva, saving }) {
  const [previewLang, setPreviewLang] = useState("en");
  const [dragging, setDragging] = useState(false);
  const preview = usePreviewUrl(sevaForm.photo, sevaForm.photo_url);
  const catalogPath = sectionPath(lang, role, "sevas");
  const back = { to: catalogPath, label: "Seva catalog" };

  if (notFound) {
    return (
      <Page>
        <PageHeader back={back} title="Seva not found" />
        <Panel>
          <EmptyState
            icon={FileQuestion}
            title="This seva is not in the catalog"
            text="It may have been removed, or the link is out of date. Pick it again from the catalog."
            action={
              <NavLink to={catalogPath} className={cx(styles.btn, styles.btnSecondary)}>
                Open the catalog
              </NavLink>
            }
          />
        </Panel>
      </Page>
    );
  }

  if (loading) {
    return (
      <Page>
        <PageHeader back={back} title="Edit seva" />
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

  const previewName = previewLang === "kn" ? sevaForm.name_kn || sevaForm.name : sevaForm.name;
  const previewText = previewLang === "kn" ? sevaForm.description_kn || sevaForm.description : sevaForm.description;

  return (
    <Page>
      <PageHeader
        back={back}
        title={isEdit ? sevaForm.name || "Edit seva" : "New seva"}
        description={isEdit ? "Changes appear on the public seva page as soon as you save." : "Add a seva to the catalog. Devotees can book it online once it is open and has an amount."}
      />

      <form onSubmit={onSaveSeva} className={styles.stack}>
        <div className={styles.split}>
          <Panel>
            <FormSection title="Details" description="What devotees read first on the seva page.">
              <Field label="Seva name" aside="English">
                <input className={styles.input} name="name" value={sevaForm.name} onChange={onSevaChange} required placeholder="e.g. Rudrabhisheka" />
              </Field>
              <Field label="Amount" hint="Leave empty for sevas booked only at the kshetra.">
                <span className={styles.inputAffix}>
                  <span className={styles.affix}>₹</span>
                  <input className={styles.input} type="number" min="0" step="0.01" name="amount" value={sevaForm.amount} onChange={onSevaChange} placeholder="0" inputMode="decimal" />
                </span>
              </Field>
              <Field label="Description" aside={`${sevaForm.description.length} characters`} wide>
                <textarea className={styles.textarea} name="description" value={sevaForm.description} onChange={onSevaChange} rows={4} required placeholder="What the seva is, and what it offers the devotee" />
              </Field>
            </FormSection>

            <FormSection title="Kannada" description="Shown to devotees who read the site in Kannada. Every seva should have both.">
              <Field label="Seva name" aside="ಕನ್ನಡ">
                <input className={styles.input} name="name_kn" value={sevaForm.name_kn} onChange={onSevaChange} lang="kn" placeholder="ಸೇವೆಯ ಹೆಸರು" />
              </Field>
              <Field label="Description" aside="ಕನ್ನಡ" wide>
                <textarea className={styles.textarea} name="description_kn" value={sevaForm.description_kn} onChange={onSevaChange} rows={4} lang="kn" placeholder="ಸೇವೆಯ ವಿವರಣೆ" />
              </Field>
            </FormSection>

            <FormSection title="Image" description="A clear photo of the seva or the deity. It is cropped to a wide frame.">
              <div
                className={cx(styles.dropzone, styles.fieldWide, dragging && styles.dropzoneActive)}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
              >
                <input type="file" name="photo" accept="image/*" onChange={onSevaChange} aria-label="Upload seva image" />
                <span className={styles.dropzoneIcon}>
                  <ImagePlus size={17} aria-hidden="true" />
                </span>
                <span>
                  <strong>{sevaForm.photo ? sevaForm.photo.name : "Drop an image here or browse"}</strong>
                </span>
                <span>{sevaForm.photo ? `${Math.round(sevaForm.photo.size / 1024)} KB · will upload on save` : sevaForm.photo_url ? "Uploading a new image replaces the current one" : "JPG, PNG or WebP"}</span>
              </div>
            </FormSection>

            <FormSection title="Availability" description="Turning a seva off hides it from online booking. Existing bookings stay.">
              <div className={styles.fieldWide}>
                <Switch
                  name="enabled"
                  checked={sevaForm.enabled}
                  onChange={onSevaChange}
                  title="Open for online booking"
                  description={sevaForm.enabled ? "Devotees can book this seva on the site" : "Hidden from the public catalog"}
                />
              </div>
            </FormSection>
          </Panel>

          <div className={styles.sticky}>
            <Panel title="Preview" action={<Segmented label="Preview language" value={previewLang} onChange={setPreviewLang} options={[{ value: "en", label: "English" }, { value: "kn", label: "ಕನ್ನಡ" }]} />}>
              <div className={styles.previewCard} lang={previewLang}>
                {preview ? (
                  <img className={styles.previewImage} src={preview} alt="" />
                ) : (
                  <div className={cx(styles.previewImage, styles.previewImageEmpty)}>
                    <ImageOff size={22} aria-hidden="true" />
                    <span>No image yet</span>
                  </div>
                )}
                <div className={styles.previewBody}>
                  <div className={styles.cellRow}>
                    {sevaForm.enabled ? <Badge tone="success">Open</Badge> : <Badge tone="neutral">Off</Badge>}
                    {!sevaForm.name_kn ? <Badge tone="warning">No Kannada name</Badge> : null}
                  </div>
                  <h3>{previewName || "Seva name"}</h3>
                  <p>{previewText || "The description appears here."}</p>
                  <span className={styles.previewAmount}>{formatAmount(sevaForm.amount)}</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {isDirty(sevaForm, sevaBaseline) || saving ? (
          <div className={styles.saveBar}>
            <span className={styles.saveBarText}>
              {isEdit ? "Unsaved changes" : "New seva"} · saved changes go live straight away
            </span>
            <div className={styles.pageActions}>
              <NavLink to={catalogPath} className={cx(styles.btn, styles.btnGhost)}>
                Cancel
              </NavLink>
              <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
                {saving ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <Save size={15} aria-hidden="true" />}
                {saving ? "Saving…" : isEdit ? "Save changes" : "Add seva"}
              </button>
            </div>
          </div>
        ) : null}
      </form>
    </Page>
  );
}
