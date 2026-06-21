import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import appStyles from '../App.module.css';
import styles from './Events.module.css';

export default function Events() {
  return (
    <>
      <PageHero title="Upcoming Events" bgImage={bgImg} />
      <div className={`${appStyles.container} ${styles.eventsContainer}`}>
        <div className={styles.placeholderBox}>
          <h2>Events calendar coming soon</h2>
          <p>This section will be updated with details of our upcoming festivals, satsangs, and special programs.</p>
        </div>
      </div>
    </>
  );
}