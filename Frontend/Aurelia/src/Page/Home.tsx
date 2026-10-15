import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { HeroBanner } from "../Components/HomeLayoutComponent/HeroBanner";
import { BrandMarquee } from "../Components/HomeLayoutComponent/BrandMarquee";
import { HotProducts } from "../Components/HomeLayoutComponent/HotProducts";
import { DiscountProducts } from "../Components/HomeLayoutComponent/DiscountProducts";
import { DanhMucSanPham } from "../Components/HomeLayoutComponent/DanhMucSanPham";
import { Story } from "../Components/HomeLayoutComponent/Story";
import { Collection } from "../Components/HomeLayoutComponent/Collection";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const Home = () => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <DynamicMetaTags
        title="Aurelia — Thời Trang & Phong Cách Sống"
        description="Thời trang hiện đại, ấm áp và phong cách tại Aurelia. AI đo số đo thông minh, gợi ý size chính xác."
        keywords="thời trang, mua sắm online, quần áo, fashion, AI đo số đo, Aurelia"
        url={window.location.href}
      />

      <div className="min-h-screen w-full relative bg-[var(--color-bg)] text-[var(--color-ink)]">

        {/* Floating utilities */}
        <div className="fixed right-4 bottom-5 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {isScroll && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={scrollToTop}
                aria-label="Về đầu trang"
                className="w-9 h-9 border border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-ink)] flex items-center justify-center hover:bg-[var(--color-surface)] transition-colors cursor-pointer"
              >
                <ArrowUp size={16} />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              const url = import.meta.env.VITE_URL_MESSENGER;
              if (url) window.open(`https://${url}`, "_blank");
            }}
            aria-label="Chat hỗ trợ qua Messenger"
            className="w-10 h-10 bg-[var(--color-accent)] text-white flex items-center justify-center hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
          >
            <MessageCircle size={20} />
          </button>
        </div>

        {/* Layout */}
        <Navbar />

        <main id="main-content">
          <HeroBanner />
          <BrandMarquee />
          <DanhMucSanPham />
          <HotProducts />
          <DiscountProducts />
          <Story />
          <Collection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;
