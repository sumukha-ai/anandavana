import { useAuth } from "../auth/AuthContext";
import styles from "./RolePages.module.css";

const pageCopy = {
  Admin: {
    title: "Admin workspace",
    text: "Manage users, roles, access, and operational settings.",
  },
  Manager: {
    title: "Manager workspace",
    text: "Coordinate bookings, events, public content, and staff workflows.",
  },
  Priest: {
    title: "Priest workspace",
    text: "Review seva schedules, devotee requests, and ritual assignments.",
  },
};

export default function RolePortal({ role }) {
  const { user } = useAuth();
  const copy = pageCopy[role];

  return (
    <section className={styles.pageShell}>
      <div className={styles.panel}>
        <span className={styles.kicker}>{role}</span>
        <h1>{copy.title}</h1>
        <p className={styles.lead}>{copy.text}</p>
        <div className={styles.metaGrid}>
          <div>
            <span>Name</span>
            <strong>{user?.username}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user?.email}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{user?.role}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
