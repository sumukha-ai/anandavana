import JourneyHero from "../components/JourneyHero/JourneyHero";
import ContactSection from "../components/contact/ContactSection";
import AboutSection from "../components/about_section/AboutSection";
import LineageSection from "../components/home/LineageSection";
import SevaInvitation from "../components/home/SevaInvitation";

export default function Home() {
  return (
    <>
      <JourneyHero />
      <AboutSection />
      <LineageSection />
      <SevaInvitation />
      <ContactSection />
    </>
  );
}
