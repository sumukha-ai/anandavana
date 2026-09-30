import styles from "./Ornaments.module.css";

// Shared devotional ornament for the public pages. Every mark is drawn here
// in one stroke weight so the lotus, lamp and canopy read as one hand.

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LotusMark({ className = "", width = 48 }) {
  return (
    <svg
      viewBox="0 0 48 24"
      width={width}
      height={width / 2}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...STROKE}
      strokeWidth="1.2"
    >
      <path d="M24 3c3.5 4.5 3.5 10.5 0 15-3.5-4.5-3.5-10.5 0-15z" />
      <path d="M22.5 18c-5.5-.5-9-4.5-9.5-9.5 4.5 1 8 4 9.5 9.5z" />
      <path d="M25.5 18c5.5-.5 9-4.5 9.5-9.5-4.5 1-8 4-9.5 9.5z" />
      <path d="M21 19.2c-6 1-11.5-.5-14-4 5-1 10 .5 14 4z" />
      <path d="M27 19.2c6 1 11.5-.5 14-4-5-1-10 .5-14 4z" />
      <path d="M17 21.6h14" />
    </svg>
  );
}

/** A hairline, a lotus, a hairline. `tone` is "gold" on dark bands, "antique" on paper. */
export function LotusRule({ tone = "antique", align = "center", className = "" }) {
  return (
    <div
      className={`${styles.rule} ${styles[`tone-${tone}`]} ${align === "start" ? styles.ruleStart : ""} ${className}`}
      aria-hidden="true"
    >
      <span className={styles.ruleLine} />
      <LotusMark className={styles.ruleLotus} />
      <span className={styles.ruleLine} />
    </div>
  );
}

/** The traditional salutation to the Gurus that opens a text or a gathering. */
export function Invocation({ tone = "antique", className = "" }) {
  return (
    <p className={`${styles.invocation} ${styles[`tone-${tone}`]} ${className}`} lang="kn">
      ॥ ಶ್ರೀ ಗುರುಭ್ಯೋ ನಮಃ ॥
    </p>
  );
}

/** A photograph set in a shrine niche: a round-topped arch inside a gilt hairline. */
export function ArchFrame({ src, alt, className = "", imgClassName = "", loading = "lazy", position }) {
  return (
    <figure className={`${styles.arch} ${className}`}>
      <LotusMark className={styles.archFinial} width={40} />
      <div className={styles.archInner}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          className={`${styles.archImage} ${imgClassName}`}
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    </figure>
  );
}

/** A mango-leaf toran hung along an edge. */
export function Toran({ tone = "gold", className = "" }) {
  return <div className={`${styles.toran} ${styles[`toran-${tone}`]} ${className}`} aria-hidden="true" />;
}

/* ---- Icons, drawn on the lucide grid so they sit beside lucide glyphs ---- */

export function DeepaIcon({ size = 24, strokeWidth = 1.6, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...STROKE} strokeWidth={strokeWidth} {...rest}>
      <path d="M12 2.8c2.2 2.6 2.6 4.8 0 7.4-2.6-2.6-2.2-4.8 0-7.4z" />
      <path d="M3.5 12.2h17c-.6 3.4-4 5.6-8.5 5.6s-7.9-2.2-8.5-5.6z" />
      <path d="M12 17.8v2.4" />
      <path d="M8.5 21.2h7" />
    </svg>
  );
}

export function AnnadanaIcon({ size = 24, strokeWidth = 1.6, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...STROKE} strokeWidth={strokeWidth} {...rest}>
      <path d="M4.5 11h15" />
      <path d="M5.5 11c0 4.8 2.9 8.2 6.5 8.2s6.5-3.4 6.5-8.2" />
      <path d="M9.5 21h5" />
      <path d="M9.6 7.8c-1-1.1.9-1.9 0-3.4" />
      <path d="M14.4 7.8c-1-1.1.9-1.9 0-3.4" />
    </svg>
  );
}

export function ChatraIcon({ size = 24, strokeWidth = 1.6, ...rest }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false" {...STROKE} strokeWidth={strokeWidth} {...rest}>
      <path d="M12 2.2v1.6" />
      <path d="M3 11.2C3 6.8 7 3.8 12 3.8s9 3 9 7.4" />
      <path d="M3 11.2q2.25 1.8 4.5 0 2.25 1.8 4.5 0 2.25 1.8 4.5 0 2.25 1.8 4.5 0" />
      <path d="M12 11.6v9.2" />
    </svg>
  );
}
