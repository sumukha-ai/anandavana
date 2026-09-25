import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, RotateCcw } from 'lucide-react';
import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './Gallery.module.css';
import events from './Events.module.css';
import { useI18n } from '../i18n/useI18n';
import { interpolate } from './shop/shopUtils';
import { formatEventRange, useGalleryAlbums } from './events/eventUtils';
import PhotoGrid from './events/PhotoGrid';

const KSHETRA_IMAGES = [
  { id: 1, src: "https://i.ibb.co/ynzXxDnY/AGADI-PH-CAM-15-1.jpg", title: "Temple View" },
  { id: 2, src: "https://i.ibb.co/SDj1pf9c/AGADI-PH-CAM-13-1.jpg", title: "Paatashaale" },
  { id: 3, src: "https://i.ibb.co/x87ryg06/AGADI-PH-CAM-9.jpg", title: "Devotee Gatherings" },
  { id: 4, src: "https://i.ibb.co/23mNPgvk/Copy-of-DSC08814.jpg", title: "Shri Chidambara Murthy Chakravarthi" },
  { id: 5, src: "https://i.ibb.co/chw2XQcX/DSC-1359.jpg", title: "Entrance" }
];

function AlbumSkeleton() {
  return (
    <div className={styles.album} aria-hidden="true">
      <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
      <div className={events.gallery}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={`${styles.skeleton} ${styles.skeletonPhoto}`} />
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  const { t, lang } = useI18n('pages');
  const { t: te } = useI18n('events');
  const { albums, status, retry } = useGalleryAlbums(lang);

  return (
    <>
      <PageHero title={t('galleryTitle')} bgImage={bgImg} />
      <div className={styles['gallery-container']} lang={lang}>
        <div className={styles['gallery-header']}>
          <p>{t('galleryIntro')}</p>
        </div>

        <div className={styles.albums}>
          {status === 'loading' ? <AlbumSkeleton /> : null}
          {status === 'error' ? (
            <div className={styles.loadError} role="alert">
              <span>{t('galleryLoadError')}</span>
              <button type="button" className={styles.retry} onClick={retry}>
                <RotateCcw size={15} aria-hidden="true" />
                {te('retry')}
              </button>
            </div>
          ) : null}
          {albums.map((album) => (
            <section key={album.id} className={styles.album} aria-labelledby={`album-${album.id}`}>
              <header className={styles.albumHead}>
                <div>
                  <h2 id={`album-${album.id}`} className={styles.albumTitle}>
                    {album.title}
                  </h2>
                  <p className={styles.albumMeta}>
                    <CalendarDays size={15} aria-hidden="true" />
                    {formatEventRange(album, lang)}
                    <span aria-hidden="true">·</span>
                    {album.images.length === 1 ? te('onePhoto') : interpolate(te('photos'), { n: album.images.length })}
                  </p>
                </div>
                <Link to={`/${lang}/events/${album.slug}`} className={styles.albumLink}>
                  {t('galleryAboutEvent')}
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </header>
              <PhotoGrid images={album.images} t={te} label={album.title} />
            </section>
          ))}
        </div>

        <section className={styles.album} aria-labelledby="album-kshetra">
          <header className={styles.albumHead}>
            <h2 id="album-kshetra" className={styles.albumTitle}>
              {t('galleryKshetra')}
            </h2>
          </header>
          <div className={styles['masonry-grid']}>
            {KSHETRA_IMAGES.map((img) => (
              <figure key={img.id} className={styles['masonry-item']}>
                <div className={styles['image-wrapper']}>
                  <img src={img.src} alt={img.title} loading="lazy" />
                  <figcaption className={styles['image-overlay']}>
                    <span className={styles['image-title']}>{img.title}</span>
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
