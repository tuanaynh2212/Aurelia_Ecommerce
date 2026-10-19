import { Navbar } from "../Components/HomeLayoutComponent/Navbar";
import { Footer } from "../Components/HomeLayoutComponent/Footer";
import { motion } from "framer-motion";
import { Container } from "../Components/layout/Container";
import { ShieldCheck, Leaf, Compass } from "lucide-react";
import { DynamicMetaTags } from "../Components/SEO/DynamicMetaTags";

export const About = () => {
  const stats = [
    { label: "NĂM KHỞI LẬP", value: "2024" },
    { label: "DANH MỤC PHÁT HÀNH", value: "18+" },
    { label: "ĐƠN VỊ VẬN HÀNH", value: "25,000+" },
    { label: "TỈ LỆ HÀI LÒNG", value: "99.2%" },
  ];

  const values = [
    {
      icon: Compass,
      title: "Cấu Trúc Cắt May Chuẩn Xác",
      desc: "Tập trung vào đường cắt thực dụng, giữ phom dáng chuẩn mực qua nhiều chu kỳ giặt ủi và ứng dụng linh hoạt trong đời sống.",
    },
    {
      icon: Leaf,
      title: "Chất Liệu Dệt Tự Nhiên",
      desc: "Ưu tiên tỷ lệ sợi tự nhiên cao: 100% linen, combed cotton và lụa dệt mật độ cao. Kiểm định nguồn gốc sợi minh bạch.",
    },
    {
      icon: ShieldCheck,
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

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] flex flex-col">
        <Navbar />

        <main id="main-content" className="flex-1 pb-20">
          {/* Hero Banner */}
          <section className="relative min-h-[380px] md:min-h-[440px] flex items-center justify-center text-center overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-rule)]">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1600&q=80&auto=format&fit=crop"
                alt="Aurelia Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[var(--color-ink)]/70" />
            </div>

            <Container className="relative z-10 text-[var(--color-bg)] max-w-3xl py-16">
              <div className="inline-block border border-[var(--color-bg)]/40 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--color-bg)] mb-4">
                MANIFESTO · ATELIER NOTES
              </div>
              <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-4 tracking-tight">
                Xưởng May & Nguyên Tắc Hoàn Thiện
              </h1>
              <p className="text-sm sm:text-base text-[var(--color-bg)]/90 leading-relaxed font-body max-w-xl mx-auto">
                Tập trung vào chất lượng dệt vải, sự chính xác của thông số may và sự trung thực trong từng mức giá niêm yết.
              </p>
            </Container>
          </section>

          {/* Mission & Philosophy */}
          <section className="py-16 md:py-20 border-b border-[var(--color-rule)]">
            <Container className="max-w-3xl text-center">
              <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-3 block">
                TIÊU CHUẨN VẬN HÀNH
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] leading-snug mb-5">
                Trang phục tốt không cần khẩu hiệu hoa mỹ. Giá trị nằm ở kết cấu đường may và cảm giác trực tiếp trên làn da.
              </h2>
              <p className="text-sm sm:text-base text-[var(--color-ink-muted)] font-body leading-relaxed">
                Aurelia xây dựng chuỗi cung ứng trực tiếp từ xưởng dệt tới khách hàng, loại bỏ chi phí trung gian không cần thiết để giữ trọn vẹn giá trị trên từng mét vải.
              </p>
            </Container>
          </section>

          {/* Stats Grid */}
          <section className="bg-[var(--color-surface)] border-b border-[var(--color-rule)]">
            <Container>
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--color-rule)] text-center">
                {stats.map((s) => (
                  <div key={s.label} className="py-8 px-4">
                    <div className="text-2xl sm:text-3xl font-heading font-bold text-[var(--color-ink)] tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--color-ink-muted)] mt-1.5 uppercase tracking-wider">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* Core Values */}
          <section className="py-16 md:py-20">
            <Container>
              <div className="text-center max-w-xl mx-auto mb-12">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink-muted)] mb-2 block">
                  3 NGUYÊN TẮC CỐT LÕI
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-[var(--color-ink)] uppercase tracking-wide">
                  Minh Bạch Trong Từng Công Đoạn
                </h3>
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
                      className="bg-[var(--color-surface)] p-6 border border-[var(--color-rule)] space-y-3"
                    >
                      <div className="w-10 h-10 border border-[var(--color-rule)] bg-[var(--color-bg)] text-[var(--color-accent)] flex items-center justify-center">
                        <Icon size={18} />
                      </div>
                      <h4 className="font-heading font-bold text-base text-[var(--color-ink)]">
                        {v.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] font-body leading-relaxed">
                        {v.desc}
                      </p>
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
