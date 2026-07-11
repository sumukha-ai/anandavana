import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './Gallery.module.css';

export default function Gallery() {
  const images = [
    { id: 1, src: "https://i.ibb.co/ynzXxDnY/AGADI-PH-CAM-15-1.jpg", title: "Temple View" },
    { id: 2, src: "https://i.ibb.co/SDj1pf9c/AGADI-PH-CAM-13-1.jpg", title: "Paatashaale" },
    { id: 3, src: "https://i.ibb.co/x87ryg06/AGADI-PH-CAM-9.jpg", title: "Devotee Gatherings" },
    { id: 4, src: "https://i.ibb.co/23mNPgvk/Copy-of-DSC08814.jpg", title: "Shri Chidambara Murthy Chakravarthi" },
    { id: 5, src: "https://i.ibb.co/chw2XQcX/DSC-1359.jpg", title: "Entrance" }
  ];

  return (
    <>
      <PageHero title="Photo Gallery" bgImage={bgImg} />
      <div className={styles['gallery-container']}>
        <div className={styles['gallery-header']}>
          <p>Glimpses of divine moments, celebrations, and serenity at Sri Kshetra Anandavana Agadi.</p>
        </div>
        
        <div className={styles['masonry-grid']}>
        {images.map((img) => (
          <div key={img.id} className={styles['masonry-item']}>
            <div className={styles['image-wrapper']}>
              <img src={img.src} alt={img.title} loading="lazy" />
              <div className={styles['image-overlay']}>
                <span className={styles['image-title']}>{img.title}</span>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}