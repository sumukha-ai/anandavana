import { useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff, Flame, LoaderCircle, UserRoundPlus } from "lucide-react";
import { sectionMeta, sectionPath } from "./rolePortalConfig";
import { Field, FormSection, Page, PageHeader, Panel } from "./ui";
import { cx } from "./cx";
import styles from "./Console.module.css";

const roles = [
  { value: "priest", label: "Priest", text: "Sees booked sevas, the calendar and day sheets.", icon: Flame },
  { value: "manager", label: "Manager", text: "Also sees bhaktas, events, the gallery and staff.", icon: BriefcaseBusiness },
];

export default function AddStaffPage({ lang, role, staffForm, onStaffChange, onCreateStaff, saving }) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = staffForm.password.length;

  return (
    <Page>
      <PageHeader
        title={sectionMeta["staff-new"].label}
        description={sectionMeta["staff-new"].text}
        back={{ to: sectionPath(lang, role, "staff"), label: sectionMeta.staff.label }}
      />

      <Panel as="form" onSubmit={onCreateStaff}>
        <FormSection title="Account" description="They sign in with this email and password.">
          <Field label="Name">
            <input className={styles.input} name="username" value={staffForm.username} onChange={onStaffChange} required autoComplete="off" placeholder="Full name" />
          </Field>
          <Field label="Email">
            <input className={styles.input} type="email" name="email" value={staffForm.email} onChange={onStaffChange} required autoComplete="off" placeholder="name@example.org" />
          </Field>
          <Field
            label="Temporary password"
            wide
            aside={strength ? (strength < 8 ? `${8 - strength} more characters` : "Long enough") : "At least 8 characters"}
            hint="Share it with them in person and ask them to change it after signing in."
          >
            <span className={styles.inputAffix}>
              <input
                className={cx(styles.input, styles.inputNoAffix)}
                type={showPassword ? "text" : "password"}
                name="password"
                value={staffForm.password}
                onChange={onStaffChange}
                minLength={8}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.affixButton}
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
              </button>
            </span>
          </Field>
        </FormSection>
        <FormSection title="Role" description="What they can see and change in the console.">
          <div className={cx(styles.choiceGrid, styles.fieldWide)} role="radiogroup" aria-label="Role">
            {roles.map(({ value, label, text, icon: Icon }) => (
              <label key={value} className={cx(styles.choice, staffForm.role === value && styles.choiceActive)}>
                <input type="radio" name="role" value={value} checked={staffForm.role === value} onChange={onStaffChange} required />
                <Icon size={17} aria-hidden="true" />
                <span className={styles.choiceText}>
                  <strong>{label}</strong>
                  <span>{text}</span>
                </span>
              </label>
            ))}
          </div>
        </FormSection>
        <div className={styles.panelFoot}>
          <button type="submit" className={cx(styles.btn, styles.btnPrimary)} disabled={saving}>
            {saving ? <LoaderCircle size={15} className={styles.spin} aria-hidden="true" /> : <UserRoundPlus size={15} aria-hidden="true" />}
            {saving ? "Creating…" : "Create login"}
          </button>
        </div>
      </Panel>
    </Page>
  );
}
