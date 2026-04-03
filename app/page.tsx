import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import ResortsSection from "@/components/ResortCard";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <NavBar />
      <HeroSection />
      <ResortsSection />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </main>
  );
}
