import { NavLink } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { statusLabel, statusTone } from "./rolePortalConfig";
import { cx } from "./cx";
import styles from "./Console.module.css";


export function Page({ children }) {
  return <div className={styles.page}>{children}</div>;
}

export function PageHeader({ title, description, actions, back }) {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageHeading}>
        {back ? (
          <NavLink to={back.to} className={styles.backLink}>
            <ArrowLeft size={14} aria-hidden="true" />
            {back.label}
          </NavLink>
        ) : null}
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageDesc}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.pageActions}>{actions}</div> : null}
    </header>
  );
}

export function Panel({ title, meta, action, children, className, as: Tag = "section", ...rest }) {
  return (
    <Tag className={cx(styles.panel, className)} {...rest}>
      {title ? (
        <div className={styles.panelHead}>
          <h2 className={styles.panelTitle}>
            {title}
            {meta !== undefined && meta !== null ? <span className={styles.panelMeta}>{meta}</span> : null}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </Tag>
  );
}

export function Kpis({ items }) {
  return (
    <div className={styles.kpis}>
      {items.map(({ label, value, sub, icon: Icon, warn, text }) => (
        <div key={label} className={styles.kpi}>
          <span className={styles.kpiLabel}>
            {Icon ? <Icon size={14} aria-hidden="true" /> : null}
            {label}
          </span>
          <strong className={cx(styles.kpiValue, text && styles.kpiValueText)} title={text ? String(value) : undefined}>
            {value}
          </strong>
          {sub ? <span className={cx(styles.kpiSub, warn && styles.kpiSubWarn)}>{sub}</span> : null}
        </div>
      ))}
    </div>
  );
}

const toneClass = {
  success: styles.badgeSuccess,
  warning: styles.badgeWarning,
  danger: styles.badgeDanger,
  accent: styles.badgeAccent,
  neutral: styles.badgeNeutral,
};

export function Badge({ tone = "neutral", plain, children }) {
  return <span className={cx(styles.badge, toneClass[tone], plain && styles.badgePlain)}>{children}</span>;
}

export function PaymentBadge({ status }) {
  return <Badge tone={statusTone(status)}>{statusLabel(status)}</Badge>;
}

export function EmptyState({ icon: Icon, title, text, action, compact }) {
  return (
    <div className={cx(styles.empty, compact && styles.emptyCompact)}>
      {Icon ? (
        <span className={styles.emptyIcon}>
          <Icon size={18} aria-hidden="true" />
        </span>
      ) : null}
      <strong className={styles.emptyTitle}>{title}</strong>
      {text ? <p className={styles.emptyText}>{text}</p> : null}
      {action}
    </div>
  );
}

export function Skeleton({ width = "100%", height = 12, radius, style }) {
  return <span className={styles.skeleton} style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />;
}

export function SkeletonRows({ rows = 5, columns = [40, 18, 14, 12] }) {
  return (
    <div className={styles.skeletonRows} aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className={styles.skeletonRow}>
          {columns.map((width, col) => (
            <Skeleton key={col} width={`${Math.max(8, width - ((row * 7 + col * 3) % 9))}%`} height={10} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, label }) {
  return (
    <label className={styles.search}>
      <Search size={15} aria-hidden="true" />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label || placeholder}
      />
    </label>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className={styles.segmented} role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          className={cx(styles.segButton, value === option.value && styles.segButtonActive)}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {option.count !== undefined ? <span className={styles.segCount}>{option.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Switch({ name, checked, onChange, title, description }) {
  return (
    <label className={styles.switchRow}>
      <span className={styles.switchText}>
        <strong>{title}</strong>
        {description ? <span>{description}</span> : null}
      </span>
      <span className={styles.switch}>
        <input type="checkbox" role="switch" name={name} checked={checked} onChange={onChange} />
        <span className={styles.switchTrack} />
      </span>
    </label>
  );
}

export function Avatar({ name, small }) {
  const initials = String(name || "")
    .split(/[\s._@-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span className={cx(styles.avatar, small && styles.avatarSm)} aria-hidden="true">
      {initials || "·"}
    </span>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <div className={styles.formSection}>
      <div className={styles.formSectionHead}>
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </div>
      <div className={styles.fieldGrid}>{children}</div>
    </div>
  );
}

export function Field({ label, hint, aside, wide, children }) {
  return (
    <label className={cx(styles.field, wide && styles.fieldWide)}>
      <span className={styles.label}>
        {label}
        {aside ? <span className={styles.labelHint}>{aside}</span> : null}
      </span>
      {children}
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </label>
  );
}
