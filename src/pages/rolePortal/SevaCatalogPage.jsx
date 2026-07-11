import { Plus } from "lucide-react";
import { formatAmount } from "./rolePortalConfig";
import styles from "./SevaCatalogPage.module.css";

export default function SevaCatalogPage({ sevas, canManage, onEditSeva, onAddSeva }) {
  // Dynamically switch grid templates based on whether the "Action" column exists
  const rowLayoutClass = canManage ? styles.rowManage : styles.rowView;

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeaderSplit}>
        <div className={styles.titleBlock}>
          <span className={styles.sectionEyebrow}>Catalog</span>
          <h2 className={styles.panelTitle}>Seva catalog</h2>
        </div>
        {canManage ? (
          <button type="button" className={styles.primaryButton} onClick={onAddSeva}>
            <Plus size={17} aria-hidden="true" />
            Add seva
          </button>
        ) : null}
      </div>

      {sevas.length ? (
        <div className={styles.listContainer}>
          {/* Desktop Header */}
          <div className={`${styles.listHeader} ${rowLayoutClass}`}>
            <div className={styles.col}>Name</div>
            <div className={styles.col}>Amount</div>
            <div className={styles.col}>Enabled</div>
            <div className={styles.col}>Kannada</div>
            {canManage ? <div className={styles.col}>Action</div> : null}
          </div>

          {/* List Body */}
          <div className={styles.listBody}>
            {sevas.map((seva) => (
              <div key={seva.id} className={`${styles.row} ${rowLayoutClass}`}>
                <div className={styles.col} data-label="Name">
                  <span className={styles.nameText}>{seva.name}</span>
                </div>
                <div className={styles.col} data-label="Amount">
                  <span className={styles.amountText}>{formatAmount(seva.amount)}</span>
                </div>
                <div className={styles.col} data-label="Enabled">
                  <span className={seva.enabled ? styles.statusYes : styles.statusNo}>
                    {seva.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className={styles.col} data-label="Kannada">
                  <span className={seva.name_kn ? styles.kannadaText : styles.missingText}>
                    {seva.name_kn || "Missing"}
                  </span>
                </div>
                {canManage ? (
                  <div className={styles.col} data-label="Action">
                    <button
                      type="button"
                      className={styles.linkButton}
                      onClick={() => onEditSeva(seva)}
                    >
                      Edit
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No sevas found.</p>
        </div>
      )}
    </section>
  );
}