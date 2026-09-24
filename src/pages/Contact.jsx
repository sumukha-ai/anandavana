import PageHero from '../components/PageHero/PageHero';
import ContactSection from '../components/contact/ContactSection';
import bgImg from '../../assets/bg1.jpeg';
import { useI18n } from '../i18n/useI18n';

export default function Contact() {
  const { t } = useI18n('pages');

  return (
    <>
      <PageHero title={t('contactTitle')} bgImage={bgImg} />
      <ContactSection />
    </>
  );
}
