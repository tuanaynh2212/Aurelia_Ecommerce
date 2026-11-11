import { useEffect } from "react";
import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { motion } from "framer-motion";
import { Container } from "../Components/layout/Container";
import { ShieldCheck, Leaf, Compass, Disc } from "lucide-react";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";
import { SceneShell } from "../Components/UI/three/SceneShell";
import { Vinyl } from "../Components/UI/three/Vinyl";
import { spatialActions } from "../Components/UI/three/SpatialStore";
import { SplitFlap } from "../Components/UI/primitives/SplitFlap";
import { DottedLeaderRow } from "../Components/UI/primitives/DottedLeaderRow";
import { Barcode } from "../Components/UI/primitives/Barcode";

export const About = () => {
  useEffect(() => {
    spatialActions.setStation("BACKSTAGE");
  }, []);

  const stats = [
    { label: "NĂM KHỞI LẬP", value: "2024" },
    { label: "DANH MỤC PHÁT HÀNH", value: "18+" },
    { label: "ĐƠN VỊ VẬN HÀNH", value: "25,000+" },
    { label: "TỈ LỆ HÀI LÒNG", value: "99.2%" },
  ];

  const values = [
    {
      icon: Compass,
      code: "SIDE A // 01",
      title: "Cấu Trúc Cắt May Chuẩn Xác",
      desc: "Tập trung vào đường cắt thực dụng, giữ phom dáng chuẩn mực qua nhiều chu kỳ giặt ủi và ứng dụng linh hoạt trong đời sống.",
    },
    {
      icon: Leaf,
      code: "SIDE A // 02",
      title: "Chất Liệu Dệt Tự Nhiên",
      desc: "Ưu tiên tỷ lệ sợi tự nhiên cao: 100% linen, combed cotton và lụa dệt mật độ cao. Kiểm định nguồn gốc sợi minh bạch.",
    },
    {
      icon: ShieldCheck,
      code: "SIDE B // 01",
      title: "Chính Sách Hậu Mãi Minh Bạch",
      desc: "Niêm yết thông số kích thước chính xác đến từng centimet, hỗ trợ đổi kích cỡ tận nơi trong 14 ngày không rào cản.",
    },
  ];

  return (
    <>
      <DynamicMetaTags
        title="Về Aurelia - Xưởng May & Nguyên Tắc Vận Hành"
        description="Thông tin về xưởng may, nguồn gốc nguyên liệu và tiêu chuẩn hoàn thiện sản phẩm tại Aurelia."
        url={window.location.href}
      />

      <div className="min-h-screen bg-bone text-ink flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 pb-20">
          {/* RECORD-SLEEVE HERO WITH SCROLL-LINKED 3D VINYL */}
          <section className="relative border-b-2 border-ink bg-paper overflow-hidden">
            <Container className="py-12 md:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="hud-chip bg-ink text-paper">
                      MANIFESTO · ATELIER NOTES
                    </span>
                    <span className="hud-chip bg-volt text-ink flex items-center gap-1.5">
                      <Disc size={12} /> 33⅓ RPM // STEREO PRESSING
                    </span>
                  </div>

                  <h1 className="display-l font-display-safe text-ink">
                    Xưởng May & Nguyên Tắc Hoàn Thiện
                  </h1>

                  <p className="font-sans text-base text-ink-muted leading-relaxed max-w-xl">
                    Tập trung vào chất lượng dệt vải, sự chính xác của thông số
                    may và sự trung thực trong từng mức giá niêm yết.
                  </p>

                  <div className="bg-bone border-2 border-ink p-4 max-w-xl space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-ink font-mono text-[10px] font-bold uppercase text-ink-muted">
                      <span>[LINER NOTES // SPEC SHEET]</span>
                      <span>CAT NO. AUR-LP-01</span>
                    </div>
                    {stats.map((s) => (
                      <DottedLeaderRow
                        key={s.label}
                        label={s.label}
                        value={s.value}
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="relative h-[380px] sm:h-[440px] bg-bone border-2 border-ink shadow-hard-lg overflow-hidden">
                    <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-ink text-paper font-mono text-[10px] font-bold uppercase">
                      [SIDE A // VINYL MASTER]
                    </div>
                    <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 bg-volt border border-ink text-ink font-mono text-[10px] font-bold uppercase">
                      SCROLL TO SPIN
                    </div>
                    <SceneShell
                      station="BACKSTAGE"
                      cameraPosition={[0, 0, 3.8]}
                      fallbackTitle="SIDE A // ATELIER"
                      className="w-full h-full"
                    >
                      <Vinyl scale={0.95} />
                    </SceneShell>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* SCOREBOARD STATS BAND */}
          <section className="bg-ink text-paper border-b-2 border-ink py-10">
            <Container>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-paper text-ink border-2 border-ink shadow-hard-flash p-5 flex flex-col justify-between"
                  >
                    <span className="font-mono text-[10px] font-bold text-ink-muted uppercase tracking-widest mb-2">
                      {s.label}
                    </span>
                    <SplitFlap value={s.value} size="md" />
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* RECORD SLEEVE GATEFOLD — OPERATING STANDARD & TOUR-DATE TIMELINE */}
          <section className="py-16 md:py-20 border-b-2 border-ink bg-bone">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-7 bg-paper border-2 border-ink shadow-hard p-8 flex flex-col justify-between">
                  <div>
                    <span className="mono-label text-[10px] text-flash mb-3 block">
                      [GATEFOLD // TIÊU CHUẨN VẬN HÀNH]
                    </span>
                    <h2 className="display-m font-display-safe text-ink mb-5">
                      Trang phục tốt không cần khẩu hiệu hoa mỹ. Giá trị nằm ở
                      kết cấu đường may và cảm giác trực tiếp trên làn da.
                    </h2>
                    <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
                      Aurelia xây dựng chuỗi cung ứng trực tiếp từ xưởng dệt tới
                      khách hàng, loại bỏ chi phí trung gian không cần thiết để
                      giữ trọn vẹn giá trị trên từng mét vải.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t-2 border-dashed border-ink flex items-center justify-between gap-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase text-ink block">
                        ATELIER DIRECT // ZERO MIDDLEMEN
                      </span>
                      <span className="font-mono text-[10px] text-ink-muted uppercase">
                        CALIBRATED QUALITY CONTROL
                      </span>
                    </div>
                    <Barcode value="AURELIA-MANIFESTO-2024" height={28} />
                  </div>
                </div>

                {/* TOUR-DATE / TRACKLIST TIMELINE */}
                <div className="lg:col-span-5 bg-paper border-2 border-ink shadow-hard p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-ink">
                      <span className="font-mono text-xs font-bold uppercase text-ink">
                        [TRACKLIST // PRODUCTION STAGES]
                      </span>
                      <span className="px-2 py-0.5 bg-volt border border-ink font-mono text-[10px] font-bold uppercase text-ink">
                        3 TRACKS
                      </span>
                    </div>

                    <div className="divide-y-2 divide-ink">
                      {values.map((v, idx) => (
                        <div key={v.title} className="py-4 flex items-start gap-4">
                          <span className="w-8 h-8 bg-ink text-paper font-mono text-xs font-bold flex items-center justify-center shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-[10px] font-bold uppercase text-flash block">
                              {v.code}
                            </span>
                            <h3 className="font-display-safe text-sm font-black uppercase text-ink">
                              {v.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-ink flex items-center justify-between font-mono text-[10px] font-bold uppercase text-ink-muted">
                    <span>[ATELIER-01]</span>
                    <span>OPTICAL RIG // VERIFIED</span>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* 3 CORE PRINCIPLES — CREDITS COLUMNS */}
          <section className="py-16 md:py-20 bg-paper">
            <Container>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-10 border-b-2 border-ink">
                <div>
                  <span className="mono-label text-[10px] text-flash mb-1 block">
                    [CREDITS // 3 NGUYÊN TẮC CỐT LÕI]
                  </span>
                  <h3 className="display-m font-display-safe text-ink">
                    Minh Bạch Trong Từng Công Đoạn
                  </h3>
                </div>
                <span className="hud-chip bg-bone text-ink self-start md:self-auto">
                  ADMIT ONE // ARCHIVE SPEC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {values.map((v, i) => {
                  const Icon = v.icon;
                  return (
                    <motion.div
                      key={v.title}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-bone p-6 border-2 border-ink shadow-hard flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                          <div className="w-11 h-11 border-2 border-ink bg-ink text-volt flex items-center justify-center">
                            <Icon size={20} />
                          </div>
                          <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 bg-paper border border-ink text-ink">
                            {v.code}
                          </span>
                        </div>
                        <h4 className="font-display-safe font-black uppercase text-lg text-ink">
                          {v.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-ink-muted font-sans leading-relaxed">
                          {v.desc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-dashed border-ink flex items-center justify-between font-mono text-[10px] font-bold uppercase text-ink">
                        <span>STATUS: CALIBRATED</span>
                        <span>[0{i + 1}/03]</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Container>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
