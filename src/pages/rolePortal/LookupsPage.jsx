import { Save } from "lucide-react";
import { displayLookup } from "./rolePortalConfig";
import styles from "./LookupsPage.module.css";

export default function LookupsPage({ lang, lookups, lookupForm, onLookupChange, onSaveLookup }) {
  return (
    <div className={styles.stackList}>
      {/* Form Section */}
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.sectionEyebrow}>Jyotisha references</span>
          <h2 className={styles.panelTitle}>Rashi and Nakshatra</h2>
        </div>
        
        <form onSubmit={onSaveLookup}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Type</span>
              <select name="kind" value={lookupForm.kind} onChange={onLookupChange}>
                <option value="rashi">Rashi</option>
                <option value="nakshatra">Nakshatra</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>English name</span>
              <input name="name" value={lookupForm.name} onChange={onLookupChange} required />
            </label>
            <label className={styles.field}>
              <span>Kannada name</span>
              <input name="name_kn" value={lookupForm.name_kn} onChange={onLookupChange} required />
            </label>
          </div>
          
          {/* Button is now completely outside the grid */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton}>
              <Save size={18} aria-hidden="true" />
              Save lookup
            </button>
          </div>
        </form>
      </section>

      {/* Lookups Lists Section */}
      <div className={styles.lookupGrid}>
        {[
          ["Rashis", lookups.rashis],
          ["Nakshatras", lookups.nakshatras],
        ].map(([title, items]) => (
          <section key={title} className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>{title}</h2>
            </div>
            <div className={styles.lookupChips}>
              {items.map((item) => (
                <span key={item.id} className={styles.softPill}>
                  {displayLookup(item, lang)}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}