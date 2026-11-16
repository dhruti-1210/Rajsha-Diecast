import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BrandStrip from '@/components/BrandStrip';
import BrandsSection from '@/components/BrandsSection';
import BudgetSection from '@/components/BudgetSection';
import ProductSection from '@/components/ProductSection';
import { Grading, Reviews } from '@/components/Sections';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import ProductModal from '@/components/ProductModal';
import ScrollFX from '@/components/ScrollFX';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BrandStrip />
        <BrandsSection />
        <BudgetSection />
        <ProductSection id="featured" mode="featured" />
        <ProductSection id="arrivals" mode="new" dark />
        <Grading />
        <Stats />
        <Reviews />
      </main>
      <Footer />
      <CartDrawer />
      <ProductModal />
      <ScrollFX />
    </>
  );
}
