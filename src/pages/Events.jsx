import appStyles from '../App.module.css';
import styles from './Events.module.css';

export default function Events() {
  return (
    <div className={`${appStyles.container} ${styles.eventsContainer}`}>
      <h1 className={styles.eventsTitle}>Upcoming Events</h1>
      <div className={styles.placeholderBox}>
        <h2>Events calendar coming soon</h2>
        <p>This section will be updated with details of our upcoming festivals, satsangs, and special programs.</p>
      </div>
    </div>
  );
}