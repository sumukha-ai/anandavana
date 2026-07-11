import styles from "./UsersPage.module.css";

export default function UsersPage({ users }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.sectionEyebrow}>People</span>
        <h2 className={styles.panelTitle}>User accounts</h2>
      </div>
      
      {users.length ? (
        <div className={styles.listContainer}>
          {/* Desktop Header */}
          <div className={styles.listHeader}>
            <div className={styles.col}>Username</div>
            <div className={styles.col}>Email</div>
            <div className={styles.col}>Role</div>
            <div className={styles.col}>Verified</div>
          </div>
          
          {/* List Body */}
          <div className={styles.listBody}>
            {users.map((account) => (
              <div key={account.id} className={styles.row}>
                <div className={styles.col} data-label="Username">
                  <span className={styles.username}>{account.username}</span>
                </div>
                <div className={styles.col} data-label="Email">
                  <span className={styles.email}>{account.email}</span>
                </div>
                <div className={styles.col} data-label="Role">
                  <span className={styles.rolePill}>{account.role}</span>
                </div>
                <div className={styles.col} data-label="Verified">
                  <span className={account.is_verified ? styles.statusYes : styles.statusNo}>
                    {account.is_verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>No accounts found.</p>
        </div>
      )}
    </section>
  );
}