import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import appStyles from '../App.module.css';
import styles from './About.module.css';

export default function About() {
  return (
    <>
      <PageHero title="About Us" bgImage={bgImg} />
      <div className={`${appStyles.container} ${styles.aboutContainer}`}>
        <div className={styles.aboutContent}>
          <p>
            SriKshetra Anandavana Agadi is a renowned spiritual center committed to fostering devotion, 
            inner peace, and social welfare. Established with the vision of creating a sanctuary for seekers, 
            the center organizes daily rituals, spiritual discourses, and community service programs.
          </p>
          <p>
            Our mission is to guide individuals towards spiritual realization while actively contributing 
            to the betterment of society through charitable activities, educational support, and healthcare initiatives.
          </p>
          <p>
            We welcome people from all walks of life to visit, participate in our activities, and experience 
            the profound serenity and divine blessings of SriKshetra Anandavana Agadi.
          </p>
        </div>
      </div>
    </>
  );
}