import { useCallback, useState } from "react";
import { interpolate } from "../shop/shopUtils";
import { eventImageUrl } from "./eventUtils";
import Lightbox from "./Lightbox";
import styles from "../Events.module.css";

// Event photos with their optional descriptions; a click opens the full-screen viewer.
export default function PhotoGrid({ images, t, label }) {
  const [openIndex, setOpenIndex] = useState(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (step) => setOpenIndex((current) => (current === null ? null : (current + step + images.length) % images.length)),
    [images.length]
  );

  return (
    <>
      <ul className={styles.gallery}>
        {images.map((image, index) => (
          <li key={image.id ?? image.url}>
            <figure className={styles.galleryFigure}>
              <button
                type="button"
                className={styles.galleryItem}
                onClick={() => setOpenIndex(index)}
                aria-label={image.description || interpolate(t("photoOf"), { i: index + 1, n: images.length })}
              >
                <img src={eventImageUrl(image.url)} alt="" loading="lazy" />
              </button>
              {image.description ? <figcaption className={styles.galleryCaption}>{image.description}</figcaption> : null}
            </figure>
          </li>
        ))}
      </ul>
      {openIndex !== null ? <Lightbox images={images} index={openIndex} onClose={close} onMove={move} t={t} label={label} /> : null}
    </>
  );
}
