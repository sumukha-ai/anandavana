import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { ListFilter, LoaderCircle, ShieldCheck, UserRoundPlus, UsersRound } from "lucide-react";
import { normalizeRole } from "../../auth/access";
import { sectionMeta, sectionPath } from "./rolePortalConfig";
import { Avatar, Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const roleLabel = { admin: "Admin", manager: "Manager", priest: "Priest" };
// Accounts created before the flag existed have no is_active and count as enabled
const isEnabled = (account) => account.is_active !== false;

export default function StaffPage({ lang, role, users, loaded, canManage, currentUserId, updatingId, onToggleStatus }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");

  const counts = {
    all: users.length,
    admin: users.filter((account) => normalizeRole(account.role) === "admin").length,
    manager: users.filter((account) => normalizeRole(account.role) === "manager").length,
    priest: users.filter((account) => normalizeRole(account.role) === "priest").length,
    disabled: users.filter((account) => !isEnabled(account)).length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users
      .filter((account) => {
        if (group === "all") return true;
        if (group === "disabled") return !isEnabled(account);
        return normalizeRole(account.role) === group;
      })
      .filter((account) => !needle || `${account.username} ${account.email}`.toLowerCase().includes(needle));
  }, [group, query, users]);

  const toggle = (account) => {
    if (isEnabled(account) && !window.confirm(`Disable ${account.username || account.email}? They are signed out and cannot sign in until you enable the account again.`)) return;
    onToggleStatus(account, !isEnabled(account));
  };

  return (
    <Page>
      <PageHeader
        title={sectionMeta.staff.label}
        description={sectionMeta.staff.text}
        actions={
          canManage ? (
            <NavLink to={sectionPath(lang, role, "staff-new")} className={cx(styles.btn, styles.btnPrimary)}>
              <UserRoundPlus size={15} aria-hidden="true" />
              Add staff
            </NavLink>
          ) : null
        }
      />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" />
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Role"
              value={group}
              onChange={setGroup}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "admin", label: "Admins", count: counts.admin },
                { value: "manager", label: "Managers", count: counts.manager },
                { value: "priest", label: "Priests", count: counts.priest },
                { value: "disabled", label: "Disabled", count: counts.disabled },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={6} columns={[30, 34, 12, 12]} />
        ) : visible.length ? (
          <>
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>{canManage ? "Enable / disable" : "Status"}</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((account) => {
                    const accountRole = normalizeRole(account.role);
                    const enabled = isEnabled(account);
                    const isSelf = String(account.id) === String(currentUserId);
                    const busy = updatingId === account.id;
                    return (
                      <tr key={account.id}>
                        <td>
                          <div className={styles.cellRow}>
                            <Avatar name={account.username || account.email} small />
                            <strong className={styles.cellMain}>{account.username || "—"}</strong>
                          </div>
                        </td>
                        <td data-label="Email">{account.email}</td>
                        <td data-label="Role">
                          <Badge tone="neutral" plain>
                            {accountRole === "admin" ? <ShieldCheck size={12} aria-hidden="true" /> : null}
                            {roleLabel[accountRole] || accountRole}
                          </Badge>
                        </td>
                        <td data-label="Status">
                          {canManage ? (
                            <label
                              className={styles.switchInline}
                              title={isSelf ? "You cannot disable your own login" : enabled ? "Disable this login" : "Enable this login"}
                            >
                              <span className={styles.switch}>
                                <input
                                  type="checkbox"
                                  role="switch"
                                  checked={enabled}
                                  onChange={() => toggle(account)}
                                  disabled={busy || isSelf}
                                  aria-label={`${enabled ? "Disable" : "Enable"} ${account.username || account.email}`}
                                />
                                <span className={styles.switchTrack} />
                              </span>
                              {busy ? <LoaderCircle size={14} className={styles.spin} aria-hidden="true" /> : null}
                              <span className={enabled ? undefined : styles.statusOff}>
                                {enabled ? "Enabled" : "Disabled"}
                                {isSelf ? " (you)" : ""}
                              </span>
                            </label>
                          ) : enabled ? (
                            <Badge tone="success">Enabled</Badge>
                          ) : (
                            <Badge tone="danger">Disabled</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFoot}>
              <span>
                {visible.length} of {users.length} staff {users.length === 1 ? "account" : "accounts"}
              </span>
            </div>
          </>
        ) : users.length ? (
          <EmptyState icon={ListFilter} title="No staff match" text="Try another name or email, or a different filter." />
        ) : (
          <EmptyState icon={UsersRound} title="No staff yet" text={canManage ? "Use Add staff to create logins for priests and managers." : "Staff appear here once an admin creates their login."} />
        )}
      </Panel>
    </Page>
  );
}
