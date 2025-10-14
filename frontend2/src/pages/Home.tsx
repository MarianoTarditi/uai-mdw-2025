// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppSelector, useAppDispatch } from "../app/hooks";
import { CardFeature } from "../components/card/CardFeature";
import { Carrusel } from "../components/carrusel/Carrusel";
import { Contact } from "../components/contact/Contact";
import { Faq } from "../components/faq/Faq";
import { Footer } from "../components/footer/Footer";
import { LeadGrid } from "../components/grid/LeadGrid";
import { Hero } from "../components/hero/Hero";

function Home() {
  // const navigate = useNavigate();
  // const dispatch = useAppDispatch();

  // const { user } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate, dispatch]);

  return (
    <>
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
      <Faq/>
      <Footer />
    </>
  );
}

export default Home;
