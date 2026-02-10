import { CardFeature } from "../components/public/card/CardFeature";
import { Carrusel } from "../components/public/carrusel/Carrusel";
import { Contact } from "../components/public/contact/Contact";
import { Faq } from "../components/public/faq/Faq";
import { Footer } from "../components/public/footer/Footer";
import { LeadGrid } from "../components/public/grid/LeadGrid";
import { Header } from "../components/public/header/Header";
import { Hero } from "../components/public/hero/Hero";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <section className="section">
        <CardFeature />
        <section className="section">
          <LeadGrid>
            <Carrusel />
          </LeadGrid>
        </section>
        <Contact />
      </section>
      <Faq />
      <Footer />
    </>
  );
}

export default Home;
