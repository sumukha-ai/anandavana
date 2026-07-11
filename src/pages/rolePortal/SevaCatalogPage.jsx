import { Plus } from "lucide-react";
import { formatAmount } from "./rolePortalConfig";
import styles from "./RolePortal.module.css";

export default function SevaCatalogPage({ sevas, canManage, onEditSeva, onAddSeva }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeaderSplit}>
        <div>
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
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>Enabled</th>
                <th>Kannada</th>
                {canManage ? <th>Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {sevas.map((seva) => (
                <tr key={seva.id}>
                  <td className={styles.tableStrong}>{seva.name}</td>
                  <td>{formatAmount(seva.amount)}</td>
                  <td><span className={styles.statusPill}>{seva.enabled ? "Enabled" : "Disabled"}</span></td>
                  <td>{seva.name_kn || "Missing"}</td>
                  {canManage ? (
                    <td>
                      <button type="button" className={styles.linkButton} onClick={() => onEditSeva(seva)}>
                        Edit
                      </button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>No sevas found.</div>
      )}
    </section>
  );
}
