import { useMemo, useState } from "react";
import { ListFilter, Users } from "lucide-react";
import { normalizeRole } from "../../auth/access";
import { sectionMeta } from "./rolePortalConfig";
import { Avatar, Badge, EmptyState, Page, PageHeader, Panel, SearchInput, Segmented, SkeletonRows } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const roleLabel = { bhakta: "Devotee", admin: "Admin", manager: "Manager", priest: "Priest" };

export default function UsersPage({ users, loaded }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");

  const counts = {
    all: users.length,
    bhakta: users.filter((account) => normalizeRole(account.role) === "bhakta").length,
    staff: users.filter((account) => normalizeRole(account.role) !== "bhakta").length,
    unverified: users.filter((account) => !account.is_verified).length,
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users
      .filter((account) => {
        const role = normalizeRole(account.role);
        if (group === "bhakta") return role === "bhakta";
        if (group === "staff") return role !== "bhakta";
        if (group === "unverified") return !account.is_verified;
        return true;
      })
      .filter((account) => !needle || `${account.username} ${account.email}`.toLowerCase().includes(needle));
  }, [group, query, users]);

  return (
    <Page>
      <PageHeader title={sectionMeta.users.label} description={sectionMeta.users.text} />

      <Panel>
        <div className={styles.toolbar}>
          <SearchInput value={query} onChange={setQuery} placeholder="Search name or email" />
          <div className={styles.toolbarEnd}>
            <Segmented
              label="Account type"
              value={group}
              onChange={setGroup}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "bhakta", label: "Devotees", count: counts.bhakta },
                { value: "staff", label: "Staff", count: counts.staff },
                { value: "unverified", label: "Unverified", count: counts.unverified },
              ]}
            />
          </div>
        </div>

        {!loaded ? (
          <SkeletonRows rows={8} columns={[30, 34, 12, 12]} />
        ) : visible.length ? (
          <>
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Email verified</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((account) => {
                    const role = normalizeRole(account.role);
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
                            {roleLabel[role] || role}
                          </Badge>
                        </td>
                        <td data-label="Verified">
                          {account.is_verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Not yet</Badge>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFoot}>
              <span>
                {visible.length} of {users.length} {users.length === 1 ? "account" : "accounts"}
              </span>
            </div>
          </>
        ) : users.length ? (
          <EmptyState icon={ListFilter} title="No accounts match" text="Try another name or email, or a different account type." />
        ) : (
          <EmptyState icon={Users} title="No accounts yet" text="Devotees appear here when they register on the site. Staff appear when you create their login." />
        )}
      </Panel>
    </Page>
  );
}
