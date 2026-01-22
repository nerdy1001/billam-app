import Faq from "../_components/landing/faq";
import Features from "../_components/landing/features";
import Footer from "../_components/landing/footer";
import Header from "../_components/landing/header";
import Hero from "../_components/landing/hero";
import Testimonials from "../_components/landing/testimonials";

export default function Home() {
  return (
    <div className="bg-[#ffffff] text-gray-600">
      <Header />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faq />
        <Footer />
      </main>
    </div>
  );
}