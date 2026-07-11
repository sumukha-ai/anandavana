import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Drawer } from "@mui/material";
import { Menu, X } from "lucide-react";
import { getGroupedMenuItems, roleCopy, sectionMeta } from "./rolePortalConfig";
import styles from "./RolePortal.module.css";

const drawerWidth = 292;

export default function RoleShell({ role, lang, section, user, status, error, titleOverride, textOverride, onClearStatus, onClearError, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const meta = sectionMeta[section] || sectionMeta.overview;
  const copy = roleCopy[role];
  const groupedMenuItems = getGroupedMenuItems(role);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const drawerContent = (
    <div className={styles.drawerSurface}>
      <div className={styles.drawerHeader}>
        <div className={styles.drawerTopline}>
          <span className={styles.rolePill}>{role}</span>
          {isMobile ? (
            <button type="button" className={styles.closeButton} onClick={() => setMobileOpen(false)} aria-label="Close navigation">
              <X size={18} aria-hidden="true" />
            </button>
          ) : null}
        </div>
        <strong className={styles.drawerTitle}>Samsthana operations</strong>
        <p className={styles.drawerText}>Focused pages grouped by workflow</p>
      </div>

      <div className={styles.drawerDivider} />

      <nav className={styles.drawerNav} aria-label={`${role} workspace pages`}>
        {Object.entries(groupedMenuItems).map(([group, items]) => (
          <div key={group} className={styles.navGroup}>
            <span className={styles.navGroupLabel}>{group}</span>
            {items.map((item) => {
              const itemMeta = sectionMeta[item];
              const Icon = itemMeta.icon;
              const target = item === "overview" ? `/${lang}/${role}` : `/${lang}/${role}/${item}`;
              return (
                <NavLink
                  key={item}
                  to={target}
                  end={item === "overview"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{itemMeta.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.drawerFooter}>
        <div className={styles.currentPage}>
          <span>Current page</span>
          <strong>{meta.label}</strong>
        </div>
      </div>
    </div>
  );

  return (
    <section className={styles.shell}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: { md: drawerWidth },
          flexShrink: 0,
          zIndex: { xs: 1300, md: 900 },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: 0,
            boxSizing: "border-box",
            height: "100%",
            pt: { xs: 0, md: "73px" },
            bgcolor: "#18243a",
            zIndex: { xs: 1300, md: 900 },
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <main className={styles.content}>
        <div className={styles.workspace}>
          <header className={styles.heroPanel}>
            <div className={styles.heroInner}>
              <div className={styles.heroTitleBlock}>
                {isMobile ? (
                  <button type="button" className={styles.menuButton} onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                    <Menu size={20} aria-hidden="true" />
                  </button>
                ) : null}
                <div>
                  <div className={styles.breadcrumb} aria-label="Breadcrumb">
                    <span>{role}</span>
                    <span>/</span>
                    <span className={styles.breadcrumbCurrent}>{meta.label}</span>
                  </div>
                  <span className={styles.sectionEyebrow}>{meta.eyebrow}</span>
                  <h1 className={styles.heroTitle}>{titleOverride || (section === "overview" ? copy.title : meta.label)}</h1>
                  <p className={styles.heroText}>
                    {textOverride || (section === "overview" ? copy.text : `Manage ${meta.label.toLowerCase()} from its own focused page.`)}
                  </p>
                </div>
              </div>

              <div className={styles.userPills}>
                <span className={styles.userPill}>{user?.username || "User"}</span>
                <span className={styles.userPill}>{user?.email || "No email"}</span>
              </div>
            </div>
          </header>

          {status ? (
            <button type="button" className={styles.alertSuccess} onClick={onClearStatus}>
              {status}
            </button>
          ) : null}
          {error ? (
            <button type="button" className={styles.alertError} onClick={onClearError}>
              {error}
            </button>
          ) : null}

          {children}
        </div>
      </main>
    </section>
  );
}
