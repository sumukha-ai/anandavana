import JourneyHero from "../components/JourneyHero/JourneyHero";
import AboutAnandavana from "../components/aboutAnandavana/AboutAnandavana";
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
