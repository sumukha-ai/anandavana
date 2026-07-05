import { Link, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import styles from "./RolePages.module.css";

const roleLinks = {
  Admin: [
    { to: "admin", label: "Admin" },
    { to: "manager", label: "Manager" },
    { to: "priest", label: "Priest" },
  ],
  Manager: [
    { to: "manager", label: "Manager" },
    { to: "priest", label: "Priest" },
  ],
  Priest: [{ to: "priest", label: "Priest" }],
  User: [],
};

export default function Dashboard() {
  const { user } = useAuth();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const links = roleLinks[user?.role] || [];

  return (
    <section className={styles.pageShell}>
      <div className={styles.panel}>
        <span className={styles.kicker}>Account</span>
        <h1>Welcome, {user?.username}</h1>
        <p className={styles.lead}>Signed in as {user?.role}.</p>

        {links.length ? (
          <div className={styles.actions}>
            {links.map((item) => (
              <Link key={item.to} to={`/${lang}/${item.to}`} className={styles.actionLink}>
                <ShieldCheck size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
