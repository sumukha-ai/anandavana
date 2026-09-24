import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './Gallery.module.css';
import { useI18n } from '../i18n/useI18n';

export default function Gallery() {
  const { t, lang } = useI18n('pages');
  const images = [
    { id: 1, src: "https://i.ibb.co/ynzXxDnY/AGADI-PH-CAM-15-1.jpg", title: "Temple View" },
    { id: 2, src: "https://i.ibb.co/SDj1pf9c/AGADI-PH-CAM-13-1.jpg", title: "Paatashaale" },
    { id: 3, src: "https://i.ibb.co/x87ryg06/AGADI-PH-CAM-9.jpg", title: "Devotee Gatherings" },
    { id: 4, src: "https://i.ibb.co/23mNPgvk/Copy-of-DSC08814.jpg", title: "Shri Chidambara Murthy Chakravarthi" },
    { id: 5, src: "https://i.ibb.co/chw2XQcX/DSC-1359.jpg", title: "Entrance" }
  ];

  return (
    <>
      <PageHero title={t('galleryTitle')} bgImage={bgImg} />
      <div className={styles['gallery-container']}>
        <div className={styles['gallery-header']} lang={lang}>
          <p>{t('galleryIntro')}</p>
        </div>
        
        <div className={styles['masonry-grid']}>
        {images.map((img) => (
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
      </div>
    </>
  );
}