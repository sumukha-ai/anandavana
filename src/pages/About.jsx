import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import appStyles from '../App.module.css';
import styles from './About.module.css';
import { useI18n } from '../i18n/useI18n';
import { LotusRule } from '../components/ornaments/Ornaments';

export default function About() {
  const { t, lang } = useI18n('pages');
  const paragraphs = t('aboutBody', []);
  const [lead, ...rest] = paragraphs;

  return (
    <>
      <PageHero title={t('aboutTitle')} bgImage={bgImg} />
      <section className={styles.aboutPage}>
        <div className={`${appStyles.container} ${appStyles.pageBody}`}>
          <article className={styles.aboutContent} lang={lang}>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
            {rest.length > 0 ? <LotusRule className={styles.rule} /> : null}
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className={styles.paragraph}>{paragraph}</p>
            ))}
            <LotusRule className={styles.closingRule} />
          </article>
        </div>
      </section>
    </>
  );
}
