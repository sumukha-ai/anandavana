import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import appStyles from '../App.module.css';
import styles from './About.module.css';
import { useI18n } from '../i18n/useI18n';

export default function About() {
  const { t, lang } = useI18n('pages');
  const paragraphs = t('aboutBody', []);

  return (
    <>
      <PageHero title={t('aboutTitle')} bgImage={bgImg} />
      <div className={`${appStyles.container} ${appStyles.pageBody}`}>
        <div className={styles.aboutContent} lang={lang}>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </>
  );
}
