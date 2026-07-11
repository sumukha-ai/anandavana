import styles from "./RolePortal.module.css";

export default function UsersPage({ users }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.sectionEyebrow}>People</span>
        <h2 className={styles.panelTitle}>User accounts</h2>
      </div>
      {users.length ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
              </tr>
            </thead>
            <tbody>
              {users.map((account) => (
                <tr key={account.id}>
                  <td className={styles.tableStrong}>{account.username}</td>
                  <td>{account.email}</td>
                  <td><span className={styles.statusPill}>{account.role}</span></td>
                  <td>{account.is_verified ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>No accounts found.</div>
      )}
    </section>
  );
}
