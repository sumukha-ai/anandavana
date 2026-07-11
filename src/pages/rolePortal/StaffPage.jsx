import { UserRoundPlus } from "lucide-react";
import styles from "./RolePortal.module.css";

export default function StaffPage({ staffForm, onStaffChange, onCreateStaff }) {
  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <span className={styles.sectionEyebrow}>Access</span>
        <h2 className={styles.panelTitle}>Create priest or manager login</h2>
      </div>
      <form className={styles.formGrid} onSubmit={onCreateStaff}>
        <label className={styles.field}>
          <span>Username</span>
          <input name="username" value={staffForm.username} onChange={onStaffChange} required />
        </label>
        <label className={styles.field}>
          <span>Email</span>
          <input type="email" name="email" value={staffForm.email} onChange={onStaffChange} required />
        </label>
        <label className={styles.field}>
          <span>Password</span>
          <input type="password" name="password" value={staffForm.password} onChange={onStaffChange} minLength={8} required />
        </label>
        <label className={styles.field}>
          <span>Role</span>
          <select name="role" value={staffForm.role} onChange={onStaffChange}>
            <option value="priest">Priest</option>
            <option value="manager">Manager</option>
          </select>
        </label>
        <button type="submit" className={styles.primaryButton}>
          <UserRoundPlus size={17} aria-hidden="true" />
          Create staff account
        </button>
      </form>
    </section>
  );
}
