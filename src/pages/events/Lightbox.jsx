import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { interpolate } from "../shop/shopUtils";
import { eventImageUrl } from "./eventUtils";
import styles from "../Events.module.css";

// Full-screen photo viewer. `images` are { url, description }; `t` needs photoOf, close, previous, next.
export default function Lightbox({ images, index, onClose, onMove, t, label }) {
  const image = images[index];

  useEffect(() => {
    const onKey = (keyEvent) => {
      if (keyEvent.key === "Escape") onClose();
      if (keyEvent.key === "ArrowRight") onMove(1);
      if (keyEvent.key === "ArrowLeft") onMove(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onMove]);

  if (!image) return null;

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={label}>
      <div className={styles.lightboxTop}>
        <span>
          {label ? <strong className={styles.lightboxLabel}>{label} · </strong> : null}
          {interpolate(t("photoOf"), { i: index + 1, n: images.length })}
        </span>
        <button type="button" className={styles.lightboxButton} onClick={onClose} aria-label={t("close")} autoFocus>
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <div className={styles.lightboxStage} onClick={(clickEvent) => clickEvent.target === clickEvent.currentTarget && onClose()}>
        <img src={eventImageUrl(image.url)} alt={image.description || ""} />
        {images.length > 1 ? (
          <>
            <button type="button" className={`${styles.lightboxButton} ${styles.lightboxPrev}`} onClick={() => onMove(-1)} aria-label={t("previous")}>
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button type="button" className={`${styles.lightboxButton} ${styles.lightboxNext}`} onClick={() => onMove(1)} aria-label={t("next")}>
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>
      <p className={styles.lightboxCaption}>{image.description || ""}</p>
    </div>
  );
}
