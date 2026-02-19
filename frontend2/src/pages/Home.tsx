import { CardFeature } from "../components/public/card/CardFeature";
import { Contact } from "../components/public/contact/Contact";
import { Faq } from "../components/public/faq/Faq";
import { Footer } from "../components/public/footer/Footer";
import { Header } from "../components/public/header/Header";
import { Hero } from "../components/public/hero/Hero";
import { TercerHero } from "../components/public/tercerHero/tercerHero";
import { ScrollAnimation } from "../components/public/scrollAnimation/ScrollAnimation";

function Home() {
  return (
    <>
      <Header />
      <section id="inicio" aria-label="Sección de inicio">
        <ScrollAnimation animation="fadeInUp" delay={0.1}>
          <Hero />
        </ScrollAnimation>
      </section>
      <section id="planes" aria-label="Sección de planes de entrenamiento">
        <ScrollAnimation animation="fadeInUp" delay={0.1}>
          <CardFeature />
        </ScrollAnimation>
      </section>
      <section id="instalaciones" aria-label="Sección de instalaciones">
        <ScrollAnimation animation="fadeInUp" delay={0.2}>
          <TercerHero />
        </ScrollAnimation>
      </section>

      <ScrollAnimation animation="fadeInUp" delay={0.2}>
        <Faq />
      </ScrollAnimation>

      <section id="contact" aria-label="Sección de contacto">
        <ScrollAnimation animation="fadeInUp" delay={0.2}>
          <Contact />
        </ScrollAnimation>
      </section>
      <Footer />
    </>
  );
}

export default Home;
