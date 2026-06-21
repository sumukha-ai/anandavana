import React from "react";
import Hero from "../components/Hero/Hero";
import AboutSection from "../components/about_section/AboutSection";
import ContactSection from "../components/contact/ContactSection";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <ContactSection />
    </>
  );
}