import Hero from "../components/Hero/Hero";
import JourneyHero from "../components/JourneyHero/JourneyHero";
import AboutSection from "../components/about_section/AboutSection";
import ContactSection from "../components/contact/ContactSection";

export default function Home() {
  return (
    <>
    <JourneyHero />
      {/* <Hero />
      <AboutSection /> */}
      <ContactSection />
    </>
  );
}