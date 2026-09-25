import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { cx } from "../cx";
import styles from "../Console.module.css";
import own from "./Finance.module.css";
import { periodPresets } from "./financeUtils";

export function PeriodPicker({ period, onChange }) {
  const presets = periodPresets();
  const setPreset = (preset) => {
    if (preset === "custom") {
      const current = presets.find((item) => item.value === period.preset) || presets[0];
      onChange({ preset, from: period.from || current.from, to: period.to || current.to });
    } else {
      onChange({ ...period, preset });
    }
  };

  return (
    <div className={own.period}>
      <select className={cx(styles.select, own.periodSelect)} value={period.preset} onChange={(event) => setPreset(event.target.value)} aria-label="Period">
        {presets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Custom dates</option>
      </select>
      {period.preset === "custom" ? (
        <div className={styles.dateRange}>
          <input
            className={styles.input}
            type="date"
            value={period.from}
            max={period.to || undefined}
            onChange={(event) => onChange({ ...period, from: event.target.value })}
            aria-label="From date"
          />
          <span>to</span>
          <input
            className={styles.input}
            type="date"
            value={period.to}
            min={period.from || undefined}
            onChange={(event) => onChange({ ...period, to: event.target.value })}
            aria-label="To date"
          />
        </div>
      ) : null}
    </div>
  );
}

export function Drawer({ open, title, subtitle, onClose, children, footer }) {
  const panelRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    panelRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className={own.drawerLayer}>
      <div className={own.drawerScrim} onClick={onClose} aria-hidden="true" />
      <aside className={own.drawer} role="dialog" aria-modal="true" aria-labelledby={titleId} ref={panelRef} tabIndex={-1}>
        <header className={own.drawerHead}>
          <div>
            <h2 id={titleId} className={own.drawerTitle}>
              {title}
            </h2>
            {subtitle ? <p className={own.drawerSub}>{subtitle}</p> : null}
          </div>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className={own.drawerBody}>{children}</div>
        {footer ? <footer className={own.drawerFoot}>{footer}</footer> : null}
      </aside>
    </div>
  );
}
