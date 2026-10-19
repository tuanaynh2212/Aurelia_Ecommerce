import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

import { HeroHangTag }      from "../Components/hangtag/HeroHangTag";
import { ThisWeekWall }     from "../Components/hangtag/ThisWeekWall";
import { PolicyStatement }  from "../Components/hangtag/PolicyStatement";
import { LookOfTheWeek }    from "../Components/hangtag/LookOfTheWeek";
import { NewInScroller }    from "../Components/hangtag/NewInScroller";
import { PolicyStrip }      from "../Components/hangtag/PolicyStrip";
import { HangTagFooter }    from "../Components/hangtag/HangTagFooter";

export const Home = () => {
  const [isScroll, setIsScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <DynamicMetaTags
        title="Aurellia — Quần áo may đo chuẩn xác, giá niêm yết minh bạch"
        description="Thời trang Việt phom chuẩn. Mọi thông số chất liệu, kích thước và giá được in trực tiếp trên mác sản phẩm. Đổi trả miễn phí 14 ngày."
        keywords="thời trang, quần áo may đo, mua sắm online, đổi trả miễn phí, hang tag, Aurellia"
        url={typeof window !== "undefined" ? window.location.href : ""}
      />

      <div
        className="min-h-screen w-full relative"
        style={{ background: "var(--color-paper)", color: "var(--color-ink)" }}
      >
        <div className="fixed right-4 bottom-5 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {isScroll && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={scrollToTop}
                aria-label="Về đầu trang"
                className="w-9 h-9 border border-[var(--color-rule)] bg-paper text-ink flex items-center justify-center hover:bg-kraft transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt"
                style={{ borderRadius: 0 }}
              >
                <ArrowUp size={16} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              const url = import.meta.env.VITE_URL_MESSENGER;
              if (url) window.open(`https://${url}`, "_blank");
            }}
            aria-label="Chat hỗ trợ qua Messenger"
            className="w-10 h-10 bg-ink text-paper flex items-center justify-center hover:bg-cobalt transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-1"
            style={{ borderRadius: 0 }}
          >
            <MessageCircle size={18} aria-hidden />
          </button>
        </div>

        <Navbar />

        <main id="main-content">
          <HeroHangTag />
          <ThisWeekWall />
          <PolicyStatement />
          <LookOfTheWeek />
          <NewInScroller />
          <PolicyStrip />
        </main>

        <HangTagFooter />
      </div>
    </>
  );
};

export default Home;
