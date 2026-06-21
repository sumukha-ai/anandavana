import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './Gallery.module.css';

export default function Gallery() {
  const images = [
    { id: 1, src: "https://images.unsplash.com/photo-1545620986-e2a1491cf2d6?auto=format&fit=crop&q=80&w=800", title: "Temple View" },
    { id: 2, src: "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&q=80&w=800", title: "Rituals & Ceremonies" },
    { id: 3, src: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800", title: "Devotee Gatherings" },
    { id: 4, src: "https://images.unsplash.com/photo-1582260655648-52fb58f6ec0e?auto=format&fit=crop&q=80&w=800", title: "Evening Lamps" },
    { id: 5, src: "https://images.unsplash.com/photo-1601614213425-45ea0553bb89?auto=format&fit=crop&q=80&w=800", title: "Tranquil Surroundings" }
  ];

  return (
    <>
      <PageHero title="Photo Gallery" bgImage={bgImg} />
      <div className={styles['gallery-container']}>
        <div className={styles['gallery-header']}>
          <p>Glimpses of divine moments, celebrations, and serenity at SriKshetra Anandavana Agadi.</p>
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