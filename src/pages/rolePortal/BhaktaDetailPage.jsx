import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, HandCoins, History, IndianRupee, ListFilter, Phone, UserRoundX, Users } from "lucide-react";
import { dateKey, displayLookup, relativeDay, sectionPath } from "./rolePortalConfig";
import { Avatar, Badge, EmptyState, Kpis, Page, PageHeader, Panel, Segmented, Skeleton, SkeletonRows } from "./ui";
import { ReceiptLink } from "./Links";
import { cx } from "./cx";
import styles from "./Console.module.css";
import own from "./Bhakta.module.css";
import { DONATION_CHANNEL_LABELS, inr, longDate } from "./finance/financeUtils";
import { useFinanceQuery } from "./finance/useFinanceQuery";

function Item({ label, value, wide }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={cx(styles.dlItem, wide && styles.dlWide)}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

// Server timestamps are UTC without a zone; this is the local calendar day they fall on
function localDay(timestamp) {
  return timestamp ? dateKey(new Date(`${timestamp}Z`)) : null;
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

function astroLine(profile, lang) {
  const gotra = lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra;
  return [displayLookup(profile.rashi, lang), displayLookup(profile.nakshatra, lang), gotra].filter(Boolean).join(" · ");
}

// Sevas and donations in one list, newest first, dated by when the money came in (or the booking was made)
function buildHistory(data) {
  const sevas = (data.bookings || []).map((booking) => ({
    key: `seva-${booking.id}`,
    kind: "seva",
    date: booking.paid_on || localDay(booking.created_at),
    title: booking.seva?.name || "Seva",
    booking,
    sevaDate: booking.seva_date,
    person: booking.bhakta_profile,
    channel: booking.channel,
    status: booking.payment_status,
    amount: booking.amount ?? booking.seva?.amount,
    reference: booking.payment_reference || (booking.channel === "online" ? booking.payment_order_id : null),
    matchedBy: booking.matched_by,
    recordedBy: booking.recorded_by,
  }));
  const donations = (data.donations || []).map((donation) => ({
    key: `donation-${donation.id}`,
    kind: "donation",
    date: donation.donated_on || localDay(donation.created_at),
    title: donation.fund?.name || "Donation",
    detail: donation.dedication,
    donorName: donation.donor_name,
    channel: donation.channel,
    status: donation.payment_status,
    amount: donation.amount,
    reference: donation.receipt_number,
    matchedBy: donation.matched_by,
    recordedBy: donation.recorded_by,
  }));
  return [...sevas, ...donations].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || b.key.localeCompare(a.key));
}

function HistoryDetail({ entry, selfName }) {
  if (entry.kind !== "donation") return null;
  const parts = [entry.reference, entry.detail];
  if (entry.donorName && entry.donorName !== selfName) parts.push(`given as ${entry.donorName}`);
  return parts.filter(Boolean).length ? <span>{parts.filter(Boolean).join(" · ")}</span> : null;
}

function DetailSkeleton() {
  return (
    <>
      <div className={styles.kpis}>
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className={styles.kpi}>
            <Skeleton width="45%" height={10} />
            <Skeleton width="60%" height={22} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>
      <Panel>
        <SkeletonRows rows={3} columns={[22, 22, 22, 22]} />
      </Panel>
      <Panel>
        <SkeletonRows rows={2} columns={[40, 30]} />
      </Panel>
      <Panel>
        <SkeletonRows rows={6} columns={[14, 34, 12, 12, 12]} />
      </Panel>
    </>
  );
}

export default function BhaktaDetailPage({ lang, role, token, notify, bhaktaId, onTitle }) {
  const [kind, setKind] = useState("all");
  const [personId, setPersonId] = useState("all");
  const { data, loading } = useFinanceQuery(`/bhaktas/${bhaktaId}`, {
    token,
    notify,
    errorTitle: "Could not load this bhakta",
  });
  const back = { to: sectionPath(lang, role, "bhaktas"), label: "Bhaktas" };

  const name = data ? data.profile?.name || data.account.username : "";
  useEffect(() => {
    if (name) onTitle?.(name);
  }, [name, onTitle]);

  const history = useMemo(() => (data ? buildHistory(data) : []), [data]);
  const visible = history.filter((entry) => {
    if (kind !== "all" && entry.kind !== kind) return false;
    if (personId !== "all") return entry.kind === "seva" && String(entry.person?.id) === personId;
    return true;
  });

  if (!data) {
    if (!loading) {
      return (
        <Page>
          <PageHeader back={back} title="Bhakta" />
          <Panel>
            <EmptyState
              icon={UserRoundX}
              title="This bhakta could not be found"
              text="The account may have been removed, or the link is out of date."
              action={
                <NavLink to={back.to} className={cx(styles.btn, styles.btnSecondary)}>
                  Back to bhaktas
                </NavLink>
              }
            />
          </Panel>
        </Page>
      );
    }
    return (
      <Page>
        <PageHeader back={back} title={<Skeleton width="14rem" height={24} />} />
        <DetailSkeleton />
      </Page>
    );
  }

  const { account, profile, family, summary } = data;
  const people = [profile, ...family].filter(Boolean);
  const phone = profile?.phone_number;
  const lastSeen = localDay(summary.last_activity);
  const counterCount = history.filter((entry) => entry.matchedBy).length;
  const kindCounts = {
    all: history.length,
    seva: history.filter((entry) => entry.kind === "seva").length,
    donation: history.filter((entry) => entry.kind === "donation").length,
  };
  const togglePerson = (id) => {
    const value = String(id);
    setPersonId((current) => (current === value ? "all" : value));
    if (kind === "donation") setKind("all");
  };

  const description = [
    `Registered ${longDate(localDay(account.created_at))}`,
    lastSeen ? `last active ${relativeDay(lastSeen).toLowerCase() || longDate(lastSeen)}` : "no sevas or donations yet",
  ].join(" · ");

  return (
    <Page>
      <PageHeader
        back={back}
        title={name}
        description={description}
        actions={
          phone ? (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className={cx(styles.btn, styles.btnSecondary)}>
              <Phone size={15} aria-hidden="true" />
              {phone}
            </a>
          ) : null
        }
      />

      <Kpis
        items={[
          {
            label: "Total given",
            value: inr(summary.total_given),
            sub: `Sevas ${inr(summary.seva_total)} · Donations ${inr(summary.donation_total)}`,
            icon: IndianRupee,
          },
          {
            label: "Sevas",
            value: summary.seva_count,
            sub: summary.unpaid_count ? `${summary.unpaid_count} not paid` : "All paid",
            warn: summary.unpaid_count > 0,
            icon: CalendarDays,
          },
          { label: "Donations", value: summary.donation_count, sub: "Paid", icon: HandCoins },
          { label: "Family", value: family.length, sub: family.length ? plural(family.length, "member", "members") : "None added", icon: Users },
        ]}
      />

      <Panel title="Profile">
        {profile ? (
          <dl className={styles.dl}>
            <Item label="Rashi" value={displayLookup(profile.rashi, lang)} />
            <Item label="Nakshatra" value={displayLookup(profile.nakshatra, lang)} />
            <Item label="Gotra" value={lang === "kn" ? profile.gotra_kn || profile.gotra : profile.gotra} />
            <Item label="Charana" value={profile.charana} />
            <Item label="Phone" value={profile.phone_number} />
            <Item label="Email" value={profile.email} />
            <Item label="Address" value={profile.address} wide />
          </dl>
        ) : (
          <EmptyState icon={UserRoundX} title="No profile yet" text="This bhakta registered but has not filled in their devotee profile." compact />
        )}
      </Panel>

      <Panel title="Family" meta={family.length || undefined}>
        {people.length ? (
          <div className={styles.list}>
            {people.map((person) => {
              const active = personId === String(person.id);
              return (
                <button
                  key={person.id}
                  type="button"
                  className={cx(styles.listItem, own.member, active && own.memberActive)}
                  onClick={() => togglePerson(person.id)}
                  aria-pressed={active}
                  title={active ? "Show everyone's sevas" : `Show sevas for ${person.name}`}
                >
                  <Avatar name={person.name} small />
                  <span className={styles.listText}>
                    <strong>
                      {person.name}
                      {person.is_self ? <span className={styles.muted}> · self</span> : null}
                    </strong>
                    <span>{[astroLine(person, lang), !person.is_self && person.phone_number !== phone ? person.phone_number : null].filter(Boolean).join(" · ") || "—"}</span>
                  </span>
                  <span className={styles.listEnd}>{person.booking_count ? plural(person.booking_count, "seva", "sevas") : "No sevas"}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Users} title="No family members" text="Family members they add while booking will appear here." compact />
        )}
      </Panel>

      <Panel
        title="History"
        meta={history.length || undefined}
        action={
          history.length ? (
            <div className={own.historyTools}>
              {people.length > 1 ? (
                <select
                  className={cx(styles.select, own.personSelect)}
                  value={personId}
                  onChange={(event) => {
                    setPersonId(event.target.value);
                    if (event.target.value !== "all" && kind === "donation") setKind("all");
                  }}
                  aria-label="Sevas for"
                >
                  <option value="all">Everyone</option>
                  {people.map((person) => (
                    <option key={person.id} value={String(person.id)}>
                      {person.name}
                    </option>
                  ))}
                </select>
              ) : null}
              <Segmented
                label="Type"
                value={kind}
                onChange={(value) => {
                  setKind(value);
                  if (value === "donation") setPersonId("all");
                }}
                options={[
                  { value: "all", label: "All", count: kindCounts.all },
                  { value: "seva", label: "Sevas", count: kindCounts.seva },
                  { value: "donation", label: "Donations", count: kindCounts.donation },
                ]}
              />
            </div>
          ) : null
        }
      >
        {visible.length ? (
          <>
            <div className={styles.tableWrap}>
              <table className={cx(styles.table, styles.tableStack)}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Seva or cause</th>
                    <th>Mode</th>
                    <th className={styles.num}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((entry) => (
                    <tr key={entry.key}>
                      <td className={styles.nowrap} data-label="Date">
                        {longDate(entry.date)}
                      </td>
                      <td>
                        <div className={styles.cellStack}>
                          <span className={styles.cellRow}>
                            {entry.kind === "seva" ? <Badge tone="accent">Seva</Badge> : <Badge tone="success">Donation</Badge>}
                            <strong className={styles.cellMain}>
                              {entry.booking ? (
                                <ReceiptLink booking={entry.booking} label={`${entry.title}, open receipt`}>
                                  {entry.title}
                                </ReceiptLink>
                              ) : (
                                entry.title
                              )}
                            </strong>
                          </span>
                          <HistoryDetail entry={entry} selfName={name} />
                          {entry.matchedBy ? <span>At the counter · matched by {entry.matchedBy}{entry.recordedBy ? ` · entered by ${entry.recordedBy}` : ""}</span> : null}
                        </div>
                      </td>
                      <td className={styles.nowrap} data-label="Mode">
                        {DONATION_CHANNEL_LABELS[entry.channel] || entry.channel || "Online"}
                      </td>
                      <td className={cx(styles.num, styles.nowrap)} data-label="Amount">
                        <strong>{entry.amount === null || entry.amount === undefined ? "—" : inr(entry.amount)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.tableFoot}>
              <span>
                {plural(visible.length, "entry", "entries")}
                {summary.first_activity ? ` · since ${longDate(localDay(summary.first_activity))}` : ""}
              </span>
              {counterCount ? <span className={styles.muted}>Counter entries are matched by the family's phone numbers or email</span> : null}
            </div>
          </>
        ) : history.length ? (
          <EmptyState
            icon={ListFilter}
            title="Nothing for this filter"
            text="Try everyone, or a different type."
            compact
            action={
              <button
                type="button"
                className={cx(styles.btn, styles.btnSecondary, styles.btnSm)}
                onClick={() => {
                  setKind("all");
                  setPersonId("all");
                }}
              >
                Show everything
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={History}
            title="No sevas or donations yet"
            text="Sevas they book and donations they make, online or at the counter, will appear here."
            compact
          />
        )}
      </Panel>
    </Page>
  );
}
