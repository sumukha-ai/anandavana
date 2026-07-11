import { ImagePlus, Save } from "lucide-react";
import styles from "./RolePortal.module.css";

export default function SevaEditorPage({ sevaForm, onSevaChange, onSaveSeva }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.sectionEyebrow}>Catalog</span>
        <h2 className={styles.panelTitle}>{sevaForm.id ? "Edit seva" : "Add seva"}</h2>
      </div>
      <form className={styles.formGrid} onSubmit={onSaveSeva}>
        <label className={styles.field}>
          <span>English name</span>
          <input name="name" value={sevaForm.name} onChange={onSevaChange} required />
        </label>
        <label className={styles.field}>
          <span>Amount</span>
          <input type="number" min="0" step="0.01" name="amount" value={sevaForm.amount} onChange={onSevaChange} />
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>English description</span>
          <textarea name="description" value={sevaForm.description} onChange={onSevaChange} rows={3} required />
        </label>
        <label className={styles.field}>
          <span>Kannada name</span>
          <input name="name_kn" value={sevaForm.name_kn} onChange={onSevaChange} />
        </label>
        <label className={styles.field}>
          <span>Image</span>
          <input type="file" name="photo" accept="image/*" onChange={onSevaChange} />
          <span className={styles.fileMeta}>
            <ImagePlus size={15} aria-hidden="true" />
            {sevaForm.photo?.name || (sevaForm.photo_url ? "Saved image" : "No image selected")}
          </span>
          {sevaForm.photo_url ? (
            <a className={styles.inlineLink} href={sevaForm.photo_url} target="_blank" rel="noreferrer">
              View current image
            </a>
          ) : null}
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Kannada description</span>
          <textarea name="description_kn" value={sevaForm.description_kn} onChange={onSevaChange} rows={3} />
        </label>
        <label className={styles.checkField}>
          <input type="checkbox" name="enabled" checked={sevaForm.enabled} onChange={onSevaChange} />
          <span>Enabled</span>
        </label>
        <button type="submit" className={styles.primaryButton}>
          <Save size={17} aria-hidden="true" />
          Save seva
        </button>
      </form>
    </section>
  );
}
