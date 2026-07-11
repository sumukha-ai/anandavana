import JourneyHero from "../components/JourneyHero/JourneyHero";
import ContactSection from "../components/contact/ContactSection";
import AboutSection from "../components/about_section/AboutSection";

export default function Home() {
  return (
    <>
    <JourneyHero />
    <AboutSection />
    {/* <AboutAnandavana /> */}
    <ContactSection />
    </>
  );
}
