import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUp, MessageCircle, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

import { HeroHangTag } from "../Components/hangtag/HeroHangTag";
import { BrandMarquee } from "../Components/HomeLayoutComponent/BrandMarquee";
import { Story } from "../Components/HomeLayoutComponent/Story";
import { Collection } from "../Components/HomeLayoutComponent/Collection";
import { ThisWeekWall } from "../Components/hangtag/ThisWeekWall";
import { PolicyStatement } from "../Components/hangtag/PolicyStatement";
import { LookOfTheWeek } from "../Components/hangtag/LookOfTheWeek";
import { NewInScroller } from "../Components/hangtag/NewInScroller";
import { SoundcheckConsole } from "../Components/hangtag/SoundcheckConsole";
import { PolicyStrip } from "../Components/hangtag/PolicyStrip";
import { HangTagFooter } from "../Components/hangtag/HangTagFooter";

import { SectionTitle } from "../Components/UI/primitives/SectionTitle";
import { Equalizer } from "../Components/UI/primitives/Meter";
import { Pass } from "../Components/UI/primitives/Pass";
import { Receipt, ReceiptRow } from "../Components/UI/primitives/Receipt";
import { Ticket } from "../Components/UI/primitives/Ticket";
import { Button } from "../Components/UI/primitives/Button";
import { SceneShell } from "../Components/UI/three/SceneShell";
import { FloatingTicket } from "../Components/UI/three/FloatingTicket";
import type { TierKey } from "../Components/UI/three/palette";

const LOYALTY_PASSES: {
  tier: TierKey;
  gate: string;
  title: string;
  points: string;
  perk1: string;
  perk2: string;
}[] = [
  {
    tier: "bronze",
    gate: "GATE 01",
    title: "BRONZE",
    points: "TIER 01",
    perk1: "Tích điểm đơn hàng",
    perk2: "Đổi trả 14 ngày",
  },
  {
    tier: "silver",
    gate: "GATE 02",
    title: "SILVER",
    points: "TIER 02",
    perk1: "Ưu đãi thành viên",
    perk2: "Tư vấn phom AI",
  },
  {
    tier: "gold",
    gate: "GATE 03",
    title: "GOLD",
    points: "TIER 03",
    perk1: "Ưu tiên đặt lịch",
    perk2: "Voucher theo mùa",
  },
  {
    tier: "diamond",
    gate: "GATE 04",
    title: "DIAMOND",
    points: "TIER 04",
    perk1: "May đo cá nhân",
    perk2: "Giao hàng ưu tiên",
  },
  {
    tier: "royal",
    gate: "GATE 05",
    title: "ROYAL",
    points: "TIER 05",
    perk1: "Đặc quyền Atelier",
    perk2: "Tư vấn 1-1 riêng biệt",
  },
];

export const Home = () => {
  const [isScroll, setIsScroll] = useState(false);
  const navigate = useNavigate();

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

      <div className="min-h-screen w-full relative bg-bone text-ink">
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
                className="press-collapse w-11 h-11 border-2 border-ink bg-paper text-ink shadow-hard-sm flex items-center justify-center hover:bg-volt cursor-pointer rounded-[2px]"
              >
                <ArrowUp size={18} strokeWidth={2.5} aria-hidden />
              </motion.button>
            )}
          </AnimatePresence>

          <button
            onClick={() => {
              const url = import.meta.env.VITE_URL_MESSENGER;
              if (url) window.open(`https://${url}`, "_blank");
            }}
            aria-label="Chat hỗ trợ qua Messenger"
            className="press-collapse w-11 h-11 border-2 border-ink bg-ink text-paper shadow-hard-flash flex items-center justify-center hover:bg-flash cursor-pointer rounded-[2px]"
          >
            <MessageCircle size={18} strokeWidth={2.5} aria-hidden />
          </button>
        </div>

        <Navbar />

        <main id="main-content">
          {/* S1 Hero Main Stage */}
          <HeroHangTag />

          {/* S2 Festival Lineup & Tour Dates */}
          <BrandMarquee />

          {/* S3 Backstage Reels (Camera Monitors) */}
          <Story />

          {/* S4 Headliner Setlist (Seasons & Vinyl Deck) */}
          <Collection />

          {/* S5 Merch Booth */}
          <ThisWeekWall />
          <PolicyStatement />
          <LookOfTheWeek />
          <NewInScroller />

          {/* S8 Soundcheck Mixing Console */}
          <SoundcheckConsole />

          {/* S9 Backstage VIP Passes */}
          <section
            aria-label="Backstage Loyalty Passes"
            className="border-b-[3px] border-ink bg-bone py-14 md:py-20"
          >
            <div className="container-atelier">
              <SectionTitle
                index="09"
                eyebrow="BACKSTAGE PASSES // VIP & ALL-ACCESS GATE"
                title="HẠNG THẺ THÀNH VIÊN"
                subtitle="Tích lũy điểm thưởng qua mỗi đơn hàng để mở khóa đặc quyền hậu trường từ Bronze đến Royal."
              />

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {LOYALTY_PASSES.map((item) => (
                  <div key={item.tier} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border-2 border-ink bg-ink px-2.5 py-1 mono-label text-[10px] font-extrabold text-paper">
                      <span className="text-volt">{item.gate}</span>
                      <span>ALL ACCESS</span>
                    </div>
                    <Pass
                      tier={item.tier}
                      title={item.title}
                      pointsLabel={item.points}
                      onSelect={() => navigate("/account")}
                    />
                    <Receipt
                      code={`[${item.title}]`}
                      title="QUYỀN LỢI"
                      className="text-xs"
                    >
                      <ReceiptRow label="01" value={item.perk1} />
                      <ReceiptRow label="02" value={item.perk2} />
                    </Receipt>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* S10 Box Office & Meet & Greet Finale */}
          <section
            aria-label="Meet & Greet Appointment CTA"
            className="border-b-[3px] border-ink bg-flash py-14 md:py-20 text-paper"
          >
            <div className="container-atelier">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <Ticket notchClassName="bg-flash" className="bg-paper text-ink">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="border-2 border-ink bg-volt px-2.5 py-0.5 mono-label text-xs font-extrabold text-ink">
                          [10 // BOX OFFICE · MEET &amp; GREET]
                        </span>
                        <span className="inline-flex items-center gap-2 mono-label text-xs font-extrabold text-ink-muted">
                          <Equalizer bars={4} className="h-3.5" />
                          VIP PASS · ADMIT ONE
                        </span>
                      </div>
                      <h2 className="display-l font-display-safe text-ink">
                        ĐẶT LỊCH THỬ ĐỒ &amp; MAY ĐO TẠI BOUTIQUE
                      </h2>
                      <p className="text-base text-ink-muted">
                        Chọn cửa hàng, khung giờ và dịch vụ tư vấn 1-1 riêng biệt cùng stylist &amp; thợ may tại trạm Aurelia.
                      </p>
                      <div className="pt-2">
                        <Button
                          variant="primary"
                          size="lg"
                          onClick={() => navigate("/Fashion/Products")}
                          iconLeft={<CalendarCheck size={18} strokeWidth={2.5} />}
                        >
                          Chọn sản phẩm &amp; Đặt lịch hẹn
                        </Button>
                      </div>
                    </div>
                  </Ticket>
                </div>

                <div className="flex flex-col border-[3px] border-ink bg-ink shadow-hard-lg lg:col-span-5 rounded-[2px] overflow-hidden">
                  <div className="flex items-center justify-between border-b-2 border-paper/30 bg-ink px-3.5 py-2 mono-label text-[10px] font-extrabold text-volt">
                    <span>[TICKET DISPENSER // VIP PASS]</span>
                    <span className="text-paper">STAGE ACCESS</span>
                  </div>
                  <div className="stage-grid-dark relative h-[260px] w-full">
                    <SceneShell
                      station="BACKSTAGE"
                      cameraPosition={[0, 0, 3.6]}
                      fallbackTitle="ADMIT ONE"
                    >
                      <FloatingTicket scale={1.15} tone="volt" />
                    </SceneShell>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <PolicyStrip />
        </main>

        <HangTagFooter />
      </div>
    </>
  );
};

export default Home;
